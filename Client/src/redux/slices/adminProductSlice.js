import {createSlice,createAsyncThunk}from "@reduxjs/toolkit"
import axios from "axios"

//async thunk to fetch admin products
export const fetchAdminProducts=createAsyncThunk("adminProducts/fetchProducts",async(_,{rejectWithValue})=>{
    try {
        const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,{
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


//Async thunk to create a new product
export const createProduct=createAsyncThunk("adminProducts/createProduct",async(productData,{rejectWithValue})=>{
    try {
        const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,productData,{
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


//Async thunk to update a  existing product
export const updateProduct=createAsyncThunk("adminProducts/updateProduct",async({id,productData},{rejectWithValue})=>{
    try {
        const {data}=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,productData,{
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
export const deletePRODUCT=createAsyncThunk("adminProducts/deleteProduct",async(id,{rejectWithValue})=>{
    try {
        const {data}=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,{
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




const adminProductSlice=createSlice({
    name:"adminProducts",
    initialState:{
          products:[],
          loading:false,
          error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
          .addCase(fetchAdminProducts.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(fetchAdminProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload
          })
            .addCase(fetchAdminProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message
          })
            .addCase(updateProduct.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(updateProduct.fulfilled,(state,action)=>{
            state.loading=false;
            const updatedProduct=action.payload;
            const productIndex=state.products.findIndex((product)=>product._id==updatedProduct._id)
               if(productIndex!==-1){
                state.products[productIndex]=updatedProduct
             }
          })
            .addCase(deletePRODUCT.fulfilled,(state,action)=>{
                    state.products=state.products.filter((product)=>{
                        product._id!==action.payload
                    })
          })
        .addCase(createProduct.pending,(state)=>{
            state.loading=true;
            state.error=null
          })
          .addCase(createProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products.push(action.payload)
          })
            .addCase(createProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message
          })
    }
    
    
})

export default adminProductSlice.reducer