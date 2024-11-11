import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="row no-padding">
          <div className="container">
            <div className="col-md-3 col-sm-12">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Về Job Stock</h3>
                <div className="textwidget">
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
                  <p>7860 North Park Place<br/>San Francisco, CA 94120</p>
                  <p><strong>Email:</strong> Support@careerdesk</p>
                  <p><strong>Gọi:</strong> <a href="tel:+15555555555">555-555-1234</a></p>
                  <ul className="footer-social">
                    <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                    <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Tất Cả Điều Hướng</h3>
                <div className="textwidget">
                  <ul className="footer-navigation">
                    <li><a href="manage-company.html" title="">Thiết kế Front-end</a></li>
                    <li><a href="manage-company.html" title="">Lập trình Android</a></li>
                    <li><a href="manage-company.html" title="">Phát triển CMS</a></li>
                    <li><a href="manage-company.html" title="">Lập trình PHP</a></li>
                    <li><a href="manage-company.html" title="">Lập trình iOS</a></li>
                    <li><a href="manage-company.html" title="">Lập trình iPhone</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Tất Cả Danh Mục</h3>
                <div className="textwidget">
                  <ul className="footer-navigation">
                    <li><a href="manage-company.html" title="">Thiết kế Front-end</a></li>
                    <li><a href="manage-company.html" title="">Lập trình Android</a></li>
                    <li><a href="manage-company.html" title="">Phát triển CMS</a></li>
                    <li><a href="manage-company.html" title="">Lập trình PHP</a></li>
                    <li><a href="manage-company.html" title="">Lập trình iOS</a></li>
                    <li><a href="manage-company.html" title="">Lập trình iPhone</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Kết Nối Với Chúng Tôi</h3>
                <div className="textwidget">
                  <p><strong>Điện Thoại:</strong> +1 (234) 567-8900</p>
                  <p><strong>Email:</strong> contact@yourwebsite.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row copyright">
          <div className="container">
            <p><a target="_blank" href="https://www.templateshub.net">2024</a></p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
