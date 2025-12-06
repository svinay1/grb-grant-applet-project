# GRB Grant Applet Project

## Table of Contents

- [Introduction](#introduction)
- [Repo Structure](#repo-structure)
- [Setup and Running Instructions](#setup-and-running-instructions)

## Introduction

This repository contains the code for interactive applets used in Rice University Statistics classes.

## Repo Structure
- `html/` contains the HTML code to display applets on a browser.
   - `plotKNN1D.html` contains the HTML code to plot 1D KNN.
   - `plotKNN2D.html` contains the HTML code to plot 2D KNN.
   - `plotLogisticRegression2D.html` contains the HTML code to plot 2D logistic regression.
   - `plotLogisticRegression3D.html` contains the HTML code to plot 3D logistic regression.
   - `plotMultilinearRegression.html` contains the HTML code to plot simple linear regression.
   - `plotSimpleLinearRegression.html` contains the HTML code to plot multilinear regression.
   - `plotSimplePolynomialRegression.html` contains the HTML code to plot simple polynomial regression.

- `scripts/`
   - `plotKNN1D.js` contains the JS code to plot 1D KNN.
   - `plotKNN2D.js` contains the JS code to plot 2D KNN.
   - `plotLogisticRegression2D.js` contains the JS code to plot 2D logistic regression.
   - `plotLogisticRegression3D.js` contains the JS code to plot 3D logistic regression.
   - `plotMultilinearRegression.js` contains the JS code to plot simple linear regression.
   - `plotSimpleLinearRegression.js` contains the JS code to plot multilinear regression.
   - `plotSimplePolynomialRegression.js` contains the JS code to plot simple polynomial regression.
   - `plottingFunctions.js` contains functions that are used across all plotting scripts.
   - `threeDimensions.js` contains functions that are used across 3D plotting scripts.
   - `twoDimensions.js` contains functions that are used across 2D plotting scripts.

## Setup and Running Instructions

**Clone the repository:**
   
   ```bash
   git clone --recurse-submodules https://github.com/svinay1/grb-grant-applet-project.git
   cd grb-grant-applet-project
   ```

**To "run" the code:**

open the desired HTML file using a browser of your choosing.




