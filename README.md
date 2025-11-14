# Tectura Isolatie Calculator

A Belgian roof insulation savings calculator with React frontend and Cloudflare Worker backend. Features multi-step form flow, automatic cost calculation, and real-time savings analysis.

**Brand:** Tectura corporate identity (Orange #E94F1C, Navy #042A5E, Archivo fonts)
**Language:** Dutch (Belgian, formal "uw")
**Deployment:** Cloudflare Pages + Workers

## Features

- Multi-step progressive form (4 steps)
- Icon-based UI (no dropdowns)
- Roof type selection (flat vs pitched) with surface area multiplier
- 4 Belgian insulation materials with automatic cost calculation
- Real-time energy savings and payback analysis
- CO₂ reduction estimates
- Regional data for Belgian provinces
- Responsive design with Tectura branding

## Quick Start

### Development

```bash
# Install and run frontend
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Copy to Cloudflare Pages directory
cd ..
rm -rf cloudflare-deployment/pages/*
cp -r frontend/dist/* cloudflare-deployment/pages/

# Deploy Worker (backend)
cd cloudflare-deployment/worker
npx wrangler deploy

# Commit and push (auto-deploys Pages)
git add -A
git commit -m "Deploy updated app"
git push origin main
```

## Project Structure

```
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Step1RoofInfo.jsx         # Roof area, type, region
│   │   │   ├── Step2InsulationMaterial.jsx  # Material selection
│   │   │   ├── Step3Heating.jsx          # Heating source
│   │   │   ├── Results.jsx               # Savings analysis
│   │   │   └── ProgressBar.jsx
│   │   ├── services/api.js      # API abstraction layer
│   │   ├── utils/validation.js  # Form validation
│   │   ├── App.jsx              # Main orchestrator
│   │   └── App.css              # Tectura brand styles
│   └── dist/                    # Build output (git-ignored)
│
├── cloudflare-deployment/
│   ├── worker/
│   │   ├── index.js             # Cloudflare Worker (JavaScript backend)
│   │   └── wrangler.toml        # Worker configuration
│   └── pages/                   # Built frontend (committed for deployment)
│
└── README.md
```

## Architecture

### Frontend (React + Vite)

**Multi-step form flow:**
1. **Step 1: Roof Information** - Roof area, type (flat/pitched), insulation status, region
2. **Step 2: Material Selection** - Choose from 4 Belgian insulation materials
3. **Step 3: Heating Source** - Heating type and energy price
4. **Step 4: Results** - Savings analysis

**State Management:**
- Single `formData` object in App.jsx
- `has_insulation` toggle determines if `current_r_value` input is shown
- `proposed_r_value` auto-set by material selection (not user input)
- `insulation_upgrade_cost` calculated from material + roof area × pitch multiplier

### Backend (Cloudflare Worker)

JavaScript implementation deployed to Cloudflare Workers:
- **Endpoint:** `https://insulation-calculator-api.arno-01e.workers.dev`
- **GET /config/regions** - Returns Belgian regions, energy prices, heating sources
- **POST /calculate/savings** - Returns calculation results

Request body structure:
```javascript
{
  location: string,           // "Vlaams" | "Waals" | "Brussels-Hoofdstedelijk"
  roof_area: number,          // m²
  current_r_value: number,    // m²·K/W (0 for uninsulated)
  proposed_r_value: number,   // m²·K/W (auto-set to 6.0)
  heating_source: string,     // "gas" | "oil" | "electric" | "heat_pump"
  energy_price_per_kwh: number,
  insulation_upgrade_cost: number  // Calculated on frontend
}
```

## Technical Details

### Roof Type Multipliers
- Flat roof: 1.0× surface area
- Pitched roof: 1.25× surface area (accounts for slope)

### Insulation Materials (Belgian market)
- **Glass Wool/Mineral Wool:** €17.50/m² (Budget)
- **PIR/PUR Foam Boards:** €35/m² (Mid-Range)
- **Wood Fiber Boards:** €55/m² (Premium Eco)
- **EPS Graphite:** €28/m² (Mid-Range Plus)
- All target R-value of 6.0 (Belgian EPB 2023 standard)

### R-value = 0 Handling
- Frontend: Allows 0 for uninsulated roofs
- Backend: Uses U-value of 5.0 W/m²K for R=0 (typical uninsulated roof)
- Validation: `current_r_value >= 0` (not `> 0`)

### Regional Data (Belgium)
- **Vlaams:** €0.35/kWh, 2800 HDD
- **Waals:** €0.33/kWh, 3000 HDD
- **Brussels-Hoofdstedelijk:** €0.34/kWh, 2850 HDD

## Branding

**Tectura Brand:**
- Primary color (Orange): `#E94F1C`
- Secondary color (Navy): `#042A5E`
- Fonts: 'Archivo' and 'Archivo Black' (Google Fonts)
- Border radius: 3px
- Buttons: Uppercase, orange background

**Design Principles:**
- No dropdowns (all icon/button-based selections)
- Multi-step progressive disclosure
- Real-time validation feedback
- Dutch language throughout (formal "uw")

## Environment Configuration

**Frontend (`.env.production`):**
```
VITE_API_URL=https://insulation-calculator-api.arno-01e.workers.dev
```

## Material Selection Flow

1. User selects material in Step 2
2. Frontend calculates: `cost = roof_area × pitch_multiplier × material.cost_per_m2`
3. Frontend sets: `proposed_r_value = 6.0` (all materials target EPB standard)
4. Cost passed to backend in `insulation_upgrade_cost` field

## Development Notes

### Validation
- `validateRValue()` accepts 0 for uninsulated roofs
- Validation triggers on blur, not on every keystroke
- Errors cleared when field values change

### Translation Conventions
- Component headings: "Stap N: [Section]"
- Form labels use formal Dutch
- Error messages in Dutch
- Technical terms preserved: R-waarde, m², kWh, CO₂

### Common Pitfalls
1. **R-value = 0 validation** - Must allow 0 for uninsulated roofs
2. **Rebuilding before deploy** - Always `npm run build` before copying to `cloudflare-deployment/pages/`
3. **Material selection state** - `proposed_r_value` is set automatically, not user input
4. **Translation consistency** - All user-facing text must be Dutch, use formal "uw"
5. **Border radius** - Use 3px for Tectura brand consistency
6. **Roof type multiplier** - Pitched = 1.25×, must apply before cost calculation

## Cloudflare Deployment

### Prerequisites
```bash
npm install -g wrangler
wrangler login
```

### Deploy Worker
```bash
cd cloudflare-deployment/worker
npx wrangler deploy
```

### Deploy Pages
The project uses Cloudflare Pages with automatic Git deployment:
1. Build frontend: `cd frontend && npm run build`
2. Copy to pages: `rm -rf cloudflare-deployment/pages/* && cp -r frontend/dist/* cloudflare-deployment/pages/`
3. Commit changes (both source and built files)
4. Push to main branch - Cloudflare auto-deploys

## Testing

Frontend testing with live server:
```bash
cd frontend
npm run dev
```

Worker local testing:
```bash
cd cloudflare-deployment/worker
npx wrangler dev
```

## Calculation Methodology

### U-value Calculation
```
U = 1 / R  (for R > 0)
U = 5.0    (for R = 0, uninsulated)
```

### Heat Loss Calculation
```
Q = U × A × HDD × 24 / 1000
```
Where:
- Q = annual heat loss (kWh/year)
- U = U-value (W/m²·K)
- A = roof area (m²)
- HDD = heating degree days (K·days/year)

### Energy Savings
```
Savings = Current Heat Loss - Proposed Heat Loss
```

### CO₂ Reduction
```
CO₂ = Energy Savings × CO₂ Intensity Factor
```

**CO₂ Intensity Factors:**
- Natural Gas: 0.201 kg CO₂/kWh
- Heating Oil: 0.264 kg CO₂/kWh
- Electric: 0.166 kg CO₂/kWh
- Heat Pump: 0.055 kg CO₂/kWh

## License

This project is provided as-is for educational and planning purposes.

## Disclaimer

This calculator provides estimated savings based on standard calculation methods and regional averages. Actual results may vary depending on building characteristics, occupancy patterns, climate variations, and other factors. This tool is for informational purposes only and should not be considered professional advice. Consult with certified energy auditors and insulation professionals for specific recommendations.
