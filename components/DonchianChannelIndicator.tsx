
import React, { useEffect, useRef, useState } from "react";

interface DonchianChannelIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialPeriod?: number;
  initialUpperColor?: string;
  initialMiddleColor?: string;
  initialLowerColor?: string;
}

const DonchianChannelIndicator: React.FC<DonchianChannelIndicatorProps> = ({
  chart,
  onRemove,
  initialPeriod = 20,
  initialUpperColor = "#FF5722",
  initialMiddleColor = "#2196F3",
  initialLowerColor = "#4CAF50"
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [upperColor, setUpperColor] = useState(initialUpperColor);
  const [middleColor, setMiddleColor] = useState(initialMiddleColor);
  const [lowerColor, setLowerColor] = useState(initialLowerColor);
  const [thickness, setThickness] = useState(2);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const registerDonchianChannel = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_DONCHIAN",
        shortName: "Donchian",
        series: "price",
        calcParams: [period],
        figures: [
          {
            key: "upper",
            title: "Upper",
            type: "line",
          },
          {
            key: "middle",
            title: "Middle",
            type: "line",
          },
          {
            key: "lower",
            title: "Lower",
            type: "line",
          },
        ],
        calc: (dataList: any[], indicator: any) => {
          const p = Number(indicator.calcParams[0]) || 20;
          if (p <= 0 || p > dataList.length) return [];

          const result: any[] = [];

          for (let i = 0; i < dataList.length; i++) {
            if (i < p - 1) {
              result.push({});
              continue;
            }

            let highest = -Infinity;
            let lowest = Infinity;

            for (let j = i - p + 1; j <= i; j++) {
              highest = Math.max(highest, dataList[j].high);
              lowest = Math.min(lowest, dataList[j].low);
            }

            const middle = (highest + lowest) / 2;
            result.push({ upper: highest, middle, lower: lowest });
          }

          return result;
        },
        styles: {
          lines: [
            {
              key: "upper",
              color: upperColor,
              size: thickness,
              style: "solid",
            },
            {
              key: "middle",
              color: middleColor,
              size: 1,
              style: "dashed",
            },
            {
              key: "lower",
              color: lowerColor,
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

    const initDonchianChannel = async () => {
      const klinecharts = await import("klinecharts");
      registerDonchianChannel(klinecharts);
      const id = chart.createIndicator("MY_DONCHIAN", true, { id: "candle_pane" });
      indicatorIdRef.current = id;
    };

    initDonchianChannel();

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
          { key: "upper", color: upperColor, size: thickness },
          { key: "middle", color: middleColor, size: 1 },
          { key: "lower", color: lowerColor, size: thickness }
        ]
      },
    });
  }, [upperColor, middleColor, lowerColor, thickness, chart]);

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

  const handleUpperColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpperColor(e.target.value);
  };

  const handleMiddleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMiddleColor(e.target.value);
  };

  const handleLowerColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLowerColor(e.target.value);
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
          Donchian({period})
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
              Donchian Channels Settings
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
              Upper Band Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={upperColor}
                onChange={handleUpperColorChange}
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
                value={upperColor}
                onChange={(e) => setUpperColor(e.target.value)}
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
              Middle Line Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={middleColor}
                onChange={handleMiddleColorChange}
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
                value={middleColor}
                onChange={(e) => setMiddleColor(e.target.value)}
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
              Lower Band Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="color"
                value={lowerColor}
                onChange={handleLowerColorChange}
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
                value={lowerColor}
                onChange={(e) => setLowerColor(e.target.value)}
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

export default DonchianChannelIndicator;
