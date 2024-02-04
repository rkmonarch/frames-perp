import { VercelRequest, VercelResponse } from "@vercel/node";
import getAddrByFid from "@/utils/getAddrByFid";
import { createSCW } from "@/utils/createSCW";
import createUser, { getUserByFid } from "@/utils/supabse";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: VercelRequest, res: VercelResponse) {

  if (req.method == "POST") {
    try {     
      const fid = req.body.untrustedData.fid;
      const privateKey = generatePrivateKey();
      const address = privateKeyToAccount(privateKey);
      const userAddress = await getAddrByFid(fid)
      const scw = await createSCW(userAddress)
      const exists = await getUserByFid(fid);

      if (exists!.length > 0 && exists![0].fid === fid) {
        console.log("User already exists");
      } else {
        await createUser(fid, address.address, privateKey, scw)
      }

      res.status(200).setHeader("Content-Type", "text/html").send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content="Instant Checkout powered by Fetcch" />
          <meta
            property="og:image"
            content="https://instant-checkout-farcaster.vercel.app/img/checkout.png"
          />
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content="https://instant-checkout-farcaster.vercel.app/img/checkout.png"
          />
          <meta
            property="fc:frame:button:1"
            content="Check your notification box"
          />
          <meta
            name="fc:frame:post_url"
            content="https://b3bd-125-99-228-169.ngrok-free.app/api/checkout"
          />
        </head>
      </html>
    `);
    } catch (error: any) {
      res.status(500).send(`Error: ${error.message}`);
    }
  } else {
    // If the request is not a POST, we know that we're not dealing with a
    // Farcaster Frame button click. Therefore, we should send the Farcaster Frame
    // content
    res.status(200).setHeader("Content-Type", "text/html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="Instant Perp by rkmonarch" />
        <meta
          property="og:image"
          content="https://instant-checkout-farcaster.vercel.app/img/fetcch.png"
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://instant-checkout-farcaster.vercel.app/img/fetcch.png"
        />
        <meta property="fc:frame:button:1" content="let's get started" />
        <meta
          name="fc:frame:post_url"
          content="https://b3bd-125-99-228-169.ngrok-free.app/api/checkout"
        />
      </head>
    </html>
    `);
  }
}