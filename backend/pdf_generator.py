"""
PDF report generation for insulation savings analysis
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
from io import BytesIO
from typing import Dict


def generate_pdf_report(calculation_data: Dict) -> BytesIO:
    """
    Generate a detailed PDF report with calculation results

    Args:
        calculation_data: Dictionary containing all calculation results

    Returns:
        BytesIO buffer containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    # Container for document elements
    elements = []
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=colors.HexColor("#1a5490"),
        spaceAfter=30,
        alignment=TA_CENTER
    )

    heading_style = ParagraphStyle(
        "CustomHeading",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.HexColor("#1a5490"),
        spaceAfter=12,
        spaceBefore=12
    )

    # Title
    elements.append(Paragraph("Roof Insulation Savings Analysis", title_style))
    elements.append(Paragraph(
        f"Report Generated: {datetime.now().strftime('%B %d, %Y')}",
        styles["Normal"]
    ))
    elements.append(Spacer(1, 0.5*cm))

    # Input Summary Section
    elements.append(Paragraph("Input Summary", heading_style))

    input_data = [
        ["Parameter", "Value"],
        ["Location", calculation_data["location"]],
        ["Roof Area", f"{calculation_data['roof_area']:.2f} m²"],
        ["Current R-value", f"{calculation_data['current_r_value']:.2f} m²·K/W"],
        ["Proposed R-value", f"{calculation_data['proposed_r_value']:.2f} m²·K/W"],
        ["Heating Source", calculation_data["heating_source"].replace("_", " ").title()],
        ["Energy Price", f"€{calculation_data['energy_price_per_kwh']:.3f}/kWh"],
    ]

    input_table = Table(input_data, colWidths=[8*cm, 8*cm])
    input_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a5490")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))

    elements.append(input_table)
    elements.append(Spacer(1, 0.5*cm))

    # Technical Analysis Section
    elements.append(Paragraph("Technical Analysis", heading_style))

    tech_data = [
        ["Metric", "Current", "Proposed", "Change"],
        [
            "U-value (W/m²·K)",
            f"{calculation_data['current_u_value']:.4f}",
            f"{calculation_data['proposed_u_value']:.4f}",
            f"{((calculation_data['current_u_value'] - calculation_data['proposed_u_value']) / calculation_data['current_u_value'] * 100):.1f}% reduction"
        ],
        [
            "Annual Heat Loss (kWh)",
            f"{calculation_data['annual_heat_loss_current']:.2f}",
            f"{calculation_data['annual_heat_loss_proposed']:.2f}",
            f"{calculation_data['annual_energy_savings']:.2f} saved"
        ],
    ]

    tech_table = Table(tech_data, colWidths=[4*cm, 4*cm, 4*cm, 4*cm])
    tech_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a5490")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))

    elements.append(tech_table)
    elements.append(Spacer(1, 0.5*cm))

    # Financial Analysis Section
    elements.append(Paragraph("Financial Analysis", heading_style))

    financial_data = [
        ["Metric", "Value"],
        ["Annual Energy Savings", f"{calculation_data['annual_energy_savings']:.2f} kWh"],
        ["Annual Cost Savings", f"€{calculation_data['annual_cost_savings']:.2f}"],
        ["Insulation Upgrade Cost", f"€{calculation_data['insulation_upgrade_cost']:.2f}"],
        ["Payback Period", f"{calculation_data['payback_period']:.2f} years"],
        ["10-Year Total Savings", f"€{calculation_data['ten_year_total_savings']:.2f}"],
    ]

    financial_table = Table(financial_data, colWidths=[10*cm, 6*cm])
    financial_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a5490")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))

    elements.append(financial_table)
    elements.append(Spacer(1, 0.5*cm))

    # Environmental Impact Section
    elements.append(Paragraph("Environmental Impact", heading_style))

    env_data = [
        ["Metric", "Value"],
        ["Annual CO₂ Reduction", f"{calculation_data['annual_co2_reduction']:.2f} kg"],
        ["10-Year CO₂ Reduction", f"{calculation_data['ten_year_co2_reduction']:.2f} kg"],
        ["Equivalent to", f"{(calculation_data['ten_year_co2_reduction'] / 411):.1f} trees planted*"],
    ]

    env_table = Table(env_data, colWidths=[10*cm, 6*cm])
    env_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#228b22")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("BACKGROUND", (0, 1), (-1, -1), colors.lightgreen),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))

    elements.append(env_table)
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(
        "*Based on average CO₂ absorption of 411 kg per tree over 10 years",
        styles["Italic"]
    ))
    elements.append(Spacer(1, 0.5*cm))

    # Methodology Section
    elements.append(Paragraph("Calculation Methodology", heading_style))

    methodology_text = f"""
    <b>U-value Calculation:</b> U = 1 / R, where R is the thermal resistance.<br/>
    <br/>
    <b>Heat Loss Calculation:</b> Q = U × A × HDD × 24 / 1000, where:<br/>
    • Q = annual heat loss (kWh/year)<br/>
    • U = U-value (W/m²·K)<br/>
    • A = roof area ({calculation_data['roof_area']:.2f} m²)<br/>
    • HDD = heating degree days ({calculation_data['heating_degree_days']:.0f} K·days/year)<br/>
    <br/>
    <b>Energy Savings:</b> Difference between current and proposed heat loss.<br/>
    <br/>
    <b>Cost Savings:</b> Energy savings × energy price (€{calculation_data['energy_price_per_kwh']:.3f}/kWh)<br/>
    <br/>
    <b>CO₂ Reduction:</b> Energy savings × CO₂ intensity factor
    ({calculation_data['co2_intensity_factor']:.3f} kg CO₂/kWh for {calculation_data['heating_source']})<br/>
    <br/>
    <b>Payback Period:</b> Insulation upgrade cost ÷ annual cost savings<br/>
    """

    elements.append(Paragraph(methodology_text, styles["Normal"]))
    elements.append(Spacer(1, 0.5*cm))

    # Disclaimer
    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_LEFT
    )

    disclaimer_text = """
    <b>Disclaimer:</b> This report provides estimated savings based on standard calculation
    methods and regional averages. Actual results may vary depending on building characteristics,
    occupancy patterns, climate variations, and other factors. This report is for informational
    purposes only and should not be considered professional advice. Consult with certified
    energy auditors and insulation professionals for specific recommendations.
    """

    elements.append(Paragraph(disclaimer_text, disclaimer_style))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
