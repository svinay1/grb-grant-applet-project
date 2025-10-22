function generateUniformData(n, c2, c1, b) {
    // Generate uniform data for this plot.
    const points = [];
    const rand = d3.randomLcg(42);
    while(points.length < n) {
        const x1 = (rand() - 0.5) * 10;
        const x2 = (rand() - 0.5) * 10;

        const y = c2 * x1 + c1 * x2 + b + (rand() - 0.5) * 2;

        if (y >= -5 && y <= 5) {
            points.push({ x1, x2, y });
        }
    }
    return points;
}

const plot3 = (function() {
    // Variables to ensure that scene is only generated once.
    let isSceneInitialized = false;
    let scene; 
    let data;

    // Contains the code that only needs to be generated once.
    function renderPlot() {
        // Colors used in plot.
        let color_data = "#3070B7";
        let color_estimate = "#377e22";
        let color_residuals = "red";

        // Prevents points from being redrawn.
        if (!isSceneInitialized) {
            scene = d3.select("#myplot scene");
            
            const scene_size = 10;
            const num_grid_lines = 21;
            const color_grid = "#E0E0E0";
            
            // Generate the data.
            data = generateUniformData(50, 1.0, -1.0, -1.0); 
            
            // Draw the grid.
            drawGrid(scene, scene_size, num_grid_lines, color_grid);

            // Draw the axes.
            const axisLength = scene_size / 2
            drawAxis(scene, 'black', 'x1', [-axisLength, 0, 0], [axisLength, 0, 0], [axisLength + 0.8, 0, 0])
            drawAxis(scene, 'black', 'x2', [0, 0, -axisLength], [0, 0, axisLength], [0, 0, axisLength + 0.8])
            drawAxis(scene, 'black', 'y', [0, -axisLength, 0], [0, axisLength, 0], [0, axisLength + 0.8, 0])

            // Add in the data points.
            drawPoints(scene, data); 

            isSceneInitialized = true;
        }
    
        // Get c2, c1, and b from slider inputs
        let c2 = parseFloat(document.getElementById('c2Slider').value) || 0;
        let c1 = parseFloat(document.getElementById('c1Slider').value) || 0;
        let b =  parseFloat(document.getElementById('bSlider').value) || 0;

        // Set the function.
        const predictPolynomial = (x1, x2) => c2 * x2 + c1 * x1 + b;

        // Draw the plane and residuals
        drawPlane(scene, c2, c1, b, 10, '#377e22');
        drawResiduals(scene, data, c2, c1, b);

        // Calculate error
        let error = calcError3D(data, predictPolynomial);

        // Title
        addTitle(`Multilinear Regression: c\u2082 = ${c2.toFixed(2)}, c\u2081 = ${c1.toFixed(2)}, b = ${b.toFixed(2)}, total error = ${error.toFixed(2)}`);

        d3.select("#legend").remove();

        // Data entry
        addLegendEntry("Data", "circle", color_data, 250, 0);

        // Residuals entry
        addLegendEntry("Residuals", "line", color_residuals, 250, 0);

        // Estimate entry
        addLegendEntry("Estimate c\u2082x\u2082 + c\u2081x\u2081 + b", "line", color_estimate, 250, -100);
    }

    // Output the solution to the regression
    function solveRegression() {
        document.getElementById('bSlider').value = -1.1;
        document.getElementById('bBox').value = -1.1;
        document.getElementById('c1Slider').value = 1.0;
        document.getElementById('c1Box').value = 1.0;
        document.getElementById('c2Slider').value = -0.9;
        document.getElementById('c2Box').value = -0.9;
    }

    window.solveRegression = solveRegression;
    return renderPlot;

})();