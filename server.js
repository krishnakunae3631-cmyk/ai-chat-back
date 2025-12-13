import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("✅ Gemini Backend Running");
});

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: req.body.message }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini raw:", JSON.stringify(data, null, 2));

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ reply: data.candidates[0].content.parts[0].text });
    } else if (data.error) {
      res.json({ reply: "Gemini Error: " + data.error.message });
    } else {
      res.json({ reply: "❌ Empty response from Gemini" });
    }

  } catch (err) {
    res.status(500).json({ reply: "Server crashed" });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Backend running on port", PORT);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

