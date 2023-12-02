const jwt = require('jsonwebtoken');
function jwtSign(userid,expTime){
const token = jwt.sign({ userId: userid }, process.env.auth_secrete, { expiresIn: expTime });
return token
}
function jwtDecode(givetoken){
const decoded = jwt.verify(givetoken, process.env.auth_secrete);
return decoded
}
module.exports={jwtSign,jwtDecode}