import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Truck, ShieldCheck, Home, Link } from "lucide-react";
import { message } from "antd";
// Create axios instance
const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function ProductLandingPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 54,
    seconds: 51,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
  });
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    address: false,
    quantity: false
  });
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await instance.get("/products/1");
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    });
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (isSubmitted) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Đánh dấu rằng form đã được submit
    
    // Kiểm tra thủ công từng trường và hiển thị lỗi
    let hasError = false;
    
    if (!formData.name) {
      message.error("Vui lòng nhập họ và tên!");
      hasError = true;
    }
    
    if (!formData.phone || !/^(\+84|0)[0-9]{9,10}$/.test(formData.phone)) {
      message.error("Số điện thoại không hợp lệ!");
      hasError = true;
    }
    
    if (!formData.address) {
      message.error("Vui lòng nhập địa chỉ!");
      hasError = true;
    }
    
    if (formData.quantity < 1) {
      message.error("Số lượng phải lớn hơn hoặc bằng 1!");
      hasError = true;
    }
    
    // Nếu có lỗi thì không gửi dữ liệu
    if (hasError) {
      return;
    }
    
    try {
      // Lấy danh sách form submissions hiện tại
      const submissionsResponse = await instance.get("/formSubmissions");
      const submissions = submissionsResponse.data;
    
      // Tìm id lớn nhất hiện tại và tăng thêm 1
      const newId =
        submissions.length > 0
          ? Math.max(...submissions.map((submission) => submission.id)) + 1
          : 1;
    
      // Gửi dữ liệu form lên DB với id mới
      const response = await instance.post("/formSubmissions", {
        id: newId,
        fullName: formData.name,
        phoneNumber: formData.phone,
        address: formData.address,
        quantity: formData.quantity,
        status: 5,
      });
    
      if (response.status === 201) {
        message.success("Thông tin đã được gửi thành công!");
        // Reset form sau khi gửi thành công
        setFormData({
          name: "",
          phone: "",
          address: "",
          quantity: 1,
        });
        setIsSubmitted(false);
      } else {
        message.error("Đã xảy ra lỗi khi gửi thông tin.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi thông tin:", error);
      message.error("Không thể gửi thông tin. Vui lòng thử lại sau.");
    }
  };

  // Next image in carousel
  const nextImage = () => {
    if (product && product.imageList) {
      setCurrentImageIndex((prev) =>
        prev === product.imageList.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Previous image in carousel
  const prevImage = () => {
    if (product && product.imageList) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.imageList.length - 1 : prev - 1
      );
    }
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (!product) return 0;
    if (product.price <= product.priceSale) return 0;
    return Math.round(
      ((product.price - product.priceSale) / product.price) * 100
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  const discountPercentage = calculateDiscountPercentage();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-black py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-xl font-bold">SIÊU THỊ GIA DỤNG</div>
          <a
            href="#order-form"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full"
          >
            MUA NGAY
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Product Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            {product.title} Đa Năng
          </h1>
          <h2 className="text-2xl font-semibold">3in1, Xoay 360 Độ</h2>
          <div className="mt-4">
            <span className="line-through text-gray-500 text-xl">
              {product.price.toLocaleString()}Đ
            </span>
            <div className="font-bold text-red-600 text-2xl mt-1">
              Chỉ còn: {product.priceSale.toLocaleString()}Đ/1 Bộ
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative">
        <img
  src={
    product.imageList
      ? product.imageList[currentImageIndex]
      : product.images
  }
  alt={product.title}
  className={`mx-auto max-h-96 object-contain transition-opacity duration-300 ${
    fade ? "opacity-100" : "opacity-0"
  }`}
/>


          {product.imageList && product.imageList.length > 1 && (
            <div className="absolute top-1/2 w-full flex justify-between px-4 transform -translate-y-1/2">
              <button
                onClick={prevImage}
                className="bg-gray-800 bg-opacity-50 text-white rounded-full p-2"
              >
                ❮
              </button>
              <button
                onClick={nextImage}
                className="bg-gray-800 bg-opacity-50 text-white rounded-full p-2"
              >
                ❯
              </button>
            </div>
          )}
        </div>

        {/* Product Features */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 uppercase">
            Thông số kĩ thuật
          </h2>
          <div className="space-y-4">
            {product.descriptionList.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div>{feature}</div>
              </div>
            ))}
            {discountPercentage > 0 && (
              <div className="flex items-start text-red-600 font-bold">
                <div className="mr-2">✓</div>
                <div>(ƯU ĐÃI GIẢM LÊN ĐẾN {discountPercentage}%)</div>
              </div>
            )}
          </div>
        </div>

        {/* Promotion Banner */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="border border-red-500 rounded-lg p-6 text-center">
            <div className="text-blue-600 text-xl font-bold mb-2">
              BẢO HÀNH 6 THÁNG LỖI 1 ĐỔI 1
            </div>
            <div className="bg-gray-800 text-white inline-block px-4 py-1 rounded-sm">
              Khuyến mãi
            </div>
            <div className="bg-gray-200 inline-block px-4 py-1 rounded-sm">
              chỉ hôm nay
            </div>
            <div className="text-5xl font-bold text-orange-500 mt-2">
              {discountPercentage}%<span className="text-xl ml-2">OFF</span>
            </div>
          </div>
        </div>

        {/* Sales Policy */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 uppercase text-orange-500">
            Chính sách bán hàng
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="text-green-500 mr-2">✓</div>
              <div>Sản phẩm chất lượng cao nhất</div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 mr-2">✓</div>
              <div>Lỗi 1 đổi 1 cho khách hàng</div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 mr-2">✓</div>
              <div>Miễn Phí Đổi Trả cho khách hàng</div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 mr-2">✓</div>
              <div>Khách hàng kiểm tra và dùng thử tại nhà</div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <div className="flex items-center">
              <Truck className="text-green-500 mr-2" size={24} />
              <div className="text-sm">Giao hàng nhanh</div>
            </div>
            <div className="flex items-center">
              <Clock className="text-green-500 mr-2" size={24} />
              <div className="text-sm">Đổi trả trong 24h</div>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="text-green-500 mr-2" size={24} />
              <div className="text-sm">An toàn giao dịch</div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-yellow-100 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            {product.title} Đa Năng 3in1, Xoay 360 Độ
          </h2>
          <div className="text-center mb-4">
            <span className="line-through text-gray-500">
              {product.price.toLocaleString()}Đ
            </span>
            <div className="font-bold text-red-600 text-2xl">
              Chỉ còn: {product.priceSale.toLocaleString()}Đ/1 Bộ
            </div>
          </div>

          <div className="flex justify-center gap-2 text-center my-4">
            <div className="bg-black text-white px-4 py-2 rounded">
              <div className="text-2xl font-bold">00</div>
              <div className="text-xs">Ngày</div>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded">
              <div className="text-2xl font-bold">00</div>
              <div className="text-xs">Giờ</div>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded">
              <div className="text-2xl font-bold">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs">Phút</div>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded">
              <div className="text-2xl font-bold">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs">Giây</div>
            </div>
          </div>

          <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
  {/* Họ và tên */}
  <div>
  <label htmlFor="name" className="block font-bold mb-2">Họ và tên</label>
  <input
    type="text"
    id="name"
    name="name"
    placeholder="Nhập họ và tên"
    value={formData.name}
    onChange={handleInputChange}
    className={`w-full p-3 border rounded ${isSubmitted && !formData.name ? 'border-red-500' : ''}`}
  />
  {isSubmitted && !formData.name && (
    <p className="text-red-500 text-sm mt-1">Họ và tên không được để trống.</p>
  )}
</div>

  {/* Số điện thoại */}
  <div>
  <label htmlFor="phone" className="block font-bold mb-2">Số điện thoại</label>
  <input
    type="tel"
    id="phone"
    name="phone"
    placeholder="Nhập số điện thoại"
    value={formData.phone}
    onChange={handleInputChange}
    className={`w-full p-3 border rounded ${isSubmitted && (!/^(\+84|0)[0-9]{9,10}$/.test(formData.phone) || !formData.phone) ? 'border-red-500' : ''}`}
  />
  {isSubmitted && (!/^(\+84|0)[0-9]{9,10}$/.test(formData.phone) || !formData.phone) && (
    <p className="text-red-500 text-sm mt-1">Số điện thoại không hợp lệ.</p>
  )}
</div>


  {/* Địa chỉ */}
  <div>
  <label htmlFor="address" className="block font-bold mb-2">Địa chỉ</label>
  <input
    type="text"
    id="address"
    name="address"
    placeholder="Nhập địa chỉ"
    value={formData.address}
    onChange={handleInputChange}
    className={`w-full p-3 border rounded ${isSubmitted && !formData.address ? 'border-red-500' : ''}`}
  />
  {isSubmitted && !formData.address && (
    <p className="text-red-500 text-sm mt-1">Địa chỉ không được để trống.</p>
  )}
</div>

  {/* Số lượng */}
  <div>
  <label htmlFor="quantity" className="block font-bold mb-2">Số lượng</label>
  <input
    type="number"
    id="quantity"
    name="quantity"
    placeholder="Nhập số lượng"
    value={formData.quantity}
    onChange={handleInputChange}
    min="1"
    className={`w-full p-3 border rounded ${isSubmitted && formData.quantity < 1 ? 'border-red-500' : ''}`}
  />
  {isSubmitted && formData.quantity < 1 && (
    <p className="text-red-500 text-sm mt-1">Số lượng phải lớn hơn hoặc bằng 1.</p>
  )}
</div>

  {/* Nút submit */}
  <button
    type="submit"
    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full text-xl"
  >
    ĐẶT HÀNG NGAY
  </button>
</form>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">666 Bình Luận</h2>

          {/* Review 1 */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                <img
                  src="/api/placeholder/48/48"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">Mai Hà</div>
                <div className="text-gray-700">
                  Chị nhận được hàng rồi, hàng xịn lắm shop, chị mua thêm cho
                  bạn 2 chiếc nữa nha - 098****02
                </div>
                <div className="flex text-yellow-400 my-1">{"★".repeat(5)}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Thích</span>
                  <span className="mr-2">Bình Luận</span>
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    6
                  </div>
                  <span className="ml-2">2 ngày trước</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                <img
                  src="/api/placeholder/48/48"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">Hồng Ngọc</div>
                <div className="text-gray-700">
                  Cảm ơn shop, chị nhận đc rồi, dùng rất tiện
                </div>
                <div className="mt-2 mb-3">
                  <img
                    src="/api/placeholder/200/100"
                    alt="Product review"
                    className="rounded-md"
                  />
                </div>
                <div className="flex text-yellow-400 my-1">{"★".repeat(5)}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Thích</span>
                  <span className="mr-2">Bình Luận</span>
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    7
                  </div>
                  <span className="ml-2">1 ngày trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Now Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
          <a
            href="#order-form"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full text-xl text-center block"
          >
            MUA NGAY ĐỂ NHẬN ƯU ĐÃI
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-black py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NGUỒN GỐC RÕ RÀNG</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Hàng nhập khẩu chính hãng
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">VẬN CHUYỂN</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Vận chuyển toàn quốc
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Nhận hàng tại nhà, kiểm tra mới thanh toán
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-4">SIÊU THỊ GIA DỤNG</h3>
            <div className="flex items-center mb-2">
              <Home className="mr-2" size={18} />
              <span>Address: 465 Phan Đình Phùng, Thái Nguyên</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2">📞</span>
              <span>Hotline: 0876511999</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2">✉️</span>
              <span>Email: webcake@pancake.vn</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-2">🌐</span>
              <span>Website: www.webcake.io</span>
            </div>

            <h3 className="text-xl font-bold mb-4">CUSTOMER SERVICE</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="mr-2">📦</span>
                <span>Returns & Shipping Policy</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Privacy Policy</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📄</span>
                <span>Terms of Use</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <span>Liên hệ</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <img src="/api/placeholder/40/24" alt="Visa" className="h-6" />
              <img
                src="/api/placeholder/40/24"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="/api/placeholder/100/24"
                alt="Vietnam Payment"
                className="h-6"
              />
            </div>

            <div className="mt-6 text-sm text-gray-400">Lê Minh Hiếu</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
