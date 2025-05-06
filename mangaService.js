const axios = require('axios');
const cheerio = require('cheerio');

async function searchManga(query) {
  const { data } = await axios.get(`https://lekmanga.net/?s=${encodeURIComponent(query)}&post_type=wp-manga`);
  const $ = cheerio.load(data);
  const results = [];
  $('.post-title a').each((_, el) => {
    results.push({ title: $(el).text().trim(), url: $(el).attr('href') });
  });
  return results;
}

async function getMangaDetails(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return {
    title: $('.post-title h1').text().trim(),
    summary: $('.summary__content').text().trim(),
    image: $('.summary_image img').attr('src'),
    chapters: $('.wp-manga-chapter > a').slice(0, 7).map((_, el) => {
      return {
        title: $(el).text().trim(),
        url: $(el).attr('href')
      };
    }).get()
  };
}

async function getChapterImages(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $('.reading-content img').map((_, el) => $(el).attr('src')).get();
}

module.exports = { searchManga, getMangaDetails, getChapterImages };