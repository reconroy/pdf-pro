import React, { useState } from 'react';
import { Button, Card, Container, Row, Col, Form } from 'react-bootstrap';
import { IoMdRemoveCircle } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify'; // Use toast for error notifications
import 'react-toastify/dist/ReactToastify.css';
import { validateFileCount } from "./../customScripts/upload.js";
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate(); // Use navigate hook for programmatic navigation

    const handleFileChange = (event) => {
        const uploadedFiles = Array.from(event.target.files).slice(0, 4); // Allow only up to 4 files
        setFiles(uploadedFiles);
    };

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (validateFileCount(files)) {
            navigate('/annotation', { state: { files } }); // Pass files state to the Annotation route
        } else {
            toast.error('You must select at least 2 files.');
        }
    };

    const renderFileBox = (file, index) => (
        <Col key={index} md={3} className="mb-3">
            <Card className="d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
                    <Card.Title className="mb-2">{file ? file.name : "No File"}</Card.Title>
                    {file && (
                        <Button
                            variant="link"
                            className="text-danger"
                            onClick={() => handleRemoveFile(index)}
                        >
                            <IoMdRemoveCircle size={24} />
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header className="text-light" style={{ backgroundColor: "#2B3035" }}>
                    Upload PDF
                </Card.Header>
                <Card.Body>
                    <Card.Title>Select your PDF files here</Card.Title>
                    <Form>
                        <Form.Group controlId="formFileMultiple">
                            <Form.Label>Choose up to 4 PDF files</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Form>
                    <Row className="mt-3">
                        {[...Array(4)].map((_, index) => renderFileBox(files[index], index))}
                    </Row>
                    <Button variant="primary" className="mt-3" onClick={handleUpload}>
                        Upload
                    </Button>
                </Card.Body>
            </Card>
            <ToastContainer />
        </Container>
    );
};

export default Upload;
