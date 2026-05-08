require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const config = require('./config');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
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
Produkte: ${config.produkte}
Versand: ${config.versand}
Rückgabe: ${config.rueckgabe}
Support Email: ${config.email}
Antworte immer auf ${config.sprache}.`
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