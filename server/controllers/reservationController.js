const { google } = require('googleapis');
const { validationResult } = require('express-validator');

// Initialize Google Sheets API using environment variables
let sheets = null;
let auth = null;

// Try to initialize with environment variables first, then fallback to credentials.json
if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
  try {
    auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets API initialized with environment variables');
  } catch (error) {
    console.error('Error initializing Google Sheets with env vars:', error.message);
  }
} else if (process.env.GOOGLE_CREDENTIALS_PATH || require('fs').existsSync('./credentials.json')) {
  try {
    auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets API initialized with credentials file');
  } catch (error) {
    console.error('Error initializing Google Sheets with credentials file:', error.message);
  }
} else {
  console.log('Google Sheets API not configured - using in-memory storage');
}

// In-memory storage (fallback if Google Sheets is not configured)
let reservations = [];
let sheetName = 'Sheet1'; // Default sheet name

// Helper function to get or determine sheet name
async function getSheetName() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Get the first sheet's title
    if (response.data.sheets && response.data.sheets.length > 0) {
      sheetName = response.data.sheets[0].properties.title;
      console.log(`Using sheet: ${sheetName}`);
    }
  } catch (error) {
    console.error('Error getting sheet name:', error.message);
  }
}

// Helper function to sync with Google Sheets
async function syncToGoogleSheets(data) {
  if (!sheets || !process.env.GOOGLE_SHEET_ID) {
    console.log('Google Sheets not configured, using in-memory storage');
    return;
  }

  try {
    // Get the actual sheet name
    await getSheetName();
    
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = `${sheetName}!A:M`;

    // Prepare data for Google Sheets
    const values = data.map(res => [
      res.id,
      res.nama,
      res.email,
      res.alamat,
      res.telepon,
      res.tanggal,
      res.kebutuhan + (res.kebutuhanLainnya ? ` (${res.kebutuhanLainnya})` : ''),
      res.merek + (res.merekLainnya ? ` (${res.merekLainnya})` : ''),
      res.totalUnit,
      res.pk + (res.pkLainnya ? ` (${res.pkLainnya})` : ''),
      res.status,
      res.createdAt
    ]);

    // Clear existing data and append new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A:L`,
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          ['ID', 'Nama', 'Email', 'Alamat', 'Telepon', 'Tanggal', 'Kebutuhan', 'Merek', 'Total Unit', 'PK', 'Referral Code', 'Status', 'Created At'],
          ...values
        ]
      }
    });

    console.log('Data synced to Google Sheets');
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error.message);
    console.error('Full error:', error);
  }
}

// Helper function to load from Google Sheets
async function loadFromGoogleSheets() {
  if (!sheets || !process.env.GOOGLE_SHEET_ID) {
    console.log('Google Sheets not configured, using in-memory storage');
    return reservations;
  }

  try {
    // Get the actual sheet name
    await getSheetName();
    
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = `${sheetName}!A:L`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    // Skip header row
    const data = rows.slice(1).map(row => ({
      id: row[0],
      nama: row[1],
      email: row[2],
      alamat: row[3],
      telepon: row[4],
      tanggal: row[5],
      kebutuhan: row[6],
      merek: row[7],
      totalUnit: row[8],
      pk: row[9],
      referralCode: row[10] || '',
      status: row[11] || 'pending',
      createdAt: row[12]
    }));

    reservations = data;
    console.log(`Loaded ${data.length} reservations from Google Sheets`);
    return data;
  } catch (error) {
    console.error('Error loading from Google Sheets:', error.message);
    console.error('Full error:', error);
    return reservations;
  }
}

// Generate unique ID
const generateBookingId = () => {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return result;
};

exports.createReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      nama,
      email,
      alamat,
      telepon,
      tanggal,
      kebutuhan,
      kebutuhanLainnya,
      merek,
      merekLainnya,
      totalUnit,
      pk,
      pkLainnya,
      referralCode
    } = req.body;

    const newReservation = {
      id: generateBookingId(),
      nama,
      email,
      alamat,
      telepon,
      tanggal,
      kebutuhan,
      kebutuhanLainnya,
      merek,
      merekLainnya,
      totalUnit,
      pk,
      pkLainnya,
      referralCode,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    reservations.push(newReservation);
    await syncToGoogleSheets(reservations);

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: newReservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    await loadFromGoogleSheets();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    await loadFromGoogleSheets();

    const { id } = req.params;
    const updates = req.body;

    const index = reservations.findIndex(
      r => String(r.id) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        message: 'Reservation not found'
      });
    }

    reservations[index] = {
      ...reservations[index],
      ...updates
    };

    await syncToGoogleSheets(reservations);

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      reservation: reservations[index]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    await loadFromGoogleSheets();

    const { id } = req.params;

    const index = reservations.findIndex(
      r => String(r.id) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        message: 'Reservation not found'
      });
    }

    reservations.splice(index, 1);

    await syncToGoogleSheets(reservations);

    res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
