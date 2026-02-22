import { apiConfig } from "@/lib/configs";
import { IQueryResponse } from "@/types";
import { ICaptainProps } from "./Captaincy";

export const getCaptains = async (query?: string) => {
  try {
  const formatted = query ? (query?.includes("?") ? query : "?" + query) : "";
    const response = await fetch(apiConfig.captains + (formatted || ""), {
      cache: "no-cache",
    });
    const results: IQueryResponse<ICaptainProps[]> = await response.json();
    return results;
  } catch {
    return null;
  }
};

 
 

const CaptaincyPage = () => {
  return <div>Captaincy Page</div>;
};

export default CaptaincyPage;
