import React from 'react';
import { validateInsulationMaterial } from '../utils/validation';

// Belgian market insulation materials with realistic pricing
const INSULATION_MATERIALS = [
  {
    id: 'glass_wool',
    name: 'Glass Wool / Mineral Wool',
    category: 'Budget',
    cost_per_m2: 17.5,
    r_value_per_cm: 0.035,
    description: 'Cost-effective traditional insulation. Good thermal performance.',
    benefits: ['Most affordable option', 'Easy to install', 'Fire resistant', 'Good sound insulation'],
    icon: 'budget'
  },
  {
    id: 'pir_pur_foam',
    name: 'PIR/PUR Foam Boards',
    category: 'Mid-Range',
    cost_per_m2: 35,
    r_value_per_cm: 0.028,
    description: 'Excellent thermal performance with thin profile. Popular choice.',
    benefits: ['High R-value per cm', 'Moisture resistant', 'Thin profile saves space', 'Long lifespan'],
    icon: 'standard'
  },
  {
    id: 'wood_fiber',
    name: 'Wood Fiber Boards',
    category: 'Premium Eco',
    cost_per_m2: 55,
    r_value_per_cm: 0.038,
    description: 'Sustainable ecological insulation. Excellent moisture regulation.',
    benefits: ['Eco-friendly & sustainable', 'Breathable material', 'Summer heat protection', 'Carbon negative'],
    icon: 'premium'
  },
  {
    id: 'eps_graphite',
    name: 'EPS Graphite',
    category: 'Mid-Range Plus',
    cost_per_m2: 28,
    r_value_per_cm: 0.032,
    description: 'Enhanced EPS with graphite for better insulation. Great value.',
    benefits: ['Good price-performance', 'Lightweight', 'Easy to cut and fit', 'Water resistant'],
    icon: 'standard'
  }
];

const Step2InsulationMaterial = ({ formData, setFormData, errors, setErrors }) => {
  const handleMaterialSelect = (material) => {
    setFormData({ ...formData, insulation_material: material.id });

    // Clear error
    const error = validateInsulationMaterial(material.id);
    setErrors({ ...errors, insulation_material: error });
  };

  const calculateInsulationCost = (material) => {
    if (!formData.roof_area || !formData.roof_type) {
      return null;
    }

    const roofArea = parseFloat(formData.roof_area);
    const pitchMultiplier = formData.roof_type === 'pitched' ? 1.25 : 1.0;
    const actualSurfaceArea = roofArea * pitchMultiplier;
    const totalCost = actualSurfaceArea * material.cost_per_m2;

    return {
      actualSurfaceArea,
      totalCost
    };
  };

  const selectedMaterial = INSULATION_MATERIALS.find(m => m.id === formData.insulation_material);

  return (
    <div className="form-section">
      <h2>Step 2: Insulation Material</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Choose the insulation material that best fits your needs and budget.
      </p>

      {formData.roof_area && formData.roof_type && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <strong>Your roof surface area:</strong>{' '}
          {(parseFloat(formData.roof_area) * (formData.roof_type === 'pitched' ? 1.25 : 1.0)).toFixed(1)} m²
          {formData.roof_type === 'pitched' && (
            <>
              {' '}(floor area: {formData.roof_area} m² × 1.25 pitch multiplier)
            </>
          )}
        </div>
      )}

      <div className="material-cards-grid">
        {INSULATION_MATERIALS.map((material) => {
          const isSelected = formData.insulation_material === material.id;
          const costInfo = calculateInsulationCost(material);

          return (
            <div
              key={material.id}
              className={`material-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleMaterialSelect(material)}
            >
              <div className="material-card-header">
                <div className="material-category-badge">{material.category}</div>
                {isSelected && (
                  <div className="material-selected-badge">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="#2e7d32"/>
                      <path d="M6 10 L9 13 L14 7" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="material-name">{material.name}</h3>
              <p className="material-description">{material.description}</p>

              <div className="material-pricing">
                <div className="material-price-per-m2">
                  €{material.cost_per_m2.toFixed(2)}/m²
                </div>
                {costInfo && (
                  <div className="material-total-cost">
                    Total: €{costInfo.totalCost.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="material-specs">
                <div className="material-spec-item">
                  <strong>R-value:</strong> {material.r_value_per_cm.toFixed(3)} m²·K/W per cm
                </div>
              </div>

              <ul className="material-benefits">
                {material.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {errors.insulation_material && (
        <span className="error-message" style={{ display: 'block', marginTop: '12px' }}>
          {errors.insulation_material}
        </span>
      )}

      {selectedMaterial && (
        <div className="material-selection-summary">
          <h4>Selected Material Summary</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Material</div>
              <div className="summary-value">{selectedMaterial.name}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Cost per m²</div>
              <div className="summary-value">€{selectedMaterial.cost_per_m2.toFixed(2)}</div>
            </div>
            {calculateInsulationCost(selectedMaterial) && (
              <>
                <div className="summary-item">
                  <div className="summary-label">Roof Surface Area</div>
                  <div className="summary-value">
                    {calculateInsulationCost(selectedMaterial).actualSurfaceArea.toFixed(1)} m²
                  </div>
                </div>
                <div className="summary-item highlight">
                  <div className="summary-label">Total Project Cost</div>
                  <div className="summary-value">
                    €{calculateInsulationCost(selectedMaterial).totalCost.toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2InsulationMaterial;
export { INSULATION_MATERIALS };
