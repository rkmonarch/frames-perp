import { VercelRequest, VercelResponse } from "@vercel/node";
import getAddrByFid from "@/utils/getAddrByFid";
import { createSCW } from "@/utils/createSCW";
import createUser, { getUserByFid } from "@/utils/supabse";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method != "GET") {
    try {
      const fid = req.body.untrustedData.fid;
      const privateKey = generatePrivateKey();
      const address = privateKeyToAccount(privateKey);
      const userAddress = await getAddrByFid(fid)
      const scw = await createSCW(userAddress)
      const exists = await getUserByFid(fid);

      if (exists!.length > 0 && exists![0].fid === fid) {
      } else {
        await createUser(fid, address.address, privateKey, scw?.scw)
      }
      console.log("SCW balance", scw?.balance);

      if (scw!.balance < 0.2) {
        res.status(200).setHeader("Content-Type", "text/html").send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content="Instant perp by rkmonarch" />
          <meta
            property="og:image"
            content="https://frames-perp.vercel.app/deposit.png"
          />
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content="https://frames-perp.vercel.app/deposit.png"
          />
          <meta
            property="fc:frame:button:1"
            content="Check your notification box"
          />
          <meta
            name="fc:frame:post_url"
            content=""
          />
        </head>
      </html>
    `);
      } else {
        res.status(200).setHeader("Content-Type", "text/html").send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content="Instant perp by rkmonarch" />
          <meta
            property="og:image"
            content="https://frames-perp.vercel.app/trade.png"
          />
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content="https://frames-perp.vercel.app/trade.png"
          />
          <meta
            property="fc:frame:button:1"
            content="Long"
          />
          <meta
            name="fc:frame:post_url"
            content=""
          />
          <meta
          property="fc:frame:button:2"
          content="Short"
        />
        <meta
          name="fc:frame:post_url"
          content=""
        />
        <meta
        property="fc:frame:button:3"
        content="Cancel"
      />
      <meta
        name="fc:frame:post_url"
        content=""
      />
    <meta
    property="fc:frame:button:4"
    content="Withdraw"
  />
  <meta
    name="fc:frame:post_url"
    content=""
  />
        </head>
      </html>
    `);
      }
    } catch (error: any) {
      res.status(500).send(`Error: ${error.message}`);
    }
  } else {
    res.status(200).setHeader("Content-Type", "text/html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="Instant Ferps by rkmonarch" />
        <meta
          property="og:image"
          content="https://frames-perp.vercel.app/welcome.png"
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://frames-perp.vercel.app/welcome.png"
        />
        <meta property="fc:frame:button:1" content="let's get started" />
        <meta
          name="fc:frame:post_url"
          content="https://09da-2409-40f2-1029-f477-519f-23c9-b4c0-af30.ngrok-free.app/api/checkout"
        />   
      </head>
    </html>
    `);
  }
}