import { useState, useRef, useEffect } from "react";
import OIChartAlpha5 from "./OIChartAlpha5";
import { applyCandlestickPatternRecognition } from "./CandlestickPatternChart";
import { applyChartPatternRecognition } from "./ChartPatternRecognition";
import { applyHarmonicPatternRecognition } from "./DetectHarmonicPatterns";
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
  const submenuRef = useRef(null);
  const fibSubmenuRef = useRef(null);
  const patternSubmenuRef = useRef(null);
  const projectionSubmenuRef = useRef(null);
  const brushesSubmenuRef = useRef(null);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSubmenu, showFibSubmenu, showPatternSubmenu, showProjectionSubmenu, showBrushesSubmenu, showIndicatorControls]);

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

          {/* Projection tool */}
          <div
            className="projection-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowProjectionSubmenu(!showProjectionSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z"></path>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z"></path>
            </svg>
          </div>

          {/* Brushes tool */}
          <div
            className="brushes-submenu-trigger"
            style={styles.numberBox}
            onClick={() => setShowBrushesSubmenu(!showBrushesSubmenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
              <g fill="currentColor" fillRule="nonzero">
                <path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path>
                <path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path>
              </g>
            </svg>
          </div>

          {/* Text tool */}
          <div style={styles.numberBox}>
            T
          </div>

          {/* Ruler tool */}
          <div style={styles.numberBox}>
            <i className="fa-solid fa-ruler"></i>
          </div>
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

            {/* Regression Trend */}
            <div style={styles.submenuItem} onClick={drawRegressionTrend}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.551 17.98l13.284-7.033-.468-.884-13.284 7.033z"></path>
                  <path d="M6 11.801l16-8.471v4.17h1v-5.83l-18 9.529v5.301h1z"></path>
                  <path d="M6 24.67v-4.17h-1v5.83l18-9.529v-5.301h-1v4.699z"></path>
                  <path d="M5.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Regression Trend</span>
            </div>

            {/* Flat Top/Bottom */}
            <div style={styles.submenuItem} onClick={drawFlatTopBottom}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 8h20v-1h-20z"></path>
                  <path d="M4 21h20v-1h-20z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Flat Top/Bottom</span>
            </div>
          </div>
        )}

        {showFibSubmenu && (
          <div ref={fibSubmenuRef} style={styles.fibSubmenu}>
            {/* Fib Retracement */}
            <div style={styles.submenuItem}>
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

            {/* Trend-Based Fib Extension */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4 25h22v-1h-22z" id="Line"></path>
                  <path d="M4 21h22v-1h-22z"></path>
                  <path d="M6.5 17h19.5v-1h-19.5z"></path>
                  <path d="M5 14.5v-3h-1v3zM6.617 9.275l10.158-3.628-.336-.942-10.158 3.628z"></path>
                  <path d="M18.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Trend-Based Fib Extension</span>
            </div>

            {/* Fib Channel */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.463 12.026l13.537-7.167-.468-.884-13.537 7.167z"></path>
                  <path d="M22.708 16.824l-17.884 9.468.468.884 17.884-9.468z"></path>
                  <path d="M22.708 9.824l-15.839 8.386.468.884 15.839-8.386z"></path>
                  <path d="M5.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Channel</span>
            </div>

            {/* Fib Time Zone */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M19 4v21h1V4h-1Zm5 0v21h1V4h-1ZM6 12.95V25H5V12.95a2.5 2.5 0 0 1 0-4.9V4h1v4.05a2.5 2.5 0 0 1 1.67 3.7L8.7 12.8 8 13.5l-1-1c-.3.22-.63.38-1 .45ZM5.5 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm1 5.5v-3.05A2.5 2.5 0 0 1 12.5 18l-1-1 .7-.7 1.05 1.03c.23-.13.48-.23.75-.28V4h1v13.05a2.5 2.5 0 0 1 0 4.9V25h-1ZM8.97 14.47l1.56 1.56.7-.71-1.55-1.55-.7.7Z"></path>
              </svg>
              <span style={styles.submenuText}>Fib Time Zone</span>
            </div>

            {/* Fib Speed Resistance Fan */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M8 9.5c0 3.038 2.462 5.5 5.5 5.5s5.5-2.462 5.5-5.5v-.5h-1v.5c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5v-.5h-1v.5z"></path>
                  <path d="M0 9.5c0 7.456 6.044 13.5 13.5 13.5s13.5-6.044 13.5-13.5v-.5h-1v.5c0 6.904-5.596 12.5-12.5 12.5s-12.5-5.596-12.5-12.5v-.5h-1v.5z"></path>
                  <path d="M4 9.5c0 4.259 2.828 7.964 6.86 9.128l.48.139.277-.961-.48-.139c-3.607-1.041-6.137-4.356-6.137-8.167v-.5h-1v.5z"></path>
                  <path d="M16.141 18.628c4.032-1.165 6.859-4.869 6.859-9.128v-.5h-1v.5c0 3.811-2.53 7.125-6.136 8.167l-.48.139.278.961.48-.139z"></path>
                  <path d="M13.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM13.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Speed Resistance Fan</span>
            </div>

            {/* Fib Wedge */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M21.5 23h-14v1h14zM5 7.5v14h1v-14z"></path>
                  <path d="M12 23c0-3.314-2.686-6-6-6h-.5v1h.5c2.761 0 5 2.239 5 5v.5h1v-.5z"></path>
                  <path d="M20 23c0-7.732-6.268-14-14-14h-.5v1h.5c7.18 0 13 5.82 13 13v.5h1v-.5z"></path>
                  <path d="M16 23c0-5.523-4.477-10-10-10h-.5v1h.5c4.971 0 9 4.029 9 9v.5h1v-.5z"></path>
                  <path d="M5.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Fib Wedge</span>
            </div>

            {/* Pitchfan */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20.349 20.654l4.489-.711-.156-.988-4.489.711z"></path>
                  <path d="M7.254 22.728l9.627-1.525-.156-.988-9.627 1.525z"></path>
                  <path d="M7.284 22.118l15.669-8.331-.469-.883-15.669 8.331z"></path>
                  <path d="M6.732 21.248l8.364-15.731-.883-.469-8.364 15.731z"></path>
                  <path d="M17.465 18.758l-8.188-8.188-.707.707 8.188 8.188z"></path>
                  <path d="M6.273 20.818l1.499-9.467-.988-.156-1.499 9.467z"></path>
                  <path d="M8.329 7.834l.715-4.516-.988-.156-.715 4.51"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Pitchfan</span>
            </div>
          </div>
        )}

        {showPatternSubmenu && (
          <div ref={patternSubmenuRef} style={styles.patternSubmenu}>
            {/* XABCD Pattern */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M20.449 8.505l2.103 9.112.974-.225-2.103-9.112zM13.943 14.011l7.631 4.856.537-.844-7.631-4.856zM14.379 11.716l4.812-3.609-.6-.8-4.812 3.609zM10.96 13.828l-4.721 6.744.819.573 4.721-6.744zM6.331 20.67l2.31-13.088-.985-.174-2.31 13.088zM9.041 7.454l1.995 3.492.868-.496-1.995-3.492z"></path>
                  <path d="M8.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM12.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 21c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>XABCD Pattern</span>
            </div>

            {/* Cypher Pattern */}
            <div style={styles.submenuItem}>
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
            <div style={styles.submenuItem}>
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
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M21.487 5.248l-12.019 1.502.124.992 12.019-1.502zM6.619 9.355l-2.217 11.083.981.196 2.217-11.083zM6.534 22.75l12.071-1.509-.124-.992-12.071 1.509zM21.387 18.612l2.21-11.048-.981-.196-2.21 11.048zM8.507 9.214l10.255 10.255.707-.707-10.255-10.255z"></path>
                  <path d="M7.5 9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM20.5 22c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>ABCD Pattern</span>
            </div>

            {/* Triangle Pattern */}
            <div style={styles.submenuItem}>
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
            <div style={styles.submenuItem}>
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
            <div style={styles.submenuItem}>
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
            <div style={styles.submenuItem}>
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

            {/* Forecast */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path d="M19 11h5l-2.5 3z"></path>
                  <circle cx="21.5" cy="16.5" r="1.5"></circle>
                  <path fillRule="nonzero" d="M22 11v-6h-1v6z"></path>
                  <path d="M14 18h1v3h-1z"></path>
                  <path d="M14 5h1v6h-1z"></path>
                  <path d="M7 19h1v3h-1z"></path>
                  <path d="M7 6h1v7h-1z"></path>
                  <path fillRule="nonzero" d="M8 18h1v3h-1zM8 9h1v5h-1zM8 18h1v-4h-1v4zm-1-5h3v6h-3v-6zM14 18h1v3h-1zM14 3h1v6h-1zM14 18h1v-7h-1v7zm-1-8h3v9h-3v-9zM7 19h1v3h-1zM7 6h1v7h-1z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Forecast</span>
            </div>

            {/* Bars Pattern */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M6 6v6.5h1v-6.5zM7 22v-2.5h-1v2.5zM11 11v2.5h1v-2.5zM12 24v-7.5h-1v7.5zM16 5v5.5h1v-5.5zM17 21v-2.5h-1v2.5zM21 7v4.5h1v-4.5zM22 19v-2.5h-1v2.5z"></path>
                  <path d="M6 13v6h1v-6zM-1 12h3v8h-3v-8z"></path>
                  <path d="M11 16h1v-2h-1v2zm-1-3h3v4h-3v-4z"></path>
                  <path d="M16 18h1v-7h-1v7zm-1-8h3v9h-3v-9z"></path>
                  <path d="M21 16h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Bars Pattern</span>
            </div>

            {/* Ghost Feed */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M4.529 18.21l3.157-1.292-.379-.926-3.157 1.292z"></path>
                  <path fillRule="nonzero" d="M9.734 16.081l2.97-1.215-.379-.926-2.97 1.215z"></path>
                  <path fillRule="nonzero" d="M14.725 14.039l2.957-1.21-.379-.926-2.957 1.21z"></path>
                  <path fillRule="nonzero" d="M19.708 12.001l3.114-1.274-.379-.926-3.114 1.274z"></path>
                  <path d="M8 18h1v3h-1z"></path>
                  <path d="M8 9h1v5h-1z"></path>
                  <path fillRule="nonzero" d="M8 18h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                  <path d="M18 16h1v3h-1z"></path>
                  <path d="M18 3h1v6h-1z"></path>
                  <path fillRule="nonzero" d="M18 16h1v-7h-1v7zm-1-8h3v9h-3v-9z"></path>
                  <path d="M13 6h1v5h-1z"></path>
                  <path d="M13 15h1v5h-1z"></path>
                  <path fillRule="nonzero" d="M13 15h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                  <path fillRule="nonzero" d="M2.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Ghost Feed</span>
            </div>

            {/* Projection */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M23.886 21.431c-.953-8.558-7.742-15.354-16.299-16.315l-.112.994c8.093.909 14.516 7.338 15.417 15.432l.994-.111z"></path>
                  <path d="M5 7.5v14h1v-14zM21.5 23h-14v1h14z"></path>
                  <path d="M5.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Projection</span>
            </div>

            {/* Volume-based Section Header */}
            <div style={styles.submenuSectionHeader}>Volume-based</div>

            {/* Anchored VWAP */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" d="M17 17h1v6h-1v-6zM17 2h1v5h-1V2z"></path>
                <path fill="currentColor" d="M16 17h3V8h-3v9zM15 7h5v11h-5V7zM10 5h1v5h-1V5zM10 22h1v3h-1v-3z"></path>
                <path fill="currentColor" d="M9 21h3V10H9v11zM8 9h5v13H8V9z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M25.27 9.42L14.1 16.53l-6.98-1.5L5.3 16.4l-.6-.8 2.18-1.64 7.02 1.5 10.83-6.88.54.84z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4 18a1 1 0 1 0 0-2 1 1 0 0 0 0 4zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
              </svg>
              <span style={styles.submenuText}>Anchored VWAP</span>
            </div>

            {/* Fixed Range Volume Profile */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M5 21.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.5 24a2.5 2.5 0 0 0 .5-4.95V3H3v16.05A2.5 2.5 0 0 0 3.5 24zM25 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM23.5 3a2.5 2.5 0 0 1 .5 4.95V24h-1V7.95A2.5 2.5 0 0 1 23.5 3z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M9 7H4v2h5V7zM3 6v4h7V6H3z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 10H4v2h8v-2zm-4-1v4h10v-4H3z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7 13H4v2h3v-2zm-4-1v4h5v-4H3z"></path>
              </svg>
              <span style={styles.submenuText}>Fixed Range Volume Profile</span>
            </div>

            {/* Anchored Volume Profile */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" fillRule="evenodd" d="M24 3h-1v4h-6v3h-5v3H8.95a2.5 2.5 0 1 0 0 1H15v3h5v3h3v4h1V3Zm-6 7h5V8h-5v2Zm-1 1h-4v2h10v-2h-6Zm4 5h-5v-2h7v2h-2ZM6.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
              </svg>
              <span style={styles.submenuText}>Anchored Volume Profile</span>
            </div>

            {/* Measurer Section Header */}
            <div style={styles.submenuSectionHeader}>Measurer</div>

            {/* Price Range */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M4 5h16.5v-1h-16.5zM25 24h-16.5v1h16.5z"></path>
                  <path fillRule="nonzero" d="M6.5 26c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path fillRule="nonzero" d="M14 9v14h1v-14z"></path>
                  <path d="M14.5 6l2.5 3h-5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Price Range</span>
            </div>

            {/* Date Range */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M20 14h-14v1h14z"></path>
                  <path d="M20 17v-5l3 2.5z"></path>
                  <path fillRule="nonzero" d="M24 8.5v16.5h1v-16.5zM4 4v16.5h1v-16.5z"></path>
                  <path fillRule="nonzero" d="M4.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Date Range</span>
            </div>

            {/* Date and Price Range */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor">
                  <path fillRule="nonzero" d="M6.5 23v1h17.5v-17.5h-1v16.5z"></path>
                  <path fillRule="nonzero" d="M21.5 5v-1h-17.5v17.5h1v-16.5z"></path>
                  <path fillRule="nonzero" d="M4.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM23.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                  <path fillRule="nonzero" d="M13 9v13h1v-13z"></path>
                  <path d="M13.5 6l2.5 3h-5z"></path>
                  <path fillRule="nonzero" d="M19 14h-13v1h13z"></path>
                  <path d="M19 17v-5l3 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Date and Price Range</span>
            </div>
          </div>
        )}

        {showBrushesSubmenu && (
          <div ref={brushesSubmenuRef} style={styles.brushesSubmenu}>
            {/* Brush */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path>
                  <path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Brush</span>
            </div>

            {/* Highlighter */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 23" width="20" height="20">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M13.402 0L6.78144 6.71532C6.67313 6.82518 6.5917 6.95862 6.54354 7.10518L5.13578 11.3889C4.89843 12.1111 5.08375 12.9074 5.61449 13.4458L5.68264 13.5149L0 19.2789L8.12695 22.4056L11.2874 19.1999L11.3556 19.269C11.8863 19.8073 12.6713 19.9953 13.3834 19.7546L17.6013 18.3285C17.7493 18.2784 17.8835 18.1945 17.9931 18.0832L24.6912 11.2892L23.9857 10.5837L17.515 17.147L7.70658 7.19818L14.1076 0.705575L13.402 0ZM6.07573 11.7067L7.24437 8.15061L16.576 17.6158L13.0701 18.8012C12.7141 18.9215 12.3215 18.8275 12.0562 18.5584L6.31509 12.7351C6.04972 12.466 5.95706 12.0678 6.07573 11.7067ZM6.30539 14.3045L10.509 18.5682L7.87935 21.2355L1.78414 18.8904L6.30539 14.3045Z"></path>
              </svg>
              <span style={styles.submenuText}>Highlighter</span>
            </div>

            <div style={styles.submenuSectionHeader}>Arrows</div>

            {/* Arrow Marker */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M4.529 18.21l3.157-1.292-.379-.926-3.157 1.292z"></path>
                  <path d="M9.734 16.081l2.97-1.215-.379-.926-2.97 1.215z"></path>
                  <path d="M14.725 14.039l2.957-1.21-.379-.926-2.957 1.21z"></path>
                  <path d="M19.708 12.001l3.114-1.274-.379-.926-3.114 1.274z"></path>
                  <path d="M8 18h1v3h-1z"></path>
                  <path d="M8 9h1v5h-1z"></path>
                  <path fillRule="nonzero" d="M8 18h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                  <path d="M18 16h1v3h-1z"></path>
                  <path d="M18 3h1v6h-1z"></path>
                  <path fillRule="nonzero" d="M18 16h1v-7h-1v7zm-1-8h3v9h-3v-9z"></path>
                  <path d="M13 6h1v5h-1z"></path>
                  <path d="M13 15h1v5h-1z"></path>
                  <path fillRule="nonzero" d="M13 15h1v-4h-1v4zm-1-5h3v6h-3v-6z"></path>
                  <path fillRule="nonzero" d="M2.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Arrow Marker</span>
            </div>

            {/* Arrow */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
                  <path d="M21 7l-8 3 5 5z"></path>
                  <path fillRule="nonzero" d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Arrow</span>
            </div>

            {/* Arrow Mark Up */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" fillRule="nonzero" d="M11 16v6h6v-6h4.865l-7.865-9.438-7.865 9.438h4.865zm7 7h-8v-6h-6l10-12 10 12h-6v6z"></path>
              </svg>
              <span style={styles.submenuText}>Arrow Mark Up</span>
            </div>

            {/* Arrow Mark Down */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" fillRule="nonzero" d="M17 12v-6h-6v6h-4.865l7.865 9.438 7.865-9.438h-4.865zm-7-7h8v6h6l-10 12-10-12h6v-6z"></path>
              </svg>
              <span style={styles.submenuText}>Arrow Mark Down</span>
            </div>

            <div style={styles.submenuSectionHeader}>Shapes</div>

            {/* Rectangle */}
            <div style={styles.submenuItem}>
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
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M14.743 3.55l-4.208 4.208.707.707 4.208-4.208zM7.71 10.583l-4.187 4.187.707.707 4.187-4.187zM3.536 18.244l6.171 6.171.707-.707-6.171-6.171zM13.232 24.475l4.22-4.22-.707-.707-4.22 4.22zM20.214 17.494l4.217-4.217-.707-.707-4.217 4.217zM24.423 9.716l-6.218-6.218-.707.707 6.218 6.218z"></path>
                  <path d="M2.5 18c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM9.5 11c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM16.5 4c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 27c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM18.5 20c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 13c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Rotated Rectangle</span>
            </div>

            {/* Path */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <path fill="currentColor" d="M11 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm11-8.8V13h1V7h-6v1h4.3l-7.42 7.41a2.49 2.49 0 0 0-2.76 0l-3.53-3.53a2.5 2.5 0 1 0-4.17 0L1 18.29l.7.71 6.42-6.41a2.49 2.49 0 0 0 2.76 0l3.53 3.53a2.5 2.5 0 1 0 4.17 0z"></path>
              </svg>
              <span style={styles.submenuText}>Path</span>
            </div>

            {/* Circle */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="none">
                <path stroke="currentColor" d="M16 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.529 18.21l3.157-1.292-.379-.926-3.157 1.292z"></path>
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4.5 14a9.5 9.5 0 0 1 18.7-2.37 2.5 2.5 0 0 0 0 4.74A9.5 9.5 0 0 1 4.5 14Zm19.7 2.5a10.5 10.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM22.5 14a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"></path>
              </svg>
              <span style={styles.submenuText}>Circle</span>
            </div>

            {/* Ellipse */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M12.435 6.136c-4.411.589-7.983 3.039-9.085 6.27l.946.323c.967-2.836 4.209-5.059 8.271-5.602l-.132-.991zM3.347 16.584c1.101 3.243 4.689 5.701 9.117 6.283l.130-.991c-4.079-.537-7.335-2.767-8.301-5.613l-.947.321zM16.554 22.865c4.381-.582 7.94-3 9.071-6.2l-.943-.333c-.994 2.811-4.224 5.006-8.26 5.542l.132.991zM25.646 12.394c-1.107-3.225-4.675-5.668-9.078-6.257l-.133.991c4.056.542 7.293 2.76 8.265 5.591l.946-.325z"></path>
                  <path d="M14.5 8c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM25.5 16c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Ellipse</span>
            </div>

            {/* Polyline */}
            <div style={styles.submenuItem}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M16.5 6h4v-1h-4z"></path>
                  <path d="M16.5 15h4v-1h-4z"></path>
                  <path d="M8.5 23h4v-1h-4z"></path>
                  <path d="M8.298 11.591l5.097-4.46-.659-.753-5.097 4.46zM22 7.5v5h1v-5z"></path>
                  <path d="M14 16.5v4h1v-4z"></path>
                  <path d="M6 14.5v6h1v-6z"></path>
                  <path d="M6.5 14c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
                </g>
              </svg>
              <span style={styles.submenuText}>Polyline</span>
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