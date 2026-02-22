import {
  useNavigate,
  useLocation,
  useSearchParams as useSP,
} from "react-router-dom";

/**
 * Adds a searchparams and returns new pathname containing the searchParams with it's value
 * Use router to replace the new pathname
 * @param {*} key SearchParam to add
 * @param {*} value SearchParam value
 * @returns new pathname
 */
export const getNewPathname = (key: string, value: string) => {
  if (typeof window != "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);

    const newPathname = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    return newPathname;
  }
};

/**
 * Deletes a searchparams and returns new pathname without the searchParams.
 * Use router to replace the new pathname
 * @param {*} key SearchParam to delete
 * @returns new pathname
 */
export const deleteSearchParams = (key: string) => {
  if (typeof window === "undefined") return "";

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(key);
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};

/**
 * Function to set/update query params.
 * @param key The query key
 * @param value Query value
 
 */

// Create a custom hook instead of a standalone function
export const useSearchParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const setSearchParams = (key: string, value: string) => {
    const searchParams = new URLSearchParams(location.search);

    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }

    const newPathname = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPathname, { replace: true });
  };

  const getSearchParam = (key: string) => {
    return new URLSearchParams(location.search).get(key);
  };

  return { setSearchParams, getSearchParam };
};

// Usage in a component:
// const { setSearchParams, getSearchParam } = useSearchParams();
// setSearchParams('tab', '1');

export type AnyObject = { [key: string]: unknown };
export function removeEmptyKeys(obj: AnyObject): AnyObject {
  return Object.keys(obj).reduce((acc: AnyObject, key: string) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Function to set multiple query params at once
 * @param object Key-value pairs to set
 * @param navigate React Router's navigate function
 * @param location React Router's location object
 * @param replace Whether to replace or push
 */
export const setMultiSearchParams = (
  object: AnyObject,

  replace = true,
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cleanedObj = removeEmptyKeys(object);
  const searchParams = new URLSearchParams(location.search);

  for (const key of Object.keys(cleanedObj)) {
    searchParams.set(key, cleanedObj[key] as string);
  }

  const newPathname = `${location.pathname}?${searchParams.toString()}`;
  navigate(newPathname, { replace });
};

/**
 * Builds a query string using the current URL search params by default.
 * Optionally, you can pass overrides or additional query params.
 *
 * @param searchParams Optional overrides or additional parameters
 * @returns string - formatted query string like `?key=value&foo=bar`
 */
export function buildQueryString(
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const sp = useSP();
  if (!searchParams) return sp.toString();

  // Filter out undefined or empty values
  const query = new URLSearchParams(
    Object.entries(searchParams).filter(([_, v]) => v !== undefined) as [
      string,
      string,
    ][],
  ).toString();

  return query  
}
