import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const API_KEY = 'qso5WrFHLQu2hUtTU5VP7rmX';

    // Prepare data specifically for the Remove.bg format
    const externalFormData = new FormData();
    externalFormData.append('image_file', image);
    externalFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': API_KEY },
      body: externalFormData,
    });

    // --- DEBUGGING LOGS ---
    if (!response.ok) {
      const errorDetail = await response.json();
      console.error('Remove.bg API Error:', errorDetail);
      
      // Check for specific error: "Insufficient Credits"
      if (response.status === 402 || (errorDetail.errors && errorDetail.errors[0].code === 'insufficient_credits')) {
        return NextResponse.json({ error: 'You have run out of free credits!' }, { status: 402 });
      }
      
      return NextResponse.json({ error: errorDetail.errors[0].title || 'AI Service Error' }, { status: response.status });
    }

    const blob = await response.blob();
    return new NextResponse(blob, { headers: { 'Content-Type': 'image/png' } });

  } catch (error) {
    console.error('Full System Error:', error);
    return NextResponse.json({ error: 'Server crashed. Check your console.' }, { status: 500 });
  }
}