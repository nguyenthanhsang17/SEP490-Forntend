import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Card, Row, Col, DatePicker } from "antd";
import "chart.js/auto";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import "../assets/css/colors/green-style.css";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;

const AdminDashboard = () => {
  const [revenueStatistics, setRevenueStatistics] = useState(null);
  const [packageSoldStatistics, setPackageSoldStatistics] = useState(null);
  const [packageRevenueStatistics, setPackageRevenueStatistics] =
    useState(null);
  const [userStatistics, setUserStatistics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Trạng thái cho từng bộ chọn
  const [revenueRange, setRevenueRange] = useState({
    start: dayjs().startOf("month"),
    end: dayjs().endOf("month"),
  });

  const [soldRange, setSoldRange] = useState({
    start: dayjs().startOf("month"),
    end: dayjs().endOf("month"),
  });

  const [packageRevenueRange, setPackageRevenueRange] = useState({
    start: dayjs().startOf("month"),
    end: dayjs().endOf("month"),
  });

  const fetchData = async (type, startDate, endDate) => {
    setLoading(true);
    setError(null);

    try {
      if (type === "revenue") {
        const revenueResponse = await fetch(
          `https://localhost:7077/api/DashBoard/DashBoardRevenueStatistics?StartDate=${startDate.format(
            "YYYY-MM"
          )}&EndDate=${endDate.format("YYYY-MM")}`
        );
        if (!revenueResponse.ok)
          throw new Error("Lỗi khi lấy dữ liệu doanh thu.");
        const revenueData = await revenueResponse.json();
        setRevenueStatistics(revenueData);
      } else if (type === "packageSold") {
        const soldResponse = await fetch(
          `https://localhost:7077/api/DashBoard/DashBoardPackageStatisticsNumberSold?StartDate=${startDate.format(
            "YYYY-MM"
          )}&EndDate=${endDate.format("YYYY-MM")}`
        );
        if (!soldResponse.ok) throw new Error("Lỗi khi lấy số lượng bán.");
        const soldData = await soldResponse.json();
        setPackageSoldStatistics(soldData);
      } else if (type === "packageRevenue") {
        const revenueResponse = await fetch(
          `https://localhost:7077/api/DashBoard/DashBoardPackageStatisticsRevenue?StartDate=${startDate.format(
            "YYYY-MM"
          )}&EndDate=${endDate.format("YYYY-MM")}`
        );
        if (!revenueResponse.ok)
          throw new Error("Lỗi khi lấy doanh thu theo gói.");
        const revenueData = await revenueResponse.json();
        setPackageRevenueStatistics(revenueData);
      } else if (type === "user") {
        const userResponse = await fetch(
          "https://localhost:7077/api/DashBoard/DashBoardUser"
        );
        if (!userResponse.ok)
          throw new Error("Lỗi khi lấy dữ liệu người dùng.");
        const userData = await userResponse.json();
        setUserStatistics(userData);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect cho từng loại dữ liệu
  useEffect(() => {
    fetchData("revenue", revenueRange.start, revenueRange.end);
  }, [revenueRange]);

  useEffect(() => {
    fetchData("packageSold", soldRange.start, soldRange.end);
  }, [soldRange]);
  useEffect(() => {
    fetchData(
      "packageRevenue",
      packageRevenueRange.start,
      packageRevenueRange.end
    );
  }, [packageRevenueRange]);

  useEffect(() => {
    fetchData("user");
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  // Dữ liệu biểu đồ doanh thu
  const lineChartData = {
    labels:
      revenueStatistics?.monthlyRevenue.map((item) =>
        new Date(item.month).toLocaleString("vi-VN", {
          month: "long",
          year: "numeric",
        })
      ) || [],
    datasets: [
      {
        label: "Doanh thu theo tháng (VND)",
        data:
          revenueStatistics?.monthlyRevenue.map((item) => item.revenue) || [],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Dữ liệu biểu đồ số lượng gói
  const packageSoldBarChartData = {
    labels:
      packageSoldStatistics?.mostPopularPackages.map(
        (pkg) => pkg.packageName
      ) || [],
    datasets: [
      {
        label: "Số lượng bán",
        data:
          packageSoldStatistics?.mostPopularPackages.map(
            (pkg) => pkg.numberSold
          ) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu biểu đồ doanh thu gói
  const packageRevenueBarChartData = {
    labels:
      packageRevenueStatistics?.mostPopularPackages.map(
        (pkg) => pkg.packageName
      ) || [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data:
          packageRevenueStatistics?.mostPopularPackages.map(
            (pkg) => pkg.totalRevenue
          ) || [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  // Tính tổng doanh thu và số gói bán được
  const totalRevenue = revenueStatistics?.totalRevenue || 0;
  const totalPackagesSold = packageSoldStatistics?.totalPackagesSold || 0;
  
  
  return (
    <div className="dashboard-grid-container">
      <Sidebar />
      <Header />

      <main className="dashboard-content">
        {/* Hiển thị thống kê người dùng */}
        {/* Thông tin tổng quan */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={8}>
            <Card
              className="info-card"
              style={{ backgroundColor: "#e8f5e9", color: "#388e3c" }}
            >
              <h4 style={{ color: "#2e7d32" }}>Tổng Doanh Thu</h4>
              <p>
                <b>{totalRevenue.toLocaleString("vi-VN")} VND</b>
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              className="info-card"
              style={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
            >
              <h4 style={{ color: "#1565c0" }}>Tổng Gói Bán</h4>
              <p>
                <b>{totalPackagesSold} Gói</b>
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              className="info-card"
              style={{ backgroundColor: "#fff3e0", color: "#f57c00" }}
            >
              <h4 style={{ color: "#ef6c00" }}>Tổng Số Người Dùng</h4>
              <p>
                <b>{userStatistics?.totalUser || 0} Người</b>
              </p>
            </Card>
          </Col>
        </Row>
        {/* Biểu đồ doanh thu */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={24}>
            <Card className="chart-card">
              <h3>Thống kê doanh thu</h3>
              <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col span={12}>
                  <div style={{ marginBottom: "8px" }}>Từ:</div>
                  <MonthPicker
                    value={revenueRange.start}
                    onChange={(value) =>
                      setRevenueRange((prev) => ({
                        ...prev,
                        start: value.startOf("month"),
                      }))
                    }
                    format="MM-YYYY"
                    placeholder="Chọn tháng bắt đầu"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: "8px" }}>Đến:</div>
                  <MonthPicker
                    value={revenueRange.end}
                    onChange={(value) =>
                      setRevenueRange((prev) => ({
                        ...prev,
                        end: value.endOf("month"),
                      }))
                    }
                    format="MM-YYYY"
                    placeholder="Chọn tháng kết thúc"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
              </Row>
              <Line data={lineChartData} style={{ marginTop: "20px" }} />
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ số lượng bán */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card className="chart-card">
              <h3>Số lượng bán theo gói</h3>
              <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col span={12}>
                  <div style={{ marginBottom: "8px" }}>Từ:</div>
                  <MonthPicker
                    value={soldRange.start}
                    onChange={(value) =>
                      setSoldRange((prev) => ({
                        ...prev,
                        start: value.startOf("month"),
                      }))
                    }
                    format="MM-YYYY"
                    placeholder="Chọn tháng bắt đầu"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: "8px" }}>Đến:</div>
                  <MonthPicker
                    value={soldRange.end}
                    onChange={(value) =>
                      setSoldRange((prev) => ({
                        ...prev,
                        end: value.endOf("month"),
                      }))
                    }
                    format="MM-YYYY"
                    placeholder="Chọn tháng kết thúc"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
              </Row>
              <Bar data={packageSoldBarChartData} />
            </Card>
          </Col>

          <Col span={12}>
            <Card className="chart-card">
              <h3>Doanh thu theo gói</h3>
              <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col span={12}>
                  <div style={{ marginBottom: "8px" }}>Từ:</div>
                  <MonthPicker
                    value={packageRevenueRange.start}
                    onChange={(value) =>
                      setPackageRevenueRange((prev) => ({
                        ...prev,
                        start: value.startOf("month"),
                      }))
                    }
                    format="MM-YYYY"
                    placeholder="Chọn tháng bắt đầu"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: "8px" }}>Đến:</div>
                  <MonthPicker
                    value={packageRevenueRange.end}
                    onChange={(value) =>
                      setPackageRevenueRange((prev) => ({
                        ...prev,
                        end: value.endOf("month"),
                      }))
                    }
                    format="MM-YYYY"
                    placeholder="Chọn tháng kết thúc"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
              </Row>
              <Bar data={packageRevenueBarChartData} />
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default AdminDashboard;
