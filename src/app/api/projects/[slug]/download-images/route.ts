import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { Readable } from "stream";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/nextAuth";
import getProject from "@/db/getProjectById";
import plantumlEncoder from "plantuml-encoder";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     // التحقق من الجلسة (اختياري)
//     // const session = await getServerSession(authOptions);
//     // if (!session) {
//     //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     // }

//     // الحصول على المشروع
//     const project = await getProject(params.slug);
//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 });
//     }

//     // التحقق من صاحب المشروع (اختياري)
//     // if (project.userId !== session.user.id) {
//     //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     // }

//     // إنشاء روابط الصور
//     const imageUrls = project.diagrams.map((diagram) => {
//       const encoded = plantumlEncoder.encode(diagram.code);
//       const plantumlServer = process.env.PLANTUML_SERVER;
//       return `${plantumlServer}/png/${encoded}`;
//     });

//     // التحقق من وجود صور
//     if (imageUrls.length === 0) {
//       return NextResponse.json({ error: "No images found" }, { status: 404 });
//     }

//     // إنشاء الـ zip archive
//     const archive = archiver("zip", { 
//       zlib: { level: 9 } // أقصى ضغط
//     });

//     // إنشاء ReadableStream للاستجابة
//     const stream = new ReadableStream({
//       start(controller) {
//         // إرسال البيانات إلى الـ controller
//         archive.on("data", (chunk) => {
//           controller.enqueue(new Uint8Array(chunk));
//         });

//         // إنهاء الـ stream عند اكتمال الأرشيف
//         archive.on("end", () => {
//           controller.close();
//         });

//         // التعامل مع الأخطاء
//         archive.on("error", (err) => {
//           console.error("Archive error:", err);
//           controller.error(err);
//         });
//       },
//     });

//     // تحميل الصور وإضافتها للأرشيف
//     const downloadPromises = imageUrls.map(async (url, index) => {
//       try {
//         const response = await fetch(url, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch image ${index + 1}: ${response.status}`);
//         }

//         const arrayBuffer = await response.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
        
//         // تحديد امتداد الملف
//         const contentType = response.headers.get('content-type');
//         let extension = 'png'; // افتراضي
        
//         if (contentType?.includes('jpeg') || contentType?.includes('jpg')) {
//           extension = 'jpg';
//         } else if (contentType?.includes('png')) {
//           extension = 'png';
//         } else if (contentType?.includes('svg')) {
//           extension = 'svg';
//         }

//         // إضافة الصورة للأرشيف
//         archive.append(buffer, { 
//           name: `diagram_${index + 1}.${extension}` 
//         });

//         console.log(`Added image ${index + 1} to archive`);
//       } catch (error) {
//         console.error(`Error downloading image ${index + 1}:`, error);
//         // إضافة ملف نصي بدلاً من الصورة المفقودة
//         archive.append(`Error loading image: ${error.message}`, { 
//           name: `error_image_${index + 1}.txt` 
//         });
//       }
//     });

//     // انتظار تحميل جميع الصور
//     await Promise.all(downloadPromises);

//     // إنهاء الأرشيف
//     archive.finalize();

//     // إرجاع الاستجابة مع الملف المضغوط
//     return new NextResponse(stream, {
//       headers: {
//         "Content-Type": "application/zip",
//         "Content-Disposition": `attachment; filename="${project.name || 'diagrams'}.zip"`,
//         "Content-Length": archive.pointer().toString(),
//       },
//     });

//   } catch (error) {
//     console.error("Error creating zip file:", error);
//     return NextResponse.json(
//       { error: "Internal server error" }, 
//       { status: 500 }
//     );
//   }
// }

// نسخة بديلة باستخدام Node.js streams (إذا كان الأول لا يعمل)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string}> }
) {
  try {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const images = project.diagrams.map((diagram) => {
      const encoded = plantumlEncoder.encode(diagram.code);
      const plantumlServer = process.env.PLANTUML_SERVER;
      return {name: diagram.name, url: `${plantumlServer}/png/${encoded}`};
    });

    // إنشاء buffer للاحتفاظ بمحتوى الـ zip
    const chunks: Buffer[] = [];
    
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    // جمع البيانات في الـ buffer
    archive.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // عند اكتمال الأرشيف
    const archivePromise = new Promise<Buffer>((resolve, reject) => {
      archive.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      
      archive.on("error", (err) => {
        reject(err);
      });
    });

    // تحميل الصور وإضافتها
    for (const [index, img] of images.entries()) {
      try {
        const response = await fetch(img.url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          archive.append(buffer, { name: `${img.name}.png` });
        }
      } catch (error) {
        console.error(`Error with image ${index + 1}:`, error);
      }
    }

    // إنهاء الأرشيف
    archive.finalize();

    // انتظار اكتمال الأرشيف
    const zipBuffer = await archivePromise;

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${project.name || 'diagrams'}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}