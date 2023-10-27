import { NextResponse, type NextRequest } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

export async function GET(req: NextRequest) {
  const fileext = req.nextUrl.searchParams.get("fileext");
  const filetype = req.nextUrl.searchParams.get("filetype");

  const filename = `${
    process.env.OG_IMAGE?.split("/").at(-1)?.split(".")[0]
  }.${fileext}`;

  const signedUrl = s3.getSignedUrl("putObject", {
    Bucket: "spenpo-landing",
    Key: filename,
    Expires: 60,
    ContentType: filetype,
  });

  return NextResponse.json({
    url: signedUrl,
  });
}
