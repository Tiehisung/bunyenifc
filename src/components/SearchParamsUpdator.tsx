import { useLocation, useNavigate } from "react-router-dom";

interface IQueryOption {
  label: string;
  value: string;
  query: string;
}

interface HeaderLinksProps {
  options: IQueryOption[];
  className?: string;
  wrapperStyles?: string;
}

// Helper function to update search params (you might want to move this to a lib file)
const setSearchParams = (
  query: string,
  value: string,
  navigate: ReturnType<typeof useNavigate>,
  location: ReturnType<typeof useLocation>,
) => {
  const params = new URLSearchParams(location.search);

  if (value && value.length > 0) {
    params.set(query, value);
  } else {
    params.delete(query);
  }

  navigate(`?${params.toString()}`, { replace: true });
};

export const QueryUpdator = ({
  options,
  className,
  wrapperStyles,
}: HeaderLinksProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const handleUpdateQuery = (option: IQueryOption) => {
    setSearchParams(option.query, option.value, navigate, location);
  };

  return (
    <div
      className={`flex items-center flex-wrap gap-y-1 gap-x-1.5 ${wrapperStyles || ""}`}
    >
      {options?.map((option, i) => {
        const isActive = searchParams.get(option.query) === option.value;

        return (
          <button
            onClick={() => handleUpdateQuery(option)}
            key={i}
            className={`border border-border rounded-full px-3 py-1 text-xs bg-popover hover:bg-card cursor-pointer transition-transform capitalize ${
              isActive ? "ring-1" : ""
            } ${className || ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
