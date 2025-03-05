import fetch from 'node-fetch';

const GEMINI_API_URL = 'https://api.gemini.ai/feedback'; // Replace with the actual GEMINI AI API URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store your API key in an environment variable

export async function getGeminiFeedback(userId: string) {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch feedback from GEMINI AI');
  }

  const data = await response.json();
  return data;
}