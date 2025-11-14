import React, { useState, useEffect } from 'react';
import './App.css';
import ProgressBar from './components/ProgressBar';
import Step1RoofInfo from './components/Step1RoofInfo';
import Step2InsulationMaterial, { INSULATION_MATERIALS } from './components/Step2InsulationMaterial';
import Step3Heating from './components/Step3Heating';
import Results from './components/Results';
import { getRegions, calculateSavings, downloadPdfReport } from './services/api';
import {
  validateLocation,
  validateRoofArea,
  validateRValue,
  validateProposedRValue,
  validateHeatingSource,
  validateEnergyPrice,
  validateRoofType,
  validateInsulationMaterial
} from './utils/validation';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    roof_area: '',
    roof_type: '',
    current_r_value: '',
    proposed_r_value: '',
    insulation_material: '',
    heating_source: '',
    energy_price_per_kwh: ''
  });
  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState(null);
  const [heatingSources, setHeatingSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Load configuration data on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getRegions();
        setRegions(config.regions);
        setHeatingSources(config.heating_sources);
        setLoading(false);
      } catch (err) {
        setError('Failed to load configuration. Please refresh the page.');
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate all Step 1 fields
      newErrors.roof_area = validateRoofArea(formData.roof_area);
      newErrors.roof_type = validateRoofType(formData.roof_type);
      newErrors.current_r_value = validateRValue(
        formData.current_r_value,
        'Current R-value'
      );
      newErrors.proposed_r_value = validateProposedRValue(
        formData.current_r_value,
        formData.proposed_r_value
      );
      newErrors.location = validateLocation(formData.location);
    } else if (step === 2) {
      // Validate insulation material selection
      newErrors.insulation_material = validateInsulationMaterial(formData.insulation_material);
    } else if (step === 3) {
      // Validate heating source and energy price
      newErrors.heating_source = validateHeatingSource(formData.heating_source);
      newErrors.energy_price_per_kwh = validateEnergyPrice(
        formData.energy_price_per_kwh
      );
    }

    // Remove null errors
    Object.keys(newErrors).forEach(
      (key) => newErrors[key] === null && delete newErrors[key]
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 3) {
      // Calculate results
      setCalculating(true);
      setError(null);

      try {
        // Calculate insulation cost based on selected material
        const selectedMaterial = INSULATION_MATERIALS.find(m => m.id === formData.insulation_material);
        const roofArea = parseFloat(formData.roof_area);
        const pitchMultiplier = formData.roof_type === 'pitched' ? 1.25 : 1.0;
        const actualSurfaceArea = roofArea * pitchMultiplier;
        const calculatedInsulationCost = actualSurfaceArea * selectedMaterial.cost_per_m2;

        const requestData = {
          location: formData.location,
          roof_area: roofArea,
          current_r_value: parseFloat(formData.current_r_value),
          proposed_r_value: parseFloat(formData.proposed_r_value),
          heating_source: formData.heating_source,
          energy_price_per_kwh: parseFloat(formData.energy_price_per_kwh),
          insulation_upgrade_cost: calculatedInsulationCost
        };

        const result = await calculateSavings(requestData);
        setResults(result);
        setCurrentStep(4);
      } catch (err) {
        setError(err.message || 'Failed to calculate savings. Please try again.');
      } finally {
        setCalculating(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormData({
      location: '',
      roof_area: '',
      roof_type: '',
      current_r_value: '',
      proposed_r_value: '',
      insulation_material: '',
      heating_source: '',
      energy_price_per_kwh: ''
    });
    setErrors({});
    setResults(null);
    setError(null);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setError(null);

    try {
      // Calculate insulation cost based on selected material
      const selectedMaterial = INSULATION_MATERIALS.find(m => m.id === formData.insulation_material);
      const roofArea = parseFloat(formData.roof_area);
      const pitchMultiplier = formData.roof_type === 'pitched' ? 1.25 : 1.0;
      const actualSurfaceArea = roofArea * pitchMultiplier;
      const calculatedInsulationCost = actualSurfaceArea * selectedMaterial.cost_per_m2;

      const requestData = {
        location: formData.location,
        roof_area: roofArea,
        current_r_value: parseFloat(formData.current_r_value),
        proposed_r_value: parseFloat(formData.proposed_r_value),
        heating_source: formData.heating_source,
        energy_price_per_kwh: parseFloat(formData.energy_price_per_kwh),
        insulation_upgrade_cost: calculatedInsulationCost
      };

      await downloadPdfReport(requestData);
    } catch (err) {
      setError(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Belgian Roof Insulation Calculator</h1>
          <p>Calculate your energy savings and environmental impact</p>
        </header>

        <div className="calculator-card">
          <ProgressBar currentStep={currentStep} />

          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {currentStep === 1 && (
            <Step1RoofInfo
              formData={formData}
              setFormData={setFormData}
              regions={regions}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentStep === 2 && (
            <Step2InsulationMaterial
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentStep === 3 && (
            <Step3Heating
              formData={formData}
              setFormData={setFormData}
              heatingSources={heatingSources}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentStep === 4 && results && (
            <Results
              results={results}
              onDownloadPdf={handleDownloadPdf}
              downloadingPdf={downloadingPdf}
            />
          )}

          <div className="button-group">
            {currentStep > 1 && currentStep < 4 && (
              <button className="btn btn-secondary" onClick={handleBack}>
                ← Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={calculating}
                style={{ marginLeft: 'auto' }}
              >
                {calculating ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: '16px', height: '16px', borderWidth: '2px' }}
                    ></div>
                    Calculating...
                  </>
                ) : currentStep === 3 ? (
                  'Calculate Savings →'
                ) : (
                  'Next →'
                )}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleStartOver}
                style={{ marginLeft: 'auto' }}
              >
                ← Start Over
              </button>
            )}
          </div>
        </div>

        <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '0.875rem' }}>
            This calculator provides estimates based on standard methods and regional averages.
            <br />
            Consult with certified professionals for specific recommendations.
          </p>
        </footer>
      </div>

      {calculating && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Calculating your savings...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
