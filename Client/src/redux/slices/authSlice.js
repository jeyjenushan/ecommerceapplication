//createAsyncThunk:asynchronous api call

import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"



//Retrieve user info and token from localstorage if available
const userFromStorage=localStorage.getItem("userInfo")?
JSON.parse(localStorage.getItem("userInfo")):null;

//Check for an existing guest ID in the localStorage or generate a new one
const initialGuestId=
localStorage.getItem("guestId")|| `guest_${new Date().getTime()}`;
localStorage.setItem("guestId",initialGuestId)

//Initial State
const initialState={
    user:userFromStorage,
    guestId:initialGuestId,
    loading:false,
    error:null
}
//Asyn thunk for User Login
//auth/loginUser : action
export const loginUser=createAsyncThunk("auth/loginUser",
    async(userData,{rejectWithValue})=>{
        try {
            const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,userData)
            localStorage.setItem("userInfo",JSON.stringify(data.user))
              localStorage.setItem("userToken",data.token)
              console.log(data)
              return data.user;//Return the user object from the response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })


export const registerUser=createAsyncThunk("auth/registerUser",
    async(userData,{rejectWithValue})=>{
        try {
            const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`,userData)
            localStorage.setItem("userInfo",JSON.stringify(data.user))
              localStorage.setItem("userToken",data.token)
              console.log(data)
              return data.user;//Return the user object from the response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })
//Slice
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.guestId=`guest_${new Date().getTime()}`//Reset guestId on logout
            localStorage.removeItem("userInfo")
            localStorage.removeItem("userToken")
            localStorage.setItem("guestId",state.guestId)//set new guest id
        },
        generateNewGuestId:(state)=>{
              state.guestId=`guest_${new Date().getTime()}`
               localStorage.setItem("guestId",state.guestId)
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading=true
            state.error=null
          })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false
            state.error=action.payload
          })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false
             state.error = (
                action.payload?.message ||    // From rejectWithValue
                action.error?.message ||      // From the original error
                'Login failed'               // Default fallback
            )
          })
        .addCase(registerUser.pending,(state)=>{
            state.loading=true
            state.error=null
          })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false
            state.error=action.payload
          })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false
               state.error = (
                action.payload?.message ||
                action.error?.message ||
                'Registration failed'
            )
          })
    }
})

export const {logout,generateNewGuestId}=authSlice.actions;
export default authSlice.reducer;


