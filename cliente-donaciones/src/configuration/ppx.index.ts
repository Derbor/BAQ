const iniciarDatos = (dataPago: any) => {
    // @ts-ignore
    if (Data) {
        // @ts-ignore
        Data.init(dataPago);
    }
}
// @ts-ignore
const reload = (data) => {
    // @ts-ignore
    if (Data) {
        // @ts-ignore
        Data.reload(data);
    }
}
export { iniciarDatos, reload };