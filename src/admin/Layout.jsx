import { Link, Outlet } from "react-router-dom";
import '../css/Layout.css';
const Layout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/form" className="hover:underline">Form</Link>
          <Link to="/admin/product" className="hover:underline">Product</Link>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
