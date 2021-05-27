const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const User = Schema({
    phone : { type : String, required : true},
    password : { type : String, required : true},
    level : { type : Boolean, default : false}
}, {
    timestamps : true
})


User.statics.CreateToken = async (id, secretId, exp) => {
    return await jwt.sign({id}, secretId, { expiresIn : exp})
}

User.statics.CheckToken = async (req, secretId) => {
    const token = req.headers['token'];
  //  console.log(token)
    if(token) {
        return await jwt.verify(token, secretId);
    } else {
        return null
    }
}


module.exports = mongoose.model('User', User)