import React from 'react';
import {
  validateRoofArea,
  validateRValue,
  validateProposedRValue
} from '../utils/validation';

const Step2RoofDetails = ({ formData, setFormData, errors, setErrors }) => {
  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validate based on field
    let error = null;
    if (field === 'roof_area') {
      error = validateRoofArea(value);
    } else if (field === 'current_r_value') {
      error = validateRValue(value, 'Current R-value');
    } else if (field === 'proposed_r_value') {
      error = validateProposedRValue(formData.current_r_value, value);
    }

    setErrors({ ...errors, [field]: error });
  };

  return (
    <div className="form-section">
      <h2>Step 2: Roof Details</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Enter your roof area and current/proposed insulation R-values.
      </p>

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
          Enter the total area of your roof in square meters
        </span>
      </div>

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
          Thermal resistance of your current insulation (0 if no insulation)
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="proposed_r_value">Proposed R-value (m²·K/W) *</label>
        <input
          type="number"
          id="proposed_r_value"
          placeholder="e.g., 6.0"
          value={formData.proposed_r_value}
          onChange={(e) => handleFieldChange('proposed_r_value', e.target.value)}
          className={errors.proposed_r_value ? 'error' : ''}
          step="0.1"
          min="0"
        />
        {errors.proposed_r_value && (
          <span className="error-message">{errors.proposed_r_value}</span>
        )}
        <span className="helper-text">
          Target R-value after insulation upgrade (must be higher than current)
        </span>
      </div>

      {formData.current_r_value && formData.proposed_r_value && (
        <div className="alert alert-success">
          <strong>R-value Improvement:</strong>{' '}
          {((parseFloat(formData.proposed_r_value) - parseFloat(formData.current_r_value)) /
            parseFloat(formData.current_r_value) * 100).toFixed(0)}%
          increase
        </div>
      )}
    </div>
  );
};

export default Step2RoofDetails;
