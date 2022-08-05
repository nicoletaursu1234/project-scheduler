import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Divider, TextareaAutosize, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useDispatch, useSelector } from "react-redux";
import { createComment, getComments, deleteComment } from "store/comment";
import { selectComments } from "store/selectors/comment";
import {
  CreatedDate,
  Timezone,
  UserFullName,
  Country,
  CurrDate,
  UserInfo,
} from "./styles";
import UserPhoto from "components/Organisms/UserPhoto";
import { Country as Countries } from "const/countries";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "path";

const Editor = ({ event }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { comments } = useSelector(selectComments);

  useEffect(() => {
    dispatch(getComments(event?.id));
  }, [event]);

  console.log(comments);
  console.warn(formatInTimeZone(new Date(), "Europe/Oslo", "HH:mm"));
  return (
    <StyledEditorWrapper>
      <Divider />
      <Typography style={{ paddingTop: "10px" }}>Comments</Typography>
      <CommentSection>
        {!comments?.length ? (
          <Typography align="center">No comments yet</Typography>
        ) : (
          comments.map((comment, index) => (
            <CommentWrapper key={comment.id}>
              <UserInfo>
                <UserPhoto path={comment.sender.avatar} width="30px" />
                <UserFullName>{comment.sender.fullName}</UserFullName>
                <Timezone>
                  <Country>{comment.sender.country}</Country>
                  <CurrDate>
                    {formatInTimeZone(
                      new Date(),
                      Countries[comment.sender.country]?.ianaTimezone,
                      "HH:mm"
                    )}
                  </CurrDate>
                </Timezone>
              </UserInfo>
              <Comment>{comment.text}</Comment>
              <CreatedDate>
                Created at {comment.createdAt.split("T")[0]}
              </CreatedDate>
            </CommentWrapper>
          ))
        )}
      </CommentSection>
      <EditorWrapper>
        <TextareaAutosize
          value={text}
          onChange={(e) => setText(e.target.value)}
          minRows={3}
          placeholder="Write a comment"
          style={{ width: "100%", padding: "10px", borderRadius: "10px" }}
        />
        <SendOutlinedIcon
          style={{ padding: "5px", fontSize: "35px" }}
          onClick={() => {
            dispatch(createComment({ id: event.id, text }));
          }}
        />
      </EditorWrapper>
    </StyledEditorWrapper>
  );
};

const StyledEditorWrapper = styled.div`
  with: auto;

  & > div {
    padding: 0;
  }
  && p {
    margin: 0;
  }
`;
const CommentSection = styled.div`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 0.5px solid #ccc;
  border-radius: 10px;
`;
const CommentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 10px;
`;
const Comment = styled.div`
  width: 100%;
  padding: 10px 0 5px 0;
`;
const EditorWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: space-between;
`;

export default Editor;
