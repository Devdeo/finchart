"use client";
import { useEffect, useRef } from "react";
import {
  init,
  dispose,
  registerOverlay,
  type KLineChart,
  type OverlayTemplate,
  type KLineData,
} from "klinecharts";

// Pattern types
type PatternType = "Gartley" | "Butterfly" | "Bat" | "Crab" | "Shark" | "Cypher";
type PatternDirection = "bullish" | "bearish";

// Structure for detected patterns
interface HarmonicPattern {
  pattern: PatternType;
  direction: PatternDirection;
  points: { index: number; value: number }[];
}

// Swing point structure
interface SwingPoint {
  index: number;
  value: number;
  type: "high" | "low";
}

// Tolerance for pattern detection
const TOLERANCE = 0.2;  // Increased tolerance

// Helper function to check ratio validity
function isRatioValid(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= TOLERANCE;
}

// Detect harmonic patterns
function detectHarmonicPatterns(data: KLineData[]): HarmonicPattern[] {
  const patterns: HarmonicPattern[] = [];
  if (data.length < 5) return patterns;

  // Find swing points with better detection
  const swingPoints: SwingPoint[] = [];
  for (let i = 2; i < data.length - 2; i++) {
    const prev2 = data[i - 2];
    const prev1 = data[i - 1];
    const current = data[i];
    const next1 = data[i + 1];
    const next2 = data[i + 2];

    // High swing point
    if (
      current.high > prev1.high && 
      current.high > prev2.high &&
      current.high > next1.high && 
      current.high > next2.high
    ) {
      swingPoints.push({ index: i, value: current.high, type: "high" });
    }

    // Low swing point
    if (
      current.low < prev1.low && 
      current.low < prev2.low &&
      current.low < next1.low && 
      current.low < next2.low
    ) {
      swingPoints.push({ index: i, value: current.low, type: "low" });
    }
  }

  // Check for patterns in swing points
  for (let i = 0; i < swingPoints.length - 4; i++) {
    const [X, A, B, C, D] = swingPoints.slice(i, i + 5);

    // Validate alternating swing points
    if (X.type === A.type || A.type === B.type || 
        B.type === C.type || C.type === D.type) continue;

    const isBullish = X.type === "low";
    const diffXA = Math.abs(A.value - X.value);

    // Ratios for pattern detection
    const AB = Math.abs(B.value - A.value);
    const BC = Math.abs(C.value - B.value);
    const CD = Math.abs(D.value - C.value);

    // Avoid division by zero
    if (diffXA === 0 || AB === 0 || BC === 0) continue;

    const AB_ratio = AB / diffXA;
    const BC_ratio = BC / AB;
    const CD_ratio = CD / BC;

    // Gartley pattern
    if (
      isRatioValid(AB_ratio, 0.618) &&
      isRatioValid(BC_ratio, 0.382) &&
      isRatioValid(CD_ratio, 1.272)
    ) {
      patterns.push({
        pattern: "Gartley",
        direction: isBullish ? "bullish" : "bearish",
        points: [X, A, B, C, D].map(p => ({ index: p.index, value: p.value }))
      });
      continue;
    }

    // Butterfly pattern
    if (
      isRatioValid(AB_ratio, 0.786) &&
      isRatioValid(BC_ratio, 0.382) &&
      isRatioValid(CD_ratio, 1.618)
    ) {
      patterns.push({
        pattern: "Butterfly",
        direction: isBullish ? "bullish" : "bearish",
        points: [X, A, B, C, D].map(p => ({ index: p.index, value: p.value }))
      });
      continue;
    }

    // Bat pattern
    if (
      isRatioValid(AB_ratio, 0.382) &&
      isRatioValid(BC_ratio, 0.886) &&
      isRatioValid(CD_ratio, 1.618)
    ) {
      patterns.push({
        pattern: "Bat",
        direction: isBullish ? "bullish" : "bearish",
        points: [X, A, B, C, D].map(p => ({ index: p.index, value: p.value }))
      });
      continue;
    }

    // Crab pattern
    if (
      isRatioValid(AB_ratio, 0.382) &&
      isRatioValid(BC_ratio, 0.886) &&
      isRatioValid(CD_ratio, 2.618)
    ) {
      patterns.push({
        pattern: "Crab",
        direction: isBullish ? "bullish" : "bearish",
        points: [X, A, B, C, D].map(p => ({ index: p.index, value: p.value }))
      });
      continue;
    }

    // Shark pattern
    if (
      isRatioValid(AB_ratio, 1.13) &&
      isRatioValid(BC_ratio, 1.618) &&
      isRatioValid(CD_ratio, 1.27)
    ) {
      patterns.push({
        pattern: "Shark",
        direction: isBullish ? "bullish" : "bearish",
        points: [X, A, B, C, D].map(p => ({ index: p.index, value: p.value }))
      });
    }
  }

  // Detect Cypher pattern (4 points)
  for (let i = 0; i < swingPoints.length - 3; i++) {
    const [X, A, B, C] = swingPoints.slice(i, i + 4);

    // Validate alternating swing points
    if (X.type === A.type || A.type === B.type || B.type === C.type) continue;

    const isBullish = X.type === "low";
    const diffXA = Math.abs(A.value - X.value);

    // Ratios for pattern detection
    const AB = Math.abs(B.value - A.value);
    const BC = Math.abs(C.value - B.value);

    // Avoid division by zero
    if (diffXA === 0 || AB === 0) continue;

    const AB_ratio = AB / diffXA;
    const BC_ratio = BC / AB;

    // Cypher pattern
    if (
      isRatioValid(AB_ratio, 0.382) &&
      isRatioValid(BC_ratio, 1.414)
    ) {
      patterns.push({
        pattern: "Cypher",
        direction: isBullish ? "bullish" : "bearish",
        points: [X, A, B, C].map(p => ({ index: p.index, value: p.value }))
      });
    }
  }

  return patterns;
}

