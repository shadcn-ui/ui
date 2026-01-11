# Ocean ERP - Sales & CRM User Guide 📊

**Version:** 4.0  
**Module:** Sales & Customer Relationship Management  
**Last Updated:** December 5, 2025  
**Audience:** Sales Teams, Account Managers, Sales Managers

---

## 📋 Table of Contents

1. [Module Overview](#module-overview)
2. [Leads Management](#leads-management)
3. [Opportunities & Pipeline](#opportunities--pipeline)
4. [Contacts & Companies](#contacts--companies)
5. [Quotations](#quotations)
6. [Sales Orders](#sales-orders)
7. [Customer Portal](#customer-portal)
8. [Analytics & Reports](#analytics--reports)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Module Overview

### What is Sales & CRM?

The Sales & CRM module helps you:
- Track leads from first contact to closed deals
- Manage customer relationships
- Create and send quotations
- Process sales orders
- Analyze sales performance
- Forecast revenue

### Key Features

**Lead Management:**
- ✅ Capture leads from multiple sources
- ✅ Score and qualify leads
- ✅ Automated lead assignment
- ✅ Lead nurturing workflows

**Opportunity Tracking:**
- ✅ Visual sales pipeline
- ✅ Stage-based workflow
- ✅ Win/loss analysis
- ✅ Revenue forecasting

**Customer Management:**
- ✅ 360° customer view
- ✅ Interaction history
- ✅ Segmentation
- ✅ Loyalty tracking

**Quotation & Orders:**
- ✅ Professional quote templates
- ✅ Product catalog integration
- ✅ Approval workflows
- ✅ Order tracking

### Access the Module

**URL:** `http://localhost:4000/erp/sales`

**Navigation:**
- Top menu → **Sales**
- Dashboard → **Sales** widget
- Quick search → type "sales"

---

## 🎯 Leads Management

### What is a Lead?

A **lead** is a potential customer who has shown interest in your products or services but hasn't been qualified yet.

### Lead Sources

Leads can come from:
- 🌐 Website forms
- 📧 Email campaigns
- 📞 Phone calls
- 🏢 Trade shows
- 🤝 Referrals
- 📱 Social media
- 🎯 Marketing campaigns

### Creating a New Lead

**URL:** `http://localhost:4000/erp/sales/leads`

**Step-by-Step:**

1. **Click "+ New Lead"** (top-right)

2. **Fill Required Information:**
   ```
   Contact Details:
   - First Name*: John
   - Last Name*: Smith
   - Email*: john.smith@acme.com
   - Phone*: +1-555-0100
   
   Company Information:
   - Company Name*: Acme Corporation
   - Industry: Manufacturing
   - Company Size: 500-1000
   - Website: www.acme.com
   
   Lead Details:
   - Lead Source*: Website
   - Lead Status: New
   - Assigned To: [Your name]
   - Estimated Value: $50,000
   ```

3. **Add Optional Details:**
   - Job title
   - Location/Address
   - Notes/Description
   - Tags
   - Custom fields

4. **Click "Create Lead"**

**Result:** Lead is created and appears in your leads list

### Lead Lifecycle

```
New → Contacted → Qualified → Converted
                      ↓
                  Unqualified (Lost)
```

**Status Definitions:**

- **New** - Just captured, not contacted yet
- **Contacted** - Initial outreach made
- **Qualified** - Meets criteria, has potential
- **Unqualified** - Doesn't meet criteria
- **Converted** - Became an opportunity

### Lead Qualification

**BANT Framework** (Built-in):

- **Budget:** Can they afford it?
- **Authority:** Decision maker?
- **Need:** Do they need your solution?
- **Timeline:** When will they buy?

**Qualification Process:**

1. **Open Lead Record**
2. **Click "Qualify" Tab**
3. **Answer Questions:**
   ```
   Budget:
   ○ Budget confirmed ($50,000)
   ○ Budget range known
   ○ No budget discussed
   ○ No budget available
   
   Authority:
   ○ Decision maker
   ○ Influencer
   ○ Gatekeeper
   ○ Unknown
   
   Need:
   ○ Urgent need
   ○ Clear need
   ○ Potential need
   ○ No clear need
   
   Timeline:
   ○ Immediate (< 1 month)
   ○ Short term (1-3 months)
   ○ Long term (3-6 months)
   ○ No timeline
   ```

4. **Lead Score Calculated** (0-100)
5. **Decision:**
   - Score > 70: Convert to opportunity
   - Score 40-70: Continue nurturing
   - Score < 40: Disqualify or nurture longer

### Converting Lead to Opportunity

**When to Convert:**
- Lead is qualified (high score)
- Budget confirmed
- Clear need identified
- Timeline established
- Decision maker engaged

**Conversion Process:**

1. **Open Lead Record**
2. **Click "Convert to Opportunity"** (top-right)
3. **Review Information:**
   ```
   Opportunity Details:
   - Name*: Acme - Q1 Manufacturing Order
   - Expected Close Date*: March 31, 2026
   - Deal Amount*: $50,000
   - Probability: 50%
   - Sales Stage: Qualification
   
   Create Records:
   ☑ Create Contact (John Smith)
   ☑ Create Company (Acme Corporation)
   ☑ Link to Opportunity
   ```

4. **Click "Convert & Create"**

**Result:**
- ✅ Lead status → "Converted"
- ✅ New opportunity created
- ✅ Contact record created
- ✅ Company record created
- ✅ All linked together

### Lead Assignment Rules

**Auto-Assignment Criteria:**

1. **Round Robin:**
   - Distribute evenly among team
   - Balances workload

2. **Territory-Based:**
   - Assign by geography
   - Based on lead location

3. **Product-Based:**
   - Assign by product interest
   - Specialist assignment

4. **Availability-Based:**
   - Assign to available reps
   - Considers capacity

**Manual Assignment:**
- Open lead
- Click "Assign" button
- Select team member
- Add assignment note

### Lead Nurturing

**Automated Actions:**

- **Day 1:** Welcome email sent
- **Day 3:** Follow-up call reminder
- **Day 7:** Product info email
- **Day 14:** Check-in call
- **Day 30:** Re-qualification

**Manual Nurturing:**

1. **Log Interactions**
   - Click "Log Activity"
   - Select type (Call, Email, Meeting)
   - Add notes
   - Set follow-up

2. **Add to Campaigns**
   - Select leads
   - Click "Add to Campaign"
   - Choose campaign
   - Automated emails sent

3. **Track Engagement**
   - View interaction history
   - See email opens/clicks
   - Monitor website visits

---

## 💼 Opportunities & Pipeline

### What is an Opportunity?

An **opportunity** is a qualified lead with a defined sales process, expected close date, and estimated value.

### Sales Pipeline Stages

```
1. Qualification (10%)
   └─ Verify fit, budget, timeline
   
2. Needs Analysis (25%)
   └─ Understand requirements, pain points
   
3. Proposal (50%)
   └─ Present solution, create quote
   
4. Negotiation (75%)
   └─ Discuss terms, pricing, contracts
   
5. Closed Won (100%) ✅
   └─ Deal signed, order created
   
6. Closed Lost (0%) ❌
   └─ Deal lost, document reason
```

**Probability percentages** indicate likelihood of closing.

### Creating an Opportunity

**URL:** `http://localhost:4000/erp/sales/opportunities`

**Two Ways to Create:**

**Method 1: Convert from Lead**
- (Covered in Leads section above)

**Method 2: Direct Creation**

1. **Click "+ New Opportunity"**

2. **Fill Opportunity Details:**
   ```
   Basic Information:
   - Opportunity Name*: Acme - Manufacturing Equipment
   - Company*: Acme Corporation
   - Contact*: John Smith
   - Owner*: [Your name]
   
   Deal Information:
   - Expected Revenue*: $50,000
   - Probability: 50%
   - Expected Close Date*: March 31, 2026
   - Sales Stage*: Needs Analysis
   
   Additional:
   - Lead Source: Website
   - Campaign: Q1 Manufacturing Campaign
   - Competitor: [If known]
   - Next Step: Schedule demo
   ```

3. **Add Products** (Optional):
   - Click "+ Add Product"
   - Select from catalog
   - Set quantity and price
   - Total calculated automatically

4. **Click "Create Opportunity"**

### Managing Opportunities

**Viewing Opportunities:**

**List View:**
- All opportunities in table
- Sort by any column
- Filter by stage, owner, date
- Quick actions menu

**Kanban View:**
- Visual pipeline board
- Drag & drop between stages
- Color-coded by value/age
- Quick edit inline

**Calendar View:**
- See close dates
- Filter by month/quarter
- Identify conflicts

**Switch Views:**
- Click view selector (top-right)
- Choose List / Kanban / Calendar

### Moving Through Pipeline

**Update Stage:**

**Method 1: Drag & Drop (Kanban)**
- Drag opportunity card
- Drop in new stage column
- Probability updates automatically

**Method 2: Edit Record**
- Open opportunity
- Change "Sales Stage"
- Update "Probability"
- Add "Next Steps"
- Click "Save"

**Method 3: Quick Edit**
- Click "..." on opportunity card
- Select "Move to [Stage]"
- Add update note

**Best Practice:** Always add notes when changing stages!

### Probability Management

**Auto-Update Rules:**

| Stage | Default Probability |
|-------|---------------------|
| Qualification | 10% |
| Needs Analysis | 25% |
| Proposal | 50% |
| Negotiation | 75% |
| Closed Won | 100% |
| Closed Lost | 0% |

**Manual Override:**
- Open opportunity
- Edit "Probability" field
- Enter custom value (0-100%)
- Add justification note

### Forecasting

**Revenue Forecast:**

```
Weighted Pipeline Value = 
  Sum of (Opportunity Value × Probability)

Example:
- Opp 1: $100,000 × 75% = $75,000
- Opp 2: $50,000 × 50% = $25,000
- Opp 3: $30,000 × 10% = $3,000
Total Weighted: $103,000
```

**View Forecast:**
- Navigate to Sales → Forecast
- Select time period
- Filter by owner/team
- Compare to quota

### Closing Opportunities

**Close as Won:**

1. **Open Opportunity**
2. **Click "Close as Won"**
3. **Confirm Details:**
   ```
   - Actual Revenue: $50,000
   - Close Date: Today
   - Win Reason: Better pricing
   - Next Steps: Create sales order
   ```
4. **Click "Close Won"**
5. **Automatic Actions:**
   - Status → "Closed Won"
   - Create sales order (optional)
   - Update forecasts
   - Trigger celebrations! 🎉

**Close as Lost:**

1. **Open Opportunity**
2. **Click "Close as Lost"**
3. **Document Reason:**
   ```
   Loss Reason*:
   ○ Competitor chosen
   ○ Budget constraints
   ○ No decision made
   ○ Timing issues
   ○ Product fit
   ○ Other
   
   Competitor: [If applicable]
   Notes: [Detail what happened]
   Follow-up Date: [If relevant]
   ```
4. **Click "Close Lost"**
5. **Learn & Improve:**
   - Review loss patterns
   - Adjust strategy
   - Follow up in future

---

## 👥 Contacts & Companies

### Contact Management

**What is a Contact?**
- Individual person at a company
- Decision makers, influencers, users
- Multiple contacts per company

**Creating Contacts:**

**URL:** `http://localhost:4000/erp/sales/contacts`

1. **Click "+ New Contact"**
2. **Fill Details:**
   ```
   Personal Information:
   - First Name*: John
   - Last Name*: Smith
   - Job Title: Purchasing Manager
   - Email*: john.smith@acme.com
   - Phone*: +1-555-0100
   - Mobile: +1-555-0101
   
   Company:
   - Company*: Acme Corporation
   - Department: Procurement
   - Reports To: [Manager if known]
   
   Address:
   - Street: 123 Main St
   - City: New York
   - State: NY
   - ZIP: 10001
   - Country: USA
   ```

3. **Add Social Links** (Optional):
   - LinkedIn profile
   - Twitter handle

4. **Set Preferences:**
   - Communication method
   - Best time to contact
   - Do not contact (if applicable)

5. **Click "Create Contact"**

**Contact Details View:**

- **Overview Tab:** Basic information
- **Activity Tab:** Interaction history
- **Opportunities Tab:** Related deals
- **Orders Tab:** Purchase history
- **Cases Tab:** Support tickets
- **Notes Tab:** Internal notes

### Company Management

**What is a Company?**
- Business organization
- Can have multiple contacts
- Can have multiple opportunities

**Creating Companies:**

**URL:** `http://localhost:4000/erp/sales/companies`

1. **Click "+ New Company"**
2. **Fill Company Details:**
   ```
   Basic Information:
   - Company Name*: Acme Corporation
   - Industry*: Manufacturing
   - Company Size: 500-1000 employees
   - Annual Revenue: $50M - $100M
   - Website: www.acme.com
   - Phone*: +1-555-0100
   
   Business Details:
   - Tax ID: XX-XXXXXXX
   - DUNS Number: [If available]
   - Customer Type: Enterprise
   - Payment Terms: Net 30
   - Credit Limit: $100,000
   
   Address:
   - Billing Address
   - Shipping Address (can differ)
   ```

3. **Assign Account Owner:**
   - Primary rep managing account
   - Backup rep if needed

4. **Click "Create Company"**

**Company Details View:**

- **Overview:** Company information
- **Contacts:** All people at company
- **Opportunities:** Active & closed deals
- **Orders:** Purchase history
- **Quotations:** All quotes sent
- **Cases:** Support tickets
- **Documents:** Contracts, proposals
- **Notes:** Account notes

### Customer Segmentation

**Segment by:**

**Industry:**
- Manufacturing
- Retail
- Technology
- Healthcare
- Finance
- etc.

**Size:**
- Enterprise (1000+ employees)
- Mid-Market (100-999)
- Small Business (10-99)
- Startup (< 10)

**Value:**
- Platinum ($500K+ annually)
- Gold ($100K - $500K)
- Silver ($25K - $100K)
- Bronze (< $25K)

**Status:**
- Active customer
- Prospect
- Former customer
- Partner

**Use Segmentation for:**
- Targeted campaigns
- Pricing strategies
- Account assignment
- Reporting

---

## 📝 Quotations

### What is a Quotation?

A **quotation** (quote) is a formal offer to sell products/services at specified prices and terms.

### Creating Quotations

**URL:** `http://localhost:4000/erp/sales/quotations`

**Step-by-Step Process:**

1. **Click "+ New Quotation"**

2. **Select Customer:**
   ```
   - Company*: Acme Corporation
   - Contact*: John Smith
   - Opportunity: Link if exists
   
   Auto-filled:
   - Billing address
   - Shipping address
   - Payment terms
   ```

3. **Add Line Items:**
   
   **Click "+ Add Item"**
   
   ```
   For each item:
   - Product*: [Select from catalog]
   - Description: [Auto-filled or custom]
   - Quantity*: 100
   - Unit Price*: $10.00
   - Discount: 5% or $0.50
   - Tax: Auto-calculated
   - Line Total: $950.00 (auto-calculated)
   ```
   
   **Quick Tips:**
   - Type product code or name
   - Default price loads automatically
   - Override price if needed
   - Add custom line items

4. **Set Terms:**
   ```
   Pricing:
   - Subtotal: $5,000.00 (auto)
   - Discount: 10% ($500.00)
   - Tax: 8% ($360.00)
   - Shipping: $50.00
   - Total: $4,910.00
   
   Terms:
   - Valid Until*: March 31, 2026
   - Payment Terms: Net 30
   - Delivery Time: 2-3 weeks
   - Warranty: 1 year
   ```

5. **Add Terms & Conditions:**
   - Use template
   - Or write custom
   - Include:
     - Payment terms
     - Delivery conditions
     - Return policy
     - Warranty terms

6. **Save Options:**
   - **Save as Draft:** Work on later
   - **Create & Send:** Send to customer immediately
   - **Create & Download:** Get PDF

### Quotation Templates

**Pre-designed Templates:**

1. **Standard Quote:**
   - Basic products/services
   - Standard pricing
   - Simple terms

2. **Detailed Quote:**
   - Line item breakdown
   - Specifications
   - Delivery schedule

3. **Service Quote:**
   - Hourly rates
   - Project phases
   - Milestones

4. **Subscription Quote:**
   - Recurring charges
   - Setup fees
   - Contract terms

**Select Template:**
- When creating quote
- Choose from dropdown
- Customize as needed

### Sending Quotations

**Send via Email:**

1. **Click "Send" Button**
2. **Email Preview:**
   ```
   To: john.smith@acme.com
   CC: [Optional]
   Subject: Quotation #Q-2026-001 from Ocean ERP
   
   Message:
   Dear John,
   
   Thank you for your interest in our products.
   Please find attached our quotation #Q-2026-001.
   
   This quote is valid until March 31, 2026.
   
   If you have any questions, please don't hesitate
   to contact me.
   
   Best regards,
   [Your name]
   
   Attachments:
   ✓ Quotation_Q-2026-001.pdf
   ✓ Product_Catalog.pdf (optional)
   ```

3. **Click "Send Email"**

**Share via Link:**
- Click "Share Link" button
- Copy unique URL
- Send via any channel
- Customer views in portal

### Quotation Lifecycle

```
Draft → Sent → Viewed → Accepted → Order Created
                 ↓
              Expired / Rejected
```

**Status Tracking:**

- **Draft:** Being prepared
- **Sent:** Emailed to customer
- **Viewed:** Customer opened (email tracking)
- **Accepted:** Customer approved
- **Rejected:** Customer declined
- **Expired:** Past valid date
- **Converted:** Sales order created

**Real-time Notifications:**
- 📧 When customer opens email
- 👀 When customer views quote
- ✅ When customer accepts
- ❌ When customer rejects

### Revising Quotations

**Create Revision:**

1. **Open Original Quote**
2. **Click "Create Revision"**
3. **Make Changes:**
   - Adjust pricing
   - Change products
   - Update terms
   - Extend validity

4. **New Version Created:**
   - Q-2026-001 **Rev 2**
   - Previous version archived
   - History maintained

**View History:**
- See all revisions
- Compare versions
- Track changes

### Converting to Sales Order

**When Customer Accepts:**

1. **Open Quotation**
2. **Click "Convert to Order"**
3. **Confirm Details:**
   ```
   Order Information:
   - Order Date: Today
   - Delivery Date: [Calculate based on lead time]
   - Payment Terms: [From quote]
   - Shipping Method: [Select]
   
   Inventory:
   ☑ Check stock availability
   ☑ Reserve items
   ☑ Create pick list
   ```

4. **Click "Create Order"**

**Result:**
- ✅ Sales order created
- ✅ Quotation status → "Converted"
- ✅ Inventory reserved
- ✅ Order confirmation sent
- ✅ Opportunity updated

---

## 📦 Sales Orders

### What is a Sales Order?

A **sales order** is a confirmed customer order that:
- Commits inventory
- Triggers fulfillment
- Creates invoice
- Generates revenue

### Creating Sales Orders

**URL:** `http://localhost:4000/erp/sales/orders`

**Two Ways to Create:**

**Method 1: From Quotation**
- (Covered above)

**Method 2: Direct Order**

1. **Click "+ New Order"**
2. **Select Customer:**
   ```
   - Customer*: Acme Corporation
   - Contact*: John Smith
   - PO Number: [Customer's PO]
   ```

3. **Add Order Lines:**
   ```
   For each item:
   - Product*: [Select]
   - Quantity*: 100
   - Unit Price: $10.00
   - Availability: ✅ In Stock (85 available)
   - Delivery Date: Feb 15, 2026
   ```

4. **Set Delivery:**
   ```
   - Shipping Address*: [Confirm]
   - Shipping Method: FedEx Ground
   - Shipping Cost: $50.00
   - Requested Delivery: Feb 15, 2026
   - Special Instructions: [If any]
   ```

5. **Review & Confirm:**
   ```
   Order Summary:
   - Subtotal: $1,000.00
   - Shipping: $50.00
   - Tax: $84.00
   - Total: $1,134.00
   
   Payment:
   - Terms: Net 30
   - Due Date: March 15, 2026
   ```

6. **Click "Create Order"**

### Order Lifecycle

```
New Order → Processing → Packed → Shipped → Delivered
    ↓
Invoiced → Payment → Completed
```

**Status Details:**

1. **New:** Just created
2. **Confirmed:** Accepted by warehouse
3. **Processing:** Being picked & packed
4. **Ready:** Awaiting shipment
5. **Shipped:** In transit
6. **Delivered:** Received by customer
7. **Completed:** Paid & closed

### Order Fulfillment

**Fulfillment Process:**

1. **Order Confirmed**
   - Inventory reserved
   - Pick list generated

2. **Warehouse Notified**
   - Pick list sent
   - Items located

3. **Items Picked**
   - Scanned or checked
   - Packed in box

4. **Shipment Created**
   - Carrier selected
   - Label printed
   - Tracking number assigned

5. **Order Shipped**
   - Customer notified
   - Tracking email sent

6. **Delivery Confirmed**
   - Signature captured
   - Status updated

**Tracking in System:**
- View order status
- See packing details
- Track shipment
- Monitor delivery

### Partial Shipments

**When Full Order Can't Ship:**

1. **Split Order**
   - Select items available
   - Create partial shipment
   - Rest on backorder

2. **Create Backorder**
   ```
   Shipment 1 (Now):
   - Item A: 50 units (available)
   - Item B: 30 units (available)
   
   Backorder (Later):
   - Item A: 50 units (awaiting stock)
   - Item B: 20 units (awaiting stock)
   ```

3. **Customer Notification**
   - Inform of partial shipment
   - Provide backorder timeline
   - Offer alternatives

### Order Modifications

**Before Shipment:**

1. **Open Order**
2. **Click "Modify Order"**
3. **Make Changes:**
   - Add/remove items
   - Change quantities
   - Update address
   - Adjust delivery date

4. **Customer Approval:**
   - Send updated order
   - Confirm changes
   - Adjust invoice

**After Shipment:**
- Changes not allowed
- Use returns/exchanges
- Create RMA if needed

### Invoicing

**Create Invoice:**

1. **Open Completed Order**
2. **Click "Create Invoice"**
3. **Invoice Generated:**
   ```
   Invoice #: INV-2026-001
   Date: [Today]
   Due Date: [Based on terms]
   
   Line Items: [From order]
   Total: $1,134.00
   
   Status: Sent
   ```

4. **Auto-Actions:**
   - Email to customer
   - Posted to accounting
   - Payment tracking started

### Returns & Exchanges

**Customer Return Request:**

1. **Create RMA** (Return Merchandise Authorization)
   ```
   RMA Details:
   - Order Number: SO-2026-001
   - Return Reason: Defective / Wrong item / etc.
   - Items to Return: [Select]
   - Refund or Exchange: [Choose]
   ```

2. **Approve RMA**
   - Review request
   - Approve/reject
   - Send return label

3. **Process Return**
   - Receive items
   - Inspect condition
   - Process refund/exchange
   - Update inventory

---

## 🌐 Customer Portal

### What is the Customer Portal?

A **self-service portal** where customers can:
- View their orders
- Track shipments
- Download invoices
- Accept quotations
- Submit support tickets
- Update information

### Portal Access

**URL:** `http://localhost:4000/portal`

**Customer Login:**
- Email address
- Password (sent on first invite)
- Self-registration (if enabled)

### Portal Features

**Customer Dashboard:**

- **Recent Orders:** Last 10 orders
- **Order Status:** Real-time tracking
- **Invoices:** View & download
- **Quotations:** Accept/reject online
- **Support Tickets:** Submit & track
- **Account Info:** Update details

**What Customers Can Do:**

1. **View Orders:**
   - All past orders
   - Current status
   - Track shipment
   - Download documents

2. **Accept Quotations:**
   - Review quote
   - Digital signature
   - Instant conversion

3. **Download Invoices:**
   - Current & past
   - PDF format
   - Payment status

4. **Submit Tickets:**
   - Report issues
   - Ask questions
   - Track responses

5. **Update Profile:**
   - Contact info
   - Shipping addresses
   - Preferences

### Portal Configuration

**Admin Settings:**

- Enable/disable portal
- Set registration rules
- Configure permissions
- Customize branding
- Set email templates

**Per-Customer Settings:**
- Portal access (yes/no)
- Permission level
- Document visibility
- Contact limits

---

## 📊 Analytics & Reports

### Sales Dashboards

**Main Sales Dashboard:**

**URL:** `http://localhost:4000/erp/sales/dashboard`

**Key Metrics:**

```
┌─────────────────┬──────────────────┐
│ Revenue YTD     │ Pipeline Value   │
│ $1,234,567      │ $2,500,000       │
│ ↑ 23% vs LY     │ ↑ 15% vs LM      │
├─────────────────┼──────────────────┤
│ Win Rate        │ Avg Deal Size    │
│ 32%             │ $45,678          │
│ ↑ 5% vs LQ      │ ↑ 12% vs LY      │
└─────────────────┴──────────────────┘
```

**Charts & Graphs:**

1. **Revenue Trend**
   - Line chart by month
   - Compare to target
   - Compare to last year

2. **Pipeline by Stage**
   - Funnel visualization
   - Value at each stage
   - Conversion rates

3. **Win/Loss Analysis**
   - Reasons for wins
   - Reasons for losses
   - Patterns & trends

4. **Sales by Rep**
   - Individual performance
   - Leaderboard
   - Quota attainment

5. **Sales by Product**
   - Top sellers
   - Revenue by category
   - Margins

### Standard Reports

**Available Reports:**

1. **Sales Forecast**
   - Weighted pipeline
   - Expected close dates
   - Confidence levels

2. **Sales Activity**
   - Calls made
   - Emails sent
   - Meetings held
   - Proposals sent

3. **Conversion Rates**
   - Lead → Opportunity
   - Opportunity → Quote
   - Quote → Order
   - Overall funnel

4. **Customer Analysis**
   - New customers
   - Lost customers
   - Customer lifetime value
   - Retention rate

5. **Product Performance**
   - Units sold
   - Revenue by product
   - Profit margins
   - Inventory turnover

6. **Geographic Sales**
   - Sales by region
   - Sales by country
   - Territory performance

### Creating Custom Reports

**Report Builder:**

1. **Navigate to Reports**
2. **Click "+ New Report"**
3. **Select Data Source:**
   - Leads
   - Opportunities
   - Orders
   - Customers
   - Products

4. **Choose Columns:**
   - Drag & drop fields
   - Set order
   - Format values

5. **Add Filters:**
   ```
   Example: High Value Opportunities
   - Deal Amount > $50,000
   - Stage = Proposal or Negotiation
   - Owner = My Team
   - Expected Close = This Quarter
   ```

6. **Set Grouping:**
   - Group by stage
   - Group by owner
   - Group by product

7. **Add Calculations:**
   - Sum, Average, Count
   - Percentages
   - Growth rates

8. **Preview & Save**
9. **Schedule Email** (optional)

### Key Performance Indicators (KPIs)

**Track These Metrics:**

**Activity KPIs:**
- Calls per day
- Emails per day
- Meetings per week
- Follow-up response time

**Pipeline KPIs:**
- Pipeline value
- Pipeline velocity
- Pipeline coverage (pipeline ÷ quota)
- Weighted pipeline value

**Conversion KPIs:**
- Lead → Opportunity %
- Opportunity → Win %
- Quote → Order %
- Overall win rate

**Revenue KPIs:**
- Revenue vs target
- Average deal size
- Sales cycle length
- Customer lifetime value

**Efficiency KPIs:**
- Cost per lead
- Cost per acquisition
- Sales per rep
- Quota attainment

### Exporting Data

**Export Options:**

1. **From List Views:**
   - Click "Export" button
   - Choose: CSV, Excel, PDF
   - Filtered data exported

2. **From Reports:**
   - Run report
   - Click "Export"
   - Schedule recurring

3. **Bulk Export:**
   - Settings → Data Export
   - Select objects
   - Full data dump
   - CSV format

---

## 🎯 Best Practices

### Lead Management Best Practices

1. **Respond Quickly**
   - Contact new leads within 5 minutes
   - Research shows 100x better conversion

2. **Qualify Thoroughly**
   - Use BANT framework
   - Don't waste time on bad fits

3. **Document Everything**
   - Log all interactions
   - Add detailed notes
   - Track communication

4. **Set Follow-up Reminders**
   - Never let lead go cold
   - Systematic follow-up
   - Use automation

5. **Nurture Consistently**
   - Regular touchpoints
   - Provide value
   - Educational content

### Opportunity Management Best Practices

1. **Keep Pipeline Current**
   - Update daily
   - Accurate probabilities
   - Remove dead deals

2. **Define Next Steps**
   - Always know next action
   - Set specific dates
   - Assign responsibilities

3. **Engage Decision Makers**
   - Multi-thread relationships
   - Map decision process
   - Address all stakeholders

4. **Compete to Win**
   - Know your competitors
   - Differentiate clearly
   - Address objections proactively

5. **Forecast Honestly**
   - Don't sandbag
   - Don't over-commit
   - Update regularly

### Customer Management Best Practices

1. **360° View**
   - All interactions logged
   - Complete history
   - Team collaboration

2. **Segment Smartly**
   - Group by characteristics
   - Targeted approaches
   - Personalized service

3. **Regular Check-ins**
   - Don't disappear after sale
   - Quarterly business reviews
   - Relationship building

4. **Upsell & Cross-sell**
   - Identify opportunities
   - Relevant recommendations
   - Add value first

5. **Measure Satisfaction**
   - Regular surveys
   - NPS scores
   - Act on feedback

### Quotation Best Practices

1. **Professional Presentation**
   - Use templates
   - Error-free
   - Well-formatted

2. **Clear Pricing**
   - Itemized breakdown
   - No hidden fees
   - Easy to understand

3. **Compelling Value**
   - Benefits, not features
   - ROI calculations
   - Success stories

4. **Timely Delivery**
   - Send quickly
   - Set realistic validity
   - Follow up promptly

5. **Easy Acceptance**
   - Simple process
   - Digital signature
   - Online acceptance

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**Issue: Can't Create Lead**

**Symptoms:**
- "Save" button disabled
- Error message on submit

**Solutions:**
- ✅ Check required fields (marked with *)
- ✅ Verify email format
- ✅ Check phone number format
- ✅ Ensure company name not blank
- ✅ Verify you have permissions

---

**Issue: Lead Won't Convert**

**Symptoms:**
- "Convert" button missing/grayed
- Error on conversion

**Solutions:**
- ✅ Check lead status (must be Qualified)
- ✅ Verify required fields complete
- ✅ Check user permissions
- ✅ Ensure no duplicate opportunity exists

---

**Issue: Opportunity Disappeared**

**Symptoms:**
- Can't find opportunity in list

**Solutions:**
- ✅ Check filters (may be hidden)
- ✅ Search by name/number
- ✅ Check "All Opportunities" view
- ✅ Verify not closed/archived
- ✅ Check ownership (assigned to someone else?)

---

**Issue: Quotation Won't Send**

**Symptoms:**
- Email fails to send
- "Send" button doesn't work

**Solutions:**
- ✅ Verify customer email address
- ✅ Check quotation status (must be draft or sent)
- ✅ Ensure all required fields complete
- ✅ Check email settings configured
- ✅ Verify SMTP server working

---

**Issue: Order Shows Wrong Price**

**Symptoms:**
- Price doesn't match quote
- Discount not applied

**Solutions:**
- ✅ Check product price list
- ✅ Verify customer price tier
- ✅ Check discount rules
- ✅ Refresh pricing (button in order)
- ✅ Manual price override if needed

---

**Issue: Dashboard Shows No Data**

**Symptoms:**
- Blank charts
- Zero metrics

**Solutions:**
- ✅ Check date range filter
- ✅ Verify you have data in system
- ✅ Check user permissions (team vs personal data)
- ✅ Refresh page
- ✅ Clear browser cache

---

## 📚 Additional Resources

### Related Guides

- **Getting Started Guide** - System basics
- **Customer Support Guide** - Managing cases
- **Marketing Guide** - Campaigns & automation
- **Operations Guide** - Order fulfillment
- **Accounting Guide** - Invoicing & payments

### Video Tutorials

**Available:**
- Lead Management Basics (10 min)
- Opportunity Pipeline Management (15 min)
- Creating Professional Quotations (12 min)
- Sales Order Processing (18 min)
- Advanced Reporting (20 min)

**Access:** Settings → Help → Video Library

### Support

**Need Help?**
- 💬 Live chat (bottom-right)
- 📧 Email: sales-support@ocean-erp.com
- 📞 Phone: [Your support line]
- 🎫 Support ticket: Settings → Support

---

## ✅ Quick Reference Card

### Essential Tasks

| Task | Quick Steps |
|------|-------------|
| **New Lead** | Sales → Leads → + New → Fill form → Create |
| **Qualify Lead** | Open lead → Qualify tab → Answer questions → Convert |
| **New Opportunity** | Sales → Opportunities → + New → Fill → Create |
| **Move Stage** | Drag opportunity card to new column (Kanban) |
| **Create Quote** | Sales → Quotes → + New → Select customer → Add items → Send |
| **Accept Quote** | Open quote → Convert to Order → Confirm |
| **Track Order** | Sales → Orders → Click order → View status |
| **View Pipeline** | Sales → Dashboard → Pipeline widget |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New record |
| `Ctrl/Cmd + K` | Search |
| `G` then `S` | Go to Sales |
| `Ctrl/Cmd + S` | Save form |

---

**Guide Version:** 1.0  
**Last Updated:** December 5, 2025  
**Next Review:** March 2026  

**Questions?** Contact: sales-training@ocean-erp.com

