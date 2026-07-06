'use client';

import { useState } from 'react';

export function LogoImage() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-base font-light tracking-[0.25em] uppercase text-stone-900">
        SilkLine
      </span>
    );
  }

  return (
    // Plain <img> is intentional: next/image routes through /_next/image which can
    // suppress the browser's onerror on a 404. A direct <img> request fires onerror
    // reliably, giving us a clean fallback when /public/logo.svg is absent.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="SilkLine"
      width={120}
      height={28}
      className="h-7 w-auto"
      onError={() => setFailed(true)}
    />
  );
}
