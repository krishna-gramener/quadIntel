/**
 * Main Application Module - Orchestrates the Regulatory Risk Correlation System
 * Handles UI interactions, data loading, and view rendering
 */

// Global state
let currentInternalDoc = null;
let currentCorrelationAnalysis = null;

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('QuadIntel - Regulatory Risk Correlation System - Initializing...');
    
    // Set up landing page proceed button
    setupLandingPage();
    
    // Load and display internal audits in sidebar
    loadAuditList();
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Update document counts
    updateDocumentCounts();
    
    console.log('Application initialized successfully');
});

/**
 * Setup landing page and proceed button
 */
function setupLandingPage() {
    const proceedBtn = document.getElementById('proceed-btn');
    const landingPage = document.getElementById('landing-page');
    const mainApp = document.getElementById('main-app');
    
    if (proceedBtn && landingPage && mainApp) {
        proceedBtn.addEventListener('click', function() {
            // Fade out landing page
            landingPage.style.transition = 'opacity 0.5s ease-out';
            landingPage.style.opacity = '0';
            
            setTimeout(() => {
                landingPage.classList.add('hidden');
                mainApp.classList.remove('hidden');
                mainApp.style.opacity = '0';
                
                // Fade in main app
                setTimeout(() => {
                    mainApp.style.transition = 'opacity 0.5s ease-in';
                    mainApp.style.opacity = '1';
                }, 50);
            }, 500);
        });
    }
}

/**
 * Load and display internal audit list in sidebar
 */
