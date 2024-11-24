import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios'; // Đảm bảo đã cài đặt axios
import Map from '../utils/Map';
import MapChoose from '../utils/MapChoose';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MapAutoComplete from '../utils/MapAutoComplete';
import { useSnackbar } from 'notistack'; // Import useSnackbar
import Swal from 'sweetalert2';
import GeocodingMap from '../utils/GeocodingMap';

function CreatePostJob() {



    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [salaryType, setSalaryType] = useState(1);
    const [rangeSalaryMin, setRangeSalaryMin] = useState('');
    const [rangeSalaryMax, setRangeSalaryMax] = useState('');
    const [fixSalary, setFixSalary] = useState('');
    const [numberPeople, setNumberPeople] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [isUrgentRecruitment, setIsUrgentRecruitment] = useState(false);
    const [jobCategory, setJobCategory] = useState(0);
    const [status, SetStatus] = useState(1);
    const [selectedImages, setSelectedImages] = useState([]);
    const today = new Date();
    today.setDate(today.getDate()); // Ngày mai
    const today1 = today.toISOString().split('T')[0];
    const [IsEvent, SetIsEvent] = useState(false);
    const [time, SetTime] = useState(1);
    const [postJobDates, setPostJobDates] = useState([{ eventDate: today1, startTime: '', endTime: '' }]);
    const [jsonOutput, setJsonOutput] = useState('');
    const [isLongTerm, setIsLongTerm] = useState(false);
    const [BamNut, SetBamNut] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [location, setLocation] = useState({
        addressDetail: '',
        address: {},
        latitude: 0,
        longitude: 0,
    });

    const [sangsalary, Setsangsalary] = useState(0);

    const handleToggle = () => {
        setIsLongTerm(!isLongTerm);
    };

    const [isOn, setIsOn] = useState(false);

    ///================================================

    const handleAddPostJobDate = () => {
        const today = new Date().toISOString().split('T')[0];
        setPostJobDates([...postJobDates, { eventDate: today, startTime: '', endTime: '' }]);
        console.log(postJobDates);
    };

    const handleInputChange = (index, field, value) => {
        const newPostJobDates = [...postJobDates];
        newPostJobDates[index][field] = value;
        setPostJobDates(newPostJobDates);
        console.log(postJobDates);
    };

    const handleDeletePostJobDate = (index) => {
        const newPostJobDates = postJobDates.filter((_, i) => i !== index);
        setPostJobDates(newPostJobDates);
        console.log(postJobDates);
    };

    const handlePublishPostJobDates = async (Postid) => {
        if (postJobDates.some(date => !date.eventDate || !date.startTime || !date.endTime)) {
            alert('Vui lòng điền đầy đủ thông tin cho tất cả các ngày làm việc');
            return 0;
        }

        const formattedPostJobDates = postJobDates.map((date, index) => ({
            postId: Postid,
            eventDate: new Date(date.eventDate).toISOString(),
            startTime: date.startTime,
            endTime: date.endTime
        }));

        console.log(formattedPostJobDates);

        try {
            const response = await fetch('https://localhost:7077/api/JobPostDates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedPostJobDates),
            });
            if (response.ok) {
                return 1;
            }

            if (!response.ok) {
                //throw new Error('Network response was not ok');
                return 0;
            }
            return await response.json(); // Trả về true hoặc false
        } catch (error) {
            console.error('Error posting job dates:', error);
            return 0;
        }
    };
    ///================================================

    const [PostID, SetPostID] = useState(-1);

    const [position, setPosition] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (latitude && longitude) {
            console.log("Vĩ độ: " + latitude);
            console.log("Kinh độ: " + longitude);
        }
    }, [latitude, longitude]);

    function removeVietnamFromAddress(address) {
        const target = ", Việt Nam";

        // Kiểm tra nếu chuỗi kết thúc bằng "Việt Nam"
        if (address.endsWith(target)) {
            // Cắt "Việt Nam" khỏi chuỗi
            return address.slice(0, -target.length).trim(); // Dùng trim để loại bỏ khoảng trắng thừa
        }

        return address; // Nếu không có "Việt Nam", trả về chuỗi gốc
    };

    const handlePositionChange = (newPosition) => {
        const { lat, lon } = newPosition[0];
        const latitude_a = parseFloat(lat);
        const longitude_a = parseFloat(lon);
        setLatitude(latitude_a);
        setLongitude(longitude_a);
        const addd = removeVietnamFromAddress(newPosition[0].display_name);
        console.log("latitude" + latitude_a);
        console.log("longitude" + longitude_a);
    };

    const handlePositionChangeToado = (lat, lon) => {
        const latitude_a = parseFloat(lat);
        const longitude_a = parseFloat(lon);
        setLatitude(latitude_a);
        setLongitude(longitude_a);
    };

    //==================================================================
    const [schedules, setSchedules] = useState([]);
    const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    const [tangdan, Settangdan] = useState(1);
    //==================================================================


    const addNewSchedule = () => {
        setSchedules([...schedules, {
            scheduleId: schedules.length + 1,
            scheduleName: `Lịch ${schedules.length + 1}`,
            slots: daysOfWeek.map((day, index) => ({
                SlotId: index + 1,
                DayOfWeek: index + 1,
                workingHourCreateDTOs: []
            }))
        }]);
    };

    const removeSchedule = (scheduleIndex) => {
        const newSchedules = schedules.filter((_, index) => index !== scheduleIndex);
        setSchedules(newSchedules);
        if (activeScheduleIndex >= newSchedules.length) {
            setActiveScheduleIndex(Math.max(0, newSchedules.length - 1));
        }
    };

    const addWorkingHour = (dayIndex) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[activeScheduleIndex].slots[dayIndex].workingHourCreateDTOs.push({
            ScheduleId: tangdan,
            StartTime: "09:00:00",
            EndTime: "17:00:00"
        });
        setSchedules(updatedSchedules);
        Settangdan(tangdan + 1);
    };

    const removeWorkingHour = (dayIndex, hourIndex) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[activeScheduleIndex].slots[dayIndex].workingHourCreateDTOs.splice(hourIndex, 1);
        setSchedules(updatedSchedules);
    };

    const handleTimeChange = (dayIndex, hourIndex, type, value) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[activeScheduleIndex].slots[dayIndex].workingHourCreateDTOs[hourIndex][type] = value + ":00";
        setSchedules(updatedSchedules);
    };

    // Tìm số ca làm việc tối đa trong tất cả các ngày
    const getMaxWorkingHours = () => {
        if (!schedules[activeScheduleIndex]) return 0;
        return Math.max(...schedules[activeScheduleIndex].slots.map(
            slot => slot.workingHourCreateDTOs.length
        ));
    };
    useEffect(() => {
        if (PostID !== -1) {
            const sang = formatDataForApi();
            console.log(JSON.stringify(sang, null, 2));
        }
    }, [PostID, schedules]); // Theo dõi sự thay đổi của PostID và schedules

    // Hàm format dữ liệu để gửi lên API
    const formatDataForApi = (PostID) => {
        return schedules.map(schedule => ({
            postId: PostID,
            userId: 0,
            jobScheduleCreateDTO: schedule.slots.map(slot => ({
                slotId: slot.SlotId,
                dayOfWeek: slot.DayOfWeek + 1,
                workingHourCreateDTOs: slot.workingHourCreateDTOs.map(hour => ({
                    scheduleId: Math.floor(Math.random() * 1000000) + 1,
                    startTime: hour.StartTime,
                    endTime: hour.EndTime
                }))
            })).filter(slot => slot.workingHourCreateDTOs.length > 0)
        })).filter(schedule => schedule.jobScheduleCreateDTO.length > 0);
    };

    //Hàm gọi API để lưu lịch làm việc
    const saveSchedule = async (PostID) => {
        try {
            setIsLoading(true);
            const dataToSend = formatDataForApi(PostID);
            console.log(JSON.stringify(dataToSend, null, 2));
            if (!dataToSend) {
                alert('Không có dữ liệu để lưu!');
                return 0;
            }

            const response = await axios.post(
                'https://localhost:7077/api/Slot',
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm các headers khác nếu cần (như Authorization)
                    }
                }
            );

            if (response.status === 200) {
                //alert('Lưu lịch làm việc thành công!');
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            // console.error('Lỗi khi lưu lịch làm việc:', error);
            // alert('Có lỗi xảy ra khi lưu lịch làm việc!');
            return 0;
        } finally {
            setIsLoading(false);
        }
    };
    //=====================================
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
    // Định dạng ngày thành "YYYY-MM-DD" để phù hợp với input[type="date"]
    const minDate = today.toISOString().split('T')[0];
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (selectedImages.length + files.length > 5) {
            alert('Bạn chỉ được chọn tối đa 5 ảnh!');
            return;
        }

        const newImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
    };
    const handleImageRemove = (index) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
    };

    const uploadImages = async (postId) => {
        if (selectedImages.length === 0) {
            alert('Không có ảnh để upload!');
            return 0;
        }

        setIsLoading(true);
        const formData = new FormData();

        selectedImages.forEach(image => {
            formData.append('files', image.file);
        });

        try {
            const response = await axios.post(
                'https://localhost:7077/api/Upload/UploadMultipleFilesForJob?postid=' + postId,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                // alert('Upload ảnh thành công!');
                // // Xử lý kết quả từ API nếu cần
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            // console.error('Error uploading images:', error);
            // alert('Có lỗi xảy ra trong quá trình upload ảnh.');
            return 0;
        } finally {
            setIsLoading(false);
        }
    };

    const toast = {
        error: (message) => {
            alert("Error: " + message);
        },
        success: (message) => {
            alert("Success: " + message);
        }
    };

    const validateJobData = () => {
        // Kiểm tra các trường không được null hoặc khoảng trắng
        if (!jobTitle || jobTitle.trim() === '') {
            toast.error('Vui lòng nhập tiêu đề công việc');
            return false;
        }
        if (!jobDescription || jobDescription.trim() === '') {
            toast.error('Vui lòng nhập mô tả công việc');
            return false;
        }
        if (!fixSalary || fixSalary.trim() === '') {
            toast.error('Vui lòng nhập lương');
            return false;
        }
        if (!numberPeople || numberPeople.trim() === '') {
            toast.error('Vui lòng nhập số lượng người cần tuyển');
            return false;
        }
        if (!address || address.trim() === '') {
            toast.error('Vui lòng nhập địa chỉ');
            return false;
        }

        // Kiểm tra salary_types_id và JobCategory_Id phải > 0
        if (!salaryType || parseInt(salaryType) <= 0) {
            toast.error('Vui lòng chọn loại lương');
            return false;
        }
        if (!jobCategory || parseInt(jobCategory) <= 0) {
            toast.error('Vui lòng chọn loại công việc');
            return false;
        }
        // Kiểm tra định dạng số
        if (isNaN(fixSalary) || parseFloat(fixSalary) <= 0) {
            toast.error('Lương phải là số dương');
            return false;
        }

        if (isNaN(numberPeople) || parseInt(numberPeople) <= 0) {
            toast.error('Số lượng người cần tuyển phải là số dương');
            return false;
        }

        // Kiểm tra định dạng ngày
        const currentDate = new Date();
        const expDate = new Date(expirationDate);
        if (expDate <= currentDate) {
            toast.error('Ngày hết hạn phải lớn hơn ngày hiện tại');
            return false;
        }

        // Kiểm tra định dạng tọa độ
        if (isNaN(latitude) || isNaN(longitude)) {
            toast.error('Vĩ độ và kinh độ phải là số');
            return false;
        }

        return true;
    };

    const luujob = async (e) => {
        e.preventDefault();
        SetBamNut(true);

        if (!validateJobData()) {
            return;
        }

        if (isLongTerm) {
            const dataToSend = formatDataForApi(-1);
            console.log(JSON.stringify(dataToSend, null, 2));
            if (!dataToSend) {
                alert('Chưa nhập đầy đủ các thông tin về lịch làm việc !!!');
                return 0;
            }
        } else {
            if (postJobDates.some(date => !date.eventDate || !date.startTime || !date.endTime)) {
                alert('Chưa nhập đầy đủ các thông tin về lịch làm việc !!!');
                return 0;
            }
        }

        const formattedPostJobDates = postJobDates.map((date, index) => ({
            postId: -1,
            eventDate: new Date(date.eventDate).toISOString(),
            startTime: date.startTime,
            endTime: date.endTime
        }));

        const jobData = {
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            salaryTypesId: salaryType,
            salary: fixSalary,
            NumberPeople: numberPeople,
            Address: address,
            latitude: latitude,
            longitude: longitude,
            ExpirationDate: expirationDate,
            status: 0,
            IsUrgentRecruitment: isUrgentRecruitment,
            jobCategoryId: jobCategory,
            time: time,
            slotDTOs: formatDataForApi(-1),
            jobPostDates: formattedPostJobDates,
            isLongTerm: isLongTerm
        };
        console.log(JSON.stringify(jobData, null, 2));

        const token = localStorage.getItem('token');
        console.log(token);


        try {
            const response = await fetch('https://localhost:7077/api/PostJobs/CreatePost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData),
            });
            if (response.ok) {
                const id = await response.json(); // Lấy trực tiếp giá trị id
                console.log("PostId: " + id);
                SetPostID(id);
                const uploadstatus = await uploadImages(id);
                showAlert("Tạo Công việc Thành công");
            } else {
                try {
                    const errorData = await response.json();
                    showAlert2(errorData.message || "Có lỗi xảy ra");
                } catch {
                    showAlert("Có lỗi xảy ra");
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        SetBamNut(false);
    };

    const showAlert = async (text) => {
        const result = await Swal.fire({
            title: text,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        });

        if (result.isConfirmed) {
            navigate("/viewListJobsCreated");
        }
    };

    const showAlert2 = async (text) => {
        const result = await Swal.fire({
            title: text,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        });

        if (result.isConfirmed) {
            navigate("/viewAllPriceList");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        SetBamNut(true);

        if (!validateJobData()) {
            return;
        }

        if (isLongTerm) {
            const dataToSend = formatDataForApi(-1);
            console.log(JSON.stringify(dataToSend, null, 2));
            if (!dataToSend) {
                alert('Chưa nhập đầy đủ các thông tin về lịch làm việc !!!');
                return 0;
            }
        } else {
            if (postJobDates.some(date => !date.eventDate || !date.startTime || !date.endTime)) {
                alert('Chưa nhập đầy đủ các thông tin về lịch làm việc !!!');
                return 0;
            }
        }

        const formattedPostJobDates = postJobDates.map((date, index) => ({
            postId: -1,
            eventDate: new Date(date.eventDate).toISOString(),
            startTime: date.startTime,
            endTime: date.endTime
        }));

        const jobData = {
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            salaryTypesId: salaryType,
            salary: fixSalary,
            NumberPeople: numberPeople,
            Address: address,
            latitude: latitude,
            longitude: longitude,
            ExpirationDate: expirationDate,
            status: 1,
            IsUrgentRecruitment: isUrgentRecruitment,
            jobCategoryId: jobCategory,
            time: time,
            slotDTOs: formatDataForApi(-1),
            jobPostDates: formattedPostJobDates,
            isLongTerm: isLongTerm
        };
        console.log(JSON.stringify(jobData, null, 2));

        const token = localStorage.getItem('token');
        console.log(token);


        try {
            const response = await fetch('https://localhost:7077/api/PostJobs/CreatePost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData),
            });
            if (response.ok) {
                const id = await response.json(); // Lấy trực tiếp giá trị id
                console.log("PostId: " + id);
                SetPostID(id);
                const uploadstatus = await uploadImages(id);
                showAlert("Tạo Công việc Thành công");
            } else {
                try {
                    const errorData = await response.json();
                    showAlert2(errorData.message || "Có lỗi xảy ra");
                } catch {
                    showAlert("Có lỗi xảy ra");
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        SetBamNut(false);
    };

    const handleLocationSubmit = (locationDetails) => {
        setLocation(locationDetails);
        console.log("Location submitted:", locationDetails);
    };

    const handleChange = (event) => {
        // Xóa tất cả dấu phẩy để lấy giá trị số
        const value = event.target.value.replace(/,/g, '');
        const numericValue = Number(value) || 0; // Chuyển đổi sang số, mặc định là 0 nếu không hợp lệ
        setFixSalary(numericValue); // Cập nhật giá trị fixSalary
    };

    return (
        <>
            <Header />
            <section className="inner-header-title blank">
                <div className="container">
                    <h1>Tạo bài đăng tuyển</h1>
                </div>
            </section>
            <div className="clearfix"></div>

            <div className="detail-desc section">
                <div className="container white-shadow">
                    <div className="row bottom-mrg">
                        <form className="add-feild form-container" >
                            <div className="input-group form-group">
                                <label>Tiêu đề công việc</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tiêu đề công việc"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>

                            <div className="input-group form-group">
                                <label>Chọn loại công việc</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <select
                                    className="form-control"
                                    value={jobCategory}
                                    onChange={(e) => setJobCategory(e.target.value)}
                                >
                                    <option value="">Chọn loại công việc</option>
                                    <option value="1">Hành chính</option>
                                    <option value="2">Bán hàng & Tiếp thị</option>
                                    <option value="3">Dịch vụ khách hàng</option>
                                    <option value="4">Nhân viên sự kiện</option>
                                    <option value="5">Nhà hàng, khách sạn</option>
                                    <option value="6">Bán lẻ</option>
                                    <option value="7">Hậu cần & Giao hàng</option>
                                    <option value="8">Lao động chân tay</option>
                                    <option value="9">Sáng tạo & Truyền thông</option>
                                    <option value="10">Hỗ trợ kỹ thuật</option>
                                </select>
                            </div>
                            <div className="input-group form-group">
                                <label>Chọn kiểu trả lương</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <select
                                    className="form-control"
                                    value={salaryType}
                                    onChange={(e) => setSalaryType(e.target.value)}
                                >
                                    <option value="">Chọn kiểu trả lương</option>
                                    <option value="1">Theo giờ</option>
                                    <option value="2">Theo ngày</option>
                                    <option value="3">Theo công việc</option>
                                    <option value="4">Theo tuần</option>
                                    <option value="5">Theo tháng</option>
                                    <option value="6">Lương cố định</option>
                                </select>
                            </div>
                            <div className="input-group form-group">
                                <label>Mức lương vnd</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Lương Đơn vị VND"
                                    value={fixSalary}
                                    min={10000}
                                    onChange={(e) => setFixSalary(e.target.value)}
                                />
                            </div>
                            <div className="input-group form-group">
                                <label>Số lượng người cần tuyển</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Số lượng người cần tuyển"
                                    value={numberPeople}
                                    min={1}
                                    max={100}
                                    onChange={(e) => setNumberPeople(e.target.value)}
                                />
                            </div>

                            <div className="input-group form-group full-width">
                                <label>Mô tả công việc</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <textarea
                                    className="form-control"
                                    placeholder="Mô tả công việc"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="input-group form-group">
                                <label>Địa chỉ chi tiết</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Địa chỉ chi tiết"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>


                            <div className="input-group form-group full-width">
                                <label>Ảnh công việc</label>
                                <div className="image-upload-container" style={{
                                    display: 'flex',
                                    flexDirection: 'row', // đảm bảo các items nằm ngang
                                    alignItems: 'center',
                                    gap: '10px', // khoảng cách giữa các ảnh
                                    flexWrap: 'nowrap', // ngăn không cho wrap xuống dòng
                                    overflowX: 'auto', // cho phép scroll ngang nếu nhiều ảnh
                                    padding: '10px 0'
                                }}>
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="image-preview" style={{
                                            position: 'relative',
                                            minWidth: '100px', // đảm bảo kích thước tối thiểu
                                            height: '100px',
                                            flexShrink: 0 // ngăn không cho ảnh co lại
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

                            <div className="input-group form-group full-width">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isUrgentRecruitment}
                                        onChange={(e) => setIsUrgentRecruitment(e.target.checked)}
                                        style={{ marginRight: 10 }}
                                    />
                                    Tuyển dụng nổi bật
                                </label>
                            </div>

                            <div className="input-group form-group ">
                                <label>Thời gian duy trì bài đăng:</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <select className="form-control" value={time} onChange={(e) => SetTime(e.target.value)}>
                                    <option value={1}>1 tháng</option>
                                    <option value={2}>2 tháng</option>
                                    <option value={3}>3 tháng</option>
                                </select>
                            </div>

                            <div className="full-width">
                                <label style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    width: '160px',
                                    height: '40px',
                                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={isLongTerm}
                                        onChange={handleToggle}
                                        style={{
                                            opacity: 0,
                                            width: 0,
                                            height: 0
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: '#f0f0f0',
                                        transition: 'all 0.4s ease',
                                        borderRadius: '40px',
                                        border: '2px solid #d5d5d5',
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            content: '""',
                                            height: '36px',
                                            width: '80px',
                                            left: isLongTerm ? '80px' : '0',
                                            bottom: '0',
                                            backgroundColor: isLongTerm ? '#4CAF50' : '#3498db',
                                            transition: 'all 0.4s ease',
                                            borderRadius: '36px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                        }} />
                                        <span style={{
                                            position: 'absolute',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            color: isLongTerm ? '#3498db' : 'white',
                                            left: '15px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            transition: 'all 0.4s ease',
                                        }}>
                                            Ngắn hạn
                                        </span>
                                        <span style={{
                                            position: 'absolute',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            color: isLongTerm ? 'white' : '#4CAF50',
                                            right: '15px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            transition: 'all 0.4s ease',
                                        }}>
                                            Dài hạn
                                        </span>
                                    </span>
                                </label>
                            </div>
                            <div className="full-width">
                                <label>Lịch Làm việc</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                {isLongTerm ? (<div>
                                    {/* Schedule Selection Tabs */}
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                        {schedules.map((schedule, index) => (
                                            <div key={schedule.scheduleId} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <button
                                                    onClick={() => setActiveScheduleIndex(index)}
                                                    type='button'
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: activeScheduleIndex === index ? '#2196F3' : '#e0e0e0',
                                                        color: activeScheduleIndex === index ? 'white' : 'black',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {schedule.scheduleName}
                                                </button>
                                                <button
                                                    onClick={() => removeSchedule(index)}
                                                    type='button'
                                                    style={{
                                                        padding: '8px',
                                                        backgroundColor: '#f44336',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewSchedule}
                                            type='button'
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            + Thêm lịch mới
                                        </button>
                                    </div>

                                    {schedules.length > 0 && (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                                <thead>
                                                    <tr>
                                                        {daysOfWeek.map((day, index) => (
                                                            <th key={index} style={{
                                                                border: '1px solid #ddd',
                                                                padding: '12px 8px',
                                                                backgroundColor: '#f2f2f2',
                                                                minWidth: '200px'
                                                            }}>
                                                                <div style={{ marginBottom: '10px' }}>{day}</div>
                                                                <button
                                                                    onClick={() => addWorkingHour(index)}
                                                                    type='button'
                                                                    style={{
                                                                        padding: '4px 8px',
                                                                        backgroundColor: '#4CAF50',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    + Thêm ca
                                                                </button>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[...Array(getMaxWorkingHours())].map((_, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            {schedules[activeScheduleIndex].slots.map((slot, dayIndex) => (
                                                                <td key={dayIndex} style={{
                                                                    border: '1px solid #ddd',
                                                                    padding: '8px',
                                                                    verticalAlign: 'top'
                                                                }}>
                                                                    {slot.workingHourCreateDTOs[rowIndex] && (
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '5px',
                                                                            marginBottom: '5px'
                                                                        }}>
                                                                            <input
                                                                                type="time"
                                                                                value={slot.workingHourCreateDTOs[rowIndex].StartTime.slice(0, -3)}
                                                                                onChange={(e) => handleTimeChange(dayIndex, rowIndex, "StartTime", e.target.value)}
                                                                                style={{ padding: '4px' }}
                                                                            />
                                                                            <span>-</span>
                                                                            <input
                                                                                type="time"
                                                                                value={slot.workingHourCreateDTOs[rowIndex].EndTime.slice(0, -3)}
                                                                                onChange={(e) => handleTimeChange(dayIndex, rowIndex, "EndTime", e.target.value)}
                                                                                style={{ padding: '4px' }}
                                                                            />
                                                                            <button
                                                                                onClick={() => removeWorkingHour(dayIndex, rowIndex)}
                                                                                type='button'
                                                                                style={{
                                                                                    padding: '4px 8px',
                                                                                    backgroundColor: '#ff4444',
                                                                                    color: 'white',
                                                                                    border: 'none',
                                                                                    borderRadius: '4px',
                                                                                    cursor: 'pointer'
                                                                                }}
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>) : (<div style={styles.container}>
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
                                                        value={date.eventDate}  // Nếu `date.eventDate` null thì lấy ngày hiện tại
                                                        onChange={e => handleInputChange(index, 'eventDate', e.target.value)}
                                                        style={styles.input}
                                                        min={new Date().toISOString().split('T')[0]}  // Giới hạn ngày chọn chỉ có thể là ngày hiện tại trở đi
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
                                            style={{ ...styles.button, ...styles.addButton }}
                                            type='button'
                                            onClick={handleAddPostJobDate}
                                        >
                                            Thêm ngày làm việc
                                        </button>


                                    </div>

                                    {jsonOutput && (
                                        <div style={styles.jsonOutput}>
                                            <h3>JSON Output:</h3>
                                            <pre>{jsonOutput}</pre>
                                        </div>
                                    )}
                                </div>)}

                            </div>
                            <div className="full-width">
                                <label>Tọa độ chi tiết công việc</label><label style={{ marginLeft: "10px", color: 'red' }}> * </label>
                                <GeocodingMap handlePositionChange={handlePositionChange} handlePositionChangeToado={handlePositionChangeToado} />
                            </div>
                            <div className="input-group form-group">
                                <div display="flex">
                                    <button
                                        style={{
                                            width: "50%",
                                            backgroundColor: BamNut ? "gray" : "",
                                            cursor: BamNut ? "not-allowed" : "pointer"
                                        }}
                                        className={`btn ${BamNut ? "btn-secondary" : "btn-success"} btn-primary small-btn`}
                                        onClick={!BamNut ? handleSubmit : null} // Chặn click nếu đang xử lý
                                        disabled={BamNut} // Disable nút khi đang xử lý
                                    >
                                        {BamNut ? "Đang Đăng công việc..." : "Đăng công việc"}
                                    </button>
                                </div>
                            </div>
                            <div className="input-group form-group">
                                <div display="flex">
                                    <button
                                        style={{
                                            width: "50%",
                                            backgroundColor: BamNut ? "gray" : "orange",
                                            cursor: BamNut ? "not-allowed" : "pointer"
                                        }}
                                        className={`btn ${BamNut ? "btn-secondary" : "btn-success"} btn-primary small-btn`}
                                        onClick={!BamNut ? luujob : null} // Chặn click nếu đang xử lý
                                        disabled={BamNut} // Disable nút khi đang xử lý
                                    >
                                        {BamNut ? "Đang Lưu công việc..." : "Lưu công việc"}
                                    </button>
                                </div>
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