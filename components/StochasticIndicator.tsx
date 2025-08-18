
import React, { useEffect, useRef, useState } from "react";

interface StochasticIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialKPeriod?: number;
  initialDPeriod?: number;
  initialKColor?: string;
  initialDColor?: string;
}

const StochasticIndicator: React.FC<StochasticIndicatorProps> = ({
  chart,
  onRemove,
  initialKPeriod = 14,
  initialDPeriod = 3,
  initialKColor = "#4CAF50",
  initialDColor = "#FF9800"
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [kPeriod, setKPeriod] = useState(initialKPeriod);
  const [dPeriod, setDPeriod] = useState(initialDPeriod);
  const [kColor, setKColor] = useState(initialKColor);
  const [dColor, setDColor] = useState(initialDColor);
  const [thickness, setThickness] = useState(2);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const registerStochastic = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_STOCH",
        shortName: "Stochastic",
        series: "indicator",
        calcParams: [kPeriod, dPeriod],
        figures: [
          {
            key: "k",
            title: "%K",
            type: "line",
          },
          {
            key: "d",
            title: "%D",
            type: "line",
          },
        ],
        calc: (dataList: any[], indicator: any) => {
          const [kP, dP] = indicator.calcParams;
          if (kP <= 0 || kP > dataList.length || dP <= 0) return [];

          const result: any[] = [];
          const kValues: number[] = [];

          for (let i = 0; i < dataList.length; i++) {
            if (i < kP - 1) {
              result.push({});
              continue;
            }

            const slice = dataList.slice(i - kP + 1, i + 1);
            const highestHigh = Math.max(...slice.map(d => d.high));
            const lowestLow = Math.min(...slice.map(d => d.low));

            const k = highestHigh === lowestLow ? 50 :
              ((dataList[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;

            kValues.push(k);

            // Calculate %D = SMA of %K
            let d = null;
            if (kValues.length >= dP) {
              const dSlice = kValues.slice(-dP);
              d = dSlice.reduce((a, b) => a + b, 0) / dSlice.length;
            }

            result.push({ k, d });
          }

          return result;
        },
        styles: {
          lines: [
            {
              key: "k",
              color: kColor,
              size: thickness,
              style: "solid",
            },
            {
              key: "d",
              color: dColor,
              size: thickness,
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

    const initStochastic = async () => {
      const klinecharts = await import("klinecharts");
      registerStochastic(klinecharts);
      const id = chart.createIndicator("MY_STOCH", false);
      indicatorIdRef.current = id;
    };

    initStochastic();

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
      calcParams: [kPeriod, dPeriod],
    });
  }, [kPeriod, dPeriod, chart]);

  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    chart.overrideIndicator({
      id: indicatorIdRef.current,
      styles: {
        lines: [
          { key: "k", color: kColor, size: thickness },
          { key: "d", color: dColor, size: thickness },
        ],
      },
    });
  }, [kColor, dColor, thickness, chart]);

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

  const handleKPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setKPeriod(value);
    }
  };

  const handleDPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 200) {
      setDPeriod(value);
    }
  };

  const handleKColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKColor(e.target.value);
  };

  const handleDColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDColor(e.target.value);
  };

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThickness(parseInt(e.target.value));
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
            minWidth: "80px",
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
          Stochastic({kPeriod},{dPeriod})
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
              Stochastic Settings
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
              %K Period
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={kPeriod}
              onChange={handleKPeriodChange}
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
              %D Period
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={dPeriod}
              onChange={handleDPeriodChange}
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
              %K Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={kColor}
                onChange={handleKColorChange}
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
                value={kColor}
                onChange={(e) => setKColor(e.target.value)}
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
              %D Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={dColor}
                onChange={handleDColorChange}
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
                value={dColor}
                onChange={(e) => setDColor(e.target.value)}
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
              Line Width
            </label>
            <input
              type="range"
              min={1}
              max={8}
              value={thickness}
              onChange={handleThicknessChange}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "#e0e3eb",
                borderRadius: "3px",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                pointerEvents: "auto",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#787b86",
              marginTop: "4px"
            }}>
              <span>1</span>
              <span style={{ fontWeight: "500", color: "#131722" }}>{thickness}px</span>
              <span>8</span>
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

export default StochasticIndicator;
