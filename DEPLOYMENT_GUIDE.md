# 🚀 SymptomAI - Complete Deployment Guide

## 📋 Overview
This guide will help you deploy both the frontend (Next.js) and backend (Flask) to make your SymptomAI project live on the internet.

---

## 🎯 Recommended Hosting Setup

### Frontend (Next.js)
**Recommended: Vercel** (Free, Easy, Perfect for Next.js)
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Global CDN
- ✅ Custom domains
- ✅ HTTPS included

### Backend (Flask API)
**Recommended: Render** (Free tier available)
- ✅ Free tier with 750 hours/month
- ✅ Easy Python deployment
- ✅ Automatic HTTPS
- ✅ Environment variables
- ✅ Logs and monitoring

**Alternative: Railway, Heroku, or PythonAnywhere**

---

## 🌐 Option 1: Deploy to Vercel (Frontend) + Render (Backend)

### Step 1: Prepare Your Project

#### A. Create a GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SymptomAI project"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/symptomai.git
git branch -M main
git push -u origin main
```

#### B. Update Backend for Production

Create `backend/requirements.txt` (already exists, verify it has):
```
pandas
Flask
Flask-Cors
fuzzywuzzy
python-Levenshtein
psycopg2-binary
requests
gunicorn
```

Create `backend/Procfile`:
```
web: gunicorn api_server:app
```

Update `backend/api_server.py` to use environment variables:
```python
import os

# At the end of the file, replace:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
```

#### C. Update Frontend for Production

Update `ai-web/next.config.mjs`:
```javascript
/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : "http://127.0.0.1:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
```

---

## 🚀 Step 2: Deploy Backend to Render

### A. Sign Up for Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### B. Configure Backend Service
1. **Connect Repository**: Select your GitHub repo
2. **Settings**:
   - Name: `symptomai-backend`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn api_server:app`
   - Instance Type: `Free`

3. **Environment Variables**:
   - Add any needed variables (none required for basic setup)

4. Click "Create Web Service"

5. **Wait for deployment** (5-10 minutes)

6. **Copy your backend URL**: 
   - Example: `https://symptomai-backend.onrender.com`

### C. Test Backend
```bash
curl https://symptomai-backend.onrender.com/api/health
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### A. Sign Up for Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### B. Import Your Repository
1. Select your GitHub repository
2. Vercel will auto-detect Next.js

### C. Configure Project
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `ai-web`
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `.next` (auto-filled)

### D. Add Environment Variables
Click "Environment Variables" and add:
```
NEXT_PUBLIC_API_URL=https://symptomai-backend.onrender.com
```

### E. Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live!

### F. Get Your URL
- Vercel provides: `https://symptomai-xyz.vercel.app`
- You can add a custom domain later

---

## 🎯 Step 4: Test Your Live Application

### Test Checklist:
- ✅ Visit your Vercel URL
- ✅ Landing page loads correctly
- ✅ Click "Get Started" → Login page
- ✅ Create an account (Signup)
- ✅ Login with credentials
- ✅ Dashboard loads
- ✅ Quick actions work
- ✅ Chat functionality works
- ✅ Logout returns to landing page

---

## 🔧 Alternative Hosting Options

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify:
1. Go to https://netlify.com
2. Drag and drop your `ai-web` folder
3. Or connect GitHub repo
4. Set build command: `npm run build`
5. Set publish directory: `.next`

#### Backend on Railway:
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway auto-detects Python
5. Add environment variables if needed

### Option 3: All-in-One on Railway
1. Deploy both frontend and backend on Railway
2. Two separate services in one project
3. Easy environment variable sharing

---

## 🌍 Custom Domain Setup

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., symptomai.com)
3. Update DNS records as instructed
4. Vercel handles SSL automatically

### For Render (Backend):
1. Go to Service Settings → Custom Domain
2. Add subdomain (e.g., api.symptomai.com)
3. Update DNS records
4. SSL certificate auto-generated

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard:
- View deployment logs
- Monitor performance
- Check analytics
- Manage domains

### Render Dashboard:
- View service logs
- Monitor uptime
- Check resource usage
- Manage environment variables

---

## 🔒 Security Considerations

### Before Going Live:
1. **Environment Variables**: Never commit API keys or secrets
2. **CORS**: Update CORS settings in backend for production domain
3. **Rate Limiting**: Add rate limiting to API endpoints
4. **Database**: Consider upgrading from in-memory to PostgreSQL
5. **Authentication**: Add JWT tokens for better security
6. **HTTPS**: Both Vercel and Render provide free SSL

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Vercel (Frontend):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Custom domains
- **Cost: FREE**

**Render (Backend):**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic SSL
- ✅ Custom domains
- ⚠️ Sleeps after 15 min inactivity (free tier)
- **Cost: FREE**

**Total Monthly Cost: $0** 🎉

### Paid Upgrades (Optional):
- Vercel Pro: $20/month (more bandwidth, analytics)
- Render Starter: $7/month (no sleep, better performance)

---

## 🚀 Quick Deploy Commands

### One-Time Setup:
```bash
# 1. Commit your code
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy backend to Render (via dashboard)
# 3. Deploy frontend to Vercel (via dashboard)
```

### Future Updates:
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main

# Both Vercel and Render will auto-deploy! 🎉
```

---

## 🎯 Post-Deployment Checklist

- ✅ Backend health check works
- ✅ Frontend loads correctly
- ✅ API calls work from frontend
- ✅ Login/Signup functional
- ✅ Dashboard accessible
- ✅ All features working
- ✅ Mobile responsive
- ✅ HTTPS enabled
- ✅ Custom domain (optional)
- ✅ Analytics setup (optional)

---

## 🐛 Troubleshooting

### Frontend Issues:
**Problem**: API calls fail
**Solution**: Check NEXT_PUBLIC_API_URL environment variable

**Problem**: Build fails
**Solution**: Check build logs in Vercel dashboard

### Backend Issues:
**Problem**: Service won't start
**Solution**: Check logs in Render dashboard, verify requirements.txt

**Problem**: API returns 500 errors
**Solution**: Check application logs, verify data files exist

### CORS Issues:
**Problem**: CORS errors in browser
**Solution**: Update Flask-CORS settings to include your Vercel domain

---

## 📱 Progressive Web App (PWA) - Optional

Make your app installable:

1. Add `ai-web/public/manifest.json`:
```json
{
  "name": "SymptomAI",
  "short_name": "SymptomAI",
  "description": "Your Smart Health Companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. Add to `ai-web/app/layout.tsx`:
```tsx
<link rel="manifest" href="/manifest.json" />
```

---

## 🎉 Success!

Your SymptomAI project is now live on the internet! 🌍

**Share your links:**
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-backend.onrender.com`

**Next Steps:**
1. Share with friends and family
2. Gather feedback
3. Add more features
4. Consider custom domain
5. Monitor usage and performance

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Flask Deployment**: https://flask.palletsprojects.com/en/latest/deploying/

---

**🚀 Your SymptomAI project is ready to change the world! 🌟**