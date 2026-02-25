import { CredentialsLoginForm } from "@/components/auth/LoginCredentials";
import HEADER from "@/components/Element";
import { TEAM } from "@/data/teamBnfc";
import { Link } from "react-router-dom";

const LoginPage = () => {
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
        <CredentialsLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
