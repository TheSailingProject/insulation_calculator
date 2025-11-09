# 🚀 Quick Start - Deploy in 5 Minutes

## Step 1: Install Wrangler (1 minute)

Open PowerShell or terminal:

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare (1 minute)

```bash
wrangler login
```

This will open your browser. Click "Allow" to authorize Wrangler.

## Step 3: Deploy the Worker (1 minute)

```bash
cd cloudflare-deployment/worker
wrangler deploy
```

**You'll see output like:**
```
Published insulation-calculator-api (1.23 sec)
  https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev
```

**📋 COPY THIS URL!** You need it for the next step.

## Step 4: Update Frontend (1 minute)

1. Open `cloudflare-deployment/pages/index.html`
2. Find line 387 (search for `const API_URL`)
3. Replace with your Worker URL:

```javascript
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8787'
    : 'https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev';
```

Replace `YOUR-SUBDOMAIN` with the actual URL from Step 3.

## Step 5: Deploy the Frontend (1 minute)

### Option A: Via Dashboard (Easier)

1. Go to: https://dash.cloudflare.com/
2. Click "Workers & Pages"
3. Click "Create application" → "Pages" → "Upload assets"
4. Drag the `cloudflare-deployment/pages` folder
5. Click "Deploy site"

### Option B: Via CLI

```bash
cd cloudflare-deployment/pages
npx wrangler pages deploy . --project-name=insulation-calculator
```

## ✅ Done!

Your app is now live at:
- **Frontend:** `https://your-project-name.pages.dev`
- **API:** `https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev`

## 🧪 Test It

1. Open your Pages URL
2. Fill out the form:
   - Region: Vlaams
   - Roof area: 100
   - Current R-value: 2.0
   - Proposed R-value: 6.0
   - Heating source: Gas
   - Energy price: 0.35
3. Click "Calculate Savings"
4. You should see results! 🎉

## 🆘 Problems?

**"npm not found"**
- Install Node.js from https://nodejs.org/

**"wrangler: command not found"**
- Run: `npm install -g wrangler`
- Close and reopen terminal

**"Not logged in"**
- Run: `wrangler login`

**"API not connecting"**
- Check API_URL in `pages/index.html`
- Verify Worker is deployed: check Cloudflare Dashboard

**Still stuck?**
- See full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Check browser console (F12) for errors

## 📝 Summary of What You Get

✅ **Global API** running on Cloudflare's edge network
✅ **Fast frontend** served from CDN worldwide
✅ **Automatic HTTPS** and security
✅ **100% free** (within free tier limits)
✅ **Professional URL** (can add custom domain later)

## 🎯 Next Steps

- ✅ Share your URL with others
- 🔧 Set up custom domain (optional)
- 📊 Check analytics in Cloudflare Dashboard
- 🔄 Update code anytime with `wrangler deploy`

---

**Total Time: ~5 minutes** ⏱️
**Cost: $0** 💰
**Global Reach: ✓** 🌍
