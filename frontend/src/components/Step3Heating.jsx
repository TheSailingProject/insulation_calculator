import React from 'react';
import {
  validateHeatingSource,
  validateEnergyPrice
} from '../utils/validation';
import { trackHeatingSourceSelection } from '../utils/analytics';

// Heating source icons mapping
const HEATING_ICONS = {
  'natural_gas': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8 L26 20 L24 24 L22 20 Z" fill="currentColor"/>
      <path d="M18 14 L20 24 L18 28 L16 24 Z" fill="currentColor" opacity="0.7"/>
      <path d="M30 14 L32 24 L30 28 L28 24 Z" fill="currentColor" opacity="0.7"/>
      <rect x="12" y="32" width="24" height="4" rx="2" fill="currentColor"/>
    </svg>
  ),
  'electricity': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 8 L16 26 L22 26 L20 40 L32 22 L26 22 Z" fill="currentColor"/>
    </svg>
  ),
  'fuel_oil': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="16" width="20" height="24" rx="2" fill="currentColor"/>
      <circle cx="24" cy="28" r="4" fill="white"/>
      <rect x="22" y="10" width="4" height="8" fill="currentColor"/>
    </svg>
  ),
  'heat_pump': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
      <path d="M24 16 L24 32 M16 24 L32 24" stroke="currentColor" strokeWidth="3"/>
      <path d="M28 20 L32 24 L28 28" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  'wood_pellets': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="20" r="3" fill="currentColor"/>
      <circle cx="28" cy="18" r="3" fill="currentColor"/>
      <circle cx="24" cy="26" r="3" fill="currentColor"/>
      <circle cx="20" cy="32" r="3" fill="currentColor"/>
      <circle cx="30" cy="30" r="3" fill="currentColor"/>
    </svg>
  ),
  'district_heating': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="8" height="16" fill="currentColor"/>
      <rect x="20" y="14" width="8" height="22" fill="currentColor"/>
      <rect x="32" y="18" width="8" height="18" fill="currentColor"/>
      <path d="M4 38 L44 38" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
};

const Step3Heating = ({ formData, setFormData, heatingSources, errors, setErrors }) => {
  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validate based on field
    let error = null;
    if (field === 'heating_source') {
      error = validateHeatingSource(value);
      // Track heating source selection
      trackHeatingSourceSelection(value);
    } else if (field === 'energy_price_per_kwh') {
      error = validateEnergyPrice(value);
    }

    setErrors({ ...errors, [field]: error });
  };

  const selectedSource = heatingSources?.find(s => s.value === formData.heating_source);

  return (
    <div className="form-section">
      <h2>Stap 3: Verwarmingsbron</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Selecteer uw verwarmingssysteem om energiebesparing en CO₂-reductie te berekenen.
      </p>

      {/* Heating Source Selection */}
      <div className="form-group">
        <label>Verwarmingsbron *</label>
        <div className="heating-source-grid">
          {heatingSources?.map((source) => (
            <button
              key={source.value}
              type="button"
              className={`heating-source-button ${formData.heating_source === source.value ? 'selected' : ''}`}
              onClick={() => handleFieldChange('heating_source', source.value)}
            >
              <div className="heating-source-icon">
                {HEATING_ICONS[source.value] || HEATING_ICONS['natural_gas']}
              </div>
              <div className="heating-source-label">{source.label}</div>
              <div className="heating-source-co2">
                {source.co2_intensity} kg CO₂/kWh
              </div>
            </button>
          ))}
        </div>
        {errors.heating_source && (
          <span className="error-message">{errors.heating_source}</span>
        )}
      </div>

      {/* Energy Price */}
      <div className="form-group">
        <label htmlFor="energy_price_per_kwh">Energieprijs (€/kWh) *</label>
        <input
          type="number"
          id="energy_price_per_kwh"
          placeholder="bijv. 0.35"
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
          Uw huidige gemiddelde energieprijs per kilowattuur (vooraf ingevuld op basis van regioselectie)
        </span>
      </div>

      {/* Selection Summary */}
      {selectedSource && (
        <div className="alert alert-success">
          <strong>Verwarmingsbron:</strong> {selectedSource.label}
          <br />
          <strong>CO₂ intensiteit:</strong> {selectedSource.co2_intensity} kg CO₂/kWh
          <br />
          <strong>Energieprijs:</strong> €{parseFloat(formData.energy_price_per_kwh || 0).toFixed(3)}/kWh
        </div>
      )}
    </div>
  );
};

export default Step3Heating;
