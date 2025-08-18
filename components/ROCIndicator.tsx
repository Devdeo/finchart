
import React, { useEffect, useRef, useState } from "react";

interface ROCIndicatorProps {
  chart: any;
  onRemove: () => void;
  initialPeriod?: number;
  initialColor?: string;
}

const ROCIndicator: React.FC<ROCIndicatorProps> = ({
  chart,
  onRemove,
  initialPeriod = 12,
  initialColor = "#009688"
}) => {
  const indicatorIdRef = useRef<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [color, setColor] = useState(initialColor);
  const [thickness, setThickness] = useState(2);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const registerROC = (klinecharts: any) => {
    try {
      klinecharts.registerIndicator({
        name: "MY_ROC",
        shortName: "ROC",
        series: "normal", // separate pane
        calcParams: [period],
        figures: [{ key: "roc", title: "ROC", type: "line" }],
        calc: (dataList: any[], indicator: any) => {
          const p = Number(indicator.calcParams[0]) || 12;
          const result: any[] = [];
          for (let i = 0; i < dataList.length; i++) {
            if (i < p) {
              result.push({});
              continue;
            }
            const prevClose = dataList[i - p].close;
            const roc =
              prevClose !== 0
                ? ((dataList[i].close - prevClose) / prevClose) * 100
                : 0;
            result.push({ roc });
          }
          return result;
        },
        styles: {
          lines: [
            {
              key: "roc",
              color: color,
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

    const initROC = async () => {
      const klinecharts = await import("klinecharts");
      registerROC(klinecharts);
      const id = chart.createIndicator("MY_ROC", false); // false = separate pane
      indicatorIdRef.current = id;
    };

    initROC();

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
      styles: { lines: [{ key: "roc", color, size: thickness }] },
    });
  }, [color, thickness, chart]);

  // Handle click outside to close settings
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

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "3px",
        padding: "2px 4px",
        fontSize: "11px",
        maxWidth: "200px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        position: "relative",
        ...(showSettings ? { backgroundColor: "rgba(255, 255, 255, 1)", borderColor: "rgba(0, 0, 0, 0.2)" } : {})
      }}
      onClick={() => setShowSettings(!showSettings)}
    >
      <span style={{
        color: "#131722",
        marginRight: "4px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flex: 1,
        fontWeight: "400",
        fontSize: "11px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
      }}>
        ROC – Rate of Change ({period})
      </span>
      
      {showSettings && (
        <>
          <button 
            style={{
              background: "none",
              border: "none",
              color: "#686d76",
              fontSize: "10px",
              cursor: "pointer",
              padding: "0 2px",
              marginRight: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "14px",
              height: "14px",
              borderRadius: "2px",
              transition: "all 0.2s",
            }}
            onClick={(e) => {
              e.stopPropagation();
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
              width: "14px",
              height: "14px",
              fontSize: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1",
              padding: "0",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove indicator"
          >
            ×
          </button>
        </>
      )}

      {showSettings && (
        <div 
          ref={settingsRef}
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            zIndex: 1000,
            minWidth: "150px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: "12px"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Period:
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "2px 4px",
                border: "1px solid #ccc",
                borderRadius: "2px",
                fontSize: "11px"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Color:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "100%",
                height: "24px",
                border: "1px solid #ccc",
                borderRadius: "2px",
                cursor: "pointer"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Thickness:
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <span style={{ fontSize: "10px", color: "#666" }}>{thickness}px</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROCIndicator;
