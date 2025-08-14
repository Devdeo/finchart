import { useState, useRef, useEffect } from "react";
import { styles } from "./styles";
import { Settings } from "./types";
import TopToolbar from "./TopToolbar";
import LeftSidebar from "./LeftSidebar";
import TrendSubmenu from "./submenus/TrendSubmenu";
import FibSubmenu from "./submenus/FibSubmenu";
import PatternSubmenu from "./submenus/PatternSubmenu";
import ProjectionSubmenu from "./submenus/ProjectionSubmenu";
import BrushesSubmenu from "./submenus/BrushesSubmenu";

export default function MainChart() {
  const [openMenu, setOpenMenu] = useState<string | null>(null); // State for which top toolbar menu is open
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);
  const menuRef = useRef(null);

  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showFibSubmenu, setShowFibSubmenu] = useState(false);
  const [showPatternSubmenu, setShowPatternSubmenu] = useState(false);
  const [showProjectionSubmenu, setShowProjectionSubmenu] = useState(false);
  const [showBrushesSubmenu, setShowBrushesSubmenu] = useState(false);
  const submenuRef = useRef(null);
  const fibSubmenuRef = useRef(null);
  const patternSubmenuRef = useRef(null);
  const projectionSubmenuRef = useRef(null);
  const brushesSubmenuRef = useRef(null); // Ref for Brushes submenu

  const [oiData, setOiData] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    lastPrice: true,
    highPrice: true,
    lowPrice: true,
    reverseCoord: false,
    gridShow: true,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Close top toolbar dropdowns
      if (
        openMenu &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !target.closest(".toolbar-btn")
      ) {
        setOpenMenu(null);
      }

      // Close submenus
      if (
        showSubmenu &&
        submenuRef.current &&
        !submenuRef.current.contains(target) &&
        !target.closest(".submenu-trigger")
      ) {
        setShowSubmenu(false);
      }

      if (
        showFibSubmenu &&
        fibSubmenuRef.current &&
        !fibSubmenuRef.current.contains(target) &&
        !target.closest(".fib-submenu-trigger")
      ) {
        setShowFibSubmenu(false);
      }

      if (
        showPatternSubmenu &&
        patternSubmenuRef.current &&
        !patternSubmenuRef.current.contains(target) &&
        !target.closest(".pattern-submenu-trigger")
      ) {
        setShowPatternSubmenu(false);
      }

      if (
        showProjectionSubmenu &&
        projectionSubmenuRef.current &&
        !projectionSubmenuRef.current.contains(target) &&
        !target.closest(".projection-submenu-trigger")
      ) {
        setShowProjectionSubmenu(false);
      }

      if (
        showBrushesSubmenu &&
        brushesSubmenuRef.current &&
        !brushesSubmenuRef.current.contains(target) &&
        !target.closest(".brushes-submenu-trigger")
      ) {
        setShowBrushesSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [
    openMenu,
    showSubmenu,
    showFibSubmenu,
    showPatternSubmenu,
    showProjectionSubmenu,
    showBrushesSubmenu,
  ]);

  const openDropdown = (menu: string | null, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setOpenMenu(openMenu === menu ? null : menu);

    // Temporarily position it where it would normally go
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    // Delay measure to after DOM update
    setTimeout(() => {
      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Horizontal adjust
        if (left + menuRect.width > viewportWidth) {
          left = viewportWidth - menuRect.width - 10;
        }
        if (left < 0) left = 0;

        // Vertical adjust
        if (top + menuRect.height > window.scrollY + viewportHeight) {
          top = rect.top + window.scrollY - menuRect.height;
        }
        if (top < 0) top = 0;

        setMenuPosition({ top, left });
      }
    }, 0);
  };

  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.container}>
      <TopToolbar
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        menuPosition={menuPosition}
        setMenuPosition={setMenuPosition}
        menuRef={menuRef}
        toolbarRef={toolbarRef}
        oiData={oiData}
        setOiData={setOiData}
        settings={settings}
        toggleSetting={toggleSetting}
        openDropdown={openDropdown}
      />

      <div style={styles.mainArea}>
        <LeftSidebar
          setShowSubmenu={setShowSubmenu}
          setShowFibSubmenu={setShowFibSubmenu}
          setShowPatternSubmenu={setShowPatternSubmenu}
          setShowProjectionSubmenu={setShowProjectionSubmenu}
          setShowBrushesSubmenu={setShowBrushesSubmenu}
          showSubmenu={showSubmenu}
          showFibSubmenu={showFibSubmenu}
          showPatternSubmenu={showPatternSubmenu}
          showProjectionSubmenu={showProjectionSubmenu}
          showBrushesSubmenu={showBrushesSubmenu}
        />

        {/* Submenu - positioned absolutely to not affect layout */}
        {showSubmenu && (
          <div ref={submenuRef} style={styles.submenu}>
            <TrendSubmenu />
          </div>
        )}

        {/* Fibonacci Submenu - positioned absolutely to not affect layout */}
        {showFibSubmenu && (
          <div ref={fibSubmenuRef} style={styles.fibSubmenu}>
            <FibSubmenu />
          </div>
        )}

        {/* Pattern & Elliott Wave Submenu - positioned absolutely to not affect layout */}
        {showPatternSubmenu && (
          <div ref={patternSubmenuRef} style={styles.patternSubmenu}>
            <PatternSubmenu />
          </div>
        )}

        {/* Projection Submenu - positioned absolutely to not affect layout */}
        {showProjectionSubmenu && (
          <div ref={projectionSubmenuRef} style={styles.projectionSubmenu}>
            <ProjectionSubmenu />
          </div>
        )}

        {/* Brushes Submenu - positioned absolutely to not affect layout */}
        {showBrushesSubmenu && (
          <div ref={brushesSubmenuRef} style={styles.brushesSubmenu}>
            <BrushesSubmenu />
          </div>
        )}

        <div style={styles.mainChart}>
          <div>I am middle</div>
        </div>
      </div>
    </div>
  );
}