function loadAuditList() {
    const auditListContainer = document.getElementById('audit-list');
    
    if (!auditListContainer) return;
    
    auditListContainer.innerHTML = '';
    
    INTERNAL_AUDITS.forEach(audit => {
        const auditItem = document.createElement('div');
        auditItem.className = 'audit-item relative';
        auditItem.dataset.auditId = audit.id;
        
        auditItem.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1 audit-item-clickable">
                    <div class="audit-item-title">${audit.title}</div>
                    <div class="audit-item-meta">
                        <span>${audit.function}</span>
                        <span class="ml-2">•</span>
                        <span class="ml-2">${audit.overall_rating}</span>
                    </div>
                </div>
                <button class="view-doc-btn ml-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition flex-shrink-0" 
                        data-doc-id="${audit.id}" 
                        data-doc-type="internal"
                        title="View document">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
            </div>
        `;
        
        // Click on main area to select audit
        const clickableArea = auditItem.querySelector('.audit-item-clickable');
        clickableArea.addEventListener('click', () => selectAudit(audit.id));
        
        // Click on eye button to view document
        const viewBtn = auditItem.querySelector('.view-doc-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDocumentViewer(audit.id, 'internal');
        });
        
        auditListContainer.appendChild(auditItem);
    });
}

/**
 * Update document counts in sidebar footer
 */
function updateDocumentCounts() {
    const internalCount = document.getElementById('internal-count');
    const externalCount = document.getElementById('external-count');
    
    if (internalCount) internalCount.textContent = INTERNAL_AUDITS.length;
    if (externalCount) externalCount.textContent = EXTERNAL_DOCUMENTS.length;
}

/**
 * Show all loading indicators
 */
function showAllLoaders() {
    // Summary tab loaders
    const loaders = [
        'alignment-strength-loader',
        'shared-themes-loader',
        'overall-rating-loader',
        'internal-summary-loader',
        'external-alignment-loader',
        'overlap-table-loader',
        'recommendations-loader'
    ];
    
    loaders.forEach(loaderId => {
        const loader = document.getElementById(loaderId);
        const content = document.getElementById(loaderId.replace('-loader', '-content'));
        const container = document.getElementById(loaderId.replace('-loader', '-container'));
        
        if (loader) loader.classList.remove('hidden');
        if (content) content.classList.add('hidden');
        if (container) container.classList.add('hidden');
    });
}

/**
 * Hide specific loader and show its content
 */
function hideLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    const content = document.getElementById(loaderId.replace('-loader', '-content'));
    const container = document.getElementById(loaderId.replace('-loader', '-container'));
    
    if (loader) loader.classList.add('hidden');
    if (content) content.classList.remove('hidden');
    if (container) container.classList.remove('hidden');
}

/**
 * Select an internal audit and perform correlation analysis
 * @param {String} auditId - Internal audit ID
 */
function selectAudit(auditId) {
    console.log(`Selecting audit: ${auditId}`);
    
    // Find the audit document
    const audit = INTERNAL_AUDITS.find(a => a.id === auditId);
    
    if (!audit) {
        console.error(`Audit not found: ${auditId}`);
        return;
    }
    
    // Update current state
    currentInternalDoc = audit;
    
    // Update UI immediately
    updateAuditSelection(auditId);
    hideWelcomeScreen();
    
    // Show all loaders first
    showAllLoaders();
    
    // Perform correlation analysis in background
    setTimeout(() => {
        currentCorrelationAnalysis = calculateCorrelationAnalysis(audit, EXTERNAL_DOCUMENTS);
        console.log('Correlation analysis:', currentCorrelationAnalysis);
        
        // Update header info first (fast)
        setTimeout(() => {
            updateHeaderInfo(audit, currentCorrelationAnalysis);
        }, 300);
        
        // Render summary tab with staggered timing
        setTimeout(() => {
            renderSummaryTab(audit, currentCorrelationAnalysis);
        }, 600);
        
        // Render discrepancy tab
        setTimeout(() => {
            renderDiscrepancyTab(audit, currentCorrelationAnalysis);
        }, 900);
    }, 100);
    
    // Switch to summary tab
    switchTab('summary');
}

/**
 * Update audit item selection in sidebar
 * @param {String} auditId - Selected audit ID
 */
function updateAuditSelection(auditId) {
    const allItems = document.querySelectorAll('.audit-item');
    allItems.forEach(item => {
        if (item.dataset.auditId === auditId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Update header information
 * @param {Object} audit - Internal audit document
 * @param {Object} analysis - Correlation analysis
 */
function updateHeaderInfo(audit, analysis) {
    const titleEl = document.getElementById('selected-audit-title');
    const subtitleEl = document.getElementById('selected-audit-subtitle');
    const riskScoreBadge = document.getElementById('risk-score-badge');
    const riskScoreEl = document.getElementById('risk-score');
    
    if (titleEl) titleEl.textContent = audit.title;
    if (subtitleEl) subtitleEl.textContent = `${audit.function} • ${audit.overall_rating}`;
    
    if (riskScoreBadge) riskScoreBadge.classList.remove('hidden');
    if (riskScoreEl) {
        riskScoreEl.textContent = analysis.riskScore;
        riskScoreEl.className = getRiskClass(analysis.riskScore);
    }
}

/**
 * Hide welcome screen
 */
function hideWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
}

/**
 * Set up tab navigation
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

/**
 * Switch to a specific tab
 * @param {String} tabName - Tab name (summary, discrepancy, ontology)
 */
function switchTab(tabName) {
    console.log(`Switching to tab: ${tabName}`);
    
    // Update button states
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
        selectedTab.classList.add('fade-in');
    }
    
    // Render ontology graph if switching to that tab
    if (tabName === 'ontology' && currentInternalDoc && currentCorrelationAnalysis) {
        renderOntologyTab(currentInternalDoc, currentCorrelationAnalysis);
    }
}

/**
 * Render Summary Tab
 * @param {Object} audit - Internal audit document
 * @param {Object} analysis - Correlation analysis
 */
function renderSummaryTab(audit, analysis) {
    // Update cards with staggered timing
    setTimeout(() => {
        const alignmentEl = document.getElementById('alignment-strength');
        if (alignmentEl) {
            alignmentEl.textContent = analysis.alignmentStrength;
            alignmentEl.className = `mt-2 text-3xl font-bold ${getAlignmentClass(analysis.alignmentStrength)}`;
        }
        hideLoader('alignment-strength-loader');
    }, 400);
    
    setTimeout(() => {
        const sharedThemesEl = document.getElementById('shared-themes-count');
        if (sharedThemesEl) {
            sharedThemesEl.textContent = analysis.globalOverlap.sharedCount;
        }
        hideLoader('shared-themes-loader');
    }, 600);
    
    setTimeout(() => {
        const ratingEl = document.getElementById('overall-rating');
        if (ratingEl) {
            ratingEl.textContent = audit.overall_rating;
        }
        hideLoader('overall-rating-loader');
    }, 800);
    
    // Update internal summary
    setTimeout(() => {
        const summaryEl = document.getElementById('internal-summary');
        if (summaryEl) {
            summaryEl.textContent = audit.internal_summary;
        }
        hideLoader('internal-summary-loader');
    }, 1000);
    
    // Update external alignment
    setTimeout(() => {
        const alignmentTextEl = document.getElementById('external-alignment');
        if (alignmentTextEl) {
            alignmentTextEl.textContent = audit.external_pattern_alignment;
        }
        hideLoader('external-alignment-loader');
    }, 1200);
    
    // Render overlap table
    setTimeout(() => {
        renderOverlapTable(analysis.overlapResults);
        hideLoader('overlap-table-loader');
    }, 1400);
    
    // Render recommendations
    setTimeout(() => {
        renderRecommendations(audit.recommendations);
        hideLoader('recommendations-loader');
    }, 1600);
}

/**
 * Render overlap table
 * @param {Array} overlapResults - Array of overlap results
 */
function renderOverlapTable(overlapResults) {
    const tableBody = document.getElementById('overlap-table-body');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    overlapResults.forEach(result => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${result.externalId}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${result.company}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${result.date}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${result.sharedCount} themes</td>
            <td class="px-4 py-3">
                <div class="flex items-center">
                    <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${result.overlapPercentage}%"></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">${result.overlapPercentage}%</span>
                </div>
            </td>
            <td class="px-4 py-3 text-center">
                <button class="view-external-doc-btn p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition inline-flex" 
                        data-doc-id="${result.externalId}"
                        title="View warning letter">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
            </td>
        `;
        
        // Add click handler for eye button
        const viewBtn = row.querySelector('.view-external-doc-btn');
        viewBtn.addEventListener('click', () => {
            openDocumentViewer(result.externalId, 'external');
        });
        
        tableBody.appendChild(row);
    });
}

