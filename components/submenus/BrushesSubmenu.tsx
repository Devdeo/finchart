
import React from "react";
import { styles } from "../styles";
import SubmenuItem from "./SubmenuItem";

export default function BrushesSubmenu() {
  return (
    <>
      {/* Brush */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
          <g fill="currentColor" fillRule="nonzero">
            <path d="M1.789 23l.859-.854.221-.228c.18-.19.38-.409.597-.655.619-.704 1.238-1.478 1.815-2.298.982-1.396 1.738-2.776 2.177-4.081 1.234-3.667 5.957-4.716 8.923-1.263 3.251 3.785-.037 9.38-5.379 9.38h-9.211zm9.211-1c4.544 0 7.272-4.642 4.621-7.728-2.45-2.853-6.225-2.015-7.216.931-.474 1.408-1.273 2.869-2.307 4.337-.599.852-1.241 1.653-1.882 2.383l-.068.078h6.853z"></path>
            <path d="M18.182 6.002l-1.419 1.286c-1.031.935-1.075 2.501-.096 3.48l1.877 1.877c.976.976 2.553.954 3.513-.045l5.65-5.874-.721-.693-5.65 5.874c-.574.596-1.507.609-2.086.031l-1.877-1.877c-.574-.574-.548-1.48.061-2.032l1.419-1.286-.672-.741z"></path>
          </g>
        </svg>
        <span style={styles.submenuText}>Brush</span>
      </SubmenuItem>

      {/* Highlighter */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 23" width="20" height="20">
          <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M13.402 0L6.78144 6.71532C6.67313 6.82518 6.5917 6.95862 6.54354 7.10518L5.13578 11.3889C4.89843 12.1111 5.08375 12.9074 5.61449 13.4458L5.68264 13.5149L0 19.2789L8.12695 22.4056L11.2874 19.1999L11.3556 19.269C11.8863 19.8073 12.6713 19.9953 13.3834 19.7546L17.6013 18.3285C17.7493 18.2784 17.8835 18.1945 17.9931 18.0832L24.6912 11.2892L23.9857 10.5837L17.515 17.147L7.70658 7.19818L14.1076 0.705575L13.402 0ZM6.07573 11.7067L7.24437 8.15061L16.576 17.6158L13.0701 18.8012C12.7141 18.9215 12.3215 18.8275 12.0562 18.5584L6.31509 12.7351C6.04972 12.466 5.95706 12.0678 6.07573 11.7067ZM6.30539 14.3045L10.509 18.5682L7.87935 21.2355L1.78414 18.8904L6.30539 14.3045Z"></path>
        </svg>
        <span style={styles.submenuText}>Highlighter</span>
      </SubmenuItem>

      {/* Separator */}
      <div role="separator" style={{ height: "1px", backgroundColor: "#ddd", margin: "8px 0" }}></div>
      
      {/* Arrows Header */}
      <div style={{ ...styles.submenuText, fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>
        Arrows
      </div>

      {/* Arrow Tool */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M22.38 4.04h.04a1.3 1.3 0 0 1 1.21.33c.37.36.42.84.33 1.2v.04l-2.45 8.32c-.14.55-.57.91-1 1.04-.45.14-1.2.07-1.55-.63l-.34-.64-12.6 10.03c-.3.24-.72.19-.96-.11-.24-.3-.19-.72.11-.96l12.6-10.03.64.34c.7.35 1.49.14 1.77-.52l2.45-8.32c.13-.44-.04-.9-.4-1.08-.36-.18-.8.02-.98.47l-1.47 3.67c-.18.45-.7.67-1.15.49-.45-.18-.67-.7-.49-1.15l1.47-3.67c.36-.9 1.24-1.3 1.96-.9.72.4 1.06 1.28.7 1.96l-1.47 3.67.49.2 1.47-3.67c.18-.45.7-.67 1.15-.49.45.18.67.7.49 1.15l-1.47 3.67z"></path>
        </svg>
        <span style={styles.submenuText}>Arrow</span>
      </SubmenuItem>
    </>
  );
}
