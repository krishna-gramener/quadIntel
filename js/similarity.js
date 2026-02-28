/**
 * Similarity Module - Calculates theme overlap, risk scores, and alignment metrics
 * This module provides the core analytical engine for regulatory correlation
 */

/**
 * Extract all themes from an internal audit document
 * Uses standardized themes from the normalized ontology structure
 * @param {Object} internalDoc - Internal audit document
 * @returns {Array} - Array of standardized theme strings
 */
function extractInternalThemes(internalDoc) {
    const themes = new Set();
    
    if (internalDoc.findings && Array.isArray(internalDoc.findings)) {
        internalDoc.findings.forEach(finding => {
            // Extract standardized themes
            if (finding.themes && Array.isArray(finding.themes)) {
                finding.themes.forEach(theme => themes.add(theme));
            }
        });
    }
    
    return Array.from(themes);
}

/**
 * Extract all themes from an external document
 * Uses standardized themes from the normalized ontology structure
 * @param {Object} externalDoc - External warning letter document
 * @returns {Array} - Array of standardized theme strings
 */
function extractExternalThemes(externalDoc) {
    const themes = new Set();
    
    if (externalDoc.allegations && Array.isArray(externalDoc.allegations)) {
        externalDoc.allegations.forEach(allegation => {
            // Extract standardized themes
            if (allegation.themes && Array.isArray(allegation.themes)) {
                allegation.themes.forEach(theme => themes.add(theme));
            }
        });
    }
    
    return Array.from(themes);
}

/**
 * Extract sub-themes from an internal audit document (for detailed context)
 * @param {Object} internalDoc - Internal audit document
 * @returns {Object} - Map of theme to sub-themes array
 */
function extractInternalSubThemes(internalDoc) {
    const subThemeMap = {};
    
    if (internalDoc.findings && Array.isArray(internalDoc.findings)) {
        internalDoc.findings.forEach(finding => {
            if (finding.themes && finding.sub_themes && Array.isArray(finding.themes) && Array.isArray(finding.sub_themes)) {
                finding.themes.forEach(theme => {
                    if (!subThemeMap[theme]) {
                        subThemeMap[theme] = [];
                    }
                    subThemeMap[theme] = subThemeMap[theme].concat(finding.sub_themes);
                });
            }
        });
    }
    
    return subThemeMap;
}

/**
 * Extract sub-themes from an external document (for detailed context)
 * @param {Object} externalDoc - External warning letter document
 * @returns {Object} - Map of theme to sub-themes array
 */
function extractExternalSubThemes(externalDoc) {
    const subThemeMap = {};
    
    if (externalDoc.allegations && Array.isArray(externalDoc.allegations)) {
        externalDoc.allegations.forEach(allegation => {
            if (allegation.themes && allegation.sub_themes && Array.isArray(allegation.themes) && Array.isArray(allegation.sub_themes)) {
                allegation.themes.forEach(theme => {
                    if (!subThemeMap[theme]) {
                        subThemeMap[theme] = [];
                    }
                    subThemeMap[theme] = subThemeMap[theme].concat(allegation.sub_themes);
                });
            }
        });
    }
    
    return subThemeMap;
}

/**
 * Calculate theme overlap between internal and external documents
 * @param {Array} internalThemes - Array of internal themes
 * @param {Array} externalThemes - Array of external themes
 * @returns {Object} - Overlap analysis with shared, internal-only, and external-only themes
 */
function calculateThemeOverlap(internalThemes, externalThemes) {
    const internalSet = new Set(internalThemes);
    const externalSet = new Set(externalThemes);
    
    const shared = internalThemes.filter(theme => externalSet.has(theme));
    const internalOnly = internalThemes.filter(theme => !externalSet.has(theme));
    const externalOnly = externalThemes.filter(theme => !internalSet.has(theme));
    
    const overlapPercentage = internalThemes.length > 0 
        ? (shared.length / internalThemes.length) * 100 
        : 0;
    
    return {
        shared,
        internalOnly,
        externalOnly,
        overlapPercentage: Math.round(overlapPercentage),
        sharedCount: shared.length,
        internalOnlyCount: internalOnly.length,
        externalOnlyCount: externalOnly.length
    };
}

/**
 * Calculate overlap between internal audit and a single external document
 * @param {Object} internalDoc - Internal audit document
 * @param {Object} externalDoc - External warning letter
 * @returns {Object} - Overlap metrics
 */
function calculateDocumentOverlap(internalDoc, externalDoc) {
    const internalThemes = extractInternalThemes(internalDoc);
    const externalThemes = extractExternalThemes(externalDoc);
    
    const overlap = calculateThemeOverlap(internalThemes, externalThemes);
    
    return {
        externalId: externalDoc.id,
        company: externalDoc.company,
        date: externalDoc.date,
        ...overlap
    };
}

/**
 * Calculate overlap between internal audit and all external documents
 * @param {Object} internalDoc - Internal audit document
 * @param {Array} externalDocs - Array of external warning letters
 * @returns {Array} - Array of overlap metrics for each external document
 */
function calculateAllOverlaps(internalDoc, externalDocs) {
    return externalDocs.map(externalDoc => 
        calculateDocumentOverlap(internalDoc, externalDoc)
    ).sort((a, b) => b.overlapPercentage - a.overlapPercentage);
}

/**
 * Get all themes from all external documents
 * @param {Array} externalDocs - Array of external documents
 * @returns {Array} - Array of all unique themes
 */
function getAllExternalThemes(externalDocs) {
    const allThemes = new Set();
    
    externalDocs.forEach(doc => {
        const themes = extractExternalThemes(doc);
        themes.forEach(theme => allThemes.add(theme));
    });
    
    return Array.from(allThemes);
}

