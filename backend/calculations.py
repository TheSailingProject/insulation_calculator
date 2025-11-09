"""
Core calculation functions for insulation savings analysis
"""
from typing import Dict
from config import settings


def calculate_u_value(r_value: float) -> float:
    """
    Calculate U-value (thermal transmittance) from R-value

    Formula: U = 1 / R
    where:
    - U = thermal transmittance (W/m²·K)
    - R = thermal resistance (m²·K/W)

    Args:
        r_value: Thermal resistance in m²·K/W

    Returns:
        U-value in W/m²·K
    """
    if r_value <= 0:
        raise ValueError("R-value must be greater than 0")
    return 1.0 / r_value


def calculate_annual_heat_loss(
    u_value: float,
    roof_area: float,
    heating_degree_days: float
) -> float:
    """
    Calculate annual heat loss through the roof

    Formula: Q = U × A × HDD × 24 / 1000
    where:
    - Q = annual heat loss (kWh/year)
    - U = U-value (W/m²·K)
    - A = roof area (m²)
    - HDD = heating degree days (K·days/year)
    - 24 = hours per day
    - 1000 = conversion from Wh to kWh

    Args:
        u_value: Thermal transmittance in W/m²·K
        roof_area: Roof area in m²
        heating_degree_days: Annual heating degree days in K·days

    Returns:
        Annual heat loss in kWh/year
    """
    return (u_value * roof_area * heating_degree_days * 24) / 1000


def calculate_energy_savings(
    current_heat_loss: float,
    proposed_heat_loss: float
) -> float:
    """
    Calculate annual energy savings from insulation upgrade

    Args:
        current_heat_loss: Current annual heat loss in kWh/year
        proposed_heat_loss: Proposed annual heat loss in kWh/year

    Returns:
        Annual energy savings in kWh/year
    """
    savings = current_heat_loss - proposed_heat_loss
    return max(0, savings)  # Ensure non-negative


def calculate_cost_savings(
    energy_savings: float,
    energy_price_per_kwh: float
) -> float:
    """
    Calculate annual cost savings

    Args:
        energy_savings: Annual energy savings in kWh/year
        energy_price_per_kwh: Energy price in €/kWh

    Returns:
        Annual cost savings in €/year
    """
    return energy_savings * energy_price_per_kwh


def calculate_payback_period(
    insulation_cost: float,
    annual_savings: float
) -> float:
    """
    Calculate simple payback period

    Formula: Payback = Initial Cost / Annual Savings

    Args:
        insulation_cost: Total insulation upgrade cost in €
        annual_savings: Annual cost savings in €/year

    Returns:
        Payback period in years (returns 999 if savings are negligible)
    """
    if annual_savings <= 0:
        return 999.0  # No payback if no savings
    return insulation_cost / annual_savings


def calculate_co2_reduction(
    energy_savings: float,
    co2_intensity: float
) -> float:
    """
    Calculate annual CO2 emissions reduction

    Formula: CO2 = Energy Savings × CO2 Intensity Factor

    Args:
        energy_savings: Annual energy savings in kWh/year
        co2_intensity: CO2 intensity factor in kg CO2/kWh

    Returns:
        Annual CO2 reduction in kg CO2/year
    """
    return energy_savings * co2_intensity


def estimate_insulation_cost(roof_area: float) -> float:
    """
    Estimate insulation upgrade cost based on roof area

    Args:
        roof_area: Roof area in m²

    Returns:
        Estimated cost in €
    """
    return roof_area * settings.default_insulation_cost_per_sqm


def perform_full_calculation(
    location: str,
    roof_area: float,
    current_r_value: float,
    proposed_r_value: float,
    heating_source: str,
    energy_price_per_kwh: float,
    insulation_upgrade_cost: float | None = None
) -> Dict:
    """
    Perform complete insulation savings calculation

    Args:
        location: Belgian region
        roof_area: Roof area in m²
        current_r_value: Current insulation R-value in m²·K/W
        proposed_r_value: Proposed insulation R-value in m²·K/W
        heating_source: Type of heating source
        energy_price_per_kwh: Energy price in €/kWh
        insulation_upgrade_cost: Optional total upgrade cost in €

    Returns:
        Dictionary containing all calculation results
    """
    # Get regional data
    heating_degree_days = settings.heating_degree_days[location]
    co2_intensity = settings.co2_intensity[heating_source]

    # Calculate U-values
    current_u_value = calculate_u_value(current_r_value)
    proposed_u_value = calculate_u_value(proposed_r_value)

    # Calculate heat loss
    current_heat_loss = calculate_annual_heat_loss(
        current_u_value, roof_area, heating_degree_days
    )
    proposed_heat_loss = calculate_annual_heat_loss(
        proposed_u_value, roof_area, heating_degree_days
    )

    # Calculate energy and cost savings
    annual_energy_savings = calculate_energy_savings(
        current_heat_loss, proposed_heat_loss
    )
    annual_cost_savings = calculate_cost_savings(
        annual_energy_savings, energy_price_per_kwh
    )

    # Estimate insulation cost if not provided
    if insulation_upgrade_cost is None:
        insulation_upgrade_cost = estimate_insulation_cost(roof_area)

    # Calculate payback period
    payback_period = calculate_payback_period(
        insulation_upgrade_cost, annual_cost_savings
    )

    # Calculate 10-year savings
    ten_year_total_savings = (annual_cost_savings * 10) - insulation_upgrade_cost

    # Calculate CO2 reduction
    annual_co2_reduction = calculate_co2_reduction(
        annual_energy_savings, co2_intensity
    )
    ten_year_co2_reduction = annual_co2_reduction * 10

    return {
        "location": location,
        "roof_area": roof_area,
        "current_r_value": current_r_value,
        "proposed_r_value": proposed_r_value,
        "heating_source": heating_source,
        "energy_price_per_kwh": energy_price_per_kwh,
        "current_u_value": round(current_u_value, 4),
        "proposed_u_value": round(proposed_u_value, 4),
        "annual_heat_loss_current": round(current_heat_loss, 2),
        "annual_heat_loss_proposed": round(proposed_heat_loss, 2),
        "annual_energy_savings": round(annual_energy_savings, 2),
        "annual_cost_savings": round(annual_cost_savings, 2),
        "insulation_upgrade_cost": round(insulation_upgrade_cost, 2),
        "payback_period": round(payback_period, 2),
        "ten_year_total_savings": round(ten_year_total_savings, 2),
        "annual_co2_reduction": round(annual_co2_reduction, 2),
        "ten_year_co2_reduction": round(ten_year_co2_reduction, 2),
        "heating_degree_days": heating_degree_days,
        "co2_intensity_factor": co2_intensity
    }
