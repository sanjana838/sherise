require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENROUTER_API_KEY="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";

app.use(express.json());
app.use(express.static(".")); // serves index.html

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.json({ reply: "⚠️ Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`🌸 SheRise server running at http://localhost:${PORT}`);
});
