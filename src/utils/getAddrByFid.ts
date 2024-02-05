export default async function getAddrByFid(fid: number) {
    console.log("Extracting address for FID: ", fid);
    const options = {
      method: "GET",
      url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY || "",
      },
    };
    console.log("Fetching user address from Neynar API");
    const resp = await fetch(options.url, { headers: options.headers });
    console.log("Response: ", resp);
    const responseBody = await resp.json(); 
    if (responseBody.users) {
      const users = responseBody.users[0];
      return {
        address: users.verifications[0],
        handle: users.username,
      }
    }
    return "0x0000000000000000000000000000000000000000";
  }