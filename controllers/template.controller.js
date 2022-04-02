let mongoose = require('../helpers/mongoConn');
let multer = require('multer');
let path = require('path')
const fs = require('fs');
let mongo = require('mongoose');
var crypto = require('crypto');
var js2xml = require('js2xmlparser');
var mysql = require('mysql');

var listTemplate = (req,res) => {

    mongoose.collection("Templates").find({}).project({"nameTemplate" : 1,"abbrevTemplate" : 1,"_id" : 0,"templateID" : 1,"fields" : 1,"description" : 1,"toC" : 1}).toArray( (err,data) => {
        if(err){
            res.send({
                status : "Fail",
                error : err
            })
        }
        else {
            res.send({
                status : "Success",
                message : "Templates List recieved !!!!",
                data : data
            })
        }
    })

}

var viewSingleTemplate = (req,res) => {

    mongoose.collection("Templates").find({templateID : req.query.templateID}).toArray( (err,data) => {
        if(err){
            res.send({
                status : "Fail",
                error : err
            })
        }
        else {
            res.send({
                status : "Success",
                message : "Template recieved !!!!",
                data : data
            })
        }
    })

}

var dataTypesList = (req,res) => {
    
    let dataTypes = [
        {
            "dataType":"Double",
            "example" : 12345.67
        }, 
        {
            "dataType":"String",
            "example" : "abcdefgh"
        },
        {
            "dataType":"Object",
            "example" : "{abcd : 'abcd',def : {abcd : abcdefg}}"
        },{
            "dataType":"Array",
            "example" : [abcd,efgh]
        } , {
            "Boolean" : "Boolean",
            "example" : "true/false"
        }, {
            "Date" : "Date",
            "example" : "dd-mm-yyyy"
        }, {
            "Null" : "Null",
            "example" : "null"
        }, {
            "Integer" : "int",
            "example" : "12334"
        }, {
            "Timestamp" : "timestamp",
            "example" : "MM/dd/yyyy HH:mm:ss ZZZZ"
        }];

    res.send({
        status : "Success",
        data : dataTypes
    })

}

var templateUpdation = async (req,res) => {

    let formData = req.body.data;

    for(var i=0;i<formData.length;i++){

        if(formData[i] == undefined || formData[i] == null){
            
            formData.splice[i];
        
        }
        else {
            
            console.log({
                dataType : formData[i].dataType,
                templateID : formData[i].templateID,
                fieldName : formData[i].fieldName,
                exampleValue : formData[i].exampleValue
            })

            //await mongoose.collection("Templates").findOneAndUpdate({templateID : formData[i].templateID},{ fieldName : dataTye(exampleValue) })

        }

    }

}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads'; 
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir,{recursive: true});
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname)
    }
})

const upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['txt','xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    },
    limits:{
        files: 1,
        fileSize: 30*1024*1024
    }
}).single('file');

const fileUpload = async (req,res) => {
    upload(req,res,function(err){
        if(err){
            console.log(err)
            res.send({
                status:"Fail",
                message: "error occurred !!!",
                error_code: 1,
                err_desc: err
            })
            return;
        }
        //Multer gives us file info in req.file object
        if(!req.file){
            console.log("No file passed ")
            res.send({
                status:"Fail",
                message: "error occurred !!!",
                error_code: 1,
                err_desc: "No file passed !!!"
            })
            return;
        }
        else{
            res.send({
                status:"Success",
                message : "File Uploaded Successfully !!!!!!"
            })
        }
    })
}

