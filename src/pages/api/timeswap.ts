import { VercelRequest, VercelResponse } from "@vercel/node";
import timeSwap from "@/utils/timeswap";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: VercelRequest, res: VercelResponse) {
    console.log("Fetching timeswap data",req.method);

    if (req.method == "GET") {
    const response = await timeSwap();

    console.log("Timeswap data fetched successfully", response);
        
      res.status(200).setHeader("Content-Type", "text/html").send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content="Instant perp by rkmonarch" />
          <meta
            property="og:image"
            content="https://frames-perp.vercel.app/timeswap.png"
          />
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content="https://frames-perp.vercel.app/timeswap.png"
          />
          <meta
            property="fc:frame:button:1"
            content="Matic ${formatInteraction(response.Polygon)}"
          />
          <meta
            name="fc:frame:post_url"
            content=""
          />
          <meta
          property="fc:frame:button:2"
          content="Ethereum ${formatInteraction(response.Ethereum)}"
        />
        <meta
          name="fc:frame:post_url"
          content=""
        />
        <meta
        property="fc:frame:button:3"
        content="Optimism ${formatInteraction(response.Optimism)}"
      />
      <meta
        name="fc:frame:post_url"
        content=""
      /> 
      <meta
      name="fc:frame:post_url"
      content=""
    />
    <meta
    property="fc:frame:button:4"
    content="Arbitrum ${formatInteraction(response.Arbitrum)}"
  />
        </head>
      </html>
    `);
    }

}

function formatInteraction(value: number) {
  let result = "";
  if (value > 1000000) {
    result = (value / 1000000).toFixed(2) + "M";
  } else if (value > 1000) {
    result = (value / 1000).toFixed(2) + "K";
  } else {
    result = value?.toString();
  }
  return result;
}