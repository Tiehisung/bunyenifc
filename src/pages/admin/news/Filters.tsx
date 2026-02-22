import { useClearParams, useUpdateSearchParams } from "@/hooks/params";
import { useLocation } from "react-router-dom";

export interface NewsFilterValues {
  isTrending?: boolean;
  isLatest?: boolean;
  isPublished?: boolean;
  from?: string;
  to?: string;
}

export default function NewsFilter() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const isTrending = searchParams.get("isTrending");
  const isPublished = searchParams.get("isPublished");
  const isLatest = searchParams.get("isLatest");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { setParam } = useUpdateSearchParams();
  const { clearOnly } = useClearParams();

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold">Filter News</h2>

      {/* Boolean Filters */}
      <div className="grid grid-cols-3 gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTrending === "true"}
            onChange={(e) =>
              setParam("isTrending", e.target.checked.toString())
            }
          />
          <span>Trending</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLatest === "true"}
            onChange={(e) => setParam("isLatest", e.target.checked.toString())}
          />
          <span>Latest</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished === "true"}
            onChange={(e) =>
              setParam("isPublished", e.target.checked ? "true" : "")
            }
          />
          <span>Published</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished === "false"}
            onChange={(e) =>
              setParam("isPublished", e.target.checked ? "false" : "")
            }
          />
          <span>Unpublished</span>
        </label>
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input
            type="date"
            className="w-full border rounded-md px-2 py-1"
            value={from || ""}
            onChange={(e) => setParam("from", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input
            type="date"
            className="w-full border rounded-md px-2 py-1"
            value={to || ""}
            onChange={(e) => setParam("to", e.target.value)}
          />
        </div>
      </div>

      {/* Clear Button */}
      <button
        type="button"
        className="text-sm text-red-500 cursor-pointer _hover px-1"
        onClick={() =>
          clearOnly("isTrending", "isLatest", "isPublished", "from", "to")
        }
      >
        Reset Filters
      </button>
    </div>
  );
}
