import React from "react";
import { Typography } from "@mui/material";
import { format, isToday } from "date-fns";

interface TodayTypoProps {
  date: Date;
  onClick?(day: Date): void;
}

const TodayTypo = ({ date, onClick }: TodayTypoProps) => {
  return (
    <div>
      <Typography
        style={{
          fontWeight: isToday(date) ? "bold" : "inherit",
          color: isToday(date) ? "#88c4ff" : "inherit",
        }}
        className={onClick ? "rs__hover__op" : ""}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(date);
        }}
      >
        {format(date, "dd")}
      </Typography>
      <Typography
        style={{
          fontWeight: isToday(date) ? "bold" : "inherit",
          color: isToday(date) ? "#88c4ff" : "inherit",
          fontSize: 11,
        }}
      >
        {format(date, "eee")}
      </Typography>
    </div>
  );
};

export default TodayTypo;
