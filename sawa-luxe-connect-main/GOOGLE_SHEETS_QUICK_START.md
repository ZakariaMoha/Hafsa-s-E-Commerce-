# Hafsa's Boutique - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Run the Setup Script

**Windows (PowerShell):**
```powershell
.\scripts\setup-google-sheet.ps1
```

**Mac/Linux:**
```bash
node scripts/setup-google-sheet.js
```

### Step 2: Create a Google Sheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet called "Hafsa Orders"
3. Copy the Sheet ID from the URL

### Step 3: Deploy Google Apps Script

1. Go to https://script.google.com
2. Create a new project
3. Copy all code from `scripts/google_sheet_webapp.gs`
4. Paste it into the Apps Script editor
5. Click **Deploy** → **New Deployment**
   - Type: Web app
   - Execute as: Your account
   - Who has access: Anyone, even anonymous
6. Copy the deployment URL

### Step 4: Update .env

Edit `.env` and add:

```bash
VITE_GOOGLE_SHEET_WEBHOOK=https://script.google.com/macros/d/YOUR_ID_HERE/userweb
```

Replace `YOUR_ID_HERE` with your Apps Script deployment ID.

### Step 5: Test!

```bash
npm run dev
```

1. Open http://localhost:5173
2. Add items to cart
3. Click "Proceed to WhatsApp"
4. Fill in your details and send
5. Check your Google Sheet - the order should appear! ✅

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `src/lib/googleSheets.ts` | Helper functions to POST/GET orders |
| `scripts/google_sheet_webapp.gs` | Google Apps Script webhook |
| `scripts/setup-google-sheet.js` | Interactive setup guide |
| `scripts/setup-google-sheet.ps1` | Quick start PowerShell script |
| `GOOGLE_SHEETS_SETUP.md` | Detailed setup documentation |

---

## 📊 Admin Dashboard Integration

Once set up, your admin panel will:
- ✅ **Fetch all orders** from Google Sheets
- ✅ **Display orders** in a table with:
  - Order ID
  - Customer name & phone
  - Delivery location
  - Items ordered
  - Total amount
  - Order status
- ✅ **Refresh** orders with a button click

---

## 🔒 Security Notes

### If Using "Anyone" Access
- ⚠️ Only use in development or with a secret token
- Add token validation in Apps Script if going to production

### Production Setup
For production, consider:
1. Restricting to your account only
2. Using Google Cloud authentication
3. Implementing a secret token in the webhook URL

---

## 🐛 Troubleshooting

**Orders not appearing?**
- Check `.env` has `VITE_GOOGLE_SHEET_WEBHOOK` set
- Verify Apps Script deployment URL is correct
- Check browser DevTools → Network tab for 403/404 errors

**"Sheet not found"?**
- Apps Script auto-creates "Orders" sheet on first submission
- Or manually create it with the column headers

**Deployment URL not working?**
- Make sure deployment is set to "Web app"
- Check "Anyone" has access in deployment settings

---

## 📞 Need Help?

See `GOOGLE_SHEETS_SETUP.md` for detailed instructions and troubleshooting.
