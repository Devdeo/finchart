
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

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "3px",
          padding: "2px 4px",
          fontSize: "11px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <span style={{ color: "#131722", marginRight: "4px" }}>
          SMA({period})
        </span>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#686d76",
            fontSize: "10px",
            cursor: "pointer",
            padding: "0 2px",
            marginRight: "2px",
          }}
          onClick={() => setShowSettings(!showSettings)}
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
          }}
          onClick={onRemove}
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
            padding: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            minWidth: "150px",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", fontSize: "11px", marginBottom: "4px" }}>
              Period:
            </label>
            <input
              type="number"
              min={1}
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "2px 4px",
                border: "1px solid #ccc",
                borderRadius: "2px",
                fontSize: "11px",
              }}
            />
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", fontSize: "11px", marginBottom: "4px" }}>
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
                cursor: "pointer",
              }}
            />
          </div>
          <button
            style={{
              width: "100%",
              padding: "4px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "2px",
              fontSize: "11px",
              cursor: "pointer",
            }}
            onClick={() => setShowSettings(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SMAIndicator;
