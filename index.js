require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static('public'));

// Gedächtnis — speichert den Gesprächsverlauf
const conversations = {};

app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  // Neues Gespräch starten falls noch keins existiert
  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }

  // Neue Nachricht zum Verlauf hinzufügen
  conversations[sessionId].push({
    role: 'user',
    content: message
  });

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `Du bist ein freundlicher Support-Agent für SportWelt GmbH.
Produkte: Laufschuhe, Sportkleidung
Versand: 2–4 Werktage, kostenlos ab 50€
Rückgabe: 30 Tage kostenlos
Antworte kurz und freundlich auf Deutsch.`
      },
      ...conversations[sessionId]
    ]
  });

  const reply = response.choices[0].message.content;

  // Antwort auch zum Verlauf hinzufügen
  conversations[sessionId].push({
    role: 'assistant',
    content: reply
  });

  res.json({ reply });
});

app.listen(3000, () => {
  console.log('Agent läuft auf http://localhost:3000');
});