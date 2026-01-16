# 🚀 Step-by-Step Deployment Guide
## From Zero to Live in 30 Minutes

This guide will walk you through deploying your SymptomAI application step by step, from preparing your code to having it live on the internet.

---

## 📋 What You'll Need

Before starting, make sure you have:
- [ ] A GitHub account (free) - [Sign up here](https://github.com/join)
- [ ] Git installed on your computer - [Download here](https://git-scm.com/downloads)
- [ ] Your project code ready (you have this!)

---

## 🎯 Deployment Strategy

We'll deploy:
- **Backend (Flask API)** → Render.com (Free)
- **Frontend (Next.js)** → Vercel.com (Free)

**Total Cost: $0/month** 💰

---

# PART 1: PREPARE YOUR CODE (5 minutes)

## Step 1.1: Verify Backend Files

First, let's make sure your backend is ready for deployment.

**Check that these files exist:**

1. Open `backend/requirements.txt` - should contain:
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

2. Open `backend/Procfile` - should contain:
```
web: gunicorn api_server:app
```

3. Open `backend/api_server.py` - verify the last lines look like:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
```

✅ **All good? Continue to Step 1.2**

---

## Step 1.2: Verify Frontend Configuration

Check your frontend is ready:

1. Open `ai-web/.env.example` - should contain:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

2. Open `ai-web/next.config.mjs` - should have the rewrites section with environment variable support

✅ **All good? Continue to Part 2**

---

# PART 2: PUSH TO GITHUB (10 minutes)

## Step 2.1: Initialize Git Repository

Open your terminal in the project root folder and run:

```bash
git init
```

You should see: `Initialized empty Git repository`

---

## Step 2.2: Add All Files

```bash
git add .
```

This stages all your files for commit.

---

## Step 2.3: Create First Commit

```bash
git commit -m "Initial commit - SymptomAI ready for deployment"
```

You should see a summary of files added.

---

## Step 2.4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name**: `symptom-ai` (or your preferred name)
   - **Description**: "AI-powered health symptom analyzer"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **Create repository**

---

## Step 2.5: Connect and Push

GitHub will show you commands. Copy and run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

You should see your files uploading. When done, refresh GitHub - you'll see all your files!

✅ **Code is on GitHub! Continue to Part 3**

---

# PART 3: DEPLOY BACKEND TO RENDER (10 minutes)

## Step 3.1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Click **Get Started** or **Sign Up**
3. Choose **Sign up with GitHub** (easiest option)
4. Authorize Render to access your GitHub

---

## Step 3.2: Create New Web Service

1. In Render dashboard, click **New +** (top right)
2. Select **Web Service**
3. Click **Connect** next to your `symptom-ai` repository
   - If you don't see it, click **Configure account** and grant access

---

## Step 3.3: Configure Backend Service

Fill in these settings **exactly**:

| Setting | Value |
|---------|-------|
| **Name** | `symptom-ai-backend` |
| **Region** | Choose closest to you (e.g., Oregon, Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn api_server:app` |
| **Instance Type** | `Free` |

---

## Step 3.4: Deploy Backend

1. Scroll down and click **Create Web Service**
2. Render will start building your backend
3. Watch the logs - you'll see:
   - Installing dependencies
   - Starting gunicorn
   - "Your service is live" 🎉

**This takes 5-10 minutes** ⏱️

---

## Step 3.5: Get Your Backend URL

1. At the top of the page, you'll see your service URL
2. It looks like: `https://symptom-ai-backend-xxxx.onrender.com`
3. **COPY THIS URL** - you'll need it for the frontend!

---

## Step 3.6: Test Your Backend

Open a new browser tab and visit:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{
  "status": "healthy",
  "message": "SymptomAI API is running",
  "timestamp": "..."
}
```

✅ **Backend is live! Continue to Part 4**

---

# PART 4: DEPLOY FRONTEND TO VERCEL (10 minutes)

## Step 4.1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub

---

## Step 4.2: Import Your Project

1. In Vercel dashboard, click **Add New...** → **Project**
2. Find your `symptom-ai` repository
3. Click **Import**

---

## Step 4.3: Configure Frontend

Vercel will auto-detect Next.js. Configure these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | Click **Edit** → Select `ai-web` |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |

---

## Step 4.4: Add Environment Variable

**This is crucial!** 🔑

1. Click **Environment Variables** section
2. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`
   - **IMPORTANT**: Use YOUR actual Render URL from Step 3.5
   - **IMPORTANT**: NO trailing slash at the end!

Example:
```
NEXT_PUBLIC_API_URL=https://symptom-ai-backend-xxxx.onrender.com
```

3. Click **Add**

---

## Step 4.5: Deploy Frontend

1. Click **Deploy** button
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your Next.js app
   - Deploy to their global CDN

**This takes 3-5 minutes** ⏱️

---

## Step 4.6: Get Your Frontend URL

1. When deployment completes, you'll see: **🎉 Congratulations!**
2. Your app URL will be shown: `https://symptom-ai-xxxx.vercel.app`
3. Click **Visit** to open your live app!

✅ **Frontend is live! Continue to Part 5**

---

# PART 5: TEST YOUR LIVE APP (5 minutes)

## Step 5.1: Open Your App

Visit your Vercel URL: `https://symptom-ai-xxxx.vercel.app`

---

## Step 5.2: Test Complete Flow

Follow this checklist:

### Landing Page
- [ ] Page loads with animations
- [ ] "Get Started" button visible
- [ ] Click "Get Started"

### Signup
- [ ] Redirects to `/signup`
- [ ] Fill in:
  - Name: `Test User`
  - Email: `test@example.com`
  - Password: `password123`
- [ ] Click "Sign Up"
- [ ] Should redirect to dashboard

### Dashboard
- [ ] Dashboard loads successfully
- [ ] Your name appears in top right
- [ ] Quick action cards visible
- [ ] Chat interface visible

### Chat Test
- [ ] Type: `hello`
- [ ] Press Enter
- [ ] Should get a greeting response
- [ ] Type: `I have fever and cough`
- [ ] Press Enter
- [ ] Should get symptom analysis

### Quick Actions
- [ ] Click "Check Symptoms" card
- [ ] Modal opens
- [ ] Close modal
- [ ] Try other quick actions

### Logout
- [ ] Click profile dropdown (top right)
- [ ] Click "Logout"
- [ ] Returns to landing page

---

## Step 5.3: Test Login

- [ ] Click "Get Started" again
- [ ] Click "Login" link
- [ ] Enter credentials from signup
- [ ] Should login successfully

✅ **Everything works? You're done!** 🎉

---

# 🎉 SUCCESS! YOUR APP IS LIVE!

## Your Live URLs

**Frontend (User-facing app):**
```
https://symptom-ai-xxxx.vercel.app
```

**Backend (API):**
```
https://symptom-ai-backend-xxxx.onrender.com
```

---

## 📱 Share Your App

You can now share your frontend URL with anyone! They can:
- Create accounts
- Use the symptom checker
- Chat with the AI
- Access all features

---

## 🔄 How to Update Your App

Made changes to your code? Deploy updates easily:

```bash
# 1. Make your changes in code

# 2. Commit changes
git add .
git commit -m "Description of what you changed"

# 3. Push to GitHub
git push

# 4. Both Vercel and Render will automatically redeploy! ✨
```

No need to do anything else - automatic deployments are set up!

---

## 🐛 Troubleshooting

### Problem: Backend returns 404 or errors

**Solution:**
1. Go to Render dashboard
2. Click on your service
3. Check the "Logs" tab
4. Look for error messages

### Problem: Frontend can't connect to backend

**Solution:**
1. Go to Vercel dashboard
2. Click on your project
3. Go to Settings → Environment Variables
4. Verify `NEXT_PUBLIC_API_URL` is correct
5. Make sure there's NO trailing slash
6. Redeploy if you made changes

### Problem: Backend is slow on first request

**Explanation:**
- Free tier on Render "sleeps" after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Subsequent requests are fast
- This is normal for free tier!

**Solution:**
- Upgrade to paid tier ($7/month) for always-on service
- Or accept the occasional slow first request

### Problem: Chat doesn't respond

**Solution:**
1. Open browser console (F12)
2. Look for errors
3. Check if API calls are reaching backend
4. Verify backend is awake (visit health endpoint)

---

## 💰 Cost Breakdown

### Current Setup (FREE)

**Vercel:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL (HTTPS)
- ✅ Global CDN
- ✅ Custom domains
- **Cost: $0/month**

**Render:**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic SSL (HTTPS)
- ✅ Custom domains
- ⚠️ Sleeps after 15 min inactivity
- **Cost: $0/month**

**Total: $0/month** 🎉

### Optional Upgrades

**Render Starter ($7/month):**
- No sleep (always-on)
- Better performance
- More resources

**Vercel Pro ($20/month):**
- More bandwidth
- Analytics
- Team features

---

## 🌐 Add Custom Domain (Optional)

Want `symptomai.com` instead of `vercel.app`?

### For Frontend (Vercel):
1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel: Project Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate auto-generated

### For Backend (Render):
1. Use subdomain: `api.symptomai.com`
2. In Render: Service Settings → Custom Domain
3. Add subdomain
4. Update DNS records
5. SSL certificate auto-generated

---

## 📊 Monitor Your App

### Vercel Dashboard
- View deployment history
- Check build logs
- Monitor performance
- See analytics (Pro plan)

### Render Dashboard
- View service logs
- Monitor uptime
- Check resource usage
- See deployment history

---

## 🔒 Security Best Practices

Before sharing widely:

1. **Never commit secrets**: Keep API keys in environment variables
2. **Add rate limiting**: Prevent API abuse
3. **Use HTTPS**: Already enabled by default
4. **Validate inputs**: Add input validation to forms
5. **Consider authentication**: Add JWT tokens for better security
6. **Database**: Consider upgrading from in-memory to PostgreSQL

---

## 📚 Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Render Documentation**: https://render.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Flask Deployment**: https://flask.palletsprojects.com/en/latest/deploying/

---

## 🎯 Next Steps

Now that your app is live, consider:

1. **Gather Feedback**: Share with friends and family
2. **Add Features**: Implement new functionality
3. **Improve UI**: Refine the design
4. **Add Analytics**: Track usage patterns
5. **Custom Domain**: Get a professional domain name
6. **Database**: Upgrade to persistent storage
7. **Mobile App**: Consider React Native version

---

## 🎊 Congratulations!

You've successfully deployed a full-stack AI application to the internet!

**You now have:**
- ✅ Live frontend on Vercel
- ✅ Live backend on Render
- ✅ Automatic deployments from GitHub
- ✅ HTTPS security
- ✅ Global CDN distribution
- ✅ Professional hosting
- ✅ $0/month cost

**Share your creation with the world!** 🌍

---

**Questions or issues?** Check the troubleshooting section or review the detailed guides in the project documentation.

**Happy deploying!** 🚀
