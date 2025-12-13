import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

// Free, reliable HF model
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

app.get("/", (req, res) => {
  res.send("HF backend running");
});

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: req.body.message,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();

    let reply = "Model is loading, please try again in 10 seconds";

    if (Array.isArray(data) && data[0]) {
      reply =
        data[0].generated_text ||
        data[0].output_text ||
        reply;
    } else if (data.error) {
      reply = data.error;
    }

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("🚀 HF backend running on port", PORT);
});
