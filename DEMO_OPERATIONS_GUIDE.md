# Ocean ERP - Complete Operations Guide for Demo

## 🎯 Demo Flow Overview

**Total Demo Time:** 30-45 minutes  
**Recommended Flow:** Dashboard → Sales → Operations → Accounting → Integration

---

## 🚀 Pre-Demo Checklist

### Before Starting Your Demo

1. ✅ **Start the application**
   ```bash
   cd /Users/marfreax/Github/ocean-erp
   pnpm run dev
   ```
   - Wait for server to start at http://localhost:4000
   - Verify no compilation errors

2. ✅ **Open browser and prepare tabs**
   - Main demo: http://localhost:4000
   - Backup tab in case of refresh needed

3. ✅ **Login credentials ready**
   - Have your login credentials prepared
   - Test login before prospect arrives

4. ✅ **Review the data**
   - Familiarize yourself with SKINCARE_DEMO_DATA_GUIDE.md
   - Know the key numbers (IDR 4.75B revenue, 95.1% quality pass rate, etc.)

5. ✅ **Prepare talking points**
   - Review the presentation
   - Practice transitions between modules

---

## 📊 Module 1: Dashboard & Analytics (5 minutes)

### **Starting Point:** http://localhost:4000/erp/analytics

### What to Show:
1. **Executive Overview**
   - "This is where your CEO/CFO starts their day"
   - Point out real-time KPIs
   - Mention date range filtering (7d, 30d, 90d, 1y)

2. **Navigation Tour**
   - Show the sidebar navigation
   - Explain the module structure
   - Highlight the breadcrumb trail

### Key Talking Points:
- ✨ "All data is real-time and interconnected"
- ✨ "The system tracks everything from production to financials"
- ✨ "Notice the export functionality for reports"

### Demo Script:
> "Let me show you how Ocean Cosmetics Indonesia uses this system. Starting from the analytics dashboard, you can see we're doing IDR 4.75 billion in revenue this month. The dashboard gives executives a bird's-eye view of the entire operation—from production metrics to financial performance."

---

## 💰 Module 2: Sales Performance (8 minutes)

### **Navigate to:** http://localhost:4000/erp/sales/analytics/performance

### Step-by-Step Demo Flow:

#### Step 1: Overview KPIs (2 min)
1. Point to the **4 KPI cards** at the top:
   - **Total Revenue:** IDR 4.75B
   - **Total Orders:** 2,847
   - **Avg Order Value:** IDR 1.67M
   - **Conversion Rate:** 4.2%

2. Highlight the **growth indicators**:
   - Revenue +15.8% (green, trending up)
   - Orders +12.3% (positive growth)

**Talking Point:**
> "These metrics update in real-time. Notice we're seeing 15.8% revenue growth month-over-month, which is excellent for a growing skincare brand."

#### Step 2: Period Filters (1 min)
1. Click **Week** button
2. Click **Month** button
3. Click **Quarter** button

**Talking Point:**
> "You can analyze performance by different time periods—week, month, quarter, or year. This helps identify seasonal trends and campaign effectiveness."

#### Step 3: Trends Tab (2 min)
1. Click on **"Trends"** tab
2. Show the **daily performance table**:
   - Point out Dec 12 peak: IDR 724M (highest)
   - Show consistent order volume (365-445 orders/day)

**Talking Point:**
> "Here's our 7-day performance. You can see December 12th was our strongest day with 724 million in sales. This might correlate with a marketing campaign or promotion."

#### Step 4: Team Performance Tab (2 min)
1. Click on **"Team Performance"** tab
2. Highlight **top performer: Sarah Wijaya**:
   - Revenue: IDR 1.28B
   - 412 orders
   - 5.8% conversion rate

3. Show the **team comparison**

**Talking Point:**
> "This is crucial for sales management. Sarah Wijaya is our top performer with a 5.8% conversion rate—that's 38% higher than our team average. We can analyze her techniques and coach the rest of the team."

#### Step 5: Customers Tab (1 min)
1. Click on **"Customers"** tab
2. Show customer metrics and acquisition sources

