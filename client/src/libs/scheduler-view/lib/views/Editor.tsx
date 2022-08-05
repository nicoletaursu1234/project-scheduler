import React, { Fragment, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { addMinutes, differenceInMinutes } from "date-fns";
import { EditorDatePicker } from "../components/inputs/DatePicker";
import { EditorInput } from "../components/inputs/Input";
import { SelectedRange } from "../context/state/stateContext";
import { useAppState } from "../hooks/useAppState";
import {
  EventActions,
  FieldInputProps,
  FieldProps,
  InputTypes,
  ProcessedEvent,
  SchedulerHelpers,
} from "../types";
import { EditorSelect } from "../components/inputs/SelectInput";
import { arraytizeFieldVal } from "../helpers/generals";
import { createActivity, updateActivity } from "store/activity";
import { useDispatch, useSelector } from "react-redux";
import { selectCalendars } from "store/selectors/calendar";

export type StateItem = {
  value: any;
  validity: boolean;
  type: InputTypes;
  config?: FieldInputProps;
};

export type StateEvent = (ProcessedEvent & SelectedRange) | Record<string, any>;

const initialState = (
  fields: FieldProps[],
  event?: StateEvent
): Record<string, StateItem> => {
  const customFields = {} as Record<string, StateItem>;
  for (const field of fields) {
    const lower = field.name.toLowerCase();
    const defVal = arraytizeFieldVal(field, field.default, event);
    const eveVal = arraytizeFieldVal(field, event?.[field.name], event);

    customFields[lower] = {
      value: eveVal.value || defVal.value || "",
      validity: field.config?.required
        ? !!eveVal.validity || !!defVal.validity
        : true,
      type: field.type,
      config: field.config,
    };
  }

  return {
    id: {
      value: event?.id || null,
      validity: true,
      type: "hidden",
    },
    title: {
      value: event?.title || "",
      validity: !!event?.title,
      type: "input",
      config: { label: "Title", required: true, min: 3 },
    },
    startDateTime: {
      value: event?.startDateTime || new Date(),
      validity: true,
      type: "date",
      config: { label: "Start", sm: 6 },
    },
    endDateTime: {
      value: event?.endDateTime || new Date(),
      validity: true,
      type: "date",
      config: { label: "End", sm: 6 },
    },
    description: {
      value: event?.description || "",
      validity: true,
      type: "input",
      config: { label: "Description" },
    },
    location: {
      value: event?.location || "",
      validity: true,
      type: "input",
      config: { label: "Location" },
    },
    links: {
      value: event?.links || "",
      validity: true,
      type: "input",
      config: { label: "Links", min: 6 },
    },
  };
};

const Editor = () => {
  const dispatch = useDispatch();
  const { currCalendar } = useSelector(selectCalendars);
  const {
    fields,
    dialog,
    triggerDialog,
    selectedRange,
    selectedEvent,
    triggerLoading,
    onConfirm,
    customEditor,
    confirmEvent,
    dialogMaxWidth,
  } = useAppState();
  const [state, setState] = useState(
    initialState(fields, selectedEvent || selectedRange)
  );
  const [touched, setTouched] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEditorState = (name: string, value: any, validity: boolean) => {
    setState((prev) => {
      return {
        ...prev,
        [name]: { ...prev[name], value, validity },
      };
    });
  };

  const handleClose = (clearState?: boolean) => {
    if (clearState) {
      setState(initialState(fields));
    }
    triggerDialog(false);
  };

  const handleConfirm = async () => {
    let body = {} as ProcessedEvent;
    for (const key in state) {
      body[key] = state[key].value;
      if (!customEditor && !state[key].validity) {
        return setTouched(true);
      }
    }
    try {
      triggerLoading(true);

      body.endDateTime =
        body.startDateTime >= body.endDateTime
          ? addMinutes(
              body.startDateTime,
              differenceInMinutes(
                selectedRange?.endDateTime!,
                selectedRange?.startDateTime!
              )
            )
          : body.endDateTime;

      const action: EventActions = selectedEvent?.id ? "edit" : "create";

      console.warn(body);
      // if (onConfirm) {
      //   body = await onConfirm(body, action);
      // } else {
      //   body.id =
      //     selectedEvent?.id ||
      //     Date.now().toString(36) + Math.random().toString(36).slice(2);
      // }

      if (body.id) {
        dispatch(updateActivity(body));
      } else {
        dispatch(createActivity({ ...body, calendarId: currCalendar.id }));
      }

      handleClose(true);
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };
  const renderInputs = (key: string) => {
    const stateItem = state[key];
    switch (stateItem.type) {
      case "input":
        return (
          <EditorInput
            value={stateItem.value}
            name={key}
            onChange={handleEditorState}
            touched={touched}
            {...stateItem.config}
          />
        );
      case "date":
        return (
          <EditorDatePicker
            value={stateItem.value}
            name={key}
            onChange={(...args) => handleEditorState(...args, true)}
            {...stateItem.config}
          />
        );
      case "select":
        const field = fields.find((f) => f.name === key);
        return (
          <EditorSelect
            value={stateItem.value}
            name={key}
            options={field?.options || []}
            onChange={handleEditorState}
            touched={touched}
            {...stateItem.config}
          />
        );
      default:
        return "";
    }
  };

  const renderEditor = () => {
    if (customEditor) {
      const schedulerHelpers: SchedulerHelpers = {
        state,
        close: () => triggerDialog(false),
        loading: (load) => triggerLoading(load),
        edited: selectedEvent,
        onConfirm: confirmEvent,
      };
      return customEditor(schedulerHelpers);
    }
    return (
      <Fragment>
        <DialogTitle>{selectedEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent style={{ overflowX: "hidden" }}>
          <Grid container spacing={1}>
            {Object.keys(state).map((key) => {
              const item = state[key];
              return (
                <Grid item key={key} sm={item.config?.sm} xs={12}>
                  {renderInputs(key)}
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button color="primary" fullWidth onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Fragment>
    );
  };

  return (
    <Dialog open={dialog} fullScreen={isMobile} maxWidth={dialogMaxWidth}>
      {renderEditor()}
    </Dialog>
  );
};

export default Editor;
