// ============================================
// CAPÍTULO 2: MÉTODOS DE SISTEMAS LINEALES
// ============================================

// Matriz de entrada compartida
function getMatrixInputs() {
    const sizeStr = document.getElementById('matrix-size').value;
    const size = parseInt(sizeStr);
    
    let A = [];
    let b = [];
    
    for (let i = 0; i < size; i++) {
        A[i] = [];
        for (let j = 0; j < size; j++) {
            A[i][j] = parseFloat(document.getElementById(`a-${i}-${j}`).value);
        }
        b[i] = parseFloat(document.getElementById(`b-${i}`).value);
    }
    
    return { A, b, size };
}

function renderMatrixInput(size = 3, containerId = 'matrix-inputs') {
    let html = '<div class="card" style="max-height: 400px; overflow-y: auto;">';
    
    html += `
        <label>Tamaño de matriz (n×n)</label>
        <select id="matrix-size" onchange="updateMatrixSize('${containerId}')">
            <option value="2">2×2</option>
            <option value="3" selected>3×3</option>
            <option value="4">4×4</option>
            <option value="5">5×5</option>
            <option value="6">6×6</option>
            <option value="7">7×7</option>
            <option value="8">8×8</option>
        </select>
    `;
    
    html += '<table style="width:100%; margin-top:10px; table-layout: fixed;">';
    html += '<tr><th colspan="' + size + '">Matriz A</th><th>b</th></tr>';
    
    for (let i = 0; i < size; i++) {
        html += '<tr>';
        for (let j = 0; j < size; j++) {
            let defaultVal = (i === j) ? 4 : 1;
            if (size === 3 && i === 0 && j === 0) defaultVal = 4;
            if (size === 3 && i === 0 && j === 1) defaultVal = -1;
            if (size === 3 && i === 1 && j === 0) defaultVal = -1;
            if (size === 3 && i === 1 && j === 1) defaultVal = 3;
            if (size === 3 && i === 1 && j === 2) defaultVal = -1;
            if (size === 3 && i === 2 && j === 1) defaultVal = -1;
            if (size === 3 && i === 2 && j === 2) defaultVal = 4;
            
            html += `<td style="padding: 4px;"><input id="a-${i}-${j}" type="number" value="${defaultVal}" step="0.1" style="width:100%; padding: 4px 8px; font-size: 12px; min-width: 50px;"></td>`;
        }
        
        let defaultB = i === 0 ? 9 : i === 1 ? 7 : 9;
        html += `<td style="padding: 4px;"><input id="b-${i}" type="number" value="${defaultB}" step="0.1" style="width:100%; padding: 4px 8px; font-size: 12px; min-width: 50px;"></td>`;
        html += '</tr>';
    }
    
    html += '</table></div>';
    return html;
}

function updateMatrixSize(containerId = 'matrix-inputs') {
    const newSize = parseInt(document.getElementById('matrix-size').value);
    const inputs = document.getElementById(containerId);
    if (inputs) inputs.innerHTML = renderMatrixInput(newSize, containerId);
}

// Radio Espectral
function computeSpectralRadius(M) {
    // Aproximación: usa norm infinito iterativamente
    let eigenvalues = [];
    // Para simplificar, usamos una aproximación mediante la potencia
    let norm = 0;
    for (let i = 0; i < M.length; i++) {
        let rowSum = 0;
        for (let j = 0; j < M[i].length; j++) {
            rowSum += Math.abs(M[i][j]);
        }
        norm = Math.max(norm, rowSum);
    }
    return norm;
}

// Verificar Diagonal Dominancia
function isDiagonallyDominant(A) {
    for (let i = 0; i < A.length; i++) {
        let diag = Math.abs(A[i][i]);
        let sum = 0;
        for (let j = 0; j < A[i].length; j++) {
            if (i !== j) sum += Math.abs(A[i][j]);
        }
        if (diag <= sum) return false;
    }
    return true;
}

// ============================================
// MÉTODO DE JACOBI
// ============================================

