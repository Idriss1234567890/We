const axios = require('axios');

const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function sendTextMessage(id, text) {
  return axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_TOKEN}`, {
    recipient: { id },
    message: { text }
  });
}

function sendImageMessage(id, url) {
  return axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_TOKEN}`, {
    recipient: { id },
    message: {
      attachment: {
        type: 'image',
        payload: { url }
      }
    }
  });
}

function sendQuickReplies(id, text, replies) {
  return axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_TOKEN}`, {
    recipient: { id },
    message: {
      text,
      quick_replies: replies
    }
  });
}

module.exports = { sendTextMessage, sendImageMessage, sendQuickReplies };