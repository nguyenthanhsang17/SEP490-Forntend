import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios'; // Đảm bảo đã cài đặt axios
import Map from '../utils/Map';
import MapChoose from '../utils/MapChoose';
import MapAutoComplete from '../utils/MapAutoComplete';
import Swal from 'sweetalert2';
import GeocodingMap from '../utils/GeocodingMap';
import { useParams, useNavigate } from 'react-router-dom'; // Single import statement
function EditPostJob() {
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
    today.setDate(today.getDate() + 2); // Ngày mai
    const [IsEvent, SetIsEvent] = useState(false);
    const [time, SetTime] = useState(1);
    const { id } = useParams();

    const [postJobDates, setPostJobDates] = useState([{ eventDate: '', startTime: '', endTime: '' }]);
    const [jsonOutput, setJsonOutput] = useState('');
    const [isLongTerm, setIsLongTerm] = useState(false);
    const [location, setLocation] = useState({
        addressDetail: '',
        address: {},
        latitude: 0,
        longitude: 0,
    });

    const [sangsalary, Setsangsalary] = useState(0);
    const [JobDetail, SetJobDetail] = useState({});

    const handleToggle = () => {
        setIsLongTerm(!isLongTerm);
        console.log(isLongTerm);
    };

    const [isOn, setIsOn] = useState(false);


    const [imagesData, setImagesData] = useState([
        // Sẽ chứa cả URL và ID
        ...(JobDetail.imagesURL || []).map((url, index) => ({
            url: url,
            id: JobDetail.imagesURLIds ? JobDetail.imagesURLIds[index] : null
        })),
        // Các ảnh local sẽ có id là null ban đầu
    ]);

    ///================================================

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

    const handlePublishPostJobDates = async (Postid) => {
        if (postJobDates.some(date => !date.eventDate || !date.startTime || !date.endTime)) {
            alert('Vui lòng điền đầy đủ thông tin cho tất cả các ngày làm việc');
            return;
        }

        const formattedPostJobDates = postJobDates.map((date, index) => ({
            postId: id,
            eventDate: new Date(date.eventDate).toISOString(),
            startTime: date.startTime,
            endTime: date.endTime
        }));

        console.log(formattedPostJobDates);
        console.log(JSON.stringify(formattedPostJobDates, null, 2));
        try {
            const response = await fetch(`https://localhost:7077/api/JobPostDates/UpdateJobPostDate/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedPostJobDates),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json(); // Trả về true hoặc false
        } catch (error) {
            console.error('Error posting job dates:', error);
            return false;
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

    const handlePositionChange = (newPosition, address) => {
        setPosition(newPosition);
        setLatitude(newPosition.lat);
        setLongitude(newPosition.lng);
        console.log(newPosition);
        console.log(address);
        setAddress(address);
        JobDetail.address= address;

    };
    //==================================================================
    const [schedules, setSchedules] = useState([]);
    const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    const [tangdan, Settangdan] = useState(1);
    //==================================================================


    useEffect(() => {
        const LoadJobFirst = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log(token);
                const response = await axios.get(
                    `https://localhost:7077/api/PostJobs/GetJobDetailForUpdate/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );

                if (response.status === 200) {

                    SetJobDetail(response.data);
                    console.log("call 1 lan");
                }
            } catch (error) {
                console.error('Lỗi khi lưu lịch làm việc:', error);
            } finally {
                setIsLoading(false);
            }
        };
        LoadJobFirst();
    }, [id]);

    useEffect(() => {
        if (JobDetail) {
            //console.log("JobDetail state:", JSON.stringify(JobDetail, null, 2));
            console.log("job thay dỏi r")
        }
    }, [JobDetail.postId,
    JobDetail.jobTitle,
    JobDetail.jobDescription,
    JobDetail.salaryTypesId,
    JobDetail.salary,
    JobDetail.numberPeople,
    JobDetail.address,
    JobDetail.latitude,
    JobDetail.longitude,
    JobDetail.isUrgentRecruitment,
    JobDetail.jobCategoryId,
    JobDetail.time]);

    useEffect(() => {
        if (JobDetail && JobDetail.imagesURL && JobDetail.imagesURL.length > 0) {
            const updatedImagesData = JobDetail.imagesURL.map((url, index) => ({
                url: url,
                id: JobDetail.imagesURLIds ? JobDetail.imagesURLIds[index] : null
            }));

            setImagesData(updatedImagesData);
        }
    }, [JobDetail]);

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

    // Hàm format dữ liệu để gửi lên API
    const formatDataForApi = () => {
        return schedules.map(schedule => ({
            postId: id,
            userId: 0,
            jobScheduleCreateDTO: schedule.slots.map(slot => ({
                slotId: slot.SlotId,
                dayOfWeek: slot.DayOfWeek,
                workingHourCreateDTOs: slot.workingHourCreateDTOs.map(hour => ({
                    scheduleId: Math.floor(Math.random() * 1000000) + 1,
                    startTime: hour.StartTime,
                    endTime: hour.EndTime
                }))
            })).filter(slot => slot.workingHourCreateDTOs.length > 0)
        })).filter(schedule => schedule.jobScheduleCreateDTO.length > 0);
    };

    const handlePositionChangeToado = (lat, lon) => {
        const latitude_a = parseFloat(lat);
        const longitude_a = parseFloat(lon);
        setLatitude(latitude_a);
        setLongitude(longitude_a);
        JobDetail.latitude=latitude_a;
        JobDetail.longitude=longitude_a;
    };

    //Hàm gọi API để lưu lịch làm việc
    const saveSchedule = async () => {
        try {
            setIsLoading(true);
            const dataToSend = formatDataForApi();
            console.log("slot de cap nhat");
            console.log(JSON.stringify(dataToSend, null, 2));
            if (!dataToSend) {
                alert('Không có dữ liệu để lưu!');
                return;
            }

            const response = await axios.put(
                'https://localhost:7077/api/Slot/UpdateSlot/' + id,
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm các headers khác nếu cần (như Authorization)
                    }
                }
            );

            if (response.status === 200) {
                alert('Lưu lịch làm việc thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi lưu lịch làm việc:', error);
            alert('Có lỗi xảy ra khi lưu lịch làm việc!');
        } finally {
            //setIsLoading(false);
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

    const uploadImages = async () => {
        setIsLoading(true);
        let check1 = false;
        let check2 = false;

        const formData = new FormData();

        formData.append('postid', id);

        // Kiểm tra trước khi append
        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((imageObj) => {
                if (imageObj.file) {
                    console.log("Appending actual file:", imageObj.file);
                    formData.append('files', imageObj.file); // chỉ append imageObj.file
                } else {
                    console.error("Image object missing file property:", imageObj);
                }
            });
            check1 = true;
        }

        if (imagesData && imagesData.length > 0) {
            imagesData.forEach((imageId) => {
                formData.append('imageIds', imageId.id);
            });
            check2 = true;
        }

        if (check1 === false && check2 == false) {
            return 0;
        }

        try {
            const response = await axios.put(
                'https://localhost:7077/api/Upload/UpdateImagePostjob',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                return 1;
            }
        } catch (error) {
            // Log toàn bộ thông tin lỗi
            console.error('Full Error:', error);
            console.error('Error Response:', error.response);
            console.error('Error Request:', error.request);
            console.error('Error Message:', error.message);

            // Hiển thị lỗi chi tiết từ server
            if (error.response) {
                console.error('Error Data:', error.response.data);
                console.error('Error Status:', error.response.status);
                console.error('Error Headers:', error.response.headers);

                alert(`Lỗi: ${error.response.data.message || 'Có lỗi xảy ra'}`);
            } else if (error.request) {
                console.error('No response received', error.request);
                alert('Không nhận được phản hồi từ server');
            } else {
                console.error('Error', error.message);
                alert('Có lỗi trong quá trình gửi yêu cầu');
            }
            alert('Có lỗi xảy ra trong quá trình upload ảnh.');
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
        if (!JobDetail.jobTitle || JobDetail.jobTitle.trim() === '') {
            toast.error('Vui lòng nhập tiêu đề công việc');
            return false;
        }
        if (!JobDetail.jobDescription || JobDetail.jobDescription.trim() === '') {
            toast.error('Vui lòng nhập mô tả công việc');
            return false;
        }
        if (!JobDetail.salary || JobDetail.salary === 0) {
            toast.error('Vui lòng nhập lương');
            return false;
        }
        if (!JobDetail.numberPeople || JobDetail.numberPeople == 0) {
            toast.error('Vui lòng nhập số lượng người cần tuyển');
            return false;
        }
        if (!JobDetail.address || JobDetail.address.trim() === '') {
            toast.error('Vui lòng nhập địa chỉ');
            return false;
        }

        // Kiểm tra salary_types_id và JobCategory_Id phải > 0
        if (!JobDetail.salaryTypesId || parseInt(JobDetail.salaryTypesId) <= 0) {
            toast.error('Vui lòng chọn loại lương');
            return false;
        }
        if (!JobDetail.jobCategoryId || parseInt(JobDetail.jobCategoryId) <= 0) {
            toast.error('Vui lòng chọn loại công việc');
            return false;
        }
        // Kiểm tra định dạng số
        if (isNaN(JobDetail.salary) || parseFloat(JobDetail.salary) <= 0) {
            toast.error('Lương phải là số dương');
            return false;
        }

        if (isNaN(JobDetail.numberPeople) || parseInt(JobDetail.numberPeople) <= 0) {
            toast.error('Số lượng người cần tuyển phải là số dương');
            return false;
        }
        // Kiểm tra định dạng tọa độ
        if (isNaN(JobDetail.latitude) || isNaN(JobDetail.longitude)) {
            toast.error('Vĩ độ và kinh độ phải là số');
            return false;
        }

        return true;
    };

    const luujob = async (e) => {
        e.preventDefault();


        if (!validateJobData()) {
            return;
        }

        const jobData = {
            postId: JobDetail.postId,
            jobTitle: JobDetail.jobTitle,
            jobDescription: JobDetail.jobDescription,
            salaryTypesId: JobDetail.salaryTypesId,
            salary: JobDetail.salary,
            numberPeople: JobDetail.numberPeople,
            address: JobDetail.address,
            latitude: JobDetail.latitude,
            longitude: JobDetail.longitude,
            status: 1,
            isUrgentRecruitment: JobDetail.isUrgentRecruitment,
            jobCategoryId: JobDetail.jobCategoryId,
            time: JobDetail.time
        };
        console.log(JSON.stringify(jobData, null, 2));

        const token = localStorage.getItem('token');
        console.log(token);

        try {
            const response = await fetch('https://localhost:7077/api/PostJobs/UpdatePostJob', {
                method: 'PUT',
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
                const sang = formatDataForApi();
                console.log(JSON.stringify(sang, null, 2));
                uploadImages(id);
                if (isLongTerm) {
                    saveSchedule();
                } else {
                    handlePublishPostJobDates(id);
                }
            } else {
                try {
                    const errorData = await response.json();
                    showAlert(errorData.message || "Có lỗi xảy ra");
                } catch {
                    showAlert("Có lỗi xảy ra");
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const showAlert = async (text) => {
        const result = await Swal.fire({
            title: text,
            showCancelButton: true,
            confirmButtonText: 'Ok'
        });

        if (result.isConfirmed) {
            navigate("/viewListJobsCreated");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validateJobData()) {
            return;
        }
        let check1 = false;
        let check2 = false;
        if (selectedImages && selectedImages.length > 0) {
            check1 = true;
        }

        if (imagesData && imagesData.length > 0) {
            check2 = true;
        }

        if (check1 === false && check2 == false) {
            alert('Chưa nhập đầy đủ các thông tin về ảnh để cập nhật');
            return;
        }

        if (isLongTerm) {
            const dataToSend = formatDataForApi();
            console.log("slot de cap nhat");
            console.log(JSON.stringify(dataToSend, null, 2));
            if (!dataToSend) {
                alert('Chưa nhập đầy đủ các thông tin về lịch !!!');
                return;
            }
        } else {
            if (postJobDates.some(date => !date.eventDate || !date.startTime || !date.endTime)) {
                alert('Chưa nhập đầy đủ các thông tin về lịch !!!');
                return;
            }
        }

        const dataToSend = formatDataForApi();
        console.log("slot de cap nhat");
        console.log(JSON.stringify(dataToSend, null, 2));
        if (!dataToSend) {
            alert('Chưa nhập thông tin đầy đủ lịch làm việc');
            return;
        }



        const jobData = {
            postId: JobDetail.postId,
            jobTitle: JobDetail.jobTitle,
            jobDescription: JobDetail.jobDescription,
            salaryTypesId: JobDetail.salaryTypesId,
            salary: JobDetail.salary,
            numberPeople: JobDetail.numberPeople,
            address: JobDetail.address,
            latitude: JobDetail.latitude,
            longitude: JobDetail.longitude,
            status: 1,
            isUrgentRecruitment: JobDetail.isUrgentRecruitment,
            jobCategoryId: JobDetail.jobCategoryId,
            time: JobDetail.time
        };
        console.log(JSON.stringify(jobData, null, 2));

        const token = localStorage.getItem('token');
        console.log(token);

        console.log(isLongTerm);

        try {
            const response = await fetch('https://localhost:7077/api/PostJobs/UpdatePostJob', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData),
            });
            if (response.ok) {
                const idp = await response.json(); // Lấy trực tiếp giá trị id
                console.log("PostId: " + idp);
                SetPostID(idp);
                const sang = formatDataForApi();
                console.log(JSON.stringify(sang, null, 2));
                uploadImages();
                if (isLongTerm) {
                    saveSchedule();
                } else {
                    handlePublishPostJobDates(id);
                }
                showAlert("");
            } else {
                console.error('Error Update job:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
    useEffect(() => {
        if (JobDetail.slotDTOs && JobDetail.slotDTOs.length > 0) {
            const convertedSchedules = JobDetail.slotDTOs.map((slot, slotIndex) => ({
                slotId: slot.slotId,
                postId: slot.postId,
                scheduleName: `Lịch ${slotIndex + 1}`,
                slots: daysOfWeek.map((day, dayIndex) => {
                    // Tìm schedule cho ngày hiện tại
                    const daySchedule = slot.jobScheduleDTOs.find(
                        schedule => schedule.dayOfWeek === dayIndex + 1
                    );

                    return {
                        SlotId: dayIndex + 1,
                        DayOfWeek: dayIndex + 1,
                        workingHourCreateDTOs: daySchedule
                            ? daySchedule.workingHourDTOs.map(hour => ({
                                ScheduleId: hour.workingHourId,
                                StartTime: hour.startTime,
                                EndTime: hour.endTime
                            }))
                            : []
                    };
                })
            }));

            //console.log(JSON.stringify(JobDetail.slotDTOs, null, 2));
            setSchedules(convertedSchedules);
            setActiveScheduleIndex(0);
            setIsLongTerm(JobDetail.isLongterm);

        }
    }, [JobDetail.slotDTOs, JobDetail.isLongterm]);

    useEffect(() => {
        if (JobDetail.jobPostDateDTOs && JobDetail.jobPostDateDTOs.length > 0) {
            const postJobDatess = JobDetail.jobPostDateDTOs.map((postJobDates, postJobDatesindex) => (
                {
                    postId: id,
                    eventDate: postJobDates.eventDate.slice(0, 10),
                    startTime: postJobDates.startTime,
                    endTime: postJobDates.endTime,
                }
            ));
            console.log(postJobDatess)
            setPostJobDates(postJobDatess);
            setIsLongTerm(JobDetail.isLongterm);
        }
    }, [JobDetail.jobPostDateDTOs, id]);


    return (
        <>
            <Header />
            <section className="inner-header-title blank">
                <div className="container">
                    <h1>Chỉnh sửa bài đăng tuyển</h1>
                </div>
            </section>
            <div className="clearfix"></div>

            <div className="detail-desc section" >
                <div className="container white-shadow" style={{ width: "80%" }}>
                    <div className="row bottom-mrg">
                        <form className="add-feild form-container" >
                            <div className="input-group form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tiêu đề công việc"
                                    value={JobDetail.jobTitle}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        SetJobDetail(prev => ({
                                            ...prev,
                                            jobTitle: newValue
                                        }));
                                    }}
                                />
                            </div>

                            <div className="input-group form-group">
                                <select
                                    className="form-control"
                                    value={JobDetail.jobCategoryId}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        SetJobDetail(prev => ({
                                            ...prev,
                                            jobCategoryId: newValue
                                        }));
                                    }}
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
                                <select
                                    className="form-control"
                                    value={JobDetail.salaryTypesId}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        SetJobDetail(prev => ({
                                            ...prev,
                                            salaryTypesId: newValue
                                        }));
                                    }}
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
                                <input
                                    type="number"
                                    min={0}
                                    className="form-control"
                                    placeholder="Lương"
                                    value={JobDetail.salary}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        SetJobDetail(prev => ({
                                            ...prev,
                                            salary: newValue
                                        }));
                                    }}
                                />
                            </div>
                            <div className="input-group form-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Số lượng người cần tuyển"
                                    min={0}
                                    value={JobDetail.numberPeople}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        SetJobDetail(prev => ({
                                            ...prev,
                                            numberPeople: newValue
                                        }));
                                    }}
                                />
                            </div>

                            <div className="input-group form-group full-width">
                                <textarea
                                    className="form-control"
                                    placeholder="Mô tả công việc"
                                    value={JobDetail.jobDescription}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        SetJobDetail(prev => ({
                                            ...prev,
                                            jobDescription: newValue
                                        }));
                                    }}
                                ></textarea>
                            </div>

                            <div className="input-group form-group">
                                <div className="image-upload-container" style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flexWrap: 'nowrap',
                                    overflowX: 'auto',
                                    padding: '10px 0'
                                }}>
                                    {/* Hiển thị ảnh từ API */}
                                    {imagesData && imagesData.map((image, index) => (
                                        <div key={index} style={{ position: 'relative', minWidth: '100px', height: '100px', flexShrink: 0 }}>
                                            <img
                                                src={image.url}
                                                alt={`Job Image ${index + 1}`}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    // Tìm index của URL trong mảng JobDetail.imagesURL
                                                    const urlIndex = JobDetail.imagesURL.findIndex(url => url === image.url);

                                                    if (urlIndex !== -1) {
                                                        const updatedImagesURL = JobDetail.imagesURL.filter((_, i) => i !== urlIndex);
                                                        const updatedImagesURLIds = JobDetail.imagesURLIds.filter((_, i) => i !== urlIndex);

                                                        SetJobDetail(prev => ({
                                                            ...prev,
                                                            imagesURL: updatedImagesURL,
                                                            imagesURLIds: updatedImagesURLIds
                                                        }));
                                                    }

                                                    // Cập nhật imagesData
                                                    const updatedImagesData = imagesData.filter((_, i) => i !== index);
                                                    setImagesData(updatedImagesData);
                                                    console.log(imagesData);
                                                    console.log(imagesData);
                                                    console.log(JobDetail);
                                                }}
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

                                    {/* Hiển thị ảnh đã chọn từ local */}
                                    {selectedImages.map((image, index) => (
                                        <div key={`local-${index}`} style={{ position: 'relative', minWidth: '100px', height: '100px', flexShrink: 0 }}>
                                            <img
                                                src={image.url}
                                                alt={`Local Preview ${index + 1}`}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn sự kiện lan truyền
                                                    e.preventDefault(); // Ngăn hành vi mặc định
                                                    handleImageRemove(index)
                                                }}
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

                                    {/* Nút thêm ảnh */}
                                    {(imagesData ? imagesData.length : 0) + selectedImages.length < 5 && (
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
                                        checked={JobDetail.isUrgentRecruitment}
                                        onChange={(e) => {
                                            const newValue = e.target.checked;
                                            SetJobDetail(prev => ({
                                                ...prev,
                                                isUrgentRecruitment: newValue
                                            }));
                                        }}
                                        style={{ marginRight: 10 }}
                                    />
                                    Tuyển dụng nổi bật
                                </label>
                            </div>

                            <div className="input-group form-group ">
                                <label>Thời gian duy trì bài đăng:</label>
                                <select className="form-control" value={JobDetail.time} onChange={(e) => {
                                    const newValue = e.target.value;
                                    SetJobDetail(prev => ({
                                        ...prev,
                                        time: Number(newValue)
                                    }));
                                }}>
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
                                {isLongTerm ? (
                                    <div>
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
                                    </div>
                                ) : (
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
                                <GeocodingMap handlePositionChange={handlePositionChange} handlePositionChangeToado={handlePositionChangeToado} initialLatitude={JobDetail.latitude} initialLongitude={JobDetail.longitude} address={JobDetail.address} />
                            </div>
                            <div className="input-group form-group">
                                <div display="flex">
                                    <button type='button' onClick={luujob} style={{ width: "50%" }} className="btn btn-success btn-primary small-btn" >Lưu thay đổi</button>
                                </div>
                            </div>
                            <div className="input-group form-group">
                                <div display="flex">
                                    <button type='button' onClick={handleSubmit} style={{ width: "50%" }} className="btn btn-success btn-primary small-btn" >Đăng Bài</button>
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
export default EditPostJob;