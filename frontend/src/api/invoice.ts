import apiCaller from "../api-config/apiCaller";

const getInvoiceNow = async () => {
    const path = "invoice/";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getHistoryInvoices = async () => {
    const path = "invoice/all";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createInvoice = async () => {
    const path = "invoice/";
    const reponse = await apiCaller("POST", path);
    return reponse;
};

const invoiceApis = {
    getInvoiceNow,
    getHistoryInvoices,
    createInvoice,
};

export default invoiceApis;
