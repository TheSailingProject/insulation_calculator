"""
Configuration settings for the insulation calculator API
"""
from pydantic_settings import BaseSettings
from typing import Dict


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # API Settings
    app_name: str = "Belgian Roof Insulation Calculator API"
    api_version: str = "1.0.0"

    # CORS Settings
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173"]

    # Belgian Regional Data - Average Energy Prices (€/kWh) - 2024 estimates
    energy_prices: Dict[str, float] = {
        "Vlaams": 0.35,
        "Waals": 0.33,
        "Brussels-Hoofdstedelijk": 0.34
    }

    # Heating Degree Days (HDD) by region - Annual average base 18°C
    heating_degree_days: Dict[str, float] = {
        "Vlaams": 2800,
        "Waals": 3000,
        "Brussels-Hoofdstedelijk": 2850
    }

    # CO2 Intensity Factors (kg CO2/kWh) by heating source
    co2_intensity: Dict[str, float] = {
        "gas": 0.201,
        "oil": 0.264,
        "electric": 0.166,
        "heat_pump": 0.055
    }

    # Default insulation upgrade cost (€/m²)
    default_insulation_cost_per_sqm: float = 45.0

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
