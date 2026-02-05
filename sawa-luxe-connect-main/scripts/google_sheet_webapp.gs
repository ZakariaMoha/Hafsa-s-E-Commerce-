/**
 * Google Apps Script Web App to receive order POSTs and append to a Sheet
 * Deploy this as "Web app" and set access to "Anyone, even anonymous" (or secure it via a secret token).
 * Then copy the published URL and set it as VITE_GOOGLE_SHEET_WEBHOOK in your .env.
 *
 * Sheet columns created by this script:
 * Timestamp | OrderID | CustomerName | Phone | Location | Items | Subtotal | DeliveryFee | Total | Status | Notes
 */

const SHEET_NAME = 'Orders';

function _ensureHeaders(sheet) {
  const headers = ['Timestamp','OrderID','CustomerName','Phone','Location','Items','Subtotal','DeliveryFee','Total','Status','Notes'];
  const range = sheet.getRange(1,1,1,headers.length);
  range.setValues([headers]);
}

function doPost(e) {
  try {
    const payload = typeof e.postData === 'object' ? JSON.parse(e.postData.contents) : {};
    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      _ensureHeaders(sheet);
    }

    if (action === 'appendOrder' && payload.order) {
      const o = payload.order;
      const itemsStr = (o.items || []).map(i => `${i.name} x${i.quantity}`).join('; ');
      const row = [new Date(), o.orderId, o.name, o.phone, o.location, itemsStr, o.subtotal, o.deliveryFee, o.total, o.status || 'new', o.notes || ''];
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'unknown action' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ orders: [] })).setMimeType(ContentService.MimeType.JSON);

    if (action === 'getOrders') {
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      const orders = data.reverse().map(row => {
        const obj = {};
        headers.forEach((h,i) => { obj[h] = row[i]; });
        // Convert items string back to array approximation
        const items = (obj['Items'] || '').toString().split(';').map(s => s.trim()).filter(Boolean).map(s => ({ name: s }));
        return {
          timestamp: obj['Timestamp'],
          orderId: obj['OrderID'],
          name: obj['CustomerName'],
          phone: obj['Phone'],
          location: obj['Location'],
          items,
          subtotal: obj['Subtotal'],
          deliveryFee: obj['DeliveryFee'],
          total: obj['Total'],
          status: obj['Status'],
          notes: obj['Notes']
        };
      });

      return ContentService.createTextOutput(JSON.stringify({ orders })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'unknown action' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
