import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use("/", express.static("public"));

// Parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint para generar audio
app.post('/api/speak', async (req, res) => {
  const { text, speaker } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Debes mandar un texto" });
  }

  try {
    // Generar el audio con OpenAI TTS
    const completion = await openai.audio.speech.create({
      model: "tts-1",
      voice: speaker,
      input: text
    });

    // Convertir a buffer
    const audioBuffer = Buffer.from(await completion.arrayBuffer());

    // Devolver el audio directamente
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);

  } catch (error) {
    console.error("Error al generar el audio:", error);
    return res.status(500).json({ error: "Error al generar el audio" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT} 🚀`);
});
