const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);
const ai = new GoogleGenAI();

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const update = req.body;
      
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const userText = update.message.text;

        if (userText.startsWith('/start')) {
          await bot.sendMessage(chatId, `হ্যালো! আমি NVT Energy-এর এআই অ্যাসিস্ট্যান্ট। আপনার যেকোনো প্রশ্ন করতে পারেন।`);
          return res.status(200).json({ status: 'ok' });
        }

        const systemInstruction = `
          আপনি NVT Energy ডিজিটাল প্ল্যাটফর্ম ও ওয়েবসাইটের কাস্টমার সাপোর্ট এআই বট।
          ব্যবহারকারীর যেকোনো প্রশ্নের উত্তর বাংলা ভাষায় খুব সাবলীল ও নির্ভুলভাবে দেবেন, যা আমাদের ওয়েবসাইটের সেবার সাথে সামঞ্জস্যপূর্ণ হয়।
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userText,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        const replyText = response.text || "দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না।";
        await bot.sendMessage(chatId, replyText);
      }

      return res.status(200).json({ status: 'ok' });
    }

    return res.status(200).send('NVT Energy Gemini Bot is running on Vercel!');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.toString() });
  }
};
