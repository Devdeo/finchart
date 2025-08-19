import { useState, useRef, useEffect } from "react";
import { registerOverlay } from "klinecharts";
import OIChartAlpha5 from "./OIChartAlpha5";
import { applyCandlestickPatternRecognition } from "./CandlestickPatternChart";
import { applyChartPatternRecognition } from "./ChartPatternRecognition";
import { applyHarmonicPatternRecognition } from "./DetectHarmonicPatterns";

// Register custom overlays for drawing tools
let overlaysRegistered = false;

const registerCustomOverlays = () => {
  if (overlaysRegistered) return;
  overlaysRegistered = true;

  // Register pattern overlays
  const registerPattern = (
    name: string,
    labels: string[],
    opts: { color: string; closeShape?: boolean }
  ) => {
    registerOverlay({
      name,
      totalStep: labels.length,
      needDefaultPointFigure: true,
      createPointFigures: ({ coordinates }) => {
        const figs: any[] = [];
        const n = coordinates.length;

        // Progressive line preview
        if (coordinates && coordinates.length >= 2) {
          figs.push({
            type: "line",
            attrs: { coordinates },
            styles: { color: opts.color, size: 2, style: "solid" },
          });
        }

        // Optional fill (only when we already have 3+ points)
        if (opts.closeShape && coordinates && coordinates.length >= 3) {
          figs.push({
            type: "polygon",
            attrs: { coordinates },
            styles: { style: "stroke_fill", color: `${opts.color}33`, borderColor: opts.color, borderSize: 1 },
          });
        }

        // Labels for points collected so far
        for (let i = 0; i < n && i < labels.length; i++) {
          figs.push({
            type: "text",
            attrs: { x: coordinates[i].x, y: coordinates[i].y, text: labels[i] },
            styles: { color: opts.color, size: 12 },
          });
        }

        return figs;
      },
    });
  };

  // Generic patterns (progressive drawing)
  registerPattern("xabcdPattern", ["X", "A", "B", "C", "D"], { color: "#e11d48", closeShape: true });
  registerPattern("cypherPattern", ["X", "A", "B", "C", "D"], { color: "#f97316", closeShape: true });
  registerPattern("abcdPattern", ["A", "B", "C", "D"], { color: "#2563eb", closeShape: true });
  registerPattern("trianglePattern", ["A", "B", "C"], { color: "#16a34a", closeShape: true });
  registerPattern("threeDrives", ["1", "2", "3", "4"], { color: "#9333ea", closeShape: false });
  registerPattern("elliottWave", ["1", "2", "3", "4", "5"], { color: "#0ea5e9", closeShape: false });
  registerPattern("elliottImpulse", ["1", "2", "3", "4", "5"], { color: "#f43f5e", closeShape: false });
  registerPattern("elliottCorrection", ["A", "B", "C"], { color: "#0891b2", closeShape: false });

  // Head & Shoulders (progressive neckline + shoulders)
  registerOverlay({
    name: "headShoulders",
    totalStep: 5, // LS, H, RS, NL1, NL2
    needDefaultPointFigure: true,
    createPointFigures: ({ coordinates }) => {
      const figs: any[] = [];
      const n = coordinates.length;
      const color = "#854d0e";

      // Shoulders & head (first 3 points)
      if (n >= 2) {
        figs.push({ type: "line", attrs: { coordinates: coordinates.slice(0, Math.min(n, 3)) }, styles: { color, size: 2 } });
      }
      // Neckline when we have point 4 and/or 5
      if (n >= 4) {
        const nlEnd = n >= 5 ? coordinates[4] : coordinates[3];
        figs.push({ type: "line", attrs: { coordinates: [coordinates[3], nlEnd] }, styles: { color, size: 2 } });
      }
      // Labels for available points
      const labels = ["LS", "H", "RS", "NL1", "NL2"];
      for (let i = 0; i < n; i++) {
        figs.push({ type: "text", attrs: { x: coordinates[i].x, y: coordinates[i].y, text: labels[i] }, styles: { color } });
      }
      return figs;
    },
  });

  // Trend Angle overlay
  registerOverlay({
    name: "trendAngle",
    totalStep: 2,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates }) => {
      if (!coordinates || coordinates.length < 2) return [];
      const [p1, p2] = coordinates;
      const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
      return [
        { type: "line", attrs: { coordinates: [p1, p2] } },
        { type: "text", attrs: { x: p2.x, y: p2.y, text: `${angle.toFixed(1)}°` } },
      ];
    },
  });

  // Cross Line overlay
  registerOverlay({
    name: "crossLine",
    totalStep: 1,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates, bounding }) => {
      if (!coordinates || !coordinates[0] || !bounding) return [];
      const p = coordinates[0];
      return [
        { type: "line", attrs: { coordinates: [{ x: bounding.left, y: p.y }, { x: bounding.left + bounding.width, y: p.y }] } },
        { type: "line", attrs: { coordinates: [{ x: p.x, y: bounding.top }, { x: p.x, y: bounding.top + bounding.height }] } },
      ];
    },
  });

  // Flat Top/Bottom overlay
  registerOverlay({
    name: "flatTopBottom",
    totalStep: 2,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates, bounding }) => {
      if (!coordinates || coordinates.length < 2 || !bounding) return [];
      const [p1, p2] = coordinates;
      return [
        { type: "line", attrs: { coordinates: [{ x: bounding.left, y: p1.y }, { x: bounding.left + bounding.width, y: p1.y }] } },
        { type: "line", attrs: { coordinates: [{ x: bounding.left, y: p2.y }, { x: bounding.left + bounding.width, y: p2.y }] } },
      ];
    },
  });

  // Fibonacci Retracement overlay (custom implementation as fallback)
  registerOverlay({
    name: "fibRetracement",
    totalStep: 2,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates, bounding, yAxis }) => {
      if (!coordinates || coordinates.length < 2 || !bounding || !yAxis) return [];
      const [p1, p2] = coordinates;
      
      // Convert pixel coordinates to price values
      const price1 = yAxis.convertFromPixel(p1.y);
      const price2 = yAxis.convertFromPixel(p2.y);
      
      // Fibonacci levels
      const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      const fibLabels = ['0.0%', '23.6%', '38.2%', '50.0%', '61.8%', '78.6%', '100.0%'];
      
      const priceRange = price2 - price1;
      const startPrice = price1;
      
      const figures = [];
      
      // Main trend line from p1 to p2
      figures.push({
        type: "line",
        attrs: {
          coordinates: [p1, p2]
        },
        styles: {
          color: '#ff9800',
          size: 2,
          style: 'solid'
        }
      });
      
      // Get chart bounds for extending lines
      const leftBound = bounding.left;
      const rightBound = bounding.left + bounding.width;
      
      // Draw horizontal lines for each fib level
      for (let i = 0; i < fibLevels.length; i++) {
        const level = fibLevels[i];
        const fibPrice = startPrice + (priceRange * level);
        const y = yAxis.convertToPixel(fibPrice);
        
        // Color scheme for different levels
        let lineColor = '#999999';
        let lineSize = 1;
        
        if (level === 0 || level === 1) {
          lineColor = '#666666';
          lineSize = 2;
        } else if (level === 0.382 || level === 0.618) {
          lineColor = '#ff9800';
          lineSize = 2;
        } else if (level === 0.5) {
          lineColor = '#2196f3';
          lineSize = 2;
        }
        
        // Horizontal line spanning the entire chart width
        figures.push({
          type: "line",
          attrs: {
            coordinates: [
              { x: leftBound, y },
              { x: rightBound, y }
            ]
          },
          styles: {
            color: lineColor,
            size: lineSize,
            style: 'solid'
          }
        });
        
        // Price and percentage labels
        figures.push({
          type: "text",
          attrs: {
            x: rightBound - 120,
            y: y - 5,
            text: `${fibLabels[i]} (${fibPrice.toFixed(2)})`
          },
          styles: {
            color: lineColor,
            size: 11,
            family: 'Arial, sans-serif'
          }
        });
      }
      
      return figures;
    },
  });

  // Fib Spiral (simple poly-line approximation)
  registerOverlay({
    name: "fibSpiral",
    totalStep: 2,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates }) => {
      if (!coordinates || coordinates.length < 2) return [];
      const [p1, p2] = coordinates;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      const steps = 64;
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const theta = i * (Math.PI / 16);
        const radius = r * Math.pow(1.618, i / 12);
        pts.push({ x: p1.x + radius * Math.cos(theta), y: p1.y + radius * Math.sin(theta) });
      }
      return [{
        type: "line",
        attrs: { coordinates: pts },
        styles: {
          color: '#9c27b0',
          size: 2,
          style: 'solid'
        }
      }];
    },
  });

  // Fib Wedge (two rays from p1 to right edge)
  registerOverlay({
    name: "fibWedge",
    totalStep: 3,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates, bounding }) => {
      if (!coordinates || coordinates.length < 3 || !bounding) return [];
      const [p1, p2, p3] = coordinates;
      const { left, width } = bounding;
      const x2 = left + width;
      return [
        { 
          type: "line", 
          attrs: { coordinates: [p1, { x: x2, y: p2.y }] },
          styles: { color: '#e91e63', size: 2, style: 'solid' }
        },
        { 
          type: "line", 
          attrs: { coordinates: [p1, { x: x2, y: p3.y }] },
          styles: { color: '#e91e63', size: 2, style: 'solid' }
        },
      ];
    },
  });

  // Fib Channel
  registerOverlay({
    name: "fibChannel",
    totalStep: 3,
    needDefaultPointFigure: false,
    createPointFigures: ({ coordinates, bounding }) => {
      if (!coordinates || coordinates.length < 3 || !bounding) return [];
      const [p1, p2, p3] = coordinates;
      
      // Calculate parallel lines
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const offset = (p3.y - p1.y) - ((p3.x - p1.x) / dx) * dy;
      
      const { left, width } = bounding;
      const xEnd = left + width;
      
      const levels = [0, 0.382, 0.618, 1];
      const figures = [];
      
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const y1 = p1.y + offset * level;
        const y2 = p2.y + offset * level;
        
        figures.push({
          type: "line",
          attrs: { coordinates: [
            { x: p1.x, y: y1 },
            { x: xEnd, y: y2 },
          ] },
          styles: {
            color: level === 0.382 || level === 0.618 ? '#ff9800' : '#3f51b5',
            size: level === 0.382 || level === 0.618 ? 2 : 1,
            style: level === 0 || level === 1 ? 'solid' : 'dashed'
          }
        });
      }
      return figures;
    },
  });

  // Risk-Reward Position overlay
  registerOverlay({
    name: 'position',
    needDefaultPointFigure: true,
    totalStep: 3,
    createPointFigures: ({ coordinates, overlay }) => {
      if (coordinates.length < 3) return [];
      const side = overlay.extendData?.side ?? 'long';
      const [entry, sl, tp] = coordinates;
      const eY = entry.y, sY = sl.y, tY = tp.y;
      const xL = entry.x - 40, xR = entry.x + 40;
      const risk = Math.abs(sY - eY), reward = Math.abs(tY - eY);
      const rr = risk === 0 ? '∞' : (reward / risk).toFixed(2);

      const base = [
        {
          type: 'line',
          attrs: { coordinates: [{ x: xL, y: eY }, { x: xR, y: eY }] },
          styles: { color: 'blue', size: 2, style: 'dashed' }
        },
        {
          type: 'text',
          attrs: { x: xL - 5, y: eY, text: 'Entry' },
          styles: { fontSize: 12, color: 'blue' }
        },
        {
          type: 'text',
          attrs: { x: xR + 5, y: eY, text: `RRR ${rr}` },
          styles: { fontSize: 12, color: '#000' }
        }
      ];

      if (side === 'long') {
        base.push(
          {
            type: 'polygon',
            attrs: {
              coordinates: [{ x: xL, y: eY }, { x: xR, y: eY }, { x: xR, y: sY }, { x: xL, y: sY }],
            },
            styles: { style: 'fill', color: '#F4511E40' }
          },
          {
            type: 'text',
            attrs: { x: xL - 5, y: sY, text: 'SL' },
            styles: { fontSize: 12, color: 'red' }
          },
          {
            type: 'polygon',
            attrs: {
              coordinates: [{ x: xL, y: eY }, { x: xR, y: eY }, { x: xR, y: tY }, { x: xL, y: tY }],
            },
            styles: { style: 'fill', color: '#7CB34240' }
          },
          {
            type: 'text',
            attrs: { x: xL - 5, y: tY, text: 'TP' },
            styles: { fontSize: 12, color: 'green' }
          }
        );
      } else {
        base.push(
          {
            type: 'polygon',
            attrs: {
              coordinates: [{ x: xL, y: eY }, { x: xR, y: eY }, { x: xR, y: sY }, { x: xL, y: sY }],
            },
            styles: { style: 'fill', color: '#F4511E40' }
          },
          {
            type: 'text',
            attrs: { x: xL - 5, y: sY, text: 'SL' },
            styles: { fontSize: 12, color: 'red' }
          },
          {
            type: 'polygon',
            attrs: {
              coordinates: [{ x: xL, y: eY }, { x: xR, y: eY }, { x: xR, y: tY }, { x: xL, y: tY }],
            },
            styles: { style: 'fill', color: '#7CB34240' }
          },
          {
            type: 'text',
            attrs: { x: xL - 5, y: tY, text: 'TP' },
            styles: { fontSize: 12, color: 'green' }
          }
        );
      }

      return base;
    }
  });

  // Shape overlays
  // Rectangle overlay
  registerOverlay({
    name: 'rectangle',
    totalStep: 1,
    needDefaultPointFigure: true,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 1) return [];
      const [p] = coordinates;
      const p2 = { x: p.x + 80, y: p.y + 60 };
      return [
        {
          type: 'polygon',
          attrs: { coordinates: [p, { x: p2.x, y: p.y }, p2, { x: p.x, y: p2.y }] },
          styles: { style: 'stroke_fill', color: '#4A90E280', borderColor: '#4A90E2', borderSize: 2 }
        }
      ];
    }
  });

  // Rotated Rectangle overlay
  registerOverlay({
    name: 'rotatedRectangle',
    totalStep: 1,
    needDefaultPointFigure: true,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 1) return [];
      const [p] = coordinates;
      const width = 100, height = 50, angle = Math.PI / 6; // 30°
      const corners = [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height },
      ].map(pt => ({
        x: p.x + pt.x * Math.cos(angle) - pt.y * Math.sin(angle),
        y: p.y + pt.x * Math.sin(angle) + pt.y * Math.cos(angle),
      }));
      return [
        {
          type: 'polygon',
          attrs: { coordinates: corners },
          styles: { style: 'stroke_fill', color: '#FF980080', borderColor: '#FF9800', borderSize: 2 }
        }
      ];
    }
  });

  // Circle overlay
  registerOverlay({
    name: 'circle',
    totalStep: 1,
    needDefaultPointFigure: true,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 1) return [];
      const [c] = coordinates;
      const r = 40;
      return [
        {
          type: 'circle',
          attrs: { x: c.x, y: c.y, r },
          styles: { style: 'stroke_fill', color: '#7CB34280', borderColor: '#7CB342', borderSize: 2 }
        }
      ];
    }
  });

  // Triangle overlay
  registerOverlay({
    name: 'triangle',
    totalStep: 1,
    needDefaultPointFigure: true,
    createPointFigures: ({ coordinates }) => {
      if (coordinates.length < 1) return [];
      const [p] = coordinates;
      const size = 80;
      const p2 = { x: p.x + size, y: p.y };
      const apex = { x: p.x + size / 2, y: p.y - size * 0.866 };
      return [
        {
          type: 'polygon',
          attrs: { coordinates: [p, p2, apex] },
          styles: { style: 'stroke_fill', color: '#E91E6380', borderColor: '#E91E63', borderSize: 2 }
        }
      ];
    }
  });
};
import SMAIndicator from "./SMAIndicator";
import EMAIndicator from "./EMAIndicator";
import WMAIndicator from "./WMAIndicator";
import IchimokuIndicator from "./IchimokuIndicator";
import SupertrendIndicator from "./SupertrendIndicator";
import PSARIndicator from "./PSARIndicator";
import MACDIndicator from "./MACDIndicator";
import ADXIndicator from "./ADXIndicator";
import HMAIndicator from "./HMAIndicator";
import RSIIndicator from "./RSIIndicator";
import StochasticIndicator from "./StochasticIndicator";
import StochasticRSIIndicator from "./StochasticRSIIndicator";
import CCIIndicator from "./CCIIndicator";
import WilliamsRIndicator from "./WilliamsRIndicator";
import ROCIndicator from "./ROCIndicator";
import BollingerBandsIndicator from "./BollingerBandsIndicator";
import KeltnerChannelIndicator from "./KeltnerChannelIndicator";
import DonchianChannelIndicator from "./DonchianChannelIndicator";
import ATRIndicator from "./ATRIndicator";
import StandardDeviationChannelIndicator from "./StandardDeviationChannelIndicator";
import VolumeHistogramIndicator from "./VolumeHistogramIndicator";