/**
 * Render recommendations list
 * @param {Array} recommendations - Array of recommendation strings
 */
function renderRecommendations(recommendations) {
    const listEl = document.getElementById('recommendations-list');
    
    if (!listEl) return;
    
    listEl.innerHTML = '';
    
    recommendations.forEach(rec => {
        const item = document.createElement('li');
        item.className = 'recommendation-item';
        item.textContent = rec;
        listEl.appendChild(item);
    });
}

/**
 * Render Discrepancy Tab
 * @param {Object} audit - Internal audit document
 * @param {Object} analysis - Correlation analysis
 */
function renderDiscrepancyTab(audit, analysis) {
    // Render shared themes
    const sharedList = document.getElementById('shared-themes-list');
    if (sharedList) {
        sharedList.innerHTML = '';
        analysis.globalOverlap.shared.forEach(theme => {
            const item = document.createElement('li');
            item.className = 'theme-item theme-item-shared';
            item.textContent = theme;
            sharedList.appendChild(item);
        });
        
        if (analysis.globalOverlap.shared.length === 0) {
            sharedList.innerHTML = '<li class="text-sm text-gray-500 italic">No shared themes found</li>';
        }
    }
    
    // Render internal-only themes
    const internalOnlyList = document.getElementById('internal-only-themes-list');
    if (internalOnlyList) {
        internalOnlyList.innerHTML = '';
        analysis.globalOverlap.internalOnly.forEach(theme => {
            const item = document.createElement('li');
            item.className = 'theme-item theme-item-internal';
            item.textContent = theme;
            internalOnlyList.appendChild(item);
        });
        
        if (analysis.globalOverlap.internalOnly.length === 0) {
            internalOnlyList.innerHTML = '<li class="text-sm text-gray-500 italic">All internal themes are shared</li>';
        }
    }
    
    // Render missing critical themes
    const missingList = document.getElementById('missing-themes-list');
    if (missingList) {
        missingList.innerHTML = '';
        analysis.missingThemes.forEach(item => {
            const li = document.createElement('li');
            li.className = 'theme-item theme-item-missing';
            li.innerHTML = `
                <div class="flex justify-between items-center">
                    <span>${item.theme}</span>
                    <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Found in ${item.frequency} external docs
                    </span>
                </div>
            `;
            missingList.appendChild(li);
        });
        
        if (analysis.missingThemes.length === 0) {
            missingList.innerHTML = '<li class="text-sm text-green-600 italic">No critical themes missing - excellent coverage</li>';
        }
    }
    
    // Render discrepancy text
    const discrepancyText = document.getElementById('discrepancy-text');
    if (discrepancyText) {
        discrepancyText.textContent = audit.discrepancies_vs_enforcement;
    }
}

/**
 * Render Ontology Tab
 * @param {Object} audit - Internal audit document
 * @param {Object} analysis - Correlation analysis
 */
function renderOntologyTab(audit, analysis) {
    console.log('Rendering ontology graph...');
    
    // Build graph data
    const graphData = buildGraphData(audit, EXTERNAL_DOCUMENTS, analysis);
    
    console.log('Graph data:', graphData);
    
    // Render graph
    renderGraph(graphData, 'graph-container');
}

/**
 * Format date string
 * @param {String} dateStr - Date string
 * @returns {String} - Formatted date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Truncate text to specified length
 * @param {String} text - Text to truncate
 * @param {Number} maxLength - Maximum length
 * @returns {String} - Truncated text
 */
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Open document viewer modal
 * @param {String} docId - Document ID
 * @param {String} docType - 'internal' or 'external'
 */
