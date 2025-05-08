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
      <Route path="/" element={<Home />} />

      {/* Layout Admin */}
      <Route path="/admin" element={<Layout />}>
        <Route path="form" element={<ListForm />} />
        <Route path="product" element={<ListProduct />} />
      </Route>
    </Routes>
  );
}

export default App;
