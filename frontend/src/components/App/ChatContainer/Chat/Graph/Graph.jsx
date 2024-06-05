import * as d3 from 'd3';

const drawGraph = (data) => {
    const width = 800;
    const height = 600;

    if (!data.nodes || !data.edges) {
        console.error('Nodes or edges are null');
        return;
    }

    d3.select('.schema-container').select('svg').remove();

    const svg = d3.select('.schema-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.zoom().on('zoom', (event) => {
            svg.attr('transform', event.transform);
        }))
        .append('g');

    const defs = svg.append('defs');

    defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('overflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', '#00ff00')
        .style('stroke', 'none');

    const nodeMap = new Map();
    data.nodes.forEach((node, index) => {
        node.id = index.toString();
        nodeMap.set(node.text, node);
    });

    const edges = data.edges.map((edge, index) => ({
        source: nodeMap.get(edge.text_source_id).id,
        target: nodeMap.get(edge.text_target_id).id,
        type: edge.type,
        id: `link-${index}`
    }));

    const linkForce = d3.forceLink(edges).id(d => d.id).distance(200);

    const simulation = d3.forceSimulation(data.nodes)
        .force('link', linkForce)
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
        .attr('class', 'links')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(edges)
        .enter().append('line')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

    const node = svg.append('g')
        .attr('class', 'nodes')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(data.nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', '#69b3a2')
        .call(d3.drag()
            .on('start', (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = d.x;
                d.fy = d.y;
            }));

    node.append('title')
        .text(d => d.text);

    const middlePoints = edges.map((edge, index) => ({
        id: `middle-${index}`,
        type: edge.type,
        source: edge.source,
        target: edge.target
    }));

    const middleNode = svg.append('g')
        .attr('class', 'middle-nodes')
        .selectAll('circle')
        .data(middlePoints)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', '#00ff00');

    const middleLabels = svg.append('g')
        .attr('class', 'middle-labels')
        .selectAll('text')
        .data(middlePoints)
        .enter().append('text')
        .attr('font-size', '10px')
        .attr('fill', '#ffffff')
        .text(d => d.type);

    const labels = svg.append('g')
        .selectAll('text')
        .data(data.nodes)
        .enter().append('text')
        .attr('dy', -15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#ffffff')
        .text(d => d.text);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => {
                const deltaX = d.target.x - d.source.x;
                const deltaY = d.target.y - d.source.y;
                const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const normX = deltaX / dist;
                const normY = deltaY / dist;
                const offset = 10;
                return d.target.x - (normX * offset);
            })
            .attr('y2', d => {
                const deltaX = d.target.x - d.source.x;
                const deltaY = d.target.y - d.source.y;
                const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const normX = deltaX / dist;
                const normY = deltaY / dist;
                const offset = 10;
                return d.target.y - (normY * offset);
            });

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y);

        middleNode
            .attr('cx', d => (d.source.x + d.target.x) / 2)
            .attr('cy', d => (d.source.y + d.target.y) / 2);

        middleLabels
            .attr('x', d => (d.source.x + d.target.x) / 2 + 8)
            .attr('y', d => (d.source.y + d.target.y) / 2);
    });

    d3.select('#link-distance-slider').on('input', function() {
        const distance = this.value;
        linkForce.distance(distance);
        simulation.alpha(1).restart();
    });
};

export default drawGraph;
