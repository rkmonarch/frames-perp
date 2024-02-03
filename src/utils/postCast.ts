import axios from "axios";

export default async function postCast(id: number) {
    const postCast = await axios({
        url: "https://api.neynar.com/v2/farcaster/cast",
        method: "POST",
        headers: {
            "content-type": "application/json",
            "api_key": process.env.NEYNAR_API_KEY
        },
        data: {
            "signer_uuid": process.env.SIGNER_UUID,
            "text": `Instant checkout by Fetcch, link - https://request.fetcch.xyz/request/${id}}`
        }
    })
}