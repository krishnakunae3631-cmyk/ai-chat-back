import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT: Render provides this
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("✅ Gemini Backend Running");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ reply: data.candidates[0].content.parts[0].text });
    } else if (data.error) {
      res.json({ reply: "Gemini Error: " + data.error.message });
    } else {
      res.json({ reply: "❌ No response from Gemini" });
    }

  } catch (error) {
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Backend running on Render port", PORT);
});
