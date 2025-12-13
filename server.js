import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/chat", async (req, res) => {
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: req.body.message }] }
          ]
        })
      }
    );

    const data = await r.json();

    res.json({
      reply:
        data?.candidates?.[0]?.content?.parts?.[0]?.text
        || data?.error?.message
        || "No response"
    });

  } catch (e) {
    res.json({ reply: "Server error" });
  }
});

app.listen(PORT);
