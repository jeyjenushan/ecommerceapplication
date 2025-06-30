import {createSlice,createAsyncThunk}from "@reduxjs/toolkit"
import axios from "axios"

//async thunk to fetch all orders admin only
export const fetchAllOrders=createAsyncThunk("adminOrders/fetchAllOrders",async(_,{rejectWithValue})=>{
    try {
        const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,{
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



//Async thunk to update order delivery status
export const updateOrderStatus=createAsyncThunk("adminOrders/updateOrderStatus",async({id,status},{rejectWithValue})=>{
    try {
        const {data}=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,{status},{
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


//Async thunk to delete a  product
export const deleteOrder=createAsyncThunk("adminOrders/deleteOrder",async(id,{rejectWithValue})=>{
    try {
        const {data}=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,{
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




const adminOrderslice=createSlice({
    name:"adminOrders",
    initialState:{
          orders:[],
          totalOrders:0,
          totalSales:0,
          loading:false,
          error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
          .addCase(fetchAllOrders.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload;
            state.totalOrders=action.payload.length;
            const totalSales=action.payload.reduce((arr,order)=>{
                return arr+order.totalPrice;
            },0)
            state.totalSales=totalSales})

            .addCase(fetchAllOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message
          })


          .addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const updatedOrder=action.payload;
            const orderIndex=state.orders.findIndex((order)=>order._id==updatedOrder._id)
            if(orderIndex!==-1){
                state.orders[orderIndex]=updatedOrder
             }
          })
            .addCase(deleteOrder.fulfilled,(state,action)=>{
                    state.orders=state.orders.filter((order)=>{
                        order._id!==action.payload
                    })
          })

    }
    
    
})

export default adminOrderslice.reducer