**Talking Point:**
> "We track customer acquisition sources, lifetime value, and purchasing patterns. This helps optimize our marketing spend."

### Key Numbers to Remember:
- 📈 Revenue: IDR 4.75B (+15.8%)
- 🛒 Orders: 2,847
- 👥 Top Rep: Sarah Wijaya (IDR 1.28B)
- 📊 Conversion: 4.2%

---

## 🏭 Module 3: Production Planning (8 minutes)

### **Navigate to:** http://localhost:4000/erp/operations/planning

### Step-by-Step Demo Flow:

#### Step 1: KPIs Overview (1 min)
1. Point to the **4 KPI cards**:
   - Active Work Orders: 3 (1 in progress, 2 scheduled)
   - Capacity Utilization: 78%
   - On-Time Delivery: 94.2%
   - Delayed Orders: 0

**Talking Point:**
> "Our production is running at 78% capacity with zero delayed orders. The 94.2% on-time delivery rate is excellent for a manufacturing operation."

#### Step 2: Production Schedule Tab (4 min)
1. Show **Work Order WO-2025-156** (in progress):
   - Product: Brightening Face Serum
   - Quantity: 2,500 units
   - Progress: 78% complete
   - Priority: HIGH (red badge)

2. Explain the **color coding**:
   - Red background: High priority
   - Yellow: Medium priority
   - Green: Low priority

3. Show the **progress bar** (78% complete)

4. Scroll to **WO-2025-157**:
   - Product: SPF 50 Day Cream
   - Progress: 35% complete
   - Still in progress

**Talking Point:**
> "Each work order shows real-time progress. The Brightening Serum is 78% complete and will finish tomorrow. The color coding helps production managers prioritize—red borders indicate urgent orders."

#### Step 3: Capacity Planning Tab (2 min)
1. Click **"Capacity Planning"** tab
2. Show the **4 machines/lines**:
   - Mixing Tank A: 85% utilized (blue bar)
   - Mixing Tank B: 60% utilized (green bar)
   - Filling Line 1: 92% utilized (yellow bar)
   - Filling Line 2: 45% utilized (green bar)

**Talking Point:**
> "This capacity view prevents bottlenecks. Filling Line 1 is at 92%—we might need to shift some load to Line 2 which is only at 45%. The system helps optimize resource allocation."

#### Step 4: Resources Tab (1 min)
1. Click **"Resources"** tab
2. Show **Production Line 1**:
   - Team: 5 operators
   - Shift: Day (07:00-15:00)
   - Efficiency: 96.8%
   - Current WO: WO-2025-001

3. Show **Production Line 2**:
   - Different shift time
   - Different efficiency

**Talking Point:**
> "We track each production line's team, shift schedule, and efficiency. Line 1 is running at 96.8% efficiency—that's world-class for manufacturing."

### Key Numbers to Remember:
- 🏭 Capacity: 78% utilized
- ✅ On-time: 94.2%
- 📦 Active WOs: 5 total
- ⚡ Efficiency: 96.8% (Line 1)

---

## 🔬 Module 4: Quality Control (6 minutes)

### **Navigate to:** http://localhost:4000/erp/operations/quality/reports

### Step-by-Step Demo Flow:

#### Step 1: Quality KPIs (1 min)
1. Point to **4 KPI cards**:
   - Overall Pass Rate: 95.1% (+1.2%)
   - Total Inspections: 5
   - Failed Batches: 1
   - Average Defects: 32.4 (-15%)

**Talking Point:**
> "Quality is critical in skincare—we maintain a 95.1% pass rate which exceeds industry standards. Notice we're trending up with 1.2% improvement."

#### Step 2: Inspections Tab (3 min)
1. Show **QI-2025-134** (PASSED - green badge):
   - Product: Brightening Serum
   - Pass Rate: 98.8%
   - Only 12 defects (cosmetic issues)
   - Inspector: Dr. Siti Rahmawati

2. Scroll to **QI-2025-138** (FAILED - red badge):
   - Product: Acne Spot Gel
   - Pass Rate: 89.3% (below 95% threshold)
   - 107 defects found
   - Issue: Viscosity inconsistency

