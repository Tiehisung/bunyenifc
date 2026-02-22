 
import React from "react";
import { LiaAngleDoubleRightSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

interface PrimLinkProps {
  className?: string;
  text?: string;
  to: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const PrimLink: React.FC<PrimLinkProps> = ({
  className,
  to,
  icon,
  children,
  text,
}) => {
  return (
    <Link to={to} className={`_link flex items-center hover:text-blue-700 w-fit ${className}`}>
      {children ?? text}
      <span>{icon || <LiaAngleDoubleRightSolid />}</span>
    </Link>
  );
};

export default PrimLink;
