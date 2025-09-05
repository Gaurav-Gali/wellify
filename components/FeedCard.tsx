"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

type FeedCardProps = {
    recallingFirm: string;
    productDescription: string;
    reason: string;
    date: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
};

const FeedCard: React.FC<FeedCardProps> = ({
                                               recallingFirm,
                                               productDescription,
                                               reason,
                                               date,
                                               mediaUrl,
                                               mediaType,
                                           }) => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-lg p-4 flex flex-col">
            {mediaUrl && mediaType === "image" && (
                <img
                    src={mediaUrl}
                    alt={productDescription}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                />
            )}
            {mediaUrl && mediaType === "video" && (
                <video
                    src={mediaUrl}
                    controls
                    className="w-full h-40 rounded-lg mb-3"
                />
            )}
            <h3 className="text-zinc-100 font-semibold">{recallingFirm}</h3>

            <div className="text-zinc-300 text-sm mb-1">
                <ReactMarkdown>{productDescription}</ReactMarkdown>
            </div>

            <div className="text-zinc-400 text-xs">
                <ReactMarkdown>{reason}</ReactMarkdown>
            </div>

            <p className="text-zinc-500 text-xs mt-1">{date}</p>
        </div>
    );
};

export default FeedCard;
