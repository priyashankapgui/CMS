import React, { useState } from 'react';
import './InputFile.css';

const InputFile = ({ id, name, className, style, onChange, multiple }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
    onChange(event);
  };

  return (
    <div className="container" style={style}>
      <div className="button">
        <span className="icon">📁</span> {/* Replace with FontAwesome icon if desired */}
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
      {fileName && <div className="file-name">{fileName}</div>}
    </div>
  );
};

export default InputFile;
