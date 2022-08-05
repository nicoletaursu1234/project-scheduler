import React, { Fragment, useState } from "react";
import {
  Popover,
  Typography,
  ButtonBase,
  useTheme,
  IconButton,
  Button,
  Slide,
  Paper,
  Link,
} from "@mui/material";
import { format } from "date-fns";
import Editor from "../Editor";
import { ProcessedEvent } from "../../types";
import { useAppState } from "../../hooks/useAppState";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { PopperInner } from "../../styles/styles";
import { useDispatch } from "react-redux";
import { deleteActivity } from "store/activity";
import { InsertLink, MyLocation } from "@material-ui/icons";

interface EventItemProps {
  event: ProcessedEvent;
  multiday: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
  startHour?: number;
  endHour?: number;
}

const EventItem = ({
  event,
  multiday,
  hasPrev,
  hasNext,
  showdate,
}: EventItemProps) => {
  const dispatch = useDispatch();
  const {
    triggerDialog,
    triggerLoading,
    direction,
    resources,
    resourceFields,
    locale,
    viewerTitleComponent,
  } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();

  const NextArrow =
    direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow =
    direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;

  const triggerViewer = (el?: Element) => {
    if (!el && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el || null);
  };

  const handleConfirmDelete = async () => {
    try {
      triggerLoading(true);
      let deletedId = event.id;

      if (deletedId) {
        dispatch(deleteActivity(deletedId));
        triggerViewer();
      }
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };

  let item = (
    <div style={{ padding: 2 }}>
      <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
        {event.title}
      </Typography>
      {showdate && (
        <Typography style={{ fontSize: 11 }} noWrap>
          {`${format(new Date(event.startDateTime), "hh:mm a", {
            locale: locale,
          })} - ${format(new Date(event.endDateTime), "hh:mm a", {
            locale: locale,
          })}`}
        </Typography>
      )}
    </div>
  );

  if (multiday) {
    item = (
      <div
        style={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 11 }} noWrap>
          {hasPrev ? (
            <PrevArrow fontSize="small" sx={{ display: "flex" }} />
          ) : (
            showdate &&
            format(new Date(event.startDateTime), "hh:mm a", { locale: locale })
          )}
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontSize: 12 }}
          noWrap
        >
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: 11 }} noWrap>
          {hasNext ? (
            <NextArrow fontSize="small" sx={{ display: "flex" }} />
          ) : (
            showdate && format(event.endDateTime, "hh:mm a", { locale: locale })
          )}
        </Typography>
      </div>
    );
  }

  const renderViewer = () => {
    const idKey = resourceFields.idField;
    const hasResource = resources.filter((res) =>
      Array.isArray(event[idKey])
        ? event[idKey].includes(res[idKey])
        : res[idKey] === event[idKey]
    );

    return (
      <PopperInner
        sx={{
          width: "calc(100vw - 32px)",
          maxWidth: "900px",
          minWidth: "auto",
        }}
      >
        <div
          style={{
            background: event.color || theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <div className="rs__popper_actions">
            <div>
              <IconButton
                size="small"
                onClick={() => {
                  triggerViewer();
                }}
              >
                <ClearRoundedIcon style={{ color: "black" }} />
              </IconButton>
            </div>
            <div style={{ display: "inherit" }}>
              <IconButton
                size="small"
                style={{ color: theme.palette.primary.contrastText }}
                onClick={() => {
                  triggerViewer();
                  triggerDialog(true, event);
                }}
              >
                <EditRoundedIcon />
              </IconButton>
              {!deleteConfirm && (
                <IconButton
                  size="small"
                  style={{ color: theme.palette.primary.contrastText }}
                  onClick={() => setDeleteConfirm(true)}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              )}
              <Slide
                in={deleteConfirm}
                direction={direction === "rtl" ? "right" : "left"}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <Button
                    style={{ color: theme.palette.error.main }}
                    size="small"
                    onClick={handleConfirmDelete}
                  >
                    DELETE
                  </Button>
                  <Button
                    style={{ color: theme.palette.action.disabled }}
                    size="small"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    CANCEL
                  </Button>
                </div>
              </Slide>
            </div>
          </div>
          {viewerTitleComponent instanceof Function ? (
            viewerTitleComponent(event)
          ) : (
            <Typography variant="h6" style={{ padding: "5px 0" }} noWrap>
              {event.title}
            </Typography>
          )}
        </div>

        <div style={{ padding: "10px" }}>
          {event?.description && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" noWrap>
                {event.description}
              </Typography>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <EventNoteRoundedIcon />
            <Typography
              variant="subtitle2"
              noWrap
              style={{ marginLeft: "5px" }}
            >
              {`${format(
                new Date(event.startDateTime),
                "dd MMMM yyyy hh:mm a",
                {
                  locale: locale,
                }
              )} - ${format(
                new Date(event.endDateTime),
                "dd MMMM yyyy hh:mm a",
                {
                  locale: locale,
                }
              )}`}
            </Typography>
          </div>
          {event?.location && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <MyLocation />
              <Typography
                style={{ marginLeft: "5px" }}
                variant="subtitle2"
                noWrap
              >
                {event.location}
              </Typography>
            </div>
          )}
          {event?.links && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <InsertLink />
              <Typography
                style={{ marginLeft: "5px" }}
                variant="subtitle2"
                noWrap
              >
                <Link href={event.links} underline="none">
                  {event.links}
                </Link>
              </Typography>
            </div>
          )}
        </div>

        <Editor event={event} />
      </PopperInner>
    );
  };

  return (
    <Fragment>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: event.disabled
            ? "#d0d0d0"
            : event.color || theme.palette.primary.main,
          color: event.disabled
            ? "#808080"
            : theme.palette.primary.contrastText,
          cursor: event.disabled ? "not-allowed" : "pointer",
          overflow: "hidden",
        }}
      >
        <ButtonBase
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerViewer(e.currentTarget);
          }}
          disabled={event.disabled}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <div
            style={{
              height: "100%",
            }}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData("text/plain", `${event.id}`);
              e.currentTarget.style.backgroundColor = theme.palette.error.main;
            }}
            onDragEnd={(e) => {
              e.currentTarget.style.backgroundColor =
                event.color || theme.palette.primary.main;
            }}
            onDragOver={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onDragEnter={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {item}
          </div>
        </ButtonBase>
      </Paper>

      {/* Viewer */}
      <Popover
        sx={{
          borderRadius: "4px",
          minWidth: "auto",
          "& .MuiPaper-root.MuiPopover-paper": {
            width: "calc(100vw - 32px)",
            maxWidth: "900px",
          },
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={(e) => {
          triggerViewer();
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {renderViewer()}
      </Popover>
    </Fragment>
  );
};

EventItem.defaultProps = {
  multiday: false,
  showdate: true,
};

export default EventItem;
