import { useState, useRef, useEffect } from "react";

export default function MainChart() {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);
  const menuRef = useRef(null);
  const [showSubmenu, setShowSubmenu] = useState(false); // State to control submenu visibility
  const [showFibSubmenu, setShowFibSubmenu] = useState(false); // State to control Fibonacci submenu visibility
  const [showPatternSubmenu, setShowPatternSubmenu] = useState(false); // State to control Pattern submenu visibility
  const [showProjectionSubmenu, setShowProjectionSubmenu] = useState(false); // State to control Projection submenu visibility
  const [showBrushesSubmenu, setShowBrushesSubmenu] = useState(false); // State to control Brushes submenu visibility
  const submenuRef = useRef(null);
  const fibSubmenuRef = useRef(null);
  const patternSubmenuRef = useRef(null);
  const projectionSubmenuRef = useRef(null);
  const brushesSubmenuRef = useRef(null); // Ref for Brushes submenu

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
    const handleClickOutside = (e) => {
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
        !submenuRef.current.contains(e.target) &&
        !e.target.closest(".submenu-trigger")
      ) {
        setShowSubmenu(false);
      }

      // Close Fibonacci submenu when clicking outside
      if (
        showFibSubmenu &&
        fibSubmenuRef.current &&
        !fibSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".fib-submenu-trigger")
      ) {
        setShowFibSubmenu(false);
      }

      // Close Pattern submenu when clicking outside
      if (
        showPatternSubmenu &&
        patternSubmenuRef.current &&
        !patternSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".pattern-submenu-trigger")
      ) {
        setShowPatternSubmenu(false);
      }

      // Close Projection submenu when clicking outside
      if (
        showProjectionSubmenu &&
        projectionSubmenuRef.current &&
        !projectionSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".projection-submenu-trigger")
      ) {
        setShowProjectionSubmenu(false);
      }

       // Close Brushes submenu when clicking outside
       if (
        showBrushesSubmenu &&
        brushesSubmenuRef.current &&
        !brushesSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".brushes-submenu-trigger")
      ) {
        setShowBrushesSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSubmenu, showFibSubmenu, showPatternSubmenu, showProjectionSubmenu, showBrushesSubmenu]);

  const openDropdown = (menu, event) => {
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

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.container}>
      {/* Top toolbar */}
      <div style={styles.topScroll} ref={toolbarRef}>
        <div style={styles.scrollRow}>
          <div className="toolbar-btn" style={styles.testBox}>
            <i className="fa-solid fa-magnifying-glass"></i> Symbol
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("timeframe", e)}
          >
            <i className="fa-solid fa-hourglass"></i>&nbsp; Timeframe
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("charttype", e)}
          >
            <i className="fa-solid fa-chart-column"></i>&nbsp; Chart Type
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("indicator", e)}
          >
            <i className="fa-solid fa-chart-simple"></i>&nbsp; Indicator
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("ai", e)}
          >
            <i className="fa-solid fa-hexagon-nodes-bolt"></i>&nbsp; AI
          </div>

          <div style={styles.testBox}>
            <input
              type="checkbox"
              checked={oiData}
              onChange={() => setOiData(!oiData)}
              style={{ marginRight: "5px" }}
            />
            <i className="fa-solid fa-database"></i>&nbsp; OI Data
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("settings", e)}
          >
            <i className="fa-solid fa-gear"></i>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {openMenu && (
        <div
          ref={menuRef}
          className="popup-menu"
          style={{
            ...styles.popup,
            position: "absolute",
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <div style={styles.popupContent}>
            {openMenu === "timeframe" &&
              [
                "1m",
                "2m",
                "3m",
                "4m",
                "5m",
                "10m",
                "15m",
                "30m",
                "1h",
                "2h",
                "4h",
                "1d",
              ].map((tf) => (
                <div key={tf} style={styles.dropdownItem}>
                  {tf}
                </div>
              ))}

            {openMenu === "charttype" &&
              [
                "Candle Solid",
                "Candle Stroke",
                "Candle Up Stroke",
                "Candle Down Stroke",
                "OHLC",
                "Area",
              ].map((type) => (
                <div key={type} style={styles.dropdownItem}>
                  {type}
                </div>
              ))}

            {openMenu === "indicator" && (
              <>
                <strong>Trend</strong>
                {[
                  "SMA – Simple Moving Average",
                  "EMA – Exponential Moving Average",
                  "WMA – Weighted Moving Average",
                  "MACD – Moving Average Convergence Divergence",
                  "Ichimoku Cloud",
                  "Supertrend",
                  "Parabolic SAR",
                  "ADX – Average Directional Index",
                  "HMA – Hull Moving Average",
                  "Gann HiLo Activator",
                ].map((item) => (
                  <div key={item} style={styles.dropdownItem}>
                    {item}
                  </div>
                ))}
                <strong>Momentum</strong>
                {[
                  "RSI – Relative Strength Index",
                  "Stochastic Oscillator",
                  "Stochastic RSI",
                  "CCI – Commodity Channel Index",
                  "Williams %R",
                  "ROC – Rate of Change",
                  "Awesome Oscillator",
                  "Elder Impulse System",
                ].map((item) => (
                  <div key={item} style={styles.dropdownItem}>
                    {item}
                  </div>
                ))}
                <strong>Volatility</strong>
                {[
                  "Bollinger Bands",
                  "Keltner Channels",
                  "ATR – Average True Range",
                  "Donchian Channels",
                  "Standard Deviation Channel",
                  "Chaikin Volatility",
                ].map((item) => (
                  <div key={item} style={styles.dropdownItem}>
                    {item}
                  </div>
                ))}
                <strong>Volume</strong>
                {[
                  "Volume Histogram",
                  "OBV – On-Balance Volume",
                  "MFI – Money Flow Index",
                  "Accumulation/Distribution Line",
                  "Chaikin Money Flow (CMF)",
                  "Volume Oscillator",
                ].map((item) => (
                  <div key={item} style={styles.dropdownItem}>
                    {item}
                  </div>
                ))}
                <strong>Pattern Recognition</strong>
                {[
                  "Chart Pattern Recognition",
                  "Candlestick Pattern Recognition",
                  "Harmonic Pattern Recognition",
                ].map((item) => (
                  <div key={item} style={styles.dropdownItem}>
                    {item}
                  </div>
                ))}
              </>
            )}

            {openMenu === "ai" && (
              <>
                <div style={styles.dropdownItem}>Auto Analysis</div>
                <div style={styles.dropdownItem}>Chat</div>
              </>
            )}

            {openMenu === "settings" &&
              Object.entries(settings).map(([key, value]) => (
                <label key={key} style={styles.toggleItem}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleSetting(key)}
                  />
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (c) => c.toUpperCase())}
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Main area */}
      <div style={styles.mainArea}>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path></svg>
          </div>

          {/* Brushes menu item - ADDED */}
          <div
            className="brushes-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowBrushesSubmenu(!showBrushesSubmenu)}
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fillRule="nonzero"><path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path><path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path></g></svg>
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

        {/* Pattern & Elliott Wave Submenu - positioned absolutely to not affect layout */}
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
                <g fill="currentColor">
                  <path d="M15.246 21.895l1.121.355c-.172.625-.458 1.089-.857 1.393-.4.303-.907.455-1.521.455-.76 0-1.385-.26-1.875-.779-.49-.52-.734-1.23-.734-2.131 0-.953.246-1.693.738-2.221.492-.527 1.139-.791 1.941-.791.701 0 1.27.207 1.707.621.26.245.456.596.586 1.055l-1.145.273c-.068-.297-.209-.531-.424-.703-.215-.172-.476-.258-.783-.258-.424 0-.769.152-1.033.457-.264.305-.396.798-.396 1.48 0 .724.13 1.24.391 1.547.26.307.599.461 1.016.461.307 0 .572-.098.793-.293.221-.195.38-.503.477-.922z"></path>
                  <path fillRule="nonzero" d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                  <path fillRule="nonzero" d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Cypher Pattern</span>
            </div>

            {/* Head and Shoulders */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4.436 21.667l2.083-9.027-.974-.225-2.083 9.027zM10.046 16.474l-2.231-4.463-.894.447 2.231 4.463zM13.461 6.318l-2.88 10.079.962.275 2.88-10.079zM18.434 16.451l-2.921-10.224-.962.275 2.921 10.224zM21.147 12.089l-2.203 4.405.894.447 2.203-4.405zM25.524 21.383l-2.09-9.055-.974.225 2.09 9.055z"></path>
                  <path d="M1 19h7.5v-1h-7.5z"></path>
                  <path d="M12.5 19h4v-1h-4z"></path>
                  <path d="M20.5 19h6.5v-1h-6.5z"></path>
                  <path d="M6.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Head and Shoulders</span>
            </div>

            {/* ABCD Pattern */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M21.487 5.248l-12.019 1.502.124.992 12.019-1.502zM6.619 9.355l-2.217 11.083.981.196 2.217-11.083zM6.534 22.75l12.071-1.509-.124-.992-12.071 1.509zM21.387 18.612l2.21-11.048-.981-.196-2.21 11.048zM8.507 9.214l10.255 10.255.707-.707-10.255-10.255z"></path>
                  <path d="M7.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>ABCD Pattern</span>
            </div>

            {/* Triangle Pattern */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M9.457 18.844l-5.371 2.4.408.913 5.371-2.4z"></path>
                  <path d="M13.13 17.203l.408.913 13.688-6.116-6.736-3.01-.408.913 4.692 2.097z"></path>
                  <path d="M11.077 5.88l5.34 2.386.408-.913-5.34-2.386z"></path>
                  <path d="M7.401 4.237l.408-.913-5.809-2.595v19.771h1v-18.229z"></path>
                  <path d="M3.708 20.772l5.51-14.169-.932-.362-5.51 14.169zM9.265 6.39l1.46 10.218.99-.141-1.46-10.218zM13.059 17.145l4.743-6.775-.819-.573-4.743 6.775z"></path>
                  <path d="M9.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 10c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM2.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Triangle Pattern</span>
            </div>

            {/* Three Drives Pattern */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M.303 17.674l1.104.473.394-.919-1.104-.473z"></path>
                  <path d="M5.133 19.744l3.335 1.429.394-.919-3.335-1.429z"></path>
                  <path d="M12.134 22.744l3.352 1.436.394-.919-3.352-1.436z"></path>
                  <path d="M19.203 25.774l1.6.686.394-.919-1.6-.686z"></path>
                  <path d="M.3 4.673l1.13.484.394-.919-1.13-.484-.394.919zm.394-.919l1.13.484-.394.919-1.13-.484.394-.919z"></path>
                  <path d="M5.141 6.747l3.325 1.425.394-.919-3.325-1.425z"></path>
                  <path d="M12.133 9.744l3.353 1.437.394-.919-3.353-1.437z"></path>
                  <path d="M19.221 12.782l5.838 2.502.394-.919-5.838-2.502z"></path>
                  <path d="M3 7.473v8.969h1v-8.969zM8.93 9.871l-4.616 6.594.819.573 4.616-6.594zM11 19.5v-9h-1v9zM15.898 12.916l-4.616 6.594.819.573 4.616-6.594zM18 22.5v-9h-1v9zM24.313 5.212l-6.57 17.247.934.356 6.57-17.247z"></path>
                  <path d="M3.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 23c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 13c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 26c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 10c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Three Drives Pattern</span>
            </div>

            {/* Elliott Impulse Wave */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M5.238 18.469l4.17-4.17-.707-.707-4.17 4.17zM16.47 17.763l-.707.707-4.265-4.265.707-.707zM22.747 13.546l-4.192 4.192.707.707 4.192-4.192z"></path>
                  <path fillRule="nonzero" d="M10.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path d="M11.148 7h-1.098v-4.137c-.401.375-.874.652-1.418.832v-.996c.286-.094.598-.271.934-.533.336-.262.566-.567.691-.916h.891v5.75z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Elliott Impulse Wave</span>
            </div>

            {/* Elliott Correction Wave */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M5.238 18.469l4.17-4.17-.707-.707-4.17 4.17zM16.47 17.763l-.707.707-4.265-4.265.707-.707zM22.747 13.546l-4.192 4.192.707.707 4.192-4.192z"></path>
                  <path fillRule="nonzero" d="M10.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path d="M13.746 7h-1.258l-.5-1.301h-2.289l-.473 1.301h-1.227l2.23-5.727h1.223l2.293 5.727z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Elliott Correction Wave</span>
            </div>
          </div>
        )}

        {/* Fibonacci Submenu - positioned absolutely to not affect layout */}
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

            {/* Trend-Based Fib Extension */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 25h22v-1h-22z" id="Line"></path>
                  <path d="M4 21h22v-1h-22z"></path>
                  <path d="M6.5 17h19.5v-1h-19.5z"></path>
                  <path d="M5 14.5v-3h-1v3zM6.617 9.275l10.158-3.628-.336-.942-10.158 3.628z"></path>
                  <path d="M18.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend-Based Fib Extension</span>
            </div>

            {/* Fib Channel */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.463 12.026l13.537-7.167-.468-.884-13.537 7.167z"></path>
                  <path d="M22.708 16.824l-17.884 9.468.468.884 17.884-9.468z"></path>
                  <path d="M22.708 9.824l-15.839 8.386.468.884 15.839-8.386z"></path>
                  <path d="M5.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Channel</span>
            </div>

            {/* Fib Time Zone */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" fillRule="evenodd" d="M19 4v21h1V4h-1Zm5 0v21h1V4h-1ZM6 12.95V25H5V12.95a2.5 2.5 0 0 1 0-4.9V4h1v4.05a2.5 2.5 0 0 1 1.67 3.7L8.7 12.8 8 13.5l-1-1c-.3.22-.63.38-1 .45ZM5.5 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM13 19.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm1 5.5v-3.05A2.5 2.5 0 0 1 12.5 18l-1-1 .7-.7 1.05 1.03c.23-.13.48-.23.75-.28V4h1v13.05a2.5 2.5 0 0 1 0 4.9V25h-1ZM8.97 14.47l1.56 1.56.7-.71-1.55-1.55-.7.7Z"></path>
              </svg>
              <span style={styles.submenuText}>Fib Time Zone</span>
            </div>

            {/* Fib Speed Resistance Fan */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 2v19.5h1v-19.5zM15.5 10h-11v1h11zM17 12.5v11h1v-11zM6.29 22.417l10.162-10.162-.707-.707-10.162 10.162z" id="Line"></path>
                  <path d="M19.264 9.443l6.589-6.589-.707-.707-6.589 6.589z"></path>
                  <path d="M6.577 23.381l19.071-5.903-.296-.955-19.071 5.903z"></path>
                  <path d="M5.573 21.724l5.905-19.076-.955-.296-5.905 19.076z"></path>
                  <path d="M6.5 24h19.5v-1h-19.5z"></path>
                  <path d="M4.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Speed Resistance Fan</span>
            </div>

            {/* Trend-Based Fib Time */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20 2v22h1v-22z"></path>
                  <path d="M24 2v22h1v-22z"></path>
                  <path d="M4.673 11.471l3.69 10.333.942-.336-3.69-10.333z"></path>
                  <path d="M17 21.535v-19.535h-1v19.535z"></path>
                  <path d="M11.5 24h3v-1h-3z"></path>
                  <path d="M4.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM9.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM16.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend-Based Fib Time</span>
            </div>

            {/* Fib Circles */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M23.868 7.825c2.791 3.916 2.918 9.33-.065 13.435-3.733 5.138-10.925 6.277-16.063 2.544l.721-.714c4.682 3.294 11.157 2.229 14.534-2.418 2.641-3.635 2.657-8.502.153-12.133l.721-.714z"></path>
                  <path d="M8.477 5.899c3.584-2.509 8.298-2.514 11.865-.127l.718-.721c-3.845-2.669-9.099-2.813-13.157.028-5.203 3.643-6.467 10.814-2.824 16.016l.718-.721c-3.201-4.737-2.022-11.185 2.68-14.476z"></path>
                  <path d="M14.5 15c4.142 0 7.5-3.358 7.5-7.5 0-4.142-3.358-7.5-7.5-7.5-4.142 0-7.5 3.358-7.5 7.5 0 4.142 3.358 7.5 7.5 7.5zm0 1c-4.694 0-8.5-3.806-8.5-8.5s3.806-8.5 8.5-8.5 8.5 3.806 8.5 8.5-3.806 8.5-8.5 8.5z"></path>
                  <path d="M14.5 19c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5zm0 1c-3.038 0-5.5-2.462-5.5-5.5s2.462-5.5 5.5-5.5 5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z"></path>
                  <path d="M22.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM6.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Circles</span>
            </div>

            {/* Fib Spiral */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4.395 10.18c3.432-4.412 10.065-4.998 13.675-.973l.745-.668c-4.044-4.509-11.409-3.858-15.209 1.027l.789.614z"></path>
                  <path d="M19.991 12.494c.877 2.718.231 5.487-1.897 7.543-2.646 2.556-6.752 2.83-9.188.477-1.992-1.924-2.027-5.38-.059-7.281 1.582-1.528 3.78-1.587 5.305-.115 1.024.99 1.386 2.424.876 3.491l.902.431c.709-1.482.232-3.37-1.084-4.641-1.921-1.855-4.734-1.78-6.695.115-2.378 2.297-2.337 6.405.059 8.719 2.846 2.749 7.563 2.435 10.577-.477 2.407-2.325 3.147-5.493 2.154-8.569l-.952.307z"></path>
                  <path d="M21.01 9.697l3.197-3.197-.707-.707-3.197 3.197z"></path>
                  <path d="M14.989 15.719l3.674-3.674-.707-.707-3.674 3.674z"></path>
                  <path d="M13.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM19.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Spiral</span>
            </div>

            {/* Fib Speed Resistance Arcs */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8 9.5c0 3.038 2.462 5.5 5.5 5.5s5.5-2.462 5.5-5.5v-.5h-1v.5c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5v-.5h-1v.5z"></path>
                  <path d="M0 9.5c0 7.456 6.044 13.5 13.5 13.5s13.5-6.044 13.5-13.5v-.5h-1v.5c0 6.904-5.596 12.5-12.5 12.5s-12.5-5.596-12.5-12.5v-.5h-1v.5z"></path>
                  <path d="M4 9.5c0 4.259 2.828 7.964 6.86 9.128l.48.139.277-.961-.48-.139c-3.607-1.041-6.137-4.356-6.137-8.167v-.5h-1v.5z"></path>
                  <path d="M16.141 18.628c4.032-1.165 6.859-4.869 6.859-9.128v-.5h-1v.5c0 3.811-2.53 7.125-6.136 8.167l-.48.139.278.961.48-.139z"></path>
                  <path d="M13.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM13.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Speed Resistance Arcs</span>
            </div>

            {/* Fib Wedge */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M21.5 23h-14v1h14zM5 7.5v14h1v-14z"></path>
                  <path d="M12 23c0-3.314-2.686-6-6-6h-.5v1h.5c2.761 0 5 2.239 5 5v.5h1v-.5z"></path>
                  <path d="M20 23c0-7.732-6.268-14-14-14h-.5v1h.5c7.18 0 13 5.82 13 13v.5h1v-.5z"></path>
                  <path d="M16 23c0-5.523-4.477-10-10-10h-.5v1h.5c4.971 0 9 4.029 9 9v.5h1v-.5z"></path>
                  <path d="M5.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Wedge</span>
            </div>

            {/* Pitchfan */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20.349 20.654l4.489-.711-.156-.988-4.489.711z"></path>
                  <path d="M7.254 22.728l9.627-1.525-.156-.988-9.627 1.525z"></path>
                  <path d="M7.284 22.118l15.669-8.331-.469-.883-15.669 8.331z"></path>
                  <path d="M6.732 21.248l8.364-15.731-.883-.469-8.364 15.731z"></path>
                  <path d="M17.465 18.758l-8.188-8.188-.707.707 8.188 8.188z"></path>
                  <path d="M6.273 20.818l1.499-9.467-.988-.156-1.499 9.467z"></path>
                  <path d="M8.329 7.834l.715-4.516-.988-.156-.715 4.51"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Pitchfan</span>
            </div>
          </div>
        )}

        {/* Projection Submenu - positioned absolutely to not affect layout */}
        {showProjectionSubmenu && (
          <div ref={projectionSubmenuRef} style={styles.projectionSubmenu}>
            {/* Long Position */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path>
              </svg>
              <span style={styles.submenuText}>Long Position</span>
            </div>

            {/* Short Position */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 24a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 22.5a2.5 2.5 0 0 0 4.95.5H24v-1H6.95a2.5 2.5 0 0 0-4.95.5zM4.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 12.5a2.5 2.5 0 0 0 4.95.5h13.1a2.5 2.5 0 1 0 0-1H6.95a2.5 2.5 0 0 0-4.95.5zM22.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-18-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 6.5a2.5 2.5 0 0 0 4.95.5H24V6H6.95a2.5 2.5 0 0 0-4.95.5z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 20.06l-1.39-.63-.41.91 1.39.63.41-.91zm-4-1.8l-1.39-.63-.41.91 1.39.63.41-.91zm-4-1.8l-1.4-.63-.4.91 1.39.63.41-.91zm-4-1.8L9 14.03l-.4.91 1.39.63.41-.91z"></path>
              </svg>
              <span style={styles.submenuText}>Short Position</span>
            </div>

            {/* Forecast */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path d="M19 11h5l-2.5 3z"></path>
                  <circle cx="21.5" cy="16.5" r="1.5"></circle>
                  <path fillRule="nonzero" d="M22 11v-6h-1v6z"></path>
                  <path d="M14 18h1v3h-1z"></path>
                  <path d="M14 5h1v6h-1z"></path>
                  <path d="M7 19h1v3h-1z"></path>
                  <path d="M7 6h1v7h-1z"></path>
                  <path fillRule="nonzero" d="M7 13v6h1v-6h-1zm-1-1h3v8h-3v-8zM14 18h1v-7h-1v7zm-1-8h3v9h-3v-9z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Forecast</span>
            </div>

            {/* Bars Pattern */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M6 6v6.5h1v-6.5zM7 22v-2.5h-1v2.5zM11 11v2.5h1v-2.5zM12 24v-7.5h-1v7.5zM16 5v5.5h1v-5.5zM17 21v-2.5h-1v2.5zM21 7v4.5h1v-4.5zM22 19v-2.5h-1v2.5z"></path>
                  <path d="M6 13v6h1v-6h-1zm-1-1h3v8h-3v-8z"></path>
                  <path d="M11 16h1v-2h-1v2zm-1-3h3v4h-3v-4z"></path>
                  <path d="M16 18h1v-7h-1v7zm-1-8h3v9h-3v-9z"></path>
                  <path d="M21 16h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Bars Pattern</span>
            </div>

            {/* Ghost Feed */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M4.529 18.21l3.157-1.292-.379-.926-3.157 1.292z"></path>
                  <path fillRule="nonzero" d="M9.734 16.081l2.97-1.215-.379-.926-2.97 1.215z"></path>
                  <path fillRule="nonzero" d="M14.725 14.039l2.957-1.21-.379-.926-2.957 1.21z"></path>
                  <path fillRule="nonzero" d="M19.708 12.001l3.114-1.274-.379-.926-3.114 1.274z"></path>
                  <path d="M8 18h1v3h-1z"></path>
                  <path d="M8 9h1v5h-1z"></path>
                  <path fillRule="nonzero" d="M8 18h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                  <path d="M18 16h1v3h-1z"></path>
                  <path d="M18 3h1v6h-1z"></path>
                  <path fillRule="nonzero" d="M18 16h1v-7h-1v7zm-1-8h3v9h-3v-9z"></path>
                  <path d="M13 6h1v5h-1z"></path>
                  <path d="M13 15h1v5h-1z"></path>
                  <path fillRule="nonzero" d="M13 15h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                  <path fillRule="nonzero" d="M2.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Ghost Feed</span>
            </div>

            {/* Projection */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M23.886 21.431c-.953-8.558-7.742-15.354-16.299-16.315l-.112.994c8.093.909 14.516 7.338 15.417 15.432l.994-.111z"></path>
                  <path d="M5 7.5v14h1v-14zM21.5 23h-14v1h14z"></path>
                  <path d="M5.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Projection</span>
            </div>

            {/* Volume-based Section Header */}
            <div style={styles.submenuSectionHeader}>Volume-based</div>

            {/* Anchored VWAP */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" d="M17 17h1v6h-1v-6zM17 2h1v5h-1V2z"></path>
                <path fill="currentColor" d="M16 17h3V8h-3v9zM15 7h5v11h-5V7zM10 5h1v5h-1V5zM10 22h1v3h-1v-3z"></path>
                <path fill="currentColor" d="M9 21h3V10H9v11zM8 9h5v13H8V9z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M25.27 9.42L14.1 16.53l-6.98-1.5L5.3 16.4l-.6-.8 2.18-1.64 7.02 1.5 10.83-6.88.54.84z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
              </svg>
              <span style={styles.submenuText}>Anchored VWAP</span>
            </div>

            {/* Fixed Range Volume Profile */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M5 21.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.5 24a2.5 2.5 0 0 0 .5-4.95V3H3v16.05A2.5 2.5 0 0 0 3.5 24zM25 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM23.5 3a2.5 2.5 0 0 1 .5 4.95V24h-1V7.95A2.5 2.5 0 0 1 23.5 3z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M9 7H4v2h5V7zM3 6v4h7V6H3z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 10H4v2h8v-2zM3 9v4h10V9H3z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7 13H4v2h3v-2zm-4-1v4h5v-4H3z"></path>
              </svg>
              <span style={styles.submenuText}>Fixed Range Volume Profile</span>
            </div>

            {/* Anchored Volume Profile */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" fillRule="evenodd" d="M24 3h-1v4h-6v3h-5v3H8.95a2.5 2.5 0 1 0 0 1H15v3h5v3h3v4h1V3Zm-6 7h5V8h-5v2Zm-1 1h-4v2h10v-2h-6Zm4 5h-5v-2h7v2h-2Zm0 3v-2h2v2h-2ZM6.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
              </svg>
              <span style={styles.submenuText}>Anchored Volume Profile</span>
            </div>

            {/* Measurer Section Header */}
            <div style={styles.submenuSectionHeader}>Measurer</div>

            {/* Price Range */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M4 5h16.5v-1h-16.5zM25 24h-16.5v1h16.5z"></path>
                  <path fillRule="nonzero" d="M6.5 26c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path fillRule="nonzero" d="M14 9v14h1v-14z"></path>
                  <path d="M14.5 6l2.5 3h-5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Price Range</span>
            </div>

            {/* Date Range */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M20 14h-14v1h14z"></path>
                  <path d="M20 17v-5l3 2.5z"></path>
                  <path fillRule="nonzero" d="M24 8.5v16.5h1v-16.5zM4 4v16.5h1v-16.5z"></path>
                  <path fillRule="nonzero" d="M4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Date Range</span>
            </div>

            {/* Date and Price Range */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M6.5 23v1h17.5v-17.5h-1v16.5z"></path>
                  <path fillRule="nonzero" d="M21.5 5v-1h-17.5v17.5h1v-16.5z"></path>
                  <path fillRule="nonzero" d="M4.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path fillRule="nonzero" d="M13 9v13h1v-13z"></path>
                  <path d="M13.5 6l2.5 3h-5z"></path>
                  <path fillRule="nonzero" d="M19 14h-13v1h13z"></path>
                  <path d="M19 17v-5l3 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Date and Price Range</span>
            </div>
          </div>
        )}

        {/* Brushes Submenu - positioned absolutely to not affect layout */}
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Highlighter</span>
            </div>

            {/* Arrow Marker */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8.354 20.354l5-5-.707-.707-5 5z"></path>
                  <path d="M16.354 12.354l8-8-.707-.707-8 8z"></path>
                  <path d="M14.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM6.5 23c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Arrow Marker</span>
            </div>

            {/* Arrow */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4.354 25.354l5-5-.707-.707-5 5z"></path>
                  <path d="M12.354 17.354l5-5-.707-.707-5 5z"></path>
                  <path d="M20.354 9.354l5-5-.707-.707-5 5z"></path>
                  <path d="M18.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Arrow</span>
            </div>

            {/* Arrow Mark Up */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M15.5 22.5c0-2.697-1.073-5.225-2.947-7.089l-.705.709c1.687 1.679 2.652 3.952 2.652 6.38h1z"></path>
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M7.5 23h16.5v-1h-16.5z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Arrow Mark Up</span>
            </div>

            {/* Arrow Mark Down */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.551 17.98l13.284-7.033-.468-.884-13.284 7.033z"></path>
                  <path d="M6 11.801l16-8.471v4.17h1v-5.83l-18 9.529v5.301h1z"></path>
                  <path d="M6 24.67v-4.17h-1v5.83l18-9.529v-5.301h-1v4.699z"></path>
                  <path d="M5.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Arrow Mark Down</span>
            </div>

            {/* Rectangle */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.5 23h13v-1h-13z"></path>
                  <path d="M7.55 13.088l13.29-6.254-.426-.905-13.29 6.254z"></path>
                  <path d="M5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Rectangle</span>
            </div>

            {/* Rotated Rectangle */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20.349 20.654l4.489-.711-.156-.988-4.489.711z"></path>
                  <path d="M7.254 22.728l9.627-1.525-.156-.988-9.627 1.525z"></path>
                  <path d="M7.284 22.118l15.669-8.331-.469-.883-15.669 8.331z"></path>
                  <path d="M6.732 21.248l8.364-15.731-.883-.469-8.364 15.731z"></path>
                  <path d="M17.465 18.758l-8.188-8.188-.707.707 8.188 8.188z"></path>
                  <path d="M6.273 20.818l1.499-9.467-.988-.156-1.499 9.467z"></path>
                  <path d="M8.329 7.834l.715-4.516-.988-.156-.715 4.51"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Rotated Rectangle</span>
            </div>

            {/* Path */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M21.487 5.248l-12.019 1.502.124.992 12.019-1.502zM6.619 9.355l-2.217 11.083.981.196 2.217-11.083zM6.534 22.75l12.071-1.509-.124-.992-12.071 1.509zM21.387 18.612l2.21-11.048-.981-.196-2.21 11.048zM8.507 9.214l10.255 10.255.707-.707-10.255-10.255z"></path>
                  <path d="M7.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Path</span>
            </div>

            {/* Circle */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4.395 10.18c3.432-4.412 10.065-4.998 13.675-.973l.745-.668c-4.044-4.509-11.409-3.858-15.209 1.027l.789.614z"></path>
                  <path d="M19.991 12.494c.877 2.718.231 5.487-1.897 7.543-2.646 2.556-6.752 2.83-9.188.477-1.992-1.924-2.027-5.38-.059-7.281 1.582-1.528 3.78-1.587 5.305-.115 1.024.99 1.386 2.424.876 3.491l.902.431c.709-1.482.232-3.37-1.084-4.641-1.921-1.855-4.734-1.78-6.695.115-2.378 2.297-2.337 6.405.059 8.719 2.846 2.749 7.563 2.435 10.577-.477 2.407-2.325 3.147-5.493 2.154-8.569l-.952.307z"></path>
                  <path d="M21.01 9.697l3.197-3.197-.707-.707-3.197 3.197z"></path>
                  <path d="M14.989 15.719l3.674-3.674-.707-.707-3.674 3.674z"></path>
                  <path d="M13.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM19.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Circle</span>
            </div>

            {/* Ellipse */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8 9.5c0 3.038 2.462 5.5 5.5 5.5s5.5-2.462 5.5-5.5v-.5h-1v.5c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5v-.5h-1v.5z"></path>
                  <path d="M0 9.5c0 7.456 6.044 13.5 13.5 13.5s13.5-6.044 13.5-13.5v-.5h-1v.5c0 6.904-5.596 12.5-12.5 12.5s-12.5-5.596-12.5-12.5v-.5h-1v.5z"></path>
                  <path d="M4 9.5c0 4.259 2.828 7.964 6.86 9.128l.48.139.277-.961-.48-.139c-3.607-1.041-6.137-4.356-6.137-8.167v-.5h-1v.5z"></path>
                  <path d="M16.141 18.628c4.032-1.165 6.859-4.869 6.859-9.128v-.5h-1v.5c0 3.811-2.53 7.125-6.136 8.167l-.48.139.278.961.48-.139z"></path>
                  <path d="M13.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM13.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Ellipse</span>
            </div>

            {/* Polyline */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20.349 20.654l4.489-.711-.156-.988-4.489.711z"></path>
                  <path d="M7.254 22.728l9.627-1.525-.156-.988-9.627 1.525z"></path>
                  <path d="M7.284 22.118l15.669-8.331-.469-.883-15.669 8.331z"></path>
                  <path d="M6.732 21.248l8.364-15.731-.883-.469-8.364 15.731z"></path>
                  <path d="M17.465 18.758l-8.188-8.188-.707.707 8.188 8.188z"></path>
                  <path d="M6.273 20.818l1.499-9.467-.988-.156-1.499 9.467z"></path>
                  <path d="M8.329 7.834l.715-4.516-.988-.156-.715 4.51"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Polyline</span>
            </div>
          </div>
        )}

        <div style={styles.mainChart}>
          <div>I am middle</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  topScroll: {
    height: "30px",
    overflowX: "auto",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #ccc",
    background: "#fafafa",
    flexShrink: 0,
  },
  scrollRow: { display: "flex", height: "100%" },
  testBox: {
    display: "flex",
    alignItems: "center",
    borderRight: "1px solid #ccc",
    padding: "0 5px",
    background: "#fff",
    cursor: "pointer",
  },
  popup: {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minWidth: "200px",
    maxHeight: "300px",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 2000,
  },
  popupContent: { padding: "5px" },
  dropdownItem: {
    padding: "5px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  toggleItem: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  mainArea: { display: "flex", flex: 1, overflow: "hidden" },
  leftColumn: {
    width: "40px",
    flexShrink: 0,
    borderRight: "1px solid #ccc",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the top
  },
  numberBox: {
    height: "40px",
    width: "100%", // Occupy full width of the leftColumn
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #ccc",
    cursor: "pointer", // Make it clear that these are clickable
  },
  submenu: {
    position: "absolute",
    left: "40px", // Position it right next to the left column
    top: "70px", // Start from the second menu item (30px toolbar + 40px first item)
    width: "180px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 70px)", // Don't exceed viewport height
    overflowY: "auto", // Add scroll if content overflows
  },
  submenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  submenuText: {
    marginLeft: "8px",
    fontSize: "14px",
  },
  fibSubmenu: {
    position: "absolute",
    left: "40px", // Position it right next to the left column
    top: "110px", // Start from the third menu item (30px toolbar + 40px first item + 40px second item)
    width: "220px", // Slightly wider for longer Fibonacci names
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 110px)", // Don't exceed viewport height
    overflowY: "auto", // Add scroll if content overflows
  },
  patternSubmenu: {
    position: "absolute",
    left: "40px", // Position it right next to the left column
    top: "150px", // Start from the fourth menu item (30px toolbar + 40px * 3 items)
    width: "200px", // Width for Pattern & Elliott Wave names
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 150px)", // Don't exceed viewport height
    overflowY: "auto", // Add scroll if content overflows
  },
  projectionSubmenu: {
    position: "absolute",
    left: "40px", // Position it right next to the left column
    top: "190px", // Start from the fifth menu item (30px toolbar + 40px * 4 items)
    width: "220px", // Width for Projection related items
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 190px)", // Don't exceed viewport height
    overflowY: "auto", // Add scroll if content overflows
  },
  brushesSubmenu: { // Style for the new Brushes submenu
    position: "absolute",
    left: "40px", // Position it right next to the left column
    top: "230px", // Start from the sixth menu item (30px toolbar + 40px * 5 items)
    width: "200px", // Adjust width as needed
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 230px)", // Don't exceed viewport height
    overflowY: "auto", // Add scroll if content overflows
  },
  submenuSectionHeader: {
    padding: "8px 0",
    fontSize: "12px",
    color: "#555",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    marginBottom: "5px",
  },
  mainChart: {
    flex: 1,
    background: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};