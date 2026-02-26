import HEADER from "@/components/Element";
import RegistrationForm from "./RegistrationForm";
import { TEAM } from "@/data/teamBnfc";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div>
      <HEADER
        title={
          <Link to="/" className="text-Orange hover:underline">
            {TEAM.alias}
          </Link>
        }
      />
      <br />
      <div className="_page">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegisterPage;
