"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar: React.FC = ({message}:{message:string}) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        console.log("Searching for:", query);
        // Add your search logic here
    };

    return (
        <div className="flex mt-2 px-2 py-1 max-w-md mx-auto gap-2">
            <Input
                type="text"
                placeholder={message}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
            />
            <Button onClick={handleSearch}>
                <Search size={8} />
            </Button>
        </div>
    );
};

export default SearchBar;
