const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// ✅ Fixing MongoDB Connection (Removing Deprecated Options)
mongoose.connect("mongodb://localhost:27017/pdf-signing")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Mongoose Schema & Model
const PdfSchema = new mongoose.Schema({
  name: String,
  fileUrl: String,
  signedImage: String,
});

const PdfModel = mongoose.model("Pdf", PdfSchema);

// 📌 **Upload PDF**
app.post("/upload", async (req, res) => {
  const { name, fileUrl } = req.body;
  if (!name || !fileUrl) return res.status(400).json({ error: "Missing data" });

  try {
    const pdf = new PdfModel({ name, fileUrl });
    await pdf.save();
    res.json({ message: "✅ PDF Uploaded", pdf });
  } catch (error) {
    res.status(500).json({ error: "❌ Error uploading PDF", details: error });
  }
});

// 📌 **Get PDF for Signing**
app.get("/pdf/:id", async (req, res) => {
  try {
    const pdf = await PdfModel.findById(req.params.id);
    if (!pdf) return res.status(404).json({ error: "❌ PDF not found" });
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching PDF", details: error });
  }
});

// 📌 **Submit Signature**
app.post("/submit-signature", async (req, res) => {
  const { pdfId, signature } = req.body;

  if (!pdfId || !signature) {
    return res.status(400).json({ error: "Missing PDF ID or signature" });
  }

  try {
    // 🔥 Ensure correct format
    let cleanedSignature = signature.replace(/^data:image\/png;base64,/, "");

    const updatedPdf = await PdfModel.findByIdAndUpdate(
      pdfId,
      { signedImage: `data:image/png;base64,${cleanedSignature}` },
      { new: true }
    );

    if (!updatedPdf) return res.status(404).json({ error: "PDF not found" });

    res.json({ message: "Signature saved", pdf: updatedPdf });
  } catch (error) {
    res.status(500).json({ error: "Error saving signature", details: error });
  }
});



// 📌 **Get Signed PDFs**
app.get("/signed-pdfs", async (req, res) => {
  try {
    const signedPdfs = await PdfModel.find({ signedImage: { $exists: true } });
    res.json(signedPdfs);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching signed PDFs", details: error });
  }
});

// Start Server
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
