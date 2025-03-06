import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadPage from './components/UploadPage';
import SignPage from './components/SignPage';
import Dashboard from './components/Dashboard';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/sign/:id" element={<SignPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
