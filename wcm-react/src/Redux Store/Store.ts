import { configureStore } from "@reduxjs/toolkit";
import ClothSlice from "./Slices/ClothSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import ColorSlice from "./Slices/ColorSlice";
import ContactSlice from "./Slices/ContactSlice";

const store = configureStore({
    reducer: {
        cloths: ClothSlice,
        colors: ColorSlice,
        contacts: ContactSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch =  typeof store.dispatch
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

