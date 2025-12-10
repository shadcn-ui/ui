# Connecting to Ocean ERP Database with DBeaver

## DBeaver Connection Setup

DBeaver is an excellent database administration tool that will allow you to browse, query, and manage your Ocean ERP PostgreSQL database with a graphical interface.

### Prerequisites

1. **Download and Install DBeaver**
   - Visit: https://dbeaver.io/download/
   - Download DBeaver Community Edition (free)
   - Install the application

2. **Ensure PostgreSQL is Running**
   ```bash
   brew services list | grep postgresql
   # Should show: postgresql@14  started
   
   # If not running, start it:
   brew services start postgresql@14
   ```

### Connection Configuration

Use these exact settings when creating a new connection in DBeaver:

#### **Basic Settings**
- **Database Type**: PostgreSQL
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `ocean-erp`
- **Username**: `mac` (your macOS username)
- **Password**: (leave empty)

#### **Step-by-Step Connection Guide**

1. **Open DBeaver**
   - Launch DBeaver application

2. **Create New Connection**
   - Click the "New Database Connection" button (plug icon)
   - Or go to Database → New Database Connection

3. **Select PostgreSQL**
   - Choose "PostgreSQL" from the database list
   - Click "Next"

4. **Enter Connection Details**
   ```
   Server Host: localhost
   Port: 5432
   Database: ocean-erp
   Username: mac
   Password: (leave blank)
   ```

5. **Test Connection**
   - Click "Test Connection" button
   - If successful, you should see "Connected" message
   - If it fails, see troubleshooting section below

6. **Advanced Settings (Optional)**
   - Go to "Driver properties" tab
   - You can leave defaults as they are

7. **Finish Setup**
   - Click "Finish" to create the connection

### Expected Database Structure

Once connected, you should see these schemas and tables:

```
ocean-erp
├── public (schema)
│   ├── Tables (27 total)
│   │   ├── 👥 Users & Authentication
│   │   │   └── users
│   │   ├── 💼 Sales Module
│   │   │   ├── leads
│   │   │   ├── lead_sources
│   │   │   ├── lead_statuses
│   │   │   ├── opportunities
│   │   │   └── customers
│   │   ├── 📦 Product Module
│   │   │   ├── products
│   │   │   ├── product_categories
│   │   │   ├── inventory_locations
│   │   │   └── inventory_movements
│   │   ├── ⚙️ Operations Module
│   │   │   ├── suppliers
│   │   │   ├── purchase_orders
│   │   │   ├── purchase_order_items
│   │   │   ├── sales_orders
│   │   │   └── sales_order_items
│   │   ├── 💰 Accounting Module
│   │   │   ├── accounts
│   │   │   ├── journal_entries
│   │   │   ├── journal_entry_lines
│   │   │   ├── invoices
│   │   │   ├── invoice_items
│   │   │   └── payments
│   │   └── 👨‍💼 HRIS Module
│   │       ├── departments
│   │       ├── job_positions
│   │       ├── employees
│   │       ├── time_entries
│   │       ├── payroll_periods
│   │       └── payroll_records
│   └── Views, Functions, etc.
```

### Sample Queries to Try

Once connected, you can run these queries to explore your data:

#### **View All Leads with Related Data**
```sql
SELECT 
    l.first_name,
    l.last_name,
    l.email,
    l.company,
    ls.name as source,
    lst.name as status,
    u.first_name || ' ' || u.last_name as assigned_to,
    l.estimated_value,
    l.created_at
FROM leads l
LEFT JOIN lead_sources ls ON l.source_id = ls.id
LEFT JOIN lead_statuses lst ON l.status_id = lst.id
LEFT JOIN users u ON l.assigned_to = u.id
ORDER BY l.created_at DESC;
```

#### **Lead Status Summary**
```sql
SELECT 
    lst.name as status,
    COUNT(l.id) as lead_count,
    SUM(l.estimated_value) as total_value
FROM lead_statuses lst
LEFT JOIN leads l ON lst.id = l.status_id
GROUP BY lst.id, lst.name, lst.sort_order
ORDER BY lst.sort_order;
```

#### **Product Inventory Summary**
```sql
SELECT 
    p.sku,
    p.name,
    pc.name as category,
    p.current_stock,
    p.min_stock_level,
    p.unit_price,
    (p.current_stock * p.unit_price) as inventory_value
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
ORDER BY p.name;
```

### DBeaver Features to Explore

1. **ER Diagram**
   - Right-click on your database
   - Select "View Diagram"
   - This will show relationships between tables

2. **Data Editor**
   - Double-click any table to view/edit data
   - Use filters and sorting

3. **SQL Editor**
   - Create new SQL scripts
   - Execute queries with syntax highlighting

4. **Data Export/Import**
   - Export data to various formats (CSV, Excel, etc.)
   - Import data from files

5. **Database Navigator**
   - Browse all database objects
   - View table structures and constraints

### Troubleshooting

#### **Connection Refused Error**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql@14

# Check if database exists
psql -l | grep ocean-erp
```

#### **Authentication Failed**
- Ensure username is your macOS username (usually `mac`)
- Leave password field empty for local development
- Check PostgreSQL authentication configuration if needed

#### **Database Does Not Exist**
```bash
# Recreate database if needed
createdb ocean-erp

# Re-run schema and seed files
psql -d ocean-erp -f database/01_create_tables.sql
psql -d ocean-erp -f database/02_seed_data.sql
```

#### **Driver Issues**
- DBeaver will automatically download PostgreSQL drivers
- If issues persist, try updating DBeaver to the latest version

### Security Notes

- This setup is for local development only
- For production, implement proper authentication
- Consider using connection encryption (SSL) for production databases

### Useful DBeaver Shortcuts

- `Ctrl+Enter` - Execute current statement
- `Ctrl+Shift+Enter` - Execute all statements
- `F4` - Open table properties
- `F5` - Refresh
- `Ctrl+T` - New SQL tab

Enjoy exploring your Ocean ERP database with DBeaver! 🎉