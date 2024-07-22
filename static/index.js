document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('file-upload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            const firstSixRows = csv.split('\n').slice(0, 6).join('\n');
            const data = parseCSV(firstSixRows);
            displayData(data);

            const recommendations = analyzeData(data);
            displayRecommendations(recommendations);
        };
        reader.readAsText(file);
    });

    document.getElementById('file-create').addEventListener('click', createTable);
    document.getElementById("addRowBtn").addEventListener("click", addRow);
    document.getElementById("addColBtn").addEventListener("click", addColumn);
    document.getElementById("submitBtn").addEventListener("click", submitTableData);

    function createTable() {
        var dataTable = document.getElementById("data-table");
        dataTable.innerHTML = '';

        var table = document.createElement("table");
        var tbody = document.createElement("tbody");

        var headerRow = document.createElement("tr");
        var headerCell = document.createElement("th");
        headerCell.innerHTML = '<input type="text" class="header-input" placeholder="Column name1">';
        headerRow.appendChild(headerCell);
        tbody.appendChild(headerRow);

        var dataRow = document.createElement("tr");
        var dataCell = document.createElement("td");
        dataCell.innerHTML = '<input type="text" class="data-input" placeholder="Enter data">';
        dataRow.appendChild(dataCell);
        tbody.appendChild(dataRow);

        table.appendChild(tbody);
        dataTable.appendChild(table);

        document.getElementById("Btns").style.display = "block";

    };

    function addRow() {
        var table = document.querySelector("table");
        var rowCount = table.rows.length;
        var columnCount = table.rows[0].cells.length;

        var newRow = table.insertRow(rowCount);
        for (var i = 0; i < columnCount; i++) {
            var cell = newRow.insertCell(i);
            var input = document.createElement("input");
            input.type = "text";
            input.className = "data-input";
            input.placeholder = "Enter data";
            cell.appendChild(input);
        }
    }

    function addColumn() {
        var table = document.querySelector("table");
        var rowCount = table.rows.length;
        var columnCount = table.rows[0].cells.length;

        for (var i = 0; i < rowCount; i++) {
            var cell = table.rows[i].insertCell(columnCount);
            if (i === 0) {
                var input = document.createElement("input");
                input.type = "text";
                input.className = "header-input";
                input.placeholder = "Column name" + (columnCount + 1);
                cell.appendChild(input);
            } else {
                var input = document.createElement("input");
                input.type = "text";
                input.className = "data-input";
                input.placeholder = "Enter data";
                cell.appendChild(input);
            }
        }
    }

    function submitTableData() {
        // check if any missing
        var allInputs = document.querySelectorAll("#data-table .data-input");
        for (var i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value.trim() === "") {
                alert("Please fill all the blanks!");
                return;
            }
        }

        var dataTable = document.getElementById("data-table");
        var table = dataTable.querySelector("table");
        var rows = table.rows;
        var numRows = rows.length;
        var numColumns = rows[0].cells.length;

        // create csvData
        var csvData = "";

        var columnNames = [];
        var headerInputs = document.querySelectorAll("#data-table .header-input");
        for (var i = 0; i < headerInputs.length; i++) {
            columnNames.push(headerInputs[i].value.trim());
        }
        csvData += "," + columnNames.join(",") + "\n";

        // add csvData
        for (var i = 1; i < numRows; i++) {
            var rowData = [];
            rowData.push(i - 1); // add index
            for (var j = 0; j < numColumns; j++) {
                var cellContent = document.querySelectorAll("#data-table table tbody tr")[i].querySelectorAll("td input")[j].value.trim();
                rowData.push(cellContent);
            }
            csvData += rowData.join(",") + "\n";
        }
        data = parseCSV(csvData)
        displayData(data);
        const recommendations = analyzeData(data);
        displayRecommendations(recommendations);
    }

    function parseCSV(csvString) {
        const rows = csvString.split('\n');
        const result = [];

        for (const row of rows) {
            let insideQuotes = false;
            let value = '';
            const values = [];

            for (let i = 0; i < row.length; i++) {
                const char = row[i];

                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(value.trim());
                    value = '';
                } else {
                    value += char;
                }
            }

            values.push(value.trim());
            result.push(values);
        }

        return result;
    }


    function displayData(data) {
        const previewTitle = document.createElement('h2');
        previewTitle.innerHTML = 'Preview:';

        const table = document.createElement('table');

        for (const row of data.slice(0, 6)) {
            const tr = document.createElement('tr');
            for (const cell of row) {
                const td = document.createElement('td');
                td.textContent = cell.trim();
                td.style.border = '1px solid #dddddd';
                td.style.textAlign = 'left';
                td.style.padding = '8px';
                td.style.backgroundColor = '#f2f2f2';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        const csvDataDiv = document.getElementById('csv-data');
        csvDataDiv.innerHTML = '';
        csvDataDiv.appendChild(previewTitle);
        csvDataDiv.appendChild(table);
    }

    function analyzeData(data) {
        const colNames = data[0].map(col => col.toLowerCase().trim());

        const articleName = ["article", "commodit", "good", "merchandise"];
        const salesName = ["sale", "quantity", "volume"];
        const storeName = ["store", "shop", "chain", "warehouse", "market"];
        const priceName = ["price", "cost", "rate", "value"];

        const recommendations = [];

        for (const name of articleName) {
            if (colNames.some(col => col.includes(name))) {
                recommendations.push("Data contains information about article, try association rule!");
                break;
            }
        }

        for (const name of salesName) {
            if (colNames.some(col => col.includes(name))) {
                recommendations.push("Data contains information about sales quantity, try sales prediction!");
                break;
            }
        }

        for (const name of storeName) {
            if (colNames.some(col => col.includes(name))) {
                recommendations.push("Data contains information about stores, try store clustering and classification!");
                break;
            }
        }

        for (const name of priceName) {
            if (colNames.some(col => col.includes(name))) {
                recommendations.push("Data contains information about price, try price prediction and simulation!");
                break;
            }
        }

        if (recommendations.length === 0) {
            recommendations.push("Currently no appropriate suggestions for your data.");
        }

        return recommendations;
    }

    function displayRecommendations(recommendations) {
        const recommendationsTitle = document.createElement('h2');
        recommendationsTitle.innerHTML = 'Suggested Simulation:';

        const recommendationsDiv = document.createElement('div');
        recommendationsDiv.innerHTML = recommendations.join('<br>');

        const recommendationDiv = document.getElementById('recommendation');
        recommendationDiv.innerHTML = '';
        recommendationDiv.appendChild(recommendationsTitle);
        recommendationDiv.appendChild(recommendationsDiv);
    }


    var topText = document.getElementById("top_article");
    if (topText.textContent.includes("10")) {
        document.getElementById("asso_10").style.display = "block";
        document.getElementById("clust_10").style.display = "block";
        document.getElementById("class_10").style.display = "block";
    } else {
        document.getElementById("asso_20").style.display = "block";
        document.getElementById("clust_20").style.display = "block";
        document.getElementById("class_20").style.display = "block";
    }

});

