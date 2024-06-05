import React, { useState, useEffect } from 'react';

const Input = ({ typeInput, idInput, onChange, value, placeholder, disabled, nameInput }) => {
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
        setHasValue(value.length > 0);
    }, [value]);

    return (
        <div className="input">
            <input
                type={typeInput}
                id={idInput}
                autoComplete="off"
                onBlur={(e) => setHasValue(e.target.value.length > 0)}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
            />
            <label htmlFor={idInput} className={hasValue ? 'active' : ''}>
                {nameInput}
            </label>
        </div>
    );
};

export default Input;
