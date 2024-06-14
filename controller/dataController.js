function checkCodeAndData(code,data){

    // Number(code) verifica que el codigo ingresado se un numero. 
    // parseInt(req.params.id) funcionaba a medias, porque note que si mandabas "1e"
    // me modificaba el objeto con codigo 1, cosa que esta mal porque yo no mande "1" sino "1e"
    // Hecho de esta forma soluciono eso porque lo que hace es devolverme Nan si lo que le estoy pasando
    // no se puede convertir en numero.

    if(Number(code) && !code.includes('.')){
        if(!data.precio && Number(data.precio)){
            return {'state': false, 'status': 500, 'msj': 'Error en el precio. Valor ingresado NO valido!'}
        }
    }else{
        return {'state': false, 'status': 500, 'msj': 'Error en el codigo. Valor ingresado NO valido!'}
    }

    return {'state': true}
}

module.exports = {checkCodeAndData};