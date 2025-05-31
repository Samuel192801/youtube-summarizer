const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.static('../public'));

// Simulação de rota pra resumo
app.post('/api/summarize', express.json(), async (req, res) => {
  const summary = `
📌 Resumo de "${req.body.text.slice(0, 50)}..."
🔹 ${req.body.text}
  `.trim();

  res.json({ summary });
});

module.exports = { app, server };
