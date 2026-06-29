javascript
const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    name: String,
    username: String,
    history: [{
        chatId: String,
        text: String,
        messageId: Number,
        type: String, // 'user' او 'bot'
        mediaType: { type: String, default: 'text' }, // 'text', 'photo', 'video'
        fileId: String, 
        date: { type: Date, default: Date.now }
    }]
});

const Bot = mongoose.models.Bot || mongoose.model('Bot', botSchema);

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI); 
}

module.exports = { connectDB, Bot };

        
