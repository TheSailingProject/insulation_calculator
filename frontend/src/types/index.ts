/**
 * TypeScript type definitions for Tectura Isolatie Calculator
 */

export interface FormData {
  location: string;
  roof_area: string;
  roof_type: 'flat' | 'pitched' | '';
  has_insulation: 'yes' | 'no' | '';
  current_r_value: string;
  proposed_r_value: string;
  insulation_material: string;
  heating_source: string;
  energy_price_per_kwh: string;
}

export interface FormErrors {
  location?: string | null;
  roof_area?: string | null;
  roof_type?: string | null;
  has_insulation?: string | null;
  current_r_value?: string | null;
  proposed_r_value?: string | null;
  insulation_material?: string | null;
  heating_source?: string | null;
  energy_price_per_kwh?: string | null;
}

export interface Region {
  name: string;
  default_energy_price: number;
  heating_degree_days: number;
}

export interface HeatingSource {
  value: string;
  label: string;
  co2_intensity: number;
}

export interface InsulationMaterial {
  id: string;
  name: string;
  category: string;
  cost_per_m2: number;
  r_value_per_cm: number;
  target_r_value: number;
  description: string;
  benefits: string[];
  icon: string;
}

export interface CalculationResults {
  location: string;
  roof_area: number;
  current_r_value: number;
  proposed_r_value: number;
  heating_source: string;
  energy_price_per_kwh: number;
  current_u_value: number;
  proposed_u_value: number;
  annual_heat_loss_current: number;
  annual_heat_loss_proposed: number;
  annual_energy_savings: number;
  annual_cost_savings: number;
  insulation_upgrade_cost: number;
  payback_period: number;
  ten_year_total_savings: number;
  annual_co2_reduction: number;
  ten_year_co2_reduction: number;
  heating_degree_days: number;
  co2_intensity_factor: number;
}

export interface ApiConfig {
  regions: Region[];
  heating_sources: HeatingSource[];
}

export interface CalculationRequest {
  location: string;
  roof_area: number;
  current_r_value: number;
  proposed_r_value: number;
  heating_source: string;
  energy_price_per_kwh: number;
  insulation_upgrade_cost: number;
}
