import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <defs>
      <clipPath id="a">
        <rect width={20} height={20} rx={0} />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m4.699 5.734 10.466.011 1.3.002L13.518.642l-8.82 5.092Zm9.167-1.49-.897-1.553-2.683 1.55 3.58.003Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.917 5.833V17.5q0 .656.463 1.12.464.463 1.12.463h15q.656 0 1.12-.463.463-.464.463-1.12V5.833q0-.656-.464-1.12-.463-.463-1.12-.463h-15q-.655 0-1.119.464-.463.463-.463 1.12ZM2.5 17.583q-.083 0-.083-.083V5.833q0-.083.083-.083h15q.083 0 .083.083V17.5q0 .083-.083.083h-15Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.623 9.65q-.873.832-.873 2.017 0 1.184.873 2.016.858.817 2.065.817h4.395V8.833h-4.395q-1.207 0-2.065.817Zm1.035 2.947q-.408-.389-.408-.93 0-.542.408-.93.423-.404 1.03-.404h2.895V13h-2.895q-.607 0-1.03-.403Z"
      />
      <path fill="#FFF" fillRule="evenodd" d="M17.583 6.125v11.5h1.5v-11.5h-1.5Z" />
    </g>
  </svg>
);
export default SvgComponent;