function renderJacobi() {
    return `
    <h1>Jacobi
        <button onclick="showHelp('Metodo de Jacobi', '<p>Metodo iterativo para resolver sistemas Ax=b.</p><p>Calcula cada variable usando los valores anteriores de todas las variables.</p><p><strong>Convergencia:</strong> Asegurada si A es diagonalmente dominante o el radio espectral < 1.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <label>Tolerancia</label>
        <input id="tol-jacobi" value="0.0001" type="number" step="0.00001">

        <label>Iteraciones Máximas</label>
        <input id="iter-jacobi" value="50" type="number">

        <button onclick="showHelp('Entrada de Datos', '<p>Ingresa una matriz 3x3 por defecto (ej: Sistema de Cramer)</p><p>Ejemplo: 4x - y = 9, -x + 3y - z = 7, -y + 4z = 9</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="matrix-inputs">
        ${renderMatrixInput(3, 'matrix-inputs')}
    </div>

    <button onclick="runJacobi()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Jacobi
    </button>

    <div id="jacobi-results"></div>
    `;
}

function runJacobi() {
    const { A, b, size } = getMatrixInputs();
    const tol = parseFloat(document.getElementById('tol-jacobi').value);
    const maxIter = parseInt(document.getElementById('iter-jacobi').value);

    // Verificar diagonal dominancia
    let dominante = isDiagonallyDominant(A);
    
    // Calcular matriz de iteración M = D^-1 * (L + U)
    let M = [];
    for (let i = 0; i < size; i++) {
        M[i] = [];
        for (let j = 0; j < size; j++) {
            if (i === j) M[i][j] = 0;
            else M[i][j] = -A[i][j] / A[i][i];
        }
    }
    
    let rhoM = computeSpectralRadius(M);
    let canConverge = rhoM < 1;

    // Inicializar x
    let x = new Array(size).fill(0);
    let rows = [];

    for (let iter = 0; iter < maxIter; iter++) {
        let xNew = new Array(size).fill(0);
        
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for (let j = 0; j < size; j++) {
                if (i !== j) sum += A[i][j] * x[j];
            }
            xNew[i] = (b[i] - sum) / A[i][i];
        }

        // Calcular error
        let err = 0;
        for (let i = 0; i < size; i++) {
            err += Math.abs(xNew[i] - x[i]);
        }

        rows.push([iter, ...xNew.map(v => v.toFixed(6)), err.toFixed(10)]);

        if (err < tol) break;
        x = xNew;
    }

    let headers = ['n', ...Array.from({length: size}, (_, i) => `x${i+1}`), 'Error'];
    
    let html = `<h3>Radio Espectral: ${rhoM.toFixed(6)}</h3>`;
    html += `<p><strong>Diagonal Dominante:</strong> ${dominante ? 'Si' : 'No'}</p>`;
    html += `<p><strong>Puede Converger:</strong> ${canConverge ? 'Si' : 'No'}</p>`;
    html += renderTable(rows, headers);
    html += '<canvas id="jacobi-chart"></canvas>';
    
    document.getElementById('jacobi-results').innerHTML = html;
    
    renderChart('jacobi-chart', 
        rows.map(r => r[0]),
        rows.map(r => r[r.length - 1]),
        'Error Jacobi'
    );
}

// ============================================
// MÉTODO DE GAUSS-SEIDEL
// ============================================

function renderGaussSeidel() {
    return `
    <h1>Gauss-Seidel
        <button onclick="showHelp('Metodo de Gauss-Seidel', '<p>Mejora de Jacobi: usa los valores mas recientes tan pronto estan disponibles.</p><p>Generalmente converge mas rapido que Jacobi.</p><p><strong>Ventaja:</strong> Requiere menos memoria.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <label>Tolerancia</label>
        <input id="tol-gs" value="0.0001" type="number" step="0.00001">

        <label>Iteraciones Máximas</label>
        <input id="iter-gs" value="50" type="number">

        <button onclick="showHelp('Entrada de Datos', '<p>Usa los mismos datos que Jacobi.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como ingresar datos]
        </button>
    </div>

    <div id="matrix-inputs-gs">
        ${renderMatrixInput(3, 'matrix-inputs-gs')}
    </div>

    <button onclick="runGaussSeidel()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Gauss-Seidel
    </button>

    <div id="gs-results"></div>
    `;
}

