function generateUniformData(xmax, xmin, totalPoints) {
    const data = [];
    const rand = d3.randomLcg(42);
    for (let i = 0; i < totalPoints; i++) {
        const x = rand() * (xmax - xmin) + xmin;
        const y = (x - 2.08) ** 2 - rand();
        data.push({ x: x, y: y });
    }
    return data;
}

function plot6() {
    // Colors used in plot
    let color_data = "#3070B7";
    let color_estimate = "#377e22";
    let color_residuals = "red";
    let color_grid = "#d9c7d7";

    // Font
    let font = 'Arial';

    removePlot("#myplot");
    
    // Set the dimensions and margins of the graph
    var margin = {top: 60, right: 220, bottom: 80, left: 100},
                width = 900 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom;
                
    
    // Append the svg object to the body of the page
    var svg = appendSvg("#myplot", width, height, margin);
            
    // Get the data
    const data = generateUniformData(0, 6, 100);

    // Get k and n from variables drawn from text fields
    let k = parseFloat(document.getElementById('kBox').value) || 0;
    let n = parseFloat(document.getElementById('nBox').value) || 0;

    // Set the function.
    //const predictPolynomial = x => c2 * (x ** 2) + c1 * x + b;

    // Min and max x and y
    let { xmin, xmax, ymin, ymax } = getMinMax(data, predictPolynomial);

    // Add x axis
    let x = addXAxis(svg, xmin, xmax, width, height);

    // Add y axis
    let y = addYAxis(svg, ymin, ymax, width, height);

    // Grid lines
    // Line strokes: https://observablehq.com/@onoratod/animate-a-path-in-d3
    drawGridlines(7, 9, width, height, color_grid);

    // Draw line for estimate
    //drawEstimateLine(svg, x, y, xmin, xmax, predictPolynomial, color_estimate);

    // Add dots
    addDots(svg, data, x, y, color_data);
    
    // Title
    addTitle(`1-D K-nearest neighbors regression with n = ${n}, k = ${c1}`, '#myplot', '0px');

    // y label
    addYLabel(svg, font, height, -margin.left/2, "Y values");

    // x label
    addXLabel(svg, font, width, height, margin, "X values");

    d3.select("#legend").remove();

    // Data entry
    addLegendEntry('#myplot', "Data", "circle", color_data, 150, -400);

    // Residuals entry
    addLegendEntry('#myplot', "Residuals", "line", color_residuals, 150, -400);

    // Estimate entry
    addLegendEntry('#myplot', "Estimate c\u2082x\u00B2 + c\u2081x + b", "line", color_estimate, 150, -400);

}
