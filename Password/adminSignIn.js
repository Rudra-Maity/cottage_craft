const admin_auth=require('./jwt_auth')
const user=require('../MySchema/productManager');
const bcrypt = require("bcryptjs");
// const { use } = require('../routers/products');
// const hello=require('../hello')

const adminSignIn=async function(req,res){
  const passwordEnteredByUser = req.body.admin_pass
  const doc=await user.findOne({admin_id:req.body.admin_id})
  if(doc!=null){
    // console.log(doc)
    const hash=doc.admin_pass
    bcrypt.compare(passwordEnteredByUser, hash, function(error, isMatch) {
        if (error) {
          throw error
        } else if (!isMatch) {
          res.json({url:""})
        } else {
        let ad=  admin_auth.jwtSign(req.body.admin_id,'1d')
        console.log('ad',ad)
        req.session.admin_id=ad
        console.log(req.session.admin_id)
        const prevUrl=req.session.prev  || '/api/v1/admin'
         res.json({url:prevUrl})
         delete req.session.prev
        }
        })
  }
  else{res.json({url:""})}
}

module.exports=adminSignIn