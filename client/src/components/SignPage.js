import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

function SignPage() {
  const { id } = useParams();
  const [pdf, setPdf] = useState(null);
  const sigCanvas = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/pdf/${id}`).then((res) => setPdf(res.data));
  }, [id]);

  const submitSignature = async () => {
    const signatureImage = sigCanvas.current.toDataURL();
    await axios.post("http://localhost:3001/submit-signature", { pdfId: id, signature: signatureImage });

    alert("Signature Saved!");
    navigate("/dashboard");
  };

  return (
    <div className="container">
      {pdf && (
        <>
          <h2>Sign PDF: {pdf.name}</h2>
          <embed src={pdf.fileUrl} type="application/pdf" width="100%" height="400px" />
          <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "signature-canvas" }} />
          <button onClick={submitSignature}>Submit Signature</button>
        </>
      )}
    </div>
  );
}

export default SignPage;
