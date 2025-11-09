import React from 'react';

const Results = ({ results, onDownloadPdf, downloadingPdf }) => {
  const formatCurrency = (value) => `€${value.toFixed(2)}`;
  const formatNumber = (value, decimals = 2) => value.toFixed(decimals);

  return (
    <div className="results-container">
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '24px' }}>
        Your Insulation Savings Analysis
      </h2>

      {/* Key Metrics Summary */}
      <div className="results-summary">
        <div className="result-card">
          <div className="result-card-label">Annual Savings</div>
          <div className="result-card-value">
            {formatCurrency(results.annual_cost_savings)}
          </div>
          <div className="result-card-unit">per year</div>
        </div>

        <div className="result-card">
          <div className="result-card-label">Payback Period</div>
          <div className="result-card-value">
            {formatNumber(results.payback_period, 1)}
          </div>
          <div className="result-card-unit">years</div>
        </div>

        <div className="result-card">
          <div className="result-card-label">10-Year Savings</div>
          <div className="result-card-value">
            {formatCurrency(results.ten_year_total_savings)}
          </div>
          <div className="result-card-unit">total return</div>
        </div>

        <div className="result-card success">
          <div className="result-card-label">CO₂ Reduction</div>
          <div className="result-card-value">
            {formatNumber(results.annual_co2_reduction, 0)}
          </div>
          <div className="result-card-unit">kg/year</div>
        </div>
      </div>

      {/* Energy Analysis */}
      <div className="results-details">
        <h3>Energy Analysis</h3>
        <table className="results-table">
          <tbody>
            <tr>
              <td>Current U-value</td>
              <td>{formatNumber(results.current_u_value, 4)} W/m²·K</td>
            </tr>
            <tr>
              <td>Proposed U-value</td>
              <td>{formatNumber(results.proposed_u_value, 4)} W/m²·K</td>
            </tr>
            <tr>
              <td>U-value Reduction</td>
              <td>
                {formatNumber(
                  ((results.current_u_value - results.proposed_u_value) /
                    results.current_u_value) *
                    100,
                  1
                )}
                %
              </td>
            </tr>
            <tr>
              <td>Current Annual Heat Loss</td>
              <td>{formatNumber(results.annual_heat_loss_current, 0)} kWh/year</td>
            </tr>
            <tr>
              <td>Proposed Annual Heat Loss</td>
              <td>{formatNumber(results.annual_heat_loss_proposed, 0)} kWh/year</td>
            </tr>
            <tr>
              <td>
                <strong>Annual Energy Savings</strong>
              </td>
              <td>
                <strong>{formatNumber(results.annual_energy_savings, 0)} kWh/year</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Analysis */}
      <div className="results-details">
        <h3>Financial Analysis</h3>
        <table className="results-table">
          <tbody>
            <tr>
              <td>Insulation Upgrade Cost</td>
              <td>{formatCurrency(results.insulation_upgrade_cost)}</td>
            </tr>
            <tr>
              <td>Annual Energy Savings</td>
              <td>{formatNumber(results.annual_energy_savings, 0)} kWh</td>
            </tr>
            <tr>
              <td>Energy Price</td>
              <td>€{formatNumber(results.energy_price_per_kwh, 3)}/kWh</td>
            </tr>
            <tr>
              <td>
                <strong>Annual Cost Savings</strong>
              </td>
              <td>
                <strong>{formatCurrency(results.annual_cost_savings)}/year</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Payback Period</strong>
              </td>
              <td>
                <strong>{formatNumber(results.payback_period, 2)} years</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>10-Year Total Savings</strong>
              </td>
              <td>
                <strong>{formatCurrency(results.ten_year_total_savings)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Environmental Impact */}
      <div className="results-details">
        <h3>Environmental Impact</h3>
        <table className="results-table">
          <tbody>
            <tr>
              <td>Heating Source</td>
              <td style={{ textTransform: 'capitalize' }}>
                {results.heating_source.replace('_', ' ')}
              </td>
            </tr>
            <tr>
              <td>CO₂ Intensity Factor</td>
              <td>{formatNumber(results.co2_intensity_factor, 3)} kg CO₂/kWh</td>
            </tr>
            <tr>
              <td>
                <strong>Annual CO₂ Reduction</strong>
              </td>
              <td>
                <strong>{formatNumber(results.annual_co2_reduction, 0)} kg/year</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>10-Year CO₂ Reduction</strong>
              </td>
              <td>
                <strong>{formatNumber(results.ten_year_co2_reduction, 0)} kg</strong>
              </td>
            </tr>
            <tr>
              <td>Equivalent Trees Planted</td>
              <td>{formatNumber(results.ten_year_co2_reduction / 411, 1)} trees*</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
          *Based on average CO₂ absorption of 411 kg per tree over 10 years
        </p>
      </div>

      {/* Download PDF Button */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button
          className="btn btn-success"
          onClick={onDownloadPdf}
          disabled={downloadingPdf}
        >
          {downloadingPdf ? (
            <>
              <div
                className="spinner"
                style={{ width: '16px', height: '16px', borderWidth: '2px' }}
              ></div>
              Generating PDF...
            </>
          ) : (
            <>📄 Download PDF Report</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Results;
