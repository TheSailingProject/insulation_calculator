"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, field_validator
from typing import Literal


class CalculationRequest(BaseModel):
    """Input model for insulation savings calculation"""

    location: Literal["Vlaams", "Waals", "Brussels-Hoofdstedelijk"] = Field(
        ...,
        description="Belgian region"
    )
    roof_area: float = Field(
        ...,
        gt=0,
        le=10000,
        description="Roof area in square meters"
    )
    current_r_value: float = Field(
        ...,
        ge=0,
        le=20,
        description="Current insulation R-value (m²·K/W)"
    )
    proposed_r_value: float = Field(
        ...,
        gt=0,
        le=20,
        description="Proposed insulation R-value (m²·K/W)"
    )
    heating_source: Literal["gas", "oil", "electric", "heat_pump"] = Field(
        ...,
        description="Type of heating source"
    )
    energy_price_per_kwh: float = Field(
        ...,
        gt=0,
        le=2.0,
        description="Energy price per kWh in euros"
    )
    insulation_upgrade_cost: float | None = Field(
        None,
        ge=0,
        description="Total cost of insulation upgrade (optional)"
    )

    @field_validator("proposed_r_value")
    @classmethod
    def validate_r_value_improvement(cls, v: float, info) -> float:
        """Ensure proposed R-value is greater than current R-value"""
        current = info.data.get("current_r_value")
        if current is not None and v <= current:
            raise ValueError("Proposed R-value must be greater than current R-value")
        return v


class CalculationResult(BaseModel):
    """Output model for calculation results"""

    # Input summary
    location: str
    roof_area: float
    current_r_value: float
    proposed_r_value: float
    heating_source: str
    energy_price_per_kwh: float

    # Calculated U-values
    current_u_value: float
    proposed_u_value: float

    # Energy savings
    annual_heat_loss_current: float  # kWh/year
    annual_heat_loss_proposed: float  # kWh/year
    annual_energy_savings: float  # kWh/year
    annual_cost_savings: float  # €/year

    # Financial analysis
    insulation_upgrade_cost: float  # €
    payback_period: float  # years
    ten_year_total_savings: float  # €

    # Environmental impact
    annual_co2_reduction: float  # kg CO2/year
    ten_year_co2_reduction: float  # kg CO2

    # Methodology notes
    heating_degree_days: float
    co2_intensity_factor: float


class ErrorResponse(BaseModel):
    """Error response model"""

    error: str
    detail: str | None = None
