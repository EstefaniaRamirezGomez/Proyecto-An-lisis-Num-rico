// ============================================
// CAPÍTULO 3: INTERPOLACIÓN
// ============================================

function getInterpolationData() {
    const n = parseInt(document.getElementById('data-points').value);
    let points = [];
    
    for (let i = 0; i < n; i++) {
        const x = parseFloat(document.getElementById(`x-${i}`).value);
        const y = parseFloat(document.getElementById(`y-${i}`).value);
        points.push({x, y});
    }
    
    return points;
}

function renderDataPointsInput(n = 5) {
    let html = '<div class="card" style="max-height: 400px; overflow-y: auto;">';
    html += `
        <label>Número de puntos (máximo 10)</label>
        <select id="data-points" onchange="updateDataPointsSize()">
    `;
    
    for (let i = 2; i <= 10; i++) {
        html += `<option value="${i}" ${i === n ? 'selected' : ''}>${i}</option>`;
    }
    
    html += '</select><table style="width:100%; margin-top:10px;"><tr><th>x</th><th>y</th></tr>';
    
    // Datos por defecto: parábola
    let defaultY = [1, 2, 5, 10, 17, 26, 37, 50, 65, 82];
    
    for (let i = 0; i < n; i++) {
        html += `<tr>
            <td><input id="x-${i}" type="number" value="${i}" step="0.1" style="width:60px;"></td>
            <td><input id="y-${i}" type="number" value="${defaultY[i]}" step="0.1" style="width:60px;"></td>
        </tr>`;
    }
    
    html += '</table></div>';
    return html;
}

function updateDataPointsSize() {
    const newN = parseInt(document.getElementById('data-points').value);
    const inputs = document.getElementById('data-inputs');
    if (inputs) inputs.innerHTML = renderDataPointsInput(newN);
}

function updateDataPointsSize_Newton() {
    const newN = parseInt(document.getElementById('data-points').value);
    const inputs = document.getElementById('data-inputs-newton');
    if (inputs) inputs.innerHTML = renderDataPointsInput(newN);
}

function updateDataPointsSize_Spline() {
    const newN = parseInt(document.getElementById('data-points').value);
    const inputs = document.getElementById('data-inputs-spline');
    if (inputs) inputs.innerHTML = renderDataPointsInput(newN);
}

function updateDataPointsSize_Cubic() {
    const newN = parseInt(document.getElementById('data-points').value);
    const inputs = document.getElementById('data-inputs-cubic');
    if (inputs) inputs.innerHTML = renderDataPointsInput(newN);
}

function updateDataPointsSize_Vandermonde() {
    const newN = parseInt(document.getElementById('data-points').value);
    const inputs = document.getElementById('data-inputs-vandermonde');
    if (inputs) inputs.innerHTML = renderDataPointsInput(newN);
}

function plotInterpolation(canvasId, points, evaluateFunc, label) {
    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));
    const range = xMax - xMin || 1;
    
    let curve = [];
    let step = range / 100;
    
    for (let x = xMin; x <= xMax; x += step) {
        curve.push({x, y: evaluateFunc(x)});
    }
    
    const ctx = document.getElementById(canvasId);
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: label,
                    data: curve,
                    borderColor: '#6c63ff',
                    showLine: true,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'Puntos',
                    data: points,
                    borderColor: '#ff6b6b',
                    pointRadius: 6,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } }
        }
    });
}

// ============================================
// LAGRANGE
// ============================================

function renderLagrange() {
    return `
    <h1>Lagrange
        <button onclick="showHelp('Interpolacion de Lagrange', '<p>Construye un polinomio usando una formula explicita que pasa por todos los puntos.</p><p><strong>Ventaja:</strong> Formula cerrada, facil de calcular.</p><p><strong>Desventaja:</strong> Puede oscilar (fenomeno de Runge).</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <button onclick="showHelp('Como ingresar datos', '<p>Ingresa hasta 10 puntos (x, y).</p><p>Los puntos deben estar ordenados por x ascendente.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="data-inputs">
        ${renderDataPointsInput(5)}
    </div>

    <button onclick="runLagrange()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Lagrange
    </button>

    <div id="lagrange-results"></div>
    `;
}

function lagrangeEvaluate(points, x) {
    let y = 0;
    for (let i = 0; i < points.length; i++) {
        let L = 1;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                L *= (x - points[j].x) / (points[i].x - points[j].x);
            }
        }
        y += points[i].y * L;
    }
    return y;
}

