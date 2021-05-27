const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;


const Brand =Schema({
    name:{type:String,required:true},
    label:{type:String},
    category:[{type:Schema.Types.ObjectId, ref : 'Category'}],
    image:{type:String,required:true}
})

Brand.plugin(mongoosePaginate);
module.exports=mongoose.model('Brand',Brand)