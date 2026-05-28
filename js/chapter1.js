function commonRootInputs(btn) {

    return `

    <div class="card">

        <p>
        <strong>Funciones Permitidas:</strong>
        <br>
        x^2, sin(x), cos(x), tan(x), exp(x), log(x), sqrt(x), abs(x)
        <br>
        <button onclick="showHelp('Como ingresar una funcion', '<p>Ingresa expresiones algebraicas como: <code>x^2 - 2*x + 1</code></p><p><strong>Operadores:</strong> +, -, *, /, ^</p><p><strong>Funciones:</strong> sin, cos, tan, exp, log, sqrt, abs</p><p><strong>Ejemplo:</strong> x^3 - 2*sin(x) + 1</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.85em; color: #667eea; font-weight: 600;">
            [Ayuda]
        </button>
        </p>
          <label>f(x)</label>
        <input id="fx" value="x^3-x-2">

        <label>Tolerancia</label>
        <input id="tol" value="0.0001" title="Criterio de convergencia">

        <label>Iteraciones</label>
        <input id="iter" value="50" title="Máximo número de iteraciones">

        <button onclick="${btn}">
            Ejecutar
        </button>

    </div>
    `;
}
function renderBiseccion() {

    return `

    <h1>Biseccion
        <button onclick="showHelp('Metodo de Biseccion', '<p>Busca la raiz dividiendo el intervalo [a,b] por la mitad repetidamente.</p><p><strong>Requisito:</strong> f(a) y f(b) deben tener signos opuestos.</p><p><strong>Ventaja:</strong> Siempre converge si existe raiz en [a,b].</p><p><strong>Formula:</strong> xm = (a + b) / 2</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    ${commonRootInputs('runBiseccion()')}

    <label>a (minimo del intervalo)</label>
    <input id="a" value="1">

    <label>b (maximo del intervalo)</label>
    <input id="b" value="2">

    <div id="results"></div>
    `;
}
function runBiseccion() {

    const f = document.getElementById('fx').value;
    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const iter = parseInt(document.getElementById('iter').value);

    let rows = [];
    let prev = 0;

    for (let i = 0; i < iter; i++) {

        let xm = (a + b) / 2;

        let fxm = safeEval(f, xm);

        let err = i === 0 ? 0 : computeError('absoluto', xm, prev);

        rows.push([
            i,
            xm,
            fxm,
            err
        ]);

        if (i > 0 && Math.abs(err) < tol) break;

        if (safeEval(f, a) * fxm < 0) {
            b = xm;
        } else {
            a = xm;
        }

        prev = xm;
    }
    
    document.getElementById('results').innerHTML =
        renderTable(rows, ['n', 'x', 'f(x)', 'Error']) +
        '<canvas id="chart"></canvas>';

    renderChart(
        'chart',
        rows.map(r => r[0]),
        rows.map(r => r[3]),
        'Error'
    );
}

function renderReglaFalsa() {

    return `
    <h1>Regla Falsa
        <button onclick="showHelp('Metodo de Regla Falsa', '<p>Similar a biseccion pero usa la pendiente para encontrar el punto mas probable de la raiz.</p><p><strong>Ventaja:</strong> Generalmente converge mas rapido que biseccion.</p><p><strong>Formula:</strong> xm = b - (f(b) * (b - a)) / (f(b) - f(a))</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>
    ${commonRootInputs('runReglaFalsa()')}

    <label>a</label>
    <input id="a" value="1">

    <label>b</label>
    <input id="b" value="2">

    <div id="results"></div>
    `;
}

function runReglaFalsa() {

    const f = document.getElementById('fx').value;

    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const iter = parseInt(document.getElementById('iter').value);

    let rows = [];
    let prev = 0;

    for (let i = 0; i < iter; i++) {

        let fa = safeEval(f, a);
        let fb = safeEval(f, b);

        let xm = b - (fb * (b - a)) / (fb - fa);

        let fxm = safeEval(f, xm);
        
        let err = i === 0 ? 0 : computeError('absoluto', xm, prev);

        rows.push([i, xm, fxm, err]);

        if (i > 0 && Math.abs(err) < tol) break;

        if (fa * fxm < 0) {
            b = xm;
        } else {
            a = xm;
        }
        
        prev = xm;
    }

    document.getElementById('results').innerHTML =
        renderTable(rows, ['n', 'x', 'f(x)', 'Error']) +
        '<canvas id="chart"></canvas>';

    renderChart(
        'chart',
        rows.map(r => r[0]),
        rows.map(r => r[3]),
        'Error'
    );
}

