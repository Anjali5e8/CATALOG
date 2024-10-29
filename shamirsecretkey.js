const fs = require('fs');

// Function to load and parse JSON test cases
function loadTestCase(filePath) {
    try {
        const rawData = fs.readFileSync(filePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error loading JSON file:", error);
        return null;
    }
}

// Function to decode the y-value from the given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function for Lagrange Interpolation to find the constant term (c)
function lagrangeInterpolation(points, k) {
    let constantTerm = 0;
    
    for (let i = 0; i < k; i++) {
        let term = points[i].y;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= -points[j].x / (points[i].x - points[j].x);
            }
        }
        constantTerm += term;
    }

    // Rounding off to handle any floating-point inaccuracies
    return Math.round(constantTerm);
}

// Main function to find the constant term from the JSON file
function findConstantTerm(filePath) {
    const data = loadTestCase(filePath);

    if (!data) {
        console.error("Failed to load data from:", filePath);
        return;
    }

    const n = data.keys.n;
    const k = data.keys.k;
    const points = [];

    // Decode each available point and store it
    Object.keys(data).forEach(key => {
        if (key !== "keys") { // Skip the 'keys' object
            const x = parseInt(key); // Use the JSON key as x
            const base = parseInt(data[key].base);
            const y = decodeValue(data[key].value, base);
            points.push({ x, y });
        }
    });

    if (points.length < k) {
        console.error("Not enough points to solve for the polynomial");
        return;
    }

    // Calculate constant term using Lagrange Interpolation
    const constantTerm = lagrangeInterpolation(points, k);
    console.log(`Constant term (c) for ${filePath}:`, constantTerm);
}

// Run the function for both test cases
findConstantTerm('testcase1.json');
findConstantTerm('testcase2.json');
