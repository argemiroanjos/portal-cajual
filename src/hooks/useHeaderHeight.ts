"use client";

import { useEffect, useState } from "react";

export function useHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const updateHeight = () => {
      setHeaderHeight(header.getBoundingClientRect().height);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return headerHeight;
}
