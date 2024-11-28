const XLSX = require("xlsx");
const fs = require("fs");

// Load the Excel file
const workbook = XLSX.readFile("final_merged_dashboard_data.xlsx");
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Define conditions for the groups
const groupConditions = {
  "Satisfied and On-Time": (customer) =>
    customer["NPS Score"] >= 7 && customer["Late_Payment"] === 0,
  "Dissatisfied and On-Time": (customer) =>
    customer["NPS Score"] < 7 && customer["Late_Payment"] === 0,
  "At Risk": (customer) =>
    customer["NPS Score"] < 7 &&
    customer["Late_Payment"] >= 1 &&
    customer["Late_Payment"] <= 2,
  "Critical Risk": (customer) =>
    customer["NPS Score"] <= 5 && customer["Late_Payment"] >= 3,
};

// Count customers in each group
const groupCounts = {};
Object.keys(groupConditions).forEach((group) => {
  groupCounts[group] = data.filter(groupConditions[group]).length;
});

// Save group counts to a JSON file
fs.writeFileSync("group_counts.json", JSON.stringify(groupCounts, null, 2));

// Log the results
console.log("Group counts:", groupCounts);

// Visualization: Generate an HTML file with Chart.js
const chartHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Group Analysis</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Customer Groups Based on Satisfaction and Late Payments</h1>
  <canvas id="groupChart" width="400" height="200"></canvas>
  <script>
    const ctx = document.getElementById('groupChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(Object.keys(groupCounts))},
        datasets: [{
          label: 'Number of Customers',
          data: ${JSON.stringify(Object.values(groupCounts))},
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  </script>
</body>
</html>
`;

// Save the HTML file
fs.writeFileSync("group_analysis.html", chartHTML);

console.log("Visualization saved as 'group_analysis.html'. Open this file in your browser.");
