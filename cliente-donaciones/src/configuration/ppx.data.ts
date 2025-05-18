// src/configuration/ppx.data.ts

/**
 * Default configuration data for PagoPlux.
 * The onAuthorize function defined here is a global-style callback.
 * In a React component, you might define a component-specific callback.
 */

// If you use toast, ensure it's imported and configured in your app.
// import toast from "react-hot-toast";

// If jQuery is used, ensure it's globally available when this onAuthorize is called.
// Consider alternatives for DOM manipulation within a React context.
declare var jQuery: any; // Declare jQuery if it's expected to be global

const data = {
    /* Requerido. Email de la cuenta PagoPlux del Establecimiento */
    PayboxRemail: "abautista@pagoplux.com",

    /* Requerido. Email del usuario que realiza el pago */
    PayboxSendmail: "andresalexander14@hotmail.com",

    /* Requerido. Nombre del establecimiento en PagoPlux */
    PayboxRename: "BAQ",

    /* Requerido. Nombre del usuario que realiza el pago */
    PayboxSendname: "Andres Gaibor",

    /* Requerido. Monto total de productos o servicios que no aplican impuestos, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 */
    PayboxBase0: "10.00",

    /* Requerido. Monto total de productos o servicios que aplican impuestos, el valor debe incluir el impuesto, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 */
    PayboxBase12: "0.00", // Consistent formatting

    /* Requerido. Descripción del pago */
    PayboxDescription: "Prueba de plux",

    /* Requerido Tipo de Ejecución */
    PayboxProduction: false,

    /* Requerido Ambiente de ejecución */
    PayboxEnvironment: "sandbox",

    /* Requerido. Lenguaje del Paybox */
    PayboxLanguage: "es",

    /* Requerido. Identifica el tipo de iframe de pagoplux por defecto true */
    PayboxPagoPlux: true,

    /* Requerido. dirección del tarjetahabiente */
    PayboxDirection: "Riobamba",

    /* Requerido. Teléfono del tarjetahabiente */
    PayBoxClientPhone: "0999999999",

    /* Requerido. Identificación del tarjetahabiente */
    PayBoxClientIdentification: '123456789',

    /* SOLO PARA PAGOS RECURRENTES */
    PayboxRecurrent: false,
    PayboxIdPlan: 'Bacano', // Default, may need to be removed if not recurrent
    PayboxPermitirCalendarizar: true, // Default, may need to be removed if not recurrent
    PayboxPagoInmediato: false, // Default, may need to be removed if not recurrent
    PayboxCobroPrueba: false, // Default, may need to be removed if not recurrent

    /**
     * Default onAuthorize callback.
     * This version uses global navigation and potentially jQuery.
     * A component-specific callback (like in Donacion.tsx) can provide better integration.
     */
    onAuthorize: (response: any) => {
        if (response.status === "succeeded") {
            console.log("Default onAuthorize (ppx.data.ts) - Payment Succeeded:", response);
            // Example: toast.success("Proceso completado con éxito");
            if (typeof jQuery !== 'undefined') {
                jQuery('.container-unpayed').hide();
            } else {
                console.warn("jQuery not defined, cannot hide .container-unpayed");
            }
            // WARNING: This causes a full page reload. For SPAs, router navigation is preferred.
            window.location.href = "/pagado";
        } else {
            console.error("Default onAuthorize (ppx.data.ts) - Payment Failed:", response);
        }
    }
};

export { data };