# 🔧 Render Deployment Fix

## Problem
Render shows: `gunicorn: command not found`

## Solution Applied ✅

I've fixed two things:

### 1. Updated `backend/requirements.txt`
Added specific version numbers to ensure proper installation:
```
pandas==2.0.3
Flask==3.0.0
Flask-Cors==4.0.0
fuzzywuzzy==0.18.0
python-Levenshtein==0.21.1
psycopg2-binary==2.9.9
requests==2.31.0
gunicorn==21.2.0
```

### 2. Created `backend/runtime.txt`
Specifies Python version explicitly:
```
python-3.11.0
```

---

## 🚀 Next Steps

### Option 1: Push Changes and Redeploy (Recommended)

```bash
# Commit the fixes
git add backend/requirements.txt backend/runtime.txt
git commit -m "Fix: Add version pins and runtime.txt for Render deployment"
git push
```

Render will automatically redeploy with the fixes!

---

### Option 2: Manual Redeploy on Render

If you haven't pushed to GitHub yet:

1. **Push the changes first:**
   ```bash
   git add backend/requirements.txt backend/runtime.txt
   git commit -m "Fix: Add version pins and runtime.txt"
   git push
   ```

2. **Then in Render Dashboard:**
   - Go to your service
   - Click "Manual Deploy"
   - Select "Deploy latest commit"
   - Wait for build to complete

---

## ✅ Verify Render Settings

While you're in the Render dashboard, double-check these settings:

| Setting | Correct Value |
|---------|---------------|
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn api_server:app` |
| **Python Version** | 3.11.0 (from runtime.txt) |

---

## 🔍 What Was Wrong?

The issue was likely:
1. **No version pins** - Render might have had issues resolving latest versions
2. **No runtime.txt** - Python version wasn't explicitly specified
3. **Build cache** - Old build might have been cached

The fixes ensure:
- ✅ Specific, compatible versions are installed
- ✅ Python 3.11 is used consistently
- ✅ Gunicorn is definitely installed

---

## 📊 Expected Build Output

After pushing, you should see in Render logs:

```
==> Building...
==> Installing dependencies from requirements.txt
Collecting pandas==2.0.3
Collecting Flask==3.0.0
Collecting Flask-Cors==4.0.0
...
Collecting gunicorn==21.2.0
Successfully installed gunicorn-21.2.0 ...

==> Deploying...
==> Running 'gunicorn api_server:app'
[INFO] Starting gunicorn 21.2.0
[INFO] Listening at: http://0.0.0.0:10000
[INFO] Using worker: sync
```

---

## 🎯 Timeline

1. **Push changes** (30 seconds)
2. **Render detects push** (10 seconds)
3. **Build starts** (5-10 minutes)
4. **Service goes live** ✅

---

## 🐛 If It Still Fails

### Check Build Logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for specific error messages

### Common Issues:

**Problem: "No module named 'api_server'"**
- Solution: Verify Root Directory is `backend` (not `/backend`)

**Problem: "Port already in use"**
- Solution: This shouldn't happen on Render, but check Start Command

**Problem: "Requirements installation failed"**
- Solution: Check if any package has compatibility issues
- Try removing `psycopg2-binary` if not needed

---

## 🔄 Alternative: Simpler Requirements

If the version-pinned requirements still fail, try this minimal version:

```
Flask==3.0.0
Flask-Cors==4.0.0
pandas==2.0.3
gunicorn==21.2.0
```

Remove packages you're not using:
- `psycopg2-binary` - Only needed for PostgreSQL
- `fuzzywuzzy` - Only if using fuzzy matching
- `python-Levenshtein` - Only if using Levenshtein distance

---

## ✅ Success Indicators

You'll know it worked when:

1. **Build completes** without errors
2. **Service shows "Live"** (green status)
3. **Health check works:**
   ```
   https://your-backend.onrender.com/api/health
   ```
   Returns:
   ```json
   {
     "status": "healthy",
     "message": "SymptomAI API is running"
   }
   ```

---

## 🚀 After Successful Deploy

1. **Copy your backend URL**
2. **Update Vercel environment variable:**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` if needed
3. **Redeploy frontend** if you changed the URL

---

## 📞 Still Having Issues?

Try these in order:

1. **Clear build cache:**
   - Render Dashboard → Service Settings
   - Click "Clear build cache"
   - Redeploy

2. **Check Python version:**
   - Make sure `runtime.txt` says `python-3.11.0`
   - Not `python-3.11` or `3.11.0`

3. **Verify file structure:**
   ```
   backend/
   ├── api_server.py      ← Must exist
   ├── requirements.txt   ← Must exist
   ├── Procfile          ← Must exist
   ├── runtime.txt       ← Must exist (new!)
   └── app/              ← Your app code
   ```

4. **Try a fresh deploy:**
   - Delete the service on Render
   - Create a new one
   - Use the same settings

---

## 💡 Pro Tips

1. **Always pin versions** in production
2. **Use runtime.txt** to specify Python version
3. **Check logs** immediately after deploy
4. **Test health endpoint** before testing full app

---

**Push the changes and Render will automatically redeploy!** 🚀

```bash
git add backend/requirements.txt backend/runtime.txt
git commit -m "Fix: Add version pins and runtime.txt for Render"
git push
```

**Your backend will be live in 5-10 minutes!** ✅
