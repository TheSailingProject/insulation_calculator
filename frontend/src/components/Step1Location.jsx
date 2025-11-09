import React from 'react';
import { validateLocation } from '../utils/validation';

const Step1Location = ({ formData, setFormData, regions, errors, setErrors }) => {
  const handleLocationChange = (e) => {
    const location = e.target.value;
    setFormData({ ...formData, location });

    // Auto-fill energy price based on region
    const selectedRegion = regions?.find((r) => r.name === location);
    if (selectedRegion) {
      setFormData({
        ...formData,
        location,
        energy_price_per_kwh: selectedRegion.default_energy_price.toFixed(3)
      });
    }

    // Clear error
    const error = validateLocation(location);
    setErrors({ ...errors, location: error });
  };

  return (
    <div className="form-section">
      <h2>Step 1: Location</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Select your region to automatically load typical energy prices and climate data.
      </p>

      <div className="form-group">
        <label htmlFor="location">Belgian Region *</label>
        <select
          id="location"
          value={formData.location}
          onChange={handleLocationChange}
          className={errors.location ? 'error' : ''}
        >
          <option value="">-- Select a region --</option>
          {regions?.map((region) => (
            <option key={region.name} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
        {errors.location && (
          <span className="error-message">{errors.location}</span>
        )}
      </div>

      {formData.location && (
        <div className="alert alert-success">
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
  );
};

export default Step1Location;
