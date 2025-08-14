
export interface Settings {
  lastPrice: boolean;
  highPrice: boolean;
  lowPrice: boolean;
  reverseCoord: boolean;
  gridShow: boolean;
}

export interface MenuPosition {
  top: number;
  left: number;
}

export interface SubmenuItemProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface SVGIconProps {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}
