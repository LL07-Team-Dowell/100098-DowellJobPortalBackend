export const encryptPayload = (payload) => {
    if (typeof payload !== 'object') throw Error("Please pass a valid object");

    const payloadToEncrypt = process.env.REACT_APP_TEST_KEY + JSON.stringify(payload) + process.env.REACT_APP_TEST_KEY_2;

    const encryptedPayload = btoa(payloadToEncrypt);

    return encryptedPayload;
}