import React from 'react';

const Results = ({ results, onDownloadPdf, downloadingPdf }) => {
  const formatCurrency = (value) => `€${value.toFixed(2)}`;
  const formatNumber = (value, decimals = 2) => value.toFixed(decimals);

  return (
    <div className="results-container">
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '24px' }}>
        Uw isolatie besparingsanalyse
      </h2>

      {/* Key Metrics Summary */}
      <div className="results-summary">
        <div className="result-card">
          <div className="result-card-label">Jaarlijkse besparing</div>
          <div className="result-card-value">
            {formatCurrency(results.annual_cost_savings)}
          </div>
          <div className="result-card-unit">per jaar</div>
        </div>

        <div className="result-card">
          <div className="result-card-label">Terugverdientijd</div>
          <div className="result-card-value">
            {formatNumber(results.payback_period, 1)}
          </div>
          <div className="result-card-unit">jaar</div>
        </div>

        <div className="result-card">
          <div className="result-card-label">10-jarige besparing</div>
          <div className="result-card-value">
            {formatCurrency(results.ten_year_total_savings)}
          </div>
          <div className="result-card-unit">totale opbrengst</div>
        </div>

        <div className="result-card success">
          <div className="result-card-label">CO₂ reductie</div>
          <div className="result-card-value">
            {formatNumber(results.annual_co2_reduction, 0)}
          </div>
          <div className="result-card-unit">kg/jaar</div>
        </div>
      </div>

      {/* Energy Analysis */}
      <div className="results-details">
        <h3>Energie-analyse</h3>
        <table className="results-table">
          <tbody>
            <tr>
              <td>Huidige U-waarde</td>
              <td>{formatNumber(results.current_u_value, 4)} W/m²·K</td>
            </tr>
            <tr>
              <td>Voorgestelde U-waarde</td>
              <td>{formatNumber(results.proposed_u_value, 4)} W/m²·K</td>
            </tr>
            <tr>
              <td>U-waarde reductie</td>
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
              <td>Huidig jaarlijks warmteverlies</td>
              <td>{formatNumber(results.annual_heat_loss_current, 0)} kWh/jaar</td>
            </tr>
            <tr>
              <td>Voorgesteld jaarlijks warmteverlies</td>
              <td>{formatNumber(results.annual_heat_loss_proposed, 0)} kWh/jaar</td>
            </tr>
            <tr>
              <td>
                <strong>Jaarlijkse energiebesparing</strong>
              </td>
              <td>
                <strong>{formatNumber(results.annual_energy_savings, 0)} kWh/jaar</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Analysis */}
      <div className="results-details">
        <h3>Financiële analyse</h3>
        <table className="results-table">
          <tbody>
            <tr>
              <td>Isolatie upgrade kosten</td>
              <td>{formatCurrency(results.insulation_upgrade_cost)}</td>
            </tr>
            <tr>
              <td>Jaarlijkse energiebesparing</td>
              <td>{formatNumber(results.annual_energy_savings, 0)} kWh</td>
            </tr>
            <tr>
              <td>Energieprijs</td>
              <td>€{formatNumber(results.energy_price_per_kwh, 3)}/kWh</td>
            </tr>
            <tr>
              <td>
                <strong>Jaarlijkse kostenbesparing</strong>
              </td>
              <td>
                <strong>{formatCurrency(results.annual_cost_savings)}/jaar</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Terugverdientijd</strong>
              </td>
              <td>
                <strong>{formatNumber(results.payback_period, 2)} jaar</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>10-jarige totale besparing</strong>
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
        <h3>Milieueffect</h3>
        <table className="results-table">
          <tbody>
            <tr>
              <td>Verwarmingsbron</td>
              <td style={{ textTransform: 'capitalize' }}>
                {results.heating_source.replace('_', ' ')}
              </td>
            </tr>
            <tr>
              <td>CO₂ intensiteitsfactor</td>
              <td>{formatNumber(results.co2_intensity_factor, 3)} kg CO₂/kWh</td>
            </tr>
            <tr>
              <td>
                <strong>Jaarlijkse CO₂ reductie</strong>
              </td>
              <td>
                <strong>{formatNumber(results.annual_co2_reduction, 0)} kg/jaar</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>10-jarige CO₂ reductie</strong>
              </td>
              <td>
                <strong>{formatNumber(results.ten_year_co2_reduction, 0)} kg</strong>
              </td>
            </tr>
            <tr>
              <td>Equivalent geplante bomen</td>
              <td>{formatNumber(results.ten_year_co2_reduction / 411, 1)} bomen*</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
          *Gebaseerd op gemiddelde CO₂-opname van 411 kg per boom over 10 jaar
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
              PDF genereren...
            </>
          ) : (
            <>Download PDF rapport</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Results;
