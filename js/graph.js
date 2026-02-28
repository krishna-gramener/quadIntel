/**
 * Graph Module - Renders interactive D3.js ontology graph
 * Visualizes relationships between documents, themes, risk categories, and CFR references
 */

/**
 * Build graph data structure from internal document and external documents
 * @param {Object} internalDoc - Selected internal audit document
 * @param {Array} externalDocs - Array of external warning letters
 * @param {Object} correlationAnalysis - Correlation analysis results
 * @returns {Object} - Graph data with nodes and links
 */
function buildGraphData(internalDoc, externalDocs, correlationAnalysis) {
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
    
    // Add internal document node
    const internalNode = addNode(
        internalDoc.id,
        internalDoc.title,
        'internal',
        { 
            function: internalDoc.function,
            rating: internalDoc.overall_rating
        }
    );
    
    // Extract internal themes, risk categories, and sub-themes
    const internalThemes = new Set();
    const internalRiskCategories = new Set();
    const themeToSubThemes = {};
    
    if (internalDoc.findings) {
        internalDoc.findings.forEach(finding => {
            if (finding.risk_category) {
                internalRiskCategories.add(finding.risk_category);
            }
            if (finding.themes) {
                finding.themes.forEach(theme => {
                    internalThemes.add(theme);
                    // Collect sub-themes for each theme
                    if (finding.sub_themes && Array.isArray(finding.sub_themes)) {
                        if (!themeToSubThemes[theme]) {
                            themeToSubThemes[theme] = [];
                        }
                        themeToSubThemes[theme] = themeToSubThemes[theme].concat(finding.sub_themes);
                    }
                });
            }
        });
    }
    
    // Add theme nodes with sub-themes metadata and connect to internal doc
    const themeNodes = new Map();
    internalThemes.forEach(theme => {
        const themeNode = addNode(`theme-${theme}`, theme, 'theme', {
            subThemes: themeToSubThemes[theme] || []
        });
        themeNodes.set(theme, themeNode);
        addLink(internalNode, themeNode, 'mentions', 'mentions');
    });
    
    // Add risk category nodes and connect themes to them
    const riskCategoryNodes = new Map();
    if (internalDoc.findings) {
        internalDoc.findings.forEach(finding => {
            if (finding.risk_category && finding.themes) {
                const riskNode = addNode(
                    `risk-${finding.risk_category}`,
                    finding.risk_category,
                    'risk_category',
                    { severity: finding.severity }
                );
                riskCategoryNodes.set(finding.risk_category, riskNode);
                
                finding.themes.forEach(theme => {
                    const themeNode = themeNodes.get(theme);
                    if (themeNode) {
                        addLink(themeNode, riskNode, 'belongs_to', 'belongs to');
                    }
                });
            }
        });
    }
    
    // Add external documents that have theme overlap
    const sharedThemes = new Set(correlationAnalysis.globalOverlap.shared);
    
    externalDocs.forEach(externalDoc => {
        const externalThemes = extractExternalThemes(externalDoc);
        const hasOverlap = externalThemes.some(theme => sharedThemes.has(theme));
        
        if (hasOverlap) {
            const externalNode = addNode(
                externalDoc.id,
                externalDoc.company,
                'external',
                {
                    date: externalDoc.date,
                    fullId: externalDoc.id
                }
            );
            
            // Connect shared themes to external doc
            externalThemes.forEach(theme => {
                if (sharedThemes.has(theme)) {
                    const themeNode = themeNodes.get(theme);
                    if (themeNode) {
                        addLink(themeNode, externalNode, 'shared_with', 'found in');
                    }
                }
            });
            
            // Add CFR references if available
            if (externalDoc.cfr_violations) {
                externalDoc.cfr_violations.forEach(cfr => {
                    const cfrNode = addNode(`cfr-${cfr}`, cfr, 'cfr');
                    addLink(externalNode, cfrNode, 'violates', 'violates');
                });
            }
        }
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
        'internal': '#10b981',      // Green
        'external': '#3b82f6',      // Blue
        'theme': '#f97316',         // Orange
        'risk_category': '#a855f7', // Purple
        'cfr': '#ef4444'            // Red
    };
    return colors[type] || '#6b7280';
}

/**
 * Get node size based on type
 * @param {String} type - Node type
 * @returns {Number} - Radius size
 */
function getNodeSize(type) {
    const sizes = {
        'internal': 12,
        'external': 10,
        'theme': 8,
        'risk_category': 10,
        'cfr': 7
    };
    return sizes[type] || 8;
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
    
    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links)
            .id(d => d.id)
            .distance(100))
        .force('charge', d3.forceManyBody()
            .strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(d => getNodeSize(d.type) + 20));
    
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
    node.on('mouseover', function(event, d) {
        // Highlight node
        d3.select(this).select('circle')
            .attr('stroke-width', 3)
            .attr('stroke', '#1f2937');
        
        // Show tooltip
        let tooltipContent = `<strong>${d.label}</strong><br/>Type: ${d.type}`;
        
        if (d.type === 'internal') {
            tooltipContent += `<br/>Function: ${d.function}<br/>Rating: ${d.rating}`;
        } else if (d.type === 'external') {
            tooltipContent += `<br/>Date: ${d.date}<br/>ID: ${d.fullId}`;
        } else if (d.type === 'risk_category' && d.severity) {
            tooltipContent += `<br/>Severity: ${d.severity}`;
        } else if (d.type === 'theme' && d.subThemes && d.subThemes.length > 0) {
            tooltipContent += `<br/><em>Sub-themes:</em><br/>• ${d.subThemes.join('<br/>• ')}`;
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
    .on('mouseout', function(event, d) {
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
    .on('click', function(event, d) {
        // Filter by risk category on click
        if (d.type === 'risk_category') {
            filterByRiskCategory(d.label, graphData, link, node);
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
 * Filter graph by risk category
 * @param {String} category - Risk category to filter
 * @param {Object} graphData - Graph data
 * @param {Object} link - D3 link selection
 * @param {Object} node - D3 node selection
 */
function filterByRiskCategory(category, graphData, link, node) {
    // Find nodes connected to this risk category
    const connectedNodeIds = new Set();
    
    graphData.links.forEach(l => {
        const sourceNode = graphData.nodes.find(n => n.id === l.source.id || n.id === l.source);
        const targetNode = graphData.nodes.find(n => n.id === l.target.id || n.id === l.target);
        
        if (sourceNode && targetNode) {
            if (sourceNode.label === category || targetNode.label === category) {
                connectedNodeIds.add(sourceNode.id);
                connectedNodeIds.add(targetNode.id);
            }
        }
    });
    
    // Fade out non-connected nodes
    node.style('opacity', d => connectedNodeIds.has(d.id) ? 1 : 0.2);
    
    // Fade out non-connected links
    link.style('opacity', l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return (connectedNodeIds.has(sourceId) && connectedNodeIds.has(targetId)) ? 0.6 : 0.1;
    });
    
    // Reset after 3 seconds
    setTimeout(() => {
        node.style('opacity', 1);
        link.style('opacity', 0.6);
    }, 3000);
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
