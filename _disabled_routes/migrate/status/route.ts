import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Car status migration is not needed because the project now uses is_active',
  });
}
