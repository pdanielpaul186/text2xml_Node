var express = require("express")
var router = express.Router();

//controller of templates
var template = require('../controllers/template.controller');

// Get list of templates 
router.get("/",template.listTemplate);

//get single template 
router.get('/single',template.viewSingleTemplate);

//get database data types
router.get('/dataTypes',template.dataTypesList);

//update data types in table 
router.put('/',template.templateUpdation);

//file upload 
router.post('/upload',template.fileUpload);

//template storage
router.post('/storage',template.templateStorage);

//template download 
router.post('/download',template.templateDownload);

//dbConn testing
router.post('/testConn',template.testSQLConn);

//insert into sql
router.post('/sqlInsert',template.insertIntoSql);

module.exports = router;