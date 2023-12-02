const express = require('express')
const products=require('../MySchema/products')
const router=express.Router();

router.get('/search/:page', async (req, res) => {
  const page = parseInt(req.params.page);
  const perPage = 6;
    const  query  = req.query.q;
    console.log(query);
  
  try {
    
    const myQurey={
        $or: [
          { name: { $regex: new RegExp(query, 'i') } },
          { discription: { $regex: new RegExp(query, 'i') } },
          { brand: { $regex: new RegExp(query, 'i') } },
          { category: { $regex: new RegExp(query, 'i') } },
        ],
      
    }
    const count=await products.countDocuments(myQurey)
    const items = await products.find(myQurey)
    .skip((page - 1) * perPage)
      .limit(perPage);

      
    const pageLength=Math.ceil(count/perPage)
    console.log("perpage: ",pageLength);
  
    res.render('Search',{items,pageLength,query,page})
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
  
  });

  module.exports=router