// pages/CardsPage.tsx
import { useLocation } from "react-router-dom";
import HEADER from "@/components/Element";
import BackToTopButton from "@/components/scroll/ToTop";
import { CardsManager } from "./CardsManager";
import Loader from "@/components/loaders/Loader";
import { useGetCardsQuery } from "@/services/cards.endpoints";

export default function CardsPage() {
  const location = useLocation();
  const { data, isLoading } = useGetCardsQuery(location.search);

  if (isLoading && !data) {
    return (
      <div>
        <HEADER
          title="Cards Management"
          subtitle="Track and manage player cards"
        />
        <div className="_page flex justify-center items-center min-h-100">
          <Loader message="Loading cards..." />
        </div>
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div>
      <HEADER
        title="Cards Management"
        subtitle="Track and manage player cards"
      />

      <div className="_page">
        <CardsManager cardsData={data} />
      </div>

      <BackToTopButton />
    </div>
  );
}
