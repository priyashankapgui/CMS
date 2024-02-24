import React from 'react';
import styled from 'styled-components';

const Dropdown = styled.select`
  border-radius: 0.625em;
  border: 1px solid #8D9093;
  height: 2.25em;
  width: 15.625em;
  margin-top: 0.313em;
  margin-bottom: 0.313em;
  font-size: 0.813em;
  padding-left: 0.625em;
  opacity: ${(props) => (props.editable ? 1 : 0.5)};
  pointer-events: ${(props) => (props.editable ? 'auto' : 'none')};
`;

function InputDropdown(props) {
    return (
        <div>
            <Dropdown
                id={props.id}
                name={props.name}
                style={props.style}
                onChange={props.onChange}
                editable={props.editable}
            >
                {props.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </Dropdown>
        </div>
    );
}

export default InputDropdown;