function renderPuntoFijo() {

    return `
    <h1>Punto Fijo
        <button onclick="showHelp('Metodo de Punto Fijo', '<p>Transforma f(x) = 0 en x = g(x) y busca el punto fijo.</p><p><strong>Requisito:</strong> |g'(x)| < 1 en la solucion.</p><p><strong>Ventaja:</strong> Simple de implementar.</p><p><strong>Ejemplo:</strong> Para x^3 - x - 2 = 0, prueba g(x) = (x+2)^(1/3)</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">

        <label>g(x)</label>
        <input id="gx" value="(x+2)^(1/3)">

        <label>x0</label>
        <input id="x0" value="1">

        <label>Tolerancia</label>
        <input id="tol-pf" value="0.0001">

        <label>Iteraciones</label>
        <input id="iter-pf" value="50">

        <button onclick="runPuntoFijo()">
            Ejecutar
        </button>

         </div>

    <div id="results"></div>
    `;
}

function runPuntoFijo() {

    const g = document.getElementById('gx').value;

    let x = parseFloat(document.getElementById('x0').value);
    
    const tol = parseFloat(document.getElementById('tol-pf').value);
    const iter = parseInt(document.getElementById('iter-pf').value);

    let rows = [];
    let prev = 0;

    for (let i = 0; i < iter; i++) {
        let xn = safeEval(g, x);
        
        let err = i === 0 ? 0 : Math.abs(xn - prev);

        rows.push([
            i,
            xn,
            err
        ]);
        
        if (i > 0 && Math.abs(err) < tol) break;

        x = xn;
        prev = xn;
    }
    
    document.getElementById('results').innerHTML =
        renderTable(rows, ['n', 'x', 'Error']) +
        '<canvas id="chart"></canvas>';

    renderChart(
        'chart',
        rows.map(r => r[0]),
        rows.map(r => r[2]),
        'Error'
    );
}
function renderNewton() {

    return `
    <h1>Newton
        <button onclick="showHelp('Metodo de Newton', '<p>Usa la derivada de f(x) para encontrar la raiz mas rapidamente.</p><p><strong>Ventaja:</strong> Convergencia cuadratica (muy rapida).</p><p><strong>Requisito:</strong> f'(x) != 0 cerca de la raiz.</p><p><strong>Formula:</strong> xn = x - f(x) / f'(x)</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    ${commonRootInputs('runNewton()')}

    <label>x0</label>
    <input id="x0" value="1">

    <div id="results"></div>
    `;
}

function runNewton() {

    const f = document.getElementById('fx').value;

    let x = parseFloat(document.getElementById('x0').value);
    
    const tol = parseFloat(document.getElementById('tol').value);
    const iter = parseInt(document.getElementById('iter').value);

    let rows = [];
    let prev = 0;

    for (let i = 0; i < iter; i++) {

        let fx = safeEval(f, x);
        let dfx = derivative(f, x);

        let xn = x - fx / dfx;
        
        let err = i === 0 ? 0 : computeError('absoluto', xn, prev);

        rows.push([
            i,
            xn,
            safeEval(f, xn),
            err
        ]);
        
        if (i > 0 && Math.abs(err) < tol) break;

        x = xn;
        prev = xn;
    }

    document.getElementById('results').innerHTML =
        renderTable(rows, ['n', 'x', 'f(x)', 'Error']) +
        '<canvas id="chart"></canvas>';

    renderChart(
        'chart',
        rows.map(r => r[0]),
        rows.map(r => r[3]),
        'Error'
    );
}

