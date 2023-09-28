import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

// import Footer from "../../components/Footer";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  // const { data } = null;

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {/* <Sidebar
        user={user || {}}
        isNonMobile={false}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      /> */}
      <Box>
        <Navbar
          user={user || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Box>
      <Box flexGrow={1} m="6rem 2rem 2rem 3rem" overflow={"auto"} sx={{}}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
