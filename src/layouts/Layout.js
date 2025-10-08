import React from "react";
import { ScrollProvider } from "./ScrollContext";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <ScrollProvider>
      {children}
      <Footer />
    </ScrollProvider>
  );
}

export default Layout;
