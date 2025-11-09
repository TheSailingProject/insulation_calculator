# 📤 GitHub Upload Guide

## Quick Start (5 Minutes)

### Step 1: Install Git (if not already installed)

Check if Git is installed:
```bash
git --version
```

If not installed, download from: https://git-scm.com/download/win

### Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create GitHub Repository

1. **Go to GitHub:** https://github.com
2. **Sign in** (or create account if needed)
3. **Click the "+" icon** in top right → "New repository"
4. **Fill in details:**
   - Repository name: `belgian-insulation-calculator`
   - Description: `Belgian Roof Insulation Savings Calculator`
   - Visibility: **Public** (required for free Cloudflare Pages)
   - ❌ **DON'T** check "Add a README file"
   - ❌ **DON'T** add .gitignore (we already have one)
   - ❌ **DON'T** choose a license yet
5. **Click "Create repository"**

You'll see a page with commands - **keep this page open!**

### Step 4: Initialize Git in Your Project

Open PowerShell in your project directory:

```bash
cd C:\Users\arnos\PycharmProjects\PythonProject
```

Initialize Git:
```bash
git init
```

### Step 5: Add Files to Git

Add all files:
```bash
git add .
```

Check what will be committed:
```bash
git status
```

### Step 6: Create First Commit

```bash
git commit -m "Initial commit: Belgian Roof Insulation Calculator"
```

### Step 7: Connect to GitHub

Copy the commands from your GitHub repository page. They look like this:

```bash
git remote add origin https://github.com/YOUR-USERNAME/belgian-insulation-calculator.git
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME`** with your actual GitHub username!

### Step 8: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files!

---

## ✅ Complete Command Sequence

Here's the full sequence in one place:

```bash
# Navigate to project
cd C:\Users\arnos\PycharmProjects\PythonProject

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Belgian Roof Insulation Calculator"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/belgian-insulation-calculator.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔒 Important: Environment Variables

Before pushing, make sure sensitive data is excluded:

✅ `.env` files are in `.gitignore` (already done)
✅ No API keys in code
✅ No passwords in code

Our project is safe - all config is in `.gitignore`!

---

## 📁 What Gets Uploaded

Your GitHub repository will include:

```
✅ backend/              (Python backend)
✅ frontend/             (React frontend)
✅ cloudflare-deployment/  (Cloudflare files)
✅ simple_frontend.html  (Standalone frontend)
✅ README.md            (Documentation)
✅ .gitignore           (Git ignore rules)

❌ .env files           (excluded)
❌ __pycache__/        (excluded)
❌ node_modules/       (excluded)
❌ venv/               (excluded)
```

---

## 🚀 Deploy to Cloudflare Pages from GitHub

After uploading to GitHub, deploy to Cloudflare:

### Option 1: Deploy Cloudflare Files

1. Go to https://dash.cloudflare.com/
2. Click "Workers & Pages"
3. Click "Create application" → "Pages"
4. Click "Connect to Git"
5. Select your repository: `belgian-insulation-calculator`
6. Configure build settings:
   - **Build command:** Leave empty
   - **Build output directory:** `cloudflare-deployment/pages`
   - **Root directory:** Leave as `/`
7. Click "Save and Deploy"

### Option 2: Deploy Simple Frontend

Same steps, but use:
- **Build output directory:** `/` (root)
- Deploy `simple_frontend.html` as main page

---

## 🔄 Updating Your Repository

After making changes:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

Cloudflare Pages will **auto-deploy** when you push!

---

## 🆘 Troubleshooting

### "git: command not found"
**Solution:** Install Git from https://git-scm.com/download/win

### "permission denied"
**Solution:** You may need to authenticate. GitHub will prompt you.

### "remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/belgian-insulation-calculator.git
```

### "failed to push"
**Solution:** Pull first, then push:
```bash
git pull origin main --rebase
git push
```

### Files I don't want are being added
**Solution:** Add them to `.gitignore`, then:
```bash
git rm --cached filename
git commit -m "Remove file from tracking"
git push
```

---

## 🔐 Authentication Options

GitHub may ask you to authenticate. Choose one:

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy token (save it somewhere safe!)
5. Use token as password when Git asks

### Option 2: GitHub CLI
```bash
# Install GitHub CLI
winget install GitHub.cli

# Login
gh auth login

# Follow prompts
```

### Option 3: SSH Keys
See: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 📊 After Upload

Your repository will be at:
```
https://github.com/YOUR-USERNAME/belgian-insulation-calculator
```

### Make it Professional

1. **Add a description** on GitHub
2. **Add topics/tags:**
   - `calculator`
   - `energy-efficiency`
   - `belgium`
   - `cloudflare`
   - `fastapi`
   - `react`
3. **Add a license** (MIT recommended)
4. **Update README.md** with live demo link after Cloudflare deployment

---

## 🎯 Cloudflare Pages Setup (After GitHub Upload)

### Deploy Worker First

```bash
cd cloudflare-deployment/worker
wrangler deploy
```

Copy the Worker URL!

### Then Deploy Pages

1. **Go to Cloudflare Dashboard**
2. **Connect GitHub repository**
3. **Configure:**
   - Project name: `insulation-calculator`
   - Production branch: `main`
   - Build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `cloudflare-deployment/pages`
4. **Environment variables:** (none needed)
5. **Save and Deploy**

### Update API URL

After Worker is deployed:
1. Edit `cloudflare-deployment/pages/index.html` in GitHub
2. Update `API_URL` with your Worker URL
3. Commit and push
4. Cloudflare auto-deploys!

---

## ✅ Success Checklist

- [ ] Git installed and configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] No sensitive data in repository
- [ ] README.md updated
- [ ] Repository is public (for free Cloudflare)
- [ ] Worker deployed to Cloudflare
- [ ] Pages connected to GitHub
- [ ] API_URL updated in frontend
- [ ] Application is live!

---

## 📝 Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# See what changed
git diff

# Undo changes to a file
git checkout -- filename

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# Push changes
git push
```

---

## 🎓 Learning Resources

- **Git Basics:** https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
- **GitHub Guides:** https://guides.github.com/
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/

---

## 🎉 You're Done!

Once pushed to GitHub, you can:
- ✅ Deploy to Cloudflare Pages automatically
- ✅ Collaborate with others
- ✅ Track changes over time
- ✅ Roll back if needed
- ✅ Showcase your project

**Your code is now on GitHub!** 🚀
