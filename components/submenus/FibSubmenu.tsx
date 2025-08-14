
import React from "react";
import { styles } from "../styles";
import SubmenuItem from "./SubmenuItem";

export default function FibSubmenu() {
  return (
    <>
      {/* Fibonacci Retracement */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
          <g fill="currentColor" fillRule="nonzero">
            <path d="M7.354 21.354l14-14-.707-.707-14 14z"></path>
            <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
          </g>
        </svg>
        <span style={styles.submenuText}>Fibonacci Retracement</span>
      </SubmenuItem>

      {/* Fibonacci Extension */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
          <g fill="currentColor" fillRule="nonzero">
            <path d="M7.354 21.354l7-7-.707-.707-7 7z"></path>
            <path d="M15.354 13.354l7-7-.707-.707-7 7z"></path>
            <path d="M22.5 7c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM14.5 15c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM5.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
          </g>
        </svg>
        <span style={styles.submenuText}>Fibonacci Extension</span>
      </SubmenuItem>

      {/* Fibonacci Time Zone */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
          <g fill="currentColor" fillRule="nonzero">
            <path d="M6 3h1v22H6zM10 3h1v22h-1zM15 3h1v22h-1zM21 3h1v22h-1z"></path>
            <path d="M5.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM22.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
          </g>
        </svg>
        <span style={styles.submenuText}>Fibonacci Time Zone</span>
      </SubmenuItem>

      {/* Fibonacci Fan */}
      <SubmenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
          <g fill="currentColor" fillRule="nonzero">
            <path d="M5.354 23.354l18-18-.707-.707-18 18z"></path>
            <path d="M5.354 20.354l15-15-.707-.707-15 15z"></path>
            <path d="M5.354 17.354l12-12-.707-.707-12 12z"></path>
            <path d="M22.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM3.5 25c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path>
          </g>
        </svg>
        <span style={styles.submenuText}>Fibonacci Fan</span>
      </SubmenuItem>
    </>
  );
}
