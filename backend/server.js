const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
app.use(bodyParser.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/saveFinishedTask', (req, res) => {
    const { date, time, desc, finishedDesc } = req.body;

    const filePath = path.join(__dirname, 'tasks.xlsx');
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
    } else {
        workbook = XLSX.utils.book_new();
    }

    if (!workbook.Sheets[date]) {
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, date);
    }

    const worksheet = workbook.Sheets[date];
    const tasks = XLSX.utils.sheet_to_json(worksheet);
    tasks.push({ Time: time, Task: desc, Finished: finishedDesc });

    const updatedWorksheet = XLSX.utils.json_to_sheet(tasks);
    workbook.Sheets[date] = updatedWorksheet;

    XLSX.writeFile(workbook, filePath);
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
