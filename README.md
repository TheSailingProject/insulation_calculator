# Belgian Roof Insulation Savings Calculator

A comprehensive web application for calculating energy savings, financial returns, and environmental impact of roof insulation upgrades in Belgium. Built with React.js frontend and FastAPI backend.

## Features

### Frontend (React.js)
- **Multi-step form interface** with progress indicators
- **Region selection** for Belgian regions (Vlaams, Waals, Brussels-Hoofdstedelijk)
- **Auto-fill energy prices** based on selected region
- **Real-time validation** with user-friendly error messages
- **Comprehensive results display** showing:
  - Annual energy and cost savings
  - Payback period
  - 10-year total savings
  - CO₂ reduction estimates
- **PDF report download** functionality
- **Responsive design** for mobile and desktop

### Backend (FastAPI)
- **RESTful API** with automatic documentation
- **Calculation engine** using standard insulation formulas:
  - U-value calculation (U = 1/R)
  - Heat loss estimation using degree days
  - Energy savings computation
  - Financial payback analysis
  - CO₂ reduction calculation
- **Regional data** for Belgian energy prices and climate
- **PDF report generation** with detailed methodology
- **Input validation** using Pydantic models
- **CORS support** for frontend integration
- **Comprehensive unit tests**

## Project Structure

```
PythonProject/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration and settings
│   ├── models.py               # Pydantic models for validation
│   ├── calculations.py         # Core calculation functions
│   ├── pdf_generator.py        # PDF report generation
│   ├── test_calculations.py    # Unit tests
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Step1Location.jsx
│   │   │   ├── Step2RoofDetails.jsx
│   │   │   ├── Step3Heating.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── utils/
│   │   │   └── validation.js  # Form validation utilities
│   │   ├── App.jsx            # Main application component
│   │   ├── App.css            # Styles
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (optional):
```bash
cp .env.example .env
# Edit .env with your configuration if needed
```

5. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
cp .env.example .env
# Edit if you need to change the API URL
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)

2. **Open the application** in your browser at `http://localhost:3000`

3. **Complete the multi-step form**:
   - **Step 1**: Select your Belgian region
   - **Step 2**: Enter roof area and insulation R-values
   - **Step 3**: Choose heating source and enter energy costs
   - **Step 4**: View results and download PDF report

## API Endpoints

### `GET /`
Root endpoint with API information

### `GET /config/regions`
Get available Belgian regions, energy prices, and heating sources

### `POST /calculate/savings`
Calculate insulation savings

**Request body:**
```json
{
  "location": "Vlaams",
  "roof_area": 100.0,
  "current_r_value": 2.0,
  "proposed_r_value": 6.0,
  "heating_source": "gas",
  "energy_price_per_kwh": 0.35,
  "insulation_upgrade_cost": 4500.0
}
```

**Response:** CalculationResult object with all metrics

### `POST /calculate/pdf`
Generate PDF report (same request body, returns PDF file)

## Calculation Methodology

### U-value Calculation
```
U = 1 / R
```
Where:
- U = thermal transmittance (W/m²·K)
- R = thermal resistance (m²·K/W)

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

## Regional Data

### Energy Prices (2024 estimates)
- Vlaams: €0.35/kWh
- Waals: €0.33/kWh
- Brussels-Hoofdstedelijk: €0.34/kWh

### Heating Degree Days (base 18°C)
- Vlaams: 2800 K·days/year
- Waals: 3000 K·days/year
- Brussels-Hoofdstedelijk: 2850 K·days/year

### CO₂ Intensity Factors
- Natural Gas: 0.201 kg CO₂/kWh
- Heating Oil: 0.264 kg CO₂/kWh
- Electric: 0.166 kg CO₂/kWh
- Heat Pump: 0.055 kg CO₂/kWh

## Testing

Run backend unit tests:
```bash
cd backend
pytest test_calculations.py -v
```

## Configuration

### Backend Configuration (config.py)
- Energy prices by region
- Heating degree days
- CO₂ intensity factors
- Default insulation costs
- CORS origins

### Frontend Configuration
- API URL via environment variable
- Adjustable through `.env` file

## Development

### Backend Development
- Type hints throughout for code clarity
- Pydantic models for validation
- Comprehensive error handling
- Modular calculation functions

### Frontend Development
- Component-based architecture
- Form validation utilities
- API service layer
- Responsive CSS design

## Production Deployment

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
npm run build
# Serve the dist/ directory with your web server
```

## Notes

- All calculations use standard building physics formulas
- Regional data based on Belgian averages
- Results are estimates; consult professionals for specific projects
- Default insulation cost: €45/m² (adjustable in config)

## License

This project is provided as-is for educational and planning purposes.

## Disclaimer

This calculator provides estimated savings based on standard calculation methods and regional averages. Actual results may vary depending on building characteristics, occupancy patterns, climate variations, and other factors. This tool is for informational purposes only and should not be considered professional advice. Consult with certified energy auditors and insulation professionals for specific recommendations.
