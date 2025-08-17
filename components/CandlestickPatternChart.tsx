"use client";
import { 
  registerOverlay, 
  type OverlayTemplate, 
  type KLineData 
} from "klinecharts";

// Helper functions
const isBullish = (candle: KLineData) => candle.close > candle.open;
const isBearish = (candle: KLineData) => candle.close < candle.open;
const bodySize = (candle: KLineData) => Math.abs(candle.close - candle.open);
const totalRange = (candle: KLineData) => candle.high - candle.low;
const upperShadow = (candle: KLineData) => candle.high - Math.max(candle.open, candle.close);
const lowerShadow = (candle: KLineData) => Math.min(candle.open, candle.close) - candle.low;
const bodyTop = (candle: KLineData) => Math.max(candle.open, candle.close);
const bodyBottom = (candle: KLineData) => Math.min(candle.open, candle.close);
const bodyMiddle = (candle: KLineData) => (candle.open + candle.close) / 2;
const isSmallBody = (candle: KLineData) => bodySize(candle) < totalRange(candle) * 0.3;
const isLongBody = (candle: KLineData) => bodySize(candle) > totalRange(candle) * 0.6;
const isMarubozu = (candle: KLineData) => bodySize(candle) > totalRange(candle) * 0.9;
const isDoji = (candle: KLineData) => bodySize(candle) < totalRange(candle) * 0.05;
const isGapUp = (prev: KLineData, curr: KLineData) => curr.low > prev.high;
const isGapDown = (prev: KLineData, curr: KLineData) => curr.high < prev.low;
const isPiercingLine = (prev: KLineData, curr: KLineData) => 
  isBearish(prev) && isBullish(curr) && 
  curr.open < prev.low && 
  curr.close > prev.close + (prev.open - prev.close) / 2;

