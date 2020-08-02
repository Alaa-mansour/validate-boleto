
const moment = require('moment');
const helpers = require('../helpers');

let campos = [];

exports.isCodeValid= (line)=>{
    campos = line.split(" ").filter(x=> x != "" );

    let DV = this.calculateDV();

    if(helpers.getTheLastDigit(campos[0]) == DV.fieldOneDV
    && helpers.getTheLastDigit(campos[1]) == DV.fieldTwoDV
    && helpers.getTheLastDigit(campos[2]) == DV.fieldThreeDV){
        return this.calculateEntry(line);
    }
    else return {"error" :"o codigo não e valido"};
}

exports.calculateEntry = ( _digitableLine)=>{
        let boletoInfo = {};

        // O valor do boleto, se existir
        boletoInfo.valor = this.getValue(campos[campos.length - 1]);

        //A data de vencimento do boleto, se existir
        boletoInfo["Data de vencimento"] = this.getExpirationDate(campos[campos.length - 1]);


        //Os 44 dígitos correspondentes ao código de barras desse boleto
        boletoInfo["Digitos do codigo de barras"] = this.getBarCodeDigits();

        console.log(`BOLETO INFO %%%%% ${JSON.stringify(boletoInfo) }`)
        return boletoInfo;

}



exports.getValue = (field) => {
    //the value exist in the 5th field the last 10 digits
    return parseInt(field.substr(4));
}

exports.getExpirationDate = (field) =>{
    //the value exist in the 5th field the first 4 digits
    // DATA BASE 07/10/1997
    let fatorDeVencimento = parseInt(field.substr(0,4));

    if(fatorDeVencimento == 0 ) return "Boletos bancários sem data de vencimento";

    let baseDate =  moment( "07/10/1997", "DD/MM/YYYY");
    let endDate = baseDate.add(fatorDeVencimento, 'days').format("DD/MM/YYYY");

    return endDate;
}

exports.getBarCodeDigits = () =>{
    let part1 = campos[0].split(".")
    let nossoNumero = part1[0].substr(-1) + part1[1].substr(0,4);

    // FORMATO DO CÓDIGO DE BARRAS:

    let barCode = campos[0].substr(0,3)         // 01 a 03 03 9(3) Código do Banco na Câmara de Compensação = ‘001’
                + campos[0].substr(3,1,0)       // 04 a 04 01 9(1) Código da Moeda = '9'
                + campos[3]                     // 05 a 05 01 9(1) DV do Código de Barras (Anexo V)
                + campos[campos.length - 1]     // 06 a 09 04 9(04) Fator de Vencimento (Anexo III) + 10 a 19 10 9(08) V(2) Valor
                + nossoNumero   // 20 a 30 11 9(11) Nosso Número, sem DV
                + helpers.getCamposSemDV(campos[1])
                + helpers.getCamposSemDV(campos[2])  // complemento do nosso numero


    return barCode;
}



exports.calculateDV = ()=>{
    // Observação: Os campos 4 e 5 não tem DV, por isso não fazem parte da metodologia de cálculo.
    let firstThreeFields = helpers.getCamposSemDV(campos[0])
                         + helpers.getCamposSemDV(campos[1])
                         + helpers.getCamposSemDV(campos[2]);

    let fieldsToArray = firstThreeFields.split("");

    //  a) Multiplicando a sequência dos campos pelos multiplicadores, iniciando por 2 da
    //  direita para a esquerda:
    let multipliers = [];

    for (let i = fieldsToArray.length -1 ; i >=0 ; --i){
        if( Number.isInteger(i/2)) multipliers[i] = 2
        else multipliers[i] = 1
    }

    let multiplicationRes = fieldsToArray.map((num,index)=> num * multipliers[index] );

    let fieldOneLength =  helpers.getCamposSemDV(campos[0]).length;
    let fieldTwoLength = helpers.getCamposSemDV(campos[1]).length;


    // b) Some, individualmente, os algarismos dos resultados do produtos:

    let sumField1 = helpers.getRangeSum(multiplicationRes, 0 , fieldOneLength );
    let sumField2 = helpers.getRangeSum(multiplicationRes, fieldOneLength , fieldOneLength + fieldTwoLength);
    let sumField3 = helpers.getRangeSum(multiplicationRes,  - fieldTwoLength);

    // c) Divida o total encontrado por 10, a fim de determinar o resto da divisão:
    // d) Subtrair o “resto” apurado pela dezena imediatamente posterior. O resultado será igual ao DV

    let fieldOneDV =  helpers.getTheLastDigit(helpers.roundUp(sumField1) - sumField1 % 10);
    let fieldTwoDV = helpers.getTheLastDigit(helpers.roundUp(sumField2) - sumField2 % 10);
    let fieldThreeDV = helpers.getTheLastDigit(helpers.roundUp(sumField3) - sumField3 % 10);

    return {fieldOneDV, fieldTwoDV, fieldThreeDV }
}




