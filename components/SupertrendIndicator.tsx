
import React, { useEffect, useRef, useState } from "react";

interface SupertrendIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialAtrPeriod?: number;
  initialMultiplier?: number;
  initialUpColor?: string;
  initialDownColor?: string;
}

const SupertrendIndicator: React.FC<SupertrendIndicatorProps> = ({
  chart,
  onRemove,
  initialAtrPeriod = 10,
  initialMultiplier = 3.0,
  initialUpColor = "#00C853",
  initialDownColor = "#D50000"
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [atrPeriod, setAtrPeriod] = useState(initialAtrPeriod);
  const [multiplier, setMultiplier] = useState(initialMultiplier);
  const [upColor, setUpColor] = useState(initialUpColor);
  const [downColor, setDownColor] = useState(initialDownColor);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const registerSupertrend = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_SUPERTREND",
        shortName: "ST",
        series: "price",
        calcParams: [atrPeriod, multiplier],
        figures: [
          { key: "supertrend", title: "Supertrend", type: "line" },
        ],
        calc: (dataList: any[], indicator: any) => {
          const p = Number(indicator.calcParams[0]) || 10; // ATR period
          const m = Number(indicator.calcParams[1]) || 3; // multiplier

          const result: any[] = [];

          // --- Compute ATR first ---
          const trList: number[] = [];
          for (let i = 0; i < dataList.length; i++) {
            const curr = dataList[i];
            const prev = dataList[i - 1] || curr;
            const tr = Math.max(
              curr.high - curr.low,
              Math.abs(curr.high - prev.close),
              Math.abs(curr.low - prev.close)
            );
            trList.push(tr);
          }

          const atrList: number[] = [];
          let atr: number | null = null;
          for (let i = 0; i < trList.length; i++) {
            if (i < p) {
              const slice = trList.slice(0, i + 1);
              atr = slice.reduce((a, b) => a + b, 0) / slice.length;
            } else {
              atr = (atr! * (p - 1) + trList[i]) / p;
            }
            atrList.push(atr!);
          }

          // --- Compute Supertrend ---
          let prevSupertrend: number | null = null;
          let trendUp = true;

          for (let i = 0; i < dataList.length; i++) {
            const curr = dataList[i];
            const mid = (curr.high + curr.low) / 2;
            const atrVal = atrList[i];

            const upperBand = mid + m * atrVal;
            const lowerBand = mid - m * atrVal;

            let supertrend: number;
            if (prevSupertrend == null) {
              supertrend = trendUp ? lowerBand : upperBand;
              trendUp = curr.close >= supertrend;
            } else {
              if (curr.close > prevSupertrend) {
                trendUp = true;
              } else if (curr.close < prevSupertrend) {
                trendUp = false;
              }
              supertrend = trendUp ? lowerBand : upperBand;
            }

            prevSupertrend = supertrend;
            result.push({ supertrend });
          }

          return result;
        },
        styles: {
          lines: [
            {
              key: "supertrend",
              color: upColor,
              size: 2,
              style: "solid",
            },
          ],
        },
      });
    } catch (error) {
      // Silently handle duplicate registration
    }
  };

  useEffect(() => {
    if (!chart) return;

    const initSupertrend = async () => {
      const klinecharts = await import("klinecharts");
      registerSupertrend(klinecharts);
      const id = chart.createIndicator("MY_SUPERTREND", true, { id: "candle_pane" });
      indicatorIdRef.current = id;
    };

    initSupertrend();

    return () => {
      if (indicatorIdRef.current && chart) {
        chart.removeIndicator({ id: indicatorIdRef.current });
      }
    };
  }, [chart]);

  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    chart.overrideIndicator({
      id: indicatorIdRef.current,
      calcParams: [atrPeriod, multiplier],
    });
  }, [atrPeriod, multiplier, chart]);

  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    chart.overrideIndicator({
      id: indicatorIdRef.current,
      styles: {
        lines: [
          { key: "supertrend", color: upColor, size: 2 }
        ],
      },
    });
  }, [upColor, downColor, chart]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const handleTextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  const handleCloseSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings(false);
  };

  const handleAtrPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setAtrPeriod(value);
    }
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0.1 && value <= 10) {
      setMultiplier(value);
    }
  };

  const handleUpColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpColor(e.target.value);
  };

  const handleDownColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownColor(e.target.value);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", margin: "2px" }} ref={settingsRef}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid rgba(0, 0, 0, 0.15)",
          borderRadius: "4px",
          padding: "4px 6px",
          fontSize: "11px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          gap: "4px",
          minHeight: "20px",
          backdropFilter: "blur(2px)",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            color: "#131722",
            cursor: "pointer",
            userSelect: "none",
            padding: "2px 4px",
            borderRadius: "2px",
            transition: "background-color 0.2s",
            fontWeight: "500",
            fontSize: "11px",
            lineHeight: "1.2",
            minWidth: "50px",
            textAlign: "center",
          }}
          onClick={handleTextClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(19, 23, 34, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Click to open settings"
        >
          Supertrend({atrPeriod},{multiplier})
        </span>

        <button
          style={{
            background: "none",
            border: "none",
            color: "#686d76",
            fontSize: "10px",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            borderRadius: "2px",
            outline: "none",
            transition: "background-color 0.2s",
            zIndex: 1000,
            position: "relative",
            pointerEvents: "auto",
          }}
          onClick={handleSettingsClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(104, 109, 118, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Settings"
        >
          <i className="fa-solid fa-gear"></i>
        </button>

        <button
          style={{
            background: "#f23645",
            color: "white",
            border: "none",
            borderRadius: "2px",
            width: "16px",
            height: "16px",
            fontSize: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            padding: "0",
            fontWeight: "bold",
            outline: "none",
            transition: "background-color 0.2s",
            zIndex: 1000,
            position: "relative",
            pointerEvents: "auto",
          }}
          onClick={handleRemoveClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#d32f3f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f23645";
          }}
          title="Remove"
        >
          ×
        </button>
      </div>

      {showSettings && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: "white",
            border: "1px solid #e0e3eb",
            borderRadius: "6px",
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 2000,
            minWidth: "250px",
            marginTop: "4px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "16px",
            borderBottom: "1px solid #e0e3eb",
            paddingBottom: "8px"
          }}>
            <span style={{
              color: "#131722",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Supertrend Settings
            </span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#787b86",
                fontSize: "16px",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                lineHeight: "1",
                transition: "color 0.2s",
                pointerEvents: "auto",
              }}
              onClick={handleCloseSettings}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#131722";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#787b86";
              }}
              title="Close"
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#131722"
              }}>
                ATR Period
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={atrPeriod}
                onChange={handleAtrPeriodChange}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "#131722",
                  transition: "border-color 0.2s",
                  pointerEvents: "auto",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2962ff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e3eb";
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#131722"
              }}>
                Multiplier
              </label>
              <input
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                value={multiplier}
                onChange={handleMultiplierChange}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "#131722",
                  transition: "border-color 0.2s",
                  pointerEvents: "auto",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2962ff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e3eb";
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "12px",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#131722"
            }}>
              Colors
            </label>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="color"
                  value={upColor}
                  onChange={handleUpColorChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "1px solid #e0e3eb",
                    borderRadius: "4px",
                    cursor: "pointer",
                    outline: "none",
                    backgroundColor: "white",
                    padding: "2px",
                    pointerEvents: "auto",
                  }}
                />
                <span style={{ fontSize: "11px", color: "#131722" }}>Up Trend</span>
              </div>
              
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="color"
                  value={downColor}
                  onChange={handleDownColorChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "1px solid #e0e3eb",
                    borderRadius: "4px",
                    cursor: "pointer",
                    outline: "none",
                    backgroundColor: "white",
                    padding: "2px",
                    pointerEvents: "auto",
                  }}
                />
                <span style={{ fontSize: "11px", color: "#131722" }}>Down Trend</span>
              </div>
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2962ff",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              cursor: "pointer",
              color: "white",
              fontWeight: "600",
              transition: "background-color 0.2s",
              pointerEvents: "auto",
            }}
            onClick={handleCloseSettings}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#1e53e5";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#2962ff";
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default SupertrendIndicator;
