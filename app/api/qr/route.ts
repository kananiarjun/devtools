import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const { text, size = 200 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      text,
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
