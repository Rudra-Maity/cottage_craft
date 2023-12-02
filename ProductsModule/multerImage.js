const multer=require('multer')
function upload(){
    const storage = multer.memoryStorage();


const upload = multer({ storage: storage });
return upload
}

module.exports=upload