function renderSecante() {

    return `
    <h1>Secante
        <button onclick="showHelp('Metodo de la Secante', '<p>Aproxima la derivada usando dos puntos anteriores (no requiere f\'(x)).</p><p><strong>Ventaja:</strong> No necesita la derivada explicita.</p><p><strong>Desventaja:</strong> Converge mas lentamente que Newton.</p><p><strong>Formula:</strong> x2 = x1 - (f(x1) * (x1 - x0)) / (f(x1) - f(x0))</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>
    ${commonRootInputs('runSecante()')}

    <label>x0</label>
    <input id="x0" value="0">

    <label>x1</label>
    <input id="x1" value="1">

    <div id="results"></div>
    `;
}

function runSecante() {

    const f = document.getElementById('fx').value;
    let x0 = parseFloat(document.getElementById('x0').value);
    let x1 = parseFloat(document.getElementById('x1').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const iter = parseInt(document.getElementById('iter').value);

    let rows = [];

    for (let i = 0; i < iter; i++) {

        let fx0 = safeEval(f, x0);
        let fx1 = safeEval(f, x1);

        if (Math.abs(fx1 - fx0) < 1e-15) {
            showToast('Denominador muy pequeño, no puede continuar');
            break;
        }

        let x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);

        if (!isFinite(x2)) {
            showToast('Resultado no finito, revisar los valores iniciales');
            break;
        }

        let err = Math.abs(x2 - x1);

        rows.push([
            i,
            x2,
            safeEval(f, x2),
            err
        ]);

        if (i > 0 && err < tol) break;

        x0 = x1;
        x1 = x2;
    }

    document.getElementById('results').innerHTML =
        renderTable(rows, ['n', 'x', 'f(x)', 'Error']) +
        '<canvas id="chart"></canvas>';

    renderChart(
        'chart',
        rows.map(r => r[0]),
        rows.map(r => r[3]),
        'Error'
    );
}

function renderRaicesMultiples() {

    return `
    <h1>Raices Multiples (Newton Modificado)
        <button onclick="showHelp('Raices Multiples', '<p>Version modificada de Newton para encontrar raices de multiplicidad m > 1.</p><p><strong>Raiz Multiple:</strong> Cuando f(x) = f\'(x) = 0 en el mismo punto.</p><p><strong>Formula:</strong> xn = x - m * f(x) / f\'(x)</p><p>El parametro m es la multiplicidad de la raiz.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    ${commonRootInputs('runRaicesMultiples()')}

    <label>x0</label>
    <input id="x0" value="1">

    <label>Multiplicidad (m)</label>
    <input id="m" value="1" type="number" min="1">

    <div id="results"></div>
    `;
}

