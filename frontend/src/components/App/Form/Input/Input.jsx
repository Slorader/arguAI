import React, { useState } from 'react';

const Input = (props) => {
    const [hasValue, setHasValue] = useState(false);

    const handleInputBlur = (event) => {
        setHasValue(event.target.value.length > 0);
    };

    return (
        <div className="input">
            <input
                type={props.typeInput}
                id={props.idInput}
                autoComplete="off"
                onBlur={handleInputBlur}
                onChange={props.onChange}
                value={props.value}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
            <label htmlFor={props.idInput} className={hasValue ? 'active' : ''}>
                {props.nameInput}
            </label>
        </div>
    );
};

export default Input;
