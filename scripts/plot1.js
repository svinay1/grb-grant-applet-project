function plot1() {
    // Colors used in plot
    let color_data = "#3070B7";
    let color_estimate = "#377e22";
    let color_residuals = "red";
    let color_grid = "#d9c7d7";

    // Font
    let font = 'Arial';

    removePlot("#myplot");
    
    // Set the dimensions and margins of the graph
    var margin = {top: 60, right: 150, bottom: 80, left: 60},
                width = 700 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom;
                
    
    // Append the svg object to the body of the page
    var svg = appendSvg("#myplot", width, height, margin);
            
    // Read the data
    d3.csv("https://raw.githubusercontent.com/lorenzoluzi/public_data/master/simple_data.csv")
        .then(function(data) {
        // Get m and b from variables drawn from text fields
        let m = parseFloat(document.getElementById('mBox').value);
        let b = parseFloat(document.getElementById('bBox').value);

        // Set the function.
        const predictLinear = x => m * x + b;

        // Min and max x and y
        let { xmin, xmax, ymin, ymax } = getMinMax(data, predictLinear);

        // Add x axis
        let x = addXAxis(svg, xmin, xmax, width, height);

        // Add y axis
        let y = addYAxis(svg, ymin, ymax, width, height);

        // Grid lines
        // Line strokes: https://observablehq.com/@onoratod/animate-a-path-in-d3
        drawGridlines(7, 9, width, height, color_grid);

        // Draw Residuals
        drawResiduals(svg, data, color_residuals, x, y, predictLinear);
        

        // Draw line for estimate
        drawEstimateLine(svg, x, y, xmin, xmax, predictLinear, color_estimate);

        // Add dots
        addDots(svg, data, x, y, color_data, "circle");
        
        // Calculate error
        let error = calcError(data, predictLinear);

        // Title
        addTitle(`Simple Linear Regression: m = ${m.toFixed(2)}, b = ${b.toFixed(2)}, total error = ${error.toFixed(2)}`, '#myplot', '0px');

        // Y label
        addYLabel(svg, font, height, margin, "Y values");

        // X label
        addXLabel(svg, font, width, height, margin, "X values");

        // Legend
        let center = height/2;
        let spacing = 20;
        let circle_radius = 6;
        let icon_width = 24;
        let legendX = width + 20;

        // Data entry
        addLegendEntry('#myplot', svg, "circle", legendX, center - spacing, color_data, "Data", font, icon_width, circle_radius);

        // Residuals entry
        addLegendEntry('#myplot', svg, "rect", legendX, center, color_residuals, "Residuals", font, icon_width, circle_radius);

        // Estimate entry
        addLegendEntry('#myplot', svg, "rect", legendX, center + spacing, color_estimate, "Estimate mx+b", font, icon_width, circle_radius);

        // Find the solution to the regression
        function solveRegression() {
            // Extract X and y matrices
            const X = data.map(d => [1, d.x]);
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

    })

}
