import { NextResponse, NextRequest } from 'next/server';

const validLevels = ['debug', 'info', 'warn', 'error'];

export async function POST(request: NextRequest) {
  let body: any;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid JSON body', statusCode: 400 } },
      { status: 400 },
    );
  }

  const { level, message, context } = body ?? {};

  if (!level || !validLevels.includes(level)) {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid or missing level', statusCode: 400 } },
      { status: 400 },
    );
  }

  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { success: false, error: { message: 'Missing message', statusCode: 400 } },
      { status: 400 },
    );
  }

  // For now, log to the server console.
  // Later, this could write to a file or DB.
  console.log(`[${level.toUpperCase()}] ${message}`, context ?? '');

  return NextResponse.json({
    success: true,
    data: { received: true, level, message },
  });
}