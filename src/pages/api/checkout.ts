import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios"
import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import {USDCABI} from "../../constants/ABI/usdc";

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
    } catch (error:any) {
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

// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
async function getAddrByFid(fid: number) {
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
    return users.verifications[0]
  }
  return "0x0000000000000000000000000000000000000000";
}

async function createSCW(pubKey: string){
  console.log("Creating SCW for user: ", pubKey);
  try {
   const res = await fetch(`https://rpc.particle.network/evm-chain?chainId=137&projectUuid=${process.env.BICONOMY_PROJECT_UUID}&projectKey=${process.env.BICONOMY_KEY}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "chainId": 137,
        "jsonrpc": "2.0",
        "id": process.env.BICONOMY_PROJECT_UUID,
        "method": "particle_biconomy_getSmartAccount",
        "params": [
          "1.0.0",
          [pubKey]
        ]
      })
    })
    const responseBody = await res.json(); 
    console.log("scw: ", responseBody.result[0].smartAccountAddress);

    const rpc = createPublicClient({
      transport: http("https://rpc.ankr.com/polygon"),
    });

    const balance = await rpc.readContract({
      abi: USDCABI,
      address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      functionName: "balanceOf",
      args: [responseBody.result[0].smartAccountAddress],
    });
    console.log("Balance: ", formatUnits(balance, 6));
    const formattedBalance = formatUnits(balance, 6);
    console.log("Formatted Balance: ", parseFloat(formattedBalance) );
    if (parseFloat(formattedBalance) < 0.2) {
    const response =  await requestDeposit(pubKey);
    await postCast(response.data.data.id);
    }
    return responseBody.result[0].smartAccountAddress;
    
  } catch (error) {
    console.log("Error: ", error);
}}

async function requestDeposit(pubKey:string){
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
        "message": "Frames Perp Checkout",
        "label": "Frames Perp Checkout",
    }
  });
  console.log("Request: ", request);
  return request;
}


async function postCast(id:number){
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