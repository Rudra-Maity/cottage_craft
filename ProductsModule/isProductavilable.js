const products=require('../MySchema/products')

const isProductAvilabel=async function(pid){
    try{
    const result=await products.findOne({pid:pid})
    console.log("res",result);
    if(result) return result
    else return undefined
    }catch(err){
        return false
    }
}

module.exports=isProductAvilabel