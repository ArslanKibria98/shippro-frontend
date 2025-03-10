import React, { useState, useEffect } from "react";
import axios from "axios";

const FileManager = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("File uploaded successfully!");
      fetchFiles(); // Refresh file list
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchFiles = async () => {
    const { data } = await axios.get("http://localhost:5000/files");
    setFiles(data);
  };

  const handleDownload = async (filename) => {
    const response = await axios.get(`http://localhost:5000/download/${filename}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
      <button onClick={handleUpload}>Upload</button>

      <h3>Uploaded Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file}{" "}
            <button onClick={() => handleDownload(file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
