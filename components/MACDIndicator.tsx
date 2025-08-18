
import React, { useEffect, useRef, useState } from "react";

interface MACDIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialFast?: number;
  initialSlow?: number;
  initialSignal?: number;
  initialMacdColor?: string;
  initialSignalColor?: string;
  initialHistColor?: string;
}

const MACDIndicator: React.FC<MACDIndicatorProps> = ({
  chart,
  onRemove,
  initialFast = 12,
  initialSlow = 26,
  initialSignal = 9,
  initialMacdColor = "#2196F3",
  initialSignalColor = "#FF9800",
  initialHistColor = "#4CAF50"
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [fast, setFast] = useState(initialFast);
  const [slow, setSlow] = useState(initialSlow);
  const [signal, setSignal] = useState(initialSignal);
  const [macdColor, setMacdColor] = useState(initialMacdColor);
  const [signalColor, setSignalColor] = useState(initialSignalColor);
  const [histColor, setHistColor] = useState(initialHistColor);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const registerMACD = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_MACD",
        shortName: "MACD",
        series: "indicator",
        calcParams: [fast, slow, signal],
        figures: [
          { key: "macd", title: "MACD", type: "line" },
          { key: "signal", title: "Signal", type: "line" },
          { key: "hist", title: "Hist", type: "bar" },
        ],
        calc: (dataList: any[], indicator: any) => {
          const [fastP, slowP, signalP] = indicator.calcParams;
          
          const ema = (data: number[], period: number): (number | null)[] => {
            const k = 2 / (period + 1);
            const result: (number | null)[] = [];
            let prev: number | null = null;
            for (let i = 0; i < data.length; i++) {
              const val = data[i];
              if (val == null) {
                result.push(null);
                continue;
              }
              if (prev == null) {
                prev = val;
              } else {
                prev = val * k + prev * (1 - k);
              }
              result.push(prev);
            }
            return result;
          };

          const closes = dataList.map((d) => d.close);
          const emaFast = ema(closes, fastP);
          const emaSlow = ema(closes, slowP);

          const macdArr = closes.map((_, i) =>
            emaFast[i] != null && emaSlow[i] != null
              ? (emaFast[i]! - emaSlow[i]!)
              : null
          );

          const signalArr = ema(macdArr.map((v) => v ?? 0), signalP);

          const result: any[] = [];
          for (let i = 0; i < closes.length; i++) {
            if (macdArr[i] != null && signalArr[i] != null) {
              result.push({
                macd: macdArr[i],
                signal: signalArr[i],
                hist: macdArr[i]! - signalArr[i]!,
              });
            } else {
              result.push({});
            }
          }
          return result;
        },
        styles: {
          lines: [
            { key: "macd", color: macdColor, size: 2 },
            { key: "signal", color: signalColor, size: 2 },
          ],
          bars: [
            { key: "hist", upColor: histColor, downColor: "#F44336" },
          ],
        },
      });
    } catch (error) {
      // Silently handle duplicate registration
    }
  };

  useEffect(() => {
    if (!chart) return;

    const initMACD = async () => {
      const klinecharts = await import("klinecharts");
      registerMACD(klinecharts);
      const id = chart.createIndicator("MY_MACD", false, { id: "new_pane" });
      indicatorIdRef.current = id;
    };

    initMACD();

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
      calcParams: [fast, slow, signal],
    });
  }, [fast, slow, signal, chart]);

  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    chart.overrideIndicator({
      id: indicatorIdRef.current,
      styles: {
        lines: [
          { key: "macd", color: macdColor, size: 2 },
          { key: "signal", color: signalColor, size: 2 },
        ],
        bars: [
          { key: "hist", upColor: histColor, downColor: "#F44336" },
        ],
      },
    });
  }, [macdColor, signalColor, histColor, chart]);

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

  const handleFastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setFast(value);
    }
  };

  const handleSlowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setSlow(value);
    }
  };

  const handleSignalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setSignal(value);
    }
  };

  const handleMacdColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMacdColor(e.target.value);
  };

  const handleSignalColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignalColor(e.target.value);
  };

  const handleHistColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHistColor(e.target.value);
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
            minWidth: "70px",
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
          MACD({fast},{slow},{signal})
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
            minWidth: "280px",
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
              MACD Settings
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
                Fast Period
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={fast}
                onChange={handleFastChange}
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
                Slow Period
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={slow}
                onChange={handleSlowChange}
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
                Signal Period
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={signal}
                onChange={handleSignalChange}
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
              marginBottom: "6px",
              fontWeight: "500",
              color: "#131722"
            }}>
              MACD Line Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={macdColor}
                onChange={handleMacdColorChange}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "40px",
                  height: "32px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  cursor: "pointer",
                  outline: "none",
                  backgroundColor: "white",
                  padding: "2px",
                  pointerEvents: "auto",
                }}
              />
              <input
                type="text"
                value={macdColor}
                onChange={(e) => setMacdColor(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  backgroundColor: "white",
                  color: "#131722",
                  fontFamily: "monospace",
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
              marginBottom: "6px",
              fontWeight: "500",
              color: "#131722"
            }}>
              Signal Line Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={signalColor}
                onChange={handleSignalColorChange}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "40px",
                  height: "32px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  cursor: "pointer",
                  outline: "none",
                  backgroundColor: "white",
                  padding: "2px",
                  pointerEvents: "auto",
                }}
              />
              <input
                type="text"
                value={signalColor}
                onChange={(e) => setSignalColor(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  backgroundColor: "white",
                  color: "#131722",
                  fontFamily: "monospace",
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
              marginBottom: "6px",
              fontWeight: "500",
              color: "#131722"
            }}>
              Histogram Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={histColor}
                onChange={handleHistColorChange}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "40px",
                  height: "32px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  cursor: "pointer",
                  outline: "none",
                  backgroundColor: "white",
                  padding: "2px",
                  pointerEvents: "auto",
                }}
              />
              <input
                type="text"
                value={histColor}
                onChange={(e) => setHistColor(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid #e0e3eb",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  backgroundColor: "white",
                  color: "#131722",
                  fontFamily: "monospace",
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

export default MACDIndicator;
