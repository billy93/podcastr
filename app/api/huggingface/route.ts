import { NextResponse } from "next/server";
import {ElevenLabsClient} from "elevenlabs";
import { Readable } from "stream";

export const POST = async (request: Request) => {
    try{
        const { input } = await request.json();

        const token = process.env.HUGGINGFACE_API_KEY

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({"inputs": input}),
            }
          );

          // Convert the response to a Blob
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        // Respond with the image as a buffer
        const imageName = `thumbnail.png`;
        const imageBuffer = Buffer.from(buffer);

        // Return the image as part of the response
        return new Response(imageBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${imageName}"`,
          },
          status: 200,
        });
    } catch (error: any) {
        console.log("ERROR : ", error)
        return NextResponse.json({ error: error.message })
    }
}