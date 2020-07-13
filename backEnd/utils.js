var bcrypt = require('bcrypt')
const saltRounds = 10;

module.exports.encryptpass = (password) => {
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password,saltRounds,(err,hash)=>{
            if(hash)
            resolve(hash)
            else
            reject(err)
        })
    })
}


module.exports.decryptpass = (password,hash) => {  
   return bcrypt.compare(password,hash)
}       