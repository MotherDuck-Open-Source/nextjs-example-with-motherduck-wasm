import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
    // The token provided to the frontend permits read-only access to data in the MotherDuck account.
    return NextResponse.json({ mdToken: process.env.MOTHERDUCK_READONLY_TOKEN || '', expire_at: '' });
}