function runGaussSeidel() {
    const { A, b, size } = getMatrixInputs();
    const tol = parseFloat(document.getElementById('tol-gs').value);
    const maxIter = parseInt(document.getElementById('iter-gs').value);

    let x = new Array(size).fill(0);
    let rows = [];

    for (let iter = 0; iter < maxIter; iter++) {
        let xOld = [...x];
        
        for (let i = 0; i < size; i++) {
            let sum1 = 0, sum2 = 0;
            for (let j = 0; j < i; j++) sum1 += A[i][j] * x[j];
            for (let j = i + 1; j < size; j++) sum2 += A[i][j] * x[j];
            x[i] = (b[i] - sum1 - sum2) / A[i][i];
        }

        let err = 0;
        for (let i = 0; i < size; i++) {
            err += Math.abs(x[i] - xOld[i]);
        }

        rows.push([iter, ...x.map(v => v.toFixed(6)), err.toFixed(10)]);

        if (err < tol) break;
    }

    let headers = ['n', ...Array.from({length: size}, (_, i) => `x${i+1}`), 'Error'];
    
    let html = renderTable(rows, headers);
    html += '<canvas id="gs-chart"></canvas>';
    
    document.getElementById('gs-results').innerHTML = html;
    
    renderChart('gs-chart', 
        rows.map(r => r[0]),
        rows.map(r => r[r.length - 1]),
        'Error Gauss-Seidel'
    );
}

// ============================================
// MÉTODO SOR (Successive Over-Relaxation)
// ============================================

function renderSOR() {
    return `
    <h1>SOR (Successive Over-Relaxation)
        <button onclick="showHelp('Metodo SOR', '<p>Generalizacion de Gauss-Seidel con factor de relajacion omega.</p><p><strong>omega < 1:</strong> Sub-relajacion (convergencia lenta pero estable)</p><p><strong>omega = 1:</strong> Gauss-Seidel</p><p><strong>omega > 1:</strong> Sobre-relajacion (mas rapido si esta bien ajustado)</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <label>Factor de Relajación (ω)</label>
        <input id="omega-sor" value="1.2" type="number" step="0.1" min="0.1" max="2">

        <label>Tolerancia</label>
        <input id="tol-sor" value="0.0001" type="number" step="0.00001">

        <label>Iteraciones Máximas</label>
        <input id="iter-sor" value="50" type="number">

        <button onclick="showHelp('Factor omega', '<p>Para matrices simetricas definidas positivas, el valor optimo puede estimarse.</p><p>Prueba valores entre 1 y 1.9.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Como elegir omega?]
        </button>
    </div>

    <div id="matrix-inputs-sor">
        ${renderMatrixInput(3, 'matrix-inputs-sor')}
    </div>

    <button onclick="runSOR()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar SOR
    </button>

    <div id="sor-results"></div>
    `;
}

function runSOR() {
    const { A, b, size } = getMatrixInputs();
    const omega = parseFloat(document.getElementById('omega-sor').value);
    const tol = parseFloat(document.getElementById('tol-sor').value);
    const maxIter = parseInt(document.getElementById('iter-sor').value);

    let x = new Array(size).fill(0);
    let rows = [];

    for (let iter = 0; iter < maxIter; iter++) {
        let xOld = [...x];
        
        for (let i = 0; i < size; i++) {
            let sum1 = 0, sum2 = 0;
            for (let j = 0; j < i; j++) sum1 += A[i][j] * x[j];
            for (let j = i + 1; j < size; j++) sum2 += A[i][j] * x[j];
            
            let xGS = (b[i] - sum1 - sum2) / A[i][i];
            x[i] = x[i] + omega * (xGS - x[i]);
        }

        let err = 0;
        for (let i = 0; i < size; i++) {
            err += Math.abs(x[i] - xOld[i]);
        }

        rows.push([iter, ...x.map(v => v.toFixed(6)), err.toFixed(10)]);

        if (err < tol) break;
    }

    let headers = ['n', ...Array.from({length: size}, (_, i) => `x${i+1}`), 'Error'];
    
    let html = `<p><strong>Factor ω = ${omega}</strong></p>`;
    html += renderTable(rows, headers);
    html += '<canvas id="sor-chart"></canvas>';
    
    document.getElementById('sor-results').innerHTML = html;
    
    renderChart('sor-chart', 
        rows.map(r => r[0]),
        rows.map(r => r[r.length - 1]),
        'Error SOR'
    );
}

