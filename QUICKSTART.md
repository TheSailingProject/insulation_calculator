# Quick Start Guide

## ✅ Backend is Ready!

Your backend has been successfully installed and tested. All 26 unit tests passed!

## Running the Backend

### Option 1: Using the batch script (Easiest)
```bash
cd backend
start_server.bat
```

### Option 2: Using Python directly
```bash
cd backend
py main.py
```

The backend will start on **http://localhost:8000**

### Verify Backend is Running
Open in your browser:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Configuration: http://localhost:8000/config/regions

## Running the Frontend

### Initial Setup
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

## Test the Application

1. **Start backend** (port 8000)
2. **Start frontend** (port 3000)
3. Open browser to **http://localhost:3000**
4. Fill out the multi-step form:
   - Step 1: Select region (Vlaams/Waals/Brussels)
   - Step 2: Enter roof area and R-values
   - Step 3: Select heating source and energy price
   - Step 4: View results and download PDF

## Running Tests

```bash
cd backend
py -m pytest test_calculations.py -v
```

## Troubleshooting

### Backend won't start
- Make sure port 8000 is not in use
- Check that all dependencies are installed: `py -m pip list`

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check browser console for errors
- Make sure CORS is enabled (already configured)

### Need to change ports?
**Backend**: Edit `main.py`, change line:
```python
uvicorn.run(app, host="0.0.0.0", port=8000)  # Change 8000
```

**Frontend**: Edit `vite.config.js`, change:
```javascript
server: { port: 3000 }  // Change 3000
```

## API Endpoints

### GET /config/regions
Get available regions and heating sources

### POST /calculate/savings
Calculate insulation savings
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

### POST /calculate/pdf
Generate PDF report (same request body, returns PDF file)

## What's Included

### Backend Features ✅
- ✅ FastAPI REST API
- ✅ Complete calculation engine
- ✅ Belgian regional data
- ✅ PDF report generation
- ✅ Input validation
- ✅ CORS enabled
- ✅ 26 passing unit tests
- ✅ Type hints throughout
- ✅ API documentation

### Frontend Features (Next Steps)
- Multi-step form
- Progress indicators
- Form validation
- Results display
- PDF download
- Responsive design

## Next Steps

1. Install frontend dependencies: `cd frontend && npm install`
2. Start frontend: `npm run dev`
3. Test the full application
4. Customize as needed

## Need Help?

- Backend docs: http://localhost:8000/docs
- Frontend issues: Check browser console
- Tests failing: Run `py -m pytest test_calculations.py -v`

---

**Backend Status**: ✅ Working
**All Tests**: ✅ Passing (26/26)
**Ready to Use**: ✅ Yes
