import { blockedCountries } from './lib/legal/geoblocked';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const countryCode = request.geo?.country;

  if (
    blockedCountries.find((x) => x.toLowerCase() === countryCode?.toLowerCase())
  ) {
    // TODO
    return;
    // return NextResponse.redirect(new URL('/api/auth/geoblocked'));
  }
}
