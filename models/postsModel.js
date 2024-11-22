const { ref } = require('joi');
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'title required'],
        trim:true,
    },
    description:{
        type: String,
        required: [true, 'title required'],
        trim:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    }
},{
    Timestamp:true,
});

module.exports = mongoose.model('Post', postSchema);