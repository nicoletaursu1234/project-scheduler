import React, { Fragment, useState } from "react";
import {
  Button,
  useTheme,
  useMediaQuery,
  Popover,
  MenuList,
  MenuItem,
  IconButton,
} from "@mui/material";
import { WeekDateBtn } from "./WeekDateBtn";
import { DayDateBtn } from "./DayDateBtn";
import { MonthDateBtn } from "./MonthDateBtn";
import { useAppState } from "../../hooks/useAppState";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { selectCalendars } from "store/selectors/calendar";

export type View = "month" | "week" | "day";

const Navigation = () => {
  const { currCalendar: calendar } = useSelector(selectCalendars);
  const {
    selectedDate,
    view,
    week,
    handleState,
    getViews,
    triggerCalendarSidebar,
  } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const views = getViews();

  const toggleMoreMenu = (el?: Element) => {
    setAnchorEl(el || null);
  };

  const renderDateSelector = () => {
    switch (view) {
      case "month":
        return (
          <MonthDateBtn selectedDate={selectedDate} onChange={handleState} />
        );
      case "week":
        return (
          <WeekDateBtn
            selectedDate={selectedDate}
            onChange={handleState}
            weekProps={week!}
          />
        );
      case "day":
        return (
          <DayDateBtn selectedDate={selectedDate} onChange={handleState} />
        );
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <MenuIcon
          style={{
            color: "white",
            paddingLeft: "5px",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={() => {
            triggerCalendarSidebar(true);
          }}
        />
        {renderDateSelector()}
      </div>
      <div>
        <p style={{ color: "white" }}>{calendar?.name || ""}</p>
      </div>
      <div style={{ color: "white" }}>
        {views.length > 1 &&
          (isDesktop ? (
            views.map((v) => (
              <Button
                key={v}
                style={{ color: v === view ? "#88c4ff" : "inherit" }}
                onClick={() => handleState(v, "view")}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleState(v, "view");
                }}
              >
                {v}
              </Button>
            ))
          ) : (
            <Fragment>
              <IconButton
                style={{ padding: 5, color: "white" }}
                onClick={(e) => {
                  toggleMoreMenu(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={(e) => {
                  toggleMoreMenu();
                }}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuList autoFocusItem={!!anchorEl} disablePadding>
                  {views.map((v) => (
                    <MenuItem
                      key={v}
                      selected={v === view}
                      onClick={() => {
                        toggleMoreMenu();
                        handleState(v, "view");
                      }}
                    >
                      {v}
                    </MenuItem>
                  ))}
                </MenuList>
              </Popover>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export { Navigation };
