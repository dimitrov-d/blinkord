import { createActionHeaders } from '@solana/actions';
import { NextRequest, NextResponse } from 'next/server';

export function withActionHeaders(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req);
    const newHeaders = createActionHeaders({ headers: Object.fromEntries(response.headers.entries()) });
    return new NextResponse(response.body, { headers: newHeaders });
  };
}
