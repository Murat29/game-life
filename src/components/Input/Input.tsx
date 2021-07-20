import './Input.css';

interface InputRadioProps {
  onChange: Function;
  value: number;
  min: number;
  max: number;
}

const Input: React.FC<InputRadioProps> = ({ value, onChange, min, max }) => {
  return (
    <input
      className="input"
      value={value}
      onChange={(e) => onChange(e)}
      type="number"
      min={min}
      max={max}
    />
  );
};
export default Input;
