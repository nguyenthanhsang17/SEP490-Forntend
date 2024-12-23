import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

function ViewAllJobSeekerInFavoriteList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [genderFilter, setGenderFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const [jobFilter, setJobFilter] = useState('');
    const [applyFilter, setApplyFilter] = useState('');
    const [nameFilter, setNameFilter] = useState(''); // New state for name filter
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState(null);
    const [descriptionFilter, setDescriptionFilter] = useState(''); // New state for description filter
    const [currentPage, setCurrentPage] = useState(1);
    const { enqueueSnackbar } = useSnackbar();

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const fetchJobSeekers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get('https://localhost:7077/api/FavoriteLists', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    pageNumber,
                    pageSize: 4,
                    gender: genderFilter,
                    age: ageFilter,
                    jobName: jobFilter,
                    applyStatus: applyFilter,
                    sort: sort,
                    name: nameFilter, // Pass the name filter to the API
                    description: descriptionFilter, // add description filter
                }
            });
            setJobSeekers(response.data.items);
            setTotalPages(response.data.totalPages);
            enqueueSnackbar('Dữ liệu đã được tải thành công!', { variant: 'success' }); // Thông báo khi tải thành công
        } catch (error) {
            console.error('Error fetching the job seeker data:', error);
            enqueueSnackbar('Không thể tải dữ liệu. Vui lòng thử lại.', { variant: 'error' }); // Thông báo lỗi

        }
    };

    useEffect(() => {
        fetchJobSeekers();
    }, [id, pageNumber, genderFilter, ageFilter, jobFilter, applyFilter, sort, nameFilter]);

    const handleDelete = async (jobseekerId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://localhost:7077/api/FavoriteLists/DeleteFavorite/${jobseekerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            enqueueSnackbar('Ứng viên đã được xóa khỏi danh sách yêu thích.', { variant: 'success' }); // Thông báo xóa thành công
            setJobSeekers(prevJobSeekers => prevJobSeekers.filter(seeker => seeker.userId !== jobseekerId));
        } catch (error) {
            console.error('Error deleting job seeker:', error);
            enqueueSnackbar('Xóa ứng viên không thành công. Vui lòng thử lại.', { variant: 'error' }); // Thông báo lỗi
        }
    };

    const handleSearch = () => {
        setPageNumber(1); // Reset về trang 1 khi có bộ lọc mới
        fetchJobSeekers(); // Gọi lại hàm để fetch dữ liệu mới
    };


    return (
        <>
            <Header />
            <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
                <div className="container">
                    <h1 className="text-center">Danh sách ứng viên ưa thích</h1>
                </div>
            </section>
            <div className="container job-seeker-list" style={{ paddingTop: '80px' }}>
                <div
                    className="filter-section"
                    style={{
                        backgroundColor: '#f9fbfc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label htmlFor="descriptionFilter" style={{ fontWeight: 'bold', color: '#495057' }}>Miêu tả về ứng viên:</label>
                        <input
                            type="text"
                            id="descriptionFilter"
                            className="form-control"
                            style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '8px 12px' }}
                            value={descriptionFilter}
                            onChange={(e) => setDescriptionFilter(e.target.value)}
                            placeholder="Nhập miêu tả"
                        />
                    </div>

                    <div className="sort-filter" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Ưu tiên hiển thị:</label>
                        <label style={{ marginRight: '5px' }}>
                            <input
                                type="checkbox"
                                name="sort"
                                value="1"
                                checked={sort === 1}
                                onChange={() => setSort(1)}
                            />
                            Theo số lượng công việc đã làm
                        </label>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="btn btn-primary mt-4"
                        style={{
                            backgroundColor: '#28a745',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                            alignSelf: 'start',
                        }}
                    >
                        Tìm kiếm
                    </button>
                </div>


                <div className="row justify-content-center">
                    {jobSeekers.length > 0 ? (
                        jobSeekers.map((seeker) => (
                            <div key={seeker.userId} className="col-md-6 mb-4" style={{ margin: '16px 0' }}>
                                <div
                                    className="card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column', // Thay đổi thành column
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        transition: '0.3s',
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <img
                                            src={seeker.avatarURL}
                                            alt={`${seeker.fullName}'s avatar`}
                                            className="card-img-top"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '5px',
                                                marginRight: '20px',
                                                marginLeft: '10px'
                                            }}
                                        />

                                        <div className="card-body">
                                            <p className="card-title" style={{ fontSize: '1.5rem' }}>{seeker.fullName}</p>
                                            <p className="card-text"><strong>Tuổi:</strong> {seeker.age}</p>
                                            <p className="card-text"><strong>Công việc hiện tại:</strong> {seeker.currentJob}</p>
                                            <p className="card-text"><strong>Giới tính:</strong> {seeker.gender ? 'Nam' : 'Nữ'}</p>
                                            <p className="card-text"><strong>Số công việc đã chấp nhận:</strong> {seeker.numberAppliedAccept}</p>
                                            <p className="card-text"><strong>Số công việc đã ứng tuyển:</strong> {seeker.numberApplied}</p>
                                        </div>
                                    </div>
                                    <div className='card-text' style={{
                                        display: 'flex',
                                        flexDirection: 'row', // Giữ nguyên column
                                        alignItems: 'flex-start',
                                        borderTop: '1px solid #ddd',
                                        padding: '10px', // Thêm padding
                                        width: '100%',
                                    }}>
                                        <p className="card-text" style={{
                                            marginTop: '5px', 
                                            width: '100%',
                                            wordBreak: 'break-word', // Cho phép từ dài xuống dòng
                                            whiteSpace: 'normal', // Cho phép xuống dòng
                                            overflowWrap: 'break-word' // Đảm bảo từ dài được ngắt
                                        }}><strong style={{ color: 'red' }}>Ghi chú :</strong> {seeker.descriptionFavorite+""}</p>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row', // Giữ nguyên column
                                        alignItems: 'flex-start',
                                        borderTop: '1px solid #ddd',
                                        padding: '10px', // Thêm padding
                                        width: '100%',
                                        justifyContent: 'space-around'
                                    }}>
                                        <a
                                            href={`/viewDetailJobSeeker/${seeker.userId}`}
                                            className="btn btn-primary mb-2" 
                                        >
                                            Xem chi tiết
                                        </a>
                                        <button
                                            onClick={() => handleDelete(seeker.userId)}
                                            className="btn btn-danger" 
                                        >
                                            Xóa khỏi danh sách
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-center">Không có ứng viên nào.</p>
                    )}
                </div>

                {jobSeekers.length > 0 && (
                    <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                        <Button
                            shape="circle"
                            icon={<LeftOutlined />}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                        <span style={{ margin: '0 10px', fontSize: '16px' }}>
                            {currentPage} / {totalPages} trang
                        </span>
                        <Button
                            shape="circle"
                            icon={<RightOutlined />}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </div>
                )}


            </div>
            <Footer />
        </>
    );
}

export default ViewAllJobSeekerInFavoriteList;
