
import { SVGIconProps } from "../types";

export default function FibonacciIcon({ width = 28, height = 28 }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width={width} height={height}>
      <g fill="currentColor" fillRule="nonzero">
        <path d="M3 5h22v-1h-22z"></path>
        <path d="M3 17h22v-1h-22z"></path>
        <path d="M3 11h19.5v-1h-19.5z"></path>
        <path d="M5.5 23h19.5v-1h-19.5z"></path>
        <path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
      </g>
    </svg>
  );
}
