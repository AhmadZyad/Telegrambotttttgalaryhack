javascript
const axios = require('axios');
const { connectDB, Bot } = require('./db');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { token, domain } = req.body;
    try {
        const tgRes = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
        const botInfo = tgRes.data.result;

        const webhookUrl = `https://${domain}/api/webhook?token=${token}`;
        await axios.get(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);

        await connectDB();
        
        const newBot = await Bot.create({
            token: token,
            name: botInfo.first_name,
            username: botInfo.username,
            history: [] 
        });

        res.status(200).json({ success: true, bot: newBot });
    } catch (error) {
        res.status(400).json({ success: false, error: 'التوكن غير صحيح أو مضاف مسبقاً' });
    }
}