function generateLagrangePolynomial(points) {
    let formula = `P(x) = `;
    let terms = [];
    
    for (let i = 0; i < points.length; i++) {
        let numerator = [];
        let denominator = [];
        
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                numerator.push(`(x - ${points[j].x.toFixed(2)})`);
                denominator.push(`(${points[i].x.toFixed(2)} - ${points[j].x.toFixed(2)})`);
            }
        }
        
        let y_i = points[i].y.toFixed(4);
        terms.push(`${y_i} · ${numerator.join(' · ')} / [${denominator.join(' · ')}]`);
    }
    
    formula += terms.join(` + `);
    return formula;
}

function runLagrange() {
    const points = getInterpolationData();
    
    if (points.length < 2) {
        showHelp('Error', '<p>Ingresa al menos 2 puntos.</p>');
        return;
    }

    // Mostrar tabla de puntos
    let html = `<h3>Puntos ingresados</h3>`;
    let tableRows = points.map((p, i) => [i, p.x.toFixed(4), p.y.toFixed(4)]);
    html += renderTable(tableRows, ['#', 'x', 'y']);

    html += `<h3>Polinomio de Lagrange (grado ${points.length - 1})</h3>`;
    
    const polynomialFormula = generateLagrangePolynomial(points);
    html += `<div class="card" style="background: #f0f4ff; border-left: 4px solid #6c63ff;">
        <p><strong>Fórmula:</strong></p>
        <p style="font-family: monospace; font-size: 0.85em; word-break: break-all;">${polynomialFormula}</p>
    </div>`;
    
    html += '<canvas id="lagrange-chart"></canvas>';
    
    document.getElementById('lagrange-results').innerHTML = html;
    
    plotInterpolation('lagrange-chart', points, x => lagrangeEvaluate(points, x), 'Lagrange');
}

// ============================================
// NEWTON INTERPOLANTE
// ============================================

function renderNewtonInterpolante() {
    return `
    <h1>Newton Interpolante
        <button onclick="showHelp('Newton Interpolante', '<p>Usa diferencias divididas de Newton para interpolar.</p><p><strong>Ventaja:</strong> Mas estable numericamente.</p><p><strong>Ventaja:</strong> Facil agregar nuevos puntos.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <button onclick="showHelp('Como ingresar datos', '<p>Ingresa hasta 10 puntos (x, y).</p><p>Los puntos deben estar ordenados por x ascendente.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="data-inputs-newton">
        ${renderDataPointsInput(5)}
    </div>

    <button onclick="runNewtonInterpolante()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Newton Interpolante
    </button>

    <div id="newton-results"></div>
    `;
}

function dividedDifferences(points) {
    let n = points.length;
    let dd = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        dd[i][0] = points[i].y;
    }
    
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            dd[i][j] = (dd[i+1][j-1] - dd[i][j-1]) / (points[i+j].x - points[i].x);
        }
    }
    
    return dd;
}

function newtonEvaluate(points, dd, x) {
    let n = points.length;
    let result = dd[0][0];
    let prod = 1;
    
    for (let i = 1; i < n; i++) {
        prod *= (x - points[i-1].x);
        result += dd[0][i] * prod;
    }
    
    return result;
}

function generateNewtonPolynomial(points, dd) {
    let formula = `P(x) = ${dd[0][0].toFixed(4)}`;
    
    for (let i = 1; i < points.length; i++) {
        let coeff = dd[0][i].toFixed(6);
        let factors = [];
        for (let j = 0; j < i; j++) {
            factors.push(`(x - ${points[j].x.toFixed(2)})`);
        }
        formula += ` + ${coeff} · ${factors.join(' · ')}`;
    }
    
    return formula;
}

function runNewtonInterpolante() {
    const points = getInterpolationData();
    
    if (points.length < 2) {
        showHelp('Error', '<p>Ingresa al menos 2 puntos.</p>');
        return;
    }

    const dd = dividedDifferences(points);
    
    // Mostrar tabla de puntos
    let html = `<h3>Puntos ingresados</h3>`;
    let tableRows = points.map((p, i) => [i, p.x.toFixed(4), p.y.toFixed(4)]);
    html += renderTable(tableRows, ['#', 'x', 'y']);
    
    html += `<h3>Newton Interpolante (grado ${points.length - 1})</h3>`;
    
    const polynomialFormula = generateNewtonPolynomial(points, dd);
    html += `<div class="card" style="background: #f0f4ff; border-left: 4px solid #6c63ff;">
        <p><strong>Fórmula:</strong></p>
        <p style="font-family: monospace; font-size: 0.85em; word-break: break-all;">${polynomialFormula}</p>
    </div>`;
    
    html += '<canvas id="newton-chart"></canvas>';
    
    document.getElementById('newton-results').innerHTML = html;
    
    plotInterpolation('newton-chart', points, x => newtonEvaluate(points, dd, x), 'Newton');
}

