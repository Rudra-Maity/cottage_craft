const user_auth=require('./jwt_auth')
require('dotenv/config')
const myEnv=process.env.API_URL
module.exports=function(req, res, next) {
    try{
        const jwt=user_auth.jwtDecode(req.cookies.jwt)
        return true
}catch(err){
    res.redirect(`${myEnv}/user/signIn`)
}
  }