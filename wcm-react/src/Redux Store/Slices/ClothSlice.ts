import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, Status } from "../../assets/common";
import axios from "axios";

type Cloth = {
    id: number;
    name: string;
};

type ClothSlice = {
    status: string;
    cloths: Cloth[];
};

const initialState: ClothSlice = {
    status: Status.loading,
    cloths: [],
};

const clothSlice = createSlice({
    name: "clothSlice",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCloths.pending,(state, _) => {
            state.status = Status.loading;
        }).addCase(getCloths.rejected,() => {
                return {
                    status: Status.failure,
                    cloths: []
                }
        }).addCase(getCloths.fulfilled,(_,action) => {
            return {
                status: Status.success,
                cloths: action.payload
            }
        })
    }
});

export const getCloths = createAsyncThunk("cloths", async () => {
    try {
        const resp = await axios.get(`${API_URL}cloth?all=true`,{
            headers: {
                Accept: "application/json"
            }
        });
        return resp.data.cloths;
    } catch (error) {
        return [];
    }
});



// Extract and export each action creator by name
export const {  } = clothSlice.actions
// Export the reducer, either as a default or named export
export default clothSlice.reducer
