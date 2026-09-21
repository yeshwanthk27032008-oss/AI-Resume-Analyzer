import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, CheckCircle2 } from 'lucide-react';

export default function ResumeUpload({ file, onFileSelect, onFileRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      alert('Please upload a valid PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (selectedFile.size > 16 * 1024 * 1024) {
      alert('File size exceeds the 16MB limit. Please upload a smaller file.');
      return;
    }

    onFileSelect(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
      />

      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon">
            <UploadCloud size={30} />
          </div>
          <div className="dropzone-title">Upload your resume</div>
          <div className="dropzone-sub">
            Drag and drop here, or <span style={{ color: 'var(--primary-600)', fontWeight: '700' }}>browse files</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
            <span>Supports: PDF, DOCX (up to 16MB)</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="file-preview-card">
            <div className="file-info">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-700)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)} • Ready for analysis</div>
              </div>
            </div>
            <button
              type="button"
              className="btn-remove-file"
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              title="Remove file"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '0.85rem',
              color: 'var(--primary-700)',
              fontWeight: '600',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Document verified and ready to parse</span>
          </div>
        </div>
      )}
    </div>
  );
}
