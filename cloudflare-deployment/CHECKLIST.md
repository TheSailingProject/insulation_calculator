# ✅ Cloudflare Deployment Checklist

## Pre-Deployment

- [ ] Node.js installed (`node --version`)
- [ ] Cloudflare account created (https://dash.cloudflare.com/sign-up)
- [ ] Wrangler installed (`npm install -g wrangler`)
- [ ] Logged into Cloudflare (`wrangler login`)

## Deploy Backend (Worker)

- [ ] Navigate to worker directory: `cd cloudflare-deployment/worker`
- [ ] Test locally (optional): `wrangler dev`
- [ ] Deploy: `wrangler deploy`
- [ ] ✏️ **COPY WORKER URL:**
  ```
  _________________________________________________
  ```
- [ ] Test Worker URL in browser
- [ ] Verify `/config/regions` endpoint works

## Update Frontend

- [ ] Open `cloudflare-deployment/pages/index.html`
- [ ] Find line ~387: `const API_URL = ...`
- [ ] Replace with your Worker URL
- [ ] Save file

## Deploy Frontend (Pages)

Choose one method:

### Method A: Dashboard Upload
- [ ] Go to https://dash.cloudflare.com/
- [ ] Click "Workers & Pages"
- [ ] Click "Create application" → "Pages"
- [ ] Click "Upload assets"
- [ ] Drag `pages` folder
- [ ] Click "Deploy"
- [ ] ✏️ **COPY PAGES URL:**
  ```
  _________________________________________________
  ```

### Method B: CLI Deploy
- [ ] Navigate: `cd cloudflare-deployment/pages`
- [ ] Deploy: `npx wrangler pages deploy . --project-name=insulation-calculator`
- [ ] ✏️ **COPY PAGES URL:**
  ```
  _________________________________________________
  ```

## Test Deployment

- [ ] Open Pages URL in browser
- [ ] Verify page loads correctly
- [ ] Check "✓ Connected to API" message appears
- [ ] Fill test form:
  - [ ] Region: Vlaams
  - [ ] Roof area: 100
  - [ ] Current R-value: 2.0
  - [ ] Proposed R-value: 6.0
  - [ ] Heating source: Gas
  - [ ] Energy price: 0.35
- [ ] Click "Calculate Savings"
- [ ] Verify results appear:
  - [ ] Annual savings shown
  - [ ] Payback period shown
  - [ ] 10-year savings shown
  - [ ] CO2 reduction shown
  - [ ] Details table populated

## Troubleshooting (if needed)

### If API Not Connected:
- [ ] Check Worker URL in browser directly
- [ ] Verify API_URL in index.html is correct
- [ ] Check browser console (F12) for errors
- [ ] Check CORS headers (should be automatic)

### If Results Don't Appear:
- [ ] Open browser console (F12)
- [ ] Check Network tab for failed requests
- [ ] Verify form inputs are valid
- [ ] Test Worker endpoint directly with curl

### If Worker Deploy Fails:
- [ ] Verify logged in: `wrangler whoami`
- [ ] Re-login: `wrangler login`
- [ ] Check wrangler.toml syntax
- [ ] Try again: `wrangler deploy`

## Post-Deployment (Optional)

- [ ] Set up custom domain for Worker
- [ ] Set up custom domain for Pages
- [ ] Enable analytics in dashboard
- [ ] Add environment variables (if needed)
- [ ] Set up deployment webhook
- [ ] Configure build settings (if using Git)

## Share Your URLs

**Worker (API):**
```
_________________________________________________
```

**Pages (Frontend):**
```
_________________________________________________
```

**Custom Domain (if set up):**
```
_________________________________________________
```

## Monitor

- [ ] Check Cloudflare Dashboard → Workers & Pages
- [ ] View request analytics
- [ ] Monitor error rates
- [ ] Check response times

## Updates

To update your deployment:

**Worker:**
```bash
cd cloudflare-deployment/worker
# Edit index.js
wrangler deploy
```

**Pages:**
```bash
cd cloudflare-deployment/pages
# Edit index.html
npx wrangler pages deploy .
```

---

## ✅ Deployment Complete!

- [ ] Application is live
- [ ] URLs are saved
- [ ] Testing is successful
- [ ] Analytics are enabled (optional)
- [ ] Custom domain configured (optional)

**Congratulations!** Your Belgian Roof Insulation Calculator is now live on Cloudflare! 🎉

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy Worker | `wrangler deploy` |
| Test Worker locally | `wrangler dev` |
| Deploy Pages | `npx wrangler pages deploy .` |
| Check login | `wrangler whoami` |
| View deployments | `wrangler deployments list` |
| Open dashboard | https://dash.cloudflare.com/ |

## Need Help?

- [ ] Read QUICKSTART.md
- [ ] Check DEPLOYMENT_GUIDE.md
- [ ] Visit https://developers.cloudflare.com/
- [ ] Community: https://community.cloudflare.com/
