import React from 'react';
import styled from 'styled-components';

const RadioContainer = styled.div`
  margin-bottom: 1em;
`;

const RadioLabel = styled.label`
  margin-right: 1em;
`;

const InputRadio = ({ name, options, onChange }) => {
  return (
    <RadioContainer>
      {options.map(option => (
        <RadioLabel key={option.id}>
          <input
            type="radio"
            id={option.id}
            name={name}
            value={option.label}
            onChange={onChange}
          />
          {option.label}
        </RadioLabel>
      ))}
    </RadioContainer>
  );
};

export default InputRadio;
