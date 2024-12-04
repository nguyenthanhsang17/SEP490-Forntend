import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Card, Row, Col, DatePicker } from "antd";
import "chart.js/auto";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import "../assets/css/colors/green-style.css";
import dayjs from "dayjs";
import { message } from "antd";

const { MonthPicker } = DatePicker;

const AdminDashboard = () => {
  const [revenueStatistics, setRevenueStatistics] = useState(null);
  const [packageSoldStatistics, setPackageSoldStatistics] = useState(null);
  const [packageRevenueStatistics, setPackageRevenueStatistics] =
    useState(null);
  const [userStatistics, setUserStatistics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingPackageSold, setLoadingPackageSold] = useState(false);
  const [loadingPackageRevenue, setLoadingPackageRevenue] = useState(false);
  const [loadingUserStatistics, setLoadingUserStatistics] = useState(false);

  // Trạng thái cho từng bộ chọn
  const [revenueRange, setRevenueRange] = useState({
    start: dayjs().subtract(5, "month").startOf("month"), // Lùi lại 5 tháng từ tháng hiện tại
    end: dayjs().endOf("month"), // Tháng hiện tại
  });

  const [soldRange, setSoldRange] = useState({
    start: dayjs().subtract(5, "month").startOf("month"),
    end: dayjs().endOf("month"),
  });

  const [packageRevenueRange, setPackageRevenueRange] = useState({
    start: dayjs().subtract(5, "month").startOf("month"),
    end: dayjs().endOf("month"),
  });

  const fetchRevenueStatistics = async () => {
    setLoadingRevenue(true);
    try {
      const response = await fetch(
        `https://localhost:7077/api/DashBoard/DashBoardRevenueStatistics?StartDate=${revenueRange.start.format(
          "YYYY-MM"
        )}&EndDate=${revenueRange.end.format("YYYY-MM")}`
      );
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu doanh thu.");
      const data = await response.json();
      setRevenueStatistics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchPackageSoldStatistics = async () => {
    setLoadingPackageSold(true);
    try {
      const response = await fetch(
        `https://localhost:7077/api/DashBoard/DashBoardPackageStatisticsNumberSold?StartDate=${soldRange.start.format(
          "YYYY-MM"
        )}&EndDate=${soldRange.end.format("YYYY-MM")}`
      );
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu gói bán.");
      const data = await response.json();
      setPackageSoldStatistics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPackageSold(false);
    }
  };

  const fetchPackageRevenueStatistics = async () => {
    setLoadingPackageRevenue(true);
    try {
      const response = await fetch(
        `https://localhost:7077/api/DashBoard/DashBoardPackageStatisticsRevenue?StartDate=${packageRevenueRange.start.format(
          "YYYY-MM"
        )}&EndDate=${packageRevenueRange.end.format("YYYY-MM")}`
      );
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu doanh thu gói.");
      const data = await response.json();
      setPackageRevenueStatistics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPackageRevenue(false);
    }
  };

  const fetchUserStatistics = async () => {
    setLoadingUserStatistics(true);
    try {
      const response = await fetch(
        "https://localhost:7077/api/DashBoard/DashBoardUser"
      );
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu người dùng.");
      const data = await response.json();
      setUserStatistics({
        totalUser: data.totalUser,
        employersNumber: data.userStatistics.employersNumber,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUserStatistics(false);
    }
  };

  useEffect(() => {
    fetchRevenueStatistics();
  }, [revenueRange]);

  useEffect(() => {
    fetchPackageSoldStatistics();
  }, [soldRange]);

  useEffect(() => {
    fetchPackageRevenueStatistics();
  }, [packageRevenueRange]);

  useEffect(() => {
    fetchUserStatistics();
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
  const packageSoldBarChartOptions = {
    scales: {
      y: {
        ticks: {
          stepSize: 1, // Bước nhảy giữa các giá trị
          callback: function (value) {
            return Number.isInteger(value) ? value : null; // Chỉ hiển thị số nguyên
          },
        },
      },
    },
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
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={6}>
            <Card
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #81c784, #388e3c)",
                color: "#ffffff",
              }}
            >
              <h4 style={{ color: "#ffffff" }}>Tổng Doanh Thu</h4>
              <p>
                {loadingRevenue ? (
                  <span>Đang tải...</span>
                ) : (
                  <b style={{ color: "#ffffff" }}>
                    {totalRevenue.toLocaleString("vi-VN")} VND
                  </b>
                )}
              </p>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #64b5f6, #1565c0)",
                color: "#ffffff",
              }}
            >
              <h4 style={{ color: "#ffffff" }}>Tổng Gói Đã Bán</h4>
              <p>
                {loadingPackageSold ? (
                  <span>Đang tải...</span>
                ) : (
                  <b style={{ color: "#ffffff" }}>{totalPackagesSold} Gói</b>
                )}
              </p>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #ffb74d, #ef6c00)",
                color: "#ffffff",
              }}
            >
              <h4 style={{ color: "#ffffff" }}>Tổng Số Người Dùng</h4>
              <p>
                {loadingUserStatistics ? (
                  <span>Đang tải...</span>
                ) : (
                  <b style={{ color: "#ffffff" }}>
                    {userStatistics?.totalUser || 0} Người
                  </b>
                )}
              </p>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="info-card"
              style={{
                background: "linear-gradient(135deg, #e57373, #d32f2f)",
                color: "#ffffff",
              }}
            >
              <h4 style={{ color: "#ffffff" }}>Tổng Số Nhà Tuyển Dụng</h4>
              <p>
                {loadingUserStatistics ? (
                  <span>Đang tải...</span>
                ) : (
                  <b style={{ color: "#ffffff" }}>
                    {userStatistics?.employersNumber || 0} Nhà tuyển dụng
                  </b>
                )}
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
                        start: value ? value.startOf("month") : prev.start, // Kiểm tra null
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
                    onChange={(value) => {
                      if (
                        value &&
                        value.isBefore(revenueRange.start, "month")
                      ) {
                        message.error(
                          "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu."
                        );
                        return;
                      }
                      setRevenueRange((prev) => ({
                        ...prev,
                        end: value ? value.endOf("month") : prev.end, // Kiểm tra null
                      }));
                    }}
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
                        start: value ? value.startOf("month") : prev.start,
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
                    onChange={(value) => {
                      if (value && value.isBefore(soldRange.start, "month")) {
                        message.error(
                          "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu."
                        );
                        return;
                      }
                      setSoldRange((prev) => ({
                        ...prev,
                        end: value ? value.endOf("month") : prev.end,
                      }));
                    }}
                    format="MM-YYYY"
                    placeholder="Chọn tháng kết thúc"
                    style={{ width: "100%" }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </Col>
              </Row>
              <Bar data={packageSoldBarChartData} options={packageSoldBarChartOptions} />
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
                        start: value ? value.startOf("month") : prev.start,
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
                    onChange={(value) => {
                      if (
                        value &&
                        value.isBefore(packageRevenueRange.start, "month")
                      ) {
                        message.error(
                          "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu."
                        );
                        return;
                      }
                      setPackageRevenueRange((prev) => ({
                        ...prev,
                        end: value ? value.endOf("month") : prev.end,
                      }));
                    }}
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
