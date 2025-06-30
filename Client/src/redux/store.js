//configureStore:set up the redux store to manage the state in our application
import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import checkoutReducer from "./slices/checkoutSlice"
import orderReducer from "./slices/orderSlice"
import adminReducer from "./slices/adminSlice"
import adminProductsReducer from "./slices/adminSlice"
import adminOrdersReducer from "./slices/adminOrderSlice"
//create the redux store
const store=configureStore({
    reducer:{auth:authReducer,
        products:productReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        orders:orderReducer,
        admin:adminReducer,
        adminProducts:adminProductsReducer,
        adminOrders:adminOrdersReducer
    }
})

export default store;