// ============================================
// COMPARATIVA DE MÉTODOS CAPÍTULO 2
// ============================================

function renderComparativaC2() {
    return `
    <h1>Comparativa de Metodos
        <button onclick="showHelp('Comparativa de Metodos', '<p>Ejecuta todos los metodos iterativos simultaneamente sobre el mismo sistema.</p><p>Compara la velocidad de convergencia de cada metodo.</p><p>Puedes visualizar cual es mas eficiente para tu sistema.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <label>Tolerancia</label>
        <input id="tol-comp-c2" value="0.0001" type="number" step="0.00001">

        <label>Factor de Relajación (ω) para SOR</label>
        <input id="omega-comp-c2" value="1.2" type="number" step="0.1">

        <button onclick="showHelp('Nota', '<p>Usa la misma matriz que el ultimo metodo ejecutado.</p><p>Si aun no has ejecutado ningun metodo, se usará la matriz por defecto 3x3.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Mas info]
        </button>
    </div>

    <div id="matrix-inputs-comp">
        ${renderMatrixInput(3, 'matrix-inputs-comp')}
    </div>

    <button onclick="runComparativaC2()" style="margin-top: 10px; padding: 10px 20px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Ejecutar Comparativa
    </button>

    <div id="comp-c2-results"></div>
    `;
}

function runComparativaC2() {
    const { A, b, size } = getMatrixInputs();
    const tol = parseFloat(document.getElementById('tol-comp-c2').value);
    const omega = parseFloat(document.getElementById('omega-comp-c2').value);
    const maxIter = 50;

    let resultados = {
        jacobi: [],
        gaussSeidel: [],
        sor: []
    };

    // JACOBI
    let x = new Array(size).fill(0);
    for (let iter = 0; iter < maxIter; iter++) {
        let xNew = new Array(size).fill(0);
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for (let j = 0; j < size; j++) {
                if (i !== j) sum += A[i][j] * x[j];
            }
            xNew[i] = (b[i] - sum) / A[i][i];
        }
        let err = 0;
        for (let i = 0; i < size; i++) err += Math.abs(xNew[i] - x[i]);
        resultados.jacobi.push(err);
        if (err < tol) break;
        x = xNew;
    }

    // GAUSS-SEIDEL
    x = new Array(size).fill(0);
    for (let iter = 0; iter < maxIter; iter++) {
        let xOld = [...x];
        for (let i = 0; i < size; i++) {
            let sum1 = 0, sum2 = 0;
            for (let j = 0; j < i; j++) sum1 += A[i][j] * x[j];
            for (let j = i + 1; j < size; j++) sum2 += A[i][j] * x[j];
            x[i] = (b[i] - sum1 - sum2) / A[i][i];
        }
        let err = 0;
        for (let i = 0; i < size; i++) err += Math.abs(x[i] - xOld[i]);
        resultados.gaussSeidel.push(err);
        if (err < tol) break;
    }

    // SOR
    x = new Array(size).fill(0);
    for (let iter = 0; iter < maxIter; iter++) {
        let xOld = [...x];
        for (let i = 0; i < size; i++) {
            let sum1 = 0, sum2 = 0;
            for (let j = 0; j < i; j++) sum1 += A[i][j] * x[j];
            for (let j = i + 1; j < size; j++) sum2 += A[i][j] * x[j];
            let xGS = (b[i] - sum1 - sum2) / A[i][i];
            x[i] = x[i] + omega * (xGS - x[i]);
        }
        let err = 0;
        for (let i = 0; i < size; i++) err += Math.abs(x[i] - xOld[i]);
        resultados.sor.push(err);
        if (err < tol) break;
    }

    const maxLen = Math.max(...Object.values(resultados).map(r => r.length));

    let html = `<p><strong>Factor ω (SOR) = ${omega}</strong></p>`;
    html += '<canvas id="chart-comp-c2"></canvas>';

    document.getElementById('comp-c2-results').innerHTML = html;

    renderMultiChart(
        'chart-comp-c2',
        Array.from({length: maxLen}, (_, i) => i),
        resultados,
        'Error - Comparativa de Métodos (Cap. 2)'
    );
}