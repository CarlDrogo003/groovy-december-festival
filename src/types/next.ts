import { NextRequest, NextResponse } from 'next/server';

// Types for Next.js App Router
export type RouteHandler<T = Record<string, string>> = (
  request: NextRequest,
  context: { params: T }
) => Promise<NextResponse> | NextResponse;