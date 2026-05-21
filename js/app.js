let currentChapter = null;
let currentMethod = '';

const CHAPTERS = {

    1: {
        methods: [
            ['biseccion', 'Biseccion'],
            ['reglaFalsa', 'Regla Falsa'],
            ['puntoFijo', 'Punto Fijo'],
            ['newton', 'Newton'],
            ['secante', 'Secante'],
            ['raicesMultiples', 'Raices Multiples'],
            ['comparativa', 'Comparativa']
        ]
    },

     2: {
        methods: [
            ['jacobi', 'Jacobi'],
            ['gaussSeidel', 'Gauss-Seidel'],
            ['sor', 'SOR'],
            ['comparativaC2', 'Comparativa']
        ]
    },

    3: {
        methods: [
            ['vandermonde', 'Vandermonde'],
            ['newtonInterpolante', 'Newton Interpolante'],
            ['lagrange', 'Lagrange'],
            ['splineLineal', 'Spline Lineal'],
            ['splineCubico', 'Spline Cubico']
        ]
    }
};

function showHome() {
    currentChapter = null;
    currentMethod = '';
    
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';
    
    const view = document.getElementById('method-view');
    view.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <h1 style="font-size: 48px; color: #667eea; margin-bottom: 20px;">Analisis Numerico</h1>
            <p style="font-size: 18px; color: #666; margin-bottom: 50px;">
                Aplicacion interactiva para metodos numericos
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; max-width: 1000px; margin: 0 auto;">
                <div class="home-card">
                    <h2 style="color: #667eea; font-size: 24px; margin-bottom: 15px;">Capitulo 1</h2>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                        Raices de Ecuaciones<br>
                        Biseccion, Regla Falsa, Newton, Secante, Punto Fijo y Raices Multiples
                    </p>
                    <button onclick="switchChapter(1)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Ir a Capitulo 1
                    </button>
                </div>
                
                <div class="home-card">
                    <h2 style="color: #667eea; font-size: 24px; margin-bottom: 15px;">Capitulo 2</h2>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                        Sistemas Lineales<br>
                        Jacobi, Gauss-Seidel, SOR
                    </p>
                    <button onclick="switchChapter(2)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Ir a Capitulo 2
                    </button>
                </div>
                
                <div class="home-card">
                    <h2 style="color: #667eea; font-size: 24px; margin-bottom: 15px;">Capitulo 3</h2>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                        Interpolacion<br>
                        Lagrange, Newton, Vandermonde, Splines
                    </p>
                    <button onclick="switchChapter(3)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Ir a Capitulo 3
                    </button>
                </div>
            </div>
        </div>
    `;
}

function switchChapter(ch) {

    currentChapter = ch;

    renderSidebar();
}

function renderSidebar() {

    const sidebar = document.getElementById('sidebar');

    let html = '';

    CHAPTERS[currentChapter].methods.forEach(m => {

        html += `
        <button onclick="selectMethod('${m[0]}')">
                ${m[1]}
            </button>
        `;
    });

    sidebar.innerHTML = html;
}
function selectMethod(id) {

    currentMethod = id;

    const view = document.getElementById('method-view');


    if (id === 'biseccion') view.innerHTML = renderBiseccion();
    if (id === 'reglaFalsa') view.innerHTML = renderReglaFalsa();
    if (id === 'puntoFijo') view.innerHTML = renderPuntoFijo();
    if (id === 'newton') view.innerHTML = renderNewton();
    if (id === 'secante') view.innerHTML = renderSecante();
    if (id === 'raicesMultiples') view.innerHTML = renderRaicesMultiples();
    if (id === 'comparativa') view.innerHTML = renderComparativa();

    if (id === 'jacobi') view.innerHTML = renderJacobi();
    if (id === 'gaussSeidel') view.innerHTML = renderGaussSeidel();
    if (id === 'sor') view.innerHTML = renderSOR();
    if (id === 'comparativaC2') view.innerHTML = renderComparativaC2();

    if (id === 'vandermonde') view.innerHTML = renderVandermonde();
    if (id === 'newtonInterpolante') view.innerHTML = renderNewtonInterpolante();
    if (id === 'lagrange') view.innerHTML = renderLagrange();
    if (id === 'splineLineal') view.innerHTML = renderSplineLineal();
    if (id === 'splineCubico') view.innerHTML = renderSplineCubico();
}

showHome();