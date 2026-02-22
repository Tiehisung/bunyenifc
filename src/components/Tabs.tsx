import { Link, useLocation, useNavigate } from "react-router-dom";
import { FC, ReactNode, useEffect, useState } from "react";
import Loader from "./loaders/Loader";
import { AnimateOnView } from "./Animate/AnimateOnView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { useSearchParams } from "@/lib/searchParams";

interface IProps {
  labels: string[];
  children: ReactNode[];
  wrapperStyles?: string;
  className?: string;
  tabButtonStyles?: string;
  footer?: ReactNode;
  queryName?: string;
}

/**
 *
 * @param {*} labels The array of tab labels to toggle.
 * @param children ReactNodes to be iterated. Node of corresponding index with the label is rendered at a time.
 * @returns
 */
const TabbedComponents = ({
  labels,
  children,
  className,
  tabButtonStyles,
  footer,
  queryName = "tab",
}: IProps) => {
  const { setSearchParams } = useSearchParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [tabIndex, setTabIndex] = useState<number | null>(null);

  useEffect(() => {
    const tab = searchParams.get(queryName);
    if (tab) setTabIndex(Number(tab));
  }, [searchParams, queryName]);

  const handleSetTab = (index: number) => {
    setSearchParams(queryName, String(index));
  };

  return (
    <div className="grid">
      <div className={`flex mb-4 font-light items-center ${className || ""}`}>
        {labels.map((label, index) => (
          <button
            key={index}
            className={`grow pt-2 pb-1 px-2 capitalize relative slowTrans whitespace-nowrap ${
              tabIndex === index
                ? "bg-white cursor-default pointer-events-none text-teal-700"
                : "text-black hover:bg-gray-300/40"
            } ${tabButtonStyles || ""}`}
            onClick={() => handleSetTab(index)}
          >
            {label}
            <div
              className={`bg-linear-to-r from-teal-300/35 via-teal-500 to-teal-700/40 absolute left-0 h-1 ${
                tabIndex === index
                  ? "bottom-0 right-0 text-Teal transition-all duration-200 ease-linear"
                  : "invisible right-full"
              }`}
            />
          </button>
        ))}
      </div>
      <div>
        {typeof tabIndex !== "number" ? <Loader /> : children[tabIndex]}
      </div>

      <footer className="my-12">{footer}</footer>
    </div>
  );
};

export default TabbedComponents;

// Links and button tabs for page navigation
interface ILinkTabProps {
  tabs: { path: string; label: ReactNode }[];
  replace?: boolean;
  wrapperStyles?: string;
  className?: string;
  allowLinks?: boolean;
}

export const LinkTabs = ({
  tabs,
  replace = true,
  wrapperStyles,
  className = "",
  allowLinks = false,
}: ILinkTabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = (path: string) => pathname === path;

  const handleNavigate = (path: string) => {
    if (replace) {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  };

  if (allowLinks) {
    return (
      <div
        className={`flex justify-center mb-4 font-light items-center ${wrapperStyles || ""}`}
      >
        {tabs.map((tab, i) => (
          <Link
            key={i}
            to={tab.path}
            replace={replace}
            className={`py-1 px-2 capitalize _hover _label ${
              isActive(tab.path)
                ? "cursor-default text-muted-foreground"
                : "cursor-pointer"
            } ${className}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid">
      <div
        className={`flex mb-4 font-light items-center ${wrapperStyles || ""}`}
      >
        {tabs.map(({ label, path }, index) => (
          <button
            key={index}
            className={`grow pt-2 pb-1 px-2 capitalize relative slowTrans whitespace-nowrap ${
              isActive(path)
                ? "dark:bg-secondary cursor-default pointer-events-none text-teal-700"
                : "hover:bg-gray-300/40"
            } ${className}`}
            onClick={() => handleNavigate(path)}
          >
            {label}
            <div
              className={`bg-linear-to-r from-teal-300/35 via-teal-500 to-teal-700/40 absolute left-0 h-1 ${
                isActive(path)
                  ? "bottom-0 right-0 text-Teal transition-all duration-200 ease-linear"
                  : "invisible right-full"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

interface ITabs {
  className?: string;
  listClassName?: string;
  tabs: Array<{ value: string; label: ReactNode }>;
  defaultValue?: string;
  children: Array<ReactNode>;
}

export const PrimaryTabs: FC<ITabs> = (props) => {
  return (
    <Tabs
      defaultValue={props.defaultValue}
      className={`pb-6 ${props.className || ""}`}
    >
      <TabsList
        className={cn(
          "flex items-center overflow-x-auto _hideScrollbar gap-1.5 p-1 mb-5 rounded-full bg-accent dark:text-foreground border border-border w-full",
          props.listClassName,
        )}
      >
        {props.tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="cursor-pointer data-[state=active]:bg-card hover:bg-card rounded-full px-3 py-2 _shrink"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {props.children.map((cont, i) => (
        <TabsContent key={i} value={props.tabs[i].value}>
          <AnimateOnView x={6}>{cont}</AnimateOnView>
        </TabsContent>
      ))}
    </Tabs>
  );
};
