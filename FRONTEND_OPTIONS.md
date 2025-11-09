# Frontend Options

## ✅ Option 1: Simple HTML Frontend (No Installation Required)

**File:** `simple_frontend.html`

### How to Use:
1. Make sure backend is running:
   ```bash
   cd backend
   py main.py
   ```

2. Open `simple_frontend.html` in your browser:
   - Double-click the file, OR
   - Run: `start simple_frontend.html`

### Features:
- ✅ Full calculator functionality
- ✅ Auto-fill energy prices by region
- ✅ Form validation
- ✅ Results display with visual cards
- ✅ PDF download
- ✅ Responsive design
- ✅ Works in any modern browser
- ✅ No installation needed!

### Perfect for:
- Quick testing
- Demos
- When you don't want to install Node.js
- Simple deployment

---

## 🚀 Option 2: Full React Frontend (Requires Node.js)

**Location:** `frontend/` directory

### Installation Steps:

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Choose LTS version (v20.x or v22.x)
   - Run installer (accept defaults)
   - Restart terminal

2. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

3. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser to:** http://localhost:3000

### Features:
- ✅ Multi-step wizard interface
- ✅ Progress indicators
- ✅ Advanced form validation
- ✅ Professional UI/UX
- ✅ Component-based architecture
- ✅ Modern React with Vite
- ✅ Hot module replacement

### Perfect for:
- Production deployment
- Full-featured application
- Best user experience
- Further customization

---

## 🔍 Option 3: API Documentation (No Frontend)

**URL:** http://localhost:8000/docs

### How to Use:
1. Start backend:
   ```bash
   cd backend
   py main.py
   ```

2. Open browser to: http://localhost:8000/docs

3. Use interactive API documentation:
   - Try endpoints directly
   - View request/response schemas
   - Download PDFs
   - Test calculations

### Perfect for:
- API testing
- Integration with other apps
- Understanding the backend
- Quick calculations

---

## 📊 Comparison

| Feature | Simple HTML | React Frontend | API Docs |
|---------|-------------|----------------|----------|
| Installation | None | Node.js required | None |
| Setup Time | Instant | 5 minutes | Instant |
| Functionality | Full | Full | Full |
| UI/UX | Good | Excellent | Basic |
| Multi-step Form | No | Yes | N/A |
| Progress Bar | No | Yes | N/A |
| Best For | Quick use | Production | Testing |

---

## 🎯 Recommendation

**For Now:** Use **Simple HTML Frontend** (`simple_frontend.html`)
- No installation needed
- Works immediately
- Full functionality
- Good UI

**Later:** Install Node.js and use **React Frontend** for best experience
- Better UX
- More features
- Professional appearance

---

## ⚡ Quick Start Commands

### Using Simple HTML:
```bash
# 1. Start backend
cd backend
py main.py

# 2. Open HTML file (in new terminal)
start simple_frontend.html
```

### Using React (after installing Node.js):
```bash
# Terminal 1: Backend
cd backend
py main.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Using API Docs:
```bash
# Start backend
cd backend
py main.py

# Open browser to:
# http://localhost:8000/docs
```

---

## 🆘 Troubleshooting

### Simple HTML shows "Backend not running"
**Solution:** Make sure backend is running on port 8000
```bash
cd backend
py main.py
```

### Can't download Node.js
**Solution:** Use Simple HTML frontend - it works great without Node.js!

### Browser blocks PDF download
**Solution:** Allow popups for localhost in browser settings

### CORS errors
**Solution:** Backend already configured for CORS - should work automatically
