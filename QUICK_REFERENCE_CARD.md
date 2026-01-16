# 🎯 Quick Reference Card - Deployment Commands

**Print this and keep it handy!**

---

## 📦 PART 1: GITHUB (Copy-Paste These)

```bash
# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit - SymptomAI ready for deployment"

# Add remote (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🖥️ PART 2: RENDER BACKEND

**Website:** https://render.com

**Configuration:**

| Field | Value |
|-------|-------|
| Name | `symptom-ai-backend` |
| Region | Choose closest |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn api_server:app` |
| Instance Type | `Free` |

**Test URL:**
```
https://your-backend-url.onrender.com/api/health
```

---

## 🎨 PART 3: VERCEL FRONTEND

**Website:** https://vercel.com

**Configuration:**

| Field | Value |
|-------|-------|
| Framework | `Next.js` (auto) |
| Root Directory | `ai-web` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

**Environment Variable:**
```
Name:  NEXT_PUBLIC_API_URL
Value: https://your-backend-url.onrender.com
```
⚠️ **NO trailing slash!**

---

## ✅ TESTING CHECKLIST

- [ ] Landing page loads
- [ ] Signup works
- [ ] Dashboard loads
- [ ] Chat responds to "hello"
- [ ] Chat analyzes "fever and cough"
- [ ] Quick actions work
- [ ] Logout works
- [ ] Login works

---

## 🔄 UPDATE COMMANDS (After Initial Deploy)

```bash
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push
```

**Both services auto-deploy!** ✨

---

## 🐛 TROUBLESHOOTING

### Backend slow?
- Free tier sleeps after 15 min
- First request takes 30-60 sec
- This is normal!

### Frontend can't connect?
1. Check Vercel → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Ensure NO trailing slash
4. Redeploy if changed

### Build failed?
- Check logs in dashboard
- Verify all files pushed to GitHub
- Check for syntax errors

---

## 📱 YOUR LIVE URLS

**Frontend (share this!):**
```
https://symptom-ai-xxxx.vercel.app
```

**Backend (API):**
```
https://symptom-ai-backend-xxxx.onrender.com
```

---

## 💰 COSTS

**Vercel:** $0/month
**Render:** $0/month
**Total:** $0/month 🎉

---

## 📊 DASHBOARDS

**Monitor your app:**
- Vercel: https://vercel.com/dashboard
- Render: https://render.com/dashboard

---

## 🎯 IMPORTANT NOTES

✅ Always commit before pushing
✅ NO trailing slash in API URL
✅ Backend sleeps on free tier (normal)
✅ Auto-deploy on git push
✅ HTTPS included automatically
✅ Custom domains available

---

## 📞 HELP

**Full Guide:** STEP_BY_STEP_DEPLOYMENT.md
**Checklist:** DEPLOYMENT_CHECKLIST_SIMPLE.md
**Visual:** DEPLOYMENT_VISUAL_GUIDE.md

---

**Time:** ~30 minutes
**Difficulty:** Easy
**Cost:** Free

**You got this!** 🚀
