
import { useState, useRef, useEffect } from "react";

interface TopToolbarProps {
  oiData: boolean;
  setOiData: (value: boolean) => void;
  settings: any;
  toggleSetting: (key: string) => void;
}

export default function TopToolbar({ oiData, setOiData, settings, toggleSetting }: TopToolbarProps) {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".popup-menu") &&
        !e.target.closest(".toolbar-btn")
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = (menu, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpenMenu(openMenu === menu ? null : menu);

    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setTimeout(() => {
      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + menuRect.width > viewportWidth) {
          left = viewportWidth - menuRect.width - 10;
        }
        if (left < 0) left = 0;

        if (top + menuRect.height > window.scrollY + viewportHeight) {
          top = rect.top + window.scrollY - menuRect.height;
        }
        if (top < 0) top = 0;

        setMenuPosition({ top, left });
      }
    }, 0);
  };

  return (
    <>
      <div className="top-scroll" ref={toolbarRef}>
        <div className="scroll-row">
          <div className="toolbar-btn test-box">
            <i className="fa-solid fa-magnifying-glass"></i> Symbol
          </div>

          <div
            className="toolbar-btn test-box"
            onClick={(e) => openDropdown("timeframe", e)}
          >
            <i className="fa-solid fa-hourglass"></i>&nbsp; Timeframe
          </div>

          <div
            className="toolbar-btn test-box"
            onClick={(e) => openDropdown("charttype", e)}
          >
            <i className="fa-solid fa-chart-column"></i>&nbsp; Chart Type
          </div>

          <div
            className="toolbar-btn test-box"
            onClick={(e) => openDropdown("indicator", e)}
          >
            <i className="fa-solid fa-chart-simple"></i>&nbsp; Indicator
          </div>

          <div
            className="toolbar-btn test-box"
            onClick={(e) => openDropdown("ai", e)}
          >
            <i className="fa-solid fa-hexagon-nodes-bolt"></i>&nbsp; AI
          </div>

          <div className="test-box">
            <input
              type="checkbox"
              checked={oiData}
              onChange={() => setOiData(!oiData)}
              style={{ marginRight: "5px" }}
            />
            <i className="fa-solid fa-database"></i>&nbsp; OI Data
          </div>

          <div
            className="toolbar-btn test-box"
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
          className="popup-menu popup"
          style={{
            position: "absolute",
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <div className="popup-content">
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
                <div key={tf} className="dropdown-item">
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
                <div key={type} className="dropdown-item">
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
                  <div key={item} className="dropdown-item">
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
                  <div key={item} className="dropdown-item">
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
                  <div key={item} className="dropdown-item">
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
                  <div key={item} className="dropdown-item">
                    {item}
                  </div>
                ))}
                <strong>Pattern Recognition</strong>
                {[
                  "Chart Pattern Recognition",
                  "Candlestick Pattern Recognition",
                  "Harmonic Pattern Recognition",
                ].map((item) => (
                  <div key={item} className="dropdown-item">
                    {item}
                  </div>
                ))}
              </>
            )}

            {openMenu === "ai" && (
              <>
                <div className="dropdown-item">Auto Analysis</div>
                <div className="dropdown-item">Chat</div>
              </>
            )}

            {openMenu === "settings" &&
              Object.entries(settings).map(([key, value]) => (
                <label key={key} className="toggle-item">
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
    </>
  );
}
