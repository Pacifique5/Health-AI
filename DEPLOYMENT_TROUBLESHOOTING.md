# 🔧 Deployment Troubleshooting Guide

Common issues and how to fix them.

---

## 🚨 BACKEND ISSUES

### Problem 1: Backend Build Fails on Render

**Symptoms:**
- Build logs show errors
- Service won't start
- Red "Build failed" status

**Solutions:**

1. **Check requirements.txt**
   ```
   # Make sure it includes:
   pandas
   Flask
   Flask-Cors
   fuzzywuzzy
   python-Levenshtein
   psycopg2-binary
   requests
   gunicorn
   ```

2. **Verify Procfile exists**
   ```
   # backend/Procfile should contain:
   web: gunicorn api_server:app
   ```

3. **Check Python version**
   - Render uses Python 3.11 by default
   - If issues, add `runtime.txt`:
   ```
   python-3.11.0
   ```

4. **Check build logs**
   - Go to Render dashboard
   - Click your service
   - Click "Logs" tab
   - Look for specific error messages

---

### Problem 2: Backend Returns 404 Errors

**Symptoms:**
- Service is running
- But API endpoints return 404

**Solutions:**

1. **Check Root Directory**
   - In Render settings
   - Should be: `backend`
   - Not: `/backend` or `./backend`

2. **Verify Start Command**
   - Should be: `gunicorn api_server:app`
   - Not: `python api_server.py`

3. **Check file structure**
   ```
   backend/
   ├── api_server.py  ← Must exist
   ├── Procfile
   └── requirements.txt
   ```

---

### Problem 3: Backend is Very Slow

**Symptoms:**
- First request takes 30-60 seconds
- Subsequent requests are fast

**Explanation:**
- This is NORMAL for Render free tier
- Service "sleeps" after 15 minutes of inactivity
- First request "wakes it up"

**Solutions:**

1. **Accept it** (it's free!)
   - Just wait for first request
   - Tell users it may take a moment

2. **Upgrade to paid tier** ($7/month)
   - Go to Render dashboard
   - Click your service
   - Click "Upgrade"
   - Select "Starter" plan
   - Service stays awake 24/7

3. **Keep it awake** (free workaround)
   - Use a service like UptimeRobot
   - Ping your backend every 10 minutes
   - Prevents sleeping

---

### Problem 4: Backend Crashes After Deployment

**Symptoms:**
- Service starts but then crashes
- Logs show errors

**Solutions:**

1. **Check logs for errors**
   ```
   Common errors:
   - ModuleNotFoundError → Missing dependency
   - FileNotFoundError → Missing data files
   - Port binding error → Wrong PORT usage
   ```

2. **Verify data files exist**
   ```
   backend/data/
   ├── dataset.csv
   ├── Disease precaution.csv
   ├── DiseaseAndSymptoms.csv
   └── ... (all CSV files)
   ```

3. **Check environment variables**
   - In Render dashboard
   - Service Settings → Environment
   - Add any missing variables

---

## 🎨 FRONTEND ISSUES

### Problem 5: Frontend Build Fails on Vercel

**Symptoms:**
- Build fails during deployment
- Red error status

**Solutions:**

1. **Check Root Directory**
   - In Vercel settings
   - Should be: `ai-web`
   - Click "Edit" next to Root Directory

2. **Verify package.json**
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start"
     }
   }
   ```

3. **Check build logs**
   - Vercel dashboard
   - Click deployment
   - View build logs
   - Look for specific errors

4. **Common build errors:**
   - TypeScript errors → Fix in code
   - Missing dependencies → Check package.json
   - ESLint errors → Fix or disable

---

### Problem 6: Frontend Can't Connect to Backend

**Symptoms:**
- Frontend loads
- But API calls fail
- Chat doesn't work
- Login doesn't work

**Solutions:**

1. **Check Environment Variable**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_URL` exists
   - Should be: `https://your-backend.onrender.com`
   - **NO trailing slash!**

