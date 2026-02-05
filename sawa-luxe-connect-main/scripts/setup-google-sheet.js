#!/usr/bin/env node

/**
 * Google Sheet Setup Script
 * 
 * This script creates a new Google Sheet for order tracking with all necessary fields.
 * 
 * Prerequisites:
 * 1. Download Google Service Account JSON from: https://console.cloud.google.com/iam-admin/serviceaccounts
 * 2. Create a new Google Sheet manually or let this script create it
 * 3. Share the sheet with the service account email
 * 
 * Usage:
 *   node scripts/setup-google-sheet.js --credentials path/to/credentials.json --sheet-name "Hafsa Orders"
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const SHEET_COLUMNS = [
  'Timestamp',
  'OrderID',
  'CustomerName',
  'Phone',
  'Location',
  'Items',
  'Subtotal',
  'DeliveryFee',
  'Total',
  'Status',
  'Notes'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function main() {
  console.log('\n📊 Hafsa\'s Boutique - Google Sheet Setup\n');
  console.log('This script will help you set up a Google Sheet for order tracking.\n');

  const args = process.argv.slice(2);
  const credPath = args.includes('--credentials') ? args[args.indexOf('--credentials') + 1] : null;
  const sheetName = args.includes('--sheet-name') ? args[args.indexOf('--sheet-name') + 1] : 'Hafsa Orders';

  // Option 1: Manual Google Sheet creation
  console.log('=== SETUP METHOD ===\n');
  console.log('Option 1: Manual Setup (Recommended for first time)');
  console.log('  - Create a Google Sheet manually at https://sheets.google.com');
  console.log('  - Name it "' + sheetName + '"');
  console.log('  - Copy the Sheet ID from the URL (between /d/ and /edit)');
  console.log('  - Share it with your Google Cloud Service Account email\n');

  console.log('Option 2: Use Google Apps Script (Automatic)');
  console.log('  - Deploy the Apps Script web app');
  console.log('  - Get the webhook URL\n');

  const method = await question('Which method? (1/2): ');

  if (method === '1') {
    await setupManualSheet();
  } else if (method === '2') {
    await setupAppsScript();
  } else {
    console.log('Invalid choice');
    process.exit(1);
  }
}

async function setupManualSheet() {
  console.log('\n=== MANUAL GOOGLE SHEET SETUP ===\n');

  const sheetId = await question('Enter your Google Sheet ID: ');
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;

  console.log('\n✅ Save this information to your .env file:\n');
  console.log('VITE_GOOGLE_SHEET_ID=' + sheetId);
  console.log('\nSheet URL: ' + sheetUrl);

  console.log('\n📋 Add these columns to your sheet (Row 1):');
  SHEET_COLUMNS.forEach((col, idx) => {
    console.log(`  ${idx + 1}. ${col}`);
  });

  console.log('\n\n✅ Next steps:');
  console.log('1. Go to ' + sheetUrl);
  console.log('2. In the first row, add these column headers:');
  console.log('   ' + SHEET_COLUMNS.join(' | '));
  console.log('3. Install gapi and run the Node.js variant, OR');
  console.log('4. Deploy the Google Apps Script and set VITE_GOOGLE_SHEET_WEBHOOK\n');

  rl.close();
}

async function setupAppsScript() {
  console.log('\n=== GOOGLE APPS SCRIPT SETUP ===\n');

  console.log('📝 Instructions to deploy the Apps Script:');
  console.log('');
  console.log('1. Open Google Apps Script: https://script.google.com');
  console.log('2. Create a new project');
  console.log('3. Copy the code from: scripts/google_sheet_webapp.gs');
  console.log('4. Replace the Apps Script file content with that code');
  console.log('5. Click "Deploy" → "New Deployment"');
  console.log('6. Select type: "Web app"');
  console.log('7. Execute as: your Google account');
  console.log('8. New users: "Anyone, even anonymous"');
  console.log('9. Click "Deploy" and copy the URL\n');

  const webhookUrl = await question('Paste the Apps Script web app URL here: ');

  console.log('\n✅ Save this to your .env file:\n');
  console.log('VITE_GOOGLE_SHEET_WEBHOOK=' + webhookUrl);

  console.log('\n\n✅ Your setup is complete!');
  console.log('The Google Sheet will be created automatically on first order submission.\n');

  rl.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
