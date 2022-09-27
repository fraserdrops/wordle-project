import { configureStore } from "@reduxjs/toolkit";
import gameReduce from "../features/game/gameSlice";
import statsReducer from "../features/stats/statsSlice";
import viewReducer from "../features/view/viewSlice";
import switchboardReducer from "../features/switchboard/switchboardSlice";

export const store = configureStore({
  reducer: {
    gameState: gameReduce,
    statsState: statsReducer,
    viewState: viewReducer,
    switchboardState: switchboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['*'],
        // Ignore these field paths in all actions
        // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ["switchboardState.appComponent"],
      },
    }),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type GetState = typeof store.getState;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