2. **Verify backend URL is correct**
   ```
   ✅ https://symptom-ai-backend-xxxx.onrender.com
   ❌ https://symptom-ai-backend-xxxx.onrender.com/
   ❌ http://symptom-ai-backend-xxxx.onrender.com
   ❌ https://symptom-ai-backend-xxxx.onrender.com/api
   ```

3. **Redeploy after changing env vars**
   - Vercel → Deployments
   - Click "..." menu
   - Click "Redeploy"

4. **Check browser console**
   - Press F12
   - Go to Console tab
   - Look for CORS or network errors

---

### Problem 7: CORS Errors in Browser

**Symptoms:**
- Browser console shows CORS errors
- "Access-Control-Allow-Origin" errors

**Solutions:**

1. **Verify Flask-CORS is installed**
   ```python
   # In backend/api_server.py
   from flask_cors import CORS
   CORS(app)
   ```

2. **Update CORS settings**
   ```python
   # More specific CORS (optional)
   CORS(app, origins=[
       "https://your-app.vercel.app",
       "http://localhost:3000"
   ])
   ```

3. **Redeploy backend**
   - Push changes to GitHub
   - Render auto-deploys

---

### Problem 8: Page Shows 404 on Refresh

**Symptoms:**
- App works when navigating
- But refreshing page shows 404

**Solutions:**

1. **This shouldn't happen with Next.js**
   - Next.js handles routing automatically

2. **If it does happen:**
   - Check Vercel settings
   - Verify Framework is "Next.js"
   - Redeploy

---

## 🔗 CONNECTION ISSUES

### Problem 9: "Failed to Fetch" Errors

**Symptoms:**
- Network errors in console
- API calls timeout

**Solutions:**

1. **Check backend is awake**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Wait 30-60 seconds if sleeping
   - Should return JSON

2. **Check backend URL in code**
   ```typescript
   // In ai-web/lib/api.ts
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
   ```

3. **Verify environment variable**
   - Vercel dashboard
   - Check `NEXT_PUBLIC_API_URL`
   - Must start with `https://`

---

### Problem 10: Mixed Content Errors

**Symptoms:**
- "Mixed content" warnings
- Some resources blocked

**Solutions:**

1. **Ensure backend uses HTTPS**
   - Render provides HTTPS automatically
   - URL should start with `https://`

2. **Update environment variable**
   ```
   ✅ NEXT_PUBLIC_API_URL=https://backend.onrender.com
   ❌ NEXT_PUBLIC_API_URL=http://backend.onrender.com
   ```

---

## 🔐 AUTHENTICATION ISSUES

### Problem 11: Login Doesn't Work

**Symptoms:**
- Login form submits
- But doesn't redirect
- Or shows error

**Solutions:**

1. **Check browser console**
   - F12 → Console
   - Look for API errors

