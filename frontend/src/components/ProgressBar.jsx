import React from 'react';

const steps = [
  { number: 1, label: 'Location' },
  { number: 2, label: 'Roof Details' },
  { number: 3, label: 'Heating' },
  { number: 4, label: 'Results' }
];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="progress-bar">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`progress-step ${
            step.number === currentStep
              ? 'active'
              : step.number < currentStep
              ? 'completed'
              : ''
          }`}
        >
          <div className="progress-step-number">
            {step.number < currentStep ? '✓' : step.number}
          </div>
          <div className="progress-step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
