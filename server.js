import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("OpenRouter backend running");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          
          messages: [
            {
              role: "system",
              content:
                "You are a chatbot named 'Ram'. Always give SHORT, clear answers (1–2 lines). Always answer questions directly. If asked your name, say: My name is Ram."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.3,
          max_tokens: 60
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Hello! How can I help you?";

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
