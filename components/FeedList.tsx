"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import FeedCard from "./FeedCard";
import Loader from "@/components/Loader";

type FeedItem = {
    recalling_firm: string;
    product_description: string;
    reason_for_recall: string;
    recall_initiation_date: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
};

const PAGE_SIZE = 12; // number of feeds per fetch

const FeedList: React.FC = () => {
    const [feeds, setFeeds] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastFeedElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        const fetchFeeds = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api.fda.gov/food/enforcement.json?limit=${PAGE_SIZE}&skip=${
                        (page - 1) * PAGE_SIZE
                    }`
                );
                const data = await res.json();

                const newFeeds: FeedItem[] = (data.results || []).map((feed: any) => ({
                    recalling_firm: feed.recalling_firm,
                    product_description: feed.product_description,
                    reason_for_recall: feed.reason_for_recall,
                    recall_initiation_date: new Date(
                        feed.recall_initiation_date
                            .toString()
                            .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
                    ).toDateString(),
                    mediaUrl: undefined,
                    mediaType: undefined,
                }));

                setFeeds((prev) => [...prev, ...newFeeds]);
                setHasMore(newFeeds.length === PAGE_SIZE); // If less than PAGE_SIZE, no more data
            } catch (err) {
                console.error("Error fetching feeds:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeds();
    }, [page]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {feeds.map((feed, idx) => {
                    if (idx === feeds.length - 1) {
                        return (
                            <div key={idx} ref={lastFeedElementRef}>
                                <FeedCard
                                    recallingFirm={feed.recalling_firm}
                                    productDescription={feed.product_description}
                                    reason={feed.reason_for_recall}
                                    date={feed.recall_initiation_date}
                                    mediaUrl={feed.mediaUrl}
                                    mediaType={feed.mediaType}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <FeedCard
                                key={idx}
                                recallingFirm={feed.recalling_firm}
                                productDescription={feed.product_description}
                                reason={feed.reason_for_recall}
                                date={feed.recall_initiation_date}
                                mediaUrl={feed.mediaUrl}
                                mediaType={feed.mediaType}
                            />
                        );
                    }
                })}
                {!hasMore && <p className="text-zinc-500 col-span-full text-center mt-2">No more feeds</p>}
            </div>
            {loading && <p className="text-zinc-500 text-center mt-6 col-span-full">
                Loading more wellness ...
            </p>}
        </div>

    );
};

export default FeedList;
