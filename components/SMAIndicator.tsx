
import React, { useEffect, useRef, useState } from "react";

interface SMAIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialPeriod?: number;
  initialColor?: string;
}

const SMAIndicator: React.FC<SMAIndicatorProps> = ({ 
  chart, 
  onRemove, 
  initialPeriod = 20, 
  initialColor = "#FF9600" 
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [color, setColor] = useState(initialColor);
  const [showSettings, setShowSettings] = useState(false);

  const registerSMA = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_SMA",
        shortName: "SMA",
        series: "price",
        calcParams: [period],
        figures: [
          {
            key: "sma",
            title: "SMA",
            type: "line",
          },
        ],
        calc: (dataList: any[], indicator: any) => {
          const p = Number(indicator.calcParams[0]) || 20;
          const result: any[] = [];
          let sum = 0;
          for (let i = 0; i < dataList.length; i++) {
            sum += dataList[i].close;
            if (i >= p) sum -= dataList[i - p].close;
            if (i >= p - 1) {
              result.push({ sma: sum / p });
            } else {
              result.push({});
            }
          }
          return result;
        },
        styles: {
          lines: [
            {
              key: "sma",
              color: color,
              size: 2,
              style: "solid",
            },
          ],
        },
      });
    } catch {
      // ignore duplicate register
    }
  };

  useEffect(() => {
    if (!chart) return;

    const initSMA = async () => {
      const klinecharts = await import("klinecharts");
      registerSMA(klinecharts);
      const id = chart.createIndicator("MY_SMA", true, { id: "candle_pane" });
      indicatorIdRef.current = id;
    };

    initSMA();

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
      styles: { lines: [{ key: "sma", color }] },
    });
  }, [color, chart]);

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

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", margin: "2px" }}>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "3px",
          padding: "4px 6px",
          fontSize: "11px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          gap: "4px",
        }}
      >
        <span 
          style={{ 
            color: "#131722", 
            cursor: "pointer",
            userSelect: "none",
            padding: "2px",
            borderRadius: "2px",
            transition: "background-color 0.2s",
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
          SMA({period})
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
            zIndex: 10,
            position: "relative",
          }}
          onClick={handleSettingsClick}
          onMouseDown={(e) => e.stopPropagation()}
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
            zIndex: 10,
            position: "relative",
          }}
          onClick={handleRemoveClick}
          onMouseDown={(e) => e.stopPropagation()}
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
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            minWidth: "180px",
            marginTop: "2px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "12px", 
              marginBottom: "4px",
              fontWeight: "500",
              color: "#333"
            }}>
              Period:
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "4px 6px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          
          <div style={{ marginBottom: "12px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "12px", 
              marginBottom: "4px",
              fontWeight: "500",
              color: "#333"
            }}>
              Color:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "100%",
                height: "28px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                cursor: "pointer",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          
          <button
            style={{
              width: "100%",
              padding: "6px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "3px",
              fontSize: "12px",
              cursor: "pointer",
              color: "#495057",
              fontWeight: "500",
            }}
            onClick={handleCloseSettings}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e9ecef";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SMAIndicator;
