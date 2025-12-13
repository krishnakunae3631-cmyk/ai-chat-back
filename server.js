import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

app.get("/", (req, res) => {
  res.send("Backend OK");
});

app.post("/chat", async (req, res) => {
  try {
    const hfRes = await fetch(
      `https://router.huggingface.co/hf-inference/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: req.body.message
        })
      }
    );

    const rawText = await hfRes.text();

    // ALWAYS respond, never crash
    let reply = "Model is loading. Try again in 10 seconds.";

    try {
      const json = JSON.parse(rawText);
      if (Array.isArray(json) && json[0]?.generated_text) {
        reply = json[0].generated_text;
      } else if (json?.error) {
        reply = json.error;
      }
    } catch {
      // HF sometimes sends plain text
      reply = rawText.slice(0, 500);
    }

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Backend reachable, model warming up. Retry." });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
