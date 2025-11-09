# Cloudflare Deployment Guide

## Prerequisites

1. **Cloudflare Account** (Free tier is sufficient)
   - Sign up at: https://dash.cloudflare.com/sign-up

2. **Node.js and npm** installed
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **Wrangler CLI** (Cloudflare's deployment tool)
   ```bash
   npm install -g wrangler
   ```

4. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

---

## Part 1: Deploy the Backend (Cloudflare Worker)

### Step 1: Navigate to Worker Directory
```bash
cd cloudflare-deployment/worker
```

### Step 2: Install Dependencies (optional, none required for this project)
```bash
npm install
```

### Step 3: Test Locally
```bash
wrangler dev
```
This will start a local development server at `http://localhost:8787`

Test it:
- Open browser to `http://localhost:8787`
- You should see the API response

### Step 4: Deploy to Cloudflare
```bash
wrangler deploy
```

After deployment, you'll see output like:
```
Total Upload: xx.xx KiB / gzip: xx.xx KiB
Uploaded insulation-calculator-api (x.xx sec)
Published insulation-calculator-api (x.xx sec)
  https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev
```

**Save this Worker URL!** You'll need it for the frontend.

### Step 5: Test Your Deployed Worker
Open in browser:
```
https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev
```

Test the API endpoints:
```
https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev/config/regions
```

---

## Part 2: Deploy the Frontend (Cloudflare Pages)

### Option A: Deploy via Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com/
   - Select your account
   - Go to "Workers & Pages"
   - Click "Create application"
   - Choose "Pages"

2. **Connect to Git (Recommended) OR Direct Upload**

   **If using Git:**
   - Connect your GitHub/GitLab account
   - Select your repository
   - Build settings: None needed (static HTML)
   - Root directory: `cloudflare-deployment/pages`
   - Click "Save and Deploy"

   **If using Direct Upload:**
   - Click "Direct Upload"
   - Drag and drop the `cloudflare-deployment/pages` folder
   - Click "Deploy"

3. **Update API URL in index.html**
   - After deploying the Worker, edit `pages/index.html`
   - Find line: `const API_URL = ...`
   - Replace with your Worker URL:
   ```javascript
   const API_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:8787'
       : 'https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev';
   ```
   - Re-deploy the pages

4. **Your Site is Live!**
   ```
   https://your-project-name.pages.dev
   ```

### Option B: Deploy via Wrangler CLI

```bash
# From the pages directory
cd cloudflare-deployment/pages

# Deploy
npx wrangler pages deploy . --project-name=insulation-calculator

# Follow the prompts
```

---

## Part 3: Update Frontend with Worker URL

1. **Edit** `cloudflare-deployment/pages/index.html`

2. **Find this line** (around line 387):
   ```javascript
   const API_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:8787'
       : 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev';
   ```

3. **Replace** `YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev` with your actual Worker URL

4. **Re-deploy** the Pages site

---

## Part 4: Custom Domain (Optional)

### For the Worker (API):

1. Go to your Worker in Cloudflare Dashboard
2. Click "Triggers" tab
3. Click "Add Custom Domain"
4. Enter: `api.yourdomain.com`
5. Click "Add Custom Domain"

### For the Pages (Frontend):

1. Go to your Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain: `calculator.yourdomain.com` or `yourdomain.com`
5. Follow DNS setup instructions

---

## Testing Your Deployment

1. **Test Worker API**
   ```bash
   curl https://YOUR-WORKER-URL.workers.dev/
   curl https://YOUR-WORKER-URL.workers.dev/config/regions
   ```

2. **Test Frontend**
   - Open: `https://your-project.pages.dev`
   - Fill out the form
   - Click "Calculate Savings"
   - Verify results appear

3. **Test Full Flow**
   - Select region: Vlaams
   - Roof area: 100
   - Current R-value: 2.0
   - Proposed R-value: 6.0
   - Heating source: Gas
   - Energy price: 0.35
   - Click "Calculate Savings"
   - Should see results with payback period, savings, etc.

---

## Troubleshooting

### Worker Issues

**Problem:** Worker not deploying
```bash
# Check you're logged in
wrangler whoami

# Re-login if needed
wrangler login

# Try deploying again
wrangler deploy
```

**Problem:** CORS errors
- The Worker has CORS enabled by default
- Check browser console for specific error
- Verify Worker URL is correct in frontend

### Pages Issues

**Problem:** 404 on Pages deployment
- Make sure `index.html` is in the root of your upload
- Check build settings if using Git integration

**Problem:** API calls failing
- Open browser console (F12)
- Check Network tab
- Verify API_URL in index.html is correct
- Make sure Worker is deployed and running

### General Issues

**Problem:** "Worker not found"
- Verify Worker is deployed: Check Cloudflare Dashboard
- Check Worker URL is correct

**Problem:** Calculation not working
- Open browser console
- Check for JavaScript errors
- Verify form inputs are valid
- Test Worker API directly in browser

---

## Costs

**Both services are FREE for most use cases:**

- **Workers Free Plan:**
  - 100,000 requests/day
  - More than enough for typical usage

- **Pages Free Plan:**
  - Unlimited requests
  - 500 builds/month
  - Perfect for this static site

---

## Updating Your Deployment

### Update Worker:
```bash
cd cloudflare-deployment/worker
# Make your changes to index.js
wrangler deploy
```

### Update Pages:
- **Via Git:** Just push to your repository, auto-deploys
- **Via CLI:**
  ```bash
  cd cloudflare-deployment/pages
  npx wrangler pages deploy .
  ```
- **Via Dashboard:** Upload new files

---

## URLs After Deployment

After completing deployment, you'll have:

1. **Worker API:**
   ```
   https://insulation-calculator-api.YOUR-SUBDOMAIN.workers.dev
   ```

2. **Pages Frontend:**
   ```
   https://your-project-name.pages.dev
   ```

3. **Custom Domains (if configured):**
   ```
   https://api.yourdomain.com (Worker)
   https://calculator.yourdomain.com (Pages)
   ```

---

## Project Structure

```
cloudflare-deployment/
├── worker/
│   ├── index.js           # Worker API code
│   ├── wrangler.toml      # Worker configuration
│   └── package.json       # Worker package file
│
└── pages/
    ├── index.html         # Frontend HTML
    └── _headers          # Security headers
```

---

## Quick Commands Reference

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Test Worker locally
cd cloudflare-deployment/worker
wrangler dev

# Deploy Worker
cd cloudflare-deployment/worker
wrangler deploy

# Deploy Pages via CLI
cd cloudflare-deployment/pages
npx wrangler pages deploy . --project-name=insulation-calculator

# Check deployments
wrangler deployments list
```

---

## Next Steps

1. ✅ Deploy Worker
2. ✅ Deploy Pages
3. ✅ Update API URL in frontend
4. ✅ Test full application
5. 🔧 (Optional) Set up custom domain
6. 📊 (Optional) Set up analytics in Cloudflare Dashboard

---

## Support

- **Cloudflare Docs:** https://developers.cloudflare.com/
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Community:** https://community.cloudflare.com/

---

## Security Notes

- CORS is configured to allow all origins (`*`)
- For production, consider restricting to your domain only
- All calculations happen server-side
- No sensitive data is stored
- HTTPS is enforced by Cloudflare

---

## Performance

- **Worker:** Global edge network, <50ms response time
- **Pages:** CDN-backed, instant loading worldwide
- **99.99%** uptime SLA
- Automatic scaling to millions of requests

---

Your Belgian Roof Insulation Calculator is now deployed globally! 🎉
