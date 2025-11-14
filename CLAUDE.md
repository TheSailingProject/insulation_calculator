# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tectura Isolatie Calculator - A Belgian roof insulation savings calculator with React frontend and dual backend (Python FastAPI for local development, Cloudflare Worker for production).

**Brand:** Tectura corporate identity (Orange #E94F1C, Navy #042A5E, Archivo fonts)
**Language:** Dutch (Belgian, formal "uw")
**Deployment:** Cloudflare Pages + Workers

## Build & Run Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Development server (http://localhost:5173)
npm run build                  # Production build to dist/
npm run preview                # Preview production build
```

### Backend - Python (Local Development)
```bash
cd backend
python -m venv venv            # Create virtual environment
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                 # FastAPI server (http://localhost:8000)
pytest test_calculations.py -v # Run tests
```

### Backend - Cloudflare Worker (Production)
```bash
cd cloudflare-deployment/worker
npx wrangler deploy            # Deploy to Cloudflare
npx wrangler dev               # Local Worker testing
```

### Deployment to Cloudflare
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Copy to Cloudflare Pages directory
cd ..
rm -rf cloudflare-deployment/pages/*
cp -r frontend/dist/* cloudflare-deployment/pages/

# 3. Commit and push (Cloudflare auto-deploys)
git add -A
git commit -m "Deploy updated app"
git push origin main
```

## Architecture

### Multi-Backend Design
The project has **two separate backends** serving the same API contract:

1. **Python FastAPI** (`backend/`) - Local development, includes PDF generation
   - Files: `main.py`, `calculations.py`, `models.py`, `config.py`, `pdf_generator.py`
   - Used for: Local testing, PDF reports

2. **Cloudflare Worker** (`cloudflare-deployment/worker/index.js`) - Production
   - JavaScript implementation of same calculations
   - No PDF generation (frontend-only feature in production)
   - Deployed to: `https://insulation-calculator-api.arno-01e.workers.dev`

**Critical:** When updating calculation logic, you must update BOTH backends to maintain parity.

### Frontend Architecture (React)

**Multi-step form flow:**
1. Step 1: Roof Information (`Step1RoofInfo.jsx`) - Roof area, type (flat/pitched), insulation status, region
2. Step 2: Material Selection (`Step2InsulationMaterial.jsx`) - Choose from 4 Belgian insulation materials
3. Step 3: Heating Source (`Step3Heating.jsx`) - Heating type and energy price
4. Step 4: Results (`Results.jsx`) - Savings analysis with download option

**Key Components:**
- `App.jsx` - Main orchestrator, handles step navigation and form state
- `ProgressBar.jsx` - Visual step indicator
- `services/api.js` - API abstraction layer (configurable via VITE_API_URL)
- `utils/validation.js` - Form validation functions

**State Management:**
- Single `formData` object in App.jsx
- `has_insulation` toggle determines if `current_r_value` input is shown
- `proposed_r_value` auto-set by material selection (not user input)
- `insulation_upgrade_cost` calculated from material + roof area × pitch multiplier

### Calculation Logic

**Roof Type Multipliers:**
- Flat roof: 1.0× surface area
- Pitched roof: 1.25× surface area (accounts for slope)

**Insulation Materials (Belgian market):**
- Glass Wool: €17.50/m² (Budget)
- PIR/PUR Foam: €35/m² (Mid-Range)
- Wood Fiber: €55/m² (Premium Eco)
- EPS Graphite: €28/m² (Mid-Range Plus)
- All target R-value of 6.0 (Belgian EPB 2023 standard)

**R-value = 0 Handling:**
- Frontend: Allows 0 for uninsulated roofs
- Backend: Uses U-value of 5.0 W/m²K for R=0 (typical uninsulated roof)
- Validation: `current_r_value >= 0` (not `> 0`)

**Regional Data (Belgium):**
- Vlaams: €0.35/kWh, 2800 HDD
- Waals: €0.33/kWh, 3000 HDD
- Brussels-Hoofdstedelijk: €0.34/kWh, 2850 HDD

### Styling & Branding

**Tectura Brand:**
- Colors defined in `App.css` root variables
- Primary (Orange): `--tectura-orange: #E94F1C`
- Secondary (Navy): `--tectura-navy: #042A5E`
- Fonts: 'Archivo' and 'Archivo Black' (loaded via Google Fonts in `index.html`)
- Border radius: 3px (matches tectura-groep.be)
- Buttons: Uppercase, orange background

**Design Principles:**
- No dropdowns (all icon/button-based selections)
- Multi-step progressive disclosure
- Real-time validation feedback
- Dutch language throughout (formal "uw")

### Environment Configuration

**Frontend (`frontend/.env.production`):**
```
VITE_API_URL=https://insulation-calculator-api.arno-01e.workers.dev
```

**Backend (optional `.env`):**
Not required for default config, but can override settings from `config.py`

### API Contract

Both backends implement these endpoints:

**GET /config/regions** - Returns Belgian regions, energy prices, heating sources
**POST /calculate/savings** - Returns calculation results
**POST /calculate/pdf** - Generates PDF report (Python backend only)

Request body structure:
```javascript
{
  location: string,           // "Vlaams" | "Waals" | "Brussels-Hoofdstedelijk"
  roof_area: number,          // m²
  roof_type: string,          // "flat" | "pitched"
  current_r_value: number,    // m²·K/W (0 for uninsulated)
  proposed_r_value: number,   // m²·K/W (auto-set by material selection)
  heating_source: string,     // "gas" | "oil" | "electric" | "heat_pump"
  energy_price_per_kwh: number,
  insulation_upgrade_cost: number  // Calculated on frontend
}
```

## Key Implementation Details

### Frontend Validation
- `validateRValue()` accepts 0 (changed from rejecting `<= 0` to `< 0`)
- Validation triggers on blur, not on every keystroke
- Errors cleared when field values change

### Material Selection Flow
1. User selects material in Step 2
2. Frontend calculates: `cost = roof_area × pitch_multiplier × material.cost_per_m2`
3. Frontend sets: `proposed_r_value = 6.0` (all materials target EPB standard)
4. Cost passed to backend in `insulation_upgrade_cost` field

### Translation Conventions
- Component headings: "Stap N: [Section]"
- Form labels use formal Dutch
- Error messages in Dutch
- Technical terms preserved: R-waarde, m², kWh, CO₂

### Git Workflow for Deployment
1. Make changes to frontend/backend
2. Build frontend: `cd frontend && npm run build`
3. Copy to pages: `rm -rf cloudflare-deployment/pages/* && cp -r frontend/dist/* cloudflare-deployment/pages/`
4. Commit: Include both source changes and built files in `cloudflare-deployment/pages/`
5. Push: Cloudflare auto-deploys on push to main

### Testing
Backend only (no frontend tests):
```bash
cd backend
pytest test_calculations.py -v
```
Tests cover: U-value calculation, heat loss, savings, CO₂ reduction, payback period

## Common Pitfalls

1. **Forgetting to update both backends** - Calculate logic must match in `backend/calculations.py` and `cloudflare-deployment/worker/index.js`
2. **R-value = 0 validation** - Must allow 0 for uninsulated roofs, both frontend and backend
3. **Rebuilding before deploy** - Always `npm run build` before copying to `cloudflare-deployment/pages/`
4. **Material selection state** - `proposed_r_value` is set automatically by material selection, not user input
5. **Translation consistency** - All user-facing text must be Dutch, use formal "uw" not "je"
6. **Border radius** - Use 3px for Tectura brand consistency (not 4px or 8px)
7. **Roof type multiplier** - Pitched = 1.25×, must apply to surface area before cost calculation

## File Locations

**Frontend Source:** `frontend/src/`
**Frontend Build Output:** `frontend/dist/` (git-ignored)
**Cloudflare Deployment:** `cloudflare-deployment/pages/` (contains built files, committed)
**Backend Python:** `backend/`
**Backend Worker:** `cloudflare-deployment/worker/index.js`
**Branding Docs:** `TECTURA_REBRAND.md`, `CLOUDFLARE_FIX.md`
