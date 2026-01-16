# 🚀 SymptomAI Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 📋 Pre-Deployment Checklist

### Local Testing
- [ ] Backend runs without errors (`python backend/start_server.py`)
- [ ] Frontend runs without errors (`npm run dev` in ai-web/)
- [ ] All API endpoints work (run `python backend/test_api.py`)
- [ ] Login/Signup functionality works
- [ ] Dashboard loads correctly
- [ ] Chat responds to messages
- [ ] Quick action modals work
- [ ] Profile dropdown functions properly
- [ ] Settings modal saves changes
- [ ] Logout redirects correctly

### Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors (`npm run build` in ai-web/)
- [ ] No Python errors or warnings
- [ ] All files saved and committed
- [ ] .gitignore properly configured
- [ ] No sensitive data in code (API keys, passwords)

### Configuration Files
- [ ] `backend/requirements.txt` includes all dependencies
- [ ] `backend/Procfile` exists with correct content
- [ ] `ai-web/next.config.mjs` uses environment variable
- [ ] `ai-web/.env.example` created
- [ ] `.gitignore` excludes sensitive files

## 🔧 GitHub Setup

- [ ] GitHub account created
- [ ] Git installed locally
- [ ] Repository initialized (`git init`)
- [ ] All files added (`git add .`)
- [ ] Initial commit created (`git commit -m "Initial commit"`)
- [ ] GitHub repository created (PUBLIC)
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push -u origin main`)
- [ ] Repository visible on GitHub

## 🖥️ Backend Deployment (Render)

### Account Setup
- [ ] Render account created (https://render.com)
- [ ] GitHub connected to Render

### Service Configuration
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Service name: `symptom-ai-backend` (or similar)
- [ ] Region selected (closest to users)
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: `Python 3`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn api_server:app`
- [ ] Instance Type: `Free`

### Deployment
- [ ] Service deployed successfully
- [ ] Build logs show no errors
- [ ] Service status shows "Live"
- [ ] Backend URL copied (e.g., `https://symptom-ai-backend-xxxx.onrender.com`)

### Testing
- [ ] Health endpoint works: `https://your-backend.onrender.com/api/health`
- [ ] Root endpoint works: `https://your-backend.onrender.com/`
- [ ] Returns JSON response
- [ ] No CORS errors

## 🎨 Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub connected to Vercel

### Project Configuration
- [ ] New Project created
- [ ] GitHub repository imported
- [ ] Framework Preset: `Next.js` (auto-detected)
- [ ] Root Directory: `ai-web`
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `npm install` (default)

### Environment Variables
- [ ] Environment Variables section opened
- [ ] Variable added:
  - Name: `NEXT_PUBLIC_API_URL`
  - Value: Your Render backend URL (no trailing slash)
  - Example: `https://symptom-ai-backend-xxxx.onrender.com`
- [ ] Variable enabled for Production, Preview, and Development

### Deployment
- [ ] Project deployed successfully
- [ ] Build logs show no errors
- [ ] Deployment status shows "Ready"
- [ ] Frontend URL copied (e.g., `https://symptom-ai-xxxx.vercel.app`)

## ✅ Post-Deployment Testing

### Landing Page
- [ ] Landing page loads
- [ ] All sections visible (Hero, Features, About, Contact)
- [ ] Navigation menu works
- [ ] "Get Started" button links to login
- [ ] Smooth scrolling works
- [ ] Mobile responsive

### Authentication Flow
- [ ] Click "Get Started" → redirects to `/login`
- [ ] Login page loads correctly
- [ ] "Sign up here" link works
- [ ] Signup page loads correctly
- [ ] Can create new account:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `Test123!`
- [ ] Redirects to dashboard after signup
- [ ] Can logout and login again
- [ ] "Back to home" link works

### Dashboard
- [ ] Dashboard loads after login
- [ ] Username displays in profile
- [ ] Chat interface visible
- [ ] Can send messages
- [ ] Bot responds to greetings ("hello")
- [ ] Bot analyzes symptoms ("fever, cough")
- [ ] Quick action buttons work:
  - [ ] Check Symptoms modal opens
  - [ ] Heart Health modal opens
  - [ ] Preventive Care modal opens
  - [ ] Medication Reminder modal opens
