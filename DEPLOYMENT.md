# Deployment Guide

## Overview
This guide covers deploying the Macro Market Analyzer to production environments.

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier is sufficient)

### Steps

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repository
- Select `frontend` as the root directory

3. **Configure Build Settings**
- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

4. **Set Environment Variables**
Add in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

5. **Deploy**
Click "Deploy" and wait for build to complete.

### Custom Domain (Optional)
- Go to project settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

## Backend Deployment (Render)

### Prerequisites
- GitHub account
- Render account (free tier available)

### Steps

1. **Push Code to GitHub** (if not already done)

2. **Create New Web Service**
- Go to [render.com](https://render.com)
- Click "New" → "Web Service"
- Connect your GitHub repository

3. **Configure Service**
- **Name:** macro-market-analyzer-api
- **Root Directory:** `backend`
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`
- **Instance Type:** Free

4. **Set Environment Variables**
```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
ALPHA_VANTAGE_API_KEY=your_key_here (optional)
```

5. **Deploy**
Click "Create Web Service"

### Important Notes
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading for production use

## Backend Deployment (Railway)

### Alternative to Render

1. **Create New Project**
- Go to [railway.app](https://railway.app)
- Click "New Project" → "Deploy from GitHub repo"

2. **Configure**
- Select repository
- Set root directory: `backend`
- Railway auto-detects Node.js

3. **Environment Variables**
Same as Render configuration

4. **Deploy**
Railway automatically deploys on push to main branch

## Alternative: Single Server Deployment

### Using a VPS (DigitalOcean, AWS EC2, etc.)

1. **SSH into Server**
```bash
ssh user@your-server-ip
```

2. **Install Dependencies**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install nginx
```

3. **Clone and Setup**
```bash
git clone <your-repo-url>
cd macro-market-analyzer

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with production values
cd ..

# Setup frontend
cd frontend
npm install
npm run build
cd ..
```

4. **Configure PM2**
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

5. **Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. **Configure Nginx**
Create `/etc/nginx/sites-available/macro-analyzer`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/macro-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment (Optional)

### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend API responds to health check
- [ ] Data loads correctly on dashboard
- [ ] Charts render properly
- [ ] Dark mode toggle works
- [ ] Date range filtering functions
- [ ] CSV export works
- [ ] Mobile responsiveness verified
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] SSL certificate installed (production)
- [ ] Error tracking configured (optional)
- [ ] Analytics added (optional)

## Monitoring

### Recommended Tools
- **Uptime:** UptimeRobot, Pingdom
- **Errors:** Sentry
- **Analytics:** Google Analytics, Plausible
- **Performance:** Vercel Analytics, Lighthouse CI

### Health Check Endpoints
```
Frontend: https://your-domain.com
Backend: https://your-api-domain.com/health
```

## Troubleshooting

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies installed
- Review build logs for errors

### API Connection Issues
- Verify CORS settings
- Check environment variables
- Ensure backend is running

### Performance Issues
- Enable caching
- Use CDN for static assets
- Optimize images
- Enable gzip compression

## Cost Estimates

### Free Tier (Hobby Projects)
- Vercel: Free
- Render: Free (with limitations)
- Railway: $5 credit/month
- **Total:** $0-5/month

### Production (Small Scale)
- Vercel Pro: $20/month
- Render Starter: $7/month
- Domain: $12/year
- **Total:** ~$28/month

## Security Recommendations

1. Use environment variables for secrets
2. Enable HTTPS only
3. Set appropriate CORS origins
4. Add rate limiting in production
5. Regular dependency updates
6. Monitor for security vulnerabilities

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review logs weekly
- Monitor performance
- Backup data (if modified)
- Test after updates

### Update Process
```bash
git pull origin main
cd backend && npm install && pm2 restart backend
cd ../frontend && npm install && npm run build && pm2 restart frontend
```

---

For issues or questions, refer to the main README.md or open a GitHub issue.
