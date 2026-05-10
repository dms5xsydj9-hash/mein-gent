const cors = require('cors');
const express = require('express');
const Groq = require('groq-sdk');
const config = require('./config');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', 'frame-ancestors *');
  next();
});
app.use(express.static('public'));

const conversations = {};

app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }

  conversations[sessionId].push({
    role: 'user',
    content: message
  });

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `Du bist ein freundlicher Support-Agent für ${config.name}.
Telefon: ${config.telefon}
Email: ${config.email}
Öffnungszeiten: ${config.oeffnungszeiten}
Versand: ${config.versand}
Zahlung: ${config.zahlung}
Online Bestellen: ${config.bestellung_url}

SPEISEKARTE:
${config.menue}

Antworte immer auf ${config.sprache}. Maximal 2-3 Sätze. Wenn jemand nach einem Preis fragt, nenn den genauen Preis aus der Speisekarte.`
      },
      ...conversations[sessionId]
    ]
  });

  const reply = response.choices[0].message.content;

  conversations[sessionId].push({
    role: 'assistant',
    content: reply
  });

  res.json({ reply });
});
app.get('/config', (req, res) => {
  res.json({ name: config.name });
});
app.listen(3000, () => {
  console.log(`Agent für ${config.name} läuft auf http://localhost:3000`);
});