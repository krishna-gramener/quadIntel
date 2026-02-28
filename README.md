# QuadIntel

**QuadIntel** is an intelligence-driven regulatory risk correlation system that identifies compliance gaps by correlating internal audit findings with FDA warning letter patterns. Using advanced ontology mapping and theme-based analysis, QuadIntel reveals hidden risks before they escalate into enforcement actions.

## 🎯 Overview

This application provides intelligent correlation analysis between internal pharmaceutical audit documents and external FDA warning letters. It identifies regulatory risk patterns, theme overlaps, and compliance gaps to support proactive risk management.

## ✨ Key Features

### 🔍 **Intelligent Correlation**
- Automatically maps internal audit findings to FDA enforcement patterns
- Standardized theme taxonomy for accurate pattern recognition
- Real-time correlation scoring and risk assessment

### 📊 **Comprehensive Analysis**
- **Summary Tab**: Alignment strength, shared themes, and risk scores
- **Discrepancy Tab**: Gap analysis between internal and external patterns
- **Ontology Graph**: Interactive D3.js visualization of relationships

### 📄 **Document Management**
- Inline PDF viewing of all documents
- Eye buttons for quick document access
- Download and open in new tab options

### 🎨 **Professional UX**
- Beautiful landing page with smooth transitions
- AI-style loading animations
- Responsive design for all devices
- 100% client-side processing (no server required)

## 📊 Data Structure

### Normalized Ontology Approach
This system uses a **standardized theme taxonomy** to enable strong correlation between internal audits and external enforcement patterns. Each finding maps to:
- **Standardized Theme**: High-level enforcement pattern (e.g., "Supplier Oversight Failure")
- **Sub-themes**: Detailed contextual findings (e.g., "Desktop Audit Overuse")

### Internal Audit Documents (5)
1. **Global System Audit – External Manufacturing Quality (EMQ)**
   - Focus: Supplier oversight and CMO verification gaps
   
2. **Site Audit – Latina Italy (Sterile Operations)**
   - Focus: Media fill contamination and environmental monitoring
   
3. **Supplier Audit – Brassica Pharma**
   - Focus: Desktop requalification and data transparency
   
4. **Site Audit – Fort Washington**
   - Focus: DEG/Benzene testing waivers and OOS investigations
   
5. **Global Engineering Review – Water Systems**
   - Focus: Sanitization postponements and microbial drift

### External FDA Warning Letters (8)
Real enforcement patterns from companies including:
- Acme United Corp. (Water contamination)
- Accupack Midwest (Benzene contamination)
- Accu Bio Laboratories (OOS violations)
- Abraxis Bioscience (Media fill failures)
- Absara Cosmetics (Microbial contamination)
- Acella Pharmaceuticals (Data integrity)
- AACE Pharmaceuticals (Laboratory controls)
- Accra-Pac (Impurity testing)

### Risk Categories (7 Standardized)
- **Water Systems**: Contamination and sanitization control
- **Sterility**: Aseptic processing and media fill assurance
- **Supplier Management**: CMO oversight and qualification
- **Raw Materials**: Impurity testing and verification
- **Investigations**: OOS handling and root cause analysis
- **Data Integrity**: Audit trails and electronic records
- **Laboratory Control**: Testing protocols and validation

### Standardized Themes (10 Core)
1. Water System Contamination
2. Sterility Assurance Failure
3. OOS Investigation Failure
4. Supplier Oversight Failure
5. Impurity Testing Failure
6. Data Integrity Failure
7. Inadequate Validation
8. Inadequate CAPA
9. Environmental Monitoring Failure
10. Laboratory Control Failure

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required
- No backend server needed
- No build tools required

### Installation

1. **Download/Clone the project**
   ```bash
   cd /home/krishna-kumar/Desktop/office/regulatory-intelligence
   ```

2. **Open the application**
   Simply open `index.html` in your web browser:
   - Double-click `index.html`, or
   - Right-click → Open with → [Your Browser], or
   - Drag and drop `index.html` into browser window

That's it! The application runs entirely in your browser.

## 📁 Project Structure

```
regulatory-intelligence/
├── index.html              # Main application HTML
├── README.md              # This file
├── css/
│   └── styles.css         # Custom styles and animations
└── js/
    ├── data.js            # All JSON data (internal + external docs)
    ├── similarity.js      # Correlation and scoring algorithms
    ├── graph.js           # D3.js graph visualization
    └── app.js             # Main application logic and UI
```

