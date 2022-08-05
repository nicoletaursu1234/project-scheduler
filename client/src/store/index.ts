import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import user from 'components/Organisms/SignUpInForm/store/userSlice';
import snack from 'components/Molecules/Snack/store/snackSlice';
import calendars from "./calendar";
import activities from "./activity";
import comments from "./comment";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    user,
    snack,
    calendars,
    activities,
    comments,
  },
  middleware: [sagaMiddleware],
  devTools: true,
});

sagaMiddleware.run(rootSaga);

export default store;
