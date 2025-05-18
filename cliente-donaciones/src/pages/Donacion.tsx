import React, { useCallback, useEffect } from 'react'
import PpxButton from '../components/PpxButton'
import { useLocation } from 'wouter';
import { useDonacionStore } from '../store/donacionStore';
import { data as baseData2 } from '../configuration/ppx.data';
import { navigate } from 'wouter/use-hash-location';

const { onAuthorize, ...baseData } = baseData2
export default function Donacion() {
    const [location, params] = useLocation();
    
    // Obtener datos del store en lugar de history.state
    const { email, nombre, telefono, description, monto } = useDonacionStore();
    
    console.log('monto', monto);
    console.log('nombre', nombre);
    console.log('email', email);
    
    useEffect(() => {
        console.log('location', monto);
        // Agregamos un pequeño retraso para asegurar que el DOM esté listo
        
        // Intentar inmediatamente
        

        // Y también después de un pequeño retraso

    }, []);

    const { onAuthorize, ...clonableData } = baseData;

// 2. Añade los campos dinámicos
const buttonData = {
  ...clonableData,
  PayboxSendname: nombre,
};

console.log('buttonData', buttonData);

// 3. Registra el callback de otra forma (ejemplo: evento global)
useEffect(() => {
  window.__onAuthorizePaybox = onAuthorize;
  return () => { delete window.__onAuthorizePaybox; };
}, []);

const buttonData2 = JSON.parse(
  JSON.stringify({
    ...baseData,
    PayboxSendname: nombre,
  })
);

const paymentData = JSON.parse(JSON.stringify({
  ...baseData,
  // 1. Datos de la transacción
  PayboxSendmail: email,
  PayboxSendname: nombre,
  PayboxBase0:    ( monto || 0).toFixed(2),
  PayboxBase12:   "0.00",
  PayboxDescription: "Donación para el Banco de Alimentos",

  // 2. Sandbox / no recurrente
  PayboxProduction: false,
  PayboxEnvironment:"sandbox",
  PayboxRecurrent:  false,
  PayboxPermitirCalendarizar: false,
  PayboxPagoInmediato:       true,

  // 3. Permitir que el usuario edite o ver datos personales
  permitirIngresarDatosPersonales: true,

  // 4. Pre-poblar documento y nombre
  PayboxTypeDoc:  "CC",
  PayboxDocument: "1724444382001",
  PayboxHolderName: nombre,       // si tu SDK lo admite
}));

  // 2) Nuestro callback “vanilla”:
  const handleAuthorization = useCallback((response: any) => {
    if (response.status === 'succeeded' || response.status === 'SUCCESS') {
      navigate('/pagado')
      console.log('¡Pago OK!', response)
    } else {
      console.error('Error en pago:', response)
    }
  }, [navigate])

  // 3) Una vez que el script de PagoPlux inyecte `window.Data`, le pegamos el callback:
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).Data) {
        // le asignamos su función ahí donde index_angular.js la va a invocar
        (window as any).Data.$onAuthorize = handleAuthorization
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [handleAuthorization])

const transactionData = {
        ...baseData, // Start with defaults

        // Override with values from the store or component state
        PayboxSendmail: email || baseData.PayboxSendmail,
        PayboxSendname: nombre || baseData.PayboxSendname,
        // Ensure amounts are strings with two decimal places as per ppx.data.js comments
        // PayboxBase0: ( monto) ? parseFloat(String(purchaseAmount || monto)).toFixed(2) : baseData.PayboxBase0,
        // PayboxBase12: "0.00", // Adjust if you have amounts with taxes
        PayboxDescription: description || 'Donación para el Banco de Alimentos',
        PayBoxClientPhone: telefono || baseData.PayBoxClientPhone,
        // PayboxProduction: false, // Keep sandbox settings as per your ppx.data.js
        // PayboxEnvironment: "sandbox",
        onAuthorize: handleAuthorization,
        // How to handle onAuthorize depends on PpxButton's API:
        // Option A: If PpxButton expects onAuthorize INSIDE the data object (as ppx.data.js implies)
        // onAuthorize: handleAuthorization,

        // Option B: If onAuthorize should NOT be in the data object that might be cloned.
        // In this case, remove it from transactionData if it was part of ppxConfigDefaults:
        // (If following Option B, you'd do: delete transactionData.onAuthorize; )
    };

  

let data6 = {
    /* Requerido. Email de la cuenta PagoPlux del Establecimiento */
    PayboxRemail: "abautista@pagoplux.com",

    /* Requerido. Email del usuario que realiza el pago */
    PayboxSendmail: email,

    /* Requerido. Nombre del establecimiento en PagoPlux */
    PayboxRename: "BAQ",

    /* Requerido. Nombre del usuario que realiza el pago */
    PayboxSendname: nombre,

    /* Requerido. Monto total de productos o servicios que no aplican impuestos, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 */
    PayboxBase0: monto,

    /* Requerido. Monto total de productos o servicios que aplican impuestos, el valor debe incluir el impuesto, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 posee el valor de los productos con su impuesto incluido */
    PayboxBase12: "0",

    /* Requerido. Descripción del pago */
    PayboxDescription: "Donación para el Banco de Alimentos",

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
    PayBoxClientPhone: telefono,

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
    PayboxIdPlan: 'Bacano',

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


    // onAuthorize: (response: any) => {
    //     if (response.status === "succeeded") {
    //         console.log(response);
    //         // alert("Proceso completado con éxito");
    //         // toast.success("Proceso completado con éxito");
    //         // @ts-ignore
    //         jQuery('.container-unpayed').hide();

    //         window.location.href = "/pagado"
            
    //         console.log(response) //monto
    //         // response.deferred, //diferidos
    //         // response.interest, //tiene intereses
    //         // response.interestValue, //monto intereses
    //         // response.amountWoTaxes, //monto impuestos
    //         // response.cardInfo, //número de tarjeta encriptado
    //         // response.cardIssuer, //marca tarjeta Ejemplo: Visa
    //         // response.cardType, //tipo tarjeta Ejemplo: Crédito
    //         // response.clientID, //identificación tarjetahabiente
    //         // response.clientName, //nombre tarjetahabiente
    //         // response.fecha, //fecha de pago
    //         // response.id_transaccion, //id de transacción pagoplux
    //         // response.state, //estado del pago
    //         // response.token, //voucher del pago
    //         // response.tipoPago //tipo de pago usado
    //     }
    // }
}

console.log('data6', data6);

const ppxButtonElement = <PpxButton data={paymentData} />;
    


    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center py-12 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Resumen de tu <span className="text-orange-500">Donación</span>
            </h1>

            <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Monto */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">
                                Monto a donar
                            </h2>
                            <p className="text-3xl font-bold text-orange-500 mt-1">
                                ${monto}
                            </p>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">
                                Descripción
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {description || 'Donación para el Banco de Alimentos'}
                            </p>
                        </div>

                        {/* Información adicional si la hay */}
                        {email && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-700">
                                    Correo electrónico
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div id="modalPaybox"></div>
                    <div className="flex justify-center">
                        {ppxButtonElement}
                    </div>
                </div>
            </div>
        </div>
    );
}