## 🎮 How to Use

### Step 1: Select an Internal Audit
- Click any internal audit from the sidebar
- The system automatically performs correlation analysis

### Step 2: Review Summary
- View alignment strength (Low/Medium/High)
- Check risk exposure score (0-100)
- Review theme overlap with each external document
- Read recommendations

### Step 3: Analyze Discrepancies
- Switch to "Discrepancy Analysis" tab
- Review shared themes (green)
- Identify internal-only themes (blue)
- **Critical**: Review missing themes common in FDA enforcement (red)

### Step 4: Explore Ontology Graph
- Switch to "Ontology Graph" tab
- **Hover** over nodes to see details
- **Click** risk category nodes to filter connections
- **Drag** nodes to rearrange layout
- **Zoom/Pan** to explore relationships

## 🎨 Visual Design

### Color Coding
- 🟢 **Green**: Internal documents, shared themes
- 🔵 **Blue**: External documents, internal-only themes
- 🟠 **Orange**: Themes
- 🟣 **Purple**: Risk categories
- 🔴 **Red**: CFR references, missing critical themes

### Risk Scoring
- **0-39**: Low Risk (Green)
- **40-69**: Medium Risk (Orange)
- **70-100**: High Risk (Red)

### Alignment Strength
- **High**: ≥60% theme overlap
- **Medium**: 30-59% overlap
- **Low**: <30% overlap

## 🧮 Scoring Methodology

### Risk Exposure Score
```
Risk Score = (Weighted Internal Severity) × (External Theme Frequency) × 100
```

Where:
- **Critical findings** = weight 3
- **Major findings** = weight 2
- **Minor findings** = weight 1
- **External frequency** = how often themes appear in FDA warning letters

### Theme Overlap Percentage
```
Overlap % = (Shared Themes / Total Internal Themes) × 100
```

## 🔧 Technical Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first styling (CDN)
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **D3.js v7**: Graph visualization (CDN)
- **Force-Directed Layout**: Interactive node positioning
- **Responsive Design**: Works on desktop and tablet

## 📈 Use Cases

### For Quality Assurance
- Benchmark internal audits against FDA enforcement patterns
- Identify compliance gaps before regulatory inspection
- Prioritize CAPA actions based on risk exposure

### For Regulatory Affairs
- Assess alignment with current FDA enforcement trends
- Prepare for regulatory submissions and inspections
- Track emerging regulatory themes

### For Executive Leadership
- Visualize enterprise regulatory risk landscape
- Make data-driven compliance investment decisions
- Monitor quality culture effectiveness

## 🔒 Data Privacy

- **100% client-side**: No data leaves your browser
- **No tracking**: No analytics or external requests
- **No authentication**: No user accounts or login required
- **Offline capable**: Works without internet (after initial load)

## 🐛 Troubleshooting

### Graph Not Rendering
- Ensure you have internet connection (D3.js loads from CDN)
- Try refreshing the page
- Check browser console for errors (F12)

### Styles Not Loading
- Ensure Tailwind CSS CDN is accessible
- Check browser console for network errors
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Performance Issues
- Close other browser tabs
- Try a different browser
- Clear browser cache

## 🚀 Future Enhancements

Potential additions:
- Export analysis reports to PDF
- Import custom audit documents
- Machine learning-based theme extraction
- Trend analysis over time
- Multi-document comparison
- Custom risk scoring weights

## 📝 License

This is a prototype application for demonstration purposes.

## 👥 Support

For questions or issues:
1. Check browser console for errors (F12)
2. Verify all files are in correct locations
3. Ensure modern browser is being used
4. Check internet connection for CDN resources

## 🎓 Educational Value

This application demonstrates:
- Pure frontend architecture
- Data-driven visualization
- Complex correlation algorithms
- Enterprise UI/UX patterns
- Regulatory intelligence concepts
- Graph theory applications

---

## 🎯 What's New in v2.3

### Landing Page
- Beautiful gradient landing page with QuadIntel branding
- Smooth transitions between landing and main app
- Clear value proposition and feature highlights

### Document Viewer
- Inline PDF viewing for all documents
- Eye buttons in sidebar and overlap table
- Download and open in new tab options

### Loading States
- AI-style loading animations
- Progressive content reveal
- Professional loading messages

### Enhanced UX
- Responsive design improvements
- Smooth animations throughout
- Consistent QuadIntel branding

---

**QuadIntel** - Intelligence-Driven Regulatory Compliance

*Version 2.3 - February 2026*
