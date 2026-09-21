import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, FileText, Sparkles } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescription from '../components/JobDescription';
import AnalyzeButton from '../components/AnalyzeButton';
import LoadingScreen from '../components/LoadingScreen';
import ErrorMessage from '../components/ErrorMessage';
import { analyzeResume } from '../services/api';

export default function Analyze() {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (file) => {
    setResumeFile(file);
    setErrorMessage('');
  };

  const handleFileRemove = () => {
    setResumeFile(null);
  };

  const validateForm = () => {
    if (!resumeFile) {
      setErrorMessage('Please select and upload your resume in PDF or DOCX format.');
      return false;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please provide a job description to analyze your resume against.');
      return false;
    }
    if (jobDescription.trim().length < 30) {
      setErrorMessage('The job description is too short. Please paste at least 30 characters.');
      return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    setErrorMessage('');
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await analyzeResume(resumeFile, jobDescription, jobTitle);

      if (response && response.success) {
        // Allow user to see final step briefly then navigate with analysis data
        setTimeout(() => {
          setLoading(false);
          // Store result in session storage for refreshing results page
          sessionStorage.setItem('lastAnalysisResult', JSON.stringify(response));
          navigate('/results', { state: { result: response } });
        }, 1200);
      } else {
        setLoading(false);
        setErrorMessage(response.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      console.error('API Error:', err);
      const serverMsg =
        err.response?.data?.error ||
        err.message ||
        'Unable to connect to the backend server. Please make sure the Flask backend is running.';
      setErrorMessage(serverMsg);
    }
  };

  return (
    <div className="analyze-page">
      {loading && <LoadingScreen />}

      <div className="container">
        <div className="page-header">
          <h1>Analyze Your Resume</h1>
          <p>
            Upload your resume and paste the target job requirements to generate a complete ATS audit.
          </p>
        </div>

        <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />

        <div className="analyze-grid">
          {/* Left: Resume Upload */}
          <div className="form-panel">
            <div className="panel-header">
              <div className="panel-title">
                <FileUp size={22} className="panel-title-icon" />
                <span>1. Upload Resume</span>
              </div>
            </div>

            <ResumeUpload
              file={resumeFile}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>

          {/* Right: Job Description */}
          <div className="form-panel">
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={22} className="panel-title-icon" />
                <span>2. Job Requirements</span>
              </div>
            </div>

            <JobDescription
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
            />
          </div>
        </div>

        {/* Action Button */}
        <AnalyzeButton
          onClick={handleAnalyze}
          disabled={!resumeFile || !jobDescription.trim()}
          loading={loading}
        />
      </div>
    </div>
  );
}