function runRaicesMultiples() {

    const f = document.getElementById('fx').value;
    let x = parseFloat(document.getElementById('x0').value);
    const m = parseInt(document.getElementById('m').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const iter = parseInt(document.getElementById('iter').value);

    let rows = [];
    let prev = 0;

    for (let i = 0; i < iter; i++) {

        let fx = safeEval(f, x);
        let dfx = derivative(f, x);

        if (Math.abs(dfx) < 1e-15) {
            showToast('Derivada muy pequeña, no puede continuar');
            break;
        }

        // Newton modificado para raíces múltiples: xn = x - m * f(x) / f'(x)
        let xn = x - (m * fx) / dfx;

        if (!isFinite(xn)) {
            showToast('Resultado no finito, revisar los parámetros');
            break;
        }

        let err = i === 0 ? 0 : computeError('absoluto', xn, prev);

        rows.push([
            i,
            xn,
            safeEval(f, xn),
            err
        ]);

        if (i > 0 && Math.abs(err) < tol) break;

        x = xn;
        prev = xn;
    }

    document.getElementById('results').innerHTML =
        renderTable(rows, ['n', 'x', 'f(x)', 'Error']) +
        '<canvas id="chart"></canvas>';

    renderChart(
        'chart',
        rows.map(r => r[0]),
        rows.map(r => r[3]),
        'Error'
    );
}

// ============================================
// COMPARATIVA DE MÉTODOS CON DIFERENTES ERRORES
// ============================================

function renderComparativa() {

    return `
    <h1>Comparativa de Metodos
        <button onclick="showHelp('Comparativa de Metodos', '<p>Ejecuta todos los metodos simultaneamente sobre la misma funcion.</p><p>Compara la velocidad de convergencia de cada metodo.</p><p>Puedes visualizar cual es mas eficiente para diferentes funciones.</p>')" 
            style="background: #f5f7fa; border: 2px solid #667eea; padding: 8px 12px; cursor: pointer; border-radius: 5px; font-size: 0.9em; color: #667eea; font-weight: 600;">
            [Info]
        </button>
    </h1>

    <div class="card">
        <p style="font-size: 0.9em; color: #666;">
            Ejecuta todos los métodos con la misma función y compara la evolución del error.
        </p>

        <label>f(x)</label>
        <input id="fx-comp" value="x^3-x-2">

        <label>Tolerancia</label>
        <input id="tol-comp" value="0.0001">

        <label>Tipo de Error</label>
        <select id="error-type-comp">
            <option value="absoluto">Absoluto</option>
            <option value="relativo">Relativo</option>
        </select>

        <button onclick="runComparativa()">Ejecutar Comparativa</button>
    </div>

    <div id="results-comp"></div>
    `;
}

function runComparativa() {

    const f = document.getElementById('fx-comp').value;
    const tol = parseFloat(document.getElementById('tol-comp').value);
    const errorType = document.getElementById('error-type-comp').value;

    let resultados = {
        biseccion: [],
        reglaFalsa: [],
        newton: [],
        secante: []
    };

    // BISECCIÓN
    let a = 1, b = 2;
    let prev = 0;
    for (let i = 0; i < 50; i++) {
        let xm = (a + b) / 2;
        let fxm = safeEval(f, xm);
        let err = i === 0 ? 0 : computeError(errorType, xm, prev);
        resultados.biseccion.push(err);
        if (i > 0 && Math.abs(err) < tol) break;
        if (safeEval(f, a) * fxm < 0) b = xm;
        else a = xm;
        prev = xm;
    }

    // REGLA FALSA
    a = 1, b = 2;
    prev = 0;
    for (let i = 0; i < 50; i++) {
        let fa = safeEval(f, a);
        let fb = safeEval(f, b);
        let xm = b - (fb * (b - a)) / (fb - fa);
        let fxm = safeEval(f, xm);
        let err = i === 0 ? 0 : computeError(errorType, xm, prev);
        resultados.reglaFalsa.push(err);
        if (i > 0 && Math.abs(err) < tol) break;
        if (fa * fxm < 0) b = xm;
        else a = xm;
        prev = xm;
    }

    // NEWTON
    let x = 1.5;
    prev = 0;
    for (let i = 0; i < 50; i++) {
        let fx = safeEval(f, x);
        let dfx = derivative(f, x);
        let xn = x - fx / dfx;
        let err = i === 0 ? 0 : computeError(errorType, xn, prev);
        resultados.newton.push(err);
        if (i > 0 && Math.abs(err) < tol) break;
        x = xn;
        prev = xn;
    }

    // SECANTE
    let x0 = 0, x1 = 1;
    prev = 0;
    for (let i = 0; i < 50; i++) {
        let fx0 = safeEval(f, x0);
        let fx1 = safeEval(f, x1);
        let x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
        let err = i === 0 ? 0 : computeError(errorType, x2, prev);
        resultados.secante.push(err);
        if (i > 0 && Math.abs(err) < tol) break;
        x0 = x1;
        x1 = x2;
        prev = x2;
    }

    // Encontrar la longitud máxima
    const maxLen = Math.max(...Object.values(resultados).map(r => r.length));

    document.getElementById('results-comp').innerHTML =
        '<canvas id="chart-comp"></canvas>';

    renderMultiChart(
        'chart-comp',
        Array.from({length: maxLen}, (_, i) => i),
        resultados,
        `Error ${errorType} - Comparativa de Métodos`
    );
}