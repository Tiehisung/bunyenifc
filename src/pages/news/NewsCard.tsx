 

import { Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { symbols } from "@/data";
import { getTimeAgo } from "@/lib/timeAndDate";
import { Link } from "react-router-dom";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  tags?: string[];
  href?: string;
  reactions?: number;
}

export default function NewsCard({
  id,
  title,
  summary,
  image,
  date,
  tags = [],
  href = `/news/${id}`,
  reactions,
}: NewsCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer overflow-hidden shadow-md bg-card md:border hover:shadow-xl transition-shadow"
    >
      <Link to={href}>
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h2 className="font-bold text-xl line-clamp-2 text-foreground">
            {title}
          </h2>

          {/* Summary */}
          <p className="text-muted-foreground text-sm line-clamp-3">
            {summary}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-secondary/70 px-2 py-1 rounded-full text-xs capitalize"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="flex items-center gap-3 pt-3 justify-between text-xs text-muted-foreground border-t">
            <div className="flex items-center gap-2 pt-2">
              <Calendar size={14} />
              {new Date(date).toLocaleDateString()}{" "}
              {`${symbols.dot} ${getTimeAgo(date)}`}
            </div>

            {reactions && <div className="">{reactions} Reactions</div>}
          </footer>
        </div>
      </Link>
    </motion.div>
  );
}
