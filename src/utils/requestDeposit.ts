import axios from "axios";

export default async function requestDeposit(pubKey: string) {
    const request = await axios({
        url: "https://staging-api.fetcch.xyz/v1/transaction-request",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "secret-key": process.env.FETCCH_API_KEY
        },
        data: {
            "receiver": pubKey,
            "actions": [
                {
                    "type": "PAYMENT",
                    "data": {
                        "token": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                        "chain": 2,
                        "receiver": pubKey,
                        "amount": {
                            "amount": "100000",
                            "currency": "CRYPTO"
                        }
                    }
                }
            ],
            "message": "Ferps Checkout",
            "label": "Ferps Checkout",
        }
    });
    console.log("Request: ", request);
    return request;
}
