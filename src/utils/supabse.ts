import { client } from "./supabse_client";

export default async function createUser(fid: number, pubKey: string, privateKey: string, scw: string) {
    try {
        console.log("Creating user");
        const response = await client
            .from("users")
            .insert({ fid, pubKey, privateKey, scw });
            console.log("response", response);
        if (response.statusText === "Created") {
            return response.data;
        }
    } catch (error: any) {
        console.error("Error creating user", error);
    }
}

export async function getUserByFid(fid: number) {
    try {
        const response = await client
            .from("users")
            .select("*")
            .eq("fid", fid);
        if (response.statusText === "OK") {
            return response.data;
        }
    } catch (error: any) {
        console.error("Error getting user", error);
    }
}