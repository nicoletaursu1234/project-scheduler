import { openSnack } from "components/Molecules/Snack/store/snackSlice";
import { takeLatest, call, put } from "redux-saga/effects";
import { commentsGet, commentCreatePost, commentDelete } from "utils/requests";
import {
  createComment,
  createCommentSuccess,
  deleteComment,
  deleteCommentSuccess,
  getComments,
  getCommentsSuccess,
} from "./index";

function* getCommentsSaga({ payload }) {
  try {
    const response = yield call(commentsGet, payload);

    yield put(getCommentsSuccess(response));
  } catch (e) {
    console.error(`Comments not fetched. Reason: ${e}`);
  }
}

function* createCommentSaga({ payload }) {
  const { id, ...comment } = payload;

  try {
    const response = yield call(commentCreatePost, id, comment);

    yield put(createCommentSuccess(response));
    yield put(openSnack({ text: `Comment added` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Comment was not added. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* deleteCommentSaga({ payload }) {
  try {
    yield call(commentDelete, payload);

    yield put(deleteCommentSuccess(payload));
    yield put(openSnack({ text: `Comment deleted` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Comment could not be deleted. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

export function* commentSaga(): Generator {
  yield takeLatest(getComments, getCommentsSaga);
  yield takeLatest(createComment, createCommentSaga);
  yield takeLatest(deleteComment, deleteCommentSaga);
}
