import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Card, Row, Col, Input, Badge, Avatar } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import "../assets/css/colors/green-style.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("https://localhost:7077/api/DashBoard");
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu thống kê.");
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  const lineChartData = {
    labels: dashboardData.revenueStatistics.monthlyRevenue.map((item) =>
      new Date(item.month).toLocaleString("vi-VN", {
        month: "long",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: dashboardData.revenueStatistics.monthlyRevenue.map(
          (item) => item.revenue
        ),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ["Người tìm việc", "Nhà tuyển dụng"],
    datasets: [
      {
        data: [
          dashboardData.userStatistics.jobSeekersPercentage,
          dashboardData.userStatistics.employersPercentage,
        ],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverOffset: 4,
      },
    ],
  };

  const topPackages =
    dashboardData.packageStatistics.mostPopularPackages.filter(
      (pkg) => pkg.numberSold > 0
    );

  return (
    <div className="admin-dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">Quản Trị</div>
        <nav className="sidebar-menu">
          <div className="menu-item active">Tổng Quan</div>
          <div className="menu-item">Công Việc</div>
          <div className="menu-item">Ứng Tuyển</div>
          <div className="menu-item">Báo Cáo</div>
        </nav>
      </aside>

      <div className="main-content">
        <header className="dashboard-header">
          <Input
            className="dashboard-search"
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
          />
          <div className="dashboard-actions">
            <Badge count={2}>
              <BellOutlined className="dashboard-icon" />
            </Badge>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ marginLeft: "15px", backgroundColor: "#87d068" }}
            />
          </div>
        </header>

        <section className="statistics-section">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card blue">
                <h2>{dashboardData.totalUser}</h2>
                <p>Tổng số người dùng</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card green">
                <h2>
                  {dashboardData.revenueStatistics.totalRevenue.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VND
                </h2>
                <p>Tổng doanh thu</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card yellow">
                <h2>{dashboardData.packageStatistics.totalPackagesSold}</h2>
                <p>Tổng số gói đã bán</p>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="charts-section">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Card className="chart-card">
                <h3>Thống kê doanh thu</h3>
                <Line data={lineChartData} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="chart-card">
                <h3>Thống kê người dùng</h3>
                <Pie data={pieChartData} />
              </Card>
            </Col>
          </Row>
        </section>

        <section className="packages-section">
          <Card>
            <h3>Gói được sử dụng nhiều nhất</h3>
            {topPackages.length > 0 ? (
              topPackages.map((pkg) => (
                <div key={pkg.packageId} className="package-item">
                  <h4>{pkg.packageName}</h4>
                  <p>Số lượng bán: {pkg.numberSold}</p>
                  <p>
                    Doanh thu:{" "}
                    {pkg.totalRevenue.toLocaleString("vi-VN")} VND
                  </p>
                </div>
              ))
            ) : (
              <p>Chưa có gói nào được bán.</p>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;