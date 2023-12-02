const User=require('../MySchema/User')

async function DeleteCart(userId,cartItemId){
    try{
        const isDeleted=await User.findOneAndUpdate({umail:userId},{ $pull: { cart: cartItemId }})
        return isDeleted
    }
    catch(err){
        console.log(err);
        return false
    }
}


module.exports=DeleteCart