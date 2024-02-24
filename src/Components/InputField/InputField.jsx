import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  border-radius: ${(props) => props.borderRadius || '0.625em'};
  border: 1px solid #8D9093;
  height: ${(props) => props.height || '2.25em'};
  width: ${(props) => props.width || '27em'};
  margin-top: 0.313em;
  margin-bottom: 0.313em;
  font-size: 0.75em;
  padding: 0.625em;
  opacity: ${(props) => (props.editable ? 1 : 0.5)};
  pointer-events: ${(props) => (props.editable ? 'auto' : 'none')};
`;

const IconContainer = styled.span`
  position: absolute;
  top: 50%;
  right: 0.625em;
  transform: translateY(-50%);
`;

function InputField(props) {
    return (
        <InputContainer>
            <Input
                id={props.id}
                name={props.name}
                placeholder={props.placeholder}
                onChange={props.onChange}
                editable={props.editable}
                borderRadius={props.borderRadius}
                height={props.height}
                width={props.width}
            />
            {props.children && (
                <IconContainer>
                    {props.children}
                </IconContainer>
            )}
        </InputContainer>
    );
}

export default InputField;
