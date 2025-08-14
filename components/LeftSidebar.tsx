
import React from "react";
import { styles } from "./styles";
import CrossIcon from "./icons/CrossIcon";
import TrendLineIcon from "./icons/TrendLineIcon";
import FibonacciIcon from "./icons/FibonacciIcon";
import PatternIcon from "./icons/PatternIcon";
import ProjectionIcon from "./icons/ProjectionIcon";
import BrushIcon from "./icons/BrushIcon";

interface LeftSidebarProps {
  setShowSubmenu: (show: boolean) => void;
  setShowFibSubmenu: (show: boolean) => void;
  setShowPatternSubmenu: (show: boolean) => void;
  setShowProjectionSubmenu: (show: boolean) => void;
  setShowBrushesSubmenu: (show: boolean) => void;
  showSubmenu: boolean;
  showFibSubmenu: boolean;
  showPatternSubmenu: boolean;
  showProjectionSubmenu: boolean;
  showBrushesSubmenu: boolean;
}

export default function LeftSidebar({
  setShowSubmenu,
  setShowFibSubmenu,
  setShowPatternSubmenu,
  setShowProjectionSubmenu,
  setShowBrushesSubmenu,
  showSubmenu,
  showFibSubmenu,
  showPatternSubmenu,
  showProjectionSubmenu,
  showBrushesSubmenu,
}: LeftSidebarProps) {
  return (
    <div style={styles.leftColumn}>
      {/* First tool icon */}
      <div style={styles.numberBox}>
        <CrossIcon />
      </div>

      {/* Second tool icon - Trend Line with submenu functionality */}
      <div
        className="submenu-trigger"
        style={styles.numberBox}
        onClick={() => setShowSubmenu(!showSubmenu)}
      >
        <TrendLineIcon />
      </div>

      <div
        className="fib-submenu-trigger"
        style={styles.numberBox}
        onClick={() => setShowFibSubmenu(!showFibSubmenu)}
      >
        <FibonacciIcon />
      </div>

      <div
        className="pattern-submenu-trigger"
        style={styles.numberBox}
        onClick={() => setShowPatternSubmenu(!showPatternSubmenu)}
      >
        <PatternIcon />
      </div>

      <div
        className="projection-submenu-trigger"
        style={styles.numberBox}
        onClick={() => setShowProjectionSubmenu(!showProjectionSubmenu)}
      >
        <ProjectionIcon />
      </div>

      {/* Brushes menu item */}
      <div
        className="brushes-submenu-trigger"
        style={styles.numberBox}
        onClick={() => setShowBrushesSubmenu(!showBrushesSubmenu)}
      >
        <BrushIcon />
      </div>

      <div style={styles.numberBox}>T</div>

      <div style={styles.numberBox}>
        <i className="fa-solid fa-ruler"></i>
      </div>
    </div>
  );
}
