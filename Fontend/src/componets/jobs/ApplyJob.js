import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom'; 

function ApplyJob() {
    const { job_id } = useParams();
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCvs = async () => {
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Kiểm tra giá trị token
            
            if (!token) {
                console.log("No token found, cannot fetch CVs.");
                setLoading(false);
                return; // Không làm gì cả nếu không có token
            }

            try {
                const response = await axios.get(
                    "https://localhost:7077/api/Cvs/GetCvByUID", // Điều chỉnh đường dẫn nếu cần
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCvs(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching CVs:", err); // In ra lỗi chi tiết
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCvs();
    }, []);

    // Styles for the component
    const styles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        title: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
        },
        cvItems: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px', // Khoảng cách giữa các mục CV
        },
        cvItem: {
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '5px',
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
        },
        cvItemTitle: {
            fontSize: '1.5rem',
            marginBottom: '10px',
            color: '#007bff', // Màu xanh cho tiêu đề CV
        },
        cvDetail: {
            padding: '10px 0',
            borderTop: '1px solid #eaeaea',
        },
        cvDetailTitle: {
            fontWeight: 'bold',
            color: '#555',
        },
        cvDetailDescription: {
            margin: '5px 0 0',
            color: '#777', // Màu xám cho mô tả
        },
        applyButton: {
            marginTop: '10px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        applyButtonHover: {
            backgroundColor: '#0056b3',
        },
        loading: {
            textAlign: 'center',
            color: '#888',
            marginTop: '20px',
        },
        error: {
            textAlign: 'center',
            color: '#888',
            marginTop: '20px',
        },
    };

    const handleApply = (cvId) => {
        // Xử lý ứng tuyển với cvId được chọn
        console.log(`Applying with CV ID: ${cvId}`);
        // Thực hiện logic ứng tuyển ở đây
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div style={styles.error}>Error: {error}</div>;
    }

    return (
        <>
            <Header />
            <div style={styles.container}>
            <h5 style={{ paddingTop: '30px' }}></h5>
                <h2 style={styles.title}>Select Your CV for Job Application</h2>
                <div style={styles.cvItems}>
                    {cvs.map(cv => (
                        <div key={cv.cvId} style={styles.cvItem}>
                            <h3 style={styles.cvItemTitle}>CV ID: {cv.cvId}</h3>
                            {cv.itemOfCvs.map(item => (
                                <div key={item.itemOfCvId} style={styles.cvDetail}>
                                    <h4 style={styles.cvDetailTitle}>{item.itemName}</h4>
                                    <p style={styles.cvDetailDescription}>{item.itemDescription}</p>
                                </div>
                            ))}
                            <button
                                style={styles.applyButton}
                                onClick={() => handleApply(cv.cvId)}
                            >
                                Ứng tuyển bằng CV này
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ApplyJob;

