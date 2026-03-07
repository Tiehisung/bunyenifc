import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
