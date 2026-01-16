# 🔧 Render Python Version Fix

## Problem
Render is using Python 3.13.4 instead of 3.11.7, causing pandas compilation errors.

## Root Cause
When using "Root Directory" setting in Render, the `runtime.txt` file might not be read correctly.

---

## ✅ Solution: Configure Python Version in Render Dashboard

### Option 1: Use Environment Variable (Recommended)

In Render Dashboard, when creating the service:

1. **Go to "Environment" section**
2. **Add this environment variable:**
   ```
   Key:   PYTHON_VERSION
   Value: 3.11.7
   ```

### Option 2: Use render.yaml (Alternative)

I've created a `render.yaml` file in the root. If you use this:

1. **Don't manually create the service**
2. **Instead, in Render Dashboard:**
   - Click "New +"
   - Select "Blueprint"
   - Connect your repository
   - Render will read `render.yaml` automatically

---

## 🚀 Quick Fix: Manual Configuration

### Step 1: In Render Dashboard

When creating the web service, use these settings:

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

### Step 2: Add Environment Variable

**CRITICAL:** Before clicking "Create Web Service":

1. Scroll to **Environment Variables** section
2. Click **Add Environment Variable**
3. Add:
   ```
   PYTHON_VERSION = 3.11.7
   ```

### Step 3: Create Service

Now click **Create Web Service**

---

## Alternative: Simpler Requirements (If Still Fails)

If Python version still doesn't work, use pre-built wheels only:

Update `backend/requirements.txt` to:
```
Flask==3.0.0
Flask-Cors==4.0.0
gunicorn==21.2.0
requests==2.31.0
rapidfuzz==3.6.1
pandas
```

Remove version pin from pandas - it will install the latest compatible version with pre-built wheels.

---

## What I've Updated

### 1. `backend/runtime.txt`
```
python-3.11.7
```

### 2. `backend/requirements.txt`
```
Flask==3.0.0
Flask-Cors==4.0.0
rapidfuzz==3.6.1
requests==2.31.0
gunicorn==21.2.0
pandas==2.1.4
```
(Reordered to install pandas last, updated to 2.1.4 which has better wheel support)

### 3. `render.yaml` (NEW)
Created in root directory for Blueprint deployment option.

---

## Push Changes

```bash
git add backend/requirements.txt backend/runtime.txt render.yaml
git commit -m "Fix: Configure Python 3.11.7 for Render deployment"
git push
```

---

## Expected Build Output

After fixing, you should see:

```
==> Using Python version 3.11.7
==> Installing dependencies
Collecting Flask==3.0.0
Collecting Flask-Cors==4.0.0
Collecting rapidfuzz==3.6.1
Collecting requests==2.31.0
Collecting gunicorn==21.2.0
Collecting pandas==2.1.4
  Using cached pandas-2.1.4-cp311-cp311-manylinux_2_17_x86_64.whl
Successfully installed...

==> Starting gunicorn
[INFO] Starting gunicorn 21.2.0
[INFO] Listening at: http://0.0.0.0:10000
```

---

## If It Still Uses Python 3.13

### Last Resort: Remove pandas temporarily

If Render keeps using Python 3.13, temporarily remove pandas:

1. **Update `backend/requirements.txt`:**
   ```
   Flask==3.0.0
   Flask-Cors==4.0.0
   rapidfuzz==3.6.1
   requests==2.31.0
   gunicorn==21.2.0
   ```

2. **Update `backend/app/predictor.py`:**
   - Comment out pandas import
   - Use simple list/dict instead of DataFrame
   - This is temporary just to get it deployed

3. **After deployment works:**
   - Contact Render support about Python version
   - Or upgrade to paid tier which has better Python version control

---

## Why This Happens

Render's free tier sometimes:
- Ignores `runtime.txt` in subdirectories
- Defaults to latest Python (3.13)
- Requires explicit environment variable

The `PYTHON_VERSION` environment variable is the most reliable way to specify Python version on Render.

---

## Summary

**Try in this order:**

1. ✅ Add `PYTHON_VERSION=3.11.7` environment variable in Render dashboard
2. ✅ Push updated files (runtime.txt, requirements.txt)
3. ✅ Redeploy
4. ✅ If still fails, use render.yaml Blueprint method
5. ✅ If still fails, remove pandas temporarily

**Most likely fix:** Adding the environment variable will work!

---

**Push the changes and try again with the environment variable!** 🚀
