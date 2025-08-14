
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

          {/* Trend Based Fib Extension */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3.061 4.5h21.938v-1h-21.938z"></path>
                <path d="M21 24h4v-1h-4z"></path>
                <path d="M3 14.5h22v-1h-22z"></path>
                <path d="M7 24h10v-1h-10z"></path>
                <path d="M3.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Trend Based Fib Extension</span>
          </div>

          {/* Fib Extension */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3 5h17v-1h-17z"></path>
                <path d="M3 11h21v-1h-21z"></path>
                <path d="M3 17h14v-1h-14z"></path>
                <path d="M3 23h19v-1h-19z"></path>
                <path d="M21.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Extension</span>
          </div>

          {/* Fib Time Zone */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M5 3v22h1v-22z"></path>
                <path d="M13 3v22h1v-22z"></path>
                <path d="M21 3v22h1v-22z"></path>
                <path d="M9 3v22h1v-22z"></path>
                <path d="M17 3v22h1v-22z"></path>
                <path d="M25 3v22h1v-22z"></path>
                <path d="M3 25h24v-1h-24z"></path>
                <path d="M3 3h24v-1h-24z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Time Zone</span>
          </div>

          {/* Fib Fan */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 23.354l20-20-.707-.707-20 20z"></path>
                <path d="M4.737 23.03l13.53-18.424-.836-.615-13.53 18.424z"></path>
                <path d="M4.615 22.869l9.253-20.763-.917-.408-9.253 20.763z"></path>
                <path d="M4.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Fan</span>
          </div>

          {/* Fib Arcs */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M24.5 14c0-5.799-4.701-10.5-10.5-10.5s-10.5 4.701-10.5 10.5h1c0-5.247 4.253-9.5 9.5-9.5s9.5 4.253 9.5 9.5z"></path>
                <path d="M21.5 14c0-4.142-3.358-7.5-7.5-7.5s-7.5 3.358-7.5 7.5h1c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5z"></path>
                <path d="M18.5 14c0-2.485-2.015-4.5-4.5-4.5s-4.5 2.015-4.5 4.5h1c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5z"></path>
                <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Arcs</span>
          </div>

          {/* Fib Spiral */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M14 6.5c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5-7.5-3.358-7.5-7.5h1c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5v-1z"></path>
                <path d="M14 9.5c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5-4.5-2.015-4.5-4.5h1c0 1.933 1.567 3.5 3.5 3.5s3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5v-1z"></path>
                <path d="M14 12.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5h1c0 .276.224.5.5.5s.5-.224.5-.5-.224-.5-.5-.5v-1z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Spiral</span>
          </div>

          {/* Fib Speed/Resistance Arcs */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.5 24c0-10.77 8.73-19.5 19.5-19.5v-1c-11.322 0-20.5 9.178-20.5 20.5z"></path>
                <path d="M7.5 24c0-9.113 7.387-16.5 16.5-16.5v-1c-9.665 0-17.5 7.835-17.5 17.5z"></path>
                <path d="M10.5 24c0-7.456 6.044-13.5 13.5-13.5v-1c-8.008 0-14.5 6.492-14.5 14.5z"></path>
                <path d="M3.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Speed/Resistance Arcs</span>
          </div>

          {/* Fib Wedge */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.5 24l20-20v-1l-21 21z"></path>
                <path d="M4.5 24l17-17v-1l-18 18z"></path>
                <path d="M4.5 24l14-14v-1l-15 15z"></path>
                <path d="M4.5 24l11-11v-1l-12 12z"></path>
                <path d="M3.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Wedge</span>
          </div>

          {/* Fib Channel */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 24.354l20-20-.707-.707-20 20z"></path>
                <path d="M2.354 22.354l20-20-.707-.707-20 20z"></path>
                <path d="M6.354 26.354l20-20-.707-.707-20 20z"></path>
                <path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 3c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Fib Channel</span>
          </div>

          {/* Schiff Pitchfork Modified */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3.354 21.354l11-11-.707-.707-11 11z"></path>
                <path d="M9.354 15.354l11-11-.707-.707-11 11z"></path>
                <path d="M15.354 9.354l11-11-.707-.707-11 11z"></path>
                <path d="M12.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 23c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Schiff Pitchfork Modified</span>
          </div>
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

          {/* Cypher Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M5.354 23.354l7-7-.707-.707-7 7z"></path>
                <path d="M12.354 16.354l11-11-.707-.707-11 11z"></path>
                <path d="M3.354 21.354l11-11-.707-.707-11 11z"></path>
                <path d="M14.354 14.354l9-9-.707-.707-9 9z"></path>
                <path d="M4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Cypher Pattern</span>
          </div>

          {/* ABCD Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M5.354 23.354l7-7-.707-.707-7 7z"></path>
                <path d="M12.354 16.354l11-11-.707-.707-11 11z"></path>
                <path d="M3.354 21.354l11-11-.707-.707-11 11z"></path>
                <path d="M4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>ABCD Pattern</span>
          </div>

          {/* Bat Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M11.5 4.5l-6.147 13.894.894.395 6.147-13.894z"></path>
                <path d="M16.5 4.5l6.147 13.894-.894.395-6.147-13.894z"></path>
                <path d="M5.353 18.289l18.294.422.046-2-18.294-.422z"></path>
                <path d="M11.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM16.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Bat Pattern</span>
          </div>

          {/* Butterfly Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M14 4l-8 7 8 7 8-7z"></path>
                <path d="M6.5 11.5l7.5-7.5 7.5 7.5-7.5 7.5z"></path>
                <path d="M14 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14 19c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM6 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Butterfly Pattern</span>
          </div>

          {/* Gartley Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 24.354l8-8-.707-.707-8 8z"></path>
                <path d="M12.354 16.354l12-12-.707-.707-12 12z"></path>
                <path d="M2.354 22.354l12-12-.707-.707-12 12z"></path>
                <path d="M14.354 14.354l10-10-.707-.707-10 10z"></path>
                <path d="M1.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM2.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Gartley Pattern</span>
          </div>

          {/* Crab Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M6 14c2-2 4-2 6 0s4 2 6 0l-1-1c-1.5 1.5-3 1.5-4.5 0s-3-1.5-4.5 0l-1 1z"></path>
                <path d="M14 20c-2-2-2-4 0-6s2-4 0-6l1 1c1.5-1.5 1.5-3 0-4.5s-1.5-3 0-4.5l-1-1z"></path>
                <path d="M5.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Crab Pattern</span>
          </div>

          {/* Shark Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3 20h8l4-8 4 8h6l-8-12z"></path>
                <path d="M11 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 13c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Shark Pattern</span>
          </div>

          {/* 5-0 Pattern */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 20.354l6-6-.707-.707-6 6z"></path>
                <path d="M10.354 14.354l8-8-.707-.707-8 8z"></path>
                <path d="M18.354 6.354l6-6-.707-.707-6 6z"></path>
                <path d="M20.354 8.354l4-4-.707-.707-4 4z"></path>
                <path d="M22.354 10.354l2-2-.707-.707-2 2z"></path>
                <path d="M3.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>5-0 Pattern</span>
          </div>

          {/* Wolf Wave */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M2.354 26.354l24-24-.707-.707-24 24z"></path>
                <path d="M4.354 20.354l8-8-.707-.707-8 8z"></path>
                <path d="M12.354 12.354l8-8-.707-.707-8 8z"></path>
                <path d="M20.354 4.354l6-6-.707-.707-6 6z"></path>
                <path d="M2.5 27c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 13c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Wolf Wave</span>
          </div>

          {/* Elliott Wave */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3.354 23.354l5-5-.707-.707-5 5z"></path>
                <path d="M8.354 18.354l3-3-.707-.707-3 3z"></path>
                <path d="M11.354 15.354l5-5-.707-.707-5 5z"></path>
                <path d="M16.354 10.354l3-3-.707-.707-3 3z"></path>
                <path d="M19.354 7.354l5-5-.707-.707-5 5z"></path>
                <path d="M2.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM8.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM16.5 10c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 2c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Elliott Wave</span>
          </div>

          {/* Elliott Impulse Wave (12345) */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3.354 23.354l4-4-.707-.707-4 4z"></path>
                <path d="M7.354 19.354l3-3-.707-.707-3 3z"></path>
                <path d="M10.354 16.354l4-4-.707-.707-4 4z"></path>
                <path d="M14.354 12.354l3-3-.707-.707-3 3z"></path>
                <path d="M17.354 9.354l4-4-.707-.707-4 4z"></path>
                <path d="M2.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM7.5 19c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM21.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Elliott Impulse Wave (12345)</span>
          </div>

          {/* Elliott Triangle Wave (ABCDE) */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4 24l20-8-20-8z"></path>
                <path d="M4.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 17c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Elliott Triangle Wave (ABCDE)</span>
          </div>

          {/* Elliott Triple Combo (WXYXZ) */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M2.354 25.354l6-6-.707-.707-6 6z"></path>
                <path d="M8.354 19.354l4-4-.707-.707-4 4z"></path>
                <path d="M12.354 15.354l6-6-.707-.707-6 6z"></path>
                <path d="M18.354 9.354l6-6-.707-.707-6 6z"></path>
                <path d="M2.5 26c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM8.5 19c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 3c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Elliott Triple Combo (WXYXZ)</span>
          </div>

          {/* Elliott Correction Wave (ABC) */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 20.354l8-8-.707-.707-8 8z"></path>
                <path d="M12.354 12.354l8-8-.707-.707-8 8z"></path>
                <path d="M20.354 4.354l4-4-.707-.707-4 4z"></path>
                <path d="M3.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Elliott Correction Wave (ABC)</span>
          </div>

          {/* Elliott Double Combo (WXY) */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3.354 24.354l8-8-.707-.707-8 8z"></path>
                <path d="M11.354 16.354l8-8-.707-.707-8 8z"></path>
                <path d="M19.354 8.354l6-6-.707-.707-6 6z"></path>
                <path d="M2.5 26c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM19.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 2c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Elliott Double Combo (WXY)</span>
          </div>
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

          {/* Short Position */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M24.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM26 6.5A2.5 2.5 0 0 1 21.05 6H4v1h17.05A2.5 2.5 0 0 1 26 6.5zM24.5 15a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM26 16.5a2.5 2.5 0 0 1-4.95-.5H7.9a2.5 2.5 0 1 1 0 1h13.15A2.5 2.5 0 0 1 26 16.5zM5.5 15a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm18 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM26 22.5a2.5 2.5 0 0 1-4.95-.5H4v1h17.05A2.5 2.5 0 0 1 26 22.5z"></path>
            </svg>
            <span style={styles.submenuText}>Short Position</span>
          </div>

          {/* Projected Line */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path>
              <path fill="currentColor" d="M5.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM3 16.5a2.5 2.5 0 0 1 4.95-.5H24v1H7.95A2.5 2.5 0 0 1 3 16.5z"></path>
            </svg>
            <span style={styles.submenuText}>Projected Line</span>
          </div>

          {/* Prediction/Forecast */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4 6h12v1H4V6zm0 4h8v1H4v-1zm0 4h16v1H4v-1zm0 4h10v1H4v-1zm16-8v12l6-6-6-6z"></path>
            </svg>
            <span style={styles.submenuText}>Prediction/Forecast</span>
          </div>

          {/* Price Projection */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M3 6h16v1H3V6zm0 4h12v1H3v-1zm0 4h20v1H3v-1zm0 4h14v1H3v-1z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22 8l4 4-4 4v-3h-3v-2h3V8z"></path>
            </svg>
            <span style={styles.submenuText}>Price Projection</span>
          </div>

          {/* Target Level */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M14 3v22h1V3h-1z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M20 14a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-1 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"></path>
              <path fill="currentColor" d="M14 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
            </svg>
            <span style={styles.submenuText}>Target Level</span>
          </div>

          {/* Stop Loss Level */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M3 14h22v1H3v-1z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path>
              <path fill="currentColor" d="M16.5 11.5l-5 5 .707.707 5-5-.707-.707z"></path>
              <path fill="currentColor" d="M11.5 11.5l5 5 .707-.707-5-5-.707.707z"></path>
            </svg>
            <span style={styles.submenuText}>Stop Loss Level</span>
          </div>

          {/* Risk/Reward */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M6 8h16v1H6V8zm0 4h12v1H6v-1zm0 4h18v1H6v-1zm0 4h10v1H6v-1z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M24 12l2 2-2 2v-1.5h-3v-1h3V12z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M24 18l2-2-2-2v1.5h-3v1h3V18z"></path>
            </svg>
            <span style={styles.submenuText}>Risk/Reward</span>
          </div>

          {/* Projection Box */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M6 8h16v12H6V8zm1 1v10h14V9H7z"></path>
              <path fill="currentColor" d="M9 11h10v1H9v-1zm0 2h8v1H9v-1zm0 2h12v1H9v-1zm0 2h6v1H9v-1z"></path>
            </svg>
            <span style={styles.submenuText}>Projection Box</span>
          </div>

          {/* Time Projection */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M14 3v22h1V3h-1zm4 3v22h1V6h-1zm-8 3v22h1V9H10zm-4 3v22h1v-22H6zm12 3v22h1v-22h-1z"></path>
            </svg>
            <span style={styles.submenuText}>Time Projection</span>
          </div>

          {/* Cycle Lines */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M6 3v22h1V3H6zm4 0v22h1V3h-1zm4 0v22h1V3h-1zm4 0v22h1V3h-1zm4 0v22h1V3h-1z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path>
            </svg>
            <span style={styles.submenuText}>Cycle Lines</span>
          </div>

          {/* Arrow */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
              <path fill="currentColor" d="M4 14h16v1H4v-1z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M20 14.5l4-3v6l-4-3z"></path>
            </svg>
            <span style={styles.submenuText}>Arrow</span>
          </div>
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

          {/* Highlighter */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 23" width="20" height="20">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M13.402 0L6.78144 6.71532C6.67313 6.82518 6.5917 6.95862 6.54354 7.10518L5.13578 11.3889C4.89843 12.1111 5.08375 12.9074 5.61449 13.4458L5.682 13.5147L0.146447 19.1464C-0.0488155 19.3417 -0.0488155 19.6583 0.146447 19.8536L3.14645 22.8536C3.34171 23.0488 3.65829 23.0488 3.85355 22.8536L9.48528 17.318L9.55421 17.3855C10.0926 17.9163 10.8889 18.1016 11.6111 17.8642L15.8949 16.4565C16.0414 16.4083 16.1748 16.3269 16.2847 16.2186L23 9.598L13.402 0ZM15.598 15.3466L11.3142 16.7543C10.9254 16.8858 10.5001 16.7877 10.2071 16.5L7.5 13.7929C7.21231 13.4999 7.11418 13.0746 7.24574 12.6858L8.65342 8.402L15.598 15.3466ZM9.42342 7.622L7.66421 12.6858L10.3142 15.3358L15.378 13.5766L9.42342 7.622Z"></path>
            </svg>
            <span style={styles.submenuText}>Highlighter</span>
          </div>

          {/* Eraser */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M21.207 6.793l-14 14c-.391.391-1.024.391-1.414 0l-4-4c-.391-.391-.391-1.024 0-1.414l14-14c.391-.391 1.024-.391 1.414 0l4 4c.391.391.391 1.024 0 1.414zm-1.414-1.414l-3-3-12.586 12.586 3 3z"></path>
                <path d="M3 25h22v-1h-22z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Eraser</span>
          </div>

          {/* Rectangle Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4 8h20v12h-20z"></path>
                <path d="M3 7h22v14h-22z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Rectangle Brush</span>
          </div>

          {/* Circle Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M14 24c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm0-1c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9z"></path>
                <path d="M14 20c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Circle Brush</span>
          </div>

          {/* Line Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4.354 24.354l20-20-.707-.707-20 20z"></path>
                <path d="M3.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Line Brush</span>
          </div>

          {/* Arrow Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4 14h16v1h-16z"></path>
                <path d="M20 14.5l4-3v6z"></path>
                <path d="M3.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Arrow Brush</span>
          </div>

          {/* Text Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M6 4h16v3h-1v-2h-6v18h2v1h-5v-1h2v-18h-6v2h-1z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Text Brush</span>
          </div>

          {/* Callout Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M4 5h20v12h-11l-5 6v-6h-4z"></path>
                <path d="M3 4h22v14h-11l-6 7v-7h-5z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Callout Brush</span>
          </div>

          {/* Star Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M14 2l3.09 6.26 6.91 1.01-5 4.87 1.18 6.86-6.18-3.25-6.18 3.25 1.18-6.86-5-4.87 6.91-1.01z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Star Brush</span>
          </div>

          {/* Heart Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M14 25l-1.5-1.35c-5.15-4.67-8.5-7.75-8.5-11.65 0-3.1 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.4 5.5 5.5 0 3.9-3.35 6.98-8.5 11.65z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Heart Brush</span>
          </div>

          {/* Custom Shape Brush */}
          <div style={styles.submenuItem}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M14 4l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"></path>
                <path d="M7 14l7-10 7 10-7 10z"></path>
              </g>
            </svg>
            <span style={styles.submenuText}>Custom Shape Brush</span>
          </div>
        </div>
      )}
    </>
  );
}
