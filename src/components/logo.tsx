import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      d="M9.5 3c-1.2 0-2.3.6-3 1.5A3.5 3.5 0 003.5 8v8a3.5 3.5 0 003 3.5c.7.9 1.8 1.5 3 1.5"
      style={{
        stroke: 'hsl(var(--primary))',
      }}
    />
    <path
      d="M14.5 3c1.2 0 2.3.6 3 1.5A3.5 3.5 0 0120.5 8v8a3.5 3.5 0 01-3 3.5c-.7.9-1.8 1.5-3 1.5"
      style={{
        stroke: 'hsl(var(--primary))',
      }}
    />
    <path
      d="M11 7h-1"
      style={{
        stroke: 'hsl(var(--chart-4))',
      }}
    />
    <path
      d="M12 17V7"
      style={{
        stroke: 'hsl(var(--foreground))',
      }}
    />
    <path
      d="M14 17V7h-1"
      style={{
        stroke: 'hsl(var(--chart-4))',
      }}
    />
  </svg>
);
