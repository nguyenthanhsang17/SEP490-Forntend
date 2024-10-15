import React from 'react';
import './App.css';
import Header from './Header'; // Importing the Header component
import Footer from './Footer'; // Importing the Footer component

function App() {
  return (
    <div className="App">
      <Header /> {/* Header component */}

      <section className="main-section">
        <div className="search-banner">
          <h1>Mức lương cao dành cho bạn</h1>
          <div className="search-bar">
            <input type="text" placeholder="Vị trí ứng tuyển" />
            <select>
              <option>Tất cả địa điểm</option>
            </select>
            <button>Tìm kiếm</button>
          </div>
          <div className="banner-info">
            <img src="banner-image.png" alt="Promotion" />
          </div>
        </div>

        <div className="job-stats">
          <div className="stat">
            <h3>Việc làm đang tuyển</h3>
            <p>43.346</p>
          </div>
          <div className="stat">
            <h3>Việc làm mới hôm nay</h3>
            <p>3.017</p>
          </div>
          <div className="stat-chart">
            <h3>Nhu cầu tuyển dụng theo ngành nghề</h3>
            <div className="chart-placeholder">Chart Placeholder</div>
          </div>
        </div>
      </section>

      <section className="job-listings">
        <h2>Việc làm tốt nhất</h2>
        <div className="filters">
          <button>Ngẫu Nhiên</button>
          <button>Hà Nội</button>
          <button>Thành phố Hồ Chí Minh</button>
          <button>Miền Bắc</button>
          <button>Miền Nam</button>
        </div>
        <div className="job-cards">
          <div className="job-card">
            <h3>Nhân Viên Kinh Doanh</h3>
            <p>Công ty Vconnex</p>
            <p>20-25 triệu</p>
            <p>Hà Nội & 2 nơi khác</p>
          </div>
        </div>
      </section>

      {/* Phần blog */}
      <section className="blog-section">
        <h2>Cẩm nang nghề nghiệp</h2>
        <div className="blog-cards">
          <article className="blog-card">
            <h3>Cách viết CV ấn tượng cho nhà tuyển dụng</h3>
            <p>Tìm hiểu cách để làm nổi bật CV của bạn trước nhà tuyển dụng.</p>
            <a href="#">Đọc thêm</a>
          </article>
          <article className="blog-card">
            <h3>Làm sao để chuẩn bị phỏng vấn tốt?</h3>
            <p>Những mẹo và lời khuyên giúp bạn chuẩn bị tốt cho buổi phỏng vấn.</p>
            <a href="#">Đọc thêm</a>
          </article>
          <article className="blog-card">
            <h3>Làm thế nào để thăng tiến trong sự nghiệp?</h3>
            <p>Chiến lược để bạn có thể phát triển và thăng tiến nhanh hơn trong công việc.</p>
            <a href="#">Đọc thêm</a>
          </article>
        </div>
      </section>

      <Footer /> {/* Footer component */}
    </div>
  );
}

export default App;
