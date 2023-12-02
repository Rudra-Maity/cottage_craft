const mongose=require('mongoose')
module.exports = function () {
    mongose.connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        console.log("succed")
    }).catch((err) => {
        console.log(err)
    });
}
