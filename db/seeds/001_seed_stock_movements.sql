-- Seed: Sample stock_movements for UI testing
-- Inserts a few realistic stock movement rows using the first product, warehouse and user found in the DB.

INSERT INTO stock_movements (
  product_id, warehouse_id, movement_type, quantity, unit_cost, total_value, balance_before, balance_after, notes, created_by, movement_date, created_at, updated_at, reference_type, reference_id
)
SELECT
  (SELECT id FROM products LIMIT 1) AS product_id,
  (SELECT id FROM warehouses LIMIT 1) AS warehouse_id,
  mv.mtype,
  mv.qty,
  mv.unit_cost,
  (mv.qty * mv.unit_cost)::numeric(18,4) AS total_value,
  NULL::integer AS balance_before,
  NULL::integer AS balance_after,
  mv.notes,
  (SELECT id FROM users LIMIT 1) AS created_by,
  NOW() - (mv.days_ago || ' days')::interval AS movement_date,
  NOW() - (mv.days_ago || ' days')::interval AS created_at,
  NOW() - (mv.days_ago || ' days')::interval AS updated_at,
  'seed'::varchar AS reference_type,
  NULL::uuid AS reference_id
FROM (
  VALUES
    ('Receipt', 50, 5.00, 'Initial receipt', 5),
    ('Shipment', 10, 5.00, 'Customer order shipped', 4),
    ('Adjustment', 2, 5.00, 'Manual correction', 3),
    ('Transfer In', 20, 5.00, 'Transferred from other warehouse', 2),
    ('Transfer Out', 5, 5.00, 'Transferred out', 1)
 ) AS mv(mtype, qty, unit_cost, notes, days_ago)
;