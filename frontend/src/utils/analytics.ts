/**
 * Analytics tracking utilities
 *
 * This module provides event tracking for user interactions.
 * Replace with your analytics provider (Google Analytics, Plausible, etc.)
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

/**
 * Track a custom event
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  const { category, action, label, value } = event;

  // Google Analytics 4 (gtag.js) implementation
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Plausible Analytics implementation
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(action, {
      props: {
        category,
        label,
        value,
      },
    });
  }

  // Console logging in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', { category, action, label, value });
  }
};

/**
 * Track calculator step completion
 */
export const trackStepCompletion = (step: number): void => {
  trackEvent({
    category: 'Calculator',
    action: 'step_completed',
    label: `Step ${step}`,
    value: step,
  });
};

/**
 * Track material selection
 */
export const trackMaterialSelection = (materialId: string): void => {
  trackEvent({
    category: 'Material',
    action: 'material_selected',
    label: materialId,
  });
};

/**
 * Track heating source selection
 */
export const trackHeatingSourceSelection = (source: string): void => {
  trackEvent({
    category: 'Heating',
    action: 'heating_source_selected',
    label: source,
  });
};

/**
 * Track calculation completion
 */
export const trackCalculationComplete = (results: {
  payback_period: number;
  annual_savings: number;
}): void => {
  trackEvent({
    category: 'Calculator',
    action: 'calculation_completed',
    label: 'Calculation Success',
    value: Math.round(results.annual_savings),
  });
};

/**
 * Track PDF download
 */
export const trackPdfDownload = (): void => {
  trackEvent({
    category: 'PDF',
    action: 'pdf_downloaded',
    label: 'Report Download',
  });
};

/**
 * Track region selection
 */
export const trackRegionSelection = (region: string): void => {
  trackEvent({
    category: 'Region',
    action: 'region_selected',
    label: region,
  });
};

/**
 * Track roof type selection
 */
export const trackRoofTypeSelection = (roofType: string): void => {
  trackEvent({
    category: 'Roof',
    action: 'roof_type_selected',
    label: roofType,
  });
};

/**
 * Initialize analytics
 * Call this in your main App component
 */
export const initAnalytics = (): void => {
  // Add your analytics initialization code here
  // For example, Google Analytics:
  //
  // const script = document.createElement('script');
  // script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  // script.async = true;
  // document.head.appendChild(script);
  //
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){dataLayer.push(arguments);}
  // gtag('js', new Date());
  // gtag('config', 'GA_MEASUREMENT_ID');

  if (import.meta.env.DEV) {
    console.log('[Analytics] Initialized in development mode');
  }
};

export default {
  trackEvent,
  trackStepCompletion,
  trackMaterialSelection,
  trackHeatingSourceSelection,
  trackCalculationComplete,
  trackPdfDownload,
  trackRegionSelection,
  trackRoofTypeSelection,
  initAnalytics,
};
