const jwt_auth=require('../Password/jwt_auth')
const Product=require('../MySchema/products')
const RandomString=require('./productidGenrateor')
// const multer = require('multer');
function addproduct(myEnv,req,res){
    try{
        const admin_id=jwt_auth.jwtDecode(req.session.admin_id)
const images = req.files.map(file =>  ({
    data: file.buffer,
    contentType: file.mimetype,
    imgname:'img'+Date.now()
  }));
console.log('pid_'+RandomString);
const newProducts = new Product({
    pid:'pid_'+RandomString,
    admin_id:admin_id.userId,
    title: req.body.title,
    name: req.body.name,
    discription: req.body.discription,
    richdiscription: req.body.richdiscription,
    image: req.body.image,
    images:images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    // //custom requierd data 
    instock: req.body.instock,
    rating: req.body.rating,
    isfeatured: req.body.isfeatured,
    datecreated: req.body.datecreated,
    deltime: req.body.time,
    numreview: req.body.numreview,
    weight:req.body.weight,
    height:req.body.height,
    width:req.body.width,
})

newProducts.save()
    .then((result) => {
        res.status(200).send(`<script>
        window.location.replace('/admin/product/upload')
    </script>`)
    })
    .catch((err) => {
        res.status(500).json({
            error: err,
            succed: false
        });

    })
console.log(newProducts)

}catch(err){
    console.log(err);
    res.redirect(`${myEnv}/admin/signIn`)
}
}

module.exports=addproduct