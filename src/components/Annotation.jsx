import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Worker, Viewer } from '@react-pdf-viewer/core'; // Import Worker and Viewer
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import styles
import { Container, Row, Col } from 'react-bootstrap';
import * as pdfjs from 'pdfjs-dist/build/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Annotation = () => {
  const location = useLocation(); // Use useLocation to get state
  const files = location.state?.files || []; // Access files from the state

  const getColSize = () => {
    if (files.length === 2) return 6; // Pair of 2 PDFs
    if (files.length === 4) return 3; // Pair of 4 PDFs
    return 12; // Single PDF or fallback
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">PDF Annotation</h1>
      <Row>
        {files.length > 0 ? (
          files.map((file, index) => (
            <Col key={index} md={getColSize()} className="mb-3 pdf-col">
              <div className="pdf-viewer-container">
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