export default function MainChart() {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);
  const menuRef = useRef(null);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showFibSubmenu, setShowFibSubmenu] = useState(false);
  const [showPatternSubmenu, setShowPatternSubmenu] = useState(false);
  const [showProjectionSubmenu, setShowProjectionSubmenu] = useState(false);
  const [showBrushesSubmenu, setShowBrushesSubmenu] = useState(false);
  const [showPositionSubmenu, setShowPositionSubmenu] = useState(false);
  const [showShapesSubmenu, setShowShapesSubmenu] = useState(false);
  const [activeDrawingTool, setActiveDrawingTool] = useState(null);
  const [showDrawingSettings, setShowDrawingSettings] = useState(false);
  const [hasActiveDrawing, setHasActiveDrawing] = useState(false);
  const [drawingSettings, setDrawingSettings] = useState({
    color: '#1e88e5',
    thickness: 2
  });
  const submenuRef = useRef(null);
  const fibSubmenuRef = useRef(null);
  const patternSubmenuRef = useRef(null);
  const projectionSubmenuRef = useRef(null);
  const brushesSubmenuRef = useRef(null);
  const positionSubmenuRef = useRef(null);
  const shapesSubmenuRef = useRef(null);
  const drawingSettingsRef = useRef(null);

  // Chart reference for pattern recognition
  const chartInstanceRef = useRef(null);

  // OI Data state
  const [oiData, setOiData] = useState(true);

  // Chart type state
  const [chartType, setChartType] = useState("candle");

  // Applied indicators state
  const [appliedIndicators, setAppliedIndicators] = useState([]);
  const [hoveredIndicator, setHoveredIndicator] = useState(null);
  const [smaIndicators, setSmaIndicators] = useState<any[]>([]);
  const [emaIndicators, setEmaIndicators] = useState<any[]>([]);
  const [wmaIndicators, setWmaIndicators] = useState<any[]>([]);
  const [ichimokuIndicators, setIchimokuIndicators] = useState<any[]>([]);
  const [supertrendIndicators, setSupertrendIndicators] = useState<any[]>([]);
  const [psarIndicators, setPsarIndicators] = useState<any[]>([]);
  const [macdIndicators, setMacdIndicators] = useState<any[]>([]);
  const [adxIndicators, setAdxIndicators] = useState<any[]>([]);
  const [hmaIndicators, setHmaIndicators] = useState<any[]>([]);
  const [rsiIndicators, setRsiIndicators] = useState<any[]>([]);
  const [stochasticIndicators, setStochasticIndicators] = useState<any[]>([]);
  const [stochasticRsiIndicators, setStochasticRsiIndicators] = useState<any[]>([]);
  const [cciIndicators, setCciIndicators] = useState<any[]>([]);
  const [williamsRIndicators, setWilliamsRIndicators] = useState<any[]>([]);
  const [rocIndicators, setRocIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [bollingerBandsIndicators, setBollingerBandsIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [keltnerChannelIndicators, setKeltnerChannelIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [donchianChannelIndicators, setDonchianChannelIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [atrIndicators, setAtrIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [standardDeviationChannelIndicators, setStandardDeviationChannelIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [volumeHistogramIndicators, setVolumeHistogramIndicators] = useState<Array<{ id: string; chart: any; name: string }>>([]);
  const [showIndicatorControls, setShowIndicatorControls] = useState(null);

  // Settings state
  const [settings, setSettings] = useState({
    // Price Display
    lastPrice: true,
    highPrice: true,
    lowPrice: true,
    openPrice: false,

    // Chart Display
    gridShow: true,
    crosshairShow: true,
    volumeShow: true,
    reverseCoord: false,

    // Chart Appearance
    candleStyle: 'candle_solid',
    theme: 'light',

    // Technical Analysis
    autoScale: true,
    logScale: false,

    // Performance
    animationEnabled: true,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".popup-menu") &&
        !e.target.closest(".toolbar-btn")
      ) {
        setOpenMenu(null);
      }

      // Close indicator controls when clicking outside
      if (
        showIndicatorControls &&
        !e.target.closest("[data-indicator-chip]")
      ) {
        setShowIndicatorControls(null);
      }

      // Close submenus when clicking outside
      if (
        showSubmenu &&
        submenuRef.current &&
        !submenuRef.current.contains(e.target) &&
        !e.target.closest(".submenu-trigger")
      ) {
        setShowSubmenu(false);
      }

      if (
        showFibSubmenu &&
        fibSubmenuRef.current &&
        !fibSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".fib-submenu-trigger")
      ) {
        setShowFibSubmenu(false);
      }

      if (
        showPatternSubmenu &&
        patternSubmenuRef.current &&
        !patternSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".pattern-submenu-trigger")
      ) {
        setShowPatternSubmenu(false);
      }

      if (
        showProjectionSubmenu &&
        projectionSubmenuRef.current &&
        !projectionSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".projection-submenu-trigger")
      ) {
        setShowProjectionSubmenu(false);
      }

      if (
        showBrushesSubmenu &&
        brushesSubmenuRef.current &&
        !brushesSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".brushes-submenu-trigger")
      ) {
        setShowBrushesSubmenu(false);
      }

      if (
        showPositionSubmenu &&
        positionSubmenuRef.current &&
        !positionSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".position-submenu-trigger")
      ) {
        setShowPositionSubmenu(false);
      }

      if (
        showShapesSubmenu &&
        shapesSubmenuRef.current &&
        !shapesSubmenuRef.current.contains(e.target) &&
        !e.target.closest(".shapes-submenu-trigger")
      ) {
        setShowShapesSubmenu(false);
      }

      if (
        showDrawingSettings &&
        drawingSettingsRef.current &&
        !drawingSettingsRef.current.contains(e.target) &&
        !e.target.closest(".drawing-settings-trigger")
      ) {
        setShowDrawingSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSubmenu, showFibSubmenu, showPatternSubmenu, showProjectionSubmenu, showBrushesSubmenu, showPositionSubmenu, showShapesSubmenu, showIndicatorControls, showDrawingSettings]);

  const openDropdown = (menu, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpenMenu(openMenu === menu ? null : menu);

    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setTimeout(() => {
      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + menuRect.width > viewportWidth) {
          left = viewportWidth - menuRect.width - 10;
        }
        if (left < 0) left = 0;

        if (top + menuRect.height > window.scrollY + viewportHeight) {
          top = rect.top + window.scrollY - menuRect.height;
        }
        if (top < 0) top = 0;

        setMenuPosition({ top, left });
      }
    }, 0);
  };

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };

      // Apply changes to chart immediately
      if (chartInstanceRef.current) {
        switch (key) {
          case 'gridShow':
            chartInstanceRef.current.setStyles({
              grid: { show: newSettings.gridShow }
            });
            break;
          case 'crosshairShow':
            chartInstanceRef.current.setStyles({
              crosshair: { show: newSettings.crosshairShow }
            });
            break;
          case 'autoScale':
            // Toggle auto scale
            chartInstanceRef.current.getVisibleRange();
            break;
          case 'logScale':
            chartInstanceRef.current.setStyles({
              yAxis: { type: newSettings.logScale ? 'log' : 'normal' }
            });
            break;
          case 'animationEnabled':
            chartInstanceRef.current.setStyles({
              candle: { animation: newSettings.animationEnabled }
            });
            break;
        }
      }

      return newSettings;
    });
  };

  const changeSetting = (key, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };

      // Apply changes to chart immediately
      if (chartInstanceRef.current) {
        switch (key) {
          case 'theme':
            // Apply theme changes
            const isDark = value === 'dark';
            chartInstanceRef.current.setStyles({
              grid: {
                horizontal: { color: isDark ? '#333' : '#f0f0f0' },
                vertical: { color: isDark ? '#333' : '#f0f0f0' }
              },
              candle: {
                bar: {
                  upColor: isDark ? '#26a69a' : '#4CAF50',
                  downColor: isDark ? '#ef5350' : '#f44336'
                }
              }
            });
            break;
          case 'candleStyle':
            chartInstanceRef.current.setStyles({
              candle: { type: value }
            });
            break;
        }
      }

      return newSettings;
    });
  };

  const handlePatternRecognition = () => {
    if (chartInstanceRef.current) {
      const chartData = chartInstanceRef.current.getDataList();
      if (chartData && chartData.length > 0) {
        const patterns = applyCandlestickPatternRecognition(chartInstanceRef.current, chartData);
        console.log(`Applied ${patterns.length} candlestick patterns to chart`);
      }
    }
  };

  const handleChartPatternRecognition = () => {
    if (chartInstanceRef.current) {
      const chartData = chartInstanceRef.current.getDataList();
      if (chartData && chartData.length > 0) {
        const patterns = applyChartPatternRecognition(chartInstanceRef.current, chartData);
        console.log(`Applied ${patterns.length} chart patterns to chart`);
      }
    }
  };

  const handleHarmonicPatternRecognition = () => {
    if (chartInstanceRef.current) {
      const chartData = chartInstanceRef.current.getDataList();
      if (chartData && chartData.length > 0) {
        const patterns = applyHarmonicPatternRecognition(chartInstanceRef.current, chartData);
        console.log(`Applied ${patterns.length} harmonic patterns to chart`);
      }
    }
  };

  // Helper functions for pattern drawing
  const drawSequentialLine = (coordinates: any[], color: string, size = 2) => {
    if (!coordinates || coordinates.length < 2) return [] as any[];
    return [
      {
        type: "line",
        attrs: { coordinates },
        styles: { color, size, style: "solid" },
      },
    ];
  };

  const drawFillIfClosed = (coordinates: any[], color: string) => {
    if (!coordinates || coordinates.length < 3) return [] as any[];
    return [
      {
        type: "polygon",
        attrs: { coordinates },
        styles: { style: "stroke_fill", color: `${color}33`, borderColor: color, borderSize: 1 },
      },
    ];
  };

  // Register pattern overlays
  const registerPatternOverlays = () => {
    const registerPattern = (
      name: string,
      labels: string[],
      opts: { color: string; closeShape?: boolean }
    ) => {
      registerOverlay({
        name,
        totalStep: labels.length,
        needDefaultPointFigure: true,
        createPointFigures: ({ coordinates }) => {
          const figs: any[] = [];
          const n = coordinates.length;

          // Progressive line preview
          figs.push(...drawSequentialLine(coordinates, opts.color));

          // Optional fill (only when we already have 3+ points)
          if (opts.closeShape) {
            figs.push(...drawFillIfClosed(coordinates, opts.color));
          }

          // Labels for points collected so far
          for (let i = 0; i < n && i < labels.length; i++) {
            figs.push({
              type: "text",
              attrs: { x: coordinates[i].x, y: coordinates[i].y, text: labels[i] },
              styles: { color: opts.color, size: 12 },
            });
          }

          return figs;
        },
      });
    };

    // Generic patterns (progressive drawing)
    registerPattern("xabcdPattern", ["X", "A", "B", "C", "D"], { color: "#e11d48", closeShape: true });
    registerPattern("cypherPattern", ["X", "A", "B", "C", "D"], { color: "#f97316", closeShape: true });
    registerPattern("abcdPattern", ["A", "B", "C", "D"], { color: "#2563eb", closeShape: true });
    registerPattern("trianglePattern", ["A", "B", "C"], { color: "#16a34a", closeShape: true });
    registerPattern("threeDrives", ["1", "2", "3", "4"], { color: "#9333ea", closeShape: false });
    registerPattern("elliottWave", ["1", "2", "3", "4", "5"], { color: "#0ea5e9", closeShape: false });
    registerPattern("elliottImpulse", ["1", "2", "3", "4", "5"], { color: "#f43f5e", closeShape: false });
    registerPattern("elliottCorrection", ["A", "B", "C"], { color: "#0891b2", closeShape: false });

    // Head & Shoulders (progressive neckline + shoulders)
    registerOverlay({
      name: "headShoulders",
      totalStep: 5, // LS, H, RS, NL1, NL2
      needDefaultPointFigure: true,
      createPointFigures: ({ coordinates }) => {
        const figs: any[] = [];
        const n = coordinates.length;
        const color = "#854d0e";

        // Shoulders & head (first 3 points)
        if (n >= 2) {
          figs.push({ type: "line", attrs: { coordinates: coordinates.slice(0, Math.min(n, 3)) }, styles: { color, size: 2 } });
        }
        // Neckline when we have point 4 and/or 5
        if (n >= 4) {
          const nlEnd = n >= 5 ? coordinates[4] : coordinates[3];
          figs.push({ type: "line", attrs: { coordinates: [coordinates[3], nlEnd] }, styles: { color, size: 2 } });
        }
        // Labels for available points
        const labels = ["LS", "H", "RS", "NL1", "NL2"];
        for (let i = 0; i < n; i++) {
          figs.push({ type: "text", attrs: { x: coordinates[i].x, y: coordinates[i].y, text: labels[i] }, styles: { color } });
        }
        return figs;
      },
    });
  };

  const addIndicator = (indicatorName) => {
    const indicatorId = `${indicatorName}-${Date.now()}`;
    const newIndicator = {
      id: indicatorId,
      name: indicatorName,
      type: getIndicatorType(indicatorName)
    };

    // Add indicator to chart
    if (chartInstanceRef.current) {
      if (indicatorName === "Candlestick Pattern Recognition") {
        handlePatternRecognition();
        setAppliedIndicators(prev => [...prev, newIndicator]);
      } else if (indicatorName === "Chart Pattern Recognition") {
        handleChartPatternRecognition();
        setAppliedIndicators(prev => [...prev, newIndicator]);
      } else if (indicatorName === "Harmonic Pattern Recognition") {
        handleHarmonicPatternRecognition();
        setAppliedIndicators(prev => [...prev, newIndicator]);
      } else if (indicatorName === "SMA – Simple Moving Average") {
        // For SMA, create the component with unique ID
        const smaId = indicatorId;
        setSmaIndicators(prev => [...prev, {
          id: smaId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add SMA to appliedIndicators as it manages itself
      } else if (indicatorName === "EMA – Exponential Moving Average") {
        // For EMA, create the component with unique ID
        const emaId = indicatorId;
        setEmaIndicators(prev => [...prev, {
          id: emaId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add EMA to appliedIndicators as it manages itself
      } else if (indicatorName === "WMA – Weighted Moving Average") {
        // For WMA, create the component with unique ID
        const wmaId = indicatorId;
        setWmaIndicators(prev => [...prev, {
          id: wmaId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add WMA to appliedIndicators as it manages itself
      } else if (indicatorName === "Ichimoku Cloud") {
        // For Ichimoku Cloud, create the component with unique ID
        const ichimokuId = indicatorId;
        setIchimokuIndicators(prev => [...prev, {
          id: ichimokuId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Ichimoku to appliedIndicators as it manages itself
      } else if (indicatorName === "Supertrend") {
        // For Supertrend, create the component with unique ID
        const supertrendId = indicatorId;
        setSupertrendIndicators(prev => [...prev, {
          id: supertrendId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Supertrend to appliedIndicators as it manages itself
      } else if (indicatorName === "Parabolic SAR") {
        // For Parabolic SAR, create the component with unique ID
        const psarId = indicatorId;
        setPsarIndicators(prev => [...prev, {
          id: psarId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add PSAR to appliedIndicators as it manages itself
      } else if (indicatorName === "MACD – Moving Average Convergence Divergence") {
        // For MACD, create the component with unique ID
        const macdId = indicatorId;
        setMacdIndicators(prev => [...prev, {
          id: macdId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add MACD to appliedIndicators as it manages itself
      } else if (indicatorName === "ADX – Average Directional Index") {
        // For ADX, create the component with unique ID
        const adxId = indicatorId;
        setAdxIndicators(prev => [...prev, {
          id: adxId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add ADX to appliedIndicators as it manages itself
      } else if (indicatorName === "HMA – Hull Moving Average") {
        // For HMA, create the component with unique ID
        const hmaId = indicatorId;
        setHmaIndicators(prev => [...prev, {
          id: hmaId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add HMA to appliedIndicators as it manages itself
      } else if (indicatorName === "RSI – Relative Strength Index") {
        // For RSI, create the component with unique ID
        const rsiId = indicatorId;
        setRsiIndicators(prev => [...prev, {
          id: rsiId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add RSI to appliedIndicators as it manages itself
      } else if (indicatorName === "Stochastic Oscillator") {
        // For Stochastic, create the component with unique ID
        const stochasticId = indicatorId;
        setStochasticIndicators(prev => [...prev, {
          id: stochasticId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Stochastic to appliedIndicators as it manages itself
      } else if (indicatorName === "Stochastic RSI") {
        // For Stochastic RSI, create the component with unique ID
        const stochasticRsiId = indicatorId;
        setStochasticRsiIndicators(prev => [...prev, {
          id: stochasticRsiId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Stochastic RSI to appliedIndicators as it manages itself
      } else if (indicatorName === "CCI – Commodity Channel Index") {
        // For CCI, create the component with unique ID
        const cciId = indicatorId;
        setCciIndicators(prev => [...prev, {
          id: cciId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add CCI to appliedIndicators as it manages itself
      } else if (indicatorName === "Williams %R") {
        // For Williams %R, create the component with unique ID
        const williamsRId = indicatorId;
        setWilliamsRIndicators(prev => [...prev, {
          id: williamsRId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Williams %R to appliedIndicators as it manages itself
      } else if (indicatorName === "ROC – Rate of Change") {
        // For ROC, create the component with unique ID
        const rocId = indicatorId;
        setRocIndicators(prev => [...prev, {
          id: rocId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add ROC to appliedIndicators as it manages itself
      } else if (indicatorName === "Bollinger Bands") {
        // For Bollinger Bands, create the component with unique ID
        const bbId = indicatorId;
        setBollingerBandsIndicators(prev => [...prev, {
          id: bbId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Bollinger Bands to appliedIndicators as it manages itself
      } else if (indicatorName === "Keltner Channels") {
        // For Keltner Channels, create the component with unique ID
        const kcId = indicatorId;
        setKeltnerChannelIndicators(prev => [...prev, {
          id: kcId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Keltner Channels to appliedIndicators as it manages itself
      } else if (indicatorName === "Donchian Channels") {
        // For Donchian Channels, create the component with unique ID
        const dcId = indicatorId;
        setDonchianChannelIndicators(prev => [...prev, {
          id: dcId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        // Don't add Donchian Channels to appliedIndicators as it manages itself
      } else if (indicatorName === "ATR – Average True Range") {
        // For ATR, create the component with unique ID
        const atrId = indicatorId;
        setAtrIndicators(prev => [...prev, {
          id: atrId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        console.log(`Applied ATR – Average True Range to chart`);
        // Don't add ATR to appliedIndicators as it manages itself
      } else if (indicatorName === "Standard Deviation Channel") {
        // For Standard Deviation Channel, create the component with unique ID
        const sdcId = indicatorId;
        setStandardDeviationChannelIndicators(prev => [...prev, {
          id: sdcId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        console.log(`Applied Standard Deviation Channel to chart`);
        // Don't add Standard Deviation Channel to appliedIndicators as it manages itself
      } else if (indicatorName === "Volume Histogram") {
        // For Volume Histogram, create the component with unique ID
        const vhId = indicatorId;
        setVolumeHistogramIndicators(prev => [...prev, {
          id: vhId,
          chart: chartInstanceRef.current,
          name: indicatorName
        }]);
        console.log(`Applied Volume Histogram to chart`);
        // Don't add Volume Histogram to appliedIndicators as it manages itself
      } else {
        console.log(`Applied ${indicatorName} to chart`);
        setAppliedIndicators(prev => [...prev, newIndicator]);
      }
    }

    setOpenMenu(null);
  };

  const removeIndicator = (indicatorId) => {
    const indicator = appliedIndicators.find(ind => ind.id === indicatorId);
    if (indicator && chartInstanceRef.current) {
      // Remove overlays based on indicator type
      if (indicator.name === "Candlestick Pattern Recognition") {
        chartInstanceRef.current.removeOverlay({ name: "candlestick-pattern" });
      } else if (indicator.name === "Chart Pattern Recognition") {
        chartInstanceRef.current.removeOverlay({ name: "chart-patterns" });
      } else if (indicator.name === "Harmonic Pattern Recognition") {
        chartInstanceRef.current.removeOverlay({ name: "harmonic-pattern" });
      } else if (indicator.name === "SMA – Simple Moving Average") {
        // Remove SMA indicator - this will be handled by the SMAIndicator component
        setSmaIndicators(prev => prev.filter(sma => sma.id !== indicatorId));
      } else if (indicator.name === "EMA – Exponential Moving Average") {
        // Remove EMA indicator - this will be handled by the EMAIndicator component
        setEmaIndicators(prev => prev.filter(ema => ema.id !== indicatorId));
      } else if (indicator.name === "WMA – Weighted Moving Average") {
        // Remove WMA indicator - this will be handled by the WMAIndicator component
        setWmaIndicators(prev => prev.filter(wma => wma.id !== indicatorId));
      } else if (indicator.name === "Ichimoku Cloud") {
        // Remove Ichimoku indicator - this will be handled by the IchimokuIndicator component
        setIchimokuIndicators(prev => prev.filter(ichimoku => ichimoku.id !== indicatorId));
      } else if (indicator.name === "Supertrend") {
        // Remove Supertrend indicator - this will be handled by the SupertrendIndicator component
        setSupertrendIndicators(prev => prev.filter(supertrend => supertrend.id !== indicatorId));
      } else if (indicator.name === "Parabolic SAR") {
        // Remove PSAR indicator - this will be handled by the PSARIndicator component
        setPsarIndicators(prev => prev.filter(psar => psar.id !== indicatorId));
      } else if (indicator.name === "MACD – Moving Average Convergence Divergence") {
        // Remove MACD indicator - this will be handled by the MACDIndicator component
        setMacdIndicators(prev => prev.filter(macd => macd.id !== indicatorId));
      } else if (indicator.name === "ADX – Average Directional Index") {
        // Remove ADX indicator - this will be handled by the ADXIndicator component
        setAdxIndicators(prev => prev.filter(adx => adx.id !== indicatorId));
      } else if (indicator.name === "HMA – Hull Moving Average") {
        // Remove HMA indicator - this will be handled by the HMAIndicator component
        setHmaIndicators(prev => prev.filter(hma => hma.id !== indicatorId));
      } else if (indicator.name === "RSI – Relative Strength Index") {
        // Remove RSI indicator - this will be handled by the RSIIndicator component
        setRsiIndicators(prev => prev.filter(rsi => rsi.id !== indicatorId));
      } else if (indicator.name === "Stochastic Oscillator") {
        // Remove Stochastic indicator - this will be handled by the StochasticIndicator component
        setStochasticIndicators(prev => prev.filter(stochastic => stochastic.id !== indicatorId));
      } else if (indicator.name === "Stochastic RSI") {
        // Remove Stochastic RSI indicator - this will be handled by the StochasticRSIIndicator component
        setStochasticRsiIndicators(prev => prev.filter(stochasticRsi => stochasticRsi.id !== indicatorId));
      } else if (indicator.name === "CCI – Commodity Channel Index") {
        // Remove CCI indicator - this will be handled by the CCIIndicator component
        setCciIndicators(prev => prev.filter(cci => cci.id !== indicatorId));
      } else if (indicator.name === "Williams %R") {
        // Remove Williams %R indicator - this will be handled by the WilliamsRIndicator component
        setWilliamsRIndicators(prev => prev.filter(williamsR => williamsR.id !== indicatorId));
      } else if (indicator.name === "ROC – Rate of Change") {
        // Remove ROC indicator - this will be handled by the ROCIndicator component
        setRocIndicators(prev => prev.filter(roc => roc.id !== indicatorId));
      } else if (indicator.name === "Bollinger Bands") {
        // Remove Bollinger Bands indicator - this will be handled by the BollingerBandsIndicator component
        setBollingerBandsIndicators(prev => prev.filter(bb => bb.id !== indicatorId));
      } else if (indicator.name === "Keltner Channels") {
        // Remove Keltner Channels indicator - this will be handled by the KeltnerChannelIndicator component
        setKeltnerChannelIndicators(prev => prev.filter(kc => kc.id !== indicatorId));
      } else if (indicator.name === "Donchian Channels") {
        // Remove Donchian Channel indicator - this will be handled by the DonchianChannelIndicator component
        setDonchianChannelIndicators(prev => prev.filter(dc => dc.id !== indicatorId));
      } else if (indicator.name === "ATR – Average True Range") {
        // Remove ATR indicator - this will be handled by the ATRIndicator component
        setAtrIndicators(prev => prev.filter(atr => atr.id !== indicatorId));
      } else if (indicator.name === "Standard Deviation Channel") {
        // Remove Standard Deviation Channel indicator - this will be handled by the StandardDeviationChannelIndicator component
        setStandardDeviationChannelIndicators(prev => prev.filter(sdc => sdc.id !== indicatorId));
      } else if (indicator.name === "Volume Histogram") {
        // Remove Volume Histogram indicator - this will be handled by the VolumeHistogramIndicator component
        setVolumeHistogramIndicators(prev => prev.filter(vh => vh.id !== indicatorId));
      } else {
        // For other indicators, remove them by ID
        // chartInstanceRef.current.removeIndicator(indicatorId);
      }
    }

    setAppliedIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
  };

  const removeSmaIndicator = (smaId) => {
    setSmaIndicators(prev => prev.filter(sma => sma.id !== smaId));
    // SMA indicators are not in appliedIndicators, so no need to remove from there
  };

  const removeEmaIndicator = (emaId) => {
    setEmaIndicators(prev => prev.filter(ema => ema.id !== emaId));
    // EMA indicators are not in appliedIndicators, so no need to remove from there
  };

  const removeWmaIndicator = (wmaId) => {
    setWmaIndicators(prev => prev.filter(wma => wma.id !== wmaId));
    // WMA indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Ichimoku indicator
  const removeIchimokuIndicator = (ichimokuId) => {
    setIchimokuIndicators(prev => prev.filter(ichimoku => ichimoku.id !== ichimokuId));
    // Ichimoku indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Supertrend indicator
  const removeSupertrendIndicator = (supertrendId) => {
    setSupertrendIndicators(prev => prev.filter(supertrend => supertrend.id !== supertrendId));
    // Supertrend indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove PSAR indicator
  const removePsarIndicator = (psarId) => {
    setPsarIndicators(prev => prev.filter(psar => psar.id !== psarId));
    // PSAR indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove MACD indicator
  const removeMacdIndicator = (macdId) => {
    setMacdIndicators(prev => prev.filter(macd => macd.id !== macdId));
    // MACD indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove ADX indicator
  const removeAdxIndicator = (adxId) => {
    setAdxIndicators(prev => prev.filter(adx => adx.id !== adxId));
    // ADX indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove HMA indicator
  const removeHmaIndicator = (hmaId) => {
    setHmaIndicators(prev => prev.filter(hma => hma.id !== hmaId));
    // HMA indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove RSI indicator
  const removeRsiIndicator = (rsiId) => {
    setRsiIndicators(prev => prev.filter(rsi => rsi.id !== rsiId));
    // RSI indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Stochastic indicator
  const removeStochasticIndicator = (stochasticId) => {
    setStochasticIndicators(prev => prev.filter(stochastic => stochastic.id !== stochasticId));
    // Stochastic indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Stochastic RSI indicator
  const removeStochasticRsiIndicator = (stochasticRsiId) => {
    setStochasticRsiIndicators(prev => prev.filter(stochasticRsi => stochasticRsi.id !== stochasticRsiId));
    // Stochastic RSI indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove CCI indicator
  const removeCciIndicator = (cciId) => {
    setCciIndicators(prev => prev.filter(cci => cci.id !== cciId));
    // CCI indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Williams %R indicator
  const removeWilliamsRIndicator = (williamsRId) => {
    setWilliamsRIndicators(prev => prev.filter(williamsR => williamsR.id !== williamsRId));
    // Williams %R indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove ROC indicator
  const removeRocIndicator = (rocId) => {
    setRocIndicators(prev => prev.filter(roc => roc.id !== rocId));
    // ROC indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Bollinger Bands indicator
  const removeBollingerBandsIndicator = (bbId) => {
    setBollingerBandsIndicators(prev => prev.filter(bb => bb.id !== bbId));
    // Bollinger Bands indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Keltner Channel indicator
  const removeKeltnerChannelIndicator = (kcId) => {
    setKeltnerChannelIndicators(prev => prev.filter(kc => kc.id !== kcId));
    // Keltner Channel indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Donchian Channel indicator
  const removeDonchianChannelIndicator = (dcId) => {
    setDonchianChannelIndicators(prev => prev.filter(dc => dc.id !== dcId));
    // Donchian Channel indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove ATR indicator
  const removeAtrIndicator = (atrId) => {
    setAtrIndicators(prev => prev.filter(atr => atr.id !== atrId));
    // ATR indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Standard Deviation Channel indicator
  const removeStandardDeviationChannelIndicator = (sdcId) => {
    setStandardDeviationChannelIndicators(prev => prev.filter(sdc => sdc.id !== sdcId));
    // Standard Deviation Channel indicators are not in appliedIndicators, so no need to remove from there
  };

  // Function to remove Volume Histogram indicator
  const removeVolumeHistogramIndicator = (vhId) => {
    setVolumeHistogramIndicators(prev => prev.filter(vh => vh.id !== vhId));
    // Volume Histogram indicators are not in appliedIndicators, so no need to remove from there
  };


  const getIndicatorType = (indicatorName) => {
    // Map indicator names to types for categorization
    const patternIndicators = ["Candlestick Pattern Recognition", "Chart Pattern Recognition", "Harmonic Pattern Recognition"];
    const trendIndicators = ["SMA – Simple Moving Average", "EMA – Exponential Moving Average", "WMA – Weighted Moving Average", "MACD – Moving Average Convergence Divergence", "Ichimoku Cloud", "Supertrend", "Parabolic SAR", "ADX – Average Directional Index", "HMA – Hull Moving Average"];
    const momentumIndicators = ["RSI – Relative Strength Index", "Stochastic Oscillator", "Stochastic RSI", "CCI – Commodity Channel Index", "Williams %R", "ROC – Rate of Change"];
    const volatilityIndicators = ["Bollinger Bands", "Keltner Channels", "ATR – Average True Range", "Donchian Channels", "Standard Deviation Channel"];
    const volumeIndicators = ["Volume Histogram"];

    if (patternIndicators.includes(indicatorName)) return "pattern";
    if (trendIndicators.includes(indicatorName)) return "trend";
    if (momentumIndicators.includes(indicatorName)) return "momentum";
    if (volatilityIndicators.includes(indicatorName)) return "volatility";
    if (volumeIndicators.includes(indicatorName)) return "volume";
    return "other";
  };

  // Drawing tool functions - Interactive drawing
  const createDrawingTool = (toolName, overlayName, defaultStyles = {}) => {
    if (chartInstanceRef.current) {
      const styles = {
        ...defaultStyles,
        line: { 
          color: drawingSettings.color, 
          size: drawingSettings.thickness,
          ...defaultStyles.line 
        },
        text: {
          color: drawingSettings.color,
          size: 11,
          family: 'Arial, sans-serif',
          ...defaultStyles.text
        }
      };
      
      // Create overlay and listen for when it's actually placed
      const overlay = chartInstanceRef.current.createOverlay({
        name: overlayName,
        styles: styles,
        onDrawEnd: () => {
          // Drawing is finished, but don't show settings automatically
          // Settings will only show when user clicks on an existing drawing
          console.log(`${toolName} drawing completed`);
        },
        onSelected: () => {
          // This is called when user clicks on an existing drawing
          setActiveDrawingTool(toolName);
          setHasActiveDrawing(true);
          setShowDrawingSettings(false); // Don't auto-open, wait for settings button click
        },
        onDeselected: () => {
          // Hide settings when drawing is deselected
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      
      // Reset states when creating new drawing
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
      setShowDrawingSettings(false);
    }
    setShowSubmenu(false);
    setShowFibSubmenu(false);
    setShowPatternSubmenu(false);
    setShowProjectionSubmenu(false);
    setShowBrushesSubmenu(false);
    setShowPositionSubmenu(false);
    setShowShapesSubmenu(false);
  };

  const drawTrendline = () => {
    createDrawingTool('Trend Line', 'segment');
  };

  const drawRay = () => {
    createDrawingTool('Ray', 'rayLine');
  };

  const drawInfoLine = () => {
    createDrawingTool('Info Line', 'priceLine', {
      line: { style: 'dashed' }
    });
  };

  const drawTrendAngle = () => {
    createDrawingTool('Trend Angle', 'trendAngle');
  };

  const drawHorizontalLine = () => {
    createDrawingTool('Horizontal Line', 'horizontalStraightLine');
  };

  const drawHorizontalRay = () => {
    createDrawingTool('Horizontal Ray', 'horizontalRayLine');
  };

  const drawExtendedLine = () => {
    createDrawingTool('Extended Line', 'straightLine');
  };

  const drawVerticalLine = () => {
    createDrawingTool('Vertical Line', 'verticalStraightLine');
  };

  const drawCrossLine = () => {
    createDrawingTool('Cross Line', 'crossLine');
  };

  const drawParallelChannel = () => {
    createDrawingTool('Parallel Channel', 'parallelStraightLine');
  };

  const drawPriceChannel = () => {
    createDrawingTool('Price Channel', 'priceChannelLine');
  };

  const drawFibRetracement = () => {
    if (chartInstanceRef.current) {
      console.log('Creating Fib Retracement overlay...');
      try {
        chartInstanceRef.current.createOverlay({
          name: 'fibonacciLine',
          needDefaultPointFigure: true,
          styles: {
            line: { color: drawingSettings.color, size: drawingSettings.thickness, style: 'solid' },
            text: { color: drawingSettings.color, size: 11, family: 'Arial, sans-serif' }
          },
          onDrawEnd: () => {
            console.log('Fib Retracement drawing completed');
          },
          onSelected: () => {
            setActiveDrawingTool('Fib Retracement');
            setHasActiveDrawing(true);
            setShowDrawingSettings(false);
          },
          onDeselected: () => {
            setActiveDrawingTool(null);
            setHasActiveDrawing(false);
            setShowDrawingSettings(false);
          }
        });
        setActiveDrawingTool(null);
        setHasActiveDrawing(false);
        setShowDrawingSettings(false);
        console.log('Fib Retracement overlay created successfully');
      } catch (error) {
        console.error('Error creating Fib Retracement overlay:', error);
      }
    }
    setShowFibSubmenu(false);
  };

  const drawFibChannel = () => {
    createDrawingTool('Fib Channel', 'fibChannel');
  };

  const drawFibWedge = () => {
    createDrawingTool('Fib Wedge', 'fibWedge');
  };

  const drawFibSpiral = () => {
    createDrawingTool('Fib Spiral', 'fibSpiral');
  };

  // Pattern drawing functions
  const drawXABCDPattern = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'xabcdPattern',
        onDrawEnd: () => {
          console.log('XABCD Pattern drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('XABCD Pattern');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawCypherPattern = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'cypherPattern',
        onDrawEnd: () => {
          console.log('Cypher Pattern drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Cypher Pattern');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawHeadAndShoulders = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'headShoulders',
        onDrawEnd: () => {
          console.log('Head and Shoulders drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Head and Shoulders');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawABCDPattern = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'abcdPattern',
        onDrawEnd: () => {
          console.log('ABCD Pattern drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('ABCD Pattern');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawTrianglePattern = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'trianglePattern',
        onDrawEnd: () => {
          console.log('Triangle Pattern drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Triangle Pattern');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawThreeDrivesPattern = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'threeDrives',
        onDrawEnd: () => {
          console.log('Three Drives Pattern drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Three Drives Pattern');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawElliottImpulseWave = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'elliottImpulse',
        onDrawEnd: () => {
          console.log('Elliott Impulse Wave drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Elliott Impulse Wave');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  const drawElliottCorrectionWave = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'elliottCorrection',
        onDrawEnd: () => {
          console.log('Elliott Correction Wave drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Elliott Correction Wave');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPatternSubmenu(false);
  };

  // Position drawing functions
  const drawLongPosition = () => {
    if (chartInstanceRef.current) {
      const data = chartInstanceRef.current.getDataList();
      const last = data[data.length - 1];
      if (!last) return;
      
      chartInstanceRef.current.createOverlay({
        name: 'position',
        extendData: { side: 'long' },
        points: [
          { timestamp: last.timestamp, value: last.close },
          { timestamp: last.timestamp, value: last.close * 0.98 }, // Stop Loss below entry
          { timestamp: last.timestamp, value: last.close * 1.05 }, // Take Profit above entry
        ],
        onDrawEnd: () => {
          console.log('Long Position drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Long Position');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPositionSubmenu(false);
  };

  const drawShortPosition = () => {
    if (chartInstanceRef.current) {
      const data = chartInstanceRef.current.getDataList();
      const last = data[data.length - 1];
      if (!last) return;
      
      chartInstanceRef.current.createOverlay({
        name: 'position',
        extendData: { side: 'short' },
        points: [
          { timestamp: last.timestamp, value: last.close },
          { timestamp: last.timestamp, value: last.close * 1.02 }, // Stop Loss above entry
          { timestamp: last.timestamp, value: last.close * 0.95 }, // Take Profit below entry
        ],
        onDrawEnd: () => {
          console.log('Short Position drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Short Position');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowPositionSubmenu(false);
  };

  // Shape drawing functions
  const drawRectangle = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'rectangle',
        styles: {
          point: { show: true, activeSize: 6, inactiveSize: 4 },
          polygon: { style: 'stroke_fill', color: `${drawingSettings.color}33`, borderColor: drawingSettings.color, borderSize: drawingSettings.thickness }
        },
        onDrawEnd: () => {
          console.log('Rectangle drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Rectangle');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowShapesSubmenu(false);
  };

  const drawRotatedRectangle = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'rotatedRectangle',
        styles: {
          point: { show: true, activeSize: 6, inactiveSize: 4 },
          polygon: { style: 'stroke_fill', color: `${drawingSettings.color}33`, borderColor: drawingSettings.color, borderSize: drawingSettings.thickness }
        },
        onDrawEnd: () => {
          console.log('Rotated Rectangle drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Rotated Rectangle');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowShapesSubmenu(false);
  };

  const drawCircle = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'circle',
        styles: {
          point: { show: true, activeSize: 6, inactiveSize: 4 },
          circle: { style: 'stroke_fill', color: `${drawingSettings.color}33`, borderColor: drawingSettings.color, borderSize: drawingSettings.thickness }
        },
        onDrawEnd: () => {
          console.log('Circle drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Circle');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowShapesSubmenu(false);
  };

  const drawTriangle = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.createOverlay({
        name: 'triangle',
        styles: {
          point: { show: true, activeSize: 6, inactiveSize: 4 },
          polygon: { style: 'stroke_fill', color: `${drawingSettings.color}33`, borderColor: drawingSettings.color, borderSize: drawingSettings.thickness }
        },
        onDrawEnd: () => {
          console.log('Triangle drawing completed');
        },
        onSelected: () => {
          setActiveDrawingTool('Triangle');
          setHasActiveDrawing(true);
        },
        onDeselected: () => {
          setActiveDrawingTool(null);
          setHasActiveDrawing(false);
          setShowDrawingSettings(false);
        }
      });
      setActiveDrawingTool(null);
      setHasActiveDrawing(false);
    }
    setShowShapesSubmenu(false);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
    if (chartInstanceRef.current) {
      let klineType;
      switch (type) {
        case "Candle Solid":
          klineType = "candle_solid";
          break;
        case "Candle Stroke":
          klineType = "candle_stroke";
          break;
        case "Candle Up Stroke":
          klineType = "candle_up_stroke";
          break;
        case "Candle Down Stroke":
          klineType = "candle_down_stroke";
          break;
        case "OHLC":
          klineType = "ohlc";
          break;
        case "Area":
          klineType = "area";
          break;
        default:
          klineType = "candle_solid";
      }

      chartInstanceRef.current.setStyles({
        candle: {
          type: klineType,
          tooltip: {
            showRule: 'none'
          }
        }
      });
    }
    setOpenMenu(null);
  };

  return (
    <div style={styles.container}>
      {/* Top toolbar */}
      <div style={styles.topScroll} ref={toolbarRef}>
        <div style={styles.scrollRow}>
          <div className="toolbar-btn" style={styles.testBox}>
            <i className="fa-solid fa-magnifying-glass"></i> Symbol
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("timeframe", e)}
          >
            <i className="fa-solid fa-hourglass"></i>&nbsp; Timeframe
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("charttype", e)}
          >
            <i className="fa-solid fa-chart-column"></i>&nbsp; Chart Type
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("indicator", e)}
          >
            <i className="fa-solid fa-chart-simple"></i>&nbsp; Indicator
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("ai", e)}
          >
            <i className="fa-solid fa-hexagon-nodes-bolt"></i>&nbsp; AI
          </div>

          <div style={styles.testBox}>
            <input
              type="checkbox"
              checked={oiData}
              onChange={() => setOiData(!oiData)}
              style={{ marginRight: "5px" }}
            />
            <i className="fa-solid fa-database"></i>&nbsp; OI Data
          </div>

          <div
            className="toolbar-btn"
            style={styles.testBox}
            onClick={(e) => openDropdown("settings", e)}
          >
            <i className="fa-solid fa-gear"></i>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {openMenu && (
        <div
          ref={menuRef}
          className="popup-menu"
          style={{
            ...styles.popup,
            position: "absolute",
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <div style={styles.popupContent}>
            {openMenu === "timeframe" &&
              [
                "1m",
                "2m",
                "3m",
                "4m",
                "5m",
                "10m",
                "15m",
                "30m",
                "1h",
                "2h",
                "4h",
                "1d",
              ].map((tf) => (
                <div key={tf} style={styles.dropdownItem}>
                  {tf}
                </div>
              ))}

            {openMenu === "charttype" &&
              [
                "Candle Solid",
                "Candle Stroke",
                "Candle Up Stroke",
                "Candle Down Stroke",
                "OHLC",
                "Area",
              ].map((type) => (
                <div
                  key={type}
                  style={{
                    ...styles.dropdownItem,
                    backgroundColor: chartType === type ? "#e3f2fd" : "transparent"
                  }}
                  onClick={() => handleChartTypeChange(type)}
                >
                  {type} {chartType === type && "✓"}
                </div>
              ))}

            {openMenu === "indicator" && (
              <>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Candlestick Pattern Recognition")}>
                  <strong>Pattern Recognition</strong>
                  Candlestick Pattern Recognition
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Chart Pattern Recognition")}>
                  Chart Pattern Recognition
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Harmonic Pattern Recognition")}>
                  Harmonic Pattern Recognition
                </div>
                <strong>Trend</strong>
                <div style={styles.dropdownItem} onClick={() => addIndicator("SMA – Simple Moving Average")}>
                  SMA – Simple Moving Average
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("EMA – Exponential Moving Average")}>
                  EMA – Exponential Moving Average
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("WMA – Weighted Moving Average")}>
                  WMA – Weighted Moving Average
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("MACD – Moving Average Convergence Divergence")}>
                  MACD – Moving Average Convergence Divergence
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Ichimoku Cloud")}>
                  Ichimoku Cloud
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Supertrend")}>
                  Supertrend
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Parabolic SAR")}>
                  Parabolic SAR
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("ADX – Average Directional Index")}>
                  ADX – Average Directional Index
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("HMA – Hull Moving Average")}>
                  HMA – Hull Moving Average
                </div>
                <strong>Momentum</strong>
                <div style={styles.dropdownItem} onClick={() => addIndicator("RSI – Relative Strength Index")}>
                  RSI – Relative Strength Index
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Stochastic Oscillator")}>
                  Stochastic Oscillator
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Stochastic RSI")}>
                  Stochastic RSI
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("CCI – Commodity Channel Index")}>
                  CCI – Commodity Channel Index
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Williams %R")}>
                  Williams %R
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("ROC – Rate of Change")}>
                  ROC – Rate of Change
                </div>
                <strong>Volatility</strong>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Bollinger Bands")}>
                  Bollinger Bands
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Keltner Channels")}>
                  Keltner Channels
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Donchian Channels")}>
                  Donchian Channels
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("ATR – Average True Range")}>
                  ATR – Average True Range
                </div>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Standard Deviation Channel")}>
                  Standard Deviation Channel
                </div>
                <strong>Volume</strong>
                <div style={styles.dropdownItem} onClick={() => addIndicator("Volume Histogram")}>
                  Volume Histogram
                </div>
              </>
            )}

            {openMenu === "ai" && (
              <>
                <div style={styles.dropdownItem}>Auto Analysis</div>
                <div style={styles.dropdownItem}>Chat</div>
              </>
            )}

            {openMenu === "settings" && (
              <>
                <div style={styles.settingsSection}>
                  <div style={styles.sectionHeader}>Price Display</div>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.lastPrice}
                      onChange={() => toggleSetting('lastPrice')}
                    />
                    Show Last Price
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.highPrice}
                      onChange={() => toggleSetting('highPrice')}
                    />
                    Show High Price
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.lowPrice}
                      onChange={() => toggleSetting('lowPrice')}
                    />
                    Show Low Price
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.openPrice}
                      onChange={() => toggleSetting('openPrice')}
                    />
                    Show Open Price
                  </label>
                </div>

                <div style={styles.settingsSection}>
                  <div style={styles.sectionHeader}>Chart Display</div>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.gridShow}
                      onChange={() => toggleSetting('gridShow')}
                    />
                    Show Grid
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.crosshairShow}
                      onChange={() => toggleSetting('crosshairShow')}
                    />
                    Show Crosshair
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.volumeShow}
                      onChange={() => toggleSetting('volumeShow')}
                    />
                    Show Volume
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.reverseCoord}
                      onChange={() => toggleSetting('reverseCoord')}
                    />
                    Reverse Y-Axis
                  </label>
                </div>

                <div style={styles.settingsSection}>
                  <div style={styles.sectionHeader}>Chart Appearance</div>
                  <div style={styles.selectItem}>
                    <label>Theme:</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => changeSetting('theme', e.target.value)}
                      style={styles.selectInput}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div style={styles.selectItem}>
                    <label>Candle Style:</label>
                    <select
                      value={settings.candleStyle}
                      onChange={(e) => changeSetting('candleStyle', e.target.value)}
                      style={styles.selectInput}
                    >
                      <option value="candle_solid">Solid Candles</option>
                      <option value="candle_stroke">Stroke Candles</option>
                      <option value="candle_up_stroke">Up Stroke Only</option>
                      <option value="candle_down_stroke">Down Stroke Only</option>
                      <option value="ohlc">OHLC Bars</option>
                      <option value="area">Area Chart</option>
                    </select>
                  </div>
                </div>

                <div style={styles.settingsSection}>
                  <div style={styles.sectionHeader}>Technical Analysis</div>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.autoScale}
                      onChange={() => toggleSetting('autoScale')}
                    />
                    Auto Scale
                  </label>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.logScale}
                      onChange={() => toggleSetting('logScale')}
                    />
                    Logarithmic Scale
                  </label>
                </div>

                <div style={styles.settingsSection}>
                  <div style={styles.sectionHeader}>Performance</div>
                  <label style={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={settings.animationEnabled}
                      onChange={() => toggleSetting('animationEnabled')}
                    />
                    Enable Animations
                  </label>
                </div>

                <div style={styles.settingsSection}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.resetButton}
                      onClick={() => {
                        setSettings({
                          lastPrice: true,
                          highPrice: true,
                          lowPrice: true,
                          openPrice: false,
                          gridShow: true,
                          crosshairShow: true,
                          volumeShow: true,
                          reverseCoord: false,
                          candleStyle: 'candle_solid',
                          theme: 'light',
                          autoScale: true,
                          logScale: false,
                          animationEnabled: true,
                        });
                        setOpenMenu(null);
                      }}
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main area */}
      <div style={styles.mainArea}>
        <div style={styles.leftColumn}>
          {/* First tool icon */}
          <div style={styles.numberBox}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor">
                <path d="M18 15h8v-1h-8z"></path>
                <path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"></path>
              </g>
            </svg>
          </div>

          {/* Second tool icon - Trend Line */}
          <div
            className="submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowSubmenu(!showSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
          </div>

          {/* Fibonacci tool */}
          <div
            className="fib-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowFibSubmenu(!showFibSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M3 5h22v-1h-22z"></path>
                <path d="M3 17h22v-1h-22z"></path>
                <path d="M3 11h19.5v-1h-19.5z"></path>
                <path d="M5.5 23h19.5v-1h-19.5z"></path>
                <path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
          </div>

          {/* Pattern tool */}
          <div
            className="pattern-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowPatternSubmenu(!showPatternSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                <path d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
              </g>
            </svg>
          </div>

          

          {/* Brushes tool */}
          

          {/* Position tool */}
          <div
            className="position-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowPositionSubmenu(!showPositionSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor">
                <path d="M4 8h20v2H4zM4 18h20v2H4z"></path>
                <path d="M14 4v20h-2V4z"></path>
                <path d="M8 12l4-4 4 4-1.4 1.4L14 12.8V16h-2v-3.2l-.6.6z"></path>
                <circle cx="7" cy="7" r="2"></circle>
                <circle cx="21" cy="21" r="2"></circle>
              </g>
            </svg>
          </div>

          {/* Shapes tool */}
          <div
            className="shapes-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowShapesSubmenu(!showShapesSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M7.5 6h13v-1h-13z"></path>
                <path d="M7.5 23h13v-1h-13z"></path>
                <path d="M5 7.5v13h1v-13z"></path>
                <path d="M22 7.5v13h1v-13z"></path>
                <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
              </g>
            </svg>
          </div>

          

          {/* Settings tool */}
          {activeDrawingTool && hasActiveDrawing && (
            <div
              className="drawing-settings-trigger"
              style={{
                ...styles.numberBox,
                backgroundColor: showDrawingSettings ? '#e3f2fd' : '#fafafa'
              }}
              onClick={() => setShowDrawingSettings(!showDrawingSettings)}
            >
              <i className="fa-solid fa-gear"></i>
            </div>
          )}
        </div>

        {/* Submenu - positioned absolutely to not affect layout */}
        {showSubmenu && (
          <div ref={submenuRef} style={styles.submenu}>
            <div style={styles.submenuSectionHeader}>Lines</div>

            {/* Trend Line */}
            <div style={styles.submenuItem} onClick={drawTrendline}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend Line</span>
            </div>

            {/* Ray */}
            <div style={styles.submenuItem} onClick={drawRay}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8.354 20.354l5-5-.707-.707-5 5z"></path>
                  <path d="M16.354 12.354l8-8-.707-.707-8 8z"></path>
                  <path d="M14.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM6.5 23c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Ray</span>
            </div>

            {/* Info Line */}
            <div style={styles.submenuItem} onClick={drawInfoLine}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Info Line</span>
            </div>

            {/* Trend Angle */}
            <div style={styles.submenuItem} onClick={drawTrendAngle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend Angle</span>
            </div>

            {/* Horizontal Line */}
            <div style={styles.submenuItem} onClick={drawHorizontalLine}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 15h8.5v-1h-8.5zM16.5 15h8.5v-1h-8.5z"></path>
                  <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Horizontal Line</span>
            </div>

            {/* Horizontal Ray */}
            <div style={styles.submenuItem} onClick={drawHorizontalRay}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8.5 15h16.5v-1h-16.5z"></path>
                  <path d="M6.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Horizontal Ray</span>
            </div>

            {/* Extended Line */}
            <div style={styles.submenuItem} onClick={drawExtendedLine}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Extended Line</span>
            </div>

            {/* Vertical Line */}
            <div style={styles.submenuItem} onClick={drawVerticalLine}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M14 3v8h1v-8zM14 18v8h1v-8z"></path>
                  <path d="M14.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Vertical Line</span>
            </div>

            {/* Cross Line */}
            <div style={styles.submenuItem} onClick={drawCrossLine}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path d="M18 15h8v-1h-8z"></path>
                  <path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Cross Line</span>
            </div>

            {/* Parallel Channel */}
            <div style={styles.submenuItem} onClick={drawParallelChannel}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.551 17.98l13.284-7.033-.468-.884-13.284 7.033z"></path>
                  <path d="M6 11.801l16-8.471v4.17h1v-5.83l-18 9.529v5.301h1z"></path>
                  <path d="M6 24.67v-4.17h-1v5.83l18-9.529v-5.301h-1v4.699z"></path>
                  <path d="M5.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Parallel Channel</span>
            </div>

            {/* Price Channel */}
            <div style={styles.submenuItem} onClick={drawPriceChannel}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.551 17.98l13.284-7.033-.468-.884-13.284 7.033z"></path>
                  <path d="M6 11.801l16-8.471v4.17h1v-5.83l-18 9.529v5.301h1z"></path>
                  <path d="M6 24.67v-4.17h-1v5.83l18-9.529v-5.301h-1v4.699z"></path>
                  <path d="M5.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Price Channel</span>
            </div>
          </div>
        )}

        {showFibSubmenu && (
          <div ref={fibSubmenuRef} style={styles.fibSubmenu}>
            {/* Fib Retracement */}
            <div style={styles.submenuItem} onClick={drawFibRetracement}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M3 5h22v-1h-22z"></path>
                  <path d="M3 17h22v-1h-22z"></path>
                  <path d="M3 11h19.5v-1h-19.5z"></path>
                  <path d="M5.5 23h19.5v-1h-19.5z"></path>
                  <path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Retracement</span>
            </div>

            
          </div>
        )}

        {showPatternSubmenu && (
          <div ref={patternSubmenuRef} style={styles.patternSubmenu}>
            {/* XABCD Pattern */}
            <div style={styles.submenuItem} onClick={drawXABCDPattern}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                  <path d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>XABCD Pattern</span>
            </div>

            {/* Cypher Pattern */}
            <div style={styles.submenuItem} onClick={drawCypherPattern}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path d="M15.246 21.895l1.121.355c-.172.625-.458 1.089-.857 1.393-.4.303-.907.455-1.521.455-.76 0-1.385-.26-1.875-.779-.49-.52-.734-1.23-.734-2.131 0-.953.246-1.693.738-2.221.492-.527 1.139-.791 1.941-.791.701 0 1.27.207 1.707.621.26.245.456.596.586 1.055l-1.145.273c-.068-.297-.209-.531-.424-.703-.215-.172-.476-.258-.783-.258-.424 0-.769.152-1.033.457-.264.305-.396.798-.396 1.48 0 .724.13 1.24.391 1.547.26.307.599.461 1.016.461.307 0 .572-.098.793-.293.221-.195.38-.503.477-.922z"></path>
                  <path fillRule="nonzero" d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                  <path fillRule="nonzero" d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Cypher Pattern</span>
            </div>

            {/* Head and Shoulders */}
            <div style={styles.submenuItem} onClick={drawHeadAndShoulders}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4.436 21.667l2.083-9.027-.974-.225-2.083 9.027zM10.046 16.474l-2.231-4.463-.894.447 2.231 4.463zM13.461 6.318l-2.88 10.079.962.275 2.88-10.079zM18.434 16.451l-2.921-10.224-.962.275 2.921 10.224zM21.147 12.089l-2.203 4.405.894.447 2.203-4.405zM25.524 21.383l-2.09-9.055-.974.225 2.09 9.055z"></path>
                  <path d="M1 19h7.5v-1h-7.5z"></path>
                  <path d="M12.5 19h4v-1h-4z"></path>
                  <path d="M20.5 19h6.5v-1h-6.5z"></path>
                  <path d="M6.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Head and Shoulders</span>
            </div>

            {/* ABCD Pattern */}
            <div style={styles.submenuItem} onClick={drawABCDPattern}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M21.487 5.248l-12.019 1.502.124.992 12.019-1.502zM6.619 9.355l-2.217 11.083.981.196 2.217-11.083zM6.534 22.75l12.071-1.509-.124-.992-12.071 1.509zM21.387 18.612l2.21-11.048-.981-.196-2.21 11.048zM8.507 9.214l10.255 10.255.707-.707-10.255-10.255z"></path>
                  <path d="M7.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>ABCD Pattern</span>
            </div>

            {/* Triangle Pattern */}
            <div style={styles.submenuItem} onClick={drawTrianglePattern}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M9.457 18.844l-5.371 2.4.408.913 5.371-2.4z"></path>
                  <path d="M13.13 17.203l.408.913 13.688-6.116-6.736-3.01-.408.913 4.692 2.097z"></path>
                  <path d="M11.077 5.88l5.34 2.386.408-.913-5.34-2.386z"></path>
                  <path d="M7.401 4.237l.408-.913-5.809-2.595v19.771h1v-18.229z"></path>
                  <path d="M3.708 20.772l5.51-14.169-.932-.362-5.51 14.169zM9.265 6.39l1.46 10.218.99-.141-1.46-10.218zM13.059 17.145l4.743-6.775-.819-.573-4.743 6.775z"></path>
                  <path d="M9.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 10c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM2.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Triangle Pattern</span>
            </div>

            {/* Three Drives Pattern */}
            <div style={styles.submenuItem} onClick={drawThreeDrivesPattern}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M.303 17.674l1.104.473.394-.919-1.104-.473z"></path>
                  <path d="M5.133 19.744l3.335 1.429.394-.919-3.335-1.429z"></path>
                  <path d="M12.134 22.744l3.352 1.436.394-.919-3.352-1.436z"></path>
                  <path d="M19.203 25.774l1.6.686.394-.919-1.6-.686z"></path>
                  <path d="M.3 4.673l1.13.484.394-.919-1.13-.484-.394.919zm.394-.919l1.13.484-.394.919-1.13-.484.394-.919zm.394-.919l1.13.484-.394.919-1.13-.484.394-.919z"></path>
                  <path d="M5.141 6.747l3.325 1.425.394-.919-3.325-1.425z"></path>
                  <path d="M12.133 9.744l3.353 1.437.394-.919-3.353-1.437z"></path>
                  <path d="M19.221 12.782l5.838 2.502.394-.919-5.838-2.502z"></path>
                  <path d="M3 7.473v8.969h1v-8.969zM8.93 9.871l-4.616 6.594.819.573 4.616-6.594zM11 19.5v-9h-1v9zM15.898 12.916l-4.616 6.594.819.573 4.616-6.594zM18 22.5v-9h-1v9zM24.313 5.212l-6.57 17.247.934.356 6.57-17.247z"></path>
                  <path d="M3.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 23c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 13c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 26c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM10.5 10c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Three Drives Pattern</span>
            </div>

            {/* Elliott Impulse Wave */}
            <div style={styles.submenuItem} onClick={drawElliottImpulseWave}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M5.238 18.469l4.17-4.17-.707-.707-4.17 4.17zM16.47 17.763l-.707.707-4.265-4.265.707-.707zM22.747 13.546l-4.192 4.192.707.707 4.192-4.192z"></path>
                  <path fillRule="nonzero" d="M10.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path d="M11.148 7h-1.098v-4.137c-.401.375-.874.652-1.418.832v-.996c.286-.094.598-.271.934-.533.336-.262.566-.567.691-.916h.891v5.75z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Elliott Impulse Wave</span>
            </div>

            {/* Elliott Correction Wave */}
            <div style={styles.submenuItem} onClick={drawElliottCorrectionWave}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M5.238 18.469l4.17-4.17-.707-.707-4.17 4.17zM16.47 17.763l-.707.707-4.265-4.265.707-.707zM22.747 13.546l-4.192 4.192.707.707 4.192-4.192z"></path>
                  <path fillRule="nonzero" d="M10.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM17.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path d="M13.746 7h-1.258l-.5-1.301h-2.289l-.473 1.301h-1.227l2.23-5.727h1.223l2.293 5.727z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Elliott Correction Wave</span>
            </div>
          </div>
        )}

        {showProjectionSubmenu && (
          <div ref={projectionSubmenuRef} style={styles.projectionSubmenu}>
            {/* Long Position */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18-6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path>
              </svg>
              <span style={styles.submenuText}>Long Position</span>
            </div>

            {/* Short Position */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 24a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 22.5a2.5 2.5 0 0 0 4.95.5H24v-1H6.95a2.5 2.5 0 0 0-4.95.5zM4.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 12.5a2.5 2.5 0 0 0 4.95.5h13.1a2.5 2.5 0 1 0 0-1H6.95a2.5 2.5 0 0 0-4.95.5zM22.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-18-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 6.5a2.5 2.5 0 0 0 4.95.5H24V6H6.95a2.5 2.5 0 0 0-4.95.5z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 20.06l-1.39-.63-.41.91 1.39.63.41-.91zm-4-1.8l-1.39-.63-.41.91 1.39.63.41-.91zm-4-1.8l-1.4-.63-.4.91 1.39.63.41-.91zm-4-1.8L9 14.03l-.4.91 1.39.63.41-.91z"></path>
              </svg>
              <span style={styles.submenuText}>Short Position</span>
            </div>

            
          </div>
        )}

        {showBrushesSubmenu && (
          <div ref={brushesSubmenuRef} style={styles.brushesSubmenu}>
            
          </div>
        )}

        {showPositionSubmenu && (
          <div ref={positionSubmenuRef} style={styles.positionSubmenu}>
            {/* Long Position */}
            <div style={styles.submenuItem} onClick={drawLongPosition}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path d="M4 12h20v4H4z" fill="#7CB342"></path>
                  <path d="M14 4l-4 4h3v4h2V8h3z" fill="#4CAF50"></path>
                  <text x="14" y="22" textAnchor="middle" fontSize="8" fill="currentColor">LONG</text>
                </g>
              </svg>
              <span style={styles.submenuText}>Long Position</span>
            </div>

            {/* Short Position */}
            <div style={styles.submenuItem} onClick={drawShortPosition}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path d="M4 12h20v4H4z" fill="#F44336"></path>
                  <path d="M14 24l4-4h-3v-4h-2v4h-3z" fill="#D32F2F"></path>
                  <text x="14" y="8" textAnchor="middle" fontSize="8" fill="currentColor">SHORT</text>
                </g>
              </svg>
              <span style={styles.submenuText}>Short Position</span>
            </div>
          </div>
        )}

        {showShapesSubmenu && (
          <div ref={shapesSubmenuRef} style={styles.shapesSubmenu}>
            {/* Rectangle */}
            <div style={styles.submenuItem} onClick={drawRectangle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.5 6h13v-1h-13z"></path>
                  <path d="M7.5 23h13v-1h-13z"></path>
                  <path d="M5 7.5v13h1v-13z"></path>
                  <path d="M22 7.5v13h1v-13z"></path>
                  <path d="M5.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Rectangle</span>
            </div>

            {/* Rotated Rectangle */}
            <div style={styles.submenuItem} onClick={drawRotatedRectangle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M14.743 3.55l-4.208 4.208.707.707 4.208-4.208zM7.71 10.583l-4.187 4.187.707.707 4.187-4.187zM3.536 18.244l6.171 6.171.707-.707-6.171-6.171zM13.232 24.475l4.22-4.22-.707-.707-4.22 4.22zM20.214 17.494l4.217-4.217-.707-.707-4.217 4.217zM24.423 9.716l-6.218-6.218-.707.707 6.218 6.218z"></path>
                  <path d="M2.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM9.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM16.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 27c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 13c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Rotated Rectangle</span>
            </div>

            {/* Circle */}
            <div style={styles.submenuItem} onClick={drawCircle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path stroke="currentColor" d="M16 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 14a9.5 9.5 0 0 1 18.7-2.37 2.5 2.5 0 0 0 0 4.74A9.5 9.5 0 0 1 4.5 14Zm19.7 2.5a10.5 10.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM22.5 14a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"></path>
              </svg>
              <span style={styles.submenuText}>Circle</span>
            </div>

            {/* Triangle */}
            <div style={styles.submenuItem} onClick={drawTriangle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M9.457 18.844l-5.371 2.4.408.913 5.371-2.4z"></path>
                  <path d="M13.13 17.203l.408.913 13.688-6.116-6.736-3.01-.408.913 4.692 2.097z"></path>
                  <path d="M11.077 5.88l5.34 2.386.408-.913-5.34-2.386z"></path>
                  <path d="M7.401 4.237l.408-.913-5.809-2.595v19.771h1v-18.229z"></path>
                  <path d="M3.708 20.772l5.51-14.169-.932-.362-5.51 14.169zM9.265 6.39l1.46 10.218.99-.141-1.46-10.218zM13.059 17.145l4.743-6.775-.819-.573-4.743 6.775z"></path>
                  <path d="M9.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 10c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM2.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Triangle</span>
            </div>
          </div>
        )}

        {/* Drawing Settings Panel */}
        {showDrawingSettings && activeDrawingTool && hasActiveDrawing && (
          <div ref={drawingSettingsRef} style={styles.drawingSettingsPanel}>
            <div style={styles.drawingSettingsHeader}>
              <div style={styles.drawingSettingsHeaderLeft}>
                <i className="fa-solid fa-gear" style={styles.drawingSettingsIcon}></i>
                <span style={styles.drawingSettingsTitle}>
                  {activeDrawingTool}
                </span>
              </div>
              <button
                style={styles.drawingSettingsCloseButton}
                onClick={() => {
                  setShowDrawingSettings(false);
                  setActiveDrawingTool(null);
                  setHasActiveDrawing(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 83, 80, 0.1)";
                  e.currentTarget.style.color = "#ef5350";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#787b86";
                }}
              >
                ×
              </button>
            </div>
            
            <div style={styles.drawingSettingsContent}>
              {/* Color Setting */}
              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>
                  <i className="fa-solid fa-palette" style={styles.settingIcon}></i>
                  Color
                </label>
                <div style={styles.colorPickerContainer}>
                  <div style={styles.colorPickerWrapper}>
                    <input
                      type="color"
                      value={drawingSettings.color}
                      onChange={(e) => setDrawingSettings(prev => ({ ...prev, color: e.target.value }))}
                      style={styles.colorPicker}
                    />
                    <div style={{...styles.colorPreview, backgroundColor: drawingSettings.color}}></div>
                  </div>
                  <span style={styles.colorValue}>{drawingSettings.color.toUpperCase()}</span>
                </div>
              </div>

              {/* Thickness Setting */}
              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>
                  <i className="fa-solid fa-minus" style={styles.settingIcon}></i>
                  Line Width
                </label>
                <div style={styles.thicknessContainer}>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={drawingSettings.thickness}
                    onChange={(e) => setDrawingSettings(prev => ({ ...prev, thickness: parseInt(e.target.value) }))}
                    style={styles.thicknessSlider}
                  />
                  <div style={styles.thicknessLabels}>
                    <span style={styles.thicknessLabelMin}>1</span>
                    <span style={styles.currentThickness}>{drawingSettings.thickness}px</span>
                    <span style={styles.thicknessLabelMax}>8</span>
                  </div>
                  <div style={styles.thicknessPreview}>
                    <div 
                      style={{
                        ...styles.thicknessLine,
                        height: `${drawingSettings.thickness}px`,
                        backgroundColor: drawingSettings.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Color Presets */}
              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>
                  <i className="fa-solid fa-swatchbook" style={styles.settingIcon}></i>
                  Quick Colors
                </label>
                <div style={styles.colorPresets}>
                  {['#1e88e5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#607d8b', '#000000', '#ffffff'].map((color, index) => (
                    <button
                      key={index}
                      style={{
                        ...styles.colorPresetButton,
                        backgroundColor: color,
                        border: drawingSettings.color === color ? '2px solid #2196f3' : '1px solid #e0e3eb'
                      }}
                      onClick={() => setDrawingSettings(prev => ({ ...prev, color }))}
                      title={color}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Apply/Reset Actions */}
              <div style={styles.settingActions}>
                <button
                  style={styles.resetButton}
                  onClick={() => setDrawingSettings({ color: '#1e88e5', thickness: 2 })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
                    e.currentTarget.style.color = "#2196f3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#787b86";
                  }}
                >
                  <i className="fa-solid fa-rotate-left" style={styles.buttonIcon}></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.mainChart}>
          {/* Applied Indicators Display */}
          {(appliedIndicators.length > 0 || smaIndicators.length > 0 || emaIndicators.length > 0 || wmaIndicators.length > 0 || ichimokuIndicators.length > 0 || supertrendIndicators.length > 0 || psarIndicators.length > 0 || macdIndicators.length > 0 || adxIndicators.length > 0 || hmaIndicators.length > 0 || rsiIndicators.length > 0 || stochasticIndicators.length > 0 || stochasticRsiIndicators.length > 0 || cciIndicators.length > 0 || williamsRIndicators.length > 0 || rocIndicators.length > 0 || bollingerBandsIndicators.length > 0 || keltnerChannelIndicators.length > 0 || donchianChannelIndicators.length > 0 || atrIndicators.length > 0 || standardDeviationChannelIndicators.length > 0 || volumeHistogramIndicators.length > 0) && (
            <div style={styles.indicatorsPanel}>
              <div style={styles.indicatorsPanelTitle}>Applied Indicators</div>
              <div style={styles.indicatorsList}>
                {appliedIndicators.map((indicator) => (
                  <div
                    key={indicator.id}
                    data-indicator-chip
                    style={{
                      ...styles.indicatorChip,
                      ...(showIndicatorControls === indicator.id ? styles.indicatorChipHover : {})
                    }}
                    onClick={() => setShowIndicatorControls(showIndicatorControls === indicator.id ? null : indicator.id)}
                  >
                    <span style={styles.indicatorName}>{indicator.name}</span>
                    {showIndicatorControls === indicator.id && (
                      <>
                        <button
                          style={styles.settingsButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Settings functionality can be added here
                            console.log(`Settings for ${indicator.name}`);
                          }}
                          title="Settings"
                        >
                          <i className="fa-solid fa-gear"></i>
                        </button>
                        <button
                          style={styles.removeButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeIndicator(indicator.id);
                          }}
                          title="Remove indicator"
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {smaIndicators.map((sma) => (
                  <SMAIndicator
                    key={sma.id}
                    chart={sma.chart}
                    onRemove={() => removeSmaIndicator(sma.id)}
                  />
                ))}
                {emaIndicators.map((ema) => (
                  <EMAIndicator
                    key={ema.id}
                    chart={ema.chart}
                    onRemove={() => removeEmaIndicator(ema.id)}
                  />
                ))}
                {wmaIndicators.map((wma) => (
                  <WMAIndicator
                    key={wma.id}
                    chart={wma.chart}
                    onRemove={() => removeWmaIndicator(wma.id)}
                  />
                ))}
                {ichimokuIndicators.map((ichimoku) => (
                  <IchimokuIndicator
                    key={ichimoku.id}
                    chart={ichimoku.chart}
                    onRemove={() => removeIchimokuIndicator(ichimoku.id)}
                  />
                ))}
                {supertrendIndicators.map((supertrend) => (
                  <SupertrendIndicator
                    key={supertrend.id}
                    chart={supertrend.chart}
                    onRemove={() => removeSupertrendIndicator(supertrend.id)}
                  />
                ))}
                {psarIndicators.map((psar) => (
                  <PSARIndicator
                    key={psar.id}
                    chart={psar.chart}
                    onRemove={() => removePsarIndicator(psar.id)}
                  />
                ))}
                {macdIndicators.map((macd) => (
                  <MACDIndicator
                    key={macd.id}
                    chart={macd.chart}
                    onRemove={() => removeMacdIndicator(macd.id)}
                  />
                ))}
                {adxIndicators.map((adx) => (
                  <ADXIndicator
                    key={adx.id}
                    chart={adx.chart}
                    onRemove={() => removeAdxIndicator(adx.id)}
                  />
                ))}
                {hmaIndicators.map((hma) => (
                  <HMAIndicator
                    key={hma.id}
                    chart={hma.chart}
                    onRemove={() => removeHmaIndicator(hma.id)}
                  />
                ))}
                {rsiIndicators.map((rsi) => (
                  <RSIIndicator
                    key={rsi.id}
                    chart={rsi.chart}
                    onRemove={() => removeRsiIndicator(rsi.id)}
                  />
                ))}
                {stochasticIndicators.map((stochastic) => (
                  <StochasticIndicator
                    key={stochastic.id}
                    chart={stochastic.chart}
                    onRemove={() => removeStochasticIndicator(stochastic.id)}
                  />
                ))}
                {stochasticRsiIndicators.map((stochasticRsi) => (
                  <StochasticRSIIndicator
                    key={stochasticRsi.id}
                    chart={stochasticRsi.chart}
                    onRemove={() => removeStochasticRsiIndicator(stochasticRsi.id)}
                  />
                ))}
                {cciIndicators.map((cci) => (
                  <CCIIndicator
                    key={cci.id}
                    chart={cci.chart}
                    onRemove={() => removeCciIndicator(cci.id)}
                  />
                ))}
                {williamsRIndicators.map((williamsR) => (
                  <WilliamsRIndicator
                    key={williamsR.id}
                    chart={williamsR.chart}
                    onRemove={() => removeWilliamsRIndicator(williamsR.id)}
                  />
                ))}
                {rocIndicators.map((roc) => (
                  <ROCIndicator
                    key={roc.id}
                    chart={roc.chart}
                    onRemove={() => {
                      setRocIndicators(prev => prev.filter(ind => ind.id !== roc.id));
                    }}
                  />
                ))}
                {bollingerBandsIndicators.map((indicator) => (
                  <BollingerBandsIndicator
                    key={indicator.id}
                    chart={indicator.chart}
                    onRemove={() => {
                      setBollingerBandsIndicators(prev => prev.filter(ind => ind.id !== indicator.id));
                    }}
                  />
                ))}
                {keltnerChannelIndicators.map((indicator) => (
                  <KeltnerChannelIndicator
                    key={indicator.id}
                    chart={indicator.chart}
                    onRemove={() => {
                      setKeltnerChannelIndicators(prev => prev.filter(ind => ind.id !== indicator.id));
                    }}
                  />
                ))}
                {donchianChannelIndicators.map((indicator) => (
                  <DonchianChannelIndicator
                    key={indicator.id}
                    chart={indicator.chart}
                    onRemove={() => removeDonchianChannelIndicator(indicator.id)}
                  />
                ))}
                {atrIndicators.map((indicator) => (
                  <ATRIndicator
                    key={indicator.id}
                    chart={indicator.chart}
                    onRemove={() => removeAtrIndicator(indicator.id)}
                  />
                ))}
                {standardDeviationChannelIndicators.map((indicator) => (
                  <StandardDeviationChannelIndicator
                    key={indicator.id}
                    chart={indicator.chart}
                    onRemove={() => removeStandardDeviationChannelIndicator(indicator.id)}
                  />
                ))}
                {volumeHistogramIndicators.map((indicator) => (
                  <VolumeHistogramIndicator
                    key={indicator.id}
                    chart={indicator.chart}
                    onRemove={() => removeVolumeHistogramIndicator(indicator.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Symbol and Price Display */}
          <div style={styles.symbolPriceDisplay}>
            <div style={styles.symbolName}>NIFTY 50</div>
            <div style={styles.currentPrice}>24,567.80</div>
          </div>

          <OIChartAlpha5 showOiData={oiData} onChartReady={(chart) => {
            chartInstanceRef.current = chart;
            
            // Register custom overlays for drawing tools
            registerCustomOverlays();
            
            // Apply initial chart type and styles
            chart.setStyles({
              grid: {
                show: settings.gridShow,
              },
              candle: {
                type: "candle_solid",
                tooltip: {
                  showRule: 'none'
                }
              },
              crosshair: {
                show: true,
                horizontal: {
                  show: true,
                  line: {
                    show: true,
                    style: 'dashed',
                    color: '#888',
                    width: 1
                  },
                  text: {
                    show: true,
                    color: '#D9D9D9',
                    backgroundColor: '#686D76'
                  }
                },
                vertical: {
                  show: true,
                  line: {
                    show: true,
                    style: 'dashed',
                    color: '#888',
                    width: 1
                  },
                  text: {
                    show: true,
                    color: '#D9D9D9',
                    backgroundColor: '#686D76'
                  }
                }
              }
            });
          }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  topScroll: {
    height: "30px",
    overflowX: "auto",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #ccc",
    background: "#fafafa",
    flexShrink: 0,
  },
  scrollRow: { display: "flex", height: "100%" },
  testBox: {
    display: "flex",
    alignItems: "center",
    borderRight: "1px solid #ccc",
    padding: "0 5px",
    background: "#fff",
    cursor: "pointer",
  },
  popup: {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minWidth: "200px",
    maxHeight: "300px",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 2000,
  },
  popupContent: { padding: "5px" },
  dropdownItem: {
    padding: "5px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  toggleItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    fontSize: "13px",
    gap: "8px",
    transition: "background-color 0.2s",
  },
  settingsSection: {
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "8px",
    marginBottom: "8px",
  },
  sectionHeader: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    padding: "8px 12px 4px 12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  selectItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "13px",
  },
  selectInput: {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "12px",
    backgroundColor: "#fff",
    minWidth: "120px",
  },
  actionButtons: {
    padding: "8px 12px",
  },
  resetButton: {
    width: "100%",
    padding: "8px 16px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#333",
    transition: "all 0.2s",
  },
  drawingSettingsPanel: {
    position: "absolute",
    right: "10px",
    top: "50px",
    width: "320px",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e3eb",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
    zIndex: 1000,
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  drawingSettingsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e0e3eb",
  },
  drawingSettingsHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  drawingSettingsIcon: {
    fontSize: "16px",
    color: "#2196f3",
  },
  drawingSettingsTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#131722",
  },
  drawingSettingsCloseButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#787b86",
    cursor: "pointer",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    fontWeight: "300",
  },
  drawingSettingsContent: {
    padding: "20px",
  },
  settingGroup: {
    marginBottom: "24px",
  },
  settingLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#131722",
    marginBottom: "12px",
  },
  settingIcon: {
    fontSize: "12px",
    color: "#787b86",
    width: "12px",
  },
  colorPickerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  colorPickerWrapper: {
    position: "relative",
    width: "44px",
    height: "36px",
  },
  colorPicker: {
    width: "44px",
    height: "36px",
    border: "2px solid #e0e3eb",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "transparent",
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
  },
  colorPreview: {
    width: "44px",
    height: "36px",
    borderRadius: "8px",
    border: "2px solid #e0e3eb",
    cursor: "pointer",
    position: "relative",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  colorValue: {
    fontSize: "13px",
    color: "#787b86",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    fontWeight: "500",
    letterSpacing: "0.5px",
  },
  thicknessContainer: {
    width: "100%",
  },
  thicknessSlider: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e3eb",
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    marginBottom: "8px",
  },
  thicknessLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#787b86",
    marginBottom: "12px",
  },
  thicknessLabelMin: {
    fontSize: "11px",
    color: "#787b86",
  },
  thicknessLabelMax: {
    fontSize: "11px",
    color: "#787b86",
  },
  currentThickness: {
    fontWeight: "600",
    color: "#131722",
    fontSize: "12px",
  },
  thicknessPreview: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #e0e3eb",
  },
  thicknessLine: {
    width: "60px",
    borderRadius: "2px",
    transition: "all 0.2s ease",
  },
  colorPresets: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "8px",
  },
  colorPresetButton: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  settingActions: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "16px",
    borderTop: "1px solid #f0f0f0",
    marginTop: "20px",
  },
  resetButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "1px solid #e0e3eb",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "12px",
    color: "#787b86",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
  },
  buttonIcon: {
    fontSize: "11px",
  },
  mainArea: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  leftColumn: {
    width: "40px",
    flexShrink: 0,
    borderRight: "1px solid #ccc",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  numberBox: {
    height: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
  },
  submenu: {
    position: "absolute",
    left: "40px",
    top: "70px",
    width: "180px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 70px)",
    overflowY: "auto",
  },
  submenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  submenuText: {
    marginLeft: "8px",
    fontSize: "14px",
  },
  fibSubmenu: {
    position: "absolute",
    left: "40px",
    top: "110px",
    width: "220px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 110px)",
    overflowY: "auto",
  },
  patternSubmenu: {
    position: "absolute",
    left: "40px",
    top: "150px",
    width: "200px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 150px)",
    overflowY: "auto",
  },
  projectionSubmenu: {
    position: "absolute",
    left: "40px",
    top: "190px",
    width: "220px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 190px)",
    overflowY: "auto",
  },
  brushesSubmenu: {
    position: "absolute",
    left: "40px",
    top: "230px",
    width: "200px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 230px)",
    overflowY: "auto",
  },
  positionSubmenu: {
    position: "absolute",
    left: "40px",
    top: "270px",
    width: "180px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 270px)",
    overflowY: "auto",
  },
  shapesSubmenu: {
    position: "absolute",
    left: "40px",
    top: "310px",
    width: "200px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: 1000,
    maxHeight: "calc(100vh - 310px)",
    overflowY: "auto",
  },
  submenuSectionHeader: {
    padding: "8px 0",
    fontSize: "12px",
    color: "#555",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    marginBottom: "5px",
  },
  mainChart: {
    flex: 1,
    background: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  indicatorsPanel: {
    position: "absolute",
    top: "50px",
    left: "5px",
    backgroundColor: "transparent",
    padding: "0",
    zIndex: 1000,
    maxWidth: "250px",
    pointerEvents: "none",
  },
  symbolPriceDisplay: {
    position: "absolute",
    top: "5px",
    left: "5px",
    zIndex: 1001,
    pointerEvents: "none",
  },
  symbolName: {
    color: "#333",
    fontSize: "16px",
    fontWeight: "bold",
    textShadow: "0 0 3px rgba(255, 255, 255, 0.8)",
    marginBottom: "2px",
  },
  currentPrice: {
    color: "#4CAF50",
    fontSize: "12px",
    fontWeight: "normal",
    textShadow: "0 0 3px rgba(255, 255, 255, 0.8)",
  },
  indicatorsPanelTitle: {
    display: "none",
  },
  indicatorsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    alignItems: "flex-start",
  },
  indicatorChip: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "3px",
    padding: "2px 4px",
    fontSize: "11px",
    maxWidth: "200px",
    pointerEvents: "auto",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  indicatorName: {
    color: "#131722",
    marginRight: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    fontWeight: "400",
    fontSize: "11px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
  },
  removeButton: {
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
  },
  indicatorChipHover: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  removeButtonVisible: {
    display: "flex",
  },
  settingsButton: {
    background: "none",
    border: "none",
    color: "#686D76",
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
  },
};