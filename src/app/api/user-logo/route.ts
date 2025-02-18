import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { ulid } from 'ulid';

export async function POST(request: Request): Promise<NextResponse> {
  if (!request.body) {
    return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
  }

  const imageId = ulid();
  const fileName = `${imageId}.png`;
  // Note: vercel hashes the file name already, so just use a short input name so the final URL isn't too long

  const result = await put(fileName, request.body, {
    access: 'public',
    addRandomSuffix: false,
  });

  return NextResponse.json({ imageId });
}
