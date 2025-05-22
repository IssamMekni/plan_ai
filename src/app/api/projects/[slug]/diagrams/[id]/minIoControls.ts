import plantumlEncoder from "plantuml-encoder";
import {  PutObjectCommand ,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
// import { s3 } from "@/lib/s3";

export async function deleteImageFromStorage(filename: string) {
  try {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
    };
    
    await s3.send(new DeleteObjectCommand(deleteParams));
    return true;
  } catch (error) {
    console.error("Error deleting image from storage:", error);
    throw error;
  }
}
export async function code2imgl(code: string) {
  const encoded = plantumlEncoder.encode(code);
  const plantumlServer = process.env.PLANTUML_SERVER; 
  const response = await fetch(`${plantumlServer}/svg/${encoded}`);
  if (!response.ok) {
    throw new Error("Failed to fetch from PlantUML server");
  }
  const imageBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(imageBuffer);
  return buffer;
}
export async function img2url({
    buffer,
    filename,
  }: {
    buffer: Buffer;
    filename: string;
  }) {
    try {
      const contentType = "image/svg+xml";
      const uploadParams = {
        Bucket: process.env.S3_BUCKET!,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      };
      await s3.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      console.error("Error in img2url:", error);
      throw error;
    }
  }
  

