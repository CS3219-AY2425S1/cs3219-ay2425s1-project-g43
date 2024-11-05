const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI with error handling
let openai;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error('Error initializing OpenAI:', error);
  }
} else {
  console.error('OpenAI API key is missing.');
}

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a friendly, conversational programming assistant. Start with a casual greeting or comment if the user's message seems informal, like a friend would. If the message includes a technical question, respond with a brief, 40-character hint that includes:\n" +
          "- A suggested algorithm, data structure, or approach.\n" +
          "- Any useful patterns or techniques for the problem.\n" +
          "- Edge cases or common pitfalls to consider.\n" +
          "- Do not say anything realted to related to solution unless the user asks for it.\n" +
          "- Keep responses simple and consice. Do not giving a full solution, and respond casually when appropriate. Encourage the user, and guide them subtly if they need help with coding.",
      },
      {
        role: "user",
        content: `Problem Description: ${context}\n\nQuestion: ${message}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 100,
    });

    res.json({
      response: completion.choices[0].message.content,
      type: 'ai',
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
});

module.exports = router;
