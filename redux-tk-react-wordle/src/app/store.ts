import { configureStore } from "@reduxjs/toolkit";
import gameReduce from "../features/game/gameSlice";
import statsReducer from "../features/stats/statsSlice";
import viewReducer from "../features/view/viewSlice";

export const store = configureStore({
  reducer: {
    gameState: gameReduce,
    statsState: statsReducer,
    viewState: viewReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type GetState = typeof store.getState;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
