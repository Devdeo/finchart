
import { useRef } from "react";
import { styles } from "../styles/styles";

interface TopToolbarProps {
  openMenu: string | null;
  menuPosition: { top: number; left: number };
  settings: any;
  oiData: boolean;
  setOiData: (value: boolean) => void;
  openDropdown: (menu: string, event: any) => void;
  toggleSetting: (key: string) => void;
  menuRef: any;
}

export default function TopToolbar({
  openMenu,
  menuPosition,
  settings,
  oiData,
  setOiData,
  openDropdown,
  toggleSetting,
  menuRef,
}: TopToolbarProps) {
  const toolbarRef = useRef(null);

  return (
    <>
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
                    checked={value as boolean}
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
