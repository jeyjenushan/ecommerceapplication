import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


//Async thunk to fetch Products by giters and conditions
export const fetchProductsByFilters=createAsyncThunk("products/fetchByFilters",async({
    collection,size,color,gender,minPrice,maxPrice,sortBy,search,category,material,brand,limit
})=>{
    const query=new URLSearchParams()
    if(collection) query.append("collection",collection)
    if(size) query.append("size",size)
    if(color) query.append("color",color)
    if(gender) query.append("gender",gender)
    if(minPrice) query.append("minPrice",minPrice)
    if(maxPrice) query.append("maxPrice",maxPrice)
    if(sortBy) query.append("sortBy",sortBy)
    if(search) query.append("search",search)
    if(category) query.append("category",category)
    if(material) query.append("material",material)
    if(brand) query.append("brand",brand)
    if(limit)query.append("limit",limit)

    const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`)

    console.log(data)

    return data;

})

//Async thunk to fetch a single product by ID
export const fetchProductDetails=createAsyncThunk("products/fetchProductDetails",async(id)=>{
      const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`)

    console.log(data)

    return data;


})

//Async thunk to update Products
export const updateProduct=createAsyncThunk("products/updateProduct",async({id,productData})=>{
      const {data}=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,productData,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("userToken")}`
        }
      })

    console.log(data)

    return data;


})


//Async thunk to fetch a similar products 
export const fetchSimilarProducts=createAsyncThunk("products/fetchSimilarProducts",async({id})=>{
      const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`)

    console.log(data)

    return data;


})


const productSlice=createSlice({
    name:"products",
    initialState:{
        products:[],
        selectedProduct:null,
        similarProducts:[],
        loading:false,
        error:null,
        filters:{
            category:"",
            size:"",
            color:"",
            gender:"",
            brand:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            material:"",
            collection:""

        }
    },
    reducers:{
        setFilters:(state,action)=>{
            state.filters={...state.filters,...action.payload}
        },
        clearFilters:(state)=>{
            state.filters={
            category:"",
            size:"",
            color:"",
            gender:"",
            brand:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            material:"",
            collection:""
            }
        }

    },
    extraReducers:(builder)=>{
        builder
        //handle fetching products with filter
        .addCase(fetchProductsByFilters.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchProductsByFilters.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=Array.isArray(action.payload)?action.payload:[];
        })
        .addCase(fetchProductsByFilters.rejected,(state,action)=>{
            state.loading=false;
              state.error = (
                action.payload?.message ||    // From rejectWithValue
                action.error?.message ||      // From the original error
                'No Products found'               // Default fallback
            )
          
        })
        //handle fetching single product details 
        .addCase(fetchProductDetails.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.selectedProduct=action.payload
        })
        .addCase(fetchProductDetails.rejected,(state,action)=>{
            state.loading=false;
              state.error = (
                action.payload?.message ||    // From rejectWithValue
                action.error?.message ||      // From the original error
                'No Products found'               // Default fallback
            )
          
        })
               //handle updating  product details 
        .addCase(updateProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateProduct.fulfilled,(state,action)=>{
            state.loading=false;
            const updatedProduct=action.payload;
            const index=state.products.findIndex((product)=>product._id==updateProduct._id)
            if(index!=-1){
                state.products[index]=updateProduct
            }
        })
        .addCase(updateProduct.rejected,(state,action)=>{
            state.loading=false;
              state.error = (
                action.payload?.message ||    // From rejectWithValue
                action.error?.message ||      // From the original error
                'No Products found'               // Default fallback
            )
          
        })

             //handle fetching similar product details 
        .addCase(fetchSimilarProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchSimilarProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.similarProducts=action.payload
        })
        .addCase(fetchSimilarProducts.rejected,(state,action)=>{
            state.loading=false;
              state.error = (
                action.payload?.message ||    // From rejectWithValue
                action.error?.message ||      // From the original error
                'No Products found'               // Default fallback
            )
          
        })
    }
})

export const {setFilters,clearFilters}=productSlice.actions
export default productSlice.reducer;



