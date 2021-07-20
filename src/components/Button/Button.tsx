import './Button.css';

interface InputRadioProps {
  onClick: Function;
  title: string;
}

const Button: React.FC<InputRadioProps> = ({ onClick, title }) => {
  return (
    <button onClick={(e) => onClick(e)} className="btn">
      {title}
    </button>
  );
};
export default Button;
