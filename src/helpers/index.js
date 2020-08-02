exports.getCamposSemDV = (campo)=>{
    return campo.replace(".","").slice(0,-1);
}

exports.sumNumToNum = (num)=>{
        return num
        .toString()
        .split('')
        .map(Number)
        .reduce((a, b)=>  a + b, 0);
}

exports.getRangeSum = (arr, from, to) =>{
    return arr.slice(from, to).reduce((sum, value) => {
        if(value > 9) value = this.sumNumToNum(value);
        return sum + value;
    }, 0);
}

exports.roundUp = (num)=>{
    return  (parseInt(num /10, 10) + 1) * 10;
}

exports.getTheLastDigit = (num)=>{
    return num.toString().split('').pop();
}

