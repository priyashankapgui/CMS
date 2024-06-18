import React from 'react';
import './InputFile.css';

const InputFile = ({ setImage }) => {
    return (
        <div className="container">
            <div className="button">
                <span className="icon">{"\uf0e4"}</span>
                Choose file
            </div>
            <input
                type="file"
                className="inputFile"
                onChange={(e) => setImage(e.target.files[0])}
            />
        </div>
    );
};

export default InputFile;
