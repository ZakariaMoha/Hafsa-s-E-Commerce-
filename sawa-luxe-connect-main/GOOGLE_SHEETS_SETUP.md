# Google Sheets Setup Guide for Hafsa's Boutique

## Overview

This guide will walk you through setting up Google Sheets integration for order tracking.

## Option 1: Google Apps Script (Recommended - Automatic)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** → **"Spreadsheet"**
3. Name it **"Hafsa Orders"** or your preferred name
4. Save and note the **Sheet ID** from the URL (between `/d/` and `/edit`)

### Step 2: Deploy the Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"+ New project"**
3. Name it **"Hafsa Orders Webhook"**
4. In the editor, paste the entire content from `scripts/google_sheet_webapp.gs`
5. Click **"Save"**
6. Click **"Deploy"** button (top right)
7. Select **"New Deployment"**
8. For **Type**, select **"Web app"**
9. For **Execute as**, select your Google account
10. For **Who has access**, select **"Anyone, even anonymous"** (or your email for security)
11. Click **"Deploy"**
12. Copy the **Deployment URL** (it will look like `https://script.google.com/macros/d/{id}/userweb`)

### Step 3: Update Environment Variables

Add these to your `.env` file:

```bash
VITE_GOOGLE_SHEET_WEBHOOK=https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/userweb
```

Replace `{YOUR_DEPLOYMENT_ID}` with the actual ID from your deployment URL.

### Step 4: Test the Connection

1. Run the development server: `npm run dev`
2. Go to the store and add items to the cart
3. Click "Proceed to WhatsApp"
4. Fill in details and send the order
5. Check your Google Sheet - a new row should appear automatically

## Option 2: Manual Google Sheet + Local Node Script

If you prefer to use Google Sheets API directly:

### Step 1: Setup Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: **"Hafsa Orders"**
3. Enable the **Google Sheets API**
4. Create a **Service Account**:
   - Go to **"Service Accounts"**
   - Click **"Create Service Account"**
   - Name: `hafsa-orders`
   - Click **"Create and Continue"**
   - Skip roles (click Continue)
   - Go to **"Keys"** tab
   - **"Add Key"** → **"Create new key"**
   - Choose **JSON**
   - Download the JSON file and save as `credentials.json` in your project root

### Step 2: Create the Google Sheet

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
2. Name it **"Hafsa Orders"**
3. Share it with the **service account email** from your JSON file:
   - The email looks like: `hafsa-orders@{project-id}.iam.gserviceaccount.com`
   - You can find it in the JSON file under `"client_email"`

### Step 3: Add Column Headers

Manually add these headers in Row 1 of your sheet:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | OrderID | CustomerName | Phone | Location | Items | Subtotal | DeliveryFee | Total | Status | Notes |

### Step 4: Get Your Sheet ID

1. Open your Google Sheet
2. Copy the **Sheet ID** from the URL (the long string between `/d/` and `/edit`)

### Step 5: Create a Node.js Integration (Optional)

If you want to use the Node.js API instead of Apps Script, update `src/lib/googleSheets.ts`:

```typescript
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
const credentials = import.meta.env.VITE_GOOGLE_CREDENTIALS_JSON;

export async function appendOrderToSheet(order: Order) {
  if (!sheetId || !credentials) {
    console.warn('Google Sheet credentials not configured');
    return null;
  }

  try {
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Orders'] || doc.sheetsByIndex[0];

    await sheet.addRow({
      'Timestamp': new Date().toISOString(),
      'OrderID': order.orderId,
      'CustomerName': order.name,
      'Phone': order.phone,
      'Location': order.location,
      'Items': order.items.map(i => `${i.name} x${i.quantity}`).join('; '),
      'Subtotal': order.subtotal,
      'DeliveryFee': order.deliveryFee,
      'Total': order.total,
      'Status': order.status || 'new',
      'Notes': order.notes || ''
    });

    return { success: true };
  } catch (err) {
    console.error('Error appending order:', err);
    return null;
  }
}
```

## Running the Setup Script

To run the interactive setup script:

```bash
node scripts/setup-google-sheet.js
```

This will guide you through:
- Choosing between manual setup or Apps Script
- Entering your Sheet ID or Apps Script webhook URL
- Saving the configuration to `.env`

## Troubleshooting

### Orders not appearing in sheet?

1. Check that `VITE_GOOGLE_SHEET_WEBHOOK` is set correctly in `.env`
2. Verify the Apps Script is deployed as "Web app" with "Anyone" access
3. Check browser console for errors when submitting order
4. In Google Apps Script Editor, check **Execution log** for errors

### Getting 403 Forbidden error?

- Make sure you set Apps Script access to **"Anyone, even anonymous"**
- Or share the Google Sheet with the service account email

### Sheet columns not auto-creating?

The Apps Script creates columns automatically on first order. If they don't appear:
1. Check the sheet name matches `SHEET_NAME = 'Orders'` in the script
2. Manually create a sheet named "Orders" with the column headers

## Column Descriptions

| Column | Description |
|--------|-------------|
| **Timestamp** | When the order was placed |
| **OrderID** | Unique order identifier (generated from timestamp) |
| **CustomerName** | Customer's full name |
| **Phone** | Customer's phone number |
| **Location** | Delivery location/address |
| **Items** | List of items ordered (e.g., "Gold Necklace x1; Handbag x2") |
| **Subtotal** | Total price of items (before delivery) |
| **DeliveryFee** | Delivery charge |
| **Total** | Final total (subtotal + delivery) |
| **Status** | Order status (new, confirmed, delivered, etc.) |
| **Notes** | Any additional notes about the order |

## Next Steps

1. ✅ Run the setup script: `node scripts/setup-google-sheet.js`
2. ✅ Add the webhook URL to `.env`
3. ✅ Test by placing an order on the website
4. ✅ Monitor orders in the Admin Dashboard

---

**Need help?** Check the [Google Apps Script documentation](https://developers.google.com/apps-script) or create an issue on your repository.
