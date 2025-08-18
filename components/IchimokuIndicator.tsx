
import React, { useEffect, useRef, useState } from "react";

interface IchimokuIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialTenkan?: number;
  initialKijun?: number;
  initialSenkou?: number;
  initialColors?: {
    tenkan: string;
    kijun: string;
    spanA: string;
    spanB: string;
    chikou: string;
    cloudUp: string;
    cloudDown: string;
  };
}

const IchimokuIndicator: React.FC<IchimokuIndicatorProps> = ({
  chart,
  onRemove,
  initialTenkan = 9,
  initialKijun = 26,
  initialSenkou = 52,
  initialColors = {
    tenkan: "#FF0000",
    kijun: "#0000FF",
    spanA: "#00C853",
    spanB: "#FF6D00",
    chikou: "#9C27B0",
    cloudUp: "rgba(0,200,83,0.25)",
    cloudDown: "rgba(255,109,0,0.25)"
  }
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [params, setParams] = useState({
    tenkan: initialTenkan,
    kijun: initialKijun,
    senkou: initialSenkou
  });
  const [colors, setColors] = useState(initialColors);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const highLowMid = (list: any[], period: number, i: number) => {
    const slice = list.slice(i - period + 1, i + 1);
    const highs = slice.map(d => d.high);
    const lows = slice.map(d => d.low);
    return (Math.max(...highs) + Math.min(...lows)) / 2;
  };

  const registerIchimoku = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_ICHIMOKU",
        shortName: "Ichimoku",
        series: "price",
        calcParams: [params.tenkan, params.kijun, params.senkou],
        figures: [
          { key: "tenkan", title: "Tenkan", type: "line" },
          { key: "kijun", title: "Kijun", type: "line" },
          { key: "spanA", title: "SpanA", type: "line" },
          { key: "spanB", title: "SpanB", type: "line" },
          { key: "chikou", title: "Chikou", type: "line" }
        ],
        calc: (dataList: any[], indicator: any) => {
          const [tenkanLen, kijunLen, senkouLen] = indicator.calcParams;
          const result: any[] = [];

          for (let i = 0; i < dataList.length; i++) {
            let tenkan = i + 1 >= tenkanLen ? highLowMid(dataList, tenkanLen, i) : null;
            let kijun = i + 1 >= kijunLen ? highLowMid(dataList, kijunLen, i) : null;
            let spanA = (tenkan !== null && kijun !== null) ? (tenkan + kijun) / 2 : null;
            let spanB = i + 1 >= senkouLen ? highLowMid(dataList, senkouLen, i) : null;
            let chikou = dataList[i].close;

            result.push({ tenkan, kijun, spanA, spanB, chikou });
          }

          return result;
        },
        styles: {
          lines: [
            { key: "tenkan", color: colors.tenkan, size: 1 },
            { key: "kijun", color: colors.kijun, size: 1 },
            { key: "spanA", color: colors.spanA, size: 1 },
            { key: "spanB", color: colors.spanB, size: 1 },
            { key: "chikou", color: colors.chikou, size: 1 }
          ],
          areas: [
            { key1: "spanA", key2: "spanB", color: colors.cloudUp },
            { key1: "spanB", key2: "spanA", color: colors.cloudDown }
          ]
        }
      });
    } catch (error) {
      // Silently handle duplicate registration
    }
  };

  useEffect(() => {
    if (!chart) return;

    const initIchimoku = async () => {
      const klinecharts = await import("klinecharts");
      registerIchimoku(klinecharts);
      const id = chart.createIndicator("MY_ICHIMOKU", true, { id: "candle_pane" });
      indicatorIdRef.current = id;
    };

    initIchimoku();

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
      calcParams: [params.tenkan, params.kijun, params.senkou],
    });
  }, [params, chart]);

  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    chart.overrideIndicator({
      id: indicatorIdRef.current,
      styles: {
        lines: [
          { key: "tenkan", color: colors.tenkan, size: 1 },
          { key: "kijun", color: colors.kijun, size: 1 },
          { key: "spanA", color: colors.spanA, size: 1 },
          { key: "spanB", color: colors.spanB, size: 1 },
          { key: "chikou", color: colors.chikou, size: 1 }
        ],
        areas: [
          { key1: "spanA", key2: "spanB", color: colors.cloudUp },
          { key1: "spanB", key2: "spanA", color: colors.cloudDown }
        ]
      },
    });
  }, [colors, chart]);

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

  const handleParamChange = (param: string, value: number) => {
    if (value >= 1 && value <= 200) {
      setParams(prev => ({ ...prev, [param]: value }));
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
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
          Ichimoku({params.tenkan},{params.kijun},{params.senkou})
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
              Ichimoku Settings
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
                Tenkan
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={params.tenkan}
                onChange={(e) => handleParamChange('tenkan', parseInt(e.target.value))}
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
                Kijun
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={params.kijun}
                onChange={(e) => handleParamChange('kijun', parseInt(e.target.value))}
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
                Senkou
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={params.senkou}
                onChange={(e) => handleParamChange('senkou', parseInt(e.target.value))}
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
              Line Colors
            </label>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              {[
                { key: "tenkan", label: "Tenkan" },
                { key: "kijun", label: "Kijun" },
                { key: "spanA", label: "Span A" },
                { key: "spanB", label: "Span B" },
                { key: "chikou", label: "Chikou" }
              ].map(({ key, label }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="color"
                    value={colors[key as keyof typeof colors]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
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
                  <span style={{ fontSize: "11px", color: "#131722" }}>{label}</span>
                </div>
              ))}
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
              Cloud Colors
            </label>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="color"
                  value={colors.cloudUp.replace(/rgba?\([^)]+\)/, colors.cloudUp.includes('rgba') ? colors.cloudUp.split(',').slice(0,3).join(',') + ')' : colors.cloudUp)}
                  onChange={(e) => handleColorChange('cloudUp', e.target.value.replace('#', 'rgba(') + ',0.25)')}
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
                <span style={{ fontSize: "11px", color: "#131722" }}>Cloud Up</span>
              </div>
              
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="color"
                  value={colors.cloudDown.replace(/rgba?\([^)]+\)/, colors.cloudDown.includes('rgba') ? colors.cloudDown.split(',').slice(0,3).join(',') + ')' : colors.cloudDown)}
                  onChange={(e) => handleColorChange('cloudDown', e.target.value.replace('#', 'rgba(') + ',0.25)')}
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
                <span style={{ fontSize: "11px", color: "#131722" }}>Cloud Down</span>
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

export default IchimokuIndicator;
