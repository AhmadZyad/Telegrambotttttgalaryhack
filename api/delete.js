javascript
const axios = require('axios');
const { connectDB, Bot } = require('./db');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { token, chatId, messageId } = req.body;
    try {
        await axios.post(`https://api.telegram.org/bot${token}/deleteMessage`, {
            chat_id: chatId, message_id: messageId
        });

        await connectDB();
        await Bot.findOneAndUpdate(
            { token: token },
            { $pull: { history: { messageId: messageId } } }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: 'لا يمكن حذف الرسالة' });
    }
}
