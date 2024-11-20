import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Card, Row, Col, Input, Badge, Avatar } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import "../assets/css/colors/green-style.css";
import { Bar } from "react-chartjs-2";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maxSold = Math.max(
    ...dashboardData.packageStatistics.mostPopularPackages.map(
      (pkg) => pkg.numberSold
    )
  );

  const barChartData = {
    labels: dashboardData.packageStatistics.mostPopularPackages.map(
      (pkg) => pkg.packageName
    ),
    datasets: [
      {
        label: "Số lượng bán",
        data: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) => pkg.numberSold
        ),
        backgroundColor:
          dashboardData.packageStatistics.mostPopularPackages.map((pkg) =>
            pkg.numberSold === maxSold
              ? "rgba(255, 99, 132, 0.8)" // Màu nổi bật cho gói bán được nhiều nhất
              : "rgba(54, 162, 235, 0.5)"
          ),
        borderColor: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) =>
            pkg.numberSold === maxSold
              ? "rgba(255, 99, 132, 1)" // Đường viền nổi bật
              : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
      {
        label: "Doanh thu (VND)",
        data: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) => pkg.totalRevenue
        ),
        backgroundColor:
          dashboardData.packageStatistics.mostPopularPackages.map((pkg) =>
            pkg.numberSold === maxSold
              ? "rgba(255, 159, 64, 0.8)" // Màu nổi bật cho doanh thu gói bán nhiều nhất
              : "rgba(75, 192, 192, 0.5)"
          ),
        borderColor: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) =>
            pkg.numberSold === maxSold
              ? "rgba(255, 159, 64, 1)" // Đường viền nổi bật
              : "rgba(75, 192, 192, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };
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
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Quản Trị</div>
        <nav className="sidebar-menu">
          <div className="menu-item active">Tổng Quan</div>
          <div className="menu-item">Công Việc</div>
          <div className="menu-item">Ứng Tuyển</div>
          <div className="menu-item">Báo Cáo</div>
        </nav>
      </aside>

      {/* Header */}
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

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Statistics */}
        <Row gutter={[16, 16]} className="statistics-row">
          <Col span={8}>
            <Card className="stat-card blue">
              <h2>{dashboardData.totalUser}</h2>
              <h5>Tổng số người dùng</h5>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="stat-card green">
              <h2>
                {dashboardData.revenueStatistics.totalRevenue.toLocaleString(
                  "vi-VN"
                )}{" "}
                VND
              </h2>
              <h5>Tổng doanh thu</h5>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="stat-card yellow">
              <h2>{dashboardData.packageStatistics.totalPackagesSold}</h2>
              <h5>Tổng số gói đã bán</h5>
            </Card>
          </Col>
        </Row>
        {/* Charts */}
        <Row gutter={[16, 16]} className="charts-row">
          <Col span={16}>
            <Card className="chart-card">
              <h3>Thống kê doanh thu</h3>
              <Line data={lineChartData} />
            </Card>
          </Col>
          <Col span={8}>
            <Card className="chart-card">
              <h3>Thống kê người dùng</h3>
              <Pie data={pieChartData} />
            </Card>
          </Col>
        </Row>
        <Card className="all-packages-bar-chart-card">
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            Biểu đồ cột - Gói và doanh thu
          </h3>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Tên gói",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Số lượng bán & Doanh thu (VND)",
                  },
                },
              },
            }}
          />
        </Card>
        ;
      </main>
    </div>
  );
};

export default AdminDashboard;
