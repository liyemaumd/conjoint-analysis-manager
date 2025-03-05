let attributes = [];

function addAttributeRow() {
    const table = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.innerHTML = `<td><input type="text" class="input-field"></td>
                     <td><input type="text" class="input-field"></td>`;
}

function proceedToAnalysis() {
    attributes = [];
    const rows = document.getElementById('attributesTable').getElementsByTagName('tbody')[0].rows;
    for (let row of rows) {
        const cells = row.getElementsByTagName('input');
        attributes.push({
            name: cells[0].value,
            levels: cells[1].value.split(',').map(l => l.trim())
        });
    }
    document.getElementById('analysisSection').style.display = 'block';
}

function processResults() {
    const file = document.getElementById('resultsFile').files[0];
    if (!file) {
        alert("Please upload results file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        displayResults(data);
        generateRecommendations(data);
    };
    reader.readAsText(file);
}

function displayResults(data) {
    let html = '<h3>Attribute Importance</h3><table>';
    html += '<thead><tr><th>Attribute</th><th>Importance (%)</th></tr></thead><tbody>';
    for (let item of data.importance) {
        html += `<tr><td>${item.attribute}</td><td>${item.value}</td></tr>`;
    }
    html += '</tbody></table>';
    document.getElementById('resultsDisplay').innerHTML = html;
}

function generateRecommendations(data) {
    const important = data.importance.filter(item => item.value > 20);
    const recommendations = [
        `Focus marketing on: ${important.map(a => a.attribute).join(', ')}`,
        "Recommended price point: $95",
        "Target segment: Urban professionals (25-45)",
        "Emphasize rewards in messaging."
    ];

    document.getElementById('recommendationsDisplay').innerHTML = recommendations.map(r => `<p>${r}</p>`).join('');
    document.getElementById('recommendationsSection').style.display = 'block';
}

function exportReport() {
    const text = document.getElementById('recommendationsDisplay').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Conjoint_Recommendations.txt';
    link.click();
}