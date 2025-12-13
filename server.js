app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: req.body.message }]
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

  } catch (err) {
    res.status(500).json({ reply: "Server error" });
  }
});
