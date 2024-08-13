import React from 'react';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import './App.css';
import Annotation from './components/Annotation';
import Navbar from './components/Navbar';
import Upload from './components/Upload';
import 'bootstrap/dist/css/bootstrap.min.css';
// or use the local path
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/annotation" element={<Annotation />} />
          <Route path="/" element={<Home />} /> {/* Optional: Add a home route if needed */}
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className='mt-5'>
    <h2 className='fs-1'>Welcome to CUPL | PDF-PRO</h2>
    <p>
      <Link to="/upload" className='btn btn-primary '>Go to Upload</Link> | <Link to="/annotation" className='btn btn-primary '>Go to Annotation</Link>
    </p>
  </div>
);

export default App;
