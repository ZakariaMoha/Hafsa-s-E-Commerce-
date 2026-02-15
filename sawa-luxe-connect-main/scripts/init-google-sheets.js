#!/usr/bin/env node

/**
 * init-google-sheets.js
 *
 * Create and initialize multiple sheets and headers inside an existing Google Spreadsheet
 * using a Service Account JSON key.
 *
 * Usage:
 *   node scripts/init-google-sheets.js --credentials path/to/creds.json --sheet-id SPREADSHEET_ID
 *
 * Prerequisites:
 *   npm install googleapis
 *   Share the target spreadsheet with the service account email from creds.json
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

function parseArgs() {
  const args = process.argv.slice(2);
  const obj = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      obj[key] = args[i + 1];
      i++;
    }
  }
  return obj;
}

const SCHEMA = {
  Products: {
    headers: ['ProductID', 'Title', 'Handle', 'Description', 'Price', 'Currency', 'Images', 'Categories', 'SKU', 'Tags', 'Available'] ,
    sample: [
      ['p_001', 'Satin Scarf', 'satin-scarf', 'Premium satin scarf', '25.00', 'USD', 'https://example.com/img1.jpg', 'Scarves', 'SKU001', 'summer, silk', 'TRUE']
    ]
  },
  Orders: {
    headers: ['Timestamp','OrderID','CustomerID','CustomerName','Phone','Location','Items','Subtotal','DeliveryFee','Total','Status','Notes'],
    sample: []
  },
  Customers: {
    headers: ['CustomerID','Name','Email','Phone','DefaultAddress','City','Country','Notes'],
    sample: [ ['c_001','Amina Khan','amina@example.com','+123456789','123 Market St','Lahore','PK','VIP'] ]
  },
  Inventory: {
    headers: ['ProductID','SKU','Quantity','WarehouseLocation','ReorderThreshold'],
    sample: [ ['p_001','SKU001','50','WH-A1','10'] ]
  },
  Settings: {
    headers: ['Key','Value','Notes'],
    sample: [ ['currency','USD','Default store currency'] ]
  }
};

async function main() {
  const args = parseArgs();
  const credPath = args.credentials;
  const spreadsheetId = args['sheet-id'] || args.sheetId || args.sheet_id;

  if (!credPath || !spreadsheetId) {
    console.error('Usage: node scripts/init-google-sheets.js --credentials path/to/creds.json --sheet-id SPREADSHEET_ID');
    process.exit(1);
  }

  if (!fs.existsSync(credPath)) {
    console.error('Credentials file not found at', credPath);
    process.exit(1);
  }

  const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

  const jwtClient = new google.auth.JWT(
    creds.client_email,
    null,
    creds.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  await jwtClient.authorize();

  const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  // Fetch spreadsheet to inspect existing sheets
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = (meta.data.sheets || []).map(s => s.properties.title);

  const requests = [];
  Object.keys(SCHEMA).forEach(name => {
    if (!existing.includes(name)) {
      requests.push({ addSheet: { properties: { title: name } } });
    }
  });

  if (requests.length) {
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
    console.log('Created sheets:', requests.map(r => r.addSheet.properties.title).join(', '));
  } else {
    console.log('All sheets already exist.');
  }

  // Ensure headers and sample data
  for (const [sheetName, def] of Object.entries(SCHEMA)) {
    const headerRange = `${sheetName}!1:1`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: 'RAW',
      requestBody: { values: [def.headers] }
    });

    if (def.sample && def.sample.length) {
      const sampleRange = `${sheetName}!2:${2 + def.sample.length - 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: sampleRange,
        valueInputOption: 'RAW',
        requestBody: { values: def.sample }
      });
    }

    console.log(`Initialized sheet: ${sheetName} (headers set)`);
  }

  console.log('\n✅ Initialization complete.');
  console.log('Remember to share the spreadsheet with the service account email from your credentials file.');
}

main().catch(err => {
  console.error('Error initializing sheets:', err && err.message ? err.message : err);
  process.exit(1);
});