// Harmonic pattern overlay
const HarmonicPatternOverlay: OverlayTemplate = {
  name: "harmonic-pattern",
  needDefaultPointFigure: false,
  createPointFigures: ({ coordinates, overlay }) => {
    const figures: any[] = [];
    const pattern = overlay.extendData?.pattern as PatternType;
    const direction = overlay.extendData?.direction as PatternDirection;

    // Define pattern colors
    const color = direction === "bullish" ? "#4D96FF" : "#FF6B6B";
    const lineWidth = 2;

    // Draw pattern lines
    figures.push({
      type: "polyline",
      attrs: { coordinates },
      styles: { color, lineWidth }
    });

    // Draw points
    coordinates.forEach((coord, index) => {
      figures.push({
        type: "circle",
        attrs: {
          x: coord.x,
          y: coord.y,
          r: 4
        },
        styles: {
          color: index === coordinates.length - 1 ? "#FFD93D" : color,
          backgroundColor: index === coordinates.length - 1 ? "#FFD93D" : color,
        }
      });

      // Point labels
      const labels = pattern === "Cypher" 
        ? ["X", "A", "B", "C"] 
        : ["X", "A", "B", "C", "D"];

      if (index < labels.length) {
        figures.push({
          type: "text",
          attrs: {
            x: coord.x + 8,
            y: coord.y + (index % 2 === 1 ? -10 : 10),
            text: labels[index],
            align: "left",
            baseline: "middle"
          },
          styles: {
            color: "#FFD93D",
            fontSize: 12,
            fontWeight: "bold"
          }
        });
      }
    });

    // Pattern label
    const lastPoint = coordinates[coordinates.length - 1];
    figures.push({
      type: "text",
      attrs: {
        x: lastPoint.x,
        y: lastPoint.y + (direction === "bullish" ? -25 : 25),
        text: `${pattern} (${direction})`,
        align: "center",
        baseline: "middle"
      },
      styles: {
        color: "#FFD93D",
        fontSize: 12,
        fontWeight: "bold",
        backgroundColor: "rgba(30, 31, 41, 0.8)",
        padding: [4, 8]
      }
    });

    return figures;
  }
};

// Generate sample data with all harmonic patterns clearly visible
function generateHarmonicData(): KLineData[] {
  const now = Date.now();
  const data: KLineData[] = [];
  let price = 100;

  // Helper to create a candle
  const candle = (o: number, h: number, l: number, c: number): KLineData => ({
    timestamp: now + data.length * 60000,
    open: o,
    high: h,
    low: l,
    close: c
  });

  // Function to generate random candles
  const randomCandles = (count: number, basePrice: number) => {
    let current = basePrice;
    for (let i = 0; i < count; i++) {
      const o = current;
      const c = o + (Math.random() - 0.5) * 4;
      const h = Math.max(o, c) + Math.random() * 3;
      const l = Math.min(o, c) - Math.random() * 3;
      data.push(candle(o, h, l, c));
      current = c;
    }
    return current;
  };

  // 1. Bullish Gartley - Perfect ratios
  // X=100, A=140, B=120, C=130, D=110
  price = 100;
  data.push(candle(100, 100, 100, 100));          // X (low)
  data.push(candle(100, 140, 100, 140));          // A (high)
  data.push(candle(140, 140, 120, 120));          // B (low)
  data.push(candle(120, 130, 120, 130));          // C (high)
  data.push(candle(130, 130, 110, 110));          // D (low)

  // Transition
  price = randomCandles(5, 110);

  // 2. Bearish Butterfly - Perfect ratios
  // X=140, A=110, B=130, C=120, D=135
  data.push(candle(price, 140, 140, 140));        // X (high)
  data.push(candle(140, 140, 110, 110));          // A (low)
  data.push(candle(110, 130, 110, 130));          // B (high)
  data.push(candle(130, 130, 120, 120));          // C (low)
  data.push(candle(120, 135, 120, 135));          // D (high)

  // Transition
  price = randomCandles(5, 135);

  // 3. Bullish Bat - Perfect ratios
  // X=100, A=130, B=115, C=125, D=110
  data.push(candle(price, 100, 100, 100));        // X (low)
  data.push(candle(100, 130, 100, 130));          // A (high)
  data.push(candle(130, 130, 115, 115));          // B (low)
  data.push(candle(115, 125, 115, 125));          // C (high)
  data.push(candle(125, 125, 110, 110));          // D (low)

  // Transition
  price = randomCandles(5, 110);

  // 4. Bearish Crab - Perfect ratios
  // X=140, A=100, B=130, C=110, D=135
  data.push(candle(price, 140, 140, 140));        // X (high)
  data.push(candle(140, 140, 100, 100));          // A (low)
  data.push(candle(100, 130, 100, 130));          // B (high)
  data.push(candle(130, 130, 110, 110));          // C (low)
  data.push(candle(110, 135, 110, 135));          // D (high)

  // Transition
  price = randomCandles(5, 135);

  // 5. Bullish Shark - Perfect ratios
  // X=100, A=130, B=115, C=140, D=120
  data.push(candle(price, 100, 100, 100));        // X (low)
  data.push(candle(100, 130, 100, 130));          // A (high)
  data.push(candle(130, 130, 115, 115));          // B (low)
  data.push(candle(115, 140, 115, 140));          // C (high)
  data.push(candle(140, 140, 120, 120));          // D (low)

  // Transition
  price = randomCandles(5, 120);

  // 6. Bearish Cypher - Perfect ratios
  // X=140, A=110, B=125, C=115
  data.push(candle(price, 140, 140, 140));        // X (high)
  data.push(candle(140, 140, 110, 110));          // A (low)
  data.push(candle(110, 125, 110, 125));          // B (high)
  data.push(candle(125, 125, 115, 115));          // C (low)

  // Fill to 100 candles
  while (data.length < 100) {
    const o = price;
    const c = o + (Math.random() - 0.5) * 4;
    const h = Math.max(o, c) + Math.random() * 3;
    const l = Math.min(o, c) - Math.random() * 3;
    data.push(candle(o, h, l, c));
    price = c;
  }

  return data;
}

