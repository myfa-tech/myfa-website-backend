import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token);

const postNewRequestMessage = async (request, options = {}) => {
  try {
    await web.chat.postMessage({
      text: `${options.test ? '[TEST] ' : ''}Nouvelle demande 🎉\nRDV sur le dashboard pour plus de détails 😉`,
      channel: 'requests',
    });
  } catch(e) {
    console.log(e);
  }
};

export { postNewRequestMessage };
