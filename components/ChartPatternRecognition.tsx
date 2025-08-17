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

// Pattern detection types
type PatternPoint = {
  timestamp: number;
  value: number;
  text?: string;
};

type PatternDetection = {
  pattern: string;
  points: PatternPoint[];
};

// Detect Head and Shoulders
function detectHeadAndShoulders(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 7) return results;

  for (let i = 3; i < data.length - 3; i++) {
    const lShoulder = data[i - 2];
    const lTrough = data[i - 1];
    const head = data[i];
    const rTrough = data[i + 1];
    const rShoulder = data[i + 2];

    // Check pattern validity
    if (
      head.high > lShoulder.high * 1.05 &&
      head.high > rShoulder.high * 1.05 &&
      Math.abs(lShoulder.high - rShoulder.high) / lShoulder.high < 0.05 &&
      lTrough.low < lShoulder.low * 0.98 &&
      rTrough.low < rShoulder.low * 0.98
    ) {
      results.push({
        pattern: "head-shoulders",
        points: [
          { timestamp: lShoulder.timestamp, value: lShoulder.high },
          { timestamp: lTrough.timestamp, value: lTrough.low },
          { timestamp: head.timestamp, value: head.high },
          { timestamp: rTrough.timestamp, value: rTrough.low },
          { timestamp: rShoulder.timestamp, value: rShoulder.high },
        ],
      });
    }
  }

  return results;
}

// Detect Inverse Head and Shoulders
function detectInverseHeadShoulders(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 7) return results;

  for (let i = 3; i < data.length - 3; i++) {
    const lShoulder = data[i - 2];
    const lPeak = data[i - 1];
    const head = data[i];
    const rPeak = data[i + 1];
    const rShoulder = data[i + 2];

    if (
      head.low < lShoulder.low * 0.95 &&
      head.low < rShoulder.low * 0.95 &&
      Math.abs(lShoulder.low - rShoulder.low) / lShoulder.low < 0.05 &&
      lPeak.high > lShoulder.high * 1.02 &&
      rPeak.high > rShoulder.high * 1.02
    ) {
      results.push({
        pattern: "inverse-head-shoulders",
        points: [
          { timestamp: lShoulder.timestamp, value: lShoulder.low },
          { timestamp: lPeak.timestamp, value: lPeak.high },
          { timestamp: head.timestamp, value: head.low },
          { timestamp: rPeak.timestamp, value: rPeak.high },
          { timestamp: rShoulder.timestamp, value: rShoulder.low },
        ],
      });
    }
  }

  return results;
}

// Detect Double Top
function detectDoubleTop(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 5) return results;

  for (let i = 2; i < data.length - 2; i++) {
    const top1 = data[i];
    const trough = data[i + 1];
    const top2 = data[i + 2];

    if (
      Math.abs(top1.high - top2.high) / top1.high < 0.03 &&
      trough.low < top1.high * 0.97
    ) {
      results.push({
        pattern: "double-top",
        points: [
          { timestamp: top1.timestamp, value: top1.high },
          { timestamp: trough.timestamp, value: trough.low },
          { timestamp: top2.timestamp, value: top2.high },
        ],
      });
    }
  }

  return results;
}

// Detect Double Bottom
function detectDoubleBottom(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 5) return results;

  for (let i = 2; i < data.length - 2; i++) {
    const bottom1 = data[i];
    const peak = data[i + 1];
    const bottom2 = data[i + 2];

    if (
      Math.abs(bottom1.low - bottom2.low) / bottom1.low < 0.03 &&
      peak.high > bottom1.low * 1.03
    ) {
      results.push({
        pattern: "double-bottom",
        points: [
          { timestamp: bottom1.timestamp, value: bottom1.low },
          { timestamp: peak.timestamp, value: peak.high },
          { timestamp: bottom2.timestamp, value: bottom2.low },
        ],
      });
    }
  }

  return results;
}

// Detect Triple Top
function detectTripleTop(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 7) return results;

  for (let i = 2; i < data.length - 4; i++) {
    const top1 = data[i];
    const trough1 = data[i + 1];
    const top2 = data[i + 2];
    const trough2 = data[i + 3];
    const top3 = data[i + 4];

    if (
      Math.abs(top1.high - top2.high) / top1.high < 0.03 &&
      Math.abs(top2.high - top3.high) / top2.high < 0.03 &&
      trough1.low < top1.high * 0.97 &&
      trough2.low < top2.high * 0.97
    ) {
      results.push({
        pattern: "triple-top",
        points: [
          { timestamp: top1.timestamp, value: top1.high },
          { timestamp: trough1.timestamp, value: trough1.low },
          { timestamp: top2.timestamp, value: top2.high },
          { timestamp: trough2.timestamp, value: trough2.low },
          { timestamp: top3.timestamp, value: top3.high },
        ],
      });
    }
  }

  return results;
}