**Talking Point:**
> "The green badges show passed inspections with details on defects. Here's important—when we fail a batch like this Acne Gel at 89.3%, the system immediately flags it. This batch was quarantined for investigation and rework. This prevents bad product from reaching customers."

#### Step 3: Trends Tab (1 min)
1. Click **"Trends"** tab
2. Show **Monthly Pass Rate Trend**:
   - December: 95.1%
   - November: 93.9%
   - October: 96.5%

3. Show **Top Defect Categories**:
   - Packaging Issues: 45%
   - Label Misalignment: 30%
   - Product Consistency: 15%

**Talking Point:**
> "The trends help identify patterns. We can see packaging issues are our biggest problem area at 45%. This insight lets us improve training or adjust equipment."

#### Step 4: Compliance Tab (1 min)
1. Click **"Compliance"** tab
2. Show certifications:
   - ✅ ISO 9001:2015 (Active)
   - ✅ GMP Certification (Active)
   - ⚠️ BPOM Registration (Renewal required in 45 days)

**Talking Point:**
> "For regulatory compliance, the system tracks all certifications. Notice BPOM renewal is due in 45 days—the system proactively alerts us so we never miss a deadline."

### Key Numbers to Remember:
- ✅ Pass Rate: 95.1%
- 🔬 Inspections: 5 batches
- ❌ Failed: 1 batch (quarantined)
- 📋 Certifications: ISO, GMP, BPOM

---

## 💼 Module 5: Accounting - General Ledger (5 minutes)

### **Navigate to:** http://localhost:4000/erp/accounting/general-ledger

### Step-by-Step Demo Flow:

#### Step 1: Financial Summary (1 min)
1. Point to **4 summary cards**:
   - Total Assets: IDR 5.84B
   - Total Liabilities: IDR 1.02B
   - Total Equity: IDR 4.85B
   - Total Revenue: IDR 4.75B

**Talking Point:**
> "The financial health snapshot shows total assets of 5.84 billion rupiah. Notice the healthy balance—assets far exceed liabilities, indicating strong financial position."

#### Step 2: Chart of Accounts Tab (2 min)
1. Show **different account types** (color coded):
   - Blue: Assets (Cash, Receivables, Inventory)
   - Red: Liabilities (Payables, Salaries)
   - Purple: Equity (Share Capital, Retained Earnings)
   - Green: Revenue
   - Orange: Expenses

2. Click on **"1210 - Finished Goods Inventory"**:
   - Balance: IDR 920M
   - Show debit/credit totals

**Talking Point:**
> "Each account is color-coded by type. Our finished goods inventory shows 920 million—this represents completed skincare products ready to ship. The system tracks every debit and credit automatically."

#### Step 3: Journal Entries Tab (1 min)
1. Click **"Journal Entries"** tab
2. Show **JE-2025-1547** (Posted):
   - Description: Sales to Guardian Pharmacy
   - Amount: IDR 285M
   - Status: Posted (green badge)

3. Show **JE-2025-1552** (Draft):
   - Description: Marketing campaign
   - Status: Draft (grey badge)

**Talking Point:**
> "Every transaction creates a journal entry. This sale to Guardian Pharmacy for 285 million is posted and final. Draft entries like this marketing expense can still be edited before posting."

#### Step 4: Trial Balance Tab (1 min)
1. Click **"Trial Balance"** tab
2. Show the **accounting equation**:
   - Total Debits = Total Credits (balanced)
   - Highlight the total row

**Talking Point:**
> "The trial balance proves our books are balanced—total debits equal total credits. This is the foundation of double-entry accounting, automated by the system."

### Key Numbers to Remember:
- 💰 Assets: IDR 5.84B
- 💸 Revenue: IDR 4.75B
- 📊 Net Income: IDR 1.94B
- ✅ Books: Balanced

---

## 💵 Module 6: Petty Cash Management (4 minutes)

### **Navigate to:** http://localhost:4000/erp/accounting/petty-cash

### Step-by-Step Demo Flow:

