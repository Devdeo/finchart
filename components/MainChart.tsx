import { useState, useRef, useEffect } from "react";
import { styles } from "../styles/styles";
import TopToolbar from "./TopToolbar";
import LeftSidebarAndSubmenus from "./LeftSidebarAndSubmenus";
import MainChartArea from "./MainChartArea";

export default function MainChart() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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
  const brushesSubmenuRef = useRef(null);

  // Example state for settings
  const [oiData, setOiData] = useState(true);
  const [settings, setSettings] = useState({
    lastPrice: true,
    highPrice: true,
    lowPrice: true,
    reverseCoord: false,
    gridShow: true,
  });

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        !e.target.closest(".popup-menu") &&
        !e.target.closest(".toolbar-btn")
      ) {
        setOpenMenu(null);
      }

      // Close submenu when clicking outside
      if (
        showSubmenu &&
        submenuRef.current &&
        !(submenuRef.current as any).contains(e.target) &&
        !e.target.closest(".submenu-trigger")
      ) {
        setShowSubmenu(false);
      }

      // Close Fibonacci submenu when clicking outside
      if (
        showFibSubmenu &&
        fibSubmenuRef.current &&
        !(fibSubmenuRef.current as any).contains(e.target) &&
        !e.target.closest(".fib-submenu-trigger")
      ) {
        setShowFibSubmenu(false);
      }

      // Close Pattern submenu when clicking outside
      if (
        showPatternSubmenu &&
        patternSubmenuRef.current &&
        !(patternSubmenuRef.current as any).contains(e.target) &&
        !e.target.closest(".pattern-submenu-trigger")
      ) {
        setShowPatternSubmenu(false);
      }

      // Close Projection submenu when clicking outside
      if (
        showProjectionSubmenu &&
        projectionSubmenuRef.current &&
        !(projectionSubmenuRef.current as any).contains(e.target) &&
        !e.target.closest(".projection-submenu-trigger")
      ) {
        setShowProjectionSubmenu(false);
      }

      // Close Brushes submenu when clicking outside
      if (
        showBrushesSubmenu &&
        brushesSubmenuRef.current &&
        !(brushesSubmenuRef.current as any).contains(e.target) &&
        !e.target.closest(".brushes-submenu-trigger")
      ) {
        setShowBrushesSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSubmenu, showFibSubmenu, showPatternSubmenu, showProjectionSubmenu, showBrushesSubmenu]);

  const openDropdown = (menu: string, event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpenMenu(openMenu === menu ? null : menu);

    // Temporarily position it where it would normally go
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    // Delay measure to after DOM update
    setTimeout(() => {
      if (menuRef.current) {
        const menuRect = (menuRef.current as any).getBoundingClientRect();
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

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.container}>
      <TopToolbar
        openMenu={openMenu}
        menuPosition={menuPosition}
        settings={settings}
        oiData={oiData}
        setOiData={setOiData}
        openDropdown={openDropdown}
        toggleSetting={toggleSetting}
        menuRef={menuRef}
      />

      {/* Main area */}
      <div style={styles.mainArea}>
        <LeftSidebarAndSubmenus
          showSubmenu={showSubmenu}
          setShowSubmenu={setShowSubmenu}
          showFibSubmenu={showFibSubmenu}
          setShowFibSubmenu={setShowFibSubmenu}
          showPatternSubmenu={showPatternSubmenu}
          setShowPatternSubmenu={setShowPatternSubmenu}
          showProjectionSubmenu={showProjectionSubmenu}
          setShowProjectionSubmenu={setShowProjectionSubmenu}
          showBrushesSubmenu={showBrushesSubmenu}
          setShowBrushesSubmenu={setShowBrushesSubmenu}
          submenuRef={submenuRef}
          fibSubmenuRef={fibSubmenuRef}
          patternSubmenuRef={patternSubmenuRef}
          projectionSubmenuRef={projectionSubmenuRef}
          brushesSubmenuRef={brushesSubmenuRef}
        />

        <MainChartArea />
      </div>
    </div>
  );
}