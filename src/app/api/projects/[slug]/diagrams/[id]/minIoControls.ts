import plantumlEncoder from "plantuml-encoder";
import {  PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
export async function code2imgl(code: string) {
  const encoded = plantumlEncoder.encode(code);
  const plantumlServer = process.env.PLANTUML_SERVER; 
  const response = await fetch(`${plantumlServer}/png/${encoded}`);
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
      const contentType = "image/png";
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
  

