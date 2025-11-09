/**
 * Form validation utilities
 */

export const validateLocation = (location) => {
  if (!location) {
    return 'Please select a region';
  }
  return null;
};

export const validateRoofArea = (area) => {
  if (!area || area === '') {
    return 'Please enter roof area';
  }
  const numArea = parseFloat(area);
  if (isNaN(numArea)) {
    return 'Roof area must be a number';
  }
  if (numArea <= 0) {
    return 'Roof area must be greater than 0';
  }
  if (numArea > 10000) {
    return 'Roof area seems too large (max 10,000 m²)';
  }
  return null;
};

export const validateRValue = (rValue, label = 'R-value') => {
  if (!rValue || rValue === '') {
    return `Please enter ${label}`;
  }
  const numRValue = parseFloat(rValue);
  if (isNaN(numRValue)) {
    return `${label} must be a number`;
  }
  if (numRValue < 0) {
    return `${label} cannot be negative`;
  }
  if (numRValue > 20) {
    return `${label} seems too high (max 20)`;
  }
  return null;
};

export const validateProposedRValue = (currentRValue, proposedRValue) => {
  const basicError = validateRValue(proposedRValue, 'Proposed R-value');
  if (basicError) return basicError;

  const current = parseFloat(currentRValue);
  const proposed = parseFloat(proposedRValue);

  if (!isNaN(current) && !isNaN(proposed) && proposed <= current) {
    return 'Proposed R-value must be greater than current R-value';
  }
  return null;
};

export const validateHeatingSource = (source) => {
  if (!source) {
    return 'Please select a heating source';
  }
  return null;
};

export const validateEnergyPrice = (price) => {
  if (!price || price === '') {
    return 'Please enter energy price';
  }
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return 'Energy price must be a number';
  }
  if (numPrice <= 0) {
    return 'Energy price must be greater than 0';
  }
  if (numPrice > 2) {
    return 'Energy price seems too high (max €2.00/kWh)';
  }
  return null;
};

export const validateInsulationCost = (cost) => {
  if (!cost || cost === '') {
    return null; // Optional field
  }
  const numCost = parseFloat(cost);
  if (isNaN(numCost)) {
    return 'Insulation cost must be a number';
  }
  if (numCost < 0) {
    return 'Insulation cost cannot be negative';
  }
  return null;
};
