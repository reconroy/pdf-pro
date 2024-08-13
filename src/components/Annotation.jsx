import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Worker, Viewer } from '@react-pdf-viewer/core'; // Import Worker and Viewer
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import styles
import { Container, Row, Col } from 'react-bootstrap';
import * as pdfjs from 'pdfjs-dist/build/pdf';

// Set up the worker URL
// import { pdfjs } from 'pdfjs-dist/webpack'; 
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Annotation = () => {
  const location = useLocation(); // Use useLocation to get state
  const files = location.state?.files || []; // Access files from the state

  return (
    <Container className="mt-4">
      <h1>PDF Annotation</h1>
      <Row>
        {files.length > 0 ? (
          files.map((file, index) => (
            <Col key={index} md={6} lg={4} className="mb-3">
              <div className="pdf-viewer-container" style={{ height: '600px' }}>
                <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
                  <Viewer fileUrl={URL.createObjectURL(file)} />
                </Worker>
              </div>
            </Col>
          ))
        ) : (
          <p>No files to annotate</p>
        )}
      </Row>
    </Container>
  );
};

export default Annotation;
