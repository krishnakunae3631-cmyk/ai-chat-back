import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

// ✅ Hugging Face free model
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
          inputs: req.body.message
        })
      }
    );

    const data = await response.json();

    // HF response format
    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "No response from model";

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("🚀 HF backend running on port", PORT);
});
