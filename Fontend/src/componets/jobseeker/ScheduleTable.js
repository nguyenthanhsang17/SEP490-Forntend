import React, { useState } from 'react';

const ScheduleTable = () => {
    const [postJobDates, setPostJobDates] = useState([{ eventDate: '', startTime: '', endTime: '' }]);
    const [jsonOutput, setJsonOutput] = useState('');

    const handleAddPostJobDate = () => {
        setPostJobDates([...postJobDates, { eventDate: '', startTime: '', endTime: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const newPostJobDates = [...postJobDates];
        newPostJobDates[index][field] = value;
        setPostJobDates(newPostJobDates);
    };

    const handleDeletePostJobDate = (index) => {
        const newPostJobDates = postJobDates.filter((_, i) => i !== index);
        setPostJobDates(newPostJobDates);
    };

    const handlePublishPostJobDates = () => {
        if (postJobDates.some(date => !date.eventDate || !date.startTime || !date.endTime)) {
            alert('Vui lòng điền đầy đủ thông tin cho tất cả các ngày làm việc');
            return;
        }

        const formattedPostJobDates = postJobDates.map((date, index) => ({
            postId: index,
            eventDate: new Date(date.eventDate).toISOString(),
            startTime: date.startTime,
            endTime: date.endTime
        }));

        console.log(formattedPostJobDates);

        setJsonOutput(JSON.stringify(formattedPostJobDates, null, 2));
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '20px auto',
            padding: '30px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif'
        },
        title: {
            textAlign: 'center',
            color: '#343a40',
            marginBottom: '30px',
            fontSize: '28px',
            fontWeight: '600'
        },
        dateGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        dateCard: {
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            position: 'relative'
        },
        cardTitle: {
            color: '#495057',
            marginBottom: '15px',
            fontSize: '18px'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            color: '#6c757d',
            fontSize: '14px'
        },
        input: {
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            fontSize: '14px',
            transition: 'border-color 0.15s ease-in-out',
            boxSizing: 'border-box'
        },
        buttonContainer: {
            display: 'flex',
            gap: '15px',
            marginTop: '20px'
        },
        button: {
            flex: 1,
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '16px',
            transition: 'opacity 0.2s ease'
        },
        addButton: {
            backgroundColor: '#28a745',
            color: 'white',
        },
        publishButton: {
            backgroundColor: '#007bff',
            color: 'white',
        },
        deleteButton: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px'
        },
        jsonOutput: {
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            color: '#212529'
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Tạo ngày làm việc</h2>
            
            <div style={styles.dateGrid}>
                {postJobDates.map((date, index) => (
                    <div key={index} style={styles.dateCard}>
                        <h3 style={styles.cardTitle}>Ngày làm việc {index + 1}</h3>
                        <button 
                            style={styles.deleteButton}
                            onClick={() => handleDeletePostJobDate(index)}
                        >
                            Xóa
                        </button>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Ngày:</label>
                            <input
                                type="date"
                                value={date.eventDate}
                                onChange={e => handleInputChange(index, 'eventDate', e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Giờ bắt đầu:</label>
                            <input
                                type="time"
                                value={date.startTime}
                                onChange={e => handleInputChange(index, 'startTime', e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Giờ kết thúc:</label>
                            <input
                                type="time"
                                value={date.endTime}
                                onChange={e => handleInputChange(index, 'endTime', e.target.value)}
                                style={styles.input}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.buttonContainer}>
                <button 
                    style={{...styles.button, ...styles.addButton}}
                    onClick={handleAddPostJobDate}
                >
                    Thêm ngày làm việc
                </button>

                <button 
                    style={{...styles.button, ...styles.publishButton}}
                    onClick={handlePublishPostJobDates}
                >
                    Đăng ngày làm việc
                </button>
            </div>

            {jsonOutput && (
                <div style={styles.jsonOutput}>
                    <h3>JSON Output:</h3>
                    <pre>{jsonOutput}</pre>
                </div>
            )}
        </div>
    );
};

export default ScheduleTable;