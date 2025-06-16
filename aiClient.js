import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';
const API_KEY = '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'; // Twój token

export async function queryAI(prompt) {
  const res = await axios.post(API_URL, { inputs: prompt }, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  return res.data;
}
