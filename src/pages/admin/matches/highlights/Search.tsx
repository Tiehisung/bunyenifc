 
import { IPlayer } from "@/types/player.interface";
import { ClearFiltersBtn } from "@/components/buttons/ClearFilters";
import { PrimarySearch } from "@/components/Search";
import MultiSelectionInput from "@/components/select/MultiSelect";
import { useFetch } from "@/hooks/fetch";
import { POPOVER } from "@/components/ui/popover";
import { IMatch } from "@/types/match.interface";

interface IProps {
  matches?: IMatch[];
}

export function SearchHighlights({ matches }: IProps) {
  const { results } = useFetch<IPlayer[]>({ uri: "/players" });
  const players = results?.data;

  const matchTitles = matches?.map((m) => `${m.title} ${m.date}`) ?? [];
  return (
    <div className="my-8 border-b pb-3 flex items-center flex-wrap gap-3">
      <PrimarySearch
        type="search"
        datalist={(players ?? [])
          ?.map((p) => `${p?.firstName} ${p?.lastName}`)
          .concat(matchTitles)}
        listId="highlight-search"
        searchKey="highlight_search"
        placeholder="Search Highlights"
        inputStyles="h-10"
      />

      {(players?.length ?? 0) > 0 && (
        <div className="grow flex items-start max-md:flex-wrap gap-4">
          <POPOVER trigger="Tag Players" variant={"outline"}>
            <MultiSelectionInput
              name="tags"
              options={players?.map((p) => ({
                label: `${p?.firstName} ${p?.lastName}`,
                value: [p?.firstName, p?.lastName].filter(Boolean).join(","),
              }))}
              className="rounded-full"
            />
          </POPOVER>

          <ClearFiltersBtn label="Clear" variant={"outline"} />
        </div>
      )}
    </div>
  );
}
