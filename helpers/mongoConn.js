const mongoose = require('mongoose');

const url = 'mongodb+srv://admin:admin@cluster0.laiqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' //can be changed if it has any other connections

const req = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
}

mongoose.connect(url,req,(err,connection)=>{
    if(err){
        console.log("error ocurred while connecting the database!!!");
        console.log(err)
    }
    else{
        let check_response = {
            creatingNewCollection : "Successfull",
            insertingData : "Successfull",
            checkedAt : new Date()
        }
        
        mongoose.connection.collection("Checks").insertOne(check_response,(err,data)=>{
            if(err){
                console.log("MongoDb checks Failed!!! Try to reconnect");
                console.log(err)
            }
            else{
                mongoose.connection.collection("Templates").find({},(err,data)=>{
                    if(err){
                        console.log("MongoDB can't create collection for the templates storage !!!!");
                        console.log(err)
                    }
                    else{
                        let admin_data = {
                            name : "sysadmin",
                            password : "Intense",
                            email : 'admin@intense.in',
                            createdAt : new Date()
                        }
                        mongoose.connection.collection('profiles').countDocuments({name : 'sysadmin'},(err,data)=>{
                            if(err){
                                console.log("MongoDB can't find admin in the Database!!!!");
                                console.log(err)
                            }
                            else{
                                if(data <= 0){
                                    mongoose.connection.collection('profiles').insertOne(admin_data,(err,insData)=>{
                                        if(err){
                                            console.log("MongoDB cant create admin priviledges !!!!")
                                            console.log(err)
                                        }
                                        else{
                                            console.log("Admin identity created and accessing the databse !!!!")
                                            console.log("MongoDb checks complete!!!! \n Proceed with the API calls!!!");
                                        }
                                    })
                                }
                                else{
                                    console.log("Admin identity found and accessing the databse !!!!")
                                    console.log("MongoDb checks complete!!!! \n Proceed with the API calls!!!");
                                }
                            }
                        })
                    }
                })
            }
        })
    }
})

module.exports = mongoose.connection;