import { fork } from "redux-saga/effects";
import { userSaga } from "components/Organisms/SignUpInForm/store/sagas";
import { calendarSaga } from "./calendar/sagas";
import { activitySaga } from "./activity/sagas";
import { commentSaga } from "./comment/sagas";

export default function* rootSaga() {
  yield fork(userSaga);
  yield fork(calendarSaga);
  yield fork(activitySaga);
  yield fork(commentSaga);
}
