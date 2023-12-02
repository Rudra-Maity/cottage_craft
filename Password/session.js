router.get('/x', (req,res,next) => {
    // req.session.user = {
    //     uuid: '12234-2345-2323423'
    // }
    
    req.session.save(err => {
        if(err){
            console.log(err);
        } else {
            if(req.session.user) res.send(req.session.user)
            else res.redirect('/login')
        }
    });
    
    console.log(req.session)
})
router.get('/login',(req,res)=>{
    res.render('user1')
})
router.post('/create',async(req,res)=>{
  
    req.session.user=await req.body.Id
    res.send("success")
})


router.get('/end', (req,res,next) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
        } else {
            res.send('Session is destroyed')
        }
    });
})
