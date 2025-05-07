import React, { useEffect, useState } from 'react';
import "../../css/Form.css"
const ListForm = () => {
  const [formSubmissions, setFormSubmissions] = useState([]);
  const statusMap = {
    1: "Đang giao hàng",
    2: "Đã note",
    3: "Đã hủy",
    4: "Đã đặt hàng",
    5:"Khách hàng mới đặt"
  };

  useEffect(() => {
    fetch('/db.json')
      .then((response) => response.json())
      .then((data) => setFormSubmissions(data.formSubmissions))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setFormSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) =>
        submission.id === id ? { ...submission, status: newStatus } : submission
      )
    );
  };

  return (
    
<div className="container">    
    <h1>Quản lí đơn hàng</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên KH</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Trạng thái đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          {formSubmissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.id}</td>
              <td>{submission.fullName}</td>
              <td>{submission.phoneNumber}</td>
              <td>{submission.address}</td>
              <td>
                <select
                  value={submission.status}
                  onChange={(e) => handleStatusChange(submission.id, parseInt(e.target.value))}
                >
                  {Object.entries(statusMap).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListForm;