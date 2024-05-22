const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const CREDENTIALS = JSON.parse(fs.readFileSync('./credentials.json'));

const SHEET_ID = '1rz3h6H6u8RoJkQNeaVkVC56nJMvmFyzzJrxvsBgqfDU';
const RANGE = 'Sheet1!A:Z'; 

const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function fetchGoogleSheet() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    const providers = processData(rows);
    console.log(JSON.stringify(providers, null, 2));
  } catch (err) {
    console.error('Error fetching Google Sheet:', err);
  }
}

function processData(rows) {
  const providers = {};


  const providerNames = rows.shift();

  providerNames.forEach((provider, index) => {
    providers[provider] = [];

    rows.forEach((row) => {
      const link = row[index];
      if (link) {
        providers[provider].push(link);
      }
    });
  });

  return providers;
}

fetchGoogleSheet();