import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext"; 
import './Upload.css'


const Upload = () => {
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast(); 

const api = import.meta.env.VITE_API_URL;


  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setUploading(true);

      await axios.post(`${api}/api/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("Files uploaded successfully!", "success");
      setFiles([]);

      navigate("/documents");
    } catch (err) {
      console.error(err);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload">
      <h2>Upload Document</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="input"
        />
        <button
          type="submit"
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
