export default async function timeSwap() {
    const url = "https://api.llama.fi/protocol/timeswap";
    try {
        console.log("Fetching timeswap data");
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        const data = await response.json();
        console.log("Timeswap data fetched successfully", data);
        return data;

    } catch (error) {
        console.error("Error fetching timeswap data", error);
    }
}