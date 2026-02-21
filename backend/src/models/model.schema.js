const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

const postModel = mongoose.model("Post", postSchema);
module.exports=postModel;