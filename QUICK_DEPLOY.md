# ⚡ Quick Deploy Reference Card

**Copy-paste commands for fast deployment**

---

## 🎯 Prerequisites

- [ ] Git installed
- [ ] GitHub account
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)

---

## 📦 Step 1: Push to GitHub (5 minutes)

### Windows:
```bash
# Run automated setup
deploy_setup.bat

# Then manually add remote and push:
git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git
git branch -M main
git push -u origin main
```

### Manual:
```bash
git init
git add .
git commit -m "Initial commit - SymptomAI ready for deployment"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend to Render (10 minutes)

### Quick Config:
1. Go to: https://render.com/dashboard
2. Click: **New +** → **Web Service**
3. Connect your GitHub repo
4. Fill in:

```
Name:           symptom-ai-backend
Region:         [Choose closest]
Branch:         main
Root Directory: backend
Runtime:        Python 3
Build Command:  pip install -r requirements.txt
Start Command:  gunicorn api_server:app
Instance Type:  Free
```

5. Click **Create Web Service**
6. Wait 5-10 minutes
7. **Copy your backend URL**: `https://symptom-ai-backend-xxxx.onrender.com`

### Test:
```bash
# Visit in browser:
https://your-backend-url.onrender.com/api/health
# Should return: {"status": "healthy", ...}
```

---

## 🎨 Step 3: Deploy Frontend to Vercel (5 minutes)

### Quick Config:
1. Go to: https://vercel.com/dashboard
2. Click: **Add New...** → **Project**
3. Import your GitHub repo
4. Fill in:

```
Framework:      Next.js (auto-detected)
Root Directory: ai-web
Build Command:  npm run build (default)
Output Dir:     .next (default)
```

5. **Add Environment Variable**:
```
Name:  NEXT_PUBLIC_API_URL
Value: https://your-backend-url.onrender.com
```
(Replace with your actual Render URL, NO trailing slash)

6. Click **Deploy**
7. Wait 3-5 minutes
8. **Copy your frontend URL**: `https://symptom-ai-xxxx.vercel.app`

---

## ✅ Step 4: Test (5 minutes)

Visit your Vercel URL and test:

- [ ] Landing page loads
- [ ] Click "Get Started" → Login page
- [ ] Create account (signup)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Chat responds to "hello"
- [ ] Chat analyzes "fever, cough"
- [ ] Quick action modals work
- [ ] Profile dropdown works
- [ ] Logout works

---

## 🎉 Done!

**Your URLs:**
- Frontend: `https://symptom-ai-xxxx.vercel.app`
- Backend: `https://symptom-ai-backend-xxxx.onrender.com`

**Share your app!** 🌍

---

## 🔄 Update Your App Later

```bash
# Make changes to code
git add .
git commit -m "Description of changes"
git push

# Both Vercel and Render auto-deploy! ✨
```

---

## 🐛 Quick Troubleshooting

### Backend not responding:
- First request after sleep takes 30-60 seconds (free tier)
- Visit backend URL directly to wake it up

### Frontend can't connect:
- Check `NEXT_PUBLIC_API_URL` in Vercel settings
- Ensure no trailing slash in URL
- Verify backend is awake

### Build failed:
- Check logs in Render/Vercel dashboard
- Verify all files committed to GitHub

---

## 📚 Need More Help?

- **Detailed Guide**: DEPLOYMENT_GUIDE.md
- **Checklist**: DEPLOYMENT_CHECKLIST.md
- **Full Docs**: README.md

---

**Total Time: ~25 minutes** ⏱️
**Total Cost: $0/month** 💰
