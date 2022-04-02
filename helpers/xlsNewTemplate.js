const fs = require("fs");
const mongo = require("./mongoConn");
const mongoose = require("mongoose");
const path = require("path");
const watch = require("watch");
const xlsx2json = require("xlsx-to-json-lc");

watch.createMonitor('./uploads/xlsx/new_templates', (monitor) => {
    monitor.on("created",(filePath,stats) => {
        xlsx2json({
            input : filePath,
            output : null
        }, async function (err,result) {
            if(err){
                console.log("Error in parsing json !!!!!");
                console.log(err)
            } else {
                try{
                    const templateID = path.basename(filePath).replace(/\.[^/.]+$/, "");
                    mongo.createCollection(templateID,(err,data) => {
                        if(err) {
                            console.log("Error in creating the collection")
                            console.log(err)
                        } else {
                            mongo.collection(templateID).insertMany(result,(err,data)=>{
                                if(err) {
                                    console.log("Error in inserting the data into MongoDb !!!!");
                                    console.log(err)
                                } else {
                                    console.log("Json Data Inserted !!!!!!")
                                }
                            })
                        }
                    })
                } catch(err) {
                    throw err
                }
            }
        })
        fs.unlinkSync(filePath,(err,data) =>{
            if(err){
                console.log(err)
            }
            else {
                console.log("File removed !!!!!")
            }
        })
    })
})