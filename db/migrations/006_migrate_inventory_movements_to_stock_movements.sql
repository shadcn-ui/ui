-- Migration: Copy rows from inventory_movements -> stock_movements
-- Date: 2025-12-11
-- Copies historical rows from legacy `inventory_movements` into `stock_movements`.
-- Uses a dedupe by setting `reference_type='inventory_movement'` and `reference_id=im.id`.

BEGIN;

-- Insert rows that have not yet been copied
INSERT INTO stock_movements (
  id,
  product_id,
  warehouse_id,
  movement_type,
  quantity,
  unit_cost,
  total_value,
  balance_before,
  balance_after,
  batch_number,
  serial_numbers,
  reference_type,
  reference_id,
  reference_number,
  from_location_id,
  to_location_id,
  notes,
  created_by,
  movement_date,
  created_at,
  updated_at
)
SELECT
  -- preserve original id for traceability
  im.id::uuid AS id,
  im.product_id::uuid AS product_id,
  -- Try to map inventory_locations.name -> warehouses.warehouse_name to get warehouse id
  (SELECT w.id FROM warehouses w WHERE w.warehouse_name = il.name LIMIT 1) AS warehouse_id,
  im.movement_type,
  im.quantity,
  im.unit_cost,
  (COALESCE(im.quantity,0) * COALESCE(im.unit_cost,0))::numeric(18,4) AS total_value,
  NULL::integer AS balance_before,
  NULL::integer AS balance_after,
  NULL::varchar AS batch_number,
  NULL::text AS serial_numbers,
  'inventory_movement' AS reference_type,
  im.id::uuid AS reference_id,
  NULL::varchar AS reference_number,
  -- attempt to map location_id (uuid) to warehouse_locations -> warehouses id (integer)
  (SELECT wl.id FROM warehouse_locations wl WHERE wl.id::text = im.location_id::text LIMIT 1) AS from_location_id,
  NULL::integer AS to_location_id,
  im.notes,
  im.created_by::uuid AS created_by,
  im.created_at AS movement_date,
  im.created_at AS created_at,
  im.created_at AS updated_at
FROM inventory_movements im
LEFT JOIN inventory_locations il ON il.id = im.location_id
WHERE NOT EXISTS (
  SELECT 1 FROM stock_movements sm
  WHERE sm.reference_type = 'inventory_movement' AND sm.reference_id = im.id
);

COMMIT;
