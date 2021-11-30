import React from "react";
import NavigationControls from "../NavigationControls/NavigationControls";

import styles from "./Header.modules.scss";

const Header = () => {
  return (
    <nav className={styles.navigation}>
      <p className={styles.logo}>dCommerce Store</p>
      <NavigationControls />
    </nav>
  );
};

export default Header;
