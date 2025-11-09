"""
FastAPI application for Belgian Roof Insulation Calculator
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models import CalculationRequest, CalculationResult, ErrorResponse
from calculations import perform_full_calculation
from pdf_generator import generate_pdf_report
from config import settings
from typing import Dict

app = FastAPI(
    title=settings.app_name,
    version=settings.api_version,
    description="API for calculating roof insulation savings for Belgian regions"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": settings.app_name,
        "version": settings.api_version,
        "endpoints": {
            "/calculate/savings": "POST - Calculate insulation savings",
            "/calculate/pdf": "POST - Generate PDF report",
            "/config/regions": "GET - Get available regions and default prices",
            "/docs": "GET - API documentation"
        }
    }


@app.get("/config/regions")
async def get_regions() -> Dict:
    """
    Get available Belgian regions with default energy prices

    Returns:
        Dictionary containing regional data
    """
    return {
        "regions": [
            {
                "name": "Vlaams",
                "default_energy_price": settings.energy_prices["Vlaams"],
                "heating_degree_days": settings.heating_degree_days["Vlaams"]
            },
            {
                "name": "Waals",
                "default_energy_price": settings.energy_prices["Waals"],
                "heating_degree_days": settings.heating_degree_days["Waals"]
            },
            {
                "name": "Brussels-Hoofdstedelijk",
                "default_energy_price": settings.energy_prices["Brussels-Hoofdstedelijk"],
                "heating_degree_days": settings.heating_degree_days["Brussels-Hoofdstedelijk"]
            }
        ],
        "heating_sources": [
            {
                "value": "gas",
                "label": "Natural Gas",
                "co2_intensity": settings.co2_intensity["gas"]
            },
            {
                "value": "oil",
                "label": "Heating Oil",
                "co2_intensity": settings.co2_intensity["oil"]
            },
            {
                "value": "electric",
                "label": "Electric Heating",
                "co2_intensity": settings.co2_intensity["electric"]
            },
            {
                "value": "heat_pump",
                "label": "Heat Pump",
                "co2_intensity": settings.co2_intensity["heat_pump"]
            }
        ]
    }


@app.post("/calculate/savings", response_model=CalculationResult)
async def calculate_savings(request: CalculationRequest):
    """
    Calculate insulation savings based on input parameters

    Args:
        request: CalculationRequest with all input parameters

    Returns:
        CalculationResult with detailed savings analysis

    Raises:
        HTTPException: If calculation fails
    """
    try:
        result = perform_full_calculation(
            location=request.location,
            roof_area=request.roof_area,
            current_r_value=request.current_r_value,
            proposed_r_value=request.proposed_r_value,
            heating_source=request.heating_source,
            energy_price_per_kwh=request.energy_price_per_kwh,
            insulation_upgrade_cost=request.insulation_upgrade_cost
        )
        return CalculationResult(**result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Calculation error: {str(e)}"
        )


@app.post("/calculate/pdf")
async def generate_pdf(request: CalculationRequest):
    """
    Generate PDF report with calculation results

    Args:
        request: CalculationRequest with all input parameters

    Returns:
        StreamingResponse with PDF file

    Raises:
        HTTPException: If PDF generation fails
    """
    try:
        # Perform calculation
        result = perform_full_calculation(
            location=request.location,
            roof_area=request.roof_area,
            current_r_value=request.current_r_value,
            proposed_r_value=request.proposed_r_value,
            heating_source=request.heating_source,
            energy_price_per_kwh=request.energy_price_per_kwh,
            insulation_upgrade_cost=request.insulation_upgrade_cost
        )

        # Generate PDF
        pdf_buffer = generate_pdf_report(result)

        # Return as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=insulation_savings_report.pdf"
            }
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF generation error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
