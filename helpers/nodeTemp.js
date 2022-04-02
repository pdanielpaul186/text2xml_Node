const fs = require('fs');
const chokidar = require('chokidar');
const mongo = require('./mongoConn');
const watch = require('watch')

watch.createMonitor('./uploads/pipeDelimited/templates',(monitor) => {
    monitor.on('created',(path,stats) => {
        fs.readFile(path,
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
                    
                }    
            }
        )
    })
})