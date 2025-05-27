import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext"; 
import './Document.css'


const Documents = () => {
  const { token } = useAuth();
  const { showToast } = useToast(); 
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const navigate = useNavigate();

const api = import.meta.env.VITE_API_URL;

  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${api}/api/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setDocuments(response.data);
          setFilteredDocs(response.data);
        } else {
          setDocuments([]);
          setFilteredDocs([]);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        showToast("Failed to fetch documents.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [token, showToast]);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredDocs(documents);
    } else {
      setFilteredDocs(
        documents.filter((doc) =>
          selectedTypes.includes(doc.fileType?.replace(".", "").toLowerCase())
        )
      );
    }
  }, [selectedTypes, documents]);

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments((docs) => docs.filter((doc) => doc._id !== id));
      showToast("Document deleted successfully.", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Could not delete document.", "error");
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  const handlePreview = async (doc) => {
    try {
      const res = await axios.get(`${api}/api/documents/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPreviewDoc({ ...doc, text: res.data.text });
    } catch {
      setPreviewDoc({ ...doc, text: "Failed to load document text." });
    }
  };

  const closeModal = () => setPreviewDoc(null);

  const play = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  if (loading) return <p className="text-center mt-10">Loading documents...</p>;

  return (
    <div className="document-container">
      <h2 className="document-heading">My Documents</h2>

      <div className="filter-checkboxes">
        {["pdf", "docx", "txt"].map((type) => (
          <label key={type} className="filter-label">
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={handleTypeChange}
            />
            {type.toUpperCase()}
          </label>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <p>No documents match the selected filter.</p>
      ) : (
        <div className="document-grid">
          {filteredDocs.map((doc) => (
            <div key={doc._id} className="document-card">
              <h3 className="document-title">{doc.originalName || doc.name}</h3>
              <p className="document-date">Uploaded: {formatDate(doc.uploadDate || doc.uploadedAt)}</p>
              <div className="document-actions">
                <button onClick={() => handlePreview(doc)} className="preview-button">
                  Preview
                </button>
                <a
                  href={`${api}/api/upload/${doc.filename}`}
                  className="download-button"
                  download
                >
                  Download
                </a>
                <button onClick={() => handleDelete(doc._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewDoc && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="modal-close">
              &times;
            </button>
            <h3>{previewDoc.originalName}</h3>
            <div className="modal-preview-text">
              {previewDoc.text.slice(0, 500)}...
            </div>
            <div className="modal-actions">
              <button onClick={() => play(previewDoc.text)} className="play-button">
                Play
              </button>
              <button onClick={() => navigate(`/documents/${previewDoc._id}`)} className="read-button">
                Read Full Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
