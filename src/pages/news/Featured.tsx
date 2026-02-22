 
import { INewsProps } from "@/types/news.interface";
 
import SimpleCarousel from "@/components/carousel/SimpleCarousel";
import { Link } from "react-router-dom";

const FeaturedNews = ({ news }: { news: INewsProps[] }) => {
  return (
    <div className="space-y-2">
      <h1 className="_subtitle max-sm:text-center">FeaturedNews</h1>
      <SimpleCarousel className="_hideScrollbar max-md:w-full">
        {news?.map((item, i) => (
          <div key={i}>
            <Link
              style={{
                backgroundImage: `url(${item.headline.image})`,
              }}
              to={`/news/${item?.slug|| item._id}`}
              className="flex w-44 h-32 _label _card border _borderColor overflow-hidden hover:border-background bg-contain object-contain"
            >
              <span className=" p-2 bg-linear-to-b from-[#292929] to-transparent line-clamp-4">
                {item.headline.text}
              </span>
            </Link>
          </div>
        ))}
      </SimpleCarousel>
    </div>
  );
};

export default FeaturedNews;