function openDocumentViewer(docId, docType) {
    console.log(`Opening document viewer for ${docType} document: ${docId}`);
    
    let docData = null;
    let documentTitle = '';
    let documentSubtitle = '';
    let documentFile = '';
    
    // Find the document
    if (docType === 'internal') {
        docData = INTERNAL_AUDITS.find(d => d.id === docId);
        if (docData) {
            documentTitle = docData.title;
            documentSubtitle = `${docData.function} • ${docData.overall_rating}`;
            documentFile = docData.document_file;
        }
    } else if (docType === 'external') {
        docData = EXTERNAL_DOCUMENTS.find(d => d.id === docId);
        if (docData) {
            documentTitle = docData.company;
            documentSubtitle = `Warning Letter • ${docData.date}`;
            documentFile = docData.document_file;
        }
    }
    
    if (!docData || !documentFile) {
        console.error('Document not found or no file path specified');
        alert('Document file not found');
        return;
    }
    
    // Update modal content
    const modal = document.getElementById('document-modal');
    const modalTitle = document.getElementById('modal-document-title');
    const modalSubtitle = document.getElementById('modal-document-subtitle');
    const modalType = document.getElementById('modal-document-type');
    const iframe = document.getElementById('document-iframe');
    const viewerContainer = document.getElementById('document-viewer-container');
    const loadingDiv = document.getElementById('document-loading');
    const errorDiv = document.getElementById('document-error');
    const downloadLink = document.getElementById('document-download-link');
    const openNewTabLink = document.getElementById('open-new-tab');
    
    if (modalTitle) modalTitle.textContent = documentTitle;
    if (modalSubtitle) modalSubtitle.textContent = documentSubtitle;
    
    // Determine file type
    const fileExt = documentFile.split('.').pop().toLowerCase();
    const displayType = fileExt === 'pdf' ? 'PDF Document' : 'Document';
    
    if (modalType) modalType.textContent = displayType;
    
    // Show modal
    if (modal) modal.classList.remove('hidden');
    
    // Show loading
    if (viewerContainer) viewerContainer.classList.add('hidden');
    if (loadingDiv) loadingDiv.classList.remove('hidden');
    if (errorDiv) errorDiv.classList.add('hidden');
    
    // Set download link
    if (downloadLink) {
        downloadLink.href = documentFile;
        downloadLink.download = documentFile.split('/').pop();
    }
    
    // Set open in new tab link
    if (openNewTabLink) {
        openNewTabLink.href = documentFile;
    }
    
    // Load PDF document in iframe
    setTimeout(() => {
        if (fileExt === 'pdf') {
            // All documents are now PDFs - display directly in iframe
            iframe.src = documentFile;
            if (viewerContainer) viewerContainer.classList.remove('hidden');
            if (loadingDiv) loadingDiv.classList.add('hidden');
        } else {
            // Unsupported file type
            console.error('Unsupported file type:', fileExt);
            if (viewerContainer) viewerContainer.classList.add('hidden');
            if (loadingDiv) loadingDiv.classList.add('hidden');
            if (errorDiv) errorDiv.classList.remove('hidden');
        }
    }, 300);
}

/**
 * Close document viewer modal
 */
function closeDocumentViewer() {
    const modal = document.getElementById('document-modal');
    const iframe = document.getElementById('document-iframe');
    
    if (modal) modal.classList.add('hidden');
    if (iframe) iframe.src = '';
}

/**
 * Setup document viewer modal event listeners
 */
function setupDocumentViewerModal() {
    const closeModalBtn = document.getElementById('close-modal');
    const closeModalBtn2 = document.getElementById('close-modal-btn');
    const modal = document.getElementById('document-modal');
    
    // Close button clicks
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDocumentViewer);
    }
    
    if (closeModalBtn2) {
        closeModalBtn2.addEventListener('click', closeDocumentViewer);
    }
    
    // Click outside modal to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeDocumentViewer();
            }
        });
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('document-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeDocumentViewer();
            }
        }
    });
}

// Initialize document viewer modal on page load
document.addEventListener('DOMContentLoaded', function() {
    setupDocumentViewerModal();
});

// Export for debugging
window.appDebug = {
    currentInternalDoc,
    currentCorrelationAnalysis,
    INTERNAL_AUDITS,
    EXTERNAL_DOCUMENTS,
    ONTOLOGY
};

console.log('App module loaded. Debug info available at window.appDebug');
