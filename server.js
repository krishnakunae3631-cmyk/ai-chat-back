import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// Render gives this automatically
const PORT = process.env.PORT;

// Google AI Studio API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(req.body.message);
    const reply = result.response.text();
    res.json({ reply });
  } catch (err) {
    res.json({ reply: "Gemini error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
