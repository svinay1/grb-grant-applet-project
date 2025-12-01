function generateData(totalPoints) {
    const data = [];
    const rand = d3.randomLcg(42);
    const norm = d3.randomNormal.source(rand)(0, 1);
    for (let i = 0; i < totalPoints; i++) {
        const x1 = norm();
        const x2 = norm();
        const y = Math.sin(x1 / 2) + Math.sin(x2 / 2);
        data.push({ x1: x1, x2: x2, y: y });
    }
    return data;
}

// Variables to ensure that scene is only generated once.
let isSceneInitialized = false;
let scene; 
let data;

function plot7() {
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
                
    
    // Contains the code that only needs to be generated once.
    function renderPlot() {
        if (!isSceneInitialized) {
            scene = d3.select("#myplot2 scene");
            
            const scene_size = 10;
            const num_grid_lines = 21;
            const color_grid = "#E0E0E0";
            
            // Get the data
            data = generateData(1000);
            
            drawGrid(scene, scene_size, num_grid_lines, color_grid);

            // Draw the axes
            const axisLength = scene_size / 2;
            drawAxis(scene, 'black', 'x1', [-axisLength, 0, 0], [axisLength, 0, 0], [axisLength + 0.8, 0, 0]);
            drawAxis(scene, 'black', 'x2', [0, 0, -axisLength], [0, 0, axisLength], [0, 0, axisLength + 0.8]);
            drawAxis(scene, 'black', 'y', [0, -axisLength, 0], [0, axisLength, 0], [0, axisLength + 0.8, 0]);

            // Draw the 3D title
            addTitle(`Ground truth function`, '#myplot2');

            // Get k and n from variables drawn from text fields
            let k = parseFloat(document.getElementById('kBox').value) || 0;
            let n = parseFloat(document.getElementById('nBox').value) || 0;
                        
            drawPoints(scene, data, true); 

            isSceneInitialized = true;
        }
    }

    renderPlot();

    // Min and max x1, x2, and y
    let x1min = -3;
    let x1max =  3;
    let x2min = -3;
    let x2max =  3;
    let ymin = -1.5;
    let ymax = 1.5;

    // Set the function.
    const predictFunction = (x1, x2) => Math.sin(x1/2) + Math.sin(x2/2);

    // Draw the plane and residuals
    drawPlane(scene, 0, 0, 0, 6, '#377e22', knn=true);

}
