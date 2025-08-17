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

// Export harmonic pattern detection for use in other components
export { detectHarmonicPatterns, HarmonicPatternOverlay, type HarmonicPattern };

// Register the harmonic pattern overlay
export const registerHarmonicPatternOverlay = () => {
  registerOverlay(HarmonicPatternOverlay);
};

// Apply harmonic pattern detection to a chart
export const applyHarmonicPatternRecognition = (chart: any, data: KLineData[]) => {
  // Register overlay if not already registered
  registerHarmonicPatternOverlay();

  // Remove any existing harmonic pattern overlays
  chart.removeOverlay({ name: "harmonic-pattern" });

  // Detect harmonic patterns
  const patterns = detectHarmonicPatterns(data);

  // Create overlays for each pattern
  patterns.forEach(pattern => {
    const points = pattern.points.map(p => ({
      timestamp: data[p.index].timestamp,
      value: p.value
    }));

    chart.createOverlay({
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
  });

  return patterns;
};