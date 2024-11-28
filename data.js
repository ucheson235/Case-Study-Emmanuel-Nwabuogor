const XLSX = require("xlsx");
const fs = require("fs");

// Load the Excel file
const workbook = XLSX.readFile("final_merged_dashboard_data.xlsx");

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Convert to JSON and save
fs.writeFileSync("dashboard_data.json", JSON.stringify(sheetData, null, 2), "utf-8");

console.log("Excel data has been converted to JSON and saved as 'dashboard_data.json'.");

