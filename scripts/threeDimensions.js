function drawGrid(scene, gridSize, numLines, color) {
    // Define grid and step sizes.
    const gridLines = [];
    const step = gridSize / (numLines - 1);
    const halfGrid = gridSize / 2;

    // Push the actual grid lines in the Z and X directions.
    for (let i = 0; i < numLines; i++) {
        const pos = -halfGrid + i * step;
        gridLines.push([ [pos, 0, -halfGrid], [pos, 0, halfGrid] ]); 
        gridLines.push([ [-halfGrid, 0, pos], [halfGrid, 0, pos] ]); 
    }
    
    // Format the grid lines.
    scene.selectAll("Shape.grid-line")
      .data(gridLines)
      .enter()
      .append("Shape")
      .attr("class", "grid-line")
      .append("Appearance")
      .append("Material")
      .attr("emissiveColor", color);

    scene.selectAll("Shape.grid-line")
      .append("IndexedLineSet")
      .attr("coordIndex", "0 1")
      .append("Coordinate")
      .attr("point", d => `${d[0].join(' ')} ${d[1].join(' ')}`);
}

function drawAxis(scene, color, label, start, end, labelPos) {
    // Format the axis that needs to be labeled.
    const axisGroup = scene.append("Group");
        axisGroup.append("Shape")
            .append("Appearance")
            .append("Material")
            .attr("emissiveColor", color)
            .append("LineProperties")
            .attr("linewidthScaleFactor", 300);
        axisGroup.select("Shape")
            .append("IndexedLineSet")
            .attr("coordIndex", "0 1")
            .append("Coordinate")
            .attr("point", `${start.join(' ')} ${end.join(' ')}`);
        axisGroup.append("Transform")
            .attr("translation", labelPos.join(' '))
            .append("Billboard")
            .append("Shape")
            .append("Appearance")
            .append("Material")
            .attr("diffuseColor", "0 0 0")
            .select(function() { return this.parentNode.parentNode; })
            .append("Text")
            .attr("string", `"${label}"`)
            .append("FontStyle")
            .attr("size", "0.7")
            .attr("family", '"SANS"');
}

function drawPoints(scene, data) {
    const dataGroup = scene.append("Group").attr("class", "data-points");
    // Format the points themselves.
    dataGroup.selectAll("Transform")
        .data(data)
        .enter()
        .append("Transform")
        .attr("translation", d => `${d.x1} ${d.y} ${d.x2}`)
        .append("Shape")
        .append("Appearance")
        .append("Material")
        .attr("diffuseColor", "#3070B7");

    dataGroup.selectAll("Shape")
        .append("Sphere")
        .attr("radius", "0.15");
}

function drawPlane(scene, c2, c1, b, planeSize, color) {
    scene.select("Shape.regression-plane").remove();
    const pointsPerSide = 20;
    const vertices = [];
    const faces = [];
    const step = planeSize / (pointsPerSide - 1);

    // Build the plane vertices using 20 points per side.
    for (let i = 0; i < pointsPerSide; i++) {
        for (let j = 0; j < pointsPerSide; j++) {
            let x_val = -(planeSize / 2) + j * step;
            let z_val = -(planeSize / 2) + i * step;
            let y_val = c1 * x_val + c2 * z_val + b;
            vertices.push(`${x_val} ${y_val} ${z_val}`);
        }
    }

     // Build the plane faces using 20 points per side.
    for (let i = 0; i < pointsPerSide - 1; i++) {
        for (let j = 0; j < pointsPerSide - 1; j++) {
            let p1 = i * pointsPerSide + j;
            let p2 = i * pointsPerSide + j + 1;
            let p3 = (i + 1) * pointsPerSide + j + 1;
            let p4 = (i + 1) * pointsPerSide + j;
            faces.push(`${p1} ${p2} ${p3} ${p4} -1`);
        }
    }

    // Format the plane.
    const planeShape = scene.append("Shape")
        .attr("class", "regression-plane");

    // Make sure the plane has the inputted color.
    planeShape.append("Appearance")
        .append("Material")
        .attr("diffuseColor", color) 
        .attr("transparency", "0.2"); 

    const faceSet = planeShape.append("IndexedFaceSet")
        .attr("solid", "false")
        .attr("colorPerVertex", "true")
        .attr("coordIndex", faces.join(' '));

    faceSet.append("Coordinate").attr("point", vertices.join(' '));
}

function drawResiduals(scene, data, c2, c1, b) {
    scene.selectAll("Group.residuals").remove(); 
    
    // Draw the residuals as cylinders to adjust the thickness.
    const residuals = data.map(d => {
        const y_hat = c2 * d.x2 + c1 * d.x1 + b;
        return {
            height: Math.abs(d.y - y_hat),
            midpoint: [d.x1, (d.y + y_hat) / 2, d.x2] 
        };
    });

    // Add the actual cylinders at the appropriate midpoints.
    const residualGroup = scene.append("Group").attr("class", "residuals");
    const residualTransforms = residualGroup.selectAll("Transform")
        .data(residuals)
        .enter()
        .append("Transform")
        .attr("translation", d => d.midpoint.join(' '));

    // Format the residual cylinder.
    const residualShapes = residualTransforms.append("Shape");

    residualShapes.append("Appearance")
        .append("Material")
        .attr("diffuseColor", "red");

    residualShapes.append("Cylinder")
        .attr("height", d => d.height) 
        .attr("radius", "0.02");       
}

function calcError3D(data, predictY) {
    // Calculate the error (predictY is the regression function)
    let error = 0;
    for (let i = 0; i < data.length; i++) {
        error += Math.abs(data[i].y - predictY(data[i].x1, data[i].x2));
    }
    error = error / data.length;
    return error;
}

