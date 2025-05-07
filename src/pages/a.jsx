import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [products, setProducts] = useState([]);
  

  // Fetch products from db.json
useEffect(() => {
  axios
    .get('/products')
    .then((response) => {
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error('API did not return an array:', response.data);
      }
    })
    .catch((error) => console.error('Error fetching products:', error));
}, []);
  const handleOrderSubmit = () => {
    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;
    const message = document.getElementById('message').value;
    console.log(fullName, phoneNumber, address, message);
    if (!fullName || !phoneNumber || !address) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newOrder = {
      id: Date.now(),
      fullName,
      phoneNumber,
      address,
      message,
      status: 5 
    };

    axios
    .post('/formSubmissions', newOrder)
    .then(() => {
      alert('Đặt hàng thành công!');
      document.getElementById('orderForm').reset();
    })
    .catch((error) => {
      console.error('Error submitting order:', error);
      alert('Đặt hàng thất bại!');
    });
};

  return (
<>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        }\n        \n        body {\n            background-color: #f5f5f5;\n        }\n        \n        .container {\n            max-width: 800px;\n            margin: 0 auto;\n            background-color: #f0f0f0;\n            padding-bottom: 20px;\n        }\n        \n        .header {\n            background-color: #f0f0f0;\n            padding: 20px;\n            text-align: center;\n        }\n        \n        .company-name {\n            color: #0066cc;\n            font-size: 28px;\n            margin-bottom: 10px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n        }\n        \n        .company-name span {\n            color: #ff0066;\n        }\n        \n        .logo {\n            width: 60px;\n            margin-left: 10px;\n        }\n        \n        .contact-buttons {\n            display: flex;\n            justify-content: center;\n            flex-wrap: wrap;\n            gap: 10px;\n            margin-bottom: 20px;\n        }\n        \n        .contact-button {\n            background-color: #ff0066;\n            color: white;\n            border: none;\n            border-radius: 20px;\n            padding: 8px 20px;\n            font-weight: bold;\n            cursor: pointer;\n            font-size: 14px;\n            text-decoration: none;\n            display: inline-block;\n        }\n        \n        .contact-button.blue {\n            background-color: #0066cc;\n        }\n        \n        .contact-button.orange {\n            background-color: #ff6600;\n        }\n        \n        .features {\n            padding: 0 20px;\n            margin-bottom: 20px;\n        }\n        \n        .feature-item {\n            display: flex;\n            align-items: center;\n            margin-bottom: 10px;\n            color: #0066cc;\n            font-weight: bold;\n        }\n        \n        .feature-item::before {\n            content: \"✓\";\n            display: inline-block;\n            width: 20px;\n            height: 20px;\n            background-color: #0066cc;\n            color: white;\n            border-radius: 50%;\n            text-align: center;\n            line-height: 20px;\n            margin-right: 10px;\n            font-size: 12px;\n        }\n        \n        .product-section-title {\n            background-color: #f0f0f0;\n            color: #ff0066;\n            text-align: center;\n            padding: 10px;\n            font-size: 22px;\n            border-top: 2px solid #0066cc;\n            margin: 20px 0;\n        }\n        \n        .products-container {\n            display: flex;\n            flex-direction: column;\n            gap: 20px;\n            margin: 0 20px;\n        }\n        \n        .product-card {\n            background-color: white;\n            border-radius: 5px;\n            overflow: hidden;\n            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n        }\n        \n        .product-header {\n            background-color: #0066cc;\n            color: white;\n            padding: 10px;\n            text-align: center;\n            font-size: 18px;\n            font-weight: bold;\n        }\n        \n        .product-price {\n            background-color: #ff0066;\n            color: white;\n            padding: 5px;\n            text-align: center;\n            font-size: 20px;\n            font-weight: bold;\n        }\n        \n        .product-image {\n            width: 100%;\n            height: 250px;\n            object-fit: cover;\n            display: block;\n        }\n        \n        .product-thumbnails {\n            display: flex;\n            justify-content: center;\n            gap: 5px;\n            padding: 10px;\n            background-color: #f0f0f0;\n        }\n        \n        .product-thumbnail {\n            width: 60px;\n            height: 60px;\n            object-fit: cover;\n            cursor: pointer;\n            border: 1px solid #ddd;\n        }\n        \n        .countdown {\n            text-align: center;\n            margin: 15px 0;\n        }\n        \n        .countdown-title {\n            color: #ff0066;\n            font-size: 18px;\n            font-weight: bold;\n            margin-bottom: 10px;\n        }\n        \n        .countdown-timer {\n            display: flex;\n            justify-content: center;\n            gap: 10px;\n        }\n        \n        .countdown-box {\n            background-color: #999;\n            color: white;\n            width: 40px;\n            height: 40px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-weight: bold;\n            font-size: 20px;\n        }\n        \n        .countdown-label {\n            font-size: 12px;\n            text-align: center;\n            color: #666;\n        }\n        \n        .action-buttons {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            padding: 10px 20px;\n        }\n        \n        .action-button {\n            background-color: #ff0066;\n            color: white;\n            border: none;\n            border-radius: 5px;\n            padding: 12px;\n            font-weight: bold;\n            cursor: pointer;\n            font-size: 16px;\n            text-align: center;\n            text-decoration: none;\n        }\n        \n        .action-button.orange {\n            background-color: #ff6600;\n        }\n        \n        .policy-section {\n            margin: 20px;\n            padding: 15px;\n            background-color: white;\n            border-radius: 5px;\n        }\n        \n        .policy-title {\n            text-align: center;\n            font-size: 18px;\n            font-weight: bold;\n            margin-bottom: 10px;\n        }\n        \n        .policy-content {\n            color: #666;\n            line-height: 1.5;\n        }\n        \n        .order-form {\n            margin: 20px;\n            padding: 15px;\n            background-color: white;\n            border-radius: 5px;\n        }\n        \n        .form-group {\n            margin-bottom: 15px;\n        }\n        \n        .form-control {\n            width: 100%;\n            padding: 10px;\n            border: 1px solid #ddd;\n            border-radius: 5px;\n            font-size: 16px;\n        }\n        \n        .form-select {\n            width: 100%;\n            padding: 10px;\n            border: 1px solid #ddd;\n            border-radius: 5px;\n            font-size: 16px;\n            appearance: none;\n            background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\");\n            background-repeat: no-repeat;\n            background-position: calc(100% - 10px) center;\n        }\n        \n        .submit-button {\n            width: 100%;\n            background-color: #cc0000;\n            color: white;\n            border: none;\n            border-radius: 5px;\n            padding: 15px;\n            font-weight: bold;\n            cursor: pointer;\n            font-size: 18px;\n            text-transform: uppercase;\n        }\n        \n        /* Responsive styles */\n        @media (max-width: 600px) {\n            .countdown-timer {\n                gap: 5px;\n            }\n            \n            .countdown-box {\n                width: 35px;\n                height: 35px;\n                font-size: 16px;\n            }\n        }\n    "
    }}
  />
  <div className="container">
    <div className="header">
      <div className="company-name">
        <div>
          CỬA HÀNG <span>CỦA TAO</span>
        </div>
        <img src="/api/placeholder/60/60" alt="Logo" className="logo" />
      </div>
      <div className="contact-buttons">
        <a href="#" className="contact-button">
          Kênh Youtube
        </a>
        <a href="#" className="contact-button blue">
          Website
        </a>
        <a href="#" className="contact-button orange">
          Fanpage
        </a>
      </div>
      <div className="contact-buttons">
        <a href="#" className="contact-button">
          GỌI ĐIỆN TƯ VẤN TRỰC TIẾP
        </a>
      </div>
      <div className="contact-buttons">
        <a href="#" className="contact-button blue">
          KẾT BẠN ZALO GỌI VIDEO CALL
        </a>
      </div>
      <div className="contact-buttons">
        <a href="#" className="contact-button orange">
          CHAT VỚI NHÂN VIÊN TƯ VẤN
        </a>
      </div>
    </div>
    <div className="features">
      <div className="feature-item">Chuyên Phân Phối Sản Phẩm.</div>
      <div className="feature-item">Call-Zalo: 0981335250.</div>
      <div className="feature-item">Miễn Phí Ship Toàn Quốc.</div>
      <div className="feature-item">
        Được Kiểm Tra Hàng Trước Khi Thanh Toán.
      </div>
      <div className="feature-item">
        Tăng kèm vô số đồ có giá trị 
      </div>
      <div className="feature-item">Vật dụng gia dụng hữu ích.</div>
      <div className="feature-item">
        Có nhân viên hỗ trợ trong suốt quá trình sử dụng.
      </div>
    </div>
    <div className="product-section-title">CÁC SẢN PHẨM HIỆN CÓ</div>
    <div className="products-container" id="products-container">
  {Array.isArray(products) && products.map((product) => (
    <div key={product.id} className="product-card">
      <div className="product-header">{product.title}</div>
      <div className="product-price">GIÁ: {product.price.toLocaleString()} VND</div>
      <img
        src={product.images || '/api/placeholder/800/600'}
        alt={product.title}
        className="product-image"
      />
      <p>{product.description}</p>
    </div>
  ))}
