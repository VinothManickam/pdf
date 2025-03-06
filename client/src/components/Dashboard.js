import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [signedPdfs, setSignedPdfs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/signed-pdfs").then((res) => setSignedPdfs(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Signed PDFs</h2>
      <ul>
        {signedPdfs.map((pdf) => (
          <li key={pdf._id}>
            {pdf.fileUrl ? (
              <a href={pdf.fileUrl} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            ) : (
              <span style={{ color: "red" }}>PDF not available</span>
            )}
            {pdf.signedImage && (
              <img
                src={pdf.signedImage}  // 🔥 Ensure it's a Base64 image
                alt="Signature"
                style={{ width: "100px", marginLeft: "10px", border: "1px solid #ddd" }}
                onError={(e) => (e.target.style.display = "none")} // Hide broken images
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
