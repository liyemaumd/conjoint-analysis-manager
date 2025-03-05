let attributes = [];

function addAttributeRow() {
    const table = document.getElementById('attributesTable');
    const row = table.insertRow();
    row.innerHTML = `<td><input type="text" placeholder="Attribute Name"></td>
                     <td><input type="text" placeholder="Level1, Level2, Level3"></td>`;
}

function proceedToAnalysis() {
    attributes = [];
    const rows = document.querySelectorAll('#attributesTable tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td input');
        attributes.push({
            name: cells[0].value,
            levels: cells[1].value.split(',').map(level => level.trim())
        });
    }
    document.getElementById('analysisSection').style.display = 'block';
}

function processResults() {
    const fileInput = document.getElementById('resultsFile');
    if (fileInput.files.length === 0) {
        alert("Please upload the results file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        displayResults(data);
        generateRecommendations(data);
    };
    reader.readAsText(fileInput.files[0]);
}

function displayResults(data) {
    let html = '<h3>Attribute Importance</h3><table><tr><th>Attribute</th><th>Importance (%)</th></tr>';
    data.importance.forEach(attr => {
        html += `<tr><td>${attr.attribute}</td><td>${attr.value}%</td></tr>`;
    });
    html += '</table>';
    document.getElementById('resultsDisplay').innerHTML = html;
}

function generateRecommendations(data) {
    const recommendations = [];
    const importantAttributes = data.importance.filter(attr => attr.value > 20);
    recommendations.push(`Focus marketing messages on: ${importantAttributes.map(a => a.attribute).join(', ')}`);
    recommendations.push('Recommended Price Point: $95 (based on similar analysis)');
    recommendations.push('Target Segment: Urban professionals aged 25-45');
    recommendations.push('Emphasize rewards in marketing messaging.');

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