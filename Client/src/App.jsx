import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirm from "./pages/OrderConfirm";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrders from "./pages/MyOrders";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import UserManagement from "./pages/Admin/UserManagement";
import ProductManagment from "./pages/Admin/ProductManagment";
import EditProductsPage from "./pages/Admin/EditProductsPage";
import OrderManagement from "./pages/Admin/OrderManagement";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Toaster position="top-right" />
        <Routes>
          {/*User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />

            <Route path="product/:id" element={<ProductDetails />} />

            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirm />} />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrders />} />
          </Route>

          {/*Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagment />} />
            <Route path="products/:id/edit" element={<EditProductsPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </div>
    </Provider>
  );
};

export default App;
