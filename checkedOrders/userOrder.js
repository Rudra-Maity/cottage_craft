
const Orders=require('../MySchema/orders');


async function viewOrders(userId,oid){
    let query;
    if(oid) query={'userinfo.email':userId,oid:oid};
    else query={'userinfo.email':userId}
  
    // console.log(query);
    const docs=await Orders.find(query)
   
    console.log(docs);
    return docs
}

async function cancelOrder(userId,oid){
    try{
    const cancel=await Orders.findOneAndUpdate({'userinfo.email':userId,oid:oid},{$set:{'deleivery.delstatus':'canceled'}})
     return cancel
    }catch(err){
        return false
    }

}

module.exports={viewOrders,cancelOrder}