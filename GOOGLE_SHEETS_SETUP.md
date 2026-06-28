# Google Sheets API Setup Guide

## 📋 Prerequisites
- Google Account
- Google Cloud Project
- Google Sheet created

## 🔧 Step-by-Step Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "Xayara Reservation System"
4. Click "Create"

### 2. Enable Google Sheets API
1. In Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and click "Enable"

### 3. Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in details:
   - Name: Xayara Service Account
   - Service account description: API access for reservation system
4. Click "Create and Continue"
5. Skip roles (click "Done")
6. Click on the created service account
7. Go to "Keys" tab
8. Click "Add Key" → "Create new key"
9. Select "JSON"
10. Click "Create" - this will download a JSON file

### 4. Configure Credentials File
1. Rename the downloaded JSON file to `credentials.json`
2. Move it to the `server` folder
3. **IMPORTANT**: Never commit this file to git (it's in .gitignore)

### 5. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet: "Xayara Reservations"
3. Create a tab named "Reservations"
4. Add headers in the first row:
   ```
   ID | Nama | Email | Alamat | Telepon | Tanggal | Kebutuhan | Merek | Total Unit | PK | Status | Created At
   ```

### 6. Share Sheet with Service Account
1. In your `credentials.json`, find `client_email`
2. Copy the email (looks like: xxx@xxx.iam.gserviceaccount.com)
3. In Google Sheet, click "Share"
4. Paste the service account email
5. Give "Editor" permission
6. Click "Send"

### 7. Get Sheet ID
1. Look at the URL of your Google Sheet
2. It looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
3. Copy the SHEET_ID part

### 8. Configure Environment Variables
In `server/.env`, add:
```env
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Note**: For the private key, you need to:
- Copy the entire private key from credentials.json
- Replace actual newlines with `\n`
- Wrap in quotes

### 9. Test the Setup
1. Start the backend server:
```bash
cd server
npm run dev
```

2. Make a test reservation via the frontend
3. Check if data appears in Google Sheet

## 🔍 Troubleshooting

### Error: "The caller does not have permission"
- Make sure you shared the sheet with the service account email
- Verify the service account has "Editor" permission
- Check that the sheet ID is correct

### Error: "Invalid credentials"
- Verify credentials.json is in the correct location
- Check that the file format is valid JSON
- Ensure the private key is properly formatted in .env

### Error: "Sheet not found"
- Verify the sheet ID is correct
- Make sure the sheet exists
- Check that you have access to the sheet

### Data not syncing
- Check server logs for errors
- Verify Google Sheets API is enabled
- Test API connection manually
- Check network connectivity

## 📝 Alternative: Using Environment Variables Only

If you don't want to use a credentials file, you can set all values in .env:

```env
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_CREDENTIALS_PATH=credentials.json
```

Or modify the code to use environment variables instead of file.

## 🔒 Security Best Practices

1. **Never commit credentials.json to git**
2. **Rotate service account keys periodically**
3. **Use principle of least privilege**
4. **Monitor API usage in Google Cloud Console**
5. **Set up alerts for unusual activity**
6. **Keep credentials.json secure**

## 📊 Sheet Structure

The system expects the following structure:

### Tab: Reservations
Columns (in order):
1. ID - Unique identifier
2. Nama - Customer name
3. Email - Customer email
4. Alamat - Customer address
5. Telepon - Customer phone
6. Tanggal - Reservation date
7. Kebutuhan - Service type
8. Merek - AC brand
9. Total Unit - Number of units
10. PK - AC capacity
11. Status - Reservation status (pending/confirmed/completed/cancelled)
12. Created At - Timestamp

## 🚀 Next Steps

After setup:
1. Test the reservation form
2. Verify data syncs to Google Sheets
3. Test admin dashboard CRUD operations
4. Verify changes in admin reflect in Google Sheets
5. Set up monitoring for API usage
