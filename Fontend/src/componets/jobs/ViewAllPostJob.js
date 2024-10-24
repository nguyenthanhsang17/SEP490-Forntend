import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thay useHistory bằng useNavigate

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Khởi tạo navigate

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://localhost:7077/api/PostJobs');
        setJobs(response.data.items.$values);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (postId) => {
    navigate(`/viewJobDetail/${postId}`); // Sử dụng navigate để điều hướng
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div className="item-click" key={job.postId} onClick={() => handleJobClick(job.postId)}>
          <article>
            <div className="brows-job-list">
              <div className="col-md-1 col-sm-2 small-padding">
                <div className="brows-job-company-img">
                  <a href="">
                    <img src={job.thumbnail} className="img-responsive" alt={job.jobTitle} />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-sm-5">
                <div className="brows-job-position">
                  <a href=""><h3>{job.jobTitle}</h3></a>
                  <p>
                    <span>{job.authorName}</span>
                    <span className="brows-job-sallery">
                      <i className="fa fa-money"></i>{job.salary} VND
                    </span>
                    <span className="job-type cl-success bg-trans-success">{job.salaryTypeName}</span>
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-sm-3">
                <div className="brows-job-location">
                  <p><i className="fa fa-map-marker"></i>{job.address}</p>
                </div>
              </div>
              <div className="col-md-2 col-sm-2">
                <div className="brows-job-link">
                  <a href="" className="btn btn-default">Apply Now</a>
                </div>
              </div>
            </div>
            {job.isUrgentRecruitment && (
              <span className="tg-themetag tg-featuretag">Premium</span>
            )}
          </article>
        </div>
      ))}
    </div>
  );
};

export default JobListing;
