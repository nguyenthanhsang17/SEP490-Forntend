import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from '../assets/img/banner-6.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
import Swal from 'sweetalert2';
function ReportPostJob() {
    const [reason, setReason] = useState(''); // đổi tên từ details thành reason
    const [idCardImages, setIdCardImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [isbamnut, setisbamnut] = useState(false);
    const navigate = useNavigate();
    const { id: postId } = useParams(); // đổi tên id thành postId

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleIdCardImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setErrorMessage('Vui lòng chọn tối đa 5 ảnh.');
            return;
        }
        setIdCardImages(files);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Disable nút ngay từ đầu
        setisbamnut(true);

        if (!reason || selectedImages.length === 0) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin và chọn tối đa 5 ảnh.');
            setisbamnut(false); // Bật lại nút nếu validate fail
            return;
        }

        const formData = new FormData();
        formData.append('Reason', reason);
        formData.append('PostId', postId);

        selectedImages.forEach((image) => {
            formData.append('files', image.file);
        });

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('https://localhost:7077/api/PostJobs/ReportJob', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error response:', response.status, errorBody);
                setisbamnut(false); // Bật lại nút nếu gặp lỗi
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
            }

            showAlert("Đã gửi báo cáo thành công");
            setisbamnut(false); // Bật lại nút sau khi thành công

        } catch (error) {
            console.error('Error submitting report:', error);
            setErrorMessage('Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại sau.');
            setisbamnut(false); // Bật lại nút nếu gặp lỗi
        }
    };

    const showAlert = async (text) => {
        const result = await Swal.fire({
            title: text,
            showCancelButton: true,
            confirmButtonText: 'Ok'
        });

        if (result.isConfirmed) {
            navigate(`/viewJobDetail/${postId}`);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (selectedImages.length + files.length > 5) {
            alert('Bạn chỉ được chọn tối đa 5 ảnh!');
            return;
        }

        const newImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file  // Lưu trực tiếp file gốc
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
    };

    const handleImageRemove = (index) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
    };

    return (
        <div style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
        }}>
            <div style={{
                maxWidth: '610px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
            }}>
                <img src={logoImage} alt="Logo" style={{ width: '250px', marginBottom: '5px' }} />
                <h2 style={{ marginBottom: '25px', fontFamily: 'Arial, sans-serif', color: '#333', fontSize: '1.5em' }}>Báo cáo bài đăng</h2>
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Lí do</label>
                    <textarea
                        placeholder="Chi tiết"
                        value={reason}
                        onChange={handleReasonChange}
                        style={{
                            width: '100%',
                            padding: '12px',
                            margin: '10px 0 20px 0',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1em',
                            resize: 'vertical',
                        }}
                        required
                    />

                    <span style={{ fontSize: '13px', color: '#777', display: 'block', marginBottom: '15px' }}>
                        Gửi ảnh hỗ trợ (tối đa 5 ảnh)
                    </span>

                    <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Ảnh</label>
                    <div className="input-group form-group full-width">
                        <div className="image-upload-container" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'nowrap',
                            overflowX: 'auto',
                            padding: '10px 0'
                        }}>
                            {selectedImages.map((image, index) => (
                                <div key={index} className="image-preview" style={{
                                    position: 'relative',
                                    minWidth: '100px',
                                    height: '100px',
                                    flexShrink: 0
                                }}>
                                    <img
                                        src={image.url}
                                        alt={`Preview ${index}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <button
                                        onClick={() => handleImageRemove(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            border: 'none',
                                            background: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {selectedImages.length < 5 && (
                                <label
                                    className="upload-button"
                                    style={{
                                        minWidth: '100px',
                                        height: '100px',
                                        border: '2px dashed #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '30px',
                                        flexShrink: 0,
                                        borderRadius: '4px'
                                    }}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    +
                                </label>
                            )}
                        </div>
                    </div>

                    {errorMessage && <p style={{ color: 'red', marginTop: '15px', fontSize: '0.9em' }}>{errorMessage}</p>}

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: isbamnut ? '#cccccc' : '#4CAF50', // Màu xám khi disable
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isbamnut ? 'not-allowed' : 'pointer',
                                fontSize: '1em',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s',
                                opacity: isbamnut ? 0.5 : 1 // Làm mờ nút khi disable
                            }}
                            disabled={isbamnut}
                            onMouseOver={(e) => !isbamnut && (e.target.style.backgroundColor = '#45a049')}
                            onMouseOut={(e) => !isbamnut && (e.target.style.backgroundColor = '#4CAF50')}
                        >
                            {isbamnut ? 'Đang gửi...' : 'Gửi'}
                        </button>

                        <button type="button" onClick={() => navigate("/viewJobDetail/" + postId)} style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#ff3b3b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1em',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                        }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#e62e2e'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ff3b3b'}
                            disabled={isbamnut}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReportPostJob;
