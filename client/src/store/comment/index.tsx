import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    getComments(state, { payload }) {},
    getCommentsSuccess(state, { payload }) {
      state.comments = payload || initialState.comments;
    },
    createComment(state, { payload }) {},
    createCommentSuccess(state, { payload }) {
      state.comments.push(payload);
      return state;
    },
    deleteComment(state, { payload }) {},
    deleteCommentSuccess(state, { payload }) {
      const deleteIndex = state.comments.indexOf(
        state.comments.find(({ id }) => payload.id === id)
      );

      state.comments.splice(deleteIndex, 1);
      return state;
    },
  },
});

export const {
  getComments,
  getCommentsSuccess,
  createComment,
  createCommentSuccess,
  deleteComment,
  deleteCommentSuccess,
} = commentSlice.actions;

export default commentSlice.reducer;
