import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";
import Layout from "./admin/Layout";
import ListForm from "./admin/form/ListForm";
import ListProduct from "./admin/product/ListProduct";

function App() {
  return (
    <Routes>
      {/* Trang chính */}
      <Route path="/lading_page/" element={<Home />} />

      {/* Layout Admin */}
      <Route path="/lading_page/admin_leminhhieu/" element={<Layout />}>
        {/* Các route con của admin */}
        <Route path="form" element={<ListForm />} />
        <Route path="product" element={<ListProduct />} />
      </Route>
    </Routes>
  );
}

export default App;