
import React, { useEffect, useRef, useState } from "react";

interface ADXIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialPeriod?: number;
  initialAdxColor?: string;
  initialPlusDiColor?: string;
  initialMinusDiColor?: string;
}

const ADXIndicator: React.FC<ADXIndicatorProps> = ({
  chart,
  onRemove,
  initialPeriod = 14,
  initialAdxColor = "#FFD700",
  initialPlusDiColor = "#00C853",
  initialMinusDiColor = "#D32F2F"
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [adxColor, setAdxColor] = useState(initialAdxColor);
  const [plusDiColor, setPlusDiColor] = useState(initialPlusDiColor);
  const [minusDiColor, setMinusDiColor] = useState(initialMinusDiColor);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const registerADX = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_ADX",
        shortName: "ADX",
        series: "indicator",
        calcParams: [period],
        figures: [
          { key: "adx", title: "ADX", type: "line" },
          { key: "plusDI", title: "+DI", type: "line" },
          { key: "minusDI", title: "-DI", type: "line" },
        ],
        calc: (dataList: any[], indicator: any) => {
          const n = indicator.calcParams[0];
          if (dataList.length < n + 1) return [];

          let trList: number[] = [];
          let plusDMList: number[] = [];
          let minusDMList: number[] = [];

          const result: any[] = [];

          for (let i = 0; i < dataList.length; i++) {
            if (i === 0) {
              trList.push(0);
              plusDMList.push(0);
              minusDMList.push(0);
              result.push({ adx: null, plusDI: null, minusDI: null });
              continue;
            }

            const curr = dataList[i];
            const prev = dataList[i - 1];

            const highDiff = curr.high - prev.high;
            const lowDiff = prev.low - curr.low;

            const plusDM = highDiff > lowDiff && highDiff > 0 ? highDiff : 0;
            const minusDM = lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0;
            const tr = Math.max(
              curr.high - curr.low,
              Math.abs(curr.high - prev.close),
              Math.abs(curr.low - prev.close)
            );

            plusDMList.push(plusDM);
            minusDMList.push(minusDM);
            trList.push(tr);

            if (i < n) {
              result.push({ adx: null, plusDI: null, minusDI: null });
              continue;
            }

            const trN = trList.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0);
            const plusDMN = plusDMList.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0);
            const minusDMN = minusDMList.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0);

            const plusDI = (plusDMN / trN) * 100;
            const minusDI = (minusDMN / trN) * 100;
            const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;

            // ADX is average of DX
            let adx: number | null = null;
            if (i >= n * 2) {
              const dxList = [];
              for (let j = i - n + 1; j <= i; j++) {
                const trN2 = trList.slice(j - n + 1, j + 1).reduce((a, b) => a + b, 0);
                const plusDMN2 = plusDMList.slice(j - n + 1, j + 1).reduce((a, b) => a + b, 0);
                const minusDMN2 = minusDMList.slice(j - n + 1, j + 1).reduce((a, b) => a + b, 0);
                const plusDI2 = (plusDMN2 / trN2) * 100;
                const minusDI2 = (minusDMN2 / trN2) * 100;
                const dx2 = (Math.abs(plusDI2 - minusDI2) / (plusDI2 + minusDI2)) * 100;
                dxList.push(dx2);
              }
              adx = dxList.reduce((a, b) => a + b, 0) / dxList.length;
            }

            result.push({ adx, plusDI, minusDI });
          }

          return result;
        },
        styles: {
          lines: [
            { key: "adx", color: adxColor, size: 2, style: "solid" },
            { key: "plusDI", color: plusDiColor, size: 2, style: "solid" },
            { key: "minusDI", color: minusDiColor, size: 2, style: "solid" },
          ],
        },
      });
    } catch (error) {
      // Silently handle duplicate registration
    }
  };

  useEffect(() => {
    if (!chart) return;

    const initADX = async () => {
      const klinecharts = await import("klinecharts");
      registerADX(klinecharts);
      const id = chart.createIndicator("MY_ADX", false, { id: "new_pane" });
      indicatorIdRef.current = id;
    };

    initADX();

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
      calcParams: [period],
    });
  }, [period, chart]);

  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    chart.overrideIndicator({
      id: indicatorIdRef.current,
      styles: {
        lines: [
          { key: "adx", color: adxColor, size: 2 },
          { key: "plusDI", color: plusDiColor, size: 2 },
          { key: "minusDI", color: minusDiColor, size: 2 },
        ],
      },
    });
  }, [adxColor, plusDiColor, minusDiColor, chart]);

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

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setPeriod(value);
    }
  };

  const handleAdxColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdxColor(e.target.value);
  };

  const handlePlusDiColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlusDiColor(e.target.value);
  };

  const handleMinusDiColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinusDiColor(e.target.value);
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
          ADX({period})
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
              ADX Settings
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

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "12px",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#131722"
            }}>
              Period
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={period}
              onChange={handlePeriodChange}
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

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "12px",
              marginBottom: "6px",
              fontWeight: "500",
              color: "#131722"
            }}>
              ADX Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={adxColor}
                onChange={handleAdxColorChange}
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
                value={adxColor}
                onChange={(e) => setAdxColor(e.target.value)}
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
              +DI Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={plusDiColor}
                onChange={handlePlusDiColorChange}
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
                value={plusDiColor}
                onChange={(e) => setPlusDiColor(e.target.value)}
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
              -DI Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={minusDiColor}
                onChange={handleMinusDiColorChange}
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
                value={minusDiColor}
                onChange={(e) => setMinusDiColor(e.target.value)}
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

export default ADXIndicator;
