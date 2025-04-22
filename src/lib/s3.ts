import { S3Client } from "@aws-sdk/client-s3";
export  const s3 = new S3Client({
    region: "tn",
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true, // Required for MinIO
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
  });