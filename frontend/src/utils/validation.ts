/**
 * Form validation utilities - Dutch (Belgian) translations
 */

export const validateLocation = (location: string): string | null => {
  if (!location) {
    return 'Selecteer een regio';
  }
  return null;
};

export const validateRoofArea = (area: string | number): string | null => {
  if (!area || area === '') {
    return 'Voer het dakoppervlakte in';
  }
  const numArea = parseFloat(area.toString());
  if (isNaN(numArea)) {
    return 'Dakoppervlakte moet een getal zijn';
  }
  if (numArea <= 0) {
    return 'Dakoppervlakte moet groter zijn dan 0';
  }
  if (numArea > 10000) {
    return 'Dakoppervlakte lijkt te groot (max 10.000 m²)';
  }
  return null;
};

export const validateRValue = (
  rValue: string | number,
  label: string = 'R-waarde'
): string | null => {
  // Allow 0 as valid value (no insulation), but not empty string
  if (rValue === '' || rValue === null || rValue === undefined) {
    return `Voer de ${label} in`;
  }
  const numRValue = parseFloat(rValue.toString());
  if (isNaN(numRValue)) {
    return `${label} moet een getal zijn`;
  }
  if (numRValue < 0) {
    return `${label} kan niet negatief zijn`;
  }
  if (numRValue > 20) {
    return `${label} lijkt te hoog (max 20)`;
  }
  return null;
};

export const validateProposedRValue = (
  currentRValue: string | number,
  proposedRValue: string | number
): string | null => {
  const basicError = validateRValue(proposedRValue, 'Voorgestelde R-waarde');
  if (basicError) return basicError;

  const current = parseFloat(currentRValue.toString());
  const proposed = parseFloat(proposedRValue.toString());

  if (!isNaN(current) && !isNaN(proposed) && proposed <= current) {
    return 'Voorgestelde R-waarde moet groter zijn dan de huidige R-waarde';
  }
  return null;
};

export const validateHeatingSource = (source: string): string | null => {
  if (!source) {
    return 'Selecteer een verwarmingsbron';
  }
  return null;
};

export const validateEnergyPrice = (price: string | number): string | null => {
  if (!price || price === '') {
    return 'Voer de energieprijs in';
  }
  const numPrice = parseFloat(price.toString());
  if (isNaN(numPrice)) {
    return 'Energieprijs moet een getal zijn';
  }
  if (numPrice <= 0) {
    return 'Energieprijs moet groter zijn dan 0';
  }
  if (numPrice > 2) {
    return 'Energieprijs lijkt te hoog (max €2.00/kWh)';
  }
  return null;
};

export const validateInsulationCost = (cost: string | number): string | null => {
  if (!cost || cost === '') {
    return null; // Optional field
  }
  const numCost = parseFloat(cost.toString());
  if (isNaN(numCost)) {
    return 'Isolatiekosten moeten een getal zijn';
  }
  if (numCost < 0) {
    return 'Isolatiekosten kunnen niet negatief zijn';
  }
  return null;
};

export const validateRoofType = (roofType: string): string | null => {
  if (!roofType) {
    return 'Selecteer een daktype';
  }
  if (roofType !== 'flat' && roofType !== 'pitched') {
    return 'Ongeldig daktype';
  }
  return null;
};

export const validateInsulationMaterial = (material: string): string | null => {
  if (!material) {
    return 'Selecteer een isolatiemateriaal';
  }
  return null;
};
