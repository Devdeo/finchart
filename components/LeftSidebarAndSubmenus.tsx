
import { useRef } from "react";
import { styles } from "../styles/styles";

interface LeftSidebarAndSubmenusProps {
  showSubmenu: boolean;
  setShowSubmenu: (value: boolean) => void;
  showFibSubmenu: boolean;
  setShowFibSubmenu: (value: boolean) => void;
  showPatternSubmenu: boolean;
  setShowPatternSubmenu: (value: boolean) => void;
  showProjectionSubmenu: boolean;
  setShowProjectionSubmenu: (value: boolean) => void;
  showBrushesSubmenu: boolean;
  setShowBrushesSubmenu: (value: boolean) => void;
  submenuRef: any;
  fibSubmenuRef: any;
  patternSubmenuRef: any;
  projectionSubmenuRef: any;
  brushesSubmenuRef: any;
}

export default function LeftSidebarAndSubmenus({
  showSubmenu,
  setShowSubmenu,
  showFibSubmenu,
  setShowFibSubmenu,
  showPatternSubmenu,
  setShowPatternSubmenu,
  showProjectionSubmenu,
  setShowProjectionSubmenu,
  showBrushesSubmenu,
  setShowBrushesSubmenu,
  submenuRef,
  fibSubmenuRef,
  patternSubmenuRef,
  projectionSubmenuRef,
  brushesSubmenuRef,
}: LeftSidebarAndSubmenusProps) {
  return (
    <>
      <div style={styles.leftColumn}>
        {/* First tool icon */}
        <div style={styles.numberBox}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
            <g fill="currentColor">
              <path d="M18 15h8v-1h-8z"></path>
              <path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"></path>
            </g>
          </svg>
        </div>

        {/* Second tool icon - Trend Line with submenu functionality */}
        <div
          className="submenu-trigger"
          style={styles.numberBox}
          onClick={() => setShowSubmenu(!showSubmenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
            <g fill="currentColor" fillRule="nonzero">
              <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
              <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
            </g>
          </svg>
        </div>

        <div
          className="fib-submenu-trigger"
          style={styles.numberBox}
          onClick={() => setShowFibSubmenu(!showFibSubmenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
            <g fill="currentColor" fillRule="nonzero">
              <path d="M3 5h22v-1h-22z"></path>
              <path d="M3 17h22v-1h-22z"></path>
              <path d="M3 11h19.5v-1h-19.5z"></path>
              <path d="M5.5 23h19.5v-1h-19.5z"></path>
              <path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
            </g>
          </svg>
        </div>

        <div
          className="pattern-submenu-trigger"
          style={styles.numberBox}
          onClick={() => setShowPatternSubmenu(!showPatternSubmenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
            <g fill="currentColor" fillRule="nonzero">
              <path d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
              <path d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
            </g>
          </svg>
        </div>

        <div
          className="projection-submenu-trigger"
          style={styles.numberBox}
          onClick={() => setShowProjectionSubmenu(!showProjectionSubmenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path>
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path>
          </svg>
        </div>

        {/* Brushes menu item */}
        <div
          className="brushes-submenu-trigger"
          style={styles.numberBox}
          onClick={() => setShowBrushesSubmenu(!showBrushesSubmenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
            <g fill="currentColor" fillRule="nonzero">
              <path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path>
              <path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path>
            </g>
          </svg>
        </div>

        <div style={styles.numberBox}>T</div>

        <div style={styles.numberBox}>
          <i className="fa-solid fa-ruler"></i>
        </div>
      </div>

      {/* Submenu - positioned absolutely to not affect layout */}
      {showSubmenu && (
        <div ref={submenuRef} style={styles.submenu}>
          {/* Trend Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Trend Line</span>
          </div>

          {/* Ray */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M8.354 20.354l5-5-.707-.707-5 5z"></path>
                <path d="M16.354 12.354l8-8-.707-.707-8 8z"></path>
                <path d="M14.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM6.5 23c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Ray</span>
          </div>

          {/* Info Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero" clipRule="evenodd">
                <path d="M22.4989 4C21.6705 4 20.9989 4.67157 20.9989 5.5C20.9989 5.91456 21.1664 6.28904 21.4387 6.56106C21.7106 6.83282 22.0848 7 22.4989 7C23.3274 7 23.9989 6.32843 23.9989 5.5C23.9989 4.67157 23.3274 4 22.4989 4ZM19.9989 5.5C19.9989 4.11929 21.1182 3 22.4989 3C23.8796 3 24.9989 4.11929 24.9989 5.5C24.9989 6.88071 23.8796 8 22.4989 8C21.9899 8 21.5159 7.8475 21.1209 7.58617L7.58575 21.1214C7.84733 21.5165 8 21.9907 8 22.5C8 23.8807 6.88071 25 5.5 25C4.11929 25 3 23.8807 3 22.5C3 21.1193 4.11929 20 5.5 20C6.00932 20 6.48351 20.1527 6.87864 20.4143L20.4136 6.87929C20.1518 6.48403 19.9989 6.0096 19.9989 5.5ZM5.5 21C4.67157 21 4 21.6716 4 22.5C4 23.3284 4.67157 24 5.5 24C6.32843 24 7 23.3284 7 22.5C7 22.0856 6.83265 21.7113 6.56066 21.4393C6.28867 21.1673 5.91435 21 5.5 21Z"></path>
                <path d="M16 19.5C16 18.1193 17.1193 17 18.5 17H23.5C24.8807 17 26 18.1193 26 19.5V22.5C26 23.8807 24.8807 25 23.5 25H18.5C17.1193 25 16 23.8807 16 22.5V19.5ZM18.5 18C17.6716 18 17 18.6716 17 19.5V22.5C17 23.3284 17.6716 24 18.5 24H23.5C24.3284 24 25 23.3284 25 22.5V19.5C25 18.6716 24.3284 18 23.5 18H18.5Z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Info Line</span>
          </div>

          {/* Extended Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 25.354l5-5-.707-.707-5 5z"></path>
                <path d="M12.354 17.354l5-5-.707-.707-5 5z"></path>
                <path d="M20.354 9.354l5-5-.707-.707-5 5z"></path>
                <path d="M18.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Extended Line</span>
          </div>

          {/* Trend Angle */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M15.5 22.5c0-2.697-1.073-5.225-2.947-7.089l-.705.709c1.687 1.679 2.652 3.952 2.652 6.38h1z"></path>
                <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                <path d="M7.5 23h16.5v-1h-16.5z"></path>
                <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Trend Angle</span>
          </div>

          {/* Horizontal Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4 15h8.5v-1h-8.5zM16.5 15h8.5v-1h-8.5z"></path>
                <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Horizontal Line</span>
          </div>

          {/* Horizontal Ray */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M8.5 15h16.5v-1h-16.5z"></path>
                <path d="M6.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Horizontal Ray</span>
          </div>

          {/* Vertical Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M15 12.5v-8.5h-1v8.5zM14 16.5v8.5h1v-8.5z"></path>
                <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Vertical Line</span>
          </div>

          {/* Cross Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4 15h8.5v-1h-8.5zM16.5 15h8.5v-1h-8.5z"></path>
                <path d="M15 12v-8.5h-1v8.5zM14 16.5v8.5h1v-8.5z"></path>
                <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Cross Line</span>
          </div>

          {/* Parallel Channel */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M8.354 18.354l10-10-.707-.707-10 10zM12.354 25.354l5-5-.707-.707-5 5z"></path>
                <path d="M20.354 17.354l5-5-.707-.707-5 5z"></path>
                <path d="M19.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM6.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Parallel Channel</span>
          </div>

          {/* Regression Trend */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M7.551 17.98l13.284-7.033-.468-.884-13.284 7.033z"></path>
                <path d="M6 11.801l16-8.471v4.17h1v-5.83l-18 9.529v5.301h1z"></path>
                <path d="M6 24.67v-4.17h-1v5.83l18-9.529v-5.301h-1v4.699z"></path>
                <path d="M5.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Regression Trend</span>
          </div>

          {/* Flat Top/Bottom */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M7.5 23h13v-1h-13z"></path>
                <path d="M7.55 13.088l13.29-6.254-.426-.905-13.29 6.254z"></path>
                <path d="M5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Flat Top/Bottom</span>
          </div>
        </div>
      )}

      {/* Fibonacci Submenu */}
      {showFibSubmenu && (
        <div ref={fibSubmenuRef} style={styles.fibSubmenu}>
          {/* Fib Retracement */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3 5h22v-1h-22z"></path>
                <path d="M3 17h22v-1h-22z"></path>
                <path d="M3 11h19.5v-1h-19.5z"></path>
                <path d="M5.5 23h19.5v-1h-19.5z"></path>
                <path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Retracement</span>
          </div>

          {/* Add other Fibonacci submenu items here - truncated for brevity */}
        </div>
      )}

      {/* Pattern & Elliott Wave Submenu */}
      {showPatternSubmenu && (
        <div ref={patternSubmenuRef} style={styles.patternSubmenu}>
          {/* XABCD Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                <path d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>XABCD Pattern</span>
          </div>

          {/* Add other Pattern submenu items here - truncated for brevity */}
        </div>
      )}

      {/* Projection Submenu */}
      {showProjectionSubmenu && (
        <div ref={projectionSubmenuRef} style={styles.projectionSubmenu}>
          {/* Long Position */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path>
            </svg>
            <span style={styles.submenuText}>Long Position</span>
          </div>

          {/* Add other Projection submenu items here - truncated for brevity */}
        </div>
      )}

      {/* Brushes Submenu */}
      {showBrushesSubmenu && (
        <div ref={brushesSubmenuRef} style={styles.brushesSubmenu}>
          {/* Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path>
                <path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Brush</span>
          </div>

          {/* Add other Brushes submenu items here - truncated for brevity */}
        </div>
      )}
    </>
  );
}
