const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ghulamrabbani883:Password@cluster0.pgu6cxu.mongodb.net/').then(()=>{
    console.log(`connected to DB`)
}).catch((err)=>console.log(`error in connecting ${err}`))
