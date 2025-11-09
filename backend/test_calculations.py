"""
Unit tests for calculation functions
"""
import pytest
from calculations import (
    calculate_u_value,
    calculate_annual_heat_loss,
    calculate_energy_savings,
    calculate_cost_savings,
    calculate_payback_period,
    calculate_co2_reduction,
    estimate_insulation_cost,
    perform_full_calculation
)


class TestUValueCalculation:
    """Tests for U-value calculation"""

    def test_basic_u_value(self):
        """Test basic U-value calculation"""
        assert calculate_u_value(5.0) == 0.2
        assert calculate_u_value(2.0) == 0.5
        assert calculate_u_value(1.0) == 1.0

    def test_high_r_value(self):
        """Test with high R-value"""
        result = calculate_u_value(10.0)
        assert result == 0.1

    def test_zero_r_value(self):
        """Test that zero R-value raises error"""
        with pytest.raises(ValueError):
            calculate_u_value(0)

    def test_negative_r_value(self):
        """Test that negative R-value raises error"""
        with pytest.raises(ValueError):
            calculate_u_value(-1.0)


class TestHeatLossCalculation:
    """Tests for heat loss calculation"""

    def test_basic_heat_loss(self):
        """Test basic heat loss calculation"""
        # U=0.5, Area=100m², HDD=2800
        # Expected: 0.5 * 100 * 2800 * 24 / 1000 = 3360 kWh/year
        result = calculate_annual_heat_loss(0.5, 100, 2800)
        assert result == 3360.0

    def test_low_u_value(self):
        """Test with low U-value (good insulation)"""
        result = calculate_annual_heat_loss(0.2, 100, 2800)
        assert result == 1344.0

    def test_different_regions(self):
        """Test with different heating degree days"""
        u_value = 0.5
        area = 100

        # Vlaams region
        vlaams_loss = calculate_annual_heat_loss(u_value, area, 2800)
        # Waals region (colder)
        waals_loss = calculate_annual_heat_loss(u_value, area, 3000)

        assert waals_loss > vlaams_loss


class TestEnergySavings:
    """Tests for energy savings calculation"""

    def test_positive_savings(self):
        """Test positive energy savings"""
        current = 3360.0
        proposed = 1344.0
        savings = calculate_energy_savings(current, proposed)
        assert savings == 2016.0

    def test_no_savings(self):
        """Test when there are no savings"""
        savings = calculate_energy_savings(1000.0, 1000.0)
        assert savings == 0.0

    def test_negative_input(self):
        """Test that negative savings return 0"""
        savings = calculate_energy_savings(1000.0, 1500.0)
        assert savings == 0.0


class TestCostSavings:
    """Tests for cost savings calculation"""

    def test_basic_cost_savings(self):
        """Test basic cost savings"""
        energy_savings = 2000.0  # kWh
        price = 0.35  # €/kWh
        result = calculate_cost_savings(energy_savings, price)
        assert result == 700.0

    def test_different_prices(self):
        """Test with different energy prices"""
        energy_savings = 1000.0

        low_price = calculate_cost_savings(energy_savings, 0.30)
        high_price = calculate_cost_savings(energy_savings, 0.40)

        assert high_price > low_price
        assert high_price == 400.0
        assert low_price == 300.0


class TestPaybackPeriod:
    """Tests for payback period calculation"""

    def test_normal_payback(self):
        """Test normal payback period"""
        cost = 4500.0
        annual_savings = 700.0
        result = calculate_payback_period(cost, annual_savings)
        assert round(result, 2) == 6.43

    def test_fast_payback(self):
        """Test fast payback period"""
        result = calculate_payback_period(1000.0, 500.0)
        assert result == 2.0

    def test_zero_savings(self):
        """Test payback with zero savings"""
        result = calculate_payback_period(1000.0, 0.0)
        assert result == 999.0

    def test_negative_savings(self):
        """Test payback with negative savings"""
        result = calculate_payback_period(1000.0, -100.0)
        assert result == 999.0


