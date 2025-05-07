import React, { useState, useEffect } from "react";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import instance from "../../axios";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    priceSale: "",
    quantity: "",
    images: "",
    descriptionList: [],
    imageList: [], // Thêm trường imageList để lưu danh sách ảnh
  });
  const [fileList, setFileList] = useState([]); // Quản lý danh sách file ảnh

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await instance.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      priceSale: product.priceSale,
      quantity: product.quantity,
      images: product.images,
      descriptionList: product.descriptionList || [],
      imageList: product.imageList || [],
    });
    setFileList(
      (product.imageList || []).map((url, index) => ({
        uid: index,
        name: `Image ${index + 1}`,
        status: "done",
        url,
      }))
    );
  };

  // Handle form submission to update product
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        imageList: fileList.map((file) => file.url || file.response?.secure_url), // Lấy URL từ fileList
      };

      const response = await instance.put(`/products/${editingProduct.id}`, updatedProduct);
      if (response.status === 200) {
        alert("Sản phẩm đã được cập nhật thành công!");
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id ? response.data : product
          )
        );
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
  };

  // Handle upload change
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Handle adding a new description
  const handleAddDescription = () => {
    setFormData({
      ...formData,
      descriptionList: [...formData.descriptionList, ""],
    });
  };

  // Handle changing a specific description
  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...formData.descriptionList];
    updatedDescriptions[index] = value;
    setFormData({
      ...formData,
      descriptionList: updatedDescriptions,
    });
  };

  // Handle removing a specific description
  const handleRemoveDescription = (index) => {
    const updatedDescriptions = formData.descriptionList.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      descriptionList: updatedDescriptions,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Tên sản phẩm</th>
            <th className="border border-gray-300 p-2">Hình ảnh</th>
            <th className="border border-gray-300 p-2">Giá</th>
            <th className="border border-gray-300 p-2">Giá khuyến mãi</th>
            <th className="border border-gray-300 p-2">Số lượng</th>
            <th className="border border-gray-300 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 p-2">{product.id}</td>
              <td className="border border-gray-300 p-2">{product.title}</td>
              <td className="border border-gray-300 p-2">
  <img
    src={product.imageList?.[0]}
    alt={product.title}
    className="w-16 h-16 object-cover"
  />
</td>

              <td className="border border-gray-300 p-2">{product.price}đ</td>
              <td className="border border-gray-300 p-2">{product.priceSale}đ</td>
              <td className="border border-gray-300 p-2">{product.quantity}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-2">Tên sản phẩm</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Giá</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Giá khuyến mãi</label>
              <input
                type="number"
                name="priceSale"
                value={formData.priceSale}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Hình ảnh</label>
              <Upload
                action="https://api.cloudinary.com/v1_1/dwcxp0s5e/image/upload"
                listType="picture-card"
                data={() => ({
                  upload_preset: "ladingpage_hieu",
                })}
                accept="image/*"
                maxCount={5}
                fileList={fileList}
                onChange={handleUploadChange}
              >
                {fileList.length < 5 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </div>
            <div>
              <label className="block font-bold mb-2">Mô tả chi tiết</label>
              {formData.descriptionList.map((desc, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDescription(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDescription}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Thêm mô tả
              </button>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListProduct;