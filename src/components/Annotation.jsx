import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Container, Row, Col } from 'react-bootstrap';
import * as pdfjs from 'pdfjs-dist/build/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Annotation = () => {
  const location = useLocation();
  const files = useMemo(() => location.state?.files || [], [location.state?.files]);
  const [textDataRefs, setTextDataRefs] = useState([]);
  const pdfRefs = useRef([]);
  const [hoverTextData, setHoverTextData] = useState({ text: '', pageNum: -1 });

  useEffect(() => {
    const extractTextFromPdf = async (file, index) => {
      const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const textPromises = [];
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        textPromises.push(
          pdf.getPage(pageNum).then(async (page) => {
            const textContent = await page.getTextContent();
            console.log(`Page ${pageNum} text content:`, textContent.items);
            const textItems = textContent.items.map(item => ({
              str: item.str,
              bbox: item.transform
            }));
            return { pageNum, textItems };
          })
        );
      }

      const textData = await Promise.all(textPromises);
      setTextDataRefs(prevData => {
        const newData = [...prevData];
        newData[index] = textData;
        return newData;
      });
    };

    files.forEach((file, index) => extractTextFromPdf(file, index));
  }, [files]);

  const handleMouseOver = useCallback((text, pageNum) => {
    console.log('Handling mouse over:', text, pageNum);
    setHoverTextData({ text, pageNum });
  }, []);

  useEffect(() => {
    if (!hoverTextData.text) return;

    const { text } = hoverTextData;

    pdfRefs.current.forEach((pdfViewer, index) => {
      if (pdfViewer) {
        const pages = pdfViewer.querySelectorAll('.rpv-core__page');
        pages.forEach(page => {
          const pageNumber = parseInt(page.getAttribute('data-page-number'), 10);
          const matchingPositions = textDataRefs[index]?.find(pd => pd.pageNum === pageNumber)?.textItems.filter(item => item.str === text);

          if (matchingPositions.length > 0) {
            const pageTextElements = page.querySelectorAll('div');
            pageTextElements.forEach(el => {
              if (el.innerText.trim().toLowerCase() === text.trim().toLowerCase()) {
                el.style.backgroundColor = 'yellow';
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                el.style.backgroundColor = '';
              }
            });
          }
        });
      }
    });
  }, [hoverTextData, textDataRefs]);

  const getColSize = () => {
    if (files.length === 2) return 6;
    if (files.length === 3) return 4;
    if (files.length === 4) return 3;
    return 12;
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">PDF Annotation</h1>
      <Row>
        {files.length > 0 ? (
          files.map((file, index) => (
            <Col key={index} md={getColSize()} className="mb-3 pdf-col">
              <div
                className="pdf-viewer-container"
                style={{ height: '600px', position: 'relative' }}
                ref={el => (pdfRefs.current[index] = el)}
              >
                <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
                  <Viewer
                    fileUrl={URL.createObjectURL(file)}
                    onPageRenderSuccess={page => {
                      page.getTextContent().then(textContent => {
                        textContent.items.forEach(item => {
                          const textElement = document.createElement('div');
                          textElement.innerText = item.str;
                          textElement.style.position = 'absolute';
                          textElement.style.left = `${item.transform[4]}px`;
                          textElement.style.top = `${item.transform[5]}px`;
                          textElement.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
                          textElement.style.cursor = 'pointer';
                          textElement.style.border = '1px solid red'; // For visibility
                          textElement.addEventListener('mouseover', () => handleMouseOver(item.str, page.pageNumber));
                          page.viewport.appendChild(textElement);
                        });
                      });
                    }}
                  />
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
