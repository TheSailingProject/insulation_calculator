import React from 'react';
import {
  validateRoofArea,
  validateRValue,
  validateLocation,
  validateRoofType
} from '../utils/validation';

const Step1RoofInfo = ({ formData, setFormData, regions, errors, setErrors }) => {
  const handleFieldChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };

    // Auto-fill energy price when region changes
    if (field === 'location') {
      const selectedRegion = regions?.find((r) => r.name === value);
      if (selectedRegion) {
        updatedFormData.energy_price_per_kwh = selectedRegion.default_energy_price.toFixed(3);
      }
    }

    // If insulation status changes to "no", reset current R-value to 0
    if (field === 'has_insulation') {
      if (value === 'no') {
        updatedFormData.current_r_value = '0';
      } else if (value === 'yes' && formData.current_r_value === '0') {
        updatedFormData.current_r_value = '';
      }
    }

    setFormData(updatedFormData);

    // Validate based on field
    let error = null;
    if (field === 'roof_area') {
      error = validateRoofArea(value);
    } else if (field === 'current_r_value') {
      error = validateRValue(value, 'Current R-value');
    } else if (field === 'location') {
      error = validateLocation(value);
    } else if (field === 'roof_type') {
      error = validateRoofType(value);
    }

    setErrors({ ...errors, [field]: error });
  };

  return (
    <div className="form-section">
      <h2>Step 1: Roof Information</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Tell us about your roof and location to calculate accurate savings.
      </p>

      {/* Roof Area Input */}
      <div className="form-group">
        <label htmlFor="roof_area">Roof Area (m²) *</label>
        <input
          type="number"
          id="roof_area"
          placeholder="e.g., 100"
          value={formData.roof_area}
          onChange={(e) => handleFieldChange('roof_area', e.target.value)}
          className={errors.roof_area ? 'error' : ''}
          step="0.01"
          min="0"
        />
        {errors.roof_area && (
          <span className="error-message">{errors.roof_area}</span>
        )}
        <span className="helper-text">
          Enter the floor area of your roof in square meters
        </span>
      </div>

      {/* Roof Type Selection */}
      <div className="form-group">
        <label>Roof Type *</label>
        <div className="icon-selection-group">
          <button
            type="button"
            className={`icon-selection-button ${formData.roof_type === 'flat' ? 'selected' : ''}`}
            onClick={() => handleFieldChange('roof_type', 'flat')}
          >
            <div className="icon-selection-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="20" width="32" height="4" fill="currentColor"/>
                <rect x="6" y="24" width="36" height="2" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <div className="icon-selection-label">Flat Roof</div>
            <div className="icon-selection-description">1:1 surface area</div>
          </button>

          <button
            type="button"
            className={`icon-selection-button ${formData.roof_type === 'pitched' ? 'selected' : ''}`}
            onClick={() => handleFieldChange('roof_type', 'pitched')}
          >
            <div className="icon-selection-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12 L40 28 L8 28 Z" fill="currentColor"/>
                <rect x="6" y="28" width="36" height="2" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <div className="icon-selection-label">Pitched Roof</div>
            <div className="icon-selection-description">~1.25x surface area</div>
          </button>
        </div>
        {errors.roof_type && (
          <span className="error-message">{errors.roof_type}</span>
        )}
        <span className="helper-text">
          Pitched roofs have larger surface area than their floor area
        </span>
      </div>

      {/* Current Insulation Status */}
      <div className="form-group">
        <label>Is your roof currently insulated? *</label>
        <div className="icon-selection-group">
          <button
            type="button"
            className={`icon-selection-button ${formData.has_insulation === 'yes' ? 'selected' : ''}`}
            onClick={() => handleFieldChange('has_insulation', 'yes')}
          >
            <div className="icon-selection-icon small">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6 L28 16 L4 16 Z" fill="currentColor" opacity="0.3"/>
                <rect x="6" y="16" width="20" height="3" fill="currentColor"/>
                <rect x="6" y="19" width="20" height="4" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <div className="icon-selection-label">Yes</div>
            <div className="icon-selection-description">Has insulation</div>
          </button>

          <button
            type="button"
            className={`icon-selection-button ${formData.has_insulation === 'no' ? 'selected' : ''}`}
            onClick={() => handleFieldChange('has_insulation', 'no')}
          >
            <div className="icon-selection-icon small">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6 L28 16 L4 16 Z" fill="currentColor" opacity="0.3"/>
                <rect x="6" y="16" width="20" height="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="icon-selection-label">No</div>
            <div className="icon-selection-description">No insulation</div>
          </button>
        </div>
        <span className="helper-text">
          Tell us if your roof already has any insulation installed
        </span>
      </div>

      {/* Current R-value - Only show if roof is insulated */}
      {formData.has_insulation === 'yes' && (
        <div className="form-group">
          <label htmlFor="current_r_value">Current R-value (m²·K/W) *</label>
          <input
            type="number"
            id="current_r_value"
            placeholder="e.g., 2.0"
            value={formData.current_r_value}
            onChange={(e) => handleFieldChange('current_r_value', e.target.value)}
            className={errors.current_r_value ? 'error' : ''}
            step="0.1"
            min="0"
          />
          {errors.current_r_value && (
            <span className="error-message">{errors.current_r_value}</span>
          )}
          <span className="helper-text">
            Thermal resistance of your current insulation (typically 1.0 - 4.0)
          </span>
        </div>
      )}

      {/* Location Selection */}
      <div className="form-group">
        <label>Belgian Region *</label>
        <div className="icon-selection-group">
          {regions?.map((region) => (
            <button
              key={region.name}
              type="button"
              className={`icon-selection-button compact ${formData.location === region.name ? 'selected' : ''}`}
              onClick={() => handleFieldChange('location', region.name)}
            >
              <div className="icon-selection-icon small">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4 C12 4 8 7 8 12 C8 17 16 28 16 28 C16 28 24 17 24 12 C24 7 20 4 16 4 Z" fill="currentColor"/>
                  <circle cx="16" cy="12" r="3" fill="white"/>
                </svg>
              </div>
              <div className="icon-selection-label">{region.name}</div>
            </button>
          ))}
        </div>
        {errors.location && (
          <span className="error-message">{errors.location}</span>
        )}
        {formData.location && (
          <div className="alert alert-success" style={{ marginTop: '12px' }}>
            <strong>Region Selected:</strong> {formData.location}
            <br />
            <strong>Default Energy Price:</strong> €
            {regions
              ?.find((r) => r.name === formData.location)
              ?.default_energy_price.toFixed(3)}
            /kWh
          </div>
        )}
      </div>

    </div>
  );
};

export default Step1RoofInfo;
