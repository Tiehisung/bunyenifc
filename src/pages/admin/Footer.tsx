import { Link } from "react-router-dom";

const AdminFooter = () => {
  return (
    <div className="min-h-60 bg-accent grid items-start justify-center gap-6 p-6 pt-10 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
      {links.map((link, i) => (
        <Link to={link.path} key={i} className="_secondaryBtn _hover _shrink">
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default AdminFooter;

const links = [
  { label: "Home", path: "/" },
  { label: "Logout", path: "/api/auth/signout?callbackUrl=/" },
  { label: "Logs", path: "/admin/logs" },
  { label: "News", path: "/admin/news" },
  { label: "Matches", path: "/admin/matches" },
  { label: "Squad", path: "/admin/squad" },
];
