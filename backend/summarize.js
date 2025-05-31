const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Armazenamento temporário
const cache = {};

// Extrair ID do vídeo do YouTube
function extractVideoID(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Baixar áudio do YouTube
async function downloadAudio(videoId) {
  const output = path.resolve(__dirname, `../temp/audio_${videoId}.mp3`);
  const command = `yt-dlp -x --audio-format mp3 -o "${output}" "https://www.youtube.com/watch?v=${videoId}"`;

  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true });
    child.on('exit', (code) => {
      if (code !== 0) return reject(new Error("Erro ao baixar áudio"));
      resolve(output);
    });
  });
}

// Simula transcrição (depois pode ser substituída por Whisper.cpp)
async function simulateTranscription(audioPath) {
  // Simulação — depois será real
  return `
    O vídeo fala sobre inteligência artificial, ética e futuro do trabalho.
    Ele mostra como a automação afeta diferentes áreas profissionais.
    Também discute os riscos e oportunidades da tecnologia atual.
  `;
}

// Resumo com IA local (depois pode ser substituído por Llama 3)
async function generateSummary(text) {
  return [
    "📌 Introdução: O vídeo aborda o impacto da IA na sociedade.",
    "🔹 Tópico 1: Automação e mercado de trabalho",
    "🔹 Tópico 2: Riscos e benefícios da IA",
    "🔹 Tópico 3: Como se preparar para o futuro",
    "🏁 Conclusão: A IA está mudando rápido e precisamos entender."
  ];
}

// Rota principal
router.post('/summarize', async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const videoId = extractVideoID(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'URL do YouTube inválida' });
    }

    // Verifica cache
    if (cache[videoId]) {
      return res.json(cache[videoId]);
    }

    // Passo 1: Baixa o áudio
    const audioPath = await downloadAudio(videoId);

    // Passo 2: Simula transcrição
    const transcription = await simulateTranscription(audioPath);

    // Passo 3: Gera sumário
    const summary = await generateSummary(transcription);

    // Salva no cache
    cache[videoId] = { videoId, summary };
    res.json(cache[videoId]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { summarizeRouter: router };
