# Belgian Roof Insulation Calculator - Cloudflare Deployment

This directory contains everything you need to deploy the Belgian Roof Insulation Calculator to Cloudflare.

## 🚀 Quick Start

### 1. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. Deploy Worker (Backend)
```bash
cd worker
wrangler deploy
```
**Save the Worker URL** that's displayed!

### 3. Update Frontend
Edit `pages/index.html` and replace:
```javascript
const API_URL = 'https://YOUR-WORKER-URL.workers.dev';
```

### 4. Deploy Pages (Frontend)
**Option A: Via Dashboard**
- Go to https://dash.cloudflare.com/
- Workers & Pages → Create → Pages → Direct Upload
- Upload the `pages` folder

**Option B: Via CLI**
```bash
cd pages
npx wrangler pages deploy . --project-name=insulation-calculator
```

### 5. Done! 🎉
Your app is now live at:
- **API:** `https://your-worker.workers.dev`
- **Frontend:** `https://your-project.pages.dev`

## 📁 Structure

```
cloudflare-deployment/
├── worker/              # Backend API
│   ├── index.js        # Main Worker code
│   ├── wrangler.toml   # Configuration
│   └── package.json    # Dependencies
│
├── pages/              # Frontend
│   ├── index.html      # Main HTML file
│   └── _headers        # Security headers
│
├── DEPLOYMENT_GUIDE.md # Detailed instructions
└── README.md          # This file
```

## ✨ Features

### Worker (Backend)
- ✅ Global edge network
- ✅ <50ms response time
- ✅ 100,000 free requests/day
- ✅ Automatic scaling
- ✅ Full API functionality

### Pages (Frontend)
- ✅ CDN-backed
- ✅ Unlimited requests
- ✅ Automatic HTTPS
- ✅ Global deployment
- ✅ Free hosting

## 📖 Documentation

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for:
- Step-by-step deployment instructions
- Custom domain setup
- Troubleshooting tips
- Testing procedures

## 🔧 Local Development

### Test Worker Locally
```bash
cd worker
wrangler dev
# Opens at http://localhost:8787
```

### Test Frontend Locally
Simply open `pages/index.html` in a browser
(Update API_URL to `http://localhost:8787` for local testing)

## 🌍 API Endpoints

Once deployed, your Worker will have:

- `GET /` - API information
- `GET /config/regions` - Belgian regions and heating sources
- `POST /calculate/savings` - Calculate insulation savings

## 📝 Configuration

### Worker Configuration (`worker/wrangler.toml`)
```toml
name = "insulation-calculator-api"
main = "index.js"
compatibility_date = "2024-01-01"
```

### Frontend Configuration (`pages/index.html`)
Update the API_URL constant with your Worker URL:
```javascript
const API_URL = 'https://YOUR-WORKER-URL.workers.dev';
```

## 💡 Tips

1. **Deploy Worker first**, then get the URL
2. **Update API_URL** in frontend with Worker URL
3. **Then deploy Pages**
4. Test the full application
5. Set up custom domain (optional)

## 🆓 Free Tier Limits

Both services are free for typical usage:

- **Workers:** 100,000 requests/day
- **Pages:** Unlimited requests, 500 builds/month

Perfect for personal projects and small businesses!

## 🔒 Security

- HTTPS enforced
- CORS configured
- Security headers included
- No sensitive data stored
- Edge network protection

## 🚨 Troubleshooting

**Worker not accessible?**
- Check it's deployed: `wrangler deployments list`
- Verify URL is correct
- Check Cloudflare Dashboard

**Frontend can't connect to API?**
- Verify API_URL in index.html
- Check browser console for errors
- Test Worker URL directly

**CORS errors?**
- Worker has CORS enabled by default
- Check browser console for details

## 📊 Monitoring

View analytics in Cloudflare Dashboard:
- Workers & Pages → Your Worker/Page → Analytics
- See request counts, errors, response times

## 🔄 Updates

### Update Worker
```bash
cd worker
# Edit index.js
wrangler deploy
```

### Update Pages
- Push to Git (auto-deploys) OR
- Re-upload via Dashboard OR
- `npx wrangler pages deploy .`

## 🎯 What's Different from Local?

| Feature | Local | Cloudflare |
|---------|-------|------------|
| Backend | Python/FastAPI | JavaScript Worker |
| PDF Generation | ❌ Not in Worker yet | Use local Python for PDFs |
| Hosting | localhost | Global CDN |
| HTTPS | No | Yes, automatic |
| Performance | Local only | Worldwide edge |
| Cost | Free | Free (with limits) |

**Note:** PDF generation is not included in the Worker version. For PDF reports, you can:
1. Keep the Python backend running locally for PDFs
2. Use a third-party PDF API service
3. Generate PDFs client-side with jsPDF library

## 📧 Support

- **Cloudflare Docs:** https://developers.cloudflare.com/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **Community:** https://community.cloudflare.com/

---

**Ready to deploy?** Follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)! 🚀
