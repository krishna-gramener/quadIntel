/**
 * Main Application Module - Orchestrates the Regulatory Risk Correlation System
 * Handles UI interactions, data loading, and view rendering
 */

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('QuadIntel - Regulatory Risk Correlation System - Initializing...');

    // Update landing page counts
    updateLandingPageCounts();

    // Set up landing page proceed button
    setupLandingPage();

    // Load and display internal audits in sidebar
    loadInternalDocumentsList();

    // Load and display external documents list
    loadExternalDocumentsList();

    // Update document counts
    updateDocumentCounts();

    // Setup sidebar tabs
    setupSidebarTabs();

    // Setup main view tabs
    setupMainViewTabs();

    // Load document analysis list
    loadDocumentAnalysisList();

    console.log('Application initialized successfully');
});

/**
 * Update landing page counts
 */
function updateLandingPageCounts() {
    const internalCountEl = document.getElementById('landing-internal-count');
    const externalCountEl = document.getElementById('landing-external-count');

    if (internalCountEl) internalCountEl.textContent = INTERNAL_AUDITS.length;
    if (externalCountEl) externalCountEl.textContent = EXTERNAL_DOCUMENTS.length;
}

/**
 * Setup landing page and proceed button
 */
function setupLandingPage() {
    const proceedBtn = document.getElementById('proceed-btn');
    const landingPage = document.getElementById('landing-page');
    const mainApp = document.getElementById('main-app');

    if (proceedBtn && landingPage && mainApp) {
        proceedBtn.addEventListener('click', function () {
            // Show loading state
            proceedBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Analysis...
            `;
            proceedBtn.disabled = true;

            // Fade out landing page
            landingPage.style.transition = 'opacity 0.5s ease-out';
            landingPage.style.opacity = '0';

            setTimeout(() => {
                landingPage.classList.add('hidden');
                mainApp.classList.remove('hidden');
                mainApp.style.opacity = '0';

                setTimeout(() => {
                    mainApp.style.transition = 'opacity 0.5s ease-in';
                    mainApp.style.opacity = '1';

                    // Render the ontology graph with delay for loading effect
                    setTimeout(() => {
                        renderOntologyGraph();
                    }, 300);
                }, 50);
            }, 500);
        });
    }
}

/**
 * Load and display internal documents list in sidebar
 */
function loadInternalDocumentsList() {
    const container = document.getElementById('internal-docs-list');
    if (!container) return;

    container.innerHTML = INTERNAL_AUDITS.map(audit => `
        <div class="p-3 bg-white border border-gray-200 rounded hover:border-green-400 transition">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900">${audit.title}</div>
                    <div class="text-xs text-gray-500 mt-1">${audit.id}</div>
                </div>
                <button class="ml-2 p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition flex-shrink-0" 
                        onclick="viewDocument('${audit.document_path}', '${audit.title.replace(/'/g, "\\'")}', '${audit.id}')"
                        title="View document">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
                ${audit.themes.slice(0, 3).map(theme => `
                    <span class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">${theme}</span>
                `).join('')}
                ${audit.themes.length > 3 ? `<span class="text-xs text-gray-500">+${audit.themes.length - 3} more</span>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Load and display external documents list in sidebar
 */
function loadExternalDocumentsList() {
    const container = document.getElementById('external-docs-list');
    if (!container) return;

    container.innerHTML = EXTERNAL_DOCUMENTS.map(doc => `
        <div class="p-3 bg-white border border-gray-200 rounded hover:border-blue-400 transition">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900">${doc.company}</div>
                    <div class="text-xs text-gray-500 mt-1">${doc.id}</div>
                </div>
                <button class="ml-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition flex-shrink-0" 
                        onclick="viewDocument('${doc.document_path}', '${doc.company.replace(/'/g, "\\'")}', '${doc.id}')"
                        title="View document">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
                ${doc.themes.slice(0, 3).map(theme => `
                    <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">${theme}</span>
                `).join('')}
                ${doc.themes.length > 3 ? `<span class="text-xs text-gray-500">+${doc.themes.length - 3} more</span>` : ''}
            </div>
        </div>
    `).join('');
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
 * Setup sidebar tabs for switching between internal and external documents
 */
function setupSidebarTabs() {
    const tabInternal = document.getElementById('tab-internal');
    const tabExternal = document.getElementById('tab-external');
    const internalList = document.getElementById('internal-docs-list');
    const externalList = document.getElementById('external-docs-list');

    if (!tabInternal || !tabExternal || !internalList || !externalList) return;

    tabInternal.addEventListener('click', () => {
        // Update tab styles
        tabInternal.className = 'flex-1 px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-green-500 bg-green-50';
        tabExternal.className = 'flex-1 px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300';

        // Show/hide lists
        internalList.classList.remove('hidden');
        externalList.classList.add('hidden');
    });

    tabExternal.addEventListener('click', () => {
        // Update tab styles
        tabExternal.className = 'flex-1 px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-blue-500 bg-blue-50';
        tabInternal.className = 'flex-1 px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300';

        // Show/hide lists
        externalList.classList.remove('hidden');
        internalList.classList.add('hidden');
    });
}

/**
 * Render the ontology graph
 */
function renderOntologyGraph() {
    console.log('Rendering ontology graph...');

    const container = document.getElementById('graph-container');
    if (!container) return;

    // Stage 1: Analyzing documents
    container.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <svg class="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-600 font-medium" id="graph-loading-message">Analyzing documents...</p>
                <div class="mt-3 flex items-center justify-center space-x-2">
                    <div class="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        </div>
    `;

    const messageEl = document.getElementById('graph-loading-message');

    // Stage 2: Extracting themes (after 1s)
    setTimeout(() => {
        if (messageEl) messageEl.textContent = 'Extracting themes...';
    }, 2000);

    // Stage 3: Generating nodes (after 2s)
    setTimeout(() => {
        if (messageEl) messageEl.textContent = 'Generating nodes...';
    }, 3000);

    // Stage 4: Finalizing graph (after 3s)
    setTimeout(() => {
        if (messageEl) messageEl.textContent = 'Finalizing graph...';
    }, 3000);

    // Stage 5: Render graph (after 4s)
    setTimeout(() => {
        // Build graph data from clusters
        const graphData = buildGraphData();

        console.log('Graph data:', graphData);
        console.log(`Nodes: ${graphData.nodes.length}, Links: ${graphData.links.length}`);

        // Render graph
        renderGraph(graphData, 'graph-container');

        // Enable Document Analysis tab after graph is ready
        const tabDocuments = document.getElementById('tab-documents');
        if (tabDocuments) {
            tabDocuments.disabled = false;
            tabDocuments.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }, 4000);
}

/**
 * Show animated hint pointing to a cluster node
 */
function showClusterClickHint() {
    // Check if hint was already shown
    if (localStorage.getItem('clusterHintShown')) {
        return;
    }

    const container = document.getElementById('graph-container');
    if (!container) return;

    // Add custom animation keyframes if not already added
    if (!document.getElementById('hint-animation-style')) {
        const style = document.createElement('style');
        style.id = 'hint-animation-style';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            .hint-slide-down {
                animation: slideDown 0.5s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }

    // Create hint overlay at the top
    const hint = document.createElement('div');
    hint.id = 'cluster-hint';
    hint.className = 'absolute top-4 left-1/2 z-50 hint-slide-down';
    hint.innerHTML = `
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-2xl">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                    </svg>
                    <div>
                        <p class="font-semibold">💡 Click on any purple cluster node</p>
                        <p class="text-xs text-purple-100 mt-0.5">to view detailed correlation analysis and related documents</p>
                    </div>
                </div>
                <button onclick="dismissClusterHint()" class="ml-4 text-white hover:text-purple-200 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    container.appendChild(hint);

    // Auto-dismiss after 7 seconds
    setTimeout(() => {
        dismissClusterHint();
    }, 7000);
}

/**
 * Dismiss the cluster hint
 */
function dismissClusterHint() {
    const hint = document.getElementById('cluster-hint');
    if (hint) {
        hint.style.transition = 'opacity 0.3s ease-out';
        hint.style.opacity = '0';
        setTimeout(() => {
            hint.remove();
        }, 300);
    }
    // Mark as shown so it doesn't appear again
    localStorage.setItem('clusterHintShown', 'true');
}

/**
 * View a document in a modal
 * @param {String} documentPath - Path to the PDF document
 * @param {String} title - Document title
 * @param {String} id - Document ID
 */
function viewDocument(documentPath, title, id) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('pdf-viewer-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'pdf-viewer-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h3 id="pdf-title" class="text-lg font-semibold text-gray-900"></h3>
                        <p id="pdf-id" class="text-sm text-gray-500 mt-1"></p>
                    </div>
                    <button onclick="closePdfViewer()" class="text-gray-400 hover:text-gray-600 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="flex-1 overflow-hidden p-4">
                    <iframe id="pdf-iframe" class="w-full h-full border-0 rounded" src=""></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                closePdfViewer();
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePdfViewer();
            }
        });
    }

    // Update modal content
    document.getElementById('pdf-title').textContent = title;
    document.getElementById('pdf-id').textContent = id;
    document.getElementById('pdf-iframe').src = documentPath;

    // Show modal
    modal.classList.remove('hidden');
}

/**
 * Close the PDF viewer modal
 */
function closePdfViewer() {
    const modal = document.getElementById('pdf-viewer-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('pdf-iframe').src = '';
    }
}

/**
 * Setup main view tabs (Graph vs Document Analysis)
 */
function setupMainViewTabs() {
    const tabGraph = document.getElementById('tab-graph');
    const tabDocuments = document.getElementById('tab-documents');
    const viewGraph = document.getElementById('view-graph');
    const viewDocuments = document.getElementById('view-documents');

    if (!tabGraph || !tabDocuments || !viewGraph || !viewDocuments) return;

    tabGraph.addEventListener('click', () => {
        // Update tab styles
        tabGraph.className = 'px-4 py-3 text-sm font-medium border-b-2 border-purple-500 text-purple-600';
        tabDocuments.className = 'px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

        // Show/hide views
        viewGraph.classList.remove('hidden');
        viewDocuments.classList.add('hidden');
    });

    tabDocuments.addEventListener('click', () => {
        // Update tab styles
        tabDocuments.className = 'px-4 py-3 text-sm font-medium border-b-2 border-purple-500 text-purple-600';
        tabGraph.className = 'px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

        // Show/hide views
        viewDocuments.classList.remove('hidden');
        viewGraph.classList.add('hidden');
    });
}

/**
 * Load document analysis list
 */
function loadDocumentAnalysisList() {
    const container = document.getElementById('document-analysis-list');
    if (!container) return;

    container.innerHTML = INTERNAL_AUDITS.map(audit => `
        <div class="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-md transition cursor-pointer"
             onclick="showDocumentDetail('${audit.id}')">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm text-gray-900">${audit.title}</h4>
                    <p class="text-xs text-gray-500 mt-1">${audit.id}</p>
                    <div class="flex items-center mt-2 text-xs text-gray-600">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                        </svg>
                        ${audit.themes.length} themes
                    </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `).join('');
}

/**
 * Show document detail panel
 */
function showDocumentDetail(auditId) {
    const audit = INTERNAL_AUDITS.find(a => a.id === auditId);
    if (!audit) return;

    const panel = document.getElementById('document-detail-panel');
    if (!panel) return;

    // Store current audit ID for persona refresh
    panel.dataset.currentAuditId = auditId;

    // Show loading state
    panel.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <svg class="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-600 font-medium">Loading document details...</p>
            </div>
        </div>
    `;

    // Simulate loading time
    setTimeout(() => {
        panel.innerHTML = `
        <div class="max-w-4xl">
            <!-- Header -->
            <div class="border-b border-gray-200 pb-4 mb-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-gray-900">${audit.title}</h2>
                        <p class="text-sm text-gray-500 mt-1">${audit.id}</p>
                    </div>
                    <button onclick="viewDocument('${audit.document_path}', '${audit.title.replace(/'/g, "\\'")}', '${audit.id}')"
                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Document
                    </button>
                </div>
            </div>
            
            <!-- Summary -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-gray-900">Summary</h3>
                    <div class="flex items-center gap-2">
                        <label for="persona-select" class="text-xs font-semibold text-gray-600">View as:</label>
                        <select id="persona-select" 
                                class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white">
                            <option value="" ${!currentPersona ? 'selected' : ''}>Default</option>
                            <optgroup label="SCQ">
                                <option value="qc_operations" ${currentPersona && currentPersona.id === 'qc_operations' ? 'selected' : ''}>QC Operations</option>
                                <option value="stability_labs" ${currentPersona && currentPersona.id === 'stability_labs' ? 'selected' : ''}>Stability Labs</option>
                            </optgroup>
                            <optgroup label="CQ">
                                <option value="npi" ${currentPersona && currentPersona.id === 'npi' ? 'selected' : ''}>NPI</option>
                                <option value="regional_quality" ${currentPersona && currentPersona.id === 'regional_quality' ? 'selected' : ''}>Regional Quality</option>
                            </optgroup>
                            <optgroup label="EQ">
                                <option value="external_labs" ${currentPersona && currentPersona.id === 'external_labs' ? 'selected' : ''}>External Labs</option>
                                <option value="supplier_risk" ${currentPersona && currentPersona.id === 'supplier_risk' ? 'selected' : ''}>Supplier Risk Management</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
                ${currentPersona && audit.personaSummaries && audit.personaSummaries[currentPersona.id] ? `
                    <div class="mb-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                            </svg>
                            <div class="flex-1">
                                <div class="font-semibold text-purple-900 mb-2">${currentPersona.name} Perspective</div>
                                <div class="text-sm text-purple-800 leading-relaxed">${audit.personaSummaries[currentPersona.id]}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <div class="text-xs font-semibold text-gray-700 mb-1">General Audit Summary</div>
                        <p class="text-sm text-gray-600 leading-relaxed">${audit.summary}</p>
                    </div>
                ` : `
                    <p class="text-gray-700 leading-relaxed">${audit.summary}</p>
                `}
            </div>
            
            <!-- Themes -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Key Themes (${audit.themes.length})</h3>
                <div class="flex flex-wrap gap-2">
                    ${audit.themes.map(theme => `
                        <span class="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full">${theme}</span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                <ul class="space-y-2">
                    ${audit.recommendations.map(rec => `
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-gray-700">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
        
        // Setup persona selector event listener after DOM is updated
        setTimeout(() => {
            const personaSelect = document.getElementById('persona-select');
            if (personaSelect) {
                // Add event listener
                personaSelect.addEventListener('change', function(e) {
                    const personaId = e.target.value;
                    
                    if (personaId) {
                        currentPersona = getPersonaById(personaId);
                    } else {
                        currentPersona = null;
                    }
                    
                    // Refresh the document detail view
                    showDocumentDetail(auditId);
                });
            }
        }, 100);
    }, 500);
}

