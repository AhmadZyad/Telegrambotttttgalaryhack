javascript
const { connectDB, Bot } = require('./db');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const token = req.query.token; 
    const update = req.body;

    if (update.message) {
        const chatId = update.message.chat.id.toString();
        const messageId = update.message.message_id;
        
        const text = update.message.text || update.message.caption || '';
        let mediaType = 'text';
        let fileId = null;
        if (update.message.photo) {
            mediaType = 'photo';
            fileId = update.message.photo[update.message.photo.length - 1].file_id;
        } else if (update.message.video) {
            mediaType = 'video';
            fileId = update.message.video.file_id;
        }

        if (text || fileId) {
            try {
                await connectDB();
                await Bot.findOneAndUpdate(
                    { token: token },
                    { $push: { history: { chatId, text, messageId, type: 'user', mediaType, fileId } } }
                );
            } catch (error) {
                console.error("خطأ في قاعدة البيانات:", error);
            }
        }
    }

    res.status(200).send('OK');
}
