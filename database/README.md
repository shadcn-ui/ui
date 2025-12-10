# Ocean ERP Database Setup

This document describes the PostgreSQL database setup for the Ocean ERP system.

## Database Information

- **Database Name**: ocean-erp
- **DBMS**: PostgreSQL 14.19
- **Host**: localhost
- **Port**: 5432
- **User**: mac (your system user)

## Database Schema

The Ocean ERP database is designed to support a complete enterprise resource planning system with the following modules:

### Core Modules

1. **Sales Module**
   - Leads management with sources and statuses
   - Opportunities tracking
   - Customer relationship management

2. **Product Module**
   - Product catalog with categories
   - Inventory management
   - Stock tracking and movements

3. **Operations Module**
   - Supplier management
   - Purchase orders and receiving
   - Sales orders and fulfillment

4. **Accounting Module**
   - Chart of accounts
   - Journal entries and general ledger
   - Invoicing and payments

5. **HRIS Module**
   - Employee management
   - Department and position tracking
   - Time tracking and payroll

## Database Files

- `01_create_tables.sql` - Complete database schema with all tables, indexes, and triggers
- `02_seed_data.sql` - Initial seed data for lookup tables and sample records
- `test-connection.js` - Database connection test script

## Quick Setup

1. **Install PostgreSQL**:
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create Database**:
   ```bash
   createdb ocean-erp
   ```

3. **Run Schema Creation**:
   ```bash
   psql -d ocean-erp -f database/01_create_tables.sql
   ```

4. **Load Seed Data**:
   ```bash
   psql -d ocean-erp -f database/02_seed_data.sql
   ```

5. **Test Connection**:
   ```bash
   node database/test-connection.js
   ```

## Database Tables

### Sales Tables
- `leads` - Lead information and tracking
- `lead_sources` - Lead source lookup (Website, Referral, etc.)
- `lead_statuses` - Lead status lookup (New, Contacted, etc.)
- `opportunities` - Sales opportunities
- `customers` - Customer master data

### Product Tables
- `products` - Product master data
- `product_categories` - Product categorization
- `inventory_locations` - Warehouse/location master
- `inventory_movements` - Stock movements and transactions

### Operations Tables
- `suppliers` - Supplier master data
- `purchase_orders` - Purchase order headers
- `purchase_order_items` - Purchase order line items
- `sales_orders` - Sales order headers
- `sales_order_items` - Sales order line items

### Accounting Tables
- `accounts` - Chart of accounts
- `journal_entries` - Journal entry headers
- `journal_entry_lines` - Journal entry line items
- `invoices` - Customer invoices
- `invoice_items` - Invoice line items
- `payments` - Payment records

### HRIS Tables
- `users` - System users
- `departments` - Department master
- `job_positions` - Job position definitions
- `employees` - Employee master data
- `time_entries` - Time tracking records
- `payroll_periods` - Payroll period definitions
- `payroll_records` - Employee payroll records

## Sample Data

The database comes pre-populated with:
- 9 lead sources (Website, Referral, LinkedIn, etc.)
- 6 lead statuses (New, Contacted, Qualified, etc.)
- 10 sample users including sales reps and managers
- 7 departments (Sales, Product, Operations, etc.)
- 5 product categories
- 3 inventory locations
- Complete chart of accounts structure
- 10 sample leads with realistic data
- 11 sample products
- 5 sample customers
- 14 job positions

## Environment Configuration

Add these variables to your `.env.local` file:

```env
# Database Configuration
DATABASE_URL="postgresql://mac@localhost:5432/ocean-erp"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="ocean-erp"
DB_USER="mac"
DB_PASSWORD=""
```

## Security Notes

- The current setup uses local PostgreSQL with no password for development
- For production, implement proper authentication and SSL
- Use environment variables for sensitive configuration
- Consider connection pooling for high-traffic applications

## Performance Features

- Indexes on frequently queried columns
- UUID primary keys for scalability
- Automatic timestamp updates via triggers
- Proper foreign key relationships for data integrity
- Generated columns for calculated values

## Next Steps

1. Integrate with Next.js application using pg library
2. Implement proper authentication and authorization
3. Add data validation and business rules
4. Create backup and restore procedures
5. Set up monitoring and logging

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL service is running: `brew services list`
- Check database exists: `psql -l | grep ocean-erp`
- Verify user permissions: `psql -d ocean-erp -c "\du"`

### Data Issues
- Check table existence: `psql -d ocean-erp -c "\dt"`
- Verify data: `psql -d ocean-erp -c "SELECT COUNT(*) FROM leads;"`
- Reset data: Re-run seed data script

### Performance Issues
- Check active connections: `psql -d ocean-erp -c "SELECT * FROM pg_stat_activity;"`
- Analyze query performance: Use `EXPLAIN ANALYZE` in psql
- Monitor table sizes: `psql -d ocean-erp -c "\dt+"`