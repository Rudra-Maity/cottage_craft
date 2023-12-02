const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const encryption= function(email){
let encryptdEmail = cryptr.encrypt(email);
console.log(encryptdEmail)
return encryptdEmail
}

const decryption=function(encrypt){
    console.log(cryptr.decrypt(encrypt))
    return cryptr.decrypt(encrypt)
}

module.exports={encryption,decryption}