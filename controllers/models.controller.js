let mongoose = require('../helpers/mongoConn');
let path = require('path')
const fs = require('fs');
let mongo = require('mongoose');
var crypto = require('crypto');

const listDataModel = (req,res) => {
    mongoose.collection("Templates").find({nameTemplate : req.query.nameTemplate}).toArray((err, data) => {
        if(err) {
            res.send({
                status : "Fail",
                message : err
            })
        } else {
            let templateIDforModel = data[0].templateID;
            mongoose.collection("models").find({templateID : templateIDforModel}).project({_id : 0, templateID : 0, fileName : 0, _v : 0 }).toArray( (err, modelData) => {
                if(err) {
                    res.send({
                        status : "Fail",
                        message : err
                    })        
                } else {
                    res.send(modelData)
                }
            })
        }   
    })
}

module.exports = {
    listDataModel : listDataModel
}