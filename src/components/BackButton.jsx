import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }} // -1 means go back one page on the browser history
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
