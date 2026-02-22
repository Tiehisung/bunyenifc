

import { PrimarySearch } from "@/components/Search";
import { SearchQueryUpdator } from "@/pages/matches/Headers";

export function SearchAndFilterNews() {
  return (
    <div className="space-y-1.5">
      <PrimarySearch
        searchKey="news_search"
        placeholder="Search News"
        type="search"  
      />
      <SearchQueryUpdator
        query={"isPublished"}
        options={[
          { label: "All", value: "" },
          { label: "Unpublished", value: "false" },
          { label: "Published", value: "true" },
        ]}
      />
    </div>
  );
}
