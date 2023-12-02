const user_auth=require('./jwt_auth')
const user=require('../MySchema/User');
const bcrypt = require("bcryptjs");
const UserSignIn=async function(req,res){
    const passwordEnteredByUser = req.body.upass
  const doc=await user.findOne({umail:req.body.uid})
  if(doc!=null){
    // console.log(doc)
    const hash=doc.upass
    bcrypt.compare(passwordEnteredByUser, hash, function(error, isMatch) {
        if (error) {
          throw error
        } else if (!isMatch) {
          res.redirect(`/api/v1/user/signIn`)
        } else {
        let ad=  user_auth.jwtSign(req.body.uid,'1y')
        console.log('ad',ad)
        const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
        res.cookie('jwt', ad, { maxAge: oneYearInMilliseconds, httpOnly: true });
        console.log(req.cookies.jwt)
        
         res.redirect(req.session.prev || '/')
         delete req.session.prev
         console.log('prev : ',req.session.prev)
        }
        })
  }
  else{res.redirect(`/api/v1/user/signIn`)}
}

module.exports=UserSignIn