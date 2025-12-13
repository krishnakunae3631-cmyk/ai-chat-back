import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Render provides the port automatically
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(
      // 🔴 IMPORTANT: v1 (NOT v1beta) + gemini-1.5-flash
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: req.body.message }] }]
        })
      }
    );

    const data = await response.json();

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

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
