const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        }
    },
    {timestamps:true}
);
// virtual field


module.exports = mongoose.model("product",productSchema);