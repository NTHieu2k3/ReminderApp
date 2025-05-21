import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

//Dùng để dispatch các thunk actions và slide actions
export const useAppDispatch: () => AppDispatch = useDispatch;

//Dùng để lấy state từ store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
