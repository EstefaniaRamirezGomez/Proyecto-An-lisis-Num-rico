function showToast(msg) {

    const t = document.getElementById('toast');

    t.innerText = msg;

    t.style.display = 'block';

    setTimeout(() => {
        t.style.display = 'none';
    }, 3000);
}

function showHelp(title, content) {

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    box.innerHTML = `
        <h2>${title}</h2>
        <div style="color: #666; line-height: 1.6;">${content}</div>
        <button onclick="this.closest('div').parentElement.remove()" 
            style="margin-top: 15px; padding: 8px 16px; background: #6c63ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Cerrar
        </button>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);
}

function safeEval(expr, x) {

    try {

        return math.evaluate(expr, { x });

    } catch {

        return NaN;
    }
}

function derivative(f, x, h = 1e-7) {

    return (
        safeEval(f, x + h)
        -
        safeEval(f, x - h)
    ) / (2 * h);
}

function computeError(type, xNew, xOld) {

    if (type === 'relativo') {

        return Math.abs((xNew - xOld) / xNew);
    }

    return Math.abs(xNew - xOld);
}

function renderTable(rows, headers) {

    let html = '<table><tr>';

    headers.forEach(h => {
        html += `<th>${h}</th>`;
    });

    html += '</tr>';

    rows.forEach(r => {

        html += '<tr>';

        r.forEach(c => {
            html += `<td>${typeof c === 'number' ? c.toFixed(6) : c}</td>`;
        });

        html += '</tr>';
    });

    html += '</table>';

    return html;
}