javascript
const axios = require('axios');
const { connectDB, Bot } = require('./db');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { token, chatId, text } = req.body;
    try {
        const tgRes = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId, text: text
        });
        
        const messageId = tgRes.data.result.message_id;

        await connectDB();
      await Bot.findOneAndUpdate(
            { token: token },
            { $push: { history: { chatId, text, messageId, type: 'bot' } } }
        );

        res.status(200).json({ success: true, messageId });
    } catch (error) {
        res.status(400).json({ success: false, error: error.response?.data?.description || 'خطأ' });
    }
}
