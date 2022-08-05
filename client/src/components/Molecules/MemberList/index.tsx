import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectCalendars } from "store/selectors/calendar";
import UserPhoto from "components/Organisms/UserPhoto";
import { removeMember } from "store/calendar";

const MemberList = () => {
  const dispatch = useDispatch();
  const { currCalendar: calendar } = useSelector(selectCalendars);

  return (
    <Wrapper>
      {calendar &&
        calendar?.members?.map(({ email, avatar }) => {
          return (
            <ListItem key={email}>
              <Left>
                <UserPhoto path={avatar} width="30px" />
                <p style={{ marginLeft: "10px" }}>{email}</p>
              </Left>
              <Right>
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatch(removeMember({ id: calendar?.id, member: email }))
                  }
                />
              </Right>
            </ListItem>
          );
        })}
    </Wrapper>
  );
};

export default MemberList;

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
`;
export const ListItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
`;

export const Right = styled.div``;
