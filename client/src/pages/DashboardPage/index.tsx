import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Delete,
  AddCircleOutline,
  AccountCircleOutlined,
  LogoutOutlined,
  JoinFull,
  JoinInner,
  MergeTypeRounded,
} from "@mui/icons-material";
import { Chip, MenuItem, Typography } from "@mui/material";
import {
  Wrapper,
  Header,
  Heading,
  List,
  ListItem,
  Name,
  Description,
  Details,
  SidebarItems,
  SidebarItem,
  SidebarWrapper,
} from "./styled";
import CalendarForm from "components/Organisms/CalendarForm";
import Sidebar from "libs/scheduler-view/lib/components/Sidebar";
import SignUpForm from "components/Organisms/SignUpInForm/SignUpForm";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "store/selectors/user";
import UserPhoto from "components/Organisms/UserPhoto";
import { selectCalendars } from "store/selectors/calendar";
import { deleteCalendar, getCalendars } from "store/calendar";
import MergeModal from "components/Organisms/MergeModal";

const DashboardPage = ({ history, ...props }) => {
  const dispatch = useDispatch();
  const { calendars } = useSelector(selectCalendars);
  const user = useSelector(selectUser);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getCalendars());
  }, []);

  const onDelete = useCallback((id) => {
    dispatch(deleteCalendar(id));
  }, []);

  return (
    <Wrapper>
      {isFormOpen && (
        <CalendarForm isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />
      )}
      {isMergeModalOpen && (
        <MergeModal
          calendars={calendars}
          isMergeModalOpen={isMergeModalOpen}
          setIsMergeModalOpen={setIsMergeModalOpen}
        />
      )}
      {isSidebarOpen && (
        <Sidebar
          triggerSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          anchorLocation="right"
          open={isSidebarOpen}
        >
          <SidebarWrapper>
            <div>
              <Typography
                sx={{
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Your profile
              </Typography>
              <SignUpForm isSidebarForm={true} user={user} />
            </div>
            <SidebarItems>
              <SidebarItem
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  history.push("/sign-in");
                }}
              >
                <LogoutOutlined />
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Log out
                </Typography>
              </SidebarItem>
            </SidebarItems>
          </SidebarWrapper>
        </Sidebar>
      )}
      <Header>
        <Heading>Your calendars</Heading>
        <div
          style={{
            display: "flex",
            width: "130px",
            justifyContent: "space-between",
          }}
        >
          <AddCircleOutline
            style={{
              fontSize: "35px",
              cursor: "pointer",
              color: "#eee",
            }}
            onClick={() => {
              setIsFormOpen(true);
            }}
          />
          <MergeTypeRounded
            style={{
              fontSize: "35px",
              cursor: "pointer",
              color: "#eee",
            }}
            onClick={() => {
              setIsMergeModalOpen(true);
            }}
          />
          <UserPhoto
            path={user?.avatar}
            width="35px"
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          />
        </div>
      </Header>
      <List>
        {calendars.map((calendar) => {
          return (
            <ListItem key={calendar.id}>
              <Details
                onClick={() =>
                  history.push({
                    pathname: `/calendar/${calendar?.id}`,
                  })
                }
              >
                <Name>
                  {calendar?.name}
                  <Description>{calendar?.description}</Description>
                </Name>

                <Chip
                  style={{ marginLeft: "15px" }}
                  size="small"
                  color={calendar?.isPublic ? "success" : "primary"}
                  label={calendar?.isPublic ? "Public" : "Private"}
                  variant="outlined"
                />
              </Details>
              <Delete
                style={{ fontSize: "25px", color: "red" }}
                onClick={() => onDelete(calendar.id)}
              />
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};

export default DashboardPage;
