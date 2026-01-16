# ✅ Simple Deployment Checklist

Print this out or keep it open while deploying!

---

## 🎯 PART 1: PREPARE (5 min)

- [ ] Verify `backend/requirements.txt` has `gunicorn`
- [ ] Verify `backend/Procfile` exists
- [ ] Verify `backend/api_server.py` uses `PORT` environment variable
- [ ] Verify `ai-web/next.config.mjs` has environment variable support

---

## 🎯 PART 2: GITHUB (10 min)

- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Create repository on GitHub.com
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify files appear on GitHub

---

## 🎯 PART 3: BACKEND - RENDER (10 min)

- [ ] Go to Render.com
- [ ] Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect your repository
- [ ] Configure:
  - Name: `symptom-ai-backend`
  - Root Directory: `backend`
  - Runtime: `Python 3`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `gunicorn api_server:app`
  - Instance Type: `Free`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 min)
- [ ] Copy backend URL: `https://symptom-ai-backend-xxxx.onrender.com`
- [ ] Test: Visit `https://your-backend-url/api/health`
- [ ] Should see: `{"status": "healthy", ...}`

---

## 🎯 PART 4: FRONTEND - VERCEL (10 min)

- [ ] Go to Vercel.com
- [ ] Sign up with GitHub
- [ ] Click "Add New..." → "Project"
- [ ] Import your repository
- [ ] Configure:
  - Framework: `Next.js` (auto-detected)
  - Root Directory: `ai-web`
  - Build Command: `npm run build`
  - Output Directory: `.next`
- [ ] Add Environment Variable:
  - Name: `NEXT_PUBLIC_API_URL`
  - Value: `https://your-backend-url.onrender.com` (NO trailing slash!)
- [ ] Click "Deploy"
- [ ] Wait for deployment (3-5 min)
- [ ] Copy frontend URL: `https://symptom-ai-xxxx.vercel.app`

---

## 🎯 PART 5: TEST (5 min)

- [ ] Visit your Vercel URL
- [ ] Landing page loads
- [ ] Click "Get Started"
- [ ] Create account (signup)
- [ ] Dashboard loads
- [ ] Type "hello" in chat
- [ ] Get response
- [ ] Type "fever and cough"
- [ ] Get symptom analysis
- [ ] Click quick action cards
- [ ] Logout works
- [ ] Login works

---

## 🎉 DONE!

**Your URLs:**
- Frontend: `https://symptom-ai-xxxx.vercel.app`
- Backend: `https://symptom-ai-backend-xxxx.onrender.com`

**Share your app with the world!** 🌍

---

## 🔄 To Update Later:

```bash
git add .
git commit -m "Your changes"
git push
```

Both services auto-deploy! ✨

---

## 🐛 Quick Fixes:

**Backend slow?** → First request after sleep takes 30-60 seconds (normal for free tier)

**Frontend can't connect?** → Check `NEXT_PUBLIC_API_URL` in Vercel settings (no trailing slash!)

**Build failed?** → Check logs in Render/Vercel dashboard

---

**Total Time: ~30 minutes**
**Total Cost: $0/month**
