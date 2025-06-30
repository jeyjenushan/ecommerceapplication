import {createSlice,createAsyncThunk}from "@reduxjs/toolkit"
import axios from "axios"

//fetch all users(admin only)
export const fetchUsers=createAsyncThunk("admin/fetchUsers",async(_,{rejectWithValue})=>{
    try {
        const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        })
        console.log(data)
        return data;
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})


//Async thunk to create a new users
export const addUsers=createAsyncThunk("admin/addUsers",async(userData,{rejectWithValue})=>{
    try {
        const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,userData,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        })
        console.log(data)
        return data;
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})


//Async thunk to update a  users info
export const updateUsers=createAsyncThunk("admin/updateUser",async({id,name,email,role},{rejectWithValue})=>{
    try {
        const {data}=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,{name,email,role},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        })
        console.log(data)
        return data;
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})


//Async thunk to delete a  users info
export const deleteUser=createAsyncThunk("admin/deleteUser",async(id,{rejectWithValue})=>{
    try {
        const {data}=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        })

        return id;
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})




const adminSlice=createSlice({
    name:"admin",
    initialState:{
          users:[],
          loading:false,
          error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
          .addCase(fetchUsers.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(fetchUsers.fulfilled,(state,action)=>{
            state.loading=false;
            state.users=action.payload
          })
            .addCase(fetchUsers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message
          })
            .addCase(updateUsers.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(updateUsers.fulfilled,(state,action)=>{
            state.loading=false;
            const updateUser=action.payload;
            const userIndex=state.users.findIndex((user)=>user._id==updateUser._id)
               if(userIndex!==-1){
                state.users[userIndex]=updateUser
             }
          })
            .addCase(deleteUser.fulfilled,(state,action)=>{
                    state.users=state.users.filter((user)=>{
                        user._id!==action.payload
                    })
          })
        .addCase(addUsers.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(addUsers.fulfilled,(state,action)=>{
            state.loading=false;
            state.users.push(action.payload)
          })
            .addCase(addUsers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message
          })
    }
    
    
})

export default adminSlice.reducer