const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY
});

async function transcribeAudio(filePath) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
  });
  return transcription.text;
}

async function translateText(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a translator from English to Spanish." },
      { role: "user", content: text }
    ],
  });
  return response.choices[0].message.content;
}

module.exports = { transcribeAudio, translateText };