// Detect Triple Bottom
function detectTripleBottom(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 7) return results;

  for (let i = 2; i < data.length - 4; i++) {
    const bottom1 = data[i];
    const peak1 = data[i + 1];
    const bottom2 = data[i + 2];
    const peak2 = data[i + 3];
    const bottom3 = data[i + 4];

    if (
      Math.abs(bottom1.low - bottom2.low) / bottom1.low < 0.03 &&
      Math.abs(bottom2.low - bottom3.low) / bottom2.low < 0.03 &&
      peak1.high > bottom1.low * 1.03 &&
      peak2.high > bottom2.low * 1.03
    ) {
      results.push({
        pattern: "triple-bottom",
        points: [
          { timestamp: bottom1.timestamp, value: bottom1.low },
          { timestamp: peak1.timestamp, value: peak1.high },
          { timestamp: bottom2.timestamp, value: bottom2.low },
          { timestamp: peak2.timestamp, value: peak2.high },
          { timestamp: bottom3.timestamp, value: bottom3.low },
        ],
      });
    }
  }

  return results;
}

// Detect Rising Wedge
function detectRisingWedge(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 5) return results;

  for (let i = 4; i < data.length - 5; i++) {
    const startLow = data[i].low;
    const startHigh = data[i].high;
    const midLow = data[i + 2].low;
    const midHigh = data[i + 2].high;
    const endLow = data[i + 4].low;
    const endHigh = data[i + 4].high;

    // Check for converging trendlines with upward slope
    const lowSlope = (endLow - startLow) / 4;
    const highSlope = (endHigh - startHigh) / 4;

    if (
      lowSlope > 0 &&
      highSlope > 0 &&
      (endHigh - endLow) < (startHigh - startLow) * 0.7
    ) {
      results.push({
        pattern: "rising-wedge",
        points: [
          { timestamp: data[i].timestamp, value: startLow },
          { timestamp: data[i].timestamp, value: startHigh },
          { timestamp: data[i + 4].timestamp, value: endLow },
          { timestamp: data[i + 4].timestamp, value: endHigh },
        ],
      });
    }
  }

  return results;
}

// Detect Falling Wedge
function detectFallingWedge(data: KLineData[]): PatternDetection[] {
  const results: PatternDetection[] = [];
  if (data.length < 5) return results;

  for (let i = 4; i < data.length - 5; i++) {
    const startLow = data[i].low;
    const startHigh = data[i].high;
    const midLow = data[i + 2].low;
    const midHigh = data[i + 2].high;
    const endLow = data[i + 4].low;
    const endHigh = data[i + 4].high;

    // Check for converging trendlines with downward slope
    const lowSlope = (endLow - startLow) / 4;
    const highSlope = (endHigh - startHigh) / 4;

    if (
      lowSlope < 0 &&
      highSlope < 0 &&
      (endHigh - endLow) < (startHigh - startLow) * 0.7
    ) {
      results.push({
        pattern: "falling-wedge",
        points: [
          { timestamp: data[i].timestamp, value: startLow },
          { timestamp: data[i].timestamp, value: startHigh },
          { timestamp: data[i + 4].timestamp, value: endLow },
          { timestamp: data[i + 4].timestamp, value: endHigh },
        ],
      });
    }
  }

  return results;
}

