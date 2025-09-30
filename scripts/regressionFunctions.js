function removePlot(plotName) {
    // Remove the plot if it alread exists (e.g., if we refresh it)
    d3.select(plotName).selectAll("*").remove();
}

function appendSvg(plotName, width, height, margin) {
    // Append the svg object to the body of the page
    var svg = d3.select(plotName)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;
}

function getMinMax(data, predictY) {
    // Return the min and max given the predictY regression function
    let xmin = data[0].x;
    let xmax = data[0].x;
    let ymin = data[0].y ** 2;
    let ymax = 15.1; // Default value
    for (var i = 0; i < data.length; i++) {
        // Set variables
        let x = data[i].x;
        let y = data[i].y;

        // Check ranges of data points
        if (xmin > x){xmin = x}
        if (xmax < x){xmax = x}
        if (ymin > y){ymin = y}
        if (ymax < y){ymax = y}

        // Check ranges of estimate
        if (ymin > (predictY(x))){ymin = predictY(x)}
        if (ymax < (predictY(x))){ymax = predictY(x)}
    }

    return { xmin, xmax, ymin, ymax };
}

function drawGridlines(dash_size, gap_size, width, height, color_grid) {
    // Draw gridlines throughout the image
    d3.selectAll("g.yClass g.tick")
        .append("line")
        .attr("class", "gridline")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("stroke", color_grid) 
        .attr("stroke-dasharray",`${dash_size},${gap_size}`)

    d3.selectAll("g.xClass g.tick")
        .append("line")
        .attr("class", "gridline")
        .attr("x1", 0)
        .attr("y1", -height)
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("stroke", color_grid) 
        .attr("stroke-dasharray",`${dash_size},${gap_size}`)
}

function drawResiduals(svg, data, color_residuals, x, y, predictY) {
    // Draw residuals, where predictY is the regression function
    svg.selectAll(".error")
        .data(data)
        .enter()
        .append('path')
        .attr("fill", "none")
        .attr("stroke", color_residuals)
        .attr("stroke-width", 3.5)
        .attr("d", function(d) {
            const predictedY = predictY(d.x);
            return d3.line()
                .x(p => x(p.x))
                .y(p => y(p.y))
                ([{ x: d.x, y: d.y }, { x: d.x, y: predictedY }]);
        })
        .attr("class", "error");
}

function drawEstimateLine(svg, x, y, xmin, xmax, predictY, color_estimate, numPoints = 100) {
    // Multiple points to draw line/curve
    const lineData = [];
    const step = (xmax - xmin) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
        let px = parseFloat(xmin) + i * step;
        lineData.push({ x: px, y: predictY(px) });
    }

    // Draw the line
    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", color_estimate)
        .attr("stroke-width", 3.5)
        .attr("d", d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveMonotoneX) // Smooth curve
        );
}

function addDots(svg, data, x, y, color_data) {
    // Add dots to the plot
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", 3.5)
        .style("fill", color_data)
}

function calcError(data, predictY) {
    // Calculate the error (predictY is the regression function)
    let error = 0;
    for (let i = 0; i < data.length; i++) {
        error += Math.abs(data[i].y - predictY(data[i].x)) / data.length;
    }
    return error;
}

function addTitle(svg, font, width, margin, text) {
    // Add a custom title to the plot
    svg.append("text")
        .attr("font-family", font)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", -margin.top/2)
        .text(text)
}

function addYLabel(svg, font, height, margin, text) {
    // Add the y-axis label
    svg.append("text")
        .attr("font-family", font)
        .style("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left/2)
        .text(text)
}

function addXLabel(svg, font, width, height, margin, text) {
    // Add the x-axis label
    svg.append("text")
        .attr("font-family", font)
        .style("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height+margin.bottom/2)
        .text(text)
}

function addXAxis(svg, xmin, xmax, width, height) {
    // Add x axis
    var x = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([ 0, width ]);
    svg.append("g")
        .attr("class", "xClass")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));
    // Top x axis
    var x2 = d3.scaleLinear()
        .domain([])
        .range([ 0, width ]);
    svg.append("g")
        .call(d3.axisTop(x2));

    return x;
}

function addYAxis(svg, ymin, ymax, width, height) {
    // Add y axis
    var y = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([ height, 0]);
    svg.append("g")
        .attr("class", "yClass")
        .call(d3.axisLeft(y));
    // Right y axis
    var y2 = d3.scaleLinear()
        .domain([])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisRight(y2))
        .attr("transform", `translate(${width},0)`);

    return y;
}

function addLegendEntry(svg, shape, x, y, color, label, font, iconWidth, circleRadius) {
    // Generalized to add legends to regression applets
    if (shape === "circle") {
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", circleRadius)
            .style("fill", color);
    } else {
        svg.append("rect")
            .attr("width", iconWidth)
            .attr("height", iconWidth / 6)
            .attr("x", x - iconWidth / 2)
            .attr("y", y - (iconWidth / 12)) // vertical centering
            .style("fill", color)
            .attr("alignment-baseline", "middle");
    }

    svg.append("text")
        .attr("font-family", font)
        .attr("x", x + 20)
        .attr("y", y)
        .text(label)
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle");
}