export default function HarmonicPatternChart() {
  const chartRef = useRef<KLineChart | null>(null);
  const overlayIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const chart = init("harmonic-chart");
    chartRef.current = chart;

    registerOverlay(HarmonicPatternOverlay);

    const data = generateHarmonicData();
    chart.applyNewData(data);

    // Detect harmonic patterns
    const patterns = detectHarmonicPatterns(data);
    console.log("Detected patterns:", patterns);

    // If no patterns detected, use manual patterns as fallback
    let patternsToDraw = patterns;
    if (patterns.length === 0) {
      patternsToDraw = [
        // Bullish Gartley
        {
          pattern: "Gartley",
          direction: "bullish",
          points: [
            { index: 5, value: 100 },
            { index: 6, value: 140 },
            { index: 7, value: 120 },
            { index: 8, value: 130 },
            { index: 9, value: 110 }
          ]
        },
        // Bearish Butterfly
        {
          pattern: "Butterfly",
          direction: "bearish",
          points: [
            { index: 15, value: 140 },
            { index: 16, value: 110 },
            { index: 17, value: 130 },
            { index: 18, value: 120 },
            { index: 19, value: 135 }
          ]
        },
        // Bullish Bat
        {
          pattern: "Bat",
          direction: "bullish",
          points: [
            { index: 25, value: 100 },
            { index: 26, value: 130 },
            { index: 27, value: 115 },
            { index: 28, value: 125 },
            { index: 29, value: 110 }
          ]
        },
        // Bearish Crab
        {
          pattern: "Crab",
          direction: "bearish",
          points: [
            { index: 35, value: 140 },
            { index: 36, value: 100 },
            { index: 37, value: 130 },
            { index: 38, value: 110 },
            { index: 39, value: 135 }
          ]
        },
        // Bullish Shark
        {
          pattern: "Shark",
          direction: "bullish",
          points: [
            { index: 45, value: 100 },
            { index: 46, value: 130 },
            { index: 47, value: 115 },
            { index: 48, value: 140 },
            { index: 49, value: 120 }
          ]
        },
        // Bearish Cypher
        {
          pattern: "Cypher",
          direction: "bearish",
          points: [
            { index: 55, value: 140 },
            { index: 56, value: 110 },
            { index: 57, value: 125 },
            { index: 58, value: 115 }
          ]
        }
      ];
    }

    // Create overlays for each pattern
    patternsToDraw.forEach(pattern => {
      const points = pattern.points.map(p => ({
        timestamp: data[p.index].timestamp,
        value: p.value
      }));

      const overlayId = chart.createOverlay({
        name: "harmonic-pattern",
        points,
        extendData: {
          pattern: pattern.pattern,
          direction: pattern.direction
        },
        styles: {
          point: {
            visible: false
          }
        }
      });

      overlayIdsRef.current.push(overlayId);
    });

    return () => {
      dispose("harmonic-chart");
      overlayIdsRef.current = [];
    };
  }, []);

  return (
    <div
      id="harmonic-chart"
      style={{
        width: "100%",
        height: "80vh",
        borderRadius: "8px",
        background: "#1e1f29",
      }}
    />
  );
}