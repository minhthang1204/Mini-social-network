const mongoose = require ('mongoose')

mongoose.connect('mongodb://localhost:27017/nhom14-social-networking',{
    useNewUrlParser: true,
    useCreateIndex: true ,
    useUnifiedTopology: true,
    useFindAndModify: false
})

// mongoose.connect('mongodb://localhost:27017/social-networking',{
//     useNewUrlParser: true,
//     useCreateIndex: true ,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })

//mongodb/bin/mongod --dbpath=/mongodb-new-data/mongodb_data
// })
