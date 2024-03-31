import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
    width: '18.625em'
});

const CreatableBar = ({ options }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectOptions, setSelectOptions] = useState(options);
    const [value, setValue] = useState(null);

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setIsLoading(false);
            setSelectOptions((prev) => [...prev, newOption]);
            setValue(newOption);
        }, 1000);
    };

    // Define the styles
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '0.625em',
            border: '1px solid #8D9093',
            height: '2.25em',
            minHeight: '2.25em',
            boxShadow: 'inset 0 1px 1px rgba(27,31,35,.07), inset 0 0 0 9999px rgb(255,255,255)',
            width: '18.625em',
            marginTop: '0.313em',
            marginBottom: '0.313em',
            fontSize: '0.813em',
        }),
        menu: (provided) => ({
            ...provided,
            width: '18.625em',
            fontSize: '0.813em'
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: '0',
            marginRight: '0.313em'
        }),
        placeholder: (provided) => ({
            ...provided,
            paddingTop: 0,
            margin: 0
        }),
    };

    return (
        <CreatableSelect
            placeholder="-Select-"
            isClearable
            isDisabled={isLoading}
            isLoading={isLoading}
            onChange={(newValue) => setValue(newValue)}
            onCreateOption={handleCreate}
            options={selectOptions}
            value={value}
            styles={customStyles}
        />
    );
};

export default CreatableBar;
