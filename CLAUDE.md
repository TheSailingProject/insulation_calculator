# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tectura Isolatie Calculator - A Belgian roof insulation savings calculator with React frontend and Cloudflare Worker backend. Features multi-step form, automatic cost calculation, and real-time savings analysis.

**Brand:** Tectura corporate identity (Orange #E94F1C, Navy #042A5E, Archivo fonts)
**Language:** Dutch (Belgian, formal "uw")
**Deployment:** Cloudflare Pages + Workers

## Build & Run Commands

### Frontend Development
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Development server (http://localhost:5173)
npm run build                  # Production build to dist/
```

### Cloudflare Worker (Backend)
```bash
cd cloudflare-deployment/worker
npx wrangler deploy            # Deploy to production
npx wrangler dev               # Local Worker testing
```

### Full Deployment Workflow
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

### Frontend (React + Vite)

**Multi-step form flow with progressive disclosure:**
1. **Step1RoofInfo.jsx** - Roof area, roof type (flat/pitched), current insulation status, region
2. **Step2InsulationMaterial.jsx** - Material selection from 4 Belgian options with automatic cost calculation
3. **Step3Heating.jsx** - Heating source selection and energy price
4. **Results.jsx** - Savings analysis display

**Key state management pattern in App.jsx:**
- Single `formData` object contains all form fields
- `has_insulation` toggle controls visibility of `current_r_value` input
- `proposed_r_value` is auto-set by material selection (not user-editable)
- `insulation_upgrade_cost` is calculated on frontend before API call

**Critical calculation flow:**
```javascript
// In App.jsx handleNext() when moving from step 3 to 4:
const selectedMaterial = INSULATION_MATERIALS.find(m => m.id === formData.insulation_material);
const pitchMultiplier = formData.roof_type === 'pitched' ? 1.25 : 1.0;
const actualSurfaceArea = parseFloat(formData.roof_area) * pitchMultiplier;
const calculatedInsulationCost = actualSurfaceArea * selectedMaterial.cost_per_m2;
// This cost is then sent to backend in the API request
```

### Backend (Cloudflare Worker)

Single JavaScript file: `cloudflare-deployment/worker/index.js`

**API Endpoints:**
- `GET /config/regions` - Returns Belgian regions with energy prices and HDD values
- `POST /calculate/savings` - Performs all calculations and returns results

**Key calculation logic:**
- `calculateUValue()` - Converts R-value to U-value. **Critical:** Returns 5.0 for R=0 (uninsulated roofs)
- `calculateAnnualHeatLoss()` - Uses formula: `(U × A × HDD × 24) / 1000`
- `calculatePaybackPeriod()` - Returns 999.0 if annual savings ≤ 0

**Regional data hardcoded in CONFIG:**
- Vlaams: €0.35/kWh, 2800 HDD
- Waals: €0.33/kWh, 3000 HDD
- Brussels-Hoofdstedelijk: €0.34/kWh, 2850 HDD

### Material Selection Architecture

**Materials defined in Step2InsulationMaterial.jsx:**
```javascript
INSULATION_MATERIALS = [
  { id: 'glass_wool', cost_per_m2: 17.5, target_r_value: 6.0 },
  { id: 'pir_pur_foam', cost_per_m2: 35, target_r_value: 6.0 },
  { id: 'wood_fiber', cost_per_m2: 55, target_r_value: 6.0 },
  { id: 'eps_graphite', cost_per_m2: 28, target_r_value: 6.0 }
]
```

**When user selects a material:**
1. Frontend sets `proposed_r_value = 6.0` (all materials target Belgian EPB 2023 standard)
2. Frontend calculates total cost: `roof_area × pitch_multiplier × cost_per_m2`
3. Frontend sends calculated cost to backend in `insulation_upgrade_cost` field

**Roof type multipliers:**
- Flat roof: 1.0× (surface area = floor area)
- Pitched roof: 1.25× (accounts for slope, surface area > floor area)

## Branding & Styling

**Tectura brand colors in App.css:**
```css
--tectura-orange: #E94F1C;
--tectura-navy: #042A5E;
```

**Critical branding rules:**
- Border radius: Always 3px (matches tectura-groep.be)
- Buttons: Uppercase text, orange background
- Typography: 'Archivo' for body, 'Archivo Black' for headings
- No dropdowns: All selections use icon-based buttons

**Dutch translation conventions:**
- Use formal "uw" (not "je")
- Component headings: "Stap N: [Section]"
- Technical terms: R-waarde, m², kWh, CO₂ (preserve formatting)

## Key Implementation Details

### R-value = 0 Handling (Critical)

**Problem:** Uninsulated roofs have R-value = 0, which causes division by zero in U-value calculation.

**Solution implemented:**
- **Frontend validation.js:** `validateRValue()` checks `< 0` (not `<= 0`), allowing 0
- **Backend Worker:** `calculateUValue()` returns 5.0 W/m²K for R=0 (typical uninsulated roof U-value)
- **Step1 conditional:** Only shows R-value input when `has_insulation === 'yes'`

### Form Validation Pattern

Validation is split across two files:
- **utils/validation.js** - Pure validation functions
- **App.jsx validateStep()** - Orchestrates validation per step

**Validation rules per step:**
- Step 1: roof_area, roof_type, has_insulation, location, and conditionally current_r_value
- Step 2: insulation_material
- Step 3: heating_source, energy_price_per_kwh

Errors are cleared when:
- Field values change (in component handlers)
- Step validation runs (replaces entire errors object)

### Deployment Architecture

**Git-based Cloudflare Pages deployment:**
1. Build output (`frontend/dist/*`) is copied to `cloudflare-deployment/pages/`
2. Built files are **committed to git** (not in .gitignore)
3. Push to main branch triggers automatic Cloudflare Pages deployment
4. Worker is deployed separately via `wrangler deploy`

**Environment configuration:**
- Frontend uses `VITE_API_URL` from `.env.production`
- Production Worker URL: `https://insulation-calculator-api.arno-01e.workers.dev`

## Common Pitfalls

1. **Forgetting to rebuild before deploy** - Always `npm run build` then copy to pages/
2. **Material cost calculation order** - Must apply pitch multiplier BEFORE multiplying by cost_per_m2
3. **R-value validation for uninsulated roofs** - Backend must handle R=0, frontend must allow it
4. **Not committing built files** - `cloudflare-deployment/pages/*` must be committed (not git-ignored)
5. **Border radius inconsistency** - Use 3px everywhere, not 4px or 8px
6. **Dutch translation** - Always use formal "uw", never informal "je"
7. **proposed_r_value is not user input** - It's set automatically by material selection to 6.0

## File Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/           # Step components + ProgressBar
│   │   ├── services/api.js       # API layer with VITE_API_URL
│   │   ├── utils/validation.js   # Validation functions
│   │   ├── App.jsx               # Main orchestrator
│   │   └── App.css               # Tectura brand styles
│   └── dist/                     # Build output (git-ignored)
│
└── cloudflare-deployment/
    ├── worker/
    │   ├── index.js              # Complete backend logic
    │   └── wrangler.toml         # Worker config
    └── pages/                    # Built frontend (git-committed)
```
