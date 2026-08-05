/**
 * Bridge between the Astro site and the Google Sheet.
 * Tab/column layout is documented in docs/sheets-schema.md — keep both in sync.
 */

var MENU_SHEET_NAME = 'menu';
var ORDERS_SHEET_NAME = 'orders';

function doGet() {
  var sheet = getSheet_(MENU_SHEET_NAME);
  var rows = sheet.getDataRange().getValues().slice(1); // skip header row

  var items = rows
    .filter(function (row) {
      return row[0] !== ''; // skip rows without an id
    })
    .map(function (row) {
      return {
        id: String(row[0]),
        name: row[1],
        description: row[2],
        price: Number(row[3]),
        category: row[4],
        image_url: row[5]
      };
    });

  return jsonResponse_(items);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var error = validateOrder_(payload);
    if (error) {
      return jsonResponse_({ ok: false, error: error });
    }

    var sheet = getSheet_(ORDERS_SHEET_NAME);
    sheet.appendRow([
      new Date().toISOString(),
      payload.customer_name,
      payload.customer_email,
      JSON.stringify(payload.items),
      payload.total
    ]);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: 'Unexpected error: ' + err.message });
  }
}

function validateOrder_(payload) {
  if (!payload || typeof payload !== 'object') return 'Missing payload.';
  if (!payload.customer_name || typeof payload.customer_name !== 'string') {
    return 'customer_name is required.';
  }
  if (!payload.customer_email || String(payload.customer_email).indexOf('@') === -1) {
    return 'customer_email is required and must look like an email.';
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return 'items must be a non-empty array.';
  }
  if (typeof payload.total !== 'number' || isNaN(payload.total)) {
    return 'total must be a number.';
  }
  return null;
}

function getSheet_(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet tab "' + name + '" not found. Check docs/sheets-schema.md.');
  }
  return sheet;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
