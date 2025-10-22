function generateUniformData(totalPoints) {
    const rand = d3.randomLcg(42);
    const x = [];
    const y = [];
    const data = [];
    for (let i = 0; i < totalPoints; i++) {
        if (i < totalPoints / 2) {
            x.push(rand() - 2);
            y.push(0);
        } else {
            x.push(rand() + 0.5);
            y.push(1);
        }
        const pred = (100 / (1 + Math.E ** (3.2 * x + 3.1))) > 0.5;
        if (y[i] == 0) {
            if (pred == 0) {
                data.push({x: x[i], y: y[i], marker: 'x', color: 'blue'})
            } else {
                data.push({x: x[i], y: y[i], marker: 'o', color: 'blue'})
            }
        } else {
            if (pred == 0) {
                data.push({x: x[i], y: y[i], marker: 'x', color: 'orange'})
            } else {
                data.push({x: x[i], y: y[i], marker: 'o', color: 'orange'})
            }
        }
    }
    return data;
}

function plot4() {
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
    const data = generateUniformData(50);

    // Get c2, c1, and b from variables drawn from text fields
    let c2 = parseFloat(document.getElementById('c2Box').value) || 0;
    let c1 = parseFloat(document.getElementById('c1Box').value) || 0;
    let b = parseFloat(document.getElementById('bBox').value) || 0;

    // Set the function.
    const predictPolynomial = x => c2 * (x ** 2) + c1 * x + b;

    // Min and max x and y
    console.log(data);
    let xmin = -5, xmax = 5, ymin = 0, ymax = 1;

    // Add x axis
    let x = addXAxis(svg, xmin, xmax, width, height);

    // Add y axis
    let y = addYAxis(svg, ymin, ymax, width, height);

    // Grid lines
    // Line strokes: https://observablehq.com/@onoratod/animate-a-path-in-d3
    drawGridlines(7, 9, width, height, color_grid);

    // Draw Residuals
   // drawResiduals(svg, data, color_residuals, x, y, predictPolynomial);

    // Draw line for estimate
    //drawEstimateLine(svg, x, y, xmin, xmax, predictPolynomial, color_estimate);

    // Add dots
    addDots(svg, data, x, y, color_data);
    
    // Calculate error
    //let error = calcError(data, predictPolynomial);

    // Title
    addTitle(`Logistic Regression with 1 Covariate: , `);

    // y label
    addYLabel(svg, font, height, margin, "Y values");

    // x label
    addXLabel(svg, font, width, height, margin, "X values");

    d3.select("#legend").remove();

    // Data entry
    addLegendEntry("Data", "circle", color_data, 150, -400);

    // Residuals entry
    addLegendEntry("Residuals", "line", color_residuals, 150, -400);

    // Estimate entry
    addLegendEntry("Estimate c\u2082x\u00B2 + c\u2081x + b", "line", color_estimate, 150, -400);

    // Find the solution to the regression
    function solveRegression() {
        // Extract X and y matrices
        const X = data.map(d => [1, d.x, d.x ** 2]);
        const y = data.map(d => d.y);

        // Matrix multiplication
        const X_t = math.transpose(X);
        const X_tX = math.multiply(X_t, X);
        const coefs = math.multiply(math.inv(X_tX), math.multiply(X_t, y));

        // Extract coefficients and assign them to the box and sliders
        const b = +coefs[0].toFixed(4);
        const c1 = +coefs[1].toFixed(4);
        const c2 = +coefs[2].toFixed(4);

        document.getElementById('bBox').value = b;
        document.getElementById('bSlider').value = b;
        document.getElementById('c1Box').value = c1;
        document.getElementById('c1Slider').value = c1;
        document.getElementById('c2Box').value = c2;
        document.getElementById('c2Slider').value = c2;
    }

    window.solveRegression = solveRegression;
}