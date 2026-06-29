javascript
const axios = require('axios');

module.exports = async function handler(req, res) {
    const { token, fileId } = req.query;
    if(!token || !fileId) return res.status(400).send('Missing params');
    
    try {
        const tgRes = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        const filePath = tgRes.data.result.file_path;
        
        const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
        
        res.redirect(fileUrl);
    } catch (e) {
        res.status(404).send('لا يمكن تحميل الملف من سيرفر تليجرام');
    }
}
