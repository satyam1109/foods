const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name:String,
    category:String,
    imageurl:String,
    link:String,
    nutrition:{
        protein:Number,
        carbohydrates:Number,
        fats:Number,
        fibres:Number
    }
});

const foodModel = mongoose.model("foods",foodSchema);

module.exports = foodModel;