// ============================================
// SPLINE LINEAL
// ============================================

function renderSplineLineal() {
    return `
    <h1>Spline Lineal
        <button onclick="showHelp('Spline Lineal', '<p>Interpola con lineas rectas entre puntos.</p><p><strong>Ventaja:</strong> Simple, sin oscilaciones.</p><p><strong>Desventaja:</strong> No es suave (derivada discontinua).</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <button onclick="showHelp('Como ingresar datos', '<p>Ingresa hasta 10 puntos (x, y).</p><p>Los puntos deben estar ordenados por x ascendente.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="data-inputs-spline">
        ${renderDataPointsInput(5)}
    </div>

    <button onclick="runSplineLineal()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Spline Lineal
    </button>

    <div id="spline-lineal-results"></div>
    `;
}

function splineLinealEvaluate(points, x) {
    for (let i = 0; i < points.length - 1; i++) {
        if (x >= points[i].x && x <= points[i+1].x) {
            let t = (x - points[i].x) / (points[i+1].x - points[i].x);
            return points[i].y * (1 - t) + points[i+1].y * t;
        }
    }
    return points[points.length - 1].y;
}

function runSplineLineal() {
    const points = getInterpolationData().sort((a, b) => a.x - b.x);
    
    if (points.length < 2) {
        showHelp('Error', '<p>Ingresa al menos 2 puntos.</p>');
        return;
    }

    // Mostrar tabla de puntos
    let html = `<h3>Puntos ingresados</h3>`;
    let tableRows = points.map((p, i) => [i, p.x.toFixed(4), p.y.toFixed(4)]);
    html += renderTable(tableRows, ['#', 'x', 'y']);

    html += `<h3>Spline Lineal</h3>`;
    html += '<canvas id="spline-lineal-chart"></canvas>';
    
    document.getElementById('spline-lineal-results').innerHTML = html;
    
    plotInterpolation('spline-lineal-chart', points, x => splineLinealEvaluate(points, x), 'Spline Lineal');
}

// ============================================
// SPLINE CÚBICO
// ============================================

function renderSplineCubico() {
    return `
    <h1>Spline Cubico
        <button onclick="showHelp('Spline Cubico', '<p>Interpola con polinomios cubicos entre segmentos.</p><p><strong>Ventaja:</strong> Suave y continua (2da derivada).</p><p><strong>Uso comun:</strong> Diseno, CAD, graficos.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <button onclick="showHelp('Como ingresar datos', '<p>Ingresa hasta 10 puntos (x, y).</p><p>Los puntos deben estar ordenados por x ascendente.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="data-inputs-cubic">
        ${renderDataPointsInput(5)}
    </div>

    <button onclick="runSplineCubico()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Spline Cúbico
    </button>

    <div id="spline-cubic-results"></div>
    `;
}

function splineCubicEvaluate(points, coeff, x) {
    for (let i = 0; i < points.length - 1; i++) {
        if (x >= points[i].x && x <= points[i+1].x) {
            let h = x - points[i].x;
            let c = coeff[i];
            return c.a + c.b * h + c.c * h * h + c.d * h * h * h;
        }
    }
    return points[points.length - 1].y;
}

function computeSplineCoeff(points) {
    let n = points.length;
    let h = [];
    for (let i = 0; i < n - 1; i++) h[i] = points[i+1].x - points[i].x;
    
    // Sistema tridiagonal
    let alpha = Array(n).fill(0);
    for (let i = 1; i < n - 1; i++) {
        alpha[i] = 3/h[i] * (points[i+1].y - points[i].y) - 3/h[i-1] * (points[i].y - points[i-1].y);
    }
    
    let l = Array(n).fill(1);
    let mu = Array(n).fill(0);
    let z = Array(n).fill(0);
    
    for (let i = 1; i < n - 1; i++) {
        l[i] = 2 * (points[i+1].x - points[i-1].x) - h[i-1] * mu[i-1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i-1] * z[i-1]) / l[i];
    }
    
    let c = Array(n).fill(0);
    let b = Array(n-1).fill(0);
    let d = Array(n-1).fill(0);
    
    for (let i = n - 2; i >= 0; i--) {
        c[i] = z[i] - mu[i] * c[i+1];
        b[i] = (points[i+1].y - points[i].y) / h[i] - h[i] * (c[i+1] + 2*c[i]) / 3;
        d[i] = (c[i+1] - c[i]) / (3 * h[i]);
    }
    
    let coeff = [];
    for (let i = 0; i < n - 1; i++) {
        coeff.push({
            a: points[i].y,
            b: b[i],
            c: c[i],
            d: d[i]
        });
    }
    
    return coeff;
}