// Pattern overlay registration
const PatternOverlay: OverlayTemplate = {
  name: "chart-patterns",
  needDefaultPointFigure: false,
  createPointFigures: ({ coordinates, overlay }) => {
    const figures: any[] = [];
    const patternType = overlay.extendData?.pattern;

    if (patternType === "head-shoulders" && coordinates.length === 5) {
      // Head & Shoulders pattern
      const [ls, lt, head, rt, rs] = coordinates;

      // Shoulders line (dashed yellow)
      figures.push({
        type: "polyline",
        attrs: { coordinates: [ls, head, rs] },
        styles: { 
          color: "#FFD93D", 
          lineWidth: 2,
          lineDash: [4, 4]
        },
      });

      // Neckline (solid green)
      figures.push({
        type: "line",
        attrs: { coordinates: [lt, rt] },
        styles: { 
          color: "#6BCB77", 
          lineWidth: 2 
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: head.x,
          y: head.y - 25,
          text: "Head & Shoulders",
          align: "center",
          baseline: "bottom",
        },
        styles: {
          color: "#FFD93D",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    } 
    else if (patternType === "inverse-head-shoulders" && coordinates.length === 5) {
      // Inverse Head & Shoulders pattern
      const [ls, lp, head, rp, rs] = coordinates;

      // Shoulders line (dashed yellow)
      figures.push({
        type: "polyline",
        attrs: { coordinates: [ls, head, rs] },
        styles: { 
          color: "#4D96FF", 
          lineWidth: 2,
          lineDash: [4, 4]
        },
      });

      // Neckline (solid orange)
      figures.push({
        type: "line",
        attrs: { coordinates: [lp, rp] },
        styles: { 
          color: "#FF9A3D", 
          lineWidth: 2 
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: head.x,
          y: head.y + 25,
          text: "Inverse H&S",
          align: "center",
          baseline: "top",
        },
        styles: {
          color: "#4D96FF",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    }
    else if (patternType === "double-top" && coordinates.length === 3) {
      // Double Top pattern
      const [top1, trough, top2] = coordinates;

      // Resistance line (solid red)
      figures.push({
        type: "line",
        attrs: { coordinates: [top1, top2] },
        styles: { 
          color: "#FF6B6B", 
          lineWidth: 2 
        },
      });

      // Neckline (dashed yellow)
      figures.push({
        type: "line",
        attrs: { 
          coordinates: [
            { x: top1.x, y: trough.y },
            { x: top2.x, y: trough.y }
          ] 
        },
        styles: { 
          color: "#FFD93D", 
          lineWidth: 2,
          lineDash: [4, 4]
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: (top1.x + top2.x) / 2,
          y: top1.y - 15,
          text: "Double Top",
          align: "center",
          baseline: "bottom",
        },
        styles: {
          color: "#FF6B6B",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    } 
    else if (patternType === "double-bottom" && coordinates.length === 3) {
      // Double Bottom pattern
      const [bottom1, peak, bottom2] = coordinates;

      // Support line (solid green)
      figures.push({
        type: "line",
        attrs: { coordinates: [bottom1, bottom2] },
        styles: { 
          color: "#4D96FF", 
          lineWidth: 2 
        },
      });

      // Neckline (dashed yellow)
      figures.push({
        type: "line",
        attrs: { 
          coordinates: [
            { x: bottom1.x, y: peak.y },
            { x: bottom2.x, y: peak.y }
          ] 
        },
        styles: { 
          color: "#FFD93D", 
          lineWidth: 2,
          lineDash: [4, 4]
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: (bottom1.x + bottom2.x) / 2,
          y: bottom1.y + 15,
          text: "Double Bottom",
          align: "center",
          baseline: "top",
        },
        styles: {
          color: "#4D96FF",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    }
    else if (patternType === "triple-top" && coordinates.length === 5) {
      // Triple Top pattern
      const [top1, trough1, top2, trough2, top3] = coordinates;

      // Resistance line
      figures.push({
        type: "line",
        attrs: { coordinates: [top1, top2, top3] },
        styles: { 
          color: "#FF6B6B", 
          lineWidth: 2 
        },
      });

      // Neckline
      figures.push({
        type: "line",
        attrs: { 
          coordinates: [
            { x: trough1.x, y: trough1.y },
            { x: trough2.x, y: trough2.y }
          ] 
        },
        styles: { 
          color: "#FFD93D", 
          lineWidth: 2,
          lineDash: [4, 4]
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: top2.x,
          y: top2.y - 15,
          text: "Triple Top",
          align: "center",
          baseline: "bottom",
        },
        styles: {
          color: "#FF6B6B",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    }
    else if (patternType === "triple-bottom" && coordinates.length === 5) {
      // Triple Bottom pattern
      const [bottom1, peak1, bottom2, peak2, bottom3] = coordinates;

      // Support line
      figures.push({
        type: "line",
        attrs: { coordinates: [bottom1, bottom2, bottom3] },
        styles: { 
          color: "#4D96FF", 
          lineWidth: 2 
        },
      });

      // Neckline
      figures.push({
        type: "line",
        attrs: { 
          coordinates: [
            { x: peak1.x, y: peak1.y },
            { x: peak2.x, y: peak2.y }
          ] 
        },
        styles: { 
          color: "#FFD93D", 
          lineWidth: 2,
          lineDash: [4, 4]
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: bottom2.x,
          y: bottom2.y + 15,
          text: "Triple Bottom",
          align: "center",
          baseline: "top",
        },
        styles: {
          color: "#4D96FF",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    }
    else if (patternType === "rising-wedge" && coordinates.length === 4) {
      const [startLow, startHigh, endLow, endHigh] = coordinates;

      // Lower trendline
      figures.push({
        type: "line",
        attrs: { coordinates: [startLow, endLow] },
        styles: { 
          color: "#FF9A3D", 
          lineWidth: 2 
        },
      });

      // Upper trendline
      figures.push({
        type: "line",
        attrs: { coordinates: [startHigh, endHigh] },
        styles: { 
          color: "#FF9A3D", 
          lineWidth: 2 
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: (startLow.x + endHigh.x) / 2,
          y: (startLow.y + endHigh.y) / 2 - 10,
          text: "Rising Wedge",
          align: "center",
          baseline: "bottom",
        },
        styles: {
          color: "#FF9A3D",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    }
    else if (patternType === "falling-wedge" && coordinates.length === 4) {
      const [startLow, startHigh, endLow, endHigh] = coordinates;

      // Lower trendline
      figures.push({
        type: "line",
        attrs: { coordinates: [startLow, endLow] },
        styles: { 
          color: "#6BCB77", 
          lineWidth: 2 
        },
      });

      // Upper trendline
      figures.push({
        type: "line",
        attrs: { coordinates: [startHigh, endHigh] },
        styles: { 
          color: "#6BCB77", 
          lineWidth: 2 
        },
      });

      // Pattern label
      figures.push({
        type: "text",
        attrs: {
          x: (startLow.x + endHigh.x) / 2,
          y: (startLow.y + endHigh.y) / 2 + 10,
          text: "Falling Wedge",
          align: "center",
          baseline: "top",
        },
        styles: {
          color: "#6BCB77",
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "rgba(30, 31, 41, 0.8)",
          padding: [4, 6],
        },
      });
    }

    return figures;
  },
};

// Generate sample data with all patterns
function generateSampleData(): KLineData[] {
  const now = Date.now();
  const data: KLineData[] = [];
  let price = 100;

  // Helper function for random candle
  const randomCandle = (): KLineData => {
    const o = price;
    const c = o + (Math.random() - 0.5) * 4;
    const h = Math.max(o, c) + Math.random() * 3;
    const l = Math.min(o, c) - Math.random() * 3;
    return { timestamp: now + data.length * 60000, open: o, high: h, low: l, close: c };
  };

  // Phase 1: Head & Shoulders (indices 10-20)
  for (let i = 0; i < 10; i++) data.push(randomCandle());

  // Left Shoulder
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 15,
    low: price - 3,
    close: price + 5,
  });

  // Left Trough
  data.push({
    timestamp: now + data.length * 60000,
    open: price + 3,
    high: price + 4,
    low: price - 8,
    close: price - 2,
  });

  // Head
  price -= 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 22,
    low: price - 5,
    close: price + 8,
  });

  // Right Trough
  price += 8;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 2,
    low: price - 10,
    close: price - 1,
  });

  // Right Shoulder
  price -= 1;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 14,
    low: price - 3,
    close: price + 4,
  });

  // Phase 2: Double Top (indices 25-30)
  price += 4;
  for (let i = 0; i < 3; i++) data.push(randomCandle());

  // First Top
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 18,
    low: price - 3,
    close: price + 2,
  });

  // Trough
  price += 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 1,
    low: price - 7,
    close: price - 3,
  });

  // Second Top
  price -= 3;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 17,
    low: price - 4,
    close: price + 1,
  });

  // Phase 3: Double Bottom (indices 35-40)
  price += 1;
  for (let i = 0; i < 3; i++) data.push(randomCandle());

  // First Bottom
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 3,
    low: price - 15,
    close: price - 2,
  });

  // Peak
  price -= 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 8,
    low: price - 1,
    close: price + 4,
  });

  // Second Bottom
  price += 4;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 2,
    low: price - 16,
    close: price - 1,
  });

  // Phase 4: Inverse Head & Shoulders (indices 45-55)
  price -= 1;
  for (let i = 0; i < 5; i++) data.push(randomCandle());

  // Left Shoulder (inverse)
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 3,
    low: price - 14,
    close: price - 2,
  });

  // Left Peak
  price -= 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 10,
    low: price - 1,
    close: price + 3,
  });

  // Head (inverse)
  price += 3;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 2,
    low: price - 22,
    close: price - 8,
  });

  // Right Peak
  price -= 8;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 12,
    low: price - 2,
    close: price + 4,
  });

  // Right Shoulder (inverse)
  price += 4;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 1,
    low: price - 15,
    close: price - 3,
  });

  // Phase 5: Triple Top (indices 60-70)
  price -= 3;
  for (let i = 0; i < 5; i++) data.push(randomCandle());

  // First Top
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 18,
    low: price - 4,
    close: price + 2,
  });

  // First Trough
  price += 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 1,
    low: price - 6,
    close: price - 2,
  });

  // Second Top
  price -= 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 17,
    low: price - 3,
    close: price + 1,
  });

  // Second Trough
  price += 1;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 1,
    low: price - 7,
    close: price - 3,
  });

  // Third Top
  price -= 3;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 16,
    low: price - 2,
    close: price + 2,
  });

  // Phase 6: Triple Bottom (indices 75-85)
  price += 2;
  for (let i = 0; i < 5; i++) data.push(randomCandle());

  // First Bottom
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 3,
    low: price - 16,
    close: price - 2,
  });

  // First Peak
  price -= 2;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 8,
    low: price - 1,
    close: price + 4,
  });

  // Second Bottom
  price += 4;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 1,
    low: price - 17,
    close: price - 3,
  });

  // Second Peak
  price -= 3;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 9,
    low: price - 1,
    close: price + 3,
  });

  // Third Bottom
  price += 3;
  data.push({
    timestamp: now + data.length * 60000,
    open: price,
    high: price + 2,
    low: price - 18,
    close: price - 1,
  });

  // Phase 7: Rising Wedge (indices 90-100)
  price -= 1;
  // Start of wedge
  const wedgeStartPrice = price;
  for (let i = 0; i < 10; i++) {
    const progress = i / 10;
    const amplitude = 10 * (1 - progress * 0.7); // Decreasing range
    const base = wedgeStartPrice + 15 * progress; // Upward drift

    data.push({
      timestamp: now + data.length * 60000,
      open: base,
      high: base + amplitude * 0.8,
      low: base - amplitude * 0.2,
      close: base + amplitude * 0.3,
    });
    price = base + amplitude * 0.3;
  }

  // Phase 8: Falling Wedge (indices 100-110)
  // Start of wedge
  const fallingWedgeStartPrice = price;
  for (let i = 0; i < 10; i++) {
    const progress = i / 10;
    const amplitude = 12 * (1 - progress * 0.7); // Decreasing range
    const base = fallingWedgeStartPrice - 12 * progress; // Downward drift

    data.push({
      timestamp: now + data.length * 60000,
      open: base,
      high: base + amplitude * 0.3,
      low: base - amplitude * 0.8,
      close: base - amplitude * 0.2,
    });
    price = base - amplitude * 0.2;
  }

  // Fill remaining data
  while (data.length < 120) data.push(randomCandle());

  return data;
}

