import { Drawer } from "@mui/material";
import styled from "styled-components";
import React from "react";

const Sidebar = ({ open, triggerSidebar, anchorLocation, children }) => {
  return (
    <StyledDrawer
      anchor={anchorLocation}
      open={open}
      PaperProps={{
        style: {
          width: "20%",
        },
      }}
      onClose={() => triggerSidebar(false)}
    >
      {children}
    </StyledDrawer>
  );
};

export default Sidebar;

const StyledDrawer = styled(Drawer)`
  padding: 10px;
`;