function runSplineCubico() {
    const points = getInterpolationData().sort((a, b) => a.x - b.x);
    
    if (points.length < 4) {
        showHelp('Error', '<p>Ingresa al menos 4 puntos para spline cúbico.</p>');
        return;
    }

    const coeff = computeSplineCoeff(points);
    
    // Mostrar tabla de puntos
    let html = `<h3>Puntos ingresados</h3>`;
    let tableRows = points.map((p, i) => [i, p.x.toFixed(4), p.y.toFixed(4)]);
    html += renderTable(tableRows, ['#', 'x', 'y']);

    html += `<h3>Spline Cúbico</h3>`;
    html += '<canvas id="spline-cubic-chart"></canvas>';
    
    document.getElementById('spline-cubic-results').innerHTML = html;
    
    plotInterpolation('spline-cubic-chart', points, x => splineCubicEvaluate(points, coeff, x), 'Spline Cúbico');
}

// ============================================
// VANDERMONDE
// ============================================

function renderVandermonde() {
    return `
    <h1>Vandermonde
        <button onclick="showHelp('Matriz de Vandermonde', '<p>Resuelve un sistema usando la matriz de Vandermonde.</p><p>Encuentra los coeficientes del polinomio interpolante resolviendo un sistema lineal.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <button onclick="showHelp('Como ingresar datos', '<p>Ingresa hasta 10 puntos (x, y).</p><p>Los puntos deben estar ordenados por x ascendente.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="data-inputs-vandermonde">
        ${renderDataPointsInput(5)}
    </div>

    <button onclick="runVandermonde()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Vandermonde
    </button>

    <div id="vandermonde-results"></div>
    `;
}

function gaussianElimination(A, b) {
    let n = A.length;
    let Ab = A.map((row, i) => [...row, b[i]]);
    
    // Eliminación hacia adelante
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(Ab[k][i]) > Math.abs(Ab[maxRow][i])) maxRow = k;
        }
        [Ab[i], Ab[maxRow]] = [Ab[maxRow], Ab[i]];
        
        for (let k = i + 1; k < n; k++) {
            let factor = Ab[k][i] / Ab[i][i];
            for (let j = i; j <= n; j++) {
                Ab[k][j] -= factor * Ab[i][j];
            }
        }
    }
    
    // Sustitución hacia atrás
    let x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = Ab[i][n];
        for (let j = i + 1; j < n; j++) {
            x[i] -= Ab[i][j] * x[j];
        }
        x[i] /= Ab[i][i];
    }
    
    return x;
}

function runVandermonde() {
    const points = getInterpolationData().sort((a, b) => a.x - b.x);
    
    if (points.length < 2) {
        showHelp('Error', '<p>Ingresa al menos 2 puntos.</p>');
        return;
    }

    let n = points.length;
    let V = [];
    let b = [];
    
    for (let i = 0; i < n; i++) {
        V[i] = [];
        for (let j = 0; j < n; j++) {
            V[i][j] = Math.pow(points[i].x, n - 1 - j);
        }
        b[i] = points[i].y;
    }
    
    let coeff = gaussianElimination(V, b);
    
    // Mostrar tabla de puntos
    let html = `<h3>Puntos ingresados</h3>`;
    let tableRows = points.map((p, i) => [i, p.x.toFixed(4), p.y.toFixed(4)]);
    html += renderTable(tableRows, ['#', 'x', 'y']);
    
    // Mostrar matriz de Vandermonde
    html += `<h3>Matriz de Vandermonde</h3>`;
    let matrixRows = V.map((row, i) => [...row.map(v => v.toFixed(6)), b[i].toFixed(4)]);
    html += renderTable(matrixRows, [...Array.from({length: n}, (_, i) => `x^${n-1-i}`), 'y']);
    
    // Mostrar polinomio
    html += `<h3>Polinomio de grado ${n-1}</h3>`;
    html += '<p><strong>p(x) = </strong>';
    for (let i = 0; i < coeff.length; i++) {
        let sign = coeff[i] >= 0 && i > 0 ? ' + ' : '';
        html += `${sign}${coeff[i].toFixed(6)}x<sup>${n-1-i}</sup>`;
    }
    html += '</p>';
    
    let evaluateVandermonde = (x) => {
        let y = 0;
        for (let i = 0; i < coeff.length; i++) {
            y += coeff[i] * Math.pow(x, n - 1 - i);
        }
        return y;
    };
    
    html += '<canvas id="vandermonde-chart"></canvas>';
    document.getElementById('vandermonde-results').innerHTML = html;
    
    plotInterpolation('vandermonde-chart', points, evaluateVandermonde, 'Vandermonde');
}
