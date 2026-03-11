import { NextResponse } from 'next/server';
import ytDlp from 'yt-dlp-exec';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

// Define the absolute path to the yt-dlp binary using require.resolve for better reliability in Next.js
// Define a robust way to find the yt-dlp binary
const getBinaryPath = () => {
  const locations = [
    // 1. Try require.resolve
    (() => {
      try { return path.join(path.dirname(require.resolve('yt-dlp-exec/package.json')), 'bin', 'yt-dlp.exe'); } catch (e) { return null; }
    })(),
    // 2. Try absolute project path based on what we know of the user's system
    'D:\\Projects\\Full Stack Developing\\Project\\Next\\devtools\\node_modules\\yt-dlp-exec\\bin\\yt-dlp.exe',
    // 3. Try relative to process.cwd()
    path.join(process.cwd(), 'node_modules', 'yt-dlp-exec', 'bin', 'yt-dlp.exe'),
    // 4. Fallback to just the command name
    'yt-dlp.exe'
  ];

  for (const loc of locations) {
    if (loc && fs.existsSync(loc)) return loc;
  }
  return 'yt-dlp.exe';
};

const binaryPath = getBinaryPath();
console.log('Resolved yt-dlp path:', binaryPath);

// Create a custom instance of yt-dlp with the absolute path
const ytdlp = (ytDlp as any).create(binaryPath);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Extract metadata using our custom ytdlp instance
    const metadata = await ytdlp(url, {
      dumpJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      noCheckCertificate: true,
    }) as any;

    if (!metadata) {
      throw new Error('Failed to extract metadata');
    }

    // Filter and normalize formats
    // We prioritize formats that have both video and audio, or we can use yt-dlp's merging if needed, 
    // but for simple downloads, pre-merged formats are better.
    const formats = (metadata.formats || [])
      .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4')
      .map((f: any) => ({
        quality: f.format_note || f.quality_label || `${f.height}p`,
        container: f.ext,
        itag: f.format_id, // We'll use format_id as our itag equivalent
        size: f.filesize ? (f.filesize / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown',
        height: f.height || 0
      }))
      .sort((a: any, b: any) => b.height - a.height);

    // If no bundled MP4s, just grab whatever yt-dlp thinks is best
    const finalFormats = formats.length > 0 ? formats : [
      {
        quality: 'Best Available',
        container: metadata.ext || 'mp4',
        itag: 'best',
        size: 'Unknown',
        height: 0
      }
    ];

    return NextResponse.json({
      title: metadata.title || 'Unknown Title',
      author: metadata.uploader || metadata.channel || 'Unknown Author',
      duration: metadata.duration || 0,
      thumbnail: metadata.thumbnail || metadata.thumbnails?.at(-1)?.url,
      formats: finalFormats.slice(0, 5),
      source: metadata.extractor_key || 'Unknown'
    });
  } catch (error: any) {
    console.error('Multi-source info error:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Failed to fetch video info';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const itag = searchParams.get('itag');

  if (!url || !itag) {
    return NextResponse.json({ error: 'URL and format selection are required' }, { status: 400 });
  }

  try {
    // For streaming, we'll use a child process to call yt-dlp directly and pipe its output
    // This is more efficient for large files and bypasses many memory limits.
    const args = [
      url,
      '-f', itag === 'best' ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' : itag,
      '-o', '-', // Output to stdout
      '--no-playlist',
      '--no-warnings'
    ];

    // Note: We need the actual path to yt-dlp if it's not in PATH, 
    // but yt-dlp-exec usually handles downloading a binary.
    // However, spawning a child process is cleaner for streaming to a NextResponse.

    // We can use a simpler approach with yt-dlp-exec if it supports streaming, 
    // but most implementations benefit from direct spawn for piping.

    const ytDlpProcess = spawn(binaryPath, args);

    const stream = new ReadableStream({
      start(controller) {
        ytDlpProcess.stdout.on('data', (chunk) => controller.enqueue(chunk));
        ytDlpProcess.stdout.on('end', () => controller.close());
        ytDlpProcess.stderr.on('data', (data) => console.error(`yt-dlp stderr: ${data}`));
        ytDlpProcess.on('error', (err) => controller.error(err));
      },
      cancel() {
        ytDlpProcess.kill();
      }
    });

    const response = new NextResponse(stream as any);
    response.headers.set('Content-Type', 'video/mp4');
    response.headers.set('Content-Disposition', `attachment; filename="video.mp4"`);

    return response;
  } catch (error: any) {
    console.error('Multi-source stream error:', error);
    return NextResponse.json({ error: 'Failed to stream video content' }, { status: 500 });
  }
}