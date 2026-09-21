import React from 'react';
import { Briefcase, FileCode } from 'lucide-react';

const SAMPLE_JOBS = [
  {
    title: 'Full Stack Software Engineer',
    description: `Position: Full Stack Software Engineer
Responsibilities:
- Build and maintain responsive web applications using React, JavaScript, and TypeScript.
- Design and develop RESTful APIs and backend services using Python, Flask, or Node.js.
- Work with relational and NoSQL databases such as PostgreSQL and MongoDB.
- Containerize services using Docker and deploy into AWS cloud infrastructure.
- Collaborate closely with agile product teams, participate in code reviews, and maintain CI/CD pipelines with Git and GitHub.

Requirements:
- 2+ years of software development experience.
- Strong knowledge of Python, React, JavaScript, HTML, and CSS.
- Familiarity with SQL, PostgreSQL, Docker, Git, and REST APIs.
- Bachelor's degree in Computer Science, Software Engineering, or related technical field.
- Excellent problem solving, communication, and teamwork skills.`
  },
  {
    title: 'Data Scientist / Machine Learning Engineer',
    description: `Position: Machine Learning Engineer
Responsibilities:
- Develop, evaluate, and deploy machine learning and NLP models.
- Clean and analyze large-scale tabular and unstructured data using Python, Pandas, and NumPy.
- Build predictive algorithms using Scikit-Learn, TensorFlow, or PyTorch.
- Integrate ML models into production REST APIs with Docker and cloud services (AWS or GCP).
- Communicate model insights and data metrics to cross-functional stakeholders.

Requirements:
- Strong programming skills in Python and SQL.
- Proven experience with Machine Learning, NLP, Data Science, Pandas, NumPy, and TensorFlow.
- Experience with Git, Docker, and Linux environments.
- Master's or Bachelor's degree in Computer Science, Data Science, or Mathematics.
- Strong analytical skills and collaborative mindset.`
  }
];

export default function JobDescription({
  jobTitle,
  onJobTitleChange,
  jobDescription,
  onJobDescriptionChange,
}) {
  const charCount = jobDescription.length;
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  const loadSampleJob = (index = 0) => {
    const sample = SAMPLE_JOBS[index];
    onJobTitleChange(sample.title);
    onJobDescriptionChange(sample.description);
  };

  return (
    <div>
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>Target Job Title (Optional)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="sample-loader-btn"
              onClick={() => loadSampleJob(0)}
              title="Load Full Stack Engineer sample"
            >
              Load Full Stack Sample
            </button>
            <button
              type="button"
              className="sample-loader-btn"
              onClick={() => loadSampleJob(1)}
              title="Load ML Engineer sample"
            >
              Load ML Sample
            </button>
          </div>
        </div>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Senior Full Stack Developer, Data Scientist..."
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Job Description / Requirements *</label>
        <div className="textarea-wrapper">
          <textarea
            className="form-textarea"
            placeholder="Paste the job requirements, responsibilities, and qualifications here..."
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            rows={8}
          />
        </div>
        <div className="char-counter">
          <span>{wordCount} words</span> • <span>{charCount} characters</span>
          {charCount > 0 && charCount < 30 && (
            <span style={{ color: 'var(--accent-red)', marginLeft: '8px' }}>
              (Minimum 30 characters required)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
