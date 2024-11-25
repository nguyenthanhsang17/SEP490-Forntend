import React, { useState, useEffect } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Card, Row, Col } from "antd";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import "../assets/css/colors/green-style.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  const maxSold =
    dashboardData &&
    Math.max(
      ...dashboardData.packageStatistics.mostPopularPackages.map(
        (pkg) => pkg.numberSold
      )
    );

  // Biểu đồ cột cho số lượng gói đã bán
  const soldBarChartData = {
    labels: dashboardData.packageStatistics.mostPopularPackages.map(
      (pkg) => pkg.packageName
    ),
    datasets: [
      {
        label: "Số lượng bán",
        data: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) => pkg.numberSold
        ),
        backgroundColor: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) =>
            pkg.numberSold === maxSold
              ? "rgba(255, 99, 132, 0.8)"
              : "rgba(54, 162, 235, 0.5)"
        ),
        borderColor: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) =>
            pkg.numberSold === maxSold
              ? "rgba(255, 99, 132, 1)"
              : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Biểu đồ cột cho doanh thu
  const revenueBarChartData = {
    labels: dashboardData.packageStatistics.mostPopularPackages.map(
      (pkg) => pkg.packageName
    ),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: dashboardData.packageStatistics.mostPopularPackages.map(
          (pkg) => pkg.totalRevenue
        ),
        backgroundColor: dashboardData.packageStatistics.mostPopularPackages.map(
          () => "rgba(75, 192, 192, 0.5)"
        ),
        borderColor: dashboardData.packageStatistics.mostPopularPackages.map(
          () => "rgba(75, 192, 192, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

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

  return (
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
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
        <Row gutter={[16, 16]} className="charts-row" style={{marginTop:"20px"}}>
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
        <Row gutter={[16, 16]} className="charts-row" style={{marginTop:"30px"}}>
          <Col span={12}>
            <Card className="chart-card">
              <h3>Số lượng gói đã bán</h3>
              <Bar
                data={soldBarChartData}
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
                        text: "Số lượng bán",
                      },
                    },
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card className="chart-card">
              <h3>Doanh thu theo gói</h3>
              <Bar
                data={revenueBarChartData}
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
                        text: "Doanh thu (VND)",
                      },
                    },
                  },
                }}
              />
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default AdminDashboard;
