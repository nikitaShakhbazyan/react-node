const express = require("express");
const fs = require("fs");
const router = express.Router();
const upload = require("../middlewares/upload");
const { transcribeAudio, translateText } = require("../services/openAiService");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const transcript = await transcribeAudio(filePath);
    const translation = await translateText(transcript);

    fs.unlinkSync(filePath);

    res.json({ transcript, translation });
  } catch (err) {
    console.error(err);
    if (err.code === "insufficient_quota" || err.status === 429) {
      res.status(429).json({ error: "OpenAI quota exceeded." });
    } else {
      res.status(500).json({ error: "Error during transcription or translation" });
    }
  }
});

module.exports = router;
