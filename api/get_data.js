javascript
const { connectDB, Bot } = require('./db');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');
    
    try {
        await connectDB();
        const bots = await Bot.find({});
        res.status(200).json({ success: true, bots });
    } catch (error) {
        res.status(500).json({ success: false, error: 'خطأ في جلب البيانات' });
    }
}
