const routes = require("express").Router();
const boletoController = require('./controllers/bancoDoBrasilController');
const formatters = require('./helpers/formatters');

routes.post('/read', (req,res)=>{
    const entry = req.body.line.trim();

   let codeType =  formatters.defineCodigo(entry);

   if(codeType == "boleto"){
       return res.send(boletoController.isCodeValid(entry))
   }
   if(codeType == "convenio"){
    return res.send("it's convenio")
   }
   else return res.send({error :codeType })
});

module.exports = routes;
