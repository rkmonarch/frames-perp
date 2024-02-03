import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios"
import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import { USDCABI } from "../../constants/ABI/usdc";
import getAddrByFid from "@/utils/getAddrByFid";
import { createSCW } from "@/utils/createSCW";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: VercelRequest, res: VercelResponse) {

  if (req.method == "POST") {
    try {
      console.log("req.body", req.body);

      const fid = req.body.untrustedData.fid;
      const userAddress = await getAddrByFid(fid)
      const scw = await createSCW(userAddress)

      const postCast = await axios({
        url: "https://api.neynar.com/v2/farcaster/cast",
        method: "POST",
        headers: {
          "content-type": "application/json",
          "api_key": process.env.NEYNAR_API_KEY
        },
        data: {
          "signer_uuid": process.env.SIGNER_UUID,
          "text": ``
        }
      })

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
            content="https://ba43-2409-40f2-6-551b-3596-3721-1eda-2ec6.ngrok-free.app/api/checkout"
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
          content="https://ba43-2409-40f2-6-551b-3596-3721-1eda-2ec6.ngrok-free.app/api/checkout"
        />
      </head>
    </html>
    `);
  }
}