export default function PatternRecognitionChart() {
  const chartRef = useRef<KLineChart | null>(null);
  const overlayIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const chart = init("pattern-chart");
    chartRef.current = chart;

    registerOverlay(PatternOverlay);

    const data = generateSampleData();
    chart.applyNewData(data);

    // Detect all patterns
    const allPatterns = [
      ...detectHeadAndShoulders(data),
      ...detectInverseHeadShoulders(data),
      ...detectDoubleTop(data),
      ...detectDoubleBottom(data),
      ...detectTripleTop(data),
      ...detectTripleBottom(data),
      ...detectRisingWedge(data),
      ...detectFallingWedge(data),
    ];

    // Create overlays for each pattern
    allPatterns.forEach((pattern) => {
      const overlayId = chart.createOverlay({
        name: "chart-patterns",
        points: pattern.points,
        extendData: { pattern: pattern.pattern },
        styles: { point: { visible: false } },
      });
      overlayIdsRef.current.push(overlayId);
    });

    return () => {
      dispose("pattern-chart");
      overlayIdsRef.current = [];
    };
  }, []);

  return (
    <div
      id="pattern-chart"
      style={{
        width: "100%",
        height: "80vh",
        borderRadius: "8px",
        background: "#1e1f29",
      }}
    />
  );
}