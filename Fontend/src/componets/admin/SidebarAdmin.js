import React from "react";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Sidebar = () => {
  const navigateTo = (path) => {
    window.location.href = path; // Điều hướng bằng cách thay đổi URL
  };

  const roleId = localStorage.getItem("roleId"); // Lấy roleId từ localStorage

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#2c3e50',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#34495e'
      }}>
        Trang Quản Trị
      </div>
      
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0'
      }}>
        {(roleId === "4") && (
          <div 
            onClick={() => navigateTo("/AdminDashboard")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              hover: {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faChartPie} />
            Tổng Quan
          </div>
        )}
    
        {(roleId === "3") && (
          <div 
            onClick={() => navigateTo("/BlogList")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faNewspaper} />
            Danh sách bài đăng
          </div>
        )}
    
        {(roleId === "3") && (
          <div 
            onClick={() => navigateTo("/CreateBlog")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faFileSignature} />
            Tạo bài đăng mới
          </div>
        )}
    
        {roleId === "4" && (
          <div 
            onClick={() => navigateTo("/ViewAllHistoryPayment")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faMoneyBill} />
            Lịch sử giao dịch
          </div>
        )}
    
        {roleId === "4" && (
          <div 
            onClick={() => navigateTo("/ManageUser")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faUserCog} />
            Quản lý người dùng
          </div>
        )}
    
        {roleId === "4" && (
          <div 
            onClick={() => navigateTo("/ManageService")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faBoxOpen} />
            Quản lý gói dịch vụ
          </div>
        )}
    
        {(roleId === "3") && (
          <div 
            onClick={() => navigateTo("/ViewAllPost")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faTasks} />
            Danh sách công việc
          </div>
        )}
    
        {(roleId === "3") && (
          <div 
            onClick={() => navigateTo("/ViewEmployerRequests")}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Yêu cầu trở thành nhà tuyển dụng
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