#### Step 1: Petty Cash Summary (1 min)
1. Point to **4 KPI cards**:
   - Total Balance: IDR 7.2M
   - Total Limit: IDR 12M
   - Total Spent: IDR 2.67M
   - Pending Requests: 1

**Talking Point:**
> "Petty cash is the small day-to-day expenses. We have 7.2 million available across three funds, with one pending request awaiting approval."

#### Step 2: Cash Funds Tab (1 min)
1. Show **3 separate funds**:
   - Office & Admin: IDR 3.25M (65% utilized)
   - Production Floor: IDR 2.1M (52.5% utilized)
   - Laboratory & QC: IDR 1.85M (61.7% utilized)

2. Point out the **progress bars** showing utilization

**Talking Point:**
> "We segregate petty cash by department. Each fund has a custodian—Dewi handles office, Ahmad manages production, and Dr. Siti controls lab expenses. This prevents misuse and improves tracking."

#### Step 3: Cash Requests Tab (2 min)
1. Click **"Cash Requests"** tab
2. Show **PC-2025-247** (Approved):
   - Amount: IDR 285,000
   - Purpose: pH test strips for QC lab
   - Requested by: Dr. Siti
   - Approved by: Dewi

3. Show **PC-2025-252** (Pending):
   - Amount: IDR 650,000
   - Purpose: Mixing tank sensor repair
   - Status: Orange badge (pending)
   - Show the **Approve/Reject buttons**

**Talking Point:**
> "Every petty cash request goes through approval workflow. Dr. Siti requested 285 thousand for lab supplies—already approved. But this 650 thousand for equipment repair is still pending. The approver can review details and either approve or reject with one click."

4. **Interactive Demo (Optional):**
   - Hover over **Approve** button
   - Say: "In a real scenario, I would click approve and it would instantly update the fund balance and transaction status."

### Key Numbers to Remember:
- 💵 Available: IDR 7.2M
- 📋 Requests: 8 total (7 approved, 1 pending)
- 👥 Funds: 3 departments
- ⏳ Pending: 1 request

---

## 🔗 Module 7: Integration & Connected Features (3 minutes)

### Quick Tour of Other Modules:

#### Supply Chain
**Navigate to:** http://localhost:4000/erp/operations/supply-chain

**Show (30 seconds):**
- Supplier management
- Quick mention: "This integrates with purchasing and inventory"

#### Project Management
**Navigate to:** http://localhost:4000/erp/operations/projects

**Show (30 seconds):**
- Active projects
- Quick mention: "Used for product development and R&D tracking"

#### POS System
**Navigate to:** http://localhost:4000/erp/pos/checkout

**Show (1 minute):**
- Customer search (demonstrate the fixed search)
- Payment processing
- Quick mention: "This is where retail transactions happen—connects to inventory and accounting"

**Key Point:**
> "Notice how everything connects. A POS sale automatically updates inventory, creates accounting entries, and appears in sales analytics. That's the power of an integrated ERP system."

---

## 🎬 Closing & Next Steps (3 minutes)

### Wrap-Up Talking Points:

1. **Summarize Key Benefits:**
   > "In 30 minutes, you've seen how Ocean Cosmetics manages:
   > - IDR 4.75 billion in monthly revenue
   > - 5 production lines with 94% on-time delivery
   > - 95% quality pass rate with full compliance tracking
   > - Complete financial accounting with automated entries
   > - All from one integrated system"

2. **Highlight Integration:**
   > "The real power is integration. When production completes a batch, it automatically updates inventory, triggers quality inspection, creates accounting entries, and appears in analytics. No manual data entry, no spreadsheets, no reconciliation headaches."

3. **Address Common Questions:**

   **Q: "Can we customize this for our business?"**
   > A: "Absolutely. Everything you see—from product types to workflow approvals—is configurable. We'd start with a discovery session to understand your unique processes."

   **Q: "How long is implementation?"**
   > A: "For a company your size, typically 8-12 weeks from kickoff to go-live. We do phased rollouts—start with critical modules like production and accounting, then add others."

   **Q: "What about training?"**
   > A: "Comprehensive training is included. We train super-users in each department, provide documentation, and offer ongoing support for the first 90 days."

   **Q: "Cloud or on-premise?"**
   > A: "Both options available. Most clients prefer cloud for automatic updates and access from anywhere. But we can deploy on your servers if you have security requirements."

