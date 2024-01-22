import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import queryNames from "@/data/constants/queryNames";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { get } from "@/server";
import { ALL_ARTICLES } from "@/data/constants/apiRoutes";
import { toast } from "sonner";
import NewsSkeleton from "@/components/news/NewsSkeleton";
import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";
import moment from "moment";
import { ReloadIcon } from "@radix-ui/react-icons";

const filterInitialState = {
  keyword: "",
  category_id: null,
  source_id: null,
  published_at: null,
};

const PAGE_LIMIT = 15;

const Homepage = () => {
  const [filters, setFilters] = useState(filterInitialState);
  const [filterData, setFilterData] = useState(filterInitialState);
  const [filterOpen, setFilterOpen] = useState(false);

  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);

  const queryClient = useQueryClient();

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilters({ ...filters, [name]: value });
  };

  const handleFilterClear = () => {
    setFilters(filterInitialState);
    setFilterData(filterInitialState);
  };

  const fetchData = async ({ pageParam = 1 }) => {
    let url = new URL(ALL_ARTICLES);

    if (filterData.keyword) {
      url.searchParams.append("keyword", filterData.keyword);
    }

    if (filterData.category_id) {
      url.searchParams.append("category_id", filterData.category_id);
    }

    if (filterData.source_id) {
      url.searchParams.append("source_id", filterData.source_id);
    }

    if (filterData.published_at) {
      url.searchParams.append(
        "published_at",
        moment(filterData.published_at).format("YYYY-MM-DD")
      );
    }

    url.searchParams.append("page", pageParam);
    url.searchParams.append("perPage", PAGE_LIMIT);

    const { status, message, data } = await get(url.toString());

    // toast(message);

    return { ...data, prevOffset: pageParam * PAGE_LIMIT };
  };

  const handleInvalidate = () => {
    queryClient.invalidateQueries(queryNames.NEWS, { page: 1 });
  };

  // const { isFetching } = useQuery([queryNames.NEWS], fetchData, {
  //   keepPreviousData: true,
  //   refetchOnWindowFocus: false,
  // });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      [
        queryNames.NEWS,
        filterData.keyword,
        filterData.category_id,
        filterData.source_id,
        filterData.published_at,
      ],
      fetchData,
      {
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.current_page === lastPage.last_page) {
            return false;
          }

          return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
      }
    );

  const news = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data];
    }, []);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilterData(filters);
    handleInvalidate();
    setFilterOpen(false);
  };

  return (
    <div className="flex flex-col w-[550px] h-full m-auto space-y-8">
      <div className="flex justify-between items-end w-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          News
        </h1>

        <Sheet
          open={filterOpen}
          onOpenChange={() => setFilterOpen(!filterOpen)}
        >
          <SheetTrigger asChild>
            <Button variant="outline">Filter</Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter News</SheetTitle>
              <SheetDescription>
                Apply different filters from below to get customized news feed
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keyword" className="text-right">
                  Keyword
                </Label>
                <Input
                  id="keyword"
                  name="keyword"
                  placeholder="Enter keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category_id" className="text-right">
                  Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFilters({ ...filters, category_id: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue
                      placeholder="Enter category"
                      value={filters.category_id}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {loggedUser?.preferences?.categories?.map((item) => {
                      return (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source_id" className="text-right">
                  Source
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFilters({ ...filters, source_id: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue
                      placeholder="Enter source"
                      value={filters.source_id}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {loggedUser?.preferences?.sources?.map((item) => {
                      return (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="published_at" className="text-right">
                  Published Date
                </Label>
                <DatePicker
                  data={filters}
                  setData={setFilters}
                  keyToChange={"published_at"}
                  className="col-span-3"
                />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleSubmit}>
                  Apply Filter
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={handleFilterClear}>Clear Filter</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {status === "loading" ? (
        <NewsSkeleton />
      ) : news && news.length > 0 ? (
        news.map((single) => <NewsCard key={single.id} {...single} />)
      ) : (
        <p className="text-center pt-16">No Data Found</p>
      )}

      {hasNextPage ? (
        <Button
          variant="outline"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading
            </>
          ) : (
            "Load more"
          )}
        </Button>
      ) : null}
    </div>
  );
};

export default Homepage;
