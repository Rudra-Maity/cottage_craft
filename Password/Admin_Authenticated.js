const Admin_auth=require('./jwt_auth')
require('dotenv/config')
const myEnv=process.env.API_URL
function isAuthenticated(req, res, next) {
    try{
        const jwt=Admin_auth.jwtDecode(req.session.admin_id)
    return jwt
}catch(err){
  return false
}
  }

  module.exports=isAuthenticated