function renderChart(canvasId, labels, data, label) {

    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {

        type: 'line',

        data: {
            labels,
            datasets: [{
                label,
                data,
                borderColor: '#6c63ff'
            }]
        }
    });
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
            backgroundColor: colors[colorIdx % colors.length] + '20'
        });
        colorIdx++;
    }

    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: title } }
        }
    });
}