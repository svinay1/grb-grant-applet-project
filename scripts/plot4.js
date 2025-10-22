function generateUniformData(totalPoints) {
    const rand = d3.randomLcg(42);
    const x = [];
    const y = [];
    const data = [];

    for (let i = 0; i < totalPoints; i++) {
        if (i < totalPoints / 2) {
            x.push((rand() - 0.5) * 4 - 2);
            y.push(0);
        } else {
            x.push((rand() - 0.5) * 4 + 0.5);
            y.push(1);
        }

        const pred = (100 / (1 + Math.E ** -(3.2 * x[i] + 3.1))) > 0.5;

        if (y[i] == 0) { 
            if (pred == 0) {
                data.push({x: x[i], y: y[i], marker: 'o', color: 'blue'})
            } else { 
                data.push({x: x[i], y: y[i], marker: 'x', color: 'blue'})
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

    // Get m and b from variables drawn from text fields
    let m = parseFloat(document.getElementById('mBox').value);
    let b = parseFloat(document.getElementById('bBox').value);

    // Set the function.
    const predictPolynomial = x => c2 * (x ** 2) + c1 * x + b;

    // Min and max x and y
    let xmin = -5, xmax = 5, ymin = 0, ymax = 1;

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
    addTitle(`Logistic Regression with 1 Covariate: \\( \y = \\frac{100}{1 + e^{-(mx + b)}} \\), `);

    // y label
    addYLabel(svg, font, height, -margin.left / 2, "Probability that y=1");
    addYLabel(svg, font, height, width + margin.right / 8, "Labels for y");

    // x label
    addXLabel(svg, font, width, height, margin, "X values");

    d3.select("#legend").remove();

    // Legend entries
    addLegendEntry("y=1; pred=1", "circle", 'orange', 150, -400);
    addLegendEntry("y=1; pred=0", "x", 'orange', 150, -400);
    addLegendEntry("y=0; pred=1", "circle", 'blue', 150, -400);
    addLegendEntry("y=0; pred=0", "x", 'blue', 150, -400);

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
        const m = +coefs[1].toFixed(4);

        document.getElementById('bBox').value = b;
        document.getElementById('bSlider').value = b;
        document.getElementById('mBox').value = m;
        document.getElementById('mSlider').value = m;
    }

    window.solveRegression = solveRegression;
}