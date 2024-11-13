import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card, Row, Col, Input, Badge, Avatar, Pagination } from 'antd';
import { SearchOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import "../assets/css/colors/green-style.css";

const AdminDashboard = () => {
  // Dummy data
  const statistics = {
    savedJobs: 178,
    availableJobs: 20,
    completedJobs: 190,
    applications: 12,
  };

  const lineChartData = {
    labels: ['10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
    datasets: [
      {
        label: 'Reports',
        data: [40, 60, 50, 70, 65, 85, 90, 70, 60, 80],
        borderColor: '#7F56D9',
        backgroundColor: 'rgba(127, 86, 217, 0.1)',
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: ['In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [80, 15, 5],
        backgroundColor: ['#007BFF', '#FFC107', '#FF5722'],
      },
    ],
  };

  const recentJobs = [
    { id: '#1001', title: 'UI/UX Designer', price: '$1,500', applicants: 30, status: 'Active', posted: '1 day ago' },
    { id: '#1002', title: 'Software Engineer', price: '$2,800', applicants: 50, status: 'Active', posted: '2 days ago' },
    { id: '#1003', title: 'Content Writer', price: '$800', applicants: 20, status: 'Closed', posted: '3 days ago' },
    { id: '#1004', title: 'Project Manager', price: '$3,200', applicants: 40, status: 'Active', posted: '4 days ago' },
  ];

  const topJobs = [
    { title: 'Mobile App Developer', salary: '$3,500', applicants: 45 },
    { title: 'Data Scientist', salary: '$4,200', applicants: 30 },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">Base</div>
        <div className="sidebar-menu">
          <div className="menu-item">Dashboard</div>
          <div className="menu-item">Jobs</div>
          <div className="menu-item">Applications</div>
          <div className="menu-item">Reports</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <Input
            className="dashboard-search"
            placeholder="Search"
            prefix={<SearchOutlined />}
          />
          <div className="dashboard-actions">
            <Badge count={2}>
              <BellOutlined className="dashboard-icon" />
            </Badge>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ marginLeft: '15px', backgroundColor: '#87d068' }}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="dashboard-cards">
          {[
            { label: 'Saved Jobs', value: `${statistics.savedJobs}+`, color: '#E5F5FF' },
            { label: 'Available Jobs', value: `${statistics.availableJobs}+`, color: '#FFF7E5' },
            { label: 'Completed Jobs', value: `${statistics.completedJobs}+`, color: '#FFEFEF' },
            { label: 'Applications', value: `${statistics.applications}+`, color: '#F5F5FF' },
          ].map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card
                className="stat-card"
                style={{
                  backgroundColor: stat.color,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]} className="dashboard-charts">
          <Col xs={24} md={16}>
            <Card className="chart-card">
              <h3 className="chart-title">Reports</h3>
              <Line data={lineChartData} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="chart-card">
              <h3 className="chart-title">Job Status</h3>
              <Pie data={pieChartData} />
            </Card>
          </Col>
        </Row>

        {/* Recent Jobs */}
        <Card className="orders-card">
          <h3 className="orders-title">Recent Jobs</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Job Title</th>
                <th>Salary</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.price}</td>
                  <td>{job.applicants}</td>
                  <td>{job.status}</td>
                  <td>{job.posted}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination defaultCurrent={1} total={50} style={{ marginTop: '10px' }} />
        </Card>

        {/* Top Jobs */}
        <Card className="top-products-card">
          <h3 className="top-products-title">Top Jobs</h3>
          {topJobs.map((job, index) => (
            <div key={index} className="top-product-item">
              <div className="product-info">
                <h4>{job.title}</h4>
                <p>Salary: {job.salary}</p>
                <p>Applicants: {job.applicants}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
