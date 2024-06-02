import React, { useState, useEffect, useRef } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import './InputDropdown.css';

const InputDropdown = ({ id, name, height, width, onChange, editable, borderRadius, marginTop, options }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (options.length > 0) {
            setSelectedOption(options[0]);
        }
    }, [options]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onChange({ target: { name, value: option } }); // Pass selected option as event-like object
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        if (editable) {
            setIsOpen(!isOpen);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (options.length === 0) {
        return <div className='hint-text'>Options not available</div>;
    }

    return (
        <div
            id={id}
            name={name}
            ref={dropdownRef}
            className="dropdown-container"
            style={{
                borderRadius: borderRadius || '0.625em',
                height: height || '2.25em',
                width: width || '15.625em',
                marginTop: marginTop || '0.313em',
            }}
        >
            <div
                className={`dropdown-selected ${editable ? '' : 'disabled'}`}
                onClick={toggleDropdown}
                tabIndex={editable ? 0 : -1}  // Add tabindex for focus
            >
                <span>{selectedOption}</span>
                <IoMdArrowDropdown className="dropdown-arrow" />
            </div>
            {isOpen && (
                <div className="dropdown-list">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="dropdown-option"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InputDropdown;
