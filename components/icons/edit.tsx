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
        d="M6.52 15.309H16.6v1.266H2v-3.252L13.139 2.184Q13.324 2 13.586 2t.448.185l2.357 2.357q.185.186.185.448t-.185.448l-9.87 9.87ZM12.124 4.99l1.462-1.461 1.461 1.461-1.461 1.462-1.32-1.32-.142-.142ZM3.268 15.31v-1.462l7.962-7.961 1.461 1.461L4.73 15.31H3.267Z"
      />
    </g>
  </svg>
);
export default SvgComponent;