4. **Call to Action:**
   > "I'd like to propose we schedule a discovery session with your team. We'll dive deeper into your specific needs, and I can show you customizations for [prospect's industry]. Can we calendar that for next week?"

---

## 📌 Quick Reference Card

### Essential Numbers to Memorize:

| Metric | Value |
|--------|-------|
| Monthly Revenue | IDR 4.75B |
| Revenue Growth | +15.8% |
| Total Orders | 2,847 |
| Quality Pass Rate | 95.1% |
| On-Time Delivery | 94.2% |
| Capacity Utilization | 78% |
| Total Assets | IDR 5.84B |
| Net Income | IDR 1.94B |
| Active Work Orders | 5 |
| Production Efficiency | 96.8% |

### Navigation Shortcuts:

- **Dashboard:** `/erp/analytics`
- **Sales:** `/erp/sales/analytics/performance`
- **Production:** `/erp/operations/planning`
- **Quality:** `/erp/operations/quality/reports`
- **Accounting:** `/erp/accounting/general-ledger`
- **Petty Cash:** `/erp/accounting/petty-cash`
- **POS:** `/erp/pos/checkout`

---

## 🎯 Pro Tips for a Successful Demo

### Before the Demo:
1. ✅ Practice the entire flow 2-3 times
2. ✅ Have a backup plan if internet fails
3. ✅ Close unnecessary browser tabs
4. ✅ Turn off notifications
5. ✅ Have water nearby (you'll be talking a lot!)

### During the Demo:
1. **Pace yourself** - Don't rush through features
2. **Pause for questions** - After each module, ask "Any questions on this section?"
3. **Use their company name** - "Imagine if [CompanyName] had this visibility..."
4. **Tell stories** - "One client used this to identify a quality issue before it became a recall"
5. **Be honest** - If they ask about a feature you don't have, say "Great question, let me note that as a customization"

### Handling Objections:
- **"Too complex"** → "You only use what you need. Start with 2-3 modules, add more over time."
- **"Too expensive"** → "What's the cost of inventory errors? Stock-outs? Manual reconciliation? This typically pays for itself in 6-12 months."
- **"We already have software"** → "How many different systems? How much time do you spend reconciling data between them?"
- **"Not ready now"** → "I understand. Can we do a light discovery session so we're ready when you are?"

### After the Demo:
1. Send follow-up email with key screenshots within 24 hours
2. Include pricing proposal (if discussed)
3. Schedule next meeting before they leave
4. Ask for feedback: "What was most valuable? What would you like to see more of?"

---

## 🚨 Troubleshooting Common Issues

### Application Won't Start
```bash
# Kill existing process
lsof -ti:4000 | xargs kill -9

# Restart
pnpm run dev
```

### Page Not Loading
- Hard refresh: Cmd + Shift + R (Mac) or Ctrl + Shift + R (Windows)
- Clear browser cache if needed

### Data Looks Wrong
- The data is static mock data—it won't change during demo
- If showing wrong dates, just explain "This is demo data set to December 2025"

### Prospect Asks to Add Data
- "Great idea! In the full system, you'd click 'New Order' or 'New Entry' here"
- Don't try to add data during demo—it may break things

---

## ✨ Success Metrics

**You've done a great demo if:**
- ✅ Prospect asks about pricing/timeline
- ✅ They request a follow-up meeting
- ✅ They introduce you to other decision makers
- ✅ They ask "Can it do [specific thing]?" (shows they're thinking about using it)
- ✅ You spend more time answering questions than presenting (engagement!)

**Red flags:**
- ❌ They're on their phone/laptop
- ❌ No questions at all
- ❌ "We'll get back to you" with no next meeting scheduled
- ❌ Only talking to end users, not decision makers

---

**Good luck with your demo! 🎊**

**Remember:** Confidence comes from practice. Run through this guide 2-3 times, and you'll nail it!
