# Deployment Guide - Xayara Indonesia

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from client folder:
```bash
cd client
vercel
```

3. Configure environment variables in Vercel dashboard if needed

#### Backend Deployment (Render)
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure build settings:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node server.js`
5. Add environment variables:
   - `PORT`: 5000
   - `JWT_SECRET`: your-secret-key
   - `GOOGLE_SHEET_ID`: your-sheet-id
   - `GOOGLE_CLIENT_EMAIL`: your-service-account-email
   - `GOOGLE_PRIVATE_KEY`: your-private-key (with \n for line breaks)
6. Deploy

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend Deployment (Netlify)
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

#### Backend Deployment (Heroku)
1. Install Heroku CLI:
```bash
npm install -g heroku
```

2. Login and create app:
```bash
heroku login
heroku create xayara-backend
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set GOOGLE_SHEET_ID=your-sheet-id
heroku config:set GOOGLE_CLIENT_EMAIL=your-service-account-email
heroku config:set GOOGLE_PRIVATE_KEY="your-private-key"
```

4. Deploy:
```bash
git push heroku main
```

### Option 3: Single Server Deployment (VPS)

1. Prepare server (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm nginx -y
```

2. Clone repository:
```bash
git clone <your-repo-url>
cd "Xayara Indonesia"
```

3. Install dependencies:
```bash
cd server && npm install
cd ../client && npm install
```

4. Build frontend:
```bash
npm run build
```

5. Setup PM2 for backend:
```bash
cd ../server
npm install -g pm2
pm2 start server.js --name xayara-api
pm2 save
pm2 startup
```

6. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/Xayara Indonesia/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Restart Nginx:
```bash
sudo systemctl restart nginx
```

## 🔒 Security Checklist for Production

- [ ] Change default admin credentials
- [ ] Use strong JWT secret
- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for your domain
- [ ] Implement database for user management
- [ ] Add logging and monitoring
- [ ] Regular security updates

## 📊 Google Sheets Setup for Production

1. Create a dedicated Google Sheet
2. Share with Service Account email (Editor access)
3. Create tab named "Reservations"
4. Add headers in first row:
   - ID, Nama, Email, Alamat, Telepon, Tanggal, Kebutuhan, Merek, Total Unit, PK, Status, Created At
5. Test API connection
6. Monitor sync status

## 🌐 Domain Configuration

1. Point your domain to the deployment platform
2. Configure DNS records:
   - A record: @ → server IP
   - CNAME: www → @
3. Enable SSL certificate
4. Update any hardcoded URLs in code

## 📈 Monitoring

### Recommended Tools
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Analytics**: Google Analytics
- **Logs**: Papertrail, Logtail

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Add your deployment commands
          
      - name: Deploy Frontend
        run: |
          cd client
          npm install
          npm run build
          # Add deployment commands
```

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs xayara-api`
- Verify environment variables
- Test API endpoints
- Check Google Sheets permissions