const templateStorage = function (req,res) {
    
    switch(req.body.templateName){

        case "newTemplate" :
            if(req.body.fileType == "txt") {
                fs.rename(path.join('uploads',req.body.fileName),path.join('uploads','pipeDelimited','new_templates',req.body.fileName),(err,data)=>{
                    if(err){
                        console.log(err)
                        res.send({
                            status : 'Fail',
                            message : err
                        })
                    } else {
    
                        mongoose.collection("Templates").countDocuments({nameTemplate : req.body.nameTemplate},(err,count) => {
                            if(err){
                                res.send({
                                    status : "Fail",
                                    message : "Cant save template !!!!"
                                })
                            }
                            else {
                                if(count > 0) {
                                    res.send({
                                        status : "Fail",
                                        message : "Template already exists !!!!"
                                    })  
                                } else {
                                    mongoose.collection("Templates").insertOne(req.body,(err,data)=>{
                                        if(err){
                                            res.send({
                                                status : "Fail",
                                                message : "Cant save template !!!!"
                                            })
                                        } else {
                                            res.send({
                                                status : "Success",
                                                message : "Template uploaded !!!!"
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            } else if(req.body.fileType == "xlsx") {
                fs.rename(path.join('uploads',req.body.fileName),path.join('uploads','xlsx','new_templates',req.body.fileName),(err,data)=>{
                    if(err){
                        console.log(err)
                        res.send({
                            status : 'Fail',
                            message : err
                        })
                    } else {
    
                        mongoose.collection("Templates").countDocuments({nameTemplate : req.body.nameTemplate},(err,count) => {
                            if(err){
                                res.send({
                                    status : "Fail",
                                    message : "Cant save template !!!!"
                                })
                            }
                            else {
                                if(count > 0) {
                                    res.send({
                                        status : "Fail",
                                        message : "Template already exists !!!!"
                                    })  
                                } else {
                                    mongoose.collection("Templates").insertOne(req.body,(err,data)=>{
                                        if(err){
                                            res.send({
                                                status : "Fail",
                                                message : "Cant save template !!!!"
                                            })
                                        } else {
                                            res.send({
                                                status : "Success",
                                                message : "Template uploaded !!!!"
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            } else {
                res.send({
                    status : "Fail",
                    message : "Couldnt find the template."
                })
            }
            
            break;

        default :
            fs.readFile(path.join('uploads',req.body.fileName),
                {encoding:'utf8', flag:'r'},
                (err,data) => {
                    if(err){
                        console.log("error occured in reading the file !!!!!!")
                        console.log(err)
                    } else {
                        var headers; 
                        var records = [];
                        var jsonObject = {};
                        var jsonFile = [];
        
                        var eachRow = data.split('\n');
                        console.log('Lines found :- ' + eachRow.length);
        
                        
                        for(var i = 0; i<=eachRow.length ; i++){
                            if(i==0){
                                headers = eachRow[i].split("|");
                                for(var j=0;j<=headers.length;j++){
                                    if(headers[j]==undefined){
                                        headers.splice[j];
                                    }
                                    else{
                                        headers[j] = headers[j].replace(/\s/g, '');
                                    }
                                }
                                //console.log(headers);
                            }
                            else if(eachRow[i] == undefined || eachRow[i] == ""){
                                eachRow.splice(i);
                                console.log("undefined records found and removed !!!!")
                            }
                            else {
                                records.push(eachRow[i].split("|"));
                            }
                        }

                        mongoose.collection("Templates").find({nameTemplate : req.body.templateName}).project({templateID : 1, fileName : 1}).toArray((err,data)=>{
                            if(err){
                                console.log("error in finding template !!!!")
                                console.log(err)
                                res.send({
                                    status : "Fail",
                                    message : "error in finding template !!!!"
                                })
                            } else {
                                mongoose.collection("models").find({templateID : data[0].templateID}).project({_id : 0, templateID : 0, fileName : 0}).toArray((err,modelData) => {
                                    if(err){
                                        console.log("error in finding data model !!!!!")
                                        console.log(err)
                                        res.send({
                                            status : "Fail",
                                            message : "error in finding data model !!!!!"
                                        })    
                                    }
                                    else {
                                        var schema = mongo.Schema;
                                        var templateSchema = new schema(modelData[0]);
                                        var templateModel = mongo.model(data[0].templateID,templateSchema);

                                        const dataObject = {};
                                
                                        for(var rec =0 ; rec< records.length; rec ++) {
                                            if(records[rec] == undefined){
                                                records.splice[rec];
                                            }
                                            else {
                                                let dataRecord = records[rec];
                                                var abc = 0;        
                                                for(var key of Object.keys(modelData[0])){
                                                    dataObject [key] = dataRecord[abc];
                                                    abc++;
                                                }
                                                
                                                var modelInstance = new templateModel(dataObject);
                                                modelInstance.save((err)=>{
                                                    if(err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log("Data Inserted !!!!!")
                                                    }
                                                })        

                                            }
                                        }
                                        res.send({
                                            status : "Success",
                                            message : "Data inserted Successfully !!!"
                                        })
                                    }
                                })
                            }
                        })
                    }    
                }
            )
            fs.unlinkSync(path.join('uploads',req.body.fileName),(err,data)=>{
                if(err){
                    console.log(err)
                } else {
                    console.log("deleted file !!!!!!!")
                }
            })
            break;
    }
}

const templateDownload = (req,res) => {
    switch (req.body.fileType) {

        case "json" :
            mongoose.collection("Templates").find({abbrevTemplate : req.body.templateName}).project({templateID : 1,_id:0}).toArray((err,templateData) => {
                if(err){
                    res.send({
                        status : "Fail",
                        message : 'Couldnt find template !!!!'
                    })
                }
                else {
                    mongoose.collection(templateData[0].templateID.toLowerCase()).find({}).project({_id:0,__v:0}).toArray((err,data) => {
                        if(err){
                            res.send({
                                status : "Fail",
                                message : 'Couldnt retrieve data from selected Template !!!!'
                            })      
                        }
                        else {
                            console.log(data);
                            res.send({
                                status : "Success",
                                data : data
                            })
                            // let name = 'json'
                            // fs.writeFileSync('downloads/'+crypto.createHash('md5').update(name).digest('hex')+'.json',JSON.stringify(data),(err,writeResp) =>{
                            //     if(err){
                            //         console.log(err)
                            //         res.send({
                            //             status : "Fail",
                            //             message : "Cant write data into json file !!!!!!"
                            //         })
                            //     }
                            //     else {
                                    
                            //     }
                            // })
                        }
                    })
                }
            }) 
            break;

        case 'xml' :
            console.log(req.body.templateName);
            mongoose.collection("Templates").find({nameTemplate : req.body.templateName}).project({templateID : 1,_id:0,fileType:1}).toArray((err,templateData) => {
                if(err){
                    console.log(err)
                    res.send({
                        status : "Fail",
                        message : 'Couldnt find template !!!!'
                    })
                }
                else {
                    if(templateData.length == 0) {
                        res.send({
                            status : "Fail",
                            message : 'could not find the template in db'
                        })
                    } else {
                        if(templateData[0].fileType == "xlsx") {
                            mongoose.collection(templateData[0].templateID).find({}).project({_id:0,__v:0}).toArray((err,data) => {
                                if(err){
                                    console.log(err)
                                    res.send({
                                        status : "Fail",
                                        message : 'Couldnt retrieve data from selected Template !!!!'
                                    })      
                                }
                                else {
                                    res.send({
                                        status : "Success",
                                        data : data
                                    })
                                }
                            })
                        } else {
                            mongoose.collection(templateData[0].templateID.toLowerCase()).find({}).project({_id:0,__v:0}).toArray((err,data) => {
                                if(err){
                                    console.log(err)
                                    res.send({
                                        status : "Fail",
                                        message : 'Couldnt retrieve data from selected Template !!!!'
                                    })      
                                }
                                else {
                                    res.send({
                                        status : "Success",
                                        data : data
                                    })
                                }
                            })
                        }
                    }
                }
            }) 
            break;

        case 'excel' :
            mongoose.collection("Templates").find({nameTemplate : req.body.templateName}).project({templateID : 1,_id:0}).toArray((err,templateData) => {
                if(err){
                    res.send({
                        status : "Fail",
                        message : 'Couldnt find template !!!!'
                    })
                }
                else {
                    mongoose.collection(templateData[0].templateID.toLowerCase()).find({}).project({_id:0,__v:0}).toArray((err,data) => {
                        if(err){
                            res.send({
                                status : "Fail",
                                message : 'Couldnt retrieve data from selected Template !!!!'
                            })      
                        }
                        else {
                            console.log(data);
                            res.send({
                                status : "Success",
                                data : data
                            })
                            // let name = 'json'
                            // fs.writeFileSync('downloads/'+crypto.createHash('md5').update(name).digest('hex')+'.json',JSON.stringify(data),(err,writeResp) =>{
                            //     if(err){
                            //         console.log(err)
                            //         res.send({
                            //             status : "Fail",
                            //             message : "Cant write data into json file !!!!!!"
                            //         })
                            //     }
                            //     else {
                                    
                            //     }
                            // })
                        }
                    })
                }
            }) 
            break;

    }
}

const testSQLConn = (req,res) => {
    let connectionData = req.body;

    var connection = mysql.createConnection({
        host : connectionData.hostName,
        port : connectionData.portNumber,
        user : connectionData.username,
        password : connectionData.password,
        database : connectionData.database
    })

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
        if(err) {
            console.log(err)
            res.send({
                status : "Fail",
                message : "Connection Failed !!!!!"
            })
        } else {
            res.send({
                status : "Success",
                message : "You can now connect to the database !!!"
            })
        }
    })

    connection.end();
}

const insertIntoSql = (req,res) => {
    let connectionData = req.body;

    var connection = mysql.createConnection({
        host : connectionData.connectionDetails.hostName,
        port : connectionData.connectionDetails.portNumber,
        user : connectionData.connectionDetails.username,
        password : connectionData.connectionDetails.password,
        database : connectionData.connectionDetails.database,
    })

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
        if(err) {
            console.log(err)
            res.send({
                status : "Fail",
                message : "Connection Failed !!!!!"
            })
        } else {
            res.send({
                status : "Success",
                message : "You can now connect to the database !!!"
            })
        }
    })

    connection.end();
}




module.exports = {
    dataTypesList : dataTypesList,
    templateUpdation : templateUpdation,
    listTemplate : listTemplate,
    viewSingleTemplate : viewSingleTemplate,
    fileUpload : fileUpload,
    templateStorage : templateStorage,
    templateDownload : templateDownload,
    testSQLConn : testSQLConn,
    insertIntoSql : insertIntoSql
}