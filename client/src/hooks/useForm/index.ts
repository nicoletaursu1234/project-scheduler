import { PayloadActionCreator } from '@reduxjs/toolkit';
import { useCallback, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const useForm = <T = { [key: string]: string | number }>(
  actionCreator: PayloadActionCreator<T>
) => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);
      const resultObject = {};

      for (const [name, value] of form.entries()) {
        resultObject[name] = value;
      }

      if (actionCreator instanceof Function)
        dispatch(actionCreator({ ...resultObject, push }));
    },
    [dispatch, actionCreator]
  );

  return { onSubmit };
};

export default useForm;
