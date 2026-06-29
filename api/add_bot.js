const axios = require('axios');
const { connectDB, Bot } = require('./db');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    
    const body = JSON.parse(event.body);
    const { token, domain } = body;
    
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

        return { statusCode: 200, body: JSON.stringify({ success: true, bot: newBot }) };
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ success: false, error: 'التوكن غير صحيح أو مضاف مسبقاً' }) };
    }
}
