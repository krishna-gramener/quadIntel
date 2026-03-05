/**
 * Graph Module - Renders interactive D3.js ontology graph
 * Visualizes relationships between documents, themes, risk categories, and CFR references
 */

/**
 * Build graph data structure from theme clusters
 * Creates an ontology graph showing relationships between internal/external themes and clusters
 * @returns {Object} - Graph data with nodes and links
 */
function buildGraphData() {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    let nodeId = 0;

    // Helper function to add node if not exists
    function addNode(id, label, type, metadata = {}) {
        if (!nodeMap.has(id)) {
            const node = {
                id: nodeId++,
                nodeId: id,
                label,
                type,
                ...metadata
            };
            nodes.push(node);
            nodeMap.set(id, node);
        }
        return nodeMap.get(id);
    }

    // Helper function to add link
    function addLink(source, target, type, label = '') {
        links.push({
            source: source.id,
            target: target.id,
            type,
            label
        });
    }

    // Process each cluster
    THEME_CLUSTERS.forEach(cluster => {
        // Add cluster node (parent category)
        const clusterNode = addNode(
            cluster.cluster_id,
            cluster.parent_category,
            'cluster',
            {
                similarity_score: cluster.similarity_score,
                similarity_reason: cluster.similarity_reason,
                internal_docs: cluster.internal_docs,
                external_docs: cluster.external_docs
            }
        );

        // Add theme nodes and connect to cluster
        cluster.themes.forEach(theme => {
            // Determine if theme is from internal or external source
            let isInternal = false;
            let isExternal = false;

            // Check internal audits
            INTERNAL_AUDITS.forEach(audit => {
                if (audit.themes.includes(theme)) {
                    isInternal = true;
                }
            });

            // Check external documents
            EXTERNAL_DOCUMENTS.forEach(doc => {
                if (doc.themes.includes(theme)) {
                    isExternal = true;
                }
            });

            // Determine node type
            let themeType = 'theme_internal';
            if (isInternal && isExternal) {
                themeType = 'theme_shared';
            } else if (isExternal) {
                themeType = 'theme_external';
            }

            const themeNode = addNode(
                `theme-${theme}`,
                theme,
                themeType,
                {
                    cluster_id: cluster.cluster_id,
                    parent_category: cluster.parent_category
                }
            );

            // Link theme to cluster
            addLink(themeNode, clusterNode, 'belongs_to', 'belongs to');
        });
    });

    return { nodes, links };
}

/**
 * Get node color based on type
 * @param {String} type - Node type
 * @returns {String} - Color hex code
 */
function getNodeColor(type) {
    const colors = {
        'cluster': '#8b5cf6',           // Purple - cluster/parent category
        'theme_internal': '#10b981',    // Green - internal themes
        'theme_external': '#3b82f6',    // Blue - external themes
        'theme_shared': '#f59e0b'       // Amber - shared themes
    };
    return colors[type] || '#6b7280'; // Default gray
}

/**
 * Get node size based on type
 * @param {String} type - Node type
 * @returns {Number} - Radius size
 */
function getNodeSize(type) {
    const sizes = {
        'cluster': 14,          // Largest - cluster nodes
        'theme_shared': 10,     // Medium-large - shared themes
        'theme_internal': 8,    // Medium - internal themes
        'theme_external': 8     // Medium - external themes
    };
    return sizes[type] || 6;
}

/**
 * Render interactive D3.js graph
 * @param {Object} graphData - Graph data with nodes and links
 * @param {String} containerId - DOM container ID
 */
