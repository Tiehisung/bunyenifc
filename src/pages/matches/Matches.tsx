"use client";

import { _pagination, Pagination } from "@/components/pagination/Pagination";
import { useState } from "react";
import { SearchQueryUpdator } from "./Headers";
import { ISelectOptionLV } from "@/types";
import { PlayedMatchCard } from "./(fixturesAndResults)/Cards";
import { PrimarySelect } from "@/components/select/Select";
import { IMatch } from "@/types/match.interface";

const MatchesSection = ({ matches }: { matches: IMatch[] }) => {
  const filters = [
    { label: "All", value: "" },
    { label: "Home", value: "home" },
    { label: "Away", value: "away" },
  ];
  const [_selectedFilter, setSelectedFilter] = useState<ISelectOptionLV>();

  console.log(typeof _selectedFilter);
  if (!matches) return <div className="_label">No matches</div>;
  return (
    <section id="matches">
      <header className="flex justify-between items-center gap-4">
        <h2 className="font-bold my-3">Matches</h2>{" "}
        <Pagination pagination={_pagination} />
        <PrimarySelect
          options={filters}
          placeholder="Filter"
          className="w-24"
          onChange={(v) => setSelectedFilter({ label: v, value: v })}
        />
      </header>
      <SearchQueryUpdator query="matches" options={filters} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
        {matches?.map((match, index) => (
          <PlayedMatchCard
            key={index}
            match={match as IMatch}
            league="Circuit Galla"
            className="max-sm:grow "
          />
        ))}
      </div>
    </section>
  );
};

export default MatchesSection;
