const { searchManga, getMangaDetails, getChapterImages } = require('./mangaService');
const { sendTextMessage, sendImageMessage, sendQuickReplies } = require('./sendMessage');

let userState = {};

async function handleMessage(event) {
  const senderId = event.sender.id;
  const message = event.message.text?.trim().toLowerCase();

  if (message === 'list') {
    userState[senderId] = null;
    return sendTextMessage(senderId, 'مرحبًا! أرسل اسم مانجا للبحث.');
  }

  if (userState[senderId]?.chapterUrl) {
    const images = await getChapterImages(userState[senderId].chapterUrl);
    for (const img of images) {
      await sendImageMessage(senderId, img);
    }
    return;
  }

  if (userState[senderId]?.mangaUrl) {
    if (!isNaN(Number(message))) {
      const chapterUrl = `${userState[senderId].mangaUrl}${message}/`;
      userState[senderId].chapterUrl = chapterUrl;
      return handleMessage(event);
    }
  }

  const results = await searchManga(message);
  if (results.length === 0) return sendTextMessage(senderId, 'لم يتم العثور على نتائج.');

  const quickReplies = results.slice(0, 10).map(r => ({
    content_type: 'text',
    title: r.title.slice(0, 20),
    payload: r.url
  }));
  userState[senderId] = {};
  return sendQuickReplies(senderId, 'اختر مانجا:', quickReplies);
}

module.exports = { handleMessage };