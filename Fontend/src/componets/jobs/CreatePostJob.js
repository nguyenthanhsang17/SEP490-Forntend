import React, { useState } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';

function CreatePostJob() {
    // Khởi tạo state cho các trường trong bảng Post
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [salaryType, setSalaryType] = useState('');
    const [rangeSalaryMin, setRangeSalaryMin] = useState('');
    const [rangeSalaryMax, setRangeSalaryMax] = useState('');
    const [fixSalary, setFixSalary] = useState('');
    const [numberPeople, setNumberPeople] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [isUrgentRecruitment, setIsUrgentRecruitment] = useState(false);
    const [jobCategory, setJobCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const jobData = {
            JobTitle: jobTitle,
            JobDescription: jobDescription,
            salary_types_id: salaryType,
            RangeSalaryMin: rangeSalaryMin,
            RangeSalaryMax: rangeSalaryMax,
            FixSalary: fixSalary,
            NumberPeople: numberPeople,
            Address: address,
            latitude: latitude,
            longitude: longitude,
            ExpirationDate: expirationDate,
            IsUrgentRecruitment: isUrgentRecruitment,
            JobCategory_Id: jobCategory
        };

        console.log("Job Data:", jobData);
        // Gửi dữ liệu lên server hoặc API
    };

    return (
        <>
            <Header />
            <section className="inner-header-title blank">
                <div className="container">
                    <h1>Create Job</h1>
                </div>
            </section>
            <div className="clearfix"></div>

            <div className="detail-desc section">
                <div className="container white-shadow">
                    <div className="row">
                        <div className="detail-pic js">
                            <div className="box">
                                <input type="file" name="upload-pic[]" id="upload-pic" className="inputfile" />
                                <label htmlFor="upload-pic"><i className="fa fa-upload" aria-hidden="true"></i><span>Upload Logo</span></label>
                            </div>
                        </div>
                    </div>

                    <div className="row bottom-mrg">
                        <form className="add-feild" onSubmit={handleSubmit}>
                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Job Title"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <select 
                                        className="form-control" 
                                        value={salaryType} 
                                        onChange={(e) => setSalaryType(e.target.value)}
                                    >
                                        <option>Chọn loại lương</option>
                                        <option value="1">Theo giờ</option>
                                        <option value="2">Theo tháng</option>
                                        <option value="3">Theo dự án</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Lương tối thiểu"
                                        value={rangeSalaryMin}
                                        onChange={(e) => setRangeSalaryMin(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Lương tối đa"
                                        value={rangeSalaryMax}
                                        onChange={(e) => setRangeSalaryMax(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Lương cố định"
                                        value={fixSalary}
                                        onChange={(e) => setFixSalary(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Số lượng người cần tuyển"
                                        value={numberPeople}
                                        onChange={(e) => setNumberPeople(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-12 col-sm-12">
                                <textarea 
                                    className="form-control" 
                                    placeholder="Mô tả công việc"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>
                            
                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Địa chỉ"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Latitude"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Longitude"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        placeholder="Ngày hết hạn"
                                        value={expirationDate}
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="input-group">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={isUrgentRecruitment} 
                                            onChange={(e) => setIsUrgentRecruitment(e.target.checked)}
                                        />
                                        Tuyển dụng khẩn cấp
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-12 col-sm-12">
                                <button className="btn btn-success btn-primary small-btn">Đăng công việc</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CreatePostJob;
