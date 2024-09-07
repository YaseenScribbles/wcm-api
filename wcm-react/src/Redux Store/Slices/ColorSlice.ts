import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, Status } from "../../assets/common";
import axios from "axios";

type Color = {
    id: number;
    name: string;
};

type ColorSlice = {
    status: string;
    colors: Color[];
};

const initialState: ColorSlice = {
    status: Status.loading,
    colors: [],
};

const colorSlice = createSlice({
    name: "colorSlice",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getColors.pending,(state, _) => {
            state.status = Status.loading;
        }).addCase(getColors.rejected,() => {
                return {
                    status: Status.failure,
                    colors: []
                }
        }).addCase(getColors.fulfilled,(_,action) => {
            return {
                status: Status.success,
                colors: action.payload
            }
        })
    }
});

export const getColors = createAsyncThunk("colors", async () => {
    try {
        const resp = await axios.get(`${API_URL}/color?all=true`,{
            headers: {
                Accept: "application/json"
            }
        });
        return resp.data;
    } catch (error) {
        return [];
    }
});



// Extract and export each action creator by name
export const {  } = colorSlice.actions
// Export the reducer, either as a default or named export
export default colorSlice.reducer
