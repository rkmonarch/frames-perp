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
            content="Polygon ${response?.Polygon}"
          />
          <meta
            name="fc:frame:post_url"
            content=""
          />
          <meta
          property="fc:frame:button:2"
          content="Ethereum TVL"
        />
        <meta
          name="fc:frame:post_url"
          content=""
        />
        <meta
        property="fc:frame:button:3"
        content="Base TVL"
      />
      <meta
        name="fc:frame:post_url"
        content=""
      />
        </head>
      </html>
    `);
    }

}

// ImageResponse(
//     (
//       <div
//         style={{
//           display: "flex",
//           backgroundColor: "black",
//           flexDirection: "column",
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <img
//           src={getIPFSLink(getRawURL(profile?.coverPicture))}
//           style={{
//             height: "400px",
//             width: "100%",
//           }}
//         />
//         <div
//           style={{
//             display: "flex",
//             paddingLeft: "32px",
//             paddingRight: "32px",
//           }}
//         >
//           <img
//             src={getIPFSLink(getRawURL(profile?.picture))}
//             alt=""
//             style={{
//               borderColor: "black",
//               border: "6px",
//               height: "200px",
//               width: "200px",
//               marginTop: "-50px",
//               borderRadius: "100%",
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               marginLeft: "24px",
//             }}
//           >
//             <h3
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "bold",
//                 color: "white",
//                 lineHeight: "36px",
//               }}
//             >
//               {formatHandle(profile?.handle)}
//             </h3>
//             <p
//               style={{
//                 fontSize: "20px",
//                 color: "gray",
//                 marginTop: "-16px",
//                 lineClamp: 1,
//               }}
//             >
//               {profile?.bio}
//             </p>
//           </div>
//         </div>
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//     }
//   );
// } catch (e) {
//   console.log(e);
//   return new Response(`Failed to generate the image`, {
//     status: 500,
//   });
// }
// }