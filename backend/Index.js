```js
const express = require('express');
const cors = require('cors');
const { summarizeRouter } = require('./summarize');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', summarizeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧠 Sumarizador rodando em http://localhost:${PORT}`));
