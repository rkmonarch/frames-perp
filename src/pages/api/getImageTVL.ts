import { ImageResponse, NextRequest } from "next/server";
import formatHandle from "@/utils/formatHandle";
import getIPFSLink from "@/utils/getIPFSLink";
import getRawURL from "@/utils/getRawURL";

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
  
      const hasTitle = searchParams.has("handle");
  
      if (!hasTitle) {
        return new ImageResponse(
          (
            <img
              src={
                "https://images.unsplash.com/photo-1614854262409-bc319cba5802?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          )
        );
      }
  
      const handle = searchParams.get("handle")?.slice(1);
      const profile = await getProfile(handle!);
  
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              backgroundColor: "black",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={getIPFSLink(getRawURL(profile?.coverPicture))}
              style={{
                height: "400px",
                width: "100%",
              }}
            />
            <div
              style={{
                display: "flex",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
            >
              <img
                src={getIPFSLink(getRawURL(profile?.picture))}
                alt=""
                style={{
                  borderColor: "black",
                  border: "6px",
                  height: "200px",
                  width: "200px",
                  marginTop: "-50px",
                  borderRadius: "100%",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "white",
                    lineHeight: "36px",
                  }}
                >
                  {formatHandle(profile?.handle)}
                </h3>
                <p
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    marginTop: "-16px",
                    lineClamp: 1,
                  }}
                >
                  {profile?.bio}
                </p>
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } catch (e) {
      console.log(e);
      return new Response(`Failed to generate the image`, {
        status: 500,
      });
    }
  }