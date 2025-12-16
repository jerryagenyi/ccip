import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <circle cx="50" cy="50" r="50" fill="hsl(var(--primary))" />
      <g stroke="hsl(var(--primary-foreground))" strokeWidth="12" strokeLinecap="round">
        <line x1="25" y1="50" x2="75" y2="50" />
        <line x1="32" y1="65" x2="68" y2="65" />
      </g>
    </svg>
  );
}