2. **Test backend directly**
   ```bash
   curl -X POST https://your-backend.onrender.com/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. **Verify user exists**
   - Try signup first
   - Then login with same credentials

4. **Check localStorage**
   - F12 → Application → Local Storage
   - Should see `user` and `token` after login

---

### Problem 12: Session Lost on Refresh

**Symptoms:**
- Login works
- But refresh logs you out

**Solutions:**

1. **Check localStorage persistence**
   ```javascript
   // Should be in code:
   localStorage.setItem('user', JSON.stringify(user));
   localStorage.setItem('token', token);
   ```

2. **Verify AuthGuard**
   ```typescript
   // In components/AuthGuard.tsx
   useEffect(() => {
     const user = localStorage.getItem('user');
     const token = localStorage.getItem('token');
     // ... check and redirect
   }, []);
   ```

---

## 📱 MOBILE ISSUES

### Problem 13: App Doesn't Work on Mobile

**Symptoms:**
- Works on desktop
- Broken on mobile

**Solutions:**

1. **Check responsive design**
   - Use browser dev tools
   - Toggle device toolbar (Ctrl+Shift+M)
   - Test different screen sizes

2. **Check mobile console**
   - Use remote debugging
   - Chrome: chrome://inspect
   - Safari: Develop menu

3. **Test on real device**
   - Visit your Vercel URL on phone
   - Check for errors

---

## 🐛 GENERAL DEBUGGING

### Problem 14: "Something Went Wrong"

**Generic troubleshooting steps:**

1. **Check all logs**
   - Vercel: Deployment logs
   - Render: Service logs
   - Browser: Console (F12)

2. **Verify all URLs**
   - Backend URL correct?
   - Environment variables set?
   - No typos?

3. **Test each part separately**
   - Backend health check
   - Frontend loads
   - API calls work

4. **Clear cache**
   - Browser cache
   - Vercel cache (redeploy)
   - Render cache (redeploy)

5. **Start fresh**
   - Redeploy backend
   - Redeploy frontend
   - Clear browser data

---

## 🔄 DEPLOYMENT ISSUES

### Problem 15: Changes Not Showing Up

**Symptoms:**
- Pushed to GitHub
- But site unchanged

**Solutions:**

1. **Check GitHub**
   - Verify files updated
   - Check commit history

2. **Check auto-deploy**
   - Vercel: Should auto-deploy
   - Render: Should auto-deploy
   - Check deployment history

3. **Manual redeploy**
   - Vercel: Deployments → Redeploy
   - Render: Manual Deploy → Deploy latest commit

4. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R
   - Or clear cache in settings

---

### Problem 16: Git Push Fails

**Symptoms:**
- Can't push to GitHub
- Authentication errors

**Solutions:**

1. **Check remote URL**
   ```bash
   git remote -v
   # Should show your GitHub repo
   ```

2. **Re-add remote**
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/symptom-ai.git
   ```

3. **Check GitHub authentication**
   - Use personal access token
   - Or SSH keys
   - GitHub Settings → Developer settings

---

## 📊 MONITORING

### How to Check if Everything is Working

1. **Backend Health**
   ```
   Visit: https://your-backend.onrender.com/api/health
   Should return: {"status": "healthy", ...}
   ```

2. **Frontend Status**
   ```
   Visit: https://your-app.vercel.app
   Should load landing page
   ```

3. **API Connection**
   ```
   Login to app
   Try chat
   Should get responses
   ```

4. **Check Dashboards**
   - Vercel: https://vercel.com/dashboard
   - Render: https://render.com/dashboard
   - Look for green status indicators

---

## 🆘 STILL STUCK?

### Getting Help

1. **Check Documentation**
   - STEP_BY_STEP_DEPLOYMENT.md
   - DEPLOYMENT_GUIDE.md
   - README.md

2. **Check Service Status**
   - Vercel Status: https://www.vercel-status.com
   - Render Status: https://status.render.com

3. **Review Logs Carefully**
   - Error messages are your friend
   - Google specific error messages
   - Check Stack Overflow

4. **Common Resources**
   - Vercel Docs: https://vercel.com/docs
   - Render Docs: https://render.com/docs
   - Next.js Docs: https://nextjs.org/docs
   - Flask Docs: https://flask.palletsprojects.com

---

## ✅ PREVENTION CHECKLIST

**Before deploying, verify:**

- [ ] All files committed to Git
- [ ] No sensitive data in code
- [ ] Environment variables documented
- [ ] Dependencies listed correctly
- [ ] Build commands correct
- [ ] Start commands correct
- [ ] Root directories correct
- [ ] HTTPS URLs (not HTTP)
- [ ] No trailing slashes in URLs

---

## 🎯 QUICK FIXES

**Try these first:**

1. Redeploy both services
2. Clear browser cache
3. Check environment variables
4. Verify backend is awake
5. Check all URLs for typos
6. Review logs for errors
7. Test backend health endpoint
8. Hard refresh browser (Ctrl+Shift+R)

---

**Most issues are simple configuration problems!**
**Take your time, check carefully, and you'll get it working!** 💪
