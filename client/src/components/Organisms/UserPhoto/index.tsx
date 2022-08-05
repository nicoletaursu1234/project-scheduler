import { AccountCircleOutlined } from "@material-ui/icons";
import React from "react";
import { Photo } from "./styles";

interface IProps {
  path?: string;
  width: string;
  onClick?: () => void;
  children?: Element;
}

const UserPhoto = ({ path, width, onClick }: IProps) => {
  return (
    <Photo width={width} onClick={onClick}>
      {path ? (
        <img src={`http://localhost:3000${path}`} alt="avatar" />
      ) : (
        <AccountCircleOutlined
          style={{
            fontSize: width,
            cursor: "pointer",
            color: "#eee",
          }}
        />
      )}
    </Photo>
  );
};

export default UserPhoto;
