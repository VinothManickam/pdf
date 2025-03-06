import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:3001/upload", {
      name: file.name,
      fileUrl: URL.createObjectURL(file),
    });

    alert("PDF Uploaded!");
    navigate(`/sign/${response.data.pdf._id}`);
  };

  return (
    <div className="container">
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Sign</button>
    </div>
  );
}

export default UploadPage;
