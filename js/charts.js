function renderChart(canvasId, labels, data, label) {

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.chartInstances && window.chartInstances[canvasId]) {
        window.chartInstances[canvasId].destroy();
    }

    if (!window.chartInstances) {
        window.chartInstances = {};
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label,
                data,
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#6c63ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true },
                filler: { propagate: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    window.chartInstances[canvasId] = chart;
}

function renderMultiChart(canvasId, labels, datasetsObj, title) {

    const colors = ['#6c63ff', '#ff6b6b', '#51cf66', '#ffd93d'];
    const datasets = [];

    let colorIdx = 0;
    for (let key in datasetsObj) {
        datasets.push({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            data: datasetsObj[key],
            borderColor: colors[colorIdx % colors.length],
            backgroundColor: colors[colorIdx % colors.length] + '20',
            tension: 0.4,
            fill: false,
            pointRadius: 3
        });
        colorIdx++;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.chartInstances && window.chartInstances[canvasId]) {
        window.chartInstances[canvasId].destroy();
    }

    if (!window.chartInstances) {
        window.chartInstances = {};
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { 
                title: { display: true, text: title },
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    window.chartInstances[canvasId] = chart;
}