// Pattern detection - over 30 patterns
export function detectPatterns(data: KLineData[]): { index: number; name: string }[] {
  const results: { index: number; name: string }[] = [];
  if (data.length < 3) return results;

  for (let i = 2; i < data.length; i++) {
    const prev2 = data[i - 2];
    const prev1 = data[i - 1];
    const curr = data[i];

    // 1. Single Candle Patterns
    if (isDoji(curr)) {
      if (upperShadow(curr) > totalRange(curr) * 0.6 && lowerShadow(curr) < totalRange(curr) * 0.1) {
        results.push({ index: i, name: "Gravestone Doji" });
      } else if (lowerShadow(curr) > totalRange(curr) * 0.6 && upperShadow(curr) < totalRange(curr) * 0.1) {
        results.push({ index: i, name: "Dragonfly Doji" });
      } else {
        results.push({ index: i, name: "Doji" });
      }
    }

    if (isSmallBody(curr)) {
      // Hammer variations
      if (lowerShadow(curr) > bodySize(curr) * 2 && upperShadow(curr) < bodySize(curr)) {
        if (isBearish(prev1)) results.push({ index: i, name: "Hammer" });
        if (isBullish(prev1)) results.push({ index: i, name: "Hanging Man" });
      }

      // Shooting Star variations
      if (upperShadow(curr) > bodySize(curr) * 2 && lowerShadow(curr) < bodySize(curr)) {
        if (isBullish(prev1)) results.push({ index: i, name: "Shooting Star" });
        if (isBearish(prev1)) results.push({ index: i, name: "Inverted Hammer" });
      }
    }

    if (isMarubozu(curr)) {
      if (isBullish(curr)) results.push({ index: i, name: "Bullish Marubozu" });
      else results.push({ index: i, name: "Bearish Marubozu" });
    }

    if (lowerShadow(curr) > totalRange(curr) * 0.7 && isBullish(curr)) {
      results.push({ index: i, name: "Paper Umbrella" });
    }

    // 2. Two Candle Patterns
    if (i >= 1) {
      // Engulfing patterns
      if (isBearish(prev1) && isBullish(curr) && 
          curr.open < prev1.close && curr.close > prev1.open) {
        results.push({ index: i, name: "Bullish Engulfing" });
      }

      if (isBullish(prev1) && isBearish(curr) && 
          curr.open > prev1.close && curr.close < prev1.open) {
        results.push({ index: i, name: "Bearish Engulfing" });
      }

      // Harami patterns
      if (isLongBody(prev1) && isSmallBody(curr) &&
          curr.high < prev1.high && curr.low > prev1.low) {
        if (isBullish(curr)) results.push({ index: i, name: "Bullish Harami" });
        else results.push({ index: i, name: "Bearish Harami" });

        if (isDoji(curr)) {
          if (isBearish(prev1)) results.push({ index: i, name: "Bullish Harami Cross" });
          else results.push({ index: i, name: "Bearish Harami Cross" });
        }
      }

      // Piercing / Dark Cloud
      if (isPiercingLine(prev1, curr)) {
        results.push({ index: i, name: "Piercing Line" });
      }

      if (isBullish(prev1) && isBearish(curr) && 
          curr.open > prev1.high && curr.close < bodyMiddle(prev1)) {
        results.push({ index: i, name: "Dark Cloud Cover" });
      }

      // Tweezer patterns
      if (Math.abs(prev1.high - curr.high) < 0.01 * prev1.high) {
        if (isBullish(prev1) && isBearish(curr)) {
          results.push({ index: i, name: "Tweezer Top" });
        }
      }

      if (Math.abs(prev1.low - curr.low) < 0.01 * prev1.low) {
        if (isBearish(prev1) && isBullish(curr)) {
          results.push({ index: i, name: "Tweezer Bottom" });
        }
      }

      // Meeting lines
      if (isBearish(prev1) && isBullish(curr) && 
          Math.abs(prev1.close - curr.close) < 0.01 * prev1.close) {
        results.push({ index: i, name: "Bullish Meeting Line" });
      }

      if (isBullish(prev1) && isBearish(curr) && 
          Math.abs(prev1.close - curr.close) < 0.01 * prev1.close) {
        results.push({ index: i, name: "Bearish Meeting Line" });
      }

      // Separating lines
      if (isBullish(prev1) && isBullish(curr) && 
          curr.open < prev1.open && curr.close > prev1.close) {
        results.push({ index: i, name: "Bullish Separating Lines" });
      }

      if (isBearish(prev1) && isBearish(curr) && 
          curr.open > prev1.open && curr.close < prev1.close) {
        results.push({ index: i, name: "Bearish Separating Lines" });
      }

      // On-Neck pattern
      if (isLongBody(prev1) && isBearish(prev1) && 
          isBullish(curr) && Math.abs(curr.close - prev1.low) < 0.01 * prev1.low) {
        results.push({ index: i, name: "On-Neck Line" });
      }
    }

    // 3. Three Candle Patterns
    // Morning/Evening Star
    if (isLongBody(prev2) && isSmallBody(prev1) && isLongBody(curr)) {
      if (isBearish(prev2) && isGapDown(prev2, prev1) && isBullish(curr) && isGapUp(prev1, curr)) {
        results.push({ index: i, name: "Morning Star" });
        if (isDoji(prev1)) results.push({ index: i, name: "Morning Doji Star" });
      }

      if (isBullish(prev2) && isGapUp(prev2, prev1) && isBearish(curr) && isGapDown(prev1, curr)) {
        results.push({ index: i, name: "Evening Star" });
        if (isDoji(prev1)) results.push({ index: i, name: "Evening Doji Star" });
      }
    }

    // Three Soldiers/Crows
    if (i >= 2) {
      if (isLongBody(prev2) && isLongBody(prev1) && isLongBody(curr) &&
          isBullish(prev2) && isBullish(prev1) && isBullish(curr) &&
          curr.open > prev1.open && prev1.open > prev2.open &&
          curr.close > prev1.close && prev1.close > prev2.close) {
        results.push({ index: i, name: "Three White Soldiers" });
      }

      if (isLongBody(prev2) && isLongBody(prev1) && isLongBody(curr) &&
          isBearish(prev2) && isBearish(prev1) && isBearish(curr) &&
          curr.open < prev1.open && prev1.open < prev2.open &&
          curr.close < prev1.close && prev1.close < prev2.close) {
        results.push({ index: i, name: "Three Black Crows" });
      }
    }

    // Three Inside Up/Down
    if (i >= 2) {
      if (isLongBody(prev2) && isBearish(prev2) &&
          isBullish(prev1) && 
          prev1.close > prev2.open && prev1.open < prev2.close &&
          isBullish(curr) && curr.close > prev1.high) {
        results.push({ index: i, name: "Three Inside Up" });
      }

      if (isLongBody(prev2) && isBullish(prev2) &&
          isBearish(prev1) && 
          prev1.close < prev2.open && prev1.open > prev2.close &&
          isBearish(curr) && curr.close < prev1.low) {
        results.push({ index: i, name: "Three Inside Down" });
      }
    }

    // Three Outside Up/Down
    if (i >= 2) {
      if (isBearish(prev2) && 
          isBullish(prev1) && 
          prev1.close > prev2.open && 
          isBullish(curr) && curr.close > prev1.close) {
        results.push({ index: i, name: "Three Outside Up" });
      }

      if (isBullish(prev2) && 
          isBearish(prev1) && 
          prev1.close < prev2.open && 
          isBearish(curr) && curr.close < prev1.close) {
        results.push({ index: i, name: "Three Outside Down" });
      }
    }

    // Abandoned Baby
    if (isLongBody(prev2) && isSmallBody(prev1) && isLongBody(curr)) {
      if (isBearish(prev2) && isGapDown(prev2, prev1) && isGapUp(prev1, curr) && isBullish(curr)) {
        results.push({ index: i, name: "Bullish Abandoned Baby" });
      }

      if (isBullish(prev2) && isGapUp(prev2, prev1) && isGapDown(prev1, curr) && isBearish(curr)) {
        results.push({ index: i, name: "Bearish Abandoned Baby" });
      }
    }

    // Stick Sandwich
    if (i >= 2) {
      if (isBearish(prev2) && isBullish(prev1) && isBearish(curr) &&
          Math.abs(prev2.close - curr.close) < 0.01 * prev2.close &&
          prev1.close > prev2.close) {
        results.push({ index: i, name: "Bullish Stick Sandwich" });
      }

      if (isBullish(prev2) && isBearish(prev1) && isBullish(curr) &&
          Math.abs(prev2.close - curr.close) < 0.01 * prev2.close &&
          prev1.close < prev2.close) {
        results.push({ index: i, name: "Bearish Stick Sandwich" });
      }
    }

    // Tasuki patterns
    if (i >= 2) {
      if (isBullish(prev2) && isGapUp(prev2, prev1) && 
          isBearish(prev1) && isBullish(curr) && 
          curr.open > prev1.open && curr.close < prev1.close && curr.close > prev2.close) {
        results.push({ index: i, name: "Upside Tasuki Gap" });
      }

      if (isBearish(prev2) && isGapDown(prev2, prev1) && 
          isBullish(prev1) && isBearish(curr) && 
          curr.open < prev1.open && curr.close > prev1.close && curr.close < prev2.close) {
        results.push({ index: i, name: "Downside Tasuki Gap" });
      }
    }

    // Unique Three River patterns
    if (i >= 2 && isBearish(prev2) && isBearish(prev1) && isBullish(curr) &&
        curr.close < prev1.close && curr.close > prev1.open &&
        prev1.low < prev2.low && prev1.close > prev2.close) {
      results.push({ index: i, name: "Unique Three River Bottom" });
    }

    if (i >= 2 && isBullish(prev2) && isBullish(prev1) && isBearish(curr) &&
        curr.close > prev1.close && curr.close < prev1.open &&
        prev1.high > prev2.high && prev1.close < prev2.close) {
      results.push({ index: i, name: "Unique Three River Top" });
    }

    // Three Stars patterns
    if (i >= 3) {
      const prev3 = data[i - 3];
      if (isBearish(prev3) && 
          isSmallBody(prev2) && isGapDown(prev3, prev2) &&
          isSmallBody(prev1) && isGapDown(prev2, prev1) &&
          isSmallBody(curr) && isGapDown(prev1, curr)) {
        results.push({ index: i, name: "Falling Three Methods" });
      }

      if (isBullish(prev3) && 
          isSmallBody(prev2) && isGapUp(prev3, prev2) &&
          isSmallBody(prev1) && isGapUp(prev2, prev1) &&
          isSmallBody(curr) && isGapUp(prev1, curr)) {
        results.push({ index: i, name: "Rising Three Methods" });
      }
    }
  }

  return results;
}

