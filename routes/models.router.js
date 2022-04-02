var express = require("express")
var router = express.Router();

//controller of templates
var model = require('../controllers/models.controller');

//get data model
router.get('/model',model.listDataModel); 

module.exports = router;