import React, { useState } from 'react';
import './InputFile.css';

const InputFile = ({ id, name, style, onChange, multiple }) => {
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFileNames(files.map(file => file.name));
    onChange(event);
  };

  const handleFileRemove = (fileNameToRemove) => {
    const updatedFileNames = fileNames.filter(fileName => fileName !== fileNameToRemove);
    setFileNames(updatedFileNames);

    const dataTransfer = new DataTransfer();
    updatedFileNames.forEach(fileName => {
      const file = Array.from(document.getElementById(id).files).find(file => file.name === fileName);
      if (file) {
        dataTransfer.items.add(file);
      }
    });

    const inputElement = document.getElementById(id);
    inputElement.files = dataTransfer.files;

    onChange({ target: { files: dataTransfer.files } });
  };

  return (
    <div className="inputFileContainer" style={style}>
      <div className="inputFileBtn">
        <span className="inputFileIcon">📁</span>
        <span>Choose File</span>
        <input
          type="file"
          id={id}
          name={name}
          className="inputFile"
          onChange={handleFileChange}
          multiple={multiple}
        />
      </div>
      {fileNames.length > 0 && (
        <div className="input-file-names">
          {fileNames.map(fileName => (
            <div key={fileName} className="input-file-name">
              {fileName} <span className="delete-icon" onClick={() => handleFileRemove(fileName)}>❌</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputFile;