class TestCO2Reduction:
    """Tests for CO2 reduction calculation"""

    def test_gas_heating(self):
        """Test CO2 reduction for gas heating"""
        energy_savings = 2000.0  # kWh
        co2_intensity = 0.201  # kg CO2/kWh for gas
        result = calculate_co2_reduction(energy_savings, co2_intensity)
        assert result == 402.0

    def test_heat_pump(self):
        """Test CO2 reduction for heat pump"""
        energy_savings = 2000.0
        co2_intensity = 0.055  # kg CO2/kWh for heat pump
        result = calculate_co2_reduction(energy_savings, co2_intensity)
        assert result == 110.0

    def test_zero_savings(self):
        """Test with zero energy savings"""
        result = calculate_co2_reduction(0.0, 0.201)
        assert result == 0.0


class TestInsulationCostEstimation:
    """Tests for insulation cost estimation"""

    def test_basic_estimation(self):
        """Test basic cost estimation"""
        # Default: 45 €/m²
        result = estimate_insulation_cost(100.0)
        assert result == 4500.0

    def test_small_area(self):
        """Test with small roof area"""
        result = estimate_insulation_cost(50.0)
        assert result == 2250.0

    def test_large_area(self):
        """Test with large roof area"""
        result = estimate_insulation_cost(200.0)
        assert result == 9000.0


class TestFullCalculation:
    """Tests for complete calculation pipeline"""

    def test_complete_calculation_vlaams(self):
        """Test complete calculation for Vlaams region"""
        result = perform_full_calculation(
            location="Vlaams",
            roof_area=100.0,
            current_r_value=2.0,
            proposed_r_value=6.0,
            heating_source="gas",
            energy_price_per_kwh=0.35,
            insulation_upgrade_cost=4500.0
        )

        # Verify all required fields are present
        assert "annual_cost_savings" in result
        assert "payback_period" in result
        assert "annual_co2_reduction" in result
        assert "ten_year_total_savings" in result

        # Verify U-values
        assert result["current_u_value"] == 0.5
        assert result["proposed_u_value"] == pytest.approx(0.1667, rel=0.01)

        # Verify savings are positive
        assert result["annual_energy_savings"] > 0
        assert result["annual_cost_savings"] > 0
        assert result["annual_co2_reduction"] > 0

    def test_complete_calculation_waals(self):
        """Test complete calculation for Waals region (higher HDD)"""
        result = perform_full_calculation(
            location="Waals",
            roof_area=100.0,
            current_r_value=2.0,
            proposed_r_value=6.0,
            heating_source="oil",
            energy_price_per_kwh=0.33,
            insulation_upgrade_cost=None  # Test auto-estimation
        )

        # Should have higher savings than Vlaams due to higher HDD
        assert result["annual_energy_savings"] > 0
        assert result["insulation_upgrade_cost"] == 4500.0  # Auto-estimated

    def test_heat_pump_lower_co2(self):
        """Test that heat pump produces lower CO2 reduction"""
        gas_result = perform_full_calculation(
            location="Vlaams",
            roof_area=100.0,
            current_r_value=2.0,
            proposed_r_value=6.0,
            heating_source="gas",
            energy_price_per_kwh=0.35
        )

        heat_pump_result = perform_full_calculation(
            location="Vlaams",
            roof_area=100.0,
            current_r_value=2.0,
            proposed_r_value=6.0,
            heating_source="heat_pump",
            energy_price_per_kwh=0.35
        )

        # Same energy savings
        assert gas_result["annual_energy_savings"] == heat_pump_result["annual_energy_savings"]

        # But heat pump has lower CO2 reduction (lower intensity factor)
        assert heat_pump_result["annual_co2_reduction"] < gas_result["annual_co2_reduction"]

    def test_ten_year_savings(self):
        """Test 10-year savings calculation"""
        result = perform_full_calculation(
            location="Brussels-Hoofdstedelijk",
            roof_area=100.0,
            current_r_value=2.0,
            proposed_r_value=6.0,
            heating_source="gas",
            energy_price_per_kwh=0.34,
            insulation_upgrade_cost=4500.0
        )

        # 10-year savings should be (annual savings * 10) - upgrade cost
        expected = (result["annual_cost_savings"] * 10) - 4500.0
        assert result["ten_year_total_savings"] == pytest.approx(expected, rel=0.01)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
