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

function addTitle(text) {
    d3.select("#plot-title").remove();

    const target = d3.select('#myplot');
    if (target.empty()) {
        console.error("Title target not found:", targetSelector);
        return;
    }

    const titleElement = d3.create("h2")
        .attr("id", "plot-title")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .style("margin-top", "50px")
        .style("margin-bottom", "0")
        .text(text)
        .node(); 

    target.node().parentNode.insertBefore(titleElement, target.node());
}

function addLegendEntry(label, type, color, posTop, posRight) {
    let legend = d3.select("#legend");
    if (legend.empty()) {
        const plotElement = d3.select('#myplot').node();
        if (!plotElement) {
            console.error("Plot element not found:", plotId);
            return;
        }

        const plotRect = plotElement.getBoundingClientRect();

        const legendTop = plotRect.top + posTop; 
        const legendLeft = plotRect.right + posRight; 

        legend = d3.select("body").append("div")
            .attr("id", "legend") 
            .style("position", "absolute")
            .style("top", `${legendTop}px`)      // Set calculated top position
            .style("left", `${legendLeft}px`)    // Set calculated left position
            .style("background-color", "rgba(255, 255, 255, 0.9)")
            .style("padding", "15px 20px")
            .style("border", "1px solid #000")
            .style("font-size", "18px")
            .style("font-family", "Arial, sans-serif");
    }

    const legendItem = legend.append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center");

    legend.selectAll(".legend-item").style("margin-bottom", "5px");
    legend.select(".legend-item:last-child").style("margin-bottom", "0");

    const icon = legendItem.append("span")
        .style("display", "inline-block")
        .style("width", "15px")
        .style("height", "15px")
        .style("margin-right", "8px")
        .style("border", "1px solid rgba(0,0,0,0.2)");

    if (type === 'circle') {
        icon.style("background-color", color).style("border-radius", "50%");
    } else if (type === 'line') { 
        icon.style("background-color", color).style("height", "3px").style("border", "none");
    } else { 
        icon.style("background-color", color);
    }
    
    legendItem.append("span").text(label);
}
