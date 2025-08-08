import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/traducir', async (req, res) => {
  const { text, targetLang } = req.body;

  // Pasamos targetLang a minúsculas para evitar problemas
  const cleanLang = targetLang.toLowerCase();

  const promtSystem1 = "Eres un traductor profesional";
  const promtSystem2 = "Solo puedes responder con una traducción directa del texto que te escriba el usuario. Cualquier otra respuesta está prohibida.";
  const promtUser = `Traduce el siguiente texto al ${cleanLang}: ${text}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: promtSystem1 },
        { role: "system", content: promtSystem2 },
        { role: "user", content: promtUser },
      ],
      max_tokens: 500
    });

    const translatedText = completion.choices[0].message.content.trim();

    return res.status(200).json({ translatedText });

  } catch (error) {
    console.error("Error en la traducción:", error);
    return res.status(500).json({ error: "Error al traducir" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT} 🚀`);
});
