exports.defineCodigo = (line)=>{

    let campos = line.split(" ").filter(x=> x != "" );

    let numberOfFields = campos.length;
    console.log(`Number of fields : ${numberOfFields}`);

    if(numberOfFields < 4 || numberOfFields > 5  ){
        console.log(" **** Linha digitada nao é válida ****");
        return " Linha digitada nao é válida";
    }

    if(numberOfFields == 5 ){
        console.log(" **** Esse é títulos bancários ****");
        return "boleto";
    }

    if(numberOfFields == 4 ){
        console.log(" **** Esse é pagamentos de concessionárias ****");
        return "convenio"
    }

}