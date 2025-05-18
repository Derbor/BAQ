let data = {
    /* Requerido. Email de la cuenta PagoPlux del Establecimiento */
    // PayboxRemail: "cflores@openlab.ec",
    PayboxRemail: "abautista@pagoplux.com",

    /* Requerido. Email del usuario que realiza el pago */
    PayboxSendmail: "andresalexander14@hotmail.com",

    /* Requerido. Nombre del establecimiento en PagoPlux */
    PayboxRename: "BAQ",

    /* Requerido. Nombre del usuario que realiza el pago */
    PayboxSendname: "Andres Gaibor",

    /* Requerido. Monto total de productos o servicios que no aplican impuestos, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 */
    PayboxBase0: "10.00",

    /* Requerido. Monto total de productos o servicios que aplican impuestos, el valor debe incluir el impuesto, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 posee el valor de los productos con su impuesto incluido */
    PayboxBase12: "10.00",

    /* Requerido. Descripción del pago */
    PayboxDescription: "Prueba de plux",

    /* Requerido Tipo de Ejecución
     * Production: true (Modo Producción, Se procesarán cobros y se
       cargarán al sistema, afectará a la tdc)
     * Production: false (Modo Prueba, se realizarán cobros de prueba y no  
       se guardará ni afectará al sistema)
    */
    PayboxProduction: false,

    /* Requerido Ambiente de ejecución
     * prod: Modo Producción, Se procesarán cobros y se cargarán al sistema,   afectará a la tdc.
     * sandbox: Modo Prueba, se realizarán cobros de prueba
    */
    PayboxEnvironment: "sandbox",

    /* Requerido. Lenguaje del Paybox
     * Español: es | (string) (Paybox en español)
    */
    PayboxLanguage: "es",
    /* Requerido. Identifica el tipo de iframe de pagoplux por defecto true
*/
    PayboxPagoPlux: true,

    /*
      * Requerido. dirección del tarjetahabiente
    */
    PayboxDirection: "Riobamba",

    /*
      * Requerido. Teléfono del tarjetahabiente
    */
    PayBoxClientPhone: "0999999999",

    /*
     * Requerido. Identificación del tarjetahabiente
        */

    PayBoxClientIdentification: '123456789',
    /* SOLO PARA PAGOS RECURRENTES
     *  Solo aplica para comercios que tengan habilitado pagos
           recurrentes
        */

    /* Requerido
       True -> en caso de realizar un pago recurrente
        False -> si es pago normal
     */
    PayboxRecurrent: false,

    /* Requerido
       Id o nombre exacto del plan registrado en el comercio en la  
               plataforma de pagoplux
    */
    PayboxIdPlan: 'Plan Mensual',

    /**
     * true -> los cobros se realizan de manera automática según la
               frecuencia del plan asignado en PAGOPLUX
     * false -> los cobros se realizan mediante solicitud
     */
    PayboxPermitirCalendarizar: true,
    /* Requerido
     * true -> El débito se realiza en el momento del pago
     * false -> El débito se realizará en la fecha de corte según el plan
       contratado
    */
    PayboxPagoInmediato: false,

    /* Requerido
      true -> si desea realizar un pago de prueba de 1$ y reverso del
      mismo de manera automática
      NOTA: PayboxPagoImediato debe ser igual false
      false -> no se realizará ningún cobro de prueba
    */
    PayboxCobroPrueba: false,


    onAuthorize: (response: any) => {
        if (response.status === "succeeded") {
            console.log(response);
            alert("Proceso completado con éxito");
            // @ts-ignore
            jQuery('.container-unpayed').hide();
            console.log(response.amount) //monto
            // response.deferred, //diferidos
            // response.interest, //tiene intereses
            // response.interestValue, //monto intereses
            // response.amountWoTaxes, //monto impuestos
            // response.cardInfo, //número de tarjeta encriptado
            // response.cardIssuer, //marca tarjeta Ejemplo: Visa
            // response.cardType, //tipo tarjeta Ejemplo: Crédito
            // response.clientID, //identificación tarjetahabiente
            // response.clientName, //nombre tarjetahabiente
            // response.fecha, //fecha de pago
            // response.id_transaccion, //id de transacción pagoplux
            // response.state, //estado del pago
            // response.token, //voucher del pago
            // response.tipoPago //tipo de pago usado
        }
    }

}

export { data }