</div>
    <div className="contact-buttons" style={{ margin: 20 }}>
      <a href="#orderForm" className="contact-button">
        GỌI ĐIỆN TƯ VẤN TRỰC TIẾP
      </a>
    </div>
    <div className="policy-section">
      <div className="policy-title">
        3 NGÀY ĐỔI MỚI
        <br />
        SẢN PHẨM
      </div>
      <div className="policy-content">
        Hỗ trợ khách hàng đổi sản phẩm khác bằng tiền hoặc cao hơn giá nếu sản
        phẩm đã mua bị lỗi phần cứng trong 3 ngày sử dụng đầu tiên.
      </div>
    </div>
    <div className="policy-section">
      <div className="policy-title">CHẤT LƯỢNG</div>
      <div className="policy-content">
        Cam kết hàng bán ra màin chưa qua sửa chữa, đảm bảo giao hàng nhanh nhất
        có thể.
      </div>
    </div>
    <div className="order-form" id="orderForm">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Họ Và Tên"
            id="fullName"
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            className="form-control"
            placeholder="Số Điện Thoại"
            id="phoneNumber"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Địa chỉ"
            id="address"
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Để lại lời nhắn tại đây nhân viên tư vấn sẽ gọi xác nhận ạ!"
            rows={5}
            id="message"
            defaultValue={""}
          />
        </div>
        <button
          type="button"
          className="submit-button"
          id="orderButton"
          onClick={handleOrderSubmit}
        >
          ĐẶT HÀNG
        </button>
      </div>
  </div>
</>

  )
}

export default Home
