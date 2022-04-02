const fs = require('fs');
const mongo = require('./mongoConn');
const mongoose = require ('mongoose');
const watch = require('watch');

watch.createMonitor('./uploads/pipeDelimited/new_templates', (monitor) => {
    monitor.on('created',(path,stats) => {
        console.log("File Found !!!!")
        fs.readFile(path,
            {encoding:'utf8', flag:'r'},
            function(err, data) {
            if(err)
                console.log(err);
            else{
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



                for(var k=0;k<headers.length;k++){
                    if(headers[k]==undefined){
                        headers.splice[k];
                    }
                    else{
                        jsonObject [headers[k]] = "string";
                        //jsonObject [templateID] = path.split("uploads/");
                    }
                }

                let templateID = path.split("uploads/pipeDelimited/new_templates/");
                templateID.shift();
                jsonObject.templateID = templateID[0].replace(/\.[^/.]+$/, "");
                jsonObject.fileName = templateID[0];
                


                mongo.collection("models").find({"templateID" : templateID[0].replace(/\.[^/.]+$/, "")}).count((err,count)=>{
                    if(err){
                        console.log("Error in finding Data Models !!!!!!")
                        console.log(err)
                    }
                    else {
                        if(count > 0){
                            console.log("Data Model already Present !!!!!!!")
                        }
                        else {

                            mongo.collection("models").insertOne(jsonObject,(err,data)=>{
                                if(err){
                                    console.log("Error in saving Data Model !!!!!!")
                                    console.log(err)
                                }
                                else {
                                    console.log("Data Model saved !!!!!")
                                }
                            })

                
                            mongo.collection("models").find({templateID : templateID[0].replace(/\.[^/.]+$/, "")}).project({templateID : 0, fileName : 0, _id : 0}).toArray((err,data)=>{
                                if(err){
                                    console.log("Error in retrieving data model !!!!!!")
                                    console.log(err)
                                }
                                else {
                                    var schema = mongoose.Schema;
                
                                    var templateSchema = new schema (data[0]);

                                    var templateModel = mongoose.model(templateID[0].replace(/\.[^/.]+$/, ""), templateSchema);

                                    var templateData = {};
                                    const dataObject = {};
                                    
                                    for(var rec =0 ; rec< records.length; rec ++) {
                                        if(records[rec] == undefined || records[rec] == null){
                                            records.splice[rec];
                                        }
                                        else {
                                            let dataRecord = records[rec];
                                            var abc = 0;        
                                            for(var key of Object.keys(data[0])){
                                                dataObject [key] = dataRecord[abc];
                                                abc++;
                                            }
                                            
                                            var modelInstance = new templateModel(dataObject);
                                            modelInstance.save((err)=>{
                                                if(err){
                                                    console.log(err)
                                                }
                                                else {
                                                    console.log("Data inserted !!!!!")
                                                }
                                            })        

                                        }
                                    }

                                }
                            })
                
                        }

                    }
                })

                fs.unlinkSync(path,(err,data) =>{
                    if(err){
                        console.log(err)
                    }
                    else {
                        console.log("File removed !!!!!")
                    }
                })

            }
        });      
    })
})