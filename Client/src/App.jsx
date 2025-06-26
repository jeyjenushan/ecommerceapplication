import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        {/*User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
        {/*Admin Routes */}
        <Route></Route>
      </Routes>
    </div>
  );
};

export default App;
