"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import {useDebounce} from 'use-debounce';
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(true);
  const [debouncedQuery] = useDebounce(query, 300)
  // const [debouncedQuery, setDebouncedQuery] = useState("")
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const pathname = usePathname();
  const router = useRouter()

  const sort = "$createdAt-desc";
  const limit = 10;

  useEffect(() => {
    const fetchFiles = async () => {
      if(debouncedQuery.length === 0) {
        setResults([])
          setOpen(false)
          return router.push(pathname.replace(searchParams.toString(), ""))  
      }
      const files = await getFiles({ types: [], searchText: debouncedQuery, sort, limit });
      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false)
    setResults([])
    router.push(`/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${debouncedQuery}`)
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime className="caption line-clamp-1 text-light-100"
                  date={file.$createdAt} />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
