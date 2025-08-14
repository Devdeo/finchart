
import React from "react";
import { styles } from "../styles";

interface SubmenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function SubmenuItem({ children, onClick }: SubmenuItemProps) {
  return (
    <div style={styles.submenuItem} onClick={onClick}>
      {children}
    </div>
  );
}
