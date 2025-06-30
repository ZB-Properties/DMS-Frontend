import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import './DocumentViewer.css'


export default function DocumentViewer() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const textRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

const api = import.meta.env.VITE_API_URL;


  useEffect(() => {
    axios
      .get(`${api}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setText(res.data.text))
      .catch(() => {
        setText("Failed to load document text");
        showToast("Failed to load document text", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && textRef.current) {
      textRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  const play = () => synth.speak(utterance);
  const pause = () => synth.pause();
  const stop = () => synth.cancel();

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "document.txt";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Text downloaded");
  };

  return (
    <div className="document-viewer-container">
      <h2 className="document-title">Document Text</h2>

     <button
      onClick={() => navigate("/documents")}
      className="btn btn-back"
    >
      Back to Documents
    </button>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <>
          <div id="full-text" ref={textRef} className="document-text">
            {text}
          </div>
          <div className="button-group">
            <button onClick={play} className="btn btn-play">▶️ Play</button>
            <button onClick={pause} className="btn btn-pause">⏸️ Pause</button>
            <button onClick={stop} className="btn btn-stop">⏹️ Stop</button>
            <button onClick={handleDownload} className="btn btn-download"> Download Text</button>
          </div>
        </>
      )}
    </div>
  );
}

