const orders = require('../MySchema/orders');

async function  CheckedOrder(req,userId,view,page,perPage){
  try{
    const count=await orders.countDocuments({admin_id:userId,'deleivery.delstatus':view})
    .skip((page - 1) * perPage)
      .limit(perPage);
      
    const pageLength=Math.ceil(count/perPage)
  const doc=await orders.find({admin_id:userId,'deleivery.delstatus':view}) 
  return [doc,pageLength]
  }catch(er){
    return false
  }
}
module.exports={CheckedOrder}