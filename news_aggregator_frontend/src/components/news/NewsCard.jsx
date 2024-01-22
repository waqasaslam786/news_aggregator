import { Badge } from "@/components/ui/badge";
import moment from "moment";

const NewsCard = ({ title, content, published_at, author, category }) => {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold w-3/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{title}</span>
          <span className="ml-auto text-xs text-foreground">
            {moment(published_at).format("YYYY-MM-DD")}
          </span>
        </div>
        <span className="text-xs font-medium">
          Published By:{" "}
          <span className="italic text-muted-foreground">{author.name}</span>
        </span>
      </div>

      <p className="line-clamp-2 text-xs text-muted-foreground">{content}</p>

      <Badge className="w-fit">{category.name}</Badge>
    </div>
  );
};

export default NewsCard;