function changeTop() {
    var textElem = document.getElementById("top_article");
    if (textElem.textContent.includes("10")) {
        textElem.textContent = "5. Select top 20 articles";
        document.getElementById("asso_10").style.display = "none";
        document.getElementById("asso_20").style.display = "block";
        document.getElementById("class_10").style.display = "none";
        document.getElementById("class_20").style.display = "block";
        document.getElementById("clust_10").style.display = "none";
        document.getElementById("clust_20").style.display = "block";
    } else {
        textElem.textContent = "5. Select top 10 articles";
        document.getElementById("asso_20").style.display = "none";
        document.getElementById("asso_10").style.display = "block";
        document.getElementById("class_20").style.display = "none";
        document.getElementById("class_10").style.display = "block";
        document.getElementById("clust_20").style.display = "none";
        document.getElementById("clust_10").style.display = "block";
    }
}

function show(num) {
    // hide all
    const details = document.querySelectorAll('.detail');
    details.forEach(item => {
        item.style.display = 'none';
    });
    // show the clicked one

    const selectedDetail = document.getElementById(num);
    selectedDetail.style.display = 'block';
    const arrow = document.querySelector('.arrow_2');
    arrow.style.display = 'block';
    if (num == "detail5")
        num = "detail1";
    document.body.style.backgroundImage = `url(static/images/${num}.jpg)`;

}

function lossConfirm() {
    const base_revenue = 13221.89166666667
    const base_units = 37776.83333333334
    var input = document.getElementById("lossInput");
    var loss = input.value / 100.0;
    const price_interval = []
    for (let i = 18; i < 53; i++) {
        const x = i / 100.0;
        const units_change = (x - 0.35) / 0.35 * (-0.667203)
        const units = base_units * (1 + units_change)
        const revenue = units * x
        if (revenue >= (base_revenue * (1 - loss))) {
            price_interval.push(x);
        }
    }
    const leftValue = price_interval[0];
    const rightValue = price_interval[price_interval.length - 1];
    const intervalDisplay = document.getElementById("interval");
    intervalDisplay.textContent = 'price range: [' + leftValue + ', ' + rightValue + ']';
}