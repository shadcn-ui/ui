# 🚀 User Management - Quick Start Guide

## 📍 Access User Management

```
Settings → User Management
URL: http://localhost:4000/erp/settings/users
```

---

## ➕ Create a New User

**Button:** "Add New User" (top right, blue button)

**Required Fields:**
- ✅ First Name
- ✅ Last Name  
- ✅ Email (must be unique)

**Optional:**
- Role (Sales Representative, Account Manager, etc.)
- Active Status (toggle)

**Result:** User appears immediately in the list and in Lead assignment dropdowns!

---

## ✏️ Edit a User

1. Find the user in the table
2. Click the **⋯** (three dots) menu button
3. Select **"Edit User"**
4. Update information
5. Click **"Update User"**

---

## 🗑️ Deactivate a User

1. Click the **⋯** menu button
2. Select **"Deactivate User"** (red text)
3. Confirm in dialog
4. User status → Inactive (won't show in dropdowns)

**Note:** If user has assigned leads, you'll see a warning!

---

## 🔍 Search Users

**Search Box:** Top right of table

**Searches:**
- First name
- Last name
- Email
- Role

**Updates:** As you type (300ms delay)

---

## 📊 Statistics Dashboard

**4 Cards at Top:**
1. **Total Users** - All users in system
2. **Active Users** - Users available for assignment
3. **Administrators** - Admin role count
4. **Inactive Users** - Deactivated accounts

---

## 🏷️ Role Options

When creating/editing:
- Sales Representative
- Account Manager
- Sales Manager
- Business Development
- Sales Director
- Administrator
- Operations Manager
- Finance Manager
- Marketing Manager

**Sales roles appear in Lead assignment!**

---

## 🔗 Integration Points

**Where users appear:**
- ✅ Lead Management → "Assigned To" dropdown
- ✅ Sales Orders → Assigned user
- ✅ Opportunities → Owner field
- ✅ Customers → Account manager

---

## ⚡ Quick Actions

| Action | Shortcut |
|--------|----------|
| Add User | Click "Add New User" button |
| Search | Type in search box |
| Refresh | Click "Refresh" button |
| Edit | ⋯ → Edit User |
| Deactivate | ⋯ → Deactivate User |

---

## 🎯 Common Tasks

### Add Indonesian Sales Rep
```
1. Click "Add New User"
2. First Name: Ahmad
3. Last Name: Fauzi
4. Email: ahmad.fauzi@ocean-erp.com
5. Role: Sales Representative
6. Click "Create User"
7. ✅ Done! Immediately available in Lead form
```

### Promote User to Manager
```
1. Find user in table
2. Click ⋯ → Edit User
3. Change Role: Sales Manager
4. Click "Update User"
5. ✅ Role badge changes color
```

### Temporarily Remove User from Assignments
```
1. Click ⋯ → Deactivate User
2. Confirm
3. ✅ User won't appear in dropdowns
4. (To reactivate: Edit → Toggle Active → Update)
```

---

## 📱 Table Columns Explained

| Column | Shows |
|--------|-------|
| **User** | Avatar + Name + Email |
| **Role** | Colored badge |
| **Status** | Active (green) / Inactive (grey) |
| **Leads** | Number of assigned leads |
| **Created** | When user was added |
| **Actions** | ⋯ menu |

---

## ⚠️ Important Notes

1. **Email must be unique** - Can't create duplicate emails
2. **Soft delete** - Deactivated users remain in database
3. **Lead warning** - Shows warning if deactivating user with leads
4. **Role filtering** - Only sales roles show in Lead dropdown
5. **Real-time** - All changes reflect immediately

---

## 🐛 Troubleshooting

**"Email already exists"**
→ Try a different email address

**User not appearing in Lead dropdown**
→ Check:
  - User is Active (green status)
  - User has a sales-related role

**Can't deactivate user**
→ Warning shown if user has active leads (proceed anyway if needed)

**Search not working**
→ Wait 300ms after typing (debounce delay)

---

## 🎨 Role Badge Colors

- 🔴 **Red** - Administrator
- 🔵 **Blue** - Sales Manager
- 🟣 **Purple** - Sales Representative
- 🟦 **Indigo** - Account Manager
- 🟢 **Green** - Business Development
- ⚪ **Grey** - No Role

---

## ✅ Success Indicators

**After creating user:**
- Green toast notification
- User appears at top of list
- Statistics update

**After editing user:**
- Green toast notification
- Changes visible in table
- Badge/status updates

**After deactivating:**
- Grey status badge
- Warning toast if has leads
- User stays in list (use search to filter)

---

## 💡 Pro Tips

1. **Use search** to quickly find users by any field
2. **Check Leads column** before deactivating
3. **Assign roles** for better organization
4. **Use refresh** if data seems outdated
5. **Create test users** for development/testing

---

**Need help?** Check the full documentation:
- `USER_MANAGEMENT_COMPLETE.md`
- `LEAD_ASSIGN_TO_MANAGEMENT.md`

---

**Status:** ✅ FULLY FUNCTIONAL  
**Last Updated:** 25 November 2025
