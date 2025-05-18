const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API to save historia content
app.post('/api/save-historia', (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ success: false, error: 'No HTML provided' });
  }

  const wrappedHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Historia del Mes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: sans-serif;
      padding: 2rem;
      background: #fafafa;
      color: #333;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  const filePath = path.join(__dirname, 'public', 'historia_del_mes.html');

  fs.writeFile(filePath, wrappedHtml, (err) => {
    if (err) {
      console.error('❌ Error writing HTML file:', err);
      return res.status(500).json({ success: false, error: 'Failed to save HTML' });
    }

    console.log('✅ Historia guardada correctamente');
    res.json({ success: true });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌍 Server running at http://localhost:${PORT}`);
});
