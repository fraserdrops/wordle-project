import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appSend } from "../features/switchboard/switchboardSlice";
import { AppEventSchema } from "../machines/AppMachine";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSend = () => {
  const dispatch = useAppDispatch();
  return (event: AppEventSchema) => {
    dispatch(appSend(event));
  };
};
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
