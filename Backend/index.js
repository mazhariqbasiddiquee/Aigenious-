const express = require('express');
const app = express();
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

app.use(express.json());
app.use(cors());

require('dotenv').config();

let isInterviewing = false;

app.post('/generate-text', async (req, res) => {
  const userMessage = req.body.prompt; // User's message from request body

  try {
    if (!isInterviewing) {
      // Start the interview
      isInterviewing = true;
      const response = await startInterview(userMessage);
      console.log(response)
      res.json({ text: response });
    } else {
      // Continue the interview
      const response = await continueInterview(userMessage);
      console.log(response)
      res.json({ text: response });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function startInterview(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are the interviewer. You can ask questions.' },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 2000, // Adjust as needed
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function continueInterview(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: userMessage },
        ],
        max_tokens: 2000, // Adjust as needed
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
