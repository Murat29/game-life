import React from 'react';
import './InputRadio.css';

interface InputRadioProps {
  currentValue: number;
  name: string;
  value: number;
  handleChange: Function;
  title: string;
  disabled: boolean;
}

const InputRadio: React.FC<InputRadioProps> = ({
  currentValue,
  handleChange,
  name,
  value,
  title,
  disabled,
}) => {
  return (
    <label className="input-radio">
      <input
        disabled={disabled}
        onChange={(e) => handleChange(e)}
        checked={currentValue === value}
        className="input-radio__invisible"
        type="radio"
        name={name}
        value={value}
        tabIndex={1}
      />
      <span className="input-radio__visible"></span>
      {title}
    </label>
  );
};

export default InputRadio;
