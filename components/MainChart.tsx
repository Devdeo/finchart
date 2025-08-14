import { useState, useRef, useEffect } from "react";

export default function MainChart() {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);
  const menuRef = useRef(null);
  const [showSubmenu, setShowSubmenu] = useState(false); // State to control submenu visibility
  const [selectedTrendTool, setSelectedTrendTool] = useState(null);
  const [trendToolPosition, setTrendToolPosition] = useState({ top: 0, left: 0 });
  const [showSecondSubmenu, setShowSecondSubmenu] = useState(false); // State for second icon submenu

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
        !e.target.closest(".toolbar-btn") &&
        !e.target.closest(".submenu-item") &&
        !e.target.closest(".trend-tool-menu") &&
        !e.target.closest(".second-submenu")
      ) {
        setOpenMenu(null);
        setSelectedTrendTool(null);
        setShowSecondSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleTrendToolClick = (toolName, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedTrendTool(selectedTrendTool === toolName ? null : toolName);
    
    // Position the trend tool menu
    setTrendToolPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 10,
    });

    // Close main dropdown if open
    setOpenMenu(null);
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
          {/* Toggle button for submenu */}
          <div 
            style={styles.numberBox} 
            onClick={() => setShowSubmenu(!showSubmenu)}
          >
            <i className={`fa-solid ${showSubmenu ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </div>

          {/* Original tool icons */}
          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor">
                <path d="M18 15h8v-1h-8z"></path>
                <path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"></path>
              </g>
            </svg>
          </div>

          <div 
            style={styles.numberBox}
            onClick={() => setShowSecondSubmenu(!showSecondSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
          </div>

          <div style={styles.numberBox}>
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

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                <path d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="evenodd">
                <path fillRule="nonzero" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path>
              </g>
            </svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path>
                <path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path>
              </g>
            </svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <path fill="currentColor" d="M8 6.5c0-.28.22-.5.5-.5H14v16h-2v1h5v-1h-2V6h5.5c.28 0 .5.22.5.5V9h1V6.5c0-.83-.67-1.5-1.5-1.5h-12C7.67 5 7 5.67 7 6.5V9h1V6.5Z"></path>
            </svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <path fill="currentColor" d="M2 9.75a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h24a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5zm0 1h3v2.5h1v-2.5h3.25v3.9h1v-3.9h3.25v2.5h1v-2.5h3.25v3.9h1v-3.9H22v2.5h1v-2.5h3a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 1 .5-.5z" transform="rotate(-45 14 14)"></path>
            </svg>
          </div>

          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor">
              <path d="M17.646 18.354l4 4 .708-.708-4-4z"></path>
              <path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"></path>
              <path d="M9 13h7v-1H9z"></path>
              <path d="M13 16V9h-1v7z"></path>
            </svg>
          </div>
        </div>

        {/* Submenu */}
        {showSubmenu && (
          <div style={styles.submenu}>
            {/* Trend Line */}
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('trendline', e)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend Line</span>
            </div>

            {/* Ray */}
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('ray', e)}
            >
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
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('infoline', e)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero" clipRule="evenodd">
                  <path d="M22.4989 4C21.6705 4 20.9989 4.67157 20.9989 5.5C20.9989 5.91456 21.1664 6.28904 21.4387 6.56106C21.7106 6.83282 22.0848 7 22.4989 7C23.3274 7 23.9989 6.32843 23.9989 5.5C23.9989 4.67157 23.3274 4 22.4989 4ZM19.9989 5.5C19.9989 4.11929 21.1182 3 22.4989 3C23.8796 3 24.9989 4.11929 24.9989 5.5C24.9989 6.88071 23.8796 8 22.4989 8C21.9899 8 21.5159 7.8475 21.1209 7.58617L7.58575 21.1214C7.84733 21.5165 8 21.9907 8 22.5C8 23.8807 6.88071 25 5.5 25C4.11929 25 3 23.8807 3 22.5C3 21.1193 4.11929 20 5.5 20C6.00932 20 6.48351 20.1527 6.87864 20.4143L20.4136 6.87929C20.1518 6.48403 19.9989 6.0096 19.9989 5.5ZM5.5 21C4.67157 21 4 21.6716 4 22.5C4 23.3284 4.67157 24 5.5 24C6.32843 24 7 23.3284 7 22.5C7 22.0856 6.83265 21.7113 6.56066 21.4393C6.28867 21.1673 5.91435 21 5.5 21Z"></path>
                  <path d="M16 19.5C16 18.1193 17.1193 17 18.5 17H23.5C24.8807 17 26 18.1193 26 19.5V22.5C26 23.8807 24.8807 25 23.5 25H18.5C17.1193 25 16 23.8807 16 22.5V19.5ZM18.5 18C17.6716 18 17 18.6716 17 19.5V22.5C17 23.3284 17.6716 24 18.5 24H23.5C24.3284 24 25 23.3284 25 22.5V19.5C25 18.6716 24.3284 18 23.5 18H18.5Z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Info Line</span>
            </div>

            {/* Extended Line */}
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('extendedline', e)}
            >
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
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('trendangle', e)}
            >
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
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('horizontalline', e)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 15h8.5v-1h-8.5zM16.5 15h8.5v-1h-8.5z"></path>
                  <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Horizontal Line</span>
            </div>

            {/* Horizontal Ray */}
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('horizontalray', e)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8.5 15h16.5v-1h-16.5z"></path>
                  <path d="M6.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Horizontal Ray</span>
            </div>

            {/* Vertical Line */}
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('verticalline', e)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M15 12.5v-8.5h-1v8.5zM14 16.5v8.5h1v-8.5z"></path>
                  <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Vertical Line</span>
            </div>

            {/* Cross Line */}
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('crossline', e)}
            >
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
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('parallelchannel', e)}
            >
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
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('regressiontrend', e)}
            >
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
            <div 
              className="submenu-item"
              style={styles.submenuItem}
              onClick={(e) => handleTrendToolClick('flattopbottom', e)}
            >
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

        {/* Trend Tool Menu */}
        {selectedTrendTool && (
          <div
            className="trend-tool-menu"
            style={{
              ...styles.trendToolMenu,
              position: "absolute",
              top: trendToolPosition.top,
              left: trendToolPosition.left,
            }}
          >
            <div style={styles.popupContent}>
              {selectedTrendTool === 'trendline' && (
                <>
                  <div style={styles.dropdownItem}>Standard Trend Line</div>
                  <div style={styles.dropdownItem}>Trend Line with Alert</div>
                  <div style={styles.dropdownItem}>Strong Trend Line</div>
                  <div style={styles.dropdownItem}>Weak Trend Line</div>
                </>
              )}
              {selectedTrendTool === 'ray' && (
                <>
                  <div style={styles.dropdownItem}>Standard Ray</div>
                  <div style={styles.dropdownItem}>Ray with Alert</div>
                  <div style={styles.dropdownItem}>Strong Ray</div>
                </>
              )}
              {selectedTrendTool === 'infoline' && (
                <>
                  <div style={styles.dropdownItem}>Price Info Line</div>
                  <div style={styles.dropdownItem}>Time Info Line</div>
                  <div style={styles.dropdownItem}>Custom Info Line</div>
                </>
              )}
              {selectedTrendTool === 'extendedline' && (
                <>
                  <div style={styles.dropdownItem}>Extended Line Left</div>
                  <div style={styles.dropdownItem}>Extended Line Right</div>
                  <div style={styles.dropdownItem}>Extended Line Both</div>
                </>
              )}
              {selectedTrendTool === 'trendangle' && (
                <>
                  <div style={styles.dropdownItem}>45° Angle</div>
                  <div style={styles.dropdownItem}>Custom Angle</div>
                  <div style={styles.dropdownItem}>Fibonacci Angle</div>
                </>
              )}
              {selectedTrendTool === 'horizontalline' && (
                <>
                  <div style={styles.dropdownItem}>Support Line</div>
                  <div style={styles.dropdownItem}>Resistance Line</div>
                  <div style={styles.dropdownItem}>Price Target</div>
                </>
              )}
              {selectedTrendTool === 'horizontalray' && (
                <>
                  <div style={styles.dropdownItem}>Support Ray</div>
                  <div style={styles.dropdownItem}>Resistance Ray</div>
                </>
              )}
              {selectedTrendTool === 'verticalline' && (
                <>
                  <div style={styles.dropdownItem}>Time Line</div>
                  <div style={styles.dropdownItem}>Event Line</div>
                  <div style={styles.dropdownItem}>Session Line</div>
                </>
              )}
              {selectedTrendTool === 'crossline' && (
                <>
                  <div style={styles.dropdownItem}>Price Cross</div>
                  <div style={styles.dropdownItem}>Time Cross</div>
                  <div style={styles.dropdownItem}>Reference Cross</div>
                </>
              )}
              {selectedTrendTool === 'parallelchannel' && (
                <>
                  <div style={styles.dropdownItem}>Standard Channel</div>
                  <div style={styles.dropdownItem}>Regression Channel</div>
                  <div style={styles.dropdownItem}>Fibonacci Channel</div>
                </>
              )}
              {selectedTrendTool === 'regressiontrend' && (
                <>
                  <div style={styles.dropdownItem}>Linear Regression</div>
                  <div style={styles.dropdownItem}>Polynomial Regression</div>
                  <div style={styles.dropdownItem}>Logarithmic Regression</div>
                </>
              )}
              {selectedTrendTool === 'flattopbottom' && (
                <>
                  <div style={styles.dropdownItem}>Flat Top Pattern</div>
                  <div style={styles.dropdownItem}>Flat Bottom Pattern</div>
                  <div style={styles.dropdownItem}>Double Top/Bottom</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Second Submenu - appears above middle area */}
        {showSecondSubmenu && (
          <div className="second-submenu" style={{
            ...styles.secondSubmenu,
            left: showSubmenu ? "220px" : "40px", // Adjust based on whether first submenu is open
          }}>
            {/* Drawing Tools */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend Line</span>
            </div>

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

            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero" clipRule="evenodd">
                  <path d="M22.4989 4C21.6705 4 20.9989 4.67157 20.9989 5.5C20.9989 5.91456 21.1664 6.28904 21.4387 6.56106C21.7106 6.83282 22.0848 7 22.4989 7C23.3274 7 23.9989 6.32843 23.9989 5.5C23.9989 4.67157 23.3274 4 22.4989 4ZM19.9989 5.5C19.9989 4.11929 21.1182 3 22.4989 3C23.8796 3 24.9989 4.11929 24.9989 5.5C24.9989 6.88071 23.8796 8 22.4989 8C21.9899 8 21.5159 7.8475 21.1209 7.58617L7.58575 21.1214C7.84733 21.5165 8 21.9907 8 22.5C8 23.8807 6.88071 25 5.5 25C4.11929 25 3 23.8807 3 22.5C3 21.1193 4.11929 20 5.5 20C6.00932 20 6.48351 20.1527 6.87864 20.4143L20.4136 6.87929C20.1518 6.48403 19.9989 6.0096 19.9989 5.5ZM5.5 21C4.67157 21 4 21.6716 4 22.5C4 23.3284 4.67157 24 5.5 24C6.32843 24 7 23.3284 7 22.5C7 22.0856 6.83265 21.7113 6.56066 21.4393C6.28867 21.1673 5.91435 21 5.5 21Z"></path>
                  <path d="M16 19.5C16 18.1193 17.1193 17 18.5 17H23.5C24.8807 17 26 18.1193 26 19.5V22.5C26 23.8807 24.8807 25 23.5 25H18.5C17.1193 25 16 23.8807 16 22.5V19.5ZM18.5 18C17.6716 18 17 18.6716 17 19.5V22.5C17 23.3284 17.6716 24 18.5 24H23.5C24.3284 24 25 23.3284 25 22.5V19.5C25 18.6716 24.3284 18 23.5 18H18.5Z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Info Line</span>
            </div>

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

            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 15h8.5v-1h-8.5zM16.5 15h8.5v-1h-8.5z"></path>
                  <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Horizontal Line</span>
            </div>

            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M15 12v-8.5h-1v8.5zM14 16.5v8.5h1v-8.5z"></path>
                  <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Vertical Line</span>
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
    width: "180px", // Width of the submenu
    backgroundColor: "#f0f0f0", // Background color for the submenu
    borderRight: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
  },
  submenuItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    cursor: "pointer",
  },
  submenuText: {
    marginLeft: "8px",
    fontSize: "14px",
  },
  trendToolMenu: {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minWidth: "200px",
    maxHeight: "300px",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 2001,
  },
  secondSubmenu: {
    position: "absolute",
    top: "30px", // Position it just below the top toolbar
    width: "180px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    boxSizing: "border-box",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
  mainChart: {
    flex: 1,
    background: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};