/**
 * Calculate theme frequency across external documents
 * @param {Array} externalDocs - Array of external documents
 * @returns {Object} - Map of theme to frequency count
 */
function calculateThemeFrequency(externalDocs) {
    const frequency = {};
    
    externalDocs.forEach(doc => {
        const themes = extractExternalThemes(doc);
        themes.forEach(theme => {
            frequency[theme] = (frequency[theme] || 0) + 1;
        });
    });
    
    return frequency;
}

/**
 * Find themes common in external docs but missing from internal audit
 * @param {Object} internalDoc - Internal audit document
 * @param {Array} externalDocs - Array of external documents
 * @param {Number} minFrequency - Minimum frequency threshold (default: 3)
 * @returns {Array} - Array of missing critical themes with frequency
 */
function findMissingCriticalThemes(internalDoc, externalDocs, minFrequency = 3) {
    const internalThemes = new Set(extractInternalThemes(internalDoc));
    const themeFrequency = calculateThemeFrequency(externalDocs);
    
    const missingThemes = [];
    
    Object.entries(themeFrequency).forEach(([theme, frequency]) => {
        if (!internalThemes.has(theme) && frequency >= minFrequency) {
            missingThemes.push({ theme, frequency });
        }
    });
    
    return missingThemes.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Calculate severity weight for a finding
 * @param {String} severity - Severity level (Critical, Major, Minor)
 * @returns {Number} - Weight value
 */
function getSeverityWeight(severity) {
    const weights = {
        'Critical': 3,
        'Major': 2,
        'Minor': 1
    };
    return weights[severity] || 1;
}

/**
 * Calculate risk exposure score for internal audit
 * @param {Object} internalDoc - Internal audit document
 * @param {Array} externalDocs - Array of external documents
 * @returns {Number} - Risk exposure score (0-100)
 */
function calculateRiskExposureScore(internalDoc, externalDocs) {
    const internalThemes = extractInternalThemes(internalDoc);
    const themeFrequency = calculateThemeFrequency(externalDocs);
    
    // Calculate weighted severity from internal findings
    let totalSeverityWeight = 0;
    let themeCount = 0;
    
    if (internalDoc.findings) {
        internalDoc.findings.forEach(finding => {
            const weight = getSeverityWeight(finding.severity);
            const themes = finding.themes || [];
            themes.forEach(() => {
                totalSeverityWeight += weight;
                themeCount++;
            });
        });
    }
    
    const avgSeverityWeight = themeCount > 0 ? totalSeverityWeight / themeCount : 1;
    
    // Calculate external frequency score
    let externalFrequencyScore = 0;
    internalThemes.forEach(theme => {
        const frequency = themeFrequency[theme] || 0;
        externalFrequencyScore += frequency;
    });
    
    const maxPossibleFrequency = internalThemes.length * externalDocs.length;
    const normalizedFrequency = maxPossibleFrequency > 0 
        ? (externalFrequencyScore / maxPossibleFrequency) 
        : 0;
    
    // Combined risk score (0-100)
    const riskScore = (avgSeverityWeight / 3) * normalizedFrequency * 100;
    
    return Math.min(Math.round(riskScore), 100);
}

/**
 * Determine alignment strength based on overlap percentage
 * @param {Number} overlapPercentage - Percentage of theme overlap
 * @returns {String} - Alignment strength (Low, Medium, High)
 */
function getAlignmentStrength(overlapPercentage) {
    if (overlapPercentage >= 60) return 'High';
    if (overlapPercentage >= 30) return 'Medium';
    return 'Low';
}

/**
 * Calculate comprehensive correlation analysis
 * @param {Object} internalDoc - Internal audit document
 * @param {Array} externalDocs - Array of external documents
 * @returns {Object} - Complete correlation analysis
 */
function calculateCorrelationAnalysis(internalDoc, externalDocs) {
    const internalThemes = extractInternalThemes(internalDoc);
    const allExternalThemes = getAllExternalThemes(externalDocs);
    
    const overlapResults = calculateAllOverlaps(internalDoc, externalDocs);
    const globalOverlap = calculateThemeOverlap(internalThemes, allExternalThemes);
    const missingThemes = findMissingCriticalThemes(internalDoc, externalDocs);
    const riskScore = calculateRiskExposureScore(internalDoc, externalDocs);
    const alignmentStrength = getAlignmentStrength(globalOverlap.overlapPercentage);
    
    return {
        internalDoc,
        internalThemes,
        overlapResults,
        globalOverlap,
        missingThemes,
        riskScore,
        alignmentStrength,
        totalExternalDocs: externalDocs.length
    };
}

/**
 * Get risk score classification
 * @param {Number} score - Risk score (0-100)
 * @returns {String} - Risk level (Low, Medium, High)
 */
function getRiskLevel(score) {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
}

/**
 * Get CSS class for risk level
 * @param {Number} score - Risk score
 * @returns {String} - CSS class name
 */
function getRiskClass(score) {
    const level = getRiskLevel(score);
    return `risk-${level.toLowerCase()}`;
}

/**
 * Get CSS class for alignment strength
 * @param {String} strength - Alignment strength
 * @returns {String} - CSS class name
 */
function getAlignmentClass(strength) {
    return `alignment-${strength.toLowerCase()}`;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractInternalThemes,
        extractExternalThemes,
        extractInternalSubThemes,
        extractExternalSubThemes,
        calculateThemeOverlap,
        calculateDocumentOverlap,
        calculateAllOverlaps,
        getAllExternalThemes,
        calculateThemeFrequency,
        findMissingCriticalThemes,
        calculateRiskExposureScore,
        getAlignmentStrength,
        calculateCorrelationAnalysis,
        getRiskLevel,
        getRiskClass,
        getAlignmentClass
    };
}
