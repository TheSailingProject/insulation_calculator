import React from 'react';
import {
  validateHeatingSource,
  validateEnergyPrice,
  validateInsulationCost
} from '../utils/validation';

const Step3Heating = ({ formData, setFormData, heatingSources, errors, setErrors }) => {
  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validate based on field
    let error = null;
    if (field === 'heating_source') {
      error = validateHeatingSource(value);
    } else if (field === 'energy_price_per_kwh') {
      error = validateEnergyPrice(value);
    } else if (field === 'insulation_upgrade_cost') {
      error = validateInsulationCost(value);
    }

    setErrors({ ...errors, [field]: error });
  };

  return (
    <div className="form-section">
      <h2>Step 3: Heating & Costs</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Provide information about your heating system and energy costs.
      </p>

      <div className="form-group">
        <label htmlFor="heating_source">Heating Source *</label>
        <select
          id="heating_source"
          value={formData.heating_source}
          onChange={(e) => handleFieldChange('heating_source', e.target.value)}
          className={errors.heating_source ? 'error' : ''}
        >
          <option value="">-- Select heating source --</option>
          {heatingSources?.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
        {errors.heating_source && (
          <span className="error-message">{errors.heating_source}</span>
        )}
        {formData.heating_source && (
          <span className="helper-text">
            CO₂ intensity: {heatingSources?.find(s => s.value === formData.heating_source)?.co2_intensity} kg/kWh
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="energy_price_per_kwh">Energy Price (€/kWh) *</label>
        <input
          type="number"
          id="energy_price_per_kwh"
          placeholder="e.g., 0.35"
          value={formData.energy_price_per_kwh}
          onChange={(e) => handleFieldChange('energy_price_per_kwh', e.target.value)}
          className={errors.energy_price_per_kwh ? 'error' : ''}
          step="0.001"
          min="0"
        />
        {errors.energy_price_per_kwh && (
          <span className="error-message">{errors.energy_price_per_kwh}</span>
        )}
        <span className="helper-text">
          Your current average energy price per kilowatt-hour
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="insulation_upgrade_cost">
          Insulation Upgrade Cost (€) <em>(Optional)</em>
        </label>
        <input
          type="number"
          id="insulation_upgrade_cost"
          placeholder="Leave empty for automatic estimate"
          value={formData.insulation_upgrade_cost}
          onChange={(e) => handleFieldChange('insulation_upgrade_cost', e.target.value)}
          className={errors.insulation_upgrade_cost ? 'error' : ''}
          step="1"
          min="0"
        />
        {errors.insulation_upgrade_cost && (
          <span className="error-message">{errors.insulation_upgrade_cost}</span>
        )}
        <span className="helper-text">
          Total cost of the insulation project. If left empty, we'll estimate based on typical costs (€45/m²).
        </span>
      </div>
    </div>
  );
};

export default Step3Heating;