// Overlay registration
export const CandlestickPatternOverlay: OverlayTemplate = {
  name: "candlestick-pattern",
  needDefaultPointFigure: false,
  createPointFigures: ({ coordinates, overlay }) => {
    const figs: any[] = [];
    const colors = ["#FF6B6B", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];

    overlay.points.forEach((pt: any, idx: number) => {
      const coord = coordinates[idx];
      if (!coord) return;

      const color = colors[Math.abs(pt.text.length) % colors.length];

      figs.push({
        type: "text",
        attrs: {
          x: coord.x,
          y: coord.y - 15,
          text: pt.text,
          align: "center",
          baseline: "bottom",
        },
        styles: {
          color,
          fontSize: 10,
          fontWeight: "bold",
          textBorderColor: "#000",
          textBorderWidth: 1
        },
      });

      figs.push({
        type: "rect",
        attrs: {
          x: coord.x - 4,
          y: coord.y - 25,
          width: 8,
          height: 8,
          radius: 2
        },
        styles: {
          color,
          borderColor: color,
          borderSize: 1
        }
      });
    });
    return figs;
  },
};

// Register the overlay
export const registerCandlestickPatternOverlay = () => {
  registerOverlay(CandlestickPatternOverlay);
};

// Apply pattern detection to a chart
export const applyCandlestickPatternRecognition = (chart: any, data: KLineData[]) => {
  // Register overlay if not already registered
  registerCandlestickPatternOverlay();

  // Remove any existing pattern overlays
  chart.removeOverlay({ name: "candlestick-pattern" });

  // Detect patterns
  const patterns = detectPatterns(data);

  // Create points for overlay
  const points = patterns.map(p => ({
    timestamp: data[p.index].timestamp,
    value: data[p.index].low - 2 - (Math.random() * 2),
    text: p.name
  }));

  // Create overlay
  if (points.length > 0) {
    chart.createOverlay({
      name: "candlestick-pattern",
      points: points,
      styles: { point: { visible: false } }
    });
  }

  return patterns;
};