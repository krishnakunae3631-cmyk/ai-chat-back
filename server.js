import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("✅ Gemini Backend Running");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await geminiRes.json();

    let reply = "❌ No response from Gemini";

    if (
      data.candidates &&
      data.candidates.length &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length
    ) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      reply = "Gemini Error: " + data.error.message;
    }

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
