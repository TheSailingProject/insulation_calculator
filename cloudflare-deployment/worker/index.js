/**
 * Cloudflare Worker for Belgian Roof Insulation Calculator API
 */

// Configuration data
const CONFIG = {
  energyPrices: {
    'Vlaams': 0.35,
    'Waals': 0.33,
    'Brussels-Hoofdstedelijk': 0.34
  },
  heatingDegreeDays: {
    'Vlaams': 2800,
    'Waals': 3000,
    'Brussels-Hoofdstedelijk': 2850
  },
  co2Intensity: {
    'gas': 0.201,
    'oil': 0.264,
    'electric': 0.166,
    'heat_pump': 0.055
  },
  defaultInsulationCostPerSqm: 45.0
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Calculate U-value from R-value
function calculateUValue(rValue) {
  if (rValue < 0) {
    throw new Error('R-value cannot be negative');
  }
  if (rValue === 0) {
    // For uninsulated roofs (R-value = 0), use a very high U-value
    // Typical uninsulated roof U-value is around 5.0 W/m²K
    return 5.0;
  }
  return 1.0 / rValue;
}

// Calculate annual heat loss
function calculateAnnualHeatLoss(uValue, roofArea, heatingDegreeDays) {
  return (uValue * roofArea * heatingDegreeDays * 24) / 1000;
}

// Calculate energy savings
function calculateEnergySavings(currentHeatLoss, proposedHeatLoss) {
  return Math.max(0, currentHeatLoss - proposedHeatLoss);
}

// Calculate cost savings
function calculateCostSavings(energySavings, energyPricePerKwh) {
  return energySavings * energyPricePerKwh;
}

// Calculate payback period
function calculatePaybackPeriod(insulationCost, annualSavings) {
  if (annualSavings <= 0) return 999.0;
  return insulationCost / annualSavings;
}

// Calculate CO2 reduction
function calculateCO2Reduction(energySavings, co2Intensity) {
  return energySavings * co2Intensity;
}

// Estimate insulation cost
function estimateInsulationCost(roofArea) {
  return roofArea * CONFIG.defaultInsulationCostPerSqm;
}

// Perform full calculation
function performFullCalculation(data) {
  const {
    location,
    roof_area,
    current_r_value,
    proposed_r_value,
    heating_source,
    energy_price_per_kwh,
    insulation_upgrade_cost
  } = data;

  // Validate inputs
  if (!location || !CONFIG.energyPrices[location]) {
    throw new Error('Invalid location');
  }
  if (roof_area <= 0 || roof_area > 10000) {
    throw new Error('Roof area must be between 0 and 10000 m²');
  }
  if (current_r_value < 0 || current_r_value > 20) {
    throw new Error('Current R-value must be between 0 and 20 (0 for uninsulated roofs)');
  }
  if (proposed_r_value <= 0 || proposed_r_value > 20) {
    throw new Error('Proposed R-value must be greater than 0 and up to 20');
  }
  if (proposed_r_value <= current_r_value) {
    throw new Error('Proposed R-value must be greater than current R-value');
  }
  if (!heating_source || !CONFIG.co2Intensity[heating_source]) {
    throw new Error('Invalid heating source');
  }
  if (energy_price_per_kwh <= 0 || energy_price_per_kwh > 2) {
    throw new Error('Energy price must be between 0 and 2 €/kWh');
  }

  // Get regional data
  const heatingDegreeDays = CONFIG.heatingDegreeDays[location];
  const co2Intensity = CONFIG.co2Intensity[heating_source];

  // Calculate U-values
  const currentUValue = calculateUValue(current_r_value);
  const proposedUValue = calculateUValue(proposed_r_value);

  // Calculate heat loss
  const currentHeatLoss = calculateAnnualHeatLoss(currentUValue, roof_area, heatingDegreeDays);
  const proposedHeatLoss = calculateAnnualHeatLoss(proposedUValue, roof_area, heatingDegreeDays);

  // Calculate energy and cost savings
  const annualEnergySavings = calculateEnergySavings(currentHeatLoss, proposedHeatLoss);
  const annualCostSavings = calculateCostSavings(annualEnergySavings, energy_price_per_kwh);

  // Estimate insulation cost if not provided
  const finalInsulationCost = insulation_upgrade_cost !== null && insulation_upgrade_cost !== undefined
    ? insulation_upgrade_cost
    : estimateInsulationCost(roof_area);

  // Calculate payback period
  const paybackPeriod = calculatePaybackPeriod(finalInsulationCost, annualCostSavings);

  // Calculate 10-year savings
  const tenYearTotalSavings = (annualCostSavings * 10) - finalInsulationCost;

  // Calculate CO2 reduction
  const annualCO2Reduction = calculateCO2Reduction(annualEnergySavings, co2Intensity);
  const tenYearCO2Reduction = annualCO2Reduction * 10;

  return {
    location,
    roof_area: Math.round(roof_area * 100) / 100,
    current_r_value: Math.round(current_r_value * 100) / 100,
    proposed_r_value: Math.round(proposed_r_value * 100) / 100,
    heating_source,
    energy_price_per_kwh: Math.round(energy_price_per_kwh * 1000) / 1000,
    current_u_value: Math.round(currentUValue * 10000) / 10000,
    proposed_u_value: Math.round(proposedUValue * 10000) / 10000,
    annual_heat_loss_current: Math.round(currentHeatLoss * 100) / 100,
    annual_heat_loss_proposed: Math.round(proposedHeatLoss * 100) / 100,
    annual_energy_savings: Math.round(annualEnergySavings * 100) / 100,
    annual_cost_savings: Math.round(annualCostSavings * 100) / 100,
    insulation_upgrade_cost: Math.round(finalInsulationCost * 100) / 100,
    payback_period: Math.round(paybackPeriod * 100) / 100,
    ten_year_total_savings: Math.round(tenYearTotalSavings * 100) / 100,
    annual_co2_reduction: Math.round(annualCO2Reduction * 100) / 100,
    ten_year_co2_reduction: Math.round(tenYearCO2Reduction * 100) / 100,
    heating_degree_days: heatingDegreeDays,
    co2_intensity_factor: co2Intensity
  };
}

// Handle requests
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Root endpoint
    if (path === '/' && request.method === 'GET') {
      return new Response(JSON.stringify({
        name: 'Belgian Roof Insulation Calculator API',
        version: '1.0.0',
        endpoints: {
          '/calculate/savings': 'POST - Calculate insulation savings',
          '/config/regions': 'GET - Get available regions and default prices'
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Config/regions endpoint
    if (path === '/config/regions' && request.method === 'GET') {
      return new Response(JSON.stringify({
        regions: [
          {
            name: 'Vlaams',
            default_energy_price: CONFIG.energyPrices['Vlaams'],
            heating_degree_days: CONFIG.heatingDegreeDays['Vlaams']
          },
          {
            name: 'Waals',
            default_energy_price: CONFIG.energyPrices['Waals'],
            heating_degree_days: CONFIG.heatingDegreeDays['Waals']
          },
          {
            name: 'Brussels-Hoofdstedelijk',
            default_energy_price: CONFIG.energyPrices['Brussels-Hoofdstedelijk'],
            heating_degree_days: CONFIG.heatingDegreeDays['Brussels-Hoofdstedelijk']
          }
        ],
        heating_sources: [
          {
            value: 'gas',
            label: 'Natural Gas',
            co2_intensity: CONFIG.co2Intensity['gas']
          },
          {
            value: 'oil',
            label: 'Heating Oil',
            co2_intensity: CONFIG.co2Intensity['oil']
          },
          {
            value: 'electric',
            label: 'Electric Heating',
            co2_intensity: CONFIG.co2Intensity['electric']
          },
          {
            value: 'heat_pump',
            label: 'Heat Pump',
            co2_intensity: CONFIG.co2Intensity['heat_pump']
          }
        ]
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Calculate savings endpoint
    if (path === '/calculate/savings' && request.method === 'POST') {
      const data = await request.json();
      const result = performFullCalculation(data);

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({
      error: 'Not Found',
      detail: `Route ${path} not found`
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Error',
      detail: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