- [ ] Forms submit to chat
- [ ] Profile dropdown works:
  - [ ] Download App modal opens
  - [ ] Settings modal opens
  - [ ] Contact Us modal opens
  - [ ] Logout works

### Settings Modal
- [ ] All 5 tabs visible (Profile, Notifications, Privacy, Appearance, About)
- [ ] Can edit profile information
- [ ] Changes save successfully
- [ ] Username updates in profile dropdown
- [ ] Close button works
- [ ] Click outside closes modal

### Mobile Testing
- [ ] Open on mobile browser
- [ ] Landing page responsive
- [ ] Login page responsive
- [ ] Signup page responsive
- [ ] Dashboard responsive
- [ ] Chat works on mobile
- [ ] Modals work on mobile
- [ ] All buttons clickable
- [ ] Text readable

### Performance
- [ ] Pages load in < 3 seconds
- [ ] No console errors
- [ ] No network errors
- [ ] Images load correctly
- [ ] Animations smooth
- [ ] Backend responds (may be slow on first request if sleeping)

## 🔍 Monitoring Setup

### Render Dashboard
- [ ] Bookmark backend service URL
- [ ] Check logs for errors
- [ ] Monitor service status
- [ ] Note free tier limitations (sleeps after 15 min)

### Vercel Dashboard
- [ ] Bookmark frontend project URL
- [ ] Check deployment logs
- [ ] Monitor analytics (optional)
- [ ] Check function logs (optional)

## 📱 Sharing Your App

- [ ] Frontend URL saved: `_______________________________`
- [ ] Backend URL saved: `_______________________________`
- [ ] Test both URLs work
- [ ] Share with friends/family
- [ ] Collect feedback
- [ ] Note any issues

## 🎯 Optional Enhancements

- [ ] Custom domain configured (Vercel)
- [ ] Custom domain configured (Render)
- [ ] Google Analytics added
- [ ] Error tracking setup (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Social media preview images
- [ ] Favicon updated
- [ ] PWA manifest added

## 🐛 Troubleshooting

If something doesn't work:

### Backend Issues
- [ ] Check Render logs for errors
- [ ] Verify all dependencies in requirements.txt
- [ ] Ensure Procfile is correct
- [ ] Check service is "Live" not "Suspended"
- [ ] Try manual deploy from Render dashboard

### Frontend Issues
- [ ] Check Vercel build logs
- [ ] Verify `NEXT_PUBLIC_API_URL` is set correctly
- [ ] Check browser console for errors
- [ ] Verify backend is running (visit backend URL)
- [ ] Try redeploying from Vercel dashboard

### Connection Issues
- [ ] Backend URL has no trailing slash
- [ ] Backend is awake (visit health endpoint)
- [ ] CORS is enabled (already configured)
- [ ] Environment variable is correct
- [ ] Clear browser cache

### Need Help?
- [ ] Review DEPLOYMENT_GUIDE.md
- [ ] Check Render documentation
- [ ] Check Vercel documentation
- [ ] Review error logs carefully
- [ ] Test locally first

## ✨ Success Criteria

Your deployment is successful when:

✅ Landing page loads on Vercel URL
✅ Can create account and login
✅ Dashboard displays username
✅ Chat responds to messages
✅ All quick actions work
✅ Settings can be updated
✅ Logout returns to landing page
✅ Works on mobile devices
✅ No console errors
✅ Backend health check passes

## 🎉 Congratulations!

Once all items are checked, your SymptomAI application is:
- ✅ Live on the internet
- ✅ Accessible worldwide
- ✅ Running on professional infrastructure
- ✅ Completely free to host
- ✅ Ready to share with others

**Next Steps:**
1. Share your app URL
2. Gather user feedback
3. Plan new features
4. Keep improving!

---

**Deployment Date**: _______________
**Frontend URL**: _______________
**Backend URL**: _______________
**Status**: ⬜ In Progress  ⬜ Complete  ⬜ Issues

**Notes:**
_______________________________________
_______________________________________
_______________________________________
