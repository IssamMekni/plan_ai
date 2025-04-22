// app/api/images/[filename]/route.ts
import { NextResponse } from 'next/server';
import {  GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filename = params.id;
    
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
    });
    
    const response = await s3.send(command);
    
    if (!response.Body) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    const chunks = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Return the image with proper content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.ContentType || 'image/png',
        // 'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error.message },
      { status: 500 }
    );
  }
}