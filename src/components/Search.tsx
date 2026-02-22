 

import React, { useState } from "react";

import useGetParam, { useUpdateSearchParams } from "@/hooks/params";
import { CgSearch } from "react-icons/cg";
import { TSearchKey } from "@/types";
import { Button } from "./buttons/Button";

interface ISearchProps {
  label?: string;
  name?: string;
  type?: "text" | "search" | "email";
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputStyles?: string;
  className?: string;
  others?: unknown & React.InputHTMLAttributes<HTMLInputElement>;
  searchKey?: TSearchKey;
  datalist?: string[];
  listId?: string;
}

export const PrimarySearch = ({
  className,
  name,
  type = "search",
  onChange,
  placeholder = "Search",
  inputStyles,
  others,
  value,
  searchKey = "search",
  datalist,
  listId = "search-datalist",
}: ISearchProps) => {
  const { setParam } = useUpdateSearchParams();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setParam(searchKey, e.target.value);
    }
  };
  const defaultValue = useGetParam(searchKey);
  return (
    <div
      className={`group bg-card flex items-center border border-1.5 border-Red/30 focus-within:ring ring-Red focus-within:border-teal-ring-Red/80 rounded-full grow px-2 text-sm ${className}`}
    >
      <CgSearch className="h-4 w-auto text-Red/30 group-focus-within:text-Red" />
      <input
        onChange={handleOnChange}
        id={name}
        name={name}
        type={type ?? "text"}
        className={`outline-none h-9 grow rounded-md pl-1.5 bg-transparent ${inputStyles} ${
          datalist ? "_hideBrowserUI" : ""
        }`}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        {...others}
        autoComplete="off"
        list={listId}
      />

      {datalist && listId && (
        <datalist id={listId}>
          {datalist?.map((item, i) => (
            <option key={item + i} value={item} />
          ))}
        </datalist>
      )}
    </div>
  );
};

interface ISearchB {
  label?: string;
  name?: string;
  type?: "text" | "search" | "email";
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  inputStyles?: string;
  className?: string;
  others?: unknown & React.InputHTMLAttributes<HTMLInputElement>;
  searchKey?: TSearchKey;
  datalist?: string[];
  listId?: string;
}
export const SearchWithSubmit = ({
  className,
  name,
  type = "search",
  onChange,
  placeholder = "Search",
  inputStyles,
  others,
  value = "",
  searchKey = "search",
  datalist,
  listId = "search-datalist",
}: ISearchB) => {
  const { setParam } = useUpdateSearchParams();
  const [text, setText] = useState(value);

  const handleOnChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onChange) {
      onChange(text);
    } else {
      setParam(searchKey, text);
    }
  };
  const defaultValue = useGetParam(searchKey);
  return (
    <form
      onSubmit={handleOnChange}
      className={`group bg-card flex items-center border border-1.5 border-Red/30 focus-within:ring ring-Red focus-within:border-teal-ring-Red/80 rounded-full grow pl-3.5 pr-0.5 text-sm ${className}`}
    >
      <input
        onChange={(e) => setText(e.target.value)}
        id={name}
        name={name}
        type={type ?? "text"}
        className={`outline-none h-9 grow rounded-md pl-1.5 bg-transparent ${inputStyles} ${
          datalist ? "_hideBrowserUI" : ""
        }`}
        placeholder={placeholder}
        value={text}
        defaultValue={defaultValue}
        {...others}
        autoComplete="off"
        list={listId}
      />

      <Button
        type="submit"
        className="rounded-full text-xs bg-blue-500 _primaryBtn"
        size={"sm"}
        styles={{ borderRadius: "10rem" }}
      >
        Search
      </Button>

      {datalist && listId && (
        <datalist id={listId}>
          {datalist?.map((item, i) => (
            <option key={item + i} value={item} />
          ))}
        </datalist>
      )}
    </form>
  );
};