function renderGraph(graphData, containerId = 'graph-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing graph
    container.innerHTML = '';

    // Set up dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add zoom behavior
    const g = svg.append('g');

    const zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Set initial zoom to fit graph in viewport (scale down to 60%)
    const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(0.8)
        .translate(-width / 2, -height / 2);

    svg.call(zoom.transform, initialTransform);

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links)
            .id(d => d.id)
            .distance(60))  // Shorter links to bring clusters closer
        .force('charge', d3.forceManyBody()
            .strength(-70))  // Less repulsion to allow tighter grouping
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(d => getNodeSize(d.type) + 10));  // Smaller collision radius for tighter packing

    // Create links
    const link = g.append('g')
        .selectAll('line')
        .data(graphData.links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke', '#94a3b8')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 1.5);

    // Create nodes
    const node = g.append('g')
        .selectAll('g')
        .data(graphData.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded));

    // Add circles to nodes
    node.append('circle')
        .attr('r', d => getNodeSize(d.type))
        .attr('fill', d => getNodeColor(d.type))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    // Add labels to nodes
    node.append('text')
        .attr('class', 'node-label')
        .attr('dx', d => getNodeSize(d.type) + 5)
        .attr('dy', 4)
        .text(d => {
            // Truncate long labels
            const maxLength = 25;
            return d.label.length > maxLength
                ? d.label.substring(0, maxLength) + '...'
                : d.label;
        })
        .attr('font-size', '11px')
        .attr('fill', '#374151');

    // Create tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'graph-tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'rgba(0, 0, 0, 0.9)')
        .style('color', 'white')
        .style('padding', '8px 12px')
        .style('border-radius', '6px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000');

    // Add hover interactions
    node.on('mouseover', function (event, d) {
        // Highlight node
        d3.select(this).select('circle')
            .attr('stroke-width', 3)
            .attr('stroke', '#1f2937');

        // Show tooltip
        let tooltipContent = `<strong>${d.label}</strong>`;

        if (d.type === 'cluster') {
            tooltipContent += `<br/><span style="color: #fbbf24;">Similarity Score: ${(d.similarity_score * 100).toFixed(0)}%</span>`;
            tooltipContent += `<br/><br/><em style="color: #d1d5db;">Reason:</em><br/><span style="font-size: 11px;">${d.similarity_reason}</span>`;
            tooltipContent += `<br/><br/><span style="color: #10b981;">Internal Docs: ${d.internal_docs.length}</span>`;
            tooltipContent += `<br/><span style="color: #3b82f6;">External Docs: ${d.external_docs.length}</span>`;
            tooltipContent += `<br/><br/><em style="color: #9ca3af; font-size: 10px;">Click to view details</em>`;
        } else if (d.type.startsWith('theme_')) {
            const typeLabel = d.type === 'theme_internal' ? 'Internal Theme' :
                d.type === 'theme_external' ? 'External Theme' : 'Shared Theme';
            tooltipContent += `<br/><span style="color: #9ca3af;">${typeLabel}</span>`;
            tooltipContent += `<br/>Cluster: ${d.parent_category}`;
        }

        tooltip.transition()
            .duration(200)
            .style('opacity', 1);

        tooltip.html(tooltipContent)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');

        // Highlight connected links
        link.attr('stroke', l =>
            (l.source.id === d.id || l.target.id === d.id) ? '#3b82f6' : '#94a3b8')
            .attr('stroke-opacity', l =>
                (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.3)
            .attr('stroke-width', l =>
                (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 1.5);
    })
        .on('mouseout', function (event, d) {
            // Reset node
            d3.select(this).select('circle')
                .attr('stroke-width', 2)
                .attr('stroke', '#fff');

            // Hide tooltip
            tooltip.transition()
                .duration(200)
                .style('opacity', 0);

            // Reset links
            link.attr('stroke', '#94a3b8')
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', 1.5);
        })
        .on('click', function (event, d) {
            // Show cluster details on click
            if (d.type === 'cluster') {
                showClusterDetails(d);
            }
        });

    // Update positions on simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

/**
 * Show cluster details in a panel
 * @param {Object} clusterNode - Cluster node data
 */
function showClusterDetails(clusterNode) {
    // Create or get cluster details panel
    let panel = document.getElementById('cluster-details-panel');

    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'cluster-details-panel';
        panel.className = 'fixed right-4 top-20 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-50 max-h-[80vh] overflow-y-auto';
        document.body.appendChild(panel);
    }

    // Get internal and external documents for this cluster
    const internalDocs = INTERNAL_AUDITS.filter(audit =>
        clusterNode.internal_docs.includes(audit.id)
    );

    const externalDocs = EXTERNAL_DOCUMENTS.filter(doc =>
        clusterNode.external_docs.includes(doc.id)
    );

    // Build panel HTML
    panel.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div>
                <h3 class="text-lg font-bold text-gray-900">${clusterNode.label}</h3>
                <div class="flex items-center mt-2">
                    <span class="text-sm font-semibold text-amber-600">Similarity: ${(clusterNode.similarity_score * 100).toFixed(0)}%</span>
                </div>
            </div>
            <button onclick="document.getElementById('cluster-details-panel').remove()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <div class="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
            <strong class="text-gray-900">Similarity Reason:</strong><br/>
            ${clusterNode.similarity_reason}
        </div>
        
        <div class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
                <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Internal Documents (${internalDocs.length})
            </h4>
            <div class="space-y-2">
                ${internalDocs.map(doc => `
                    <div class="p-3 bg-green-50 rounded border border-green-200">
                        <div class="font-medium text-sm text-gray-900">${doc.title}</div>
                        <div class="text-xs text-gray-600 mt-1">${doc.id}</div>
                        <div class="text-xs text-gray-700 mt-2">${doc.summary}</div>
                        ${doc.recommendations ? `
                            <div class="mt-2">
                                <div class="text-xs font-semibold text-gray-900">Recommendations:</div>
                                <ul class="text-xs text-gray-700 mt-1 list-disc list-inside">
                                    ${doc.recommendations.slice(0, 3).map(rec => `<li>${rec}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div>
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
                <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                External Warning Letters (${externalDocs.length})
            </h4>
            <div class="space-y-2">
                ${externalDocs.map(doc => `
                    <div class="p-3 bg-blue-50 rounded border border-blue-200">
                        <div class="font-medium text-sm text-gray-900">${doc.company}</div>
                        <div class="text-xs text-gray-600 mt-1">${doc.id}</div>
                        <div class="text-xs text-gray-700 mt-2">${doc.summary || 'No summary available'}</div>
                        ${doc.key_findings ? `
                            <div class="mt-2">
                                <div class="text-xs font-semibold text-gray-900">Key Findings:</div>
                                <ul class="text-xs text-gray-700 mt-1 list-disc list-inside">
                                    ${doc.key_findings.slice(0, 3).map(finding => `<li>${finding}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Scroll panel into view
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        buildGraphData,
        renderGraph,
        getNodeColor,
        getNodeSize
    };
}
