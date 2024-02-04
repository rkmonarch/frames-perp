import { USDCABI } from "@/constants/ABI/usdc";
import { createPublicClient, formatUnits, http } from "viem";
import requestDeposit from "./requestDeposit";
import postCast from "./postCast";

export async function createSCW(pubKey: string) {
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
      if (parseFloat(formattedBalance) < 0.1) {
        const response = await requestDeposit(responseBody.result[0].smartAccountAddress);
        await postCast(response.data.data.id);
      }
      return {
        scw: responseBody.result[0].smartAccountAddress,
        balance: parseFloat(formattedBalance),
      };
    } catch (error) {
      console.log("Error: ", error);
    }
  }