  
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: Number,
    post : String,
    upVotes: Number,
    downVotes: Number
}, {timestamps: true});

const Posts = mongoose.model('Posts', PostSchema);

module.exports = Posts;