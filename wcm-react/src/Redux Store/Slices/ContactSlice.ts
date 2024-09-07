import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL, Status } from "../../assets/common"
import axios from "axios";

type Contact = {
    id: number;
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    gst: string;
};

type ContactSlice = {
    status: string;
    contacts: Contact[];
}

const initialState : ContactSlice = {
    status: Status.loading,
    contacts: []
}

const contactSlice = createSlice({
    name: "contactSlice",
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder.addCase(getContacts.pending,(state, _) => {
            state.status = Status.loading;
        }).addCase(getContacts.rejected,() => {
                return {
                    status: Status.failure,
                    contacts: []
                }
        }).addCase(getContacts.fulfilled,(_,action) => {
            return {
                status: Status.success,
                contacts: action.payload
            }
        })
    }
})

const getContacts = createAsyncThunk("/contacts", async () => {
    try {
        const resp = await axios.get(`${API_URL}/contact?all=true`,{
            headers: {
                Accept: "application/json"
            }
        });
        return resp.data;
    } catch (error) {
        return [];
    }
})

// Extract and export each action creator by name
export const {  } = contactSlice.actions
// Export the reducer, either as a default or named export
export default contactSlice.reducer
