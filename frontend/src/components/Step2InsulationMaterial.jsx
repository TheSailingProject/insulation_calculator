import React from 'react';
import { validateInsulationMaterial } from '../utils/validation';

// Belgian market insulation materials with realistic pricing
// Target R-value of 6.0 meets Belgian EPB 2023 standards for new buildings
const TARGET_R_VALUE = 6.0;

const INSULATION_MATERIALS = [
  {
    id: 'glass_wool',
    name: 'Glaswol / Minerale wol',
    category: 'Budget',
    cost_per_m2: 17.5,
    r_value_per_cm: 0.035,
    target_r_value: TARGET_R_VALUE,
    description: 'Kosteneffectieve traditionele isolatie. Goede thermische prestaties.',
    benefits: ['Meest betaalbare optie', 'Gemakkelijk te installeren', 'Brandwerend', 'Goede geluidsisolatie'],
    icon: 'budget'
  },
  {
    id: 'pir_pur_foam',
    name: 'PIR/PUR Schuimplaten',
    category: 'Middensegment',
    cost_per_m2: 35,
    r_value_per_cm: 0.028,
    target_r_value: TARGET_R_VALUE,
    description: 'Uitstekende thermische prestaties met dun profiel. Populaire keuze.',
    benefits: ['Hoge R-waarde per cm', 'Vochtbestendig', 'Dun profiel bespaart ruimte', 'Lange levensduur'],
    icon: 'standard'
  },
  {
    id: 'wood_fiber',
    name: 'Houtvezelborden',
    category: 'Premium Eco',
    cost_per_m2: 55,
    r_value_per_cm: 0.038,
    target_r_value: TARGET_R_VALUE,
    description: 'Duurzame ecologische isolatie. Uitstekende vochtregulatie.',
    benefits: ['Milieuvriendelijk & duurzaam', 'Ademend materiaal', 'Zomerse warmtebescherming', 'CO₂-negatief'],
    icon: 'premium'
  },
  {
    id: 'eps_graphite',
    name: 'EPS Grafiet',
    category: 'Middensegment Plus',
    cost_per_m2: 28,
    r_value_per_cm: 0.032,
    target_r_value: TARGET_R_VALUE,
    description: 'Verbeterde EPS met grafiet voor betere isolatie. Uitstekende waarde.',
    benefits: ['Goede prijs-kwaliteitverhouding', 'Lichtgewicht', 'Gemakkelijk te snijden en te passen', 'Waterbestendig'],
    icon: 'standard'
  }
];

const Step2InsulationMaterial = ({ formData, setFormData, errors, setErrors }) => {
  const handleMaterialSelect = (material) => {
    // Set the material and the proposed R-value based on material target
    setFormData({
      ...formData,
      insulation_material: material.id,
      proposed_r_value: material.target_r_value.toString()
    });

    // Clear error
    const error = validateInsulationMaterial(material.id);
    setErrors({ ...errors, insulation_material: error });
  };

  const calculateThickness = (material) => {
    // Thickness (cm) = Target R-value / R-value per cm
    return material.target_r_value / material.r_value_per_cm;
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
      <h2>Stap 2: Isolatiemateriaal</h2>
      <p className="helper-text" style={{ marginBottom: '20px' }}>
        Kies het isolatiemateriaal dat het beste bij uw behoeften en budget past.
      </p>

      {formData.roof_area && formData.roof_type && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <strong>Uw dakoppervlakte:</strong>{' '}
          {(parseFloat(formData.roof_area) * (formData.roof_type === 'pitched' ? 1.25 : 1.0)).toFixed(1)} m²
          {formData.roof_type === 'pitched' && (
            <>
              {' '}(vloeroppervlakte: {formData.roof_area} m² × 1.25 hellingsfactor)
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
                    Totaal: €{costInfo.totalCost.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="material-specs">
                <div className="material-spec-item">
                  <strong>Doel R-waarde:</strong> {material.target_r_value.toFixed(1)} m²·K/W
                </div>
                <div className="material-spec-item">
                  <strong>Benodigde dikte:</strong> ~{calculateThickness(material).toFixed(0)} cm
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
          <h4>Gekozen materiaal overzicht</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Materiaal</div>
              <div className="summary-value">{selectedMaterial.name}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Kosten per m²</div>
              <div className="summary-value">€{selectedMaterial.cost_per_m2.toFixed(2)}</div>
            </div>
            {calculateInsulationCost(selectedMaterial) && (
              <>
                <div className="summary-item">
                  <div className="summary-label">Dakoppervlakte</div>
                  <div className="summary-value">
                    {calculateInsulationCost(selectedMaterial).actualSurfaceArea.toFixed(1)} m²
                  </div>
                </div>
                <div className="summary-item highlight">
                  <div className="summary-label">Totale projectkosten</div>
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
