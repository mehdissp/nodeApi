const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { schema } = require('./multimedia');
const Schema = mongoose.Schema;


const Category=Schema({
name :{type:String ,required:true},
label:{type:String },
parent :{type:Schema.Types.ObjectId,ref :'Category',required:true},
image:{type:Schema.Types.ObjectId,ref :'Multimedia',required:true}

})

Category.plugin(mongoosePaginate);
module.exports=mongoose.model('Category',Category)