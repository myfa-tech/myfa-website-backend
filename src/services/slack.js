import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token);

const postNewRequestMessage = async (request, options) => {
  try {
    await web.chat.postMessage({
      text: 'Hello world!',
      channel: 'C01FE7SH9ED',
    });
  } catch(e) {
    console.log(e);
  }
};

export { postNewRequestMessage };
