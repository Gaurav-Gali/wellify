"use client";

import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Award, Activity, Sun } from "lucide-react";

interface PostCardProps {
    userName: string;
    profileImage: string;
    wellnessData: {
        steps: number;
        sleepHours: number;
        waterIntake: number;
    };
    accomplishments: string[];
}

const PostCard: React.FC<PostCardProps> = ({
                                               userName,
                                               profileImage,
                                               wellnessData,
                                               accomplishments,
                                           }) => {
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
    };

    return (
        <Card className="max-w-md w-full mx-auto my-4">
            {/* Header: User Info */}
            <CardHeader className="flex items-center gap-3">
                <img
                    src={profileImage}
                    alt={userName}
                    className="w-12 h-12 object-cover rounded-full border-2 border-zinc-800"
                />
                <div>
                    <CardTitle className="text-base">{userName}</CardTitle>
                    <CardDescription className="text-sm text-zinc-400">
                        Wellness Update
                    </CardDescription>
                </div>
            </CardHeader>

            {/* Main Content: Wellness Stats */}
            <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                            <Activity size={20} />
                            <span>{wellnessData.steps}</span>
                        </div>
                        <span className="text-zinc-400">Steps</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                            <Sun size={20} />
                            <span>{wellnessData.sleepHours}</span>
                        </div>
                        <span className="text-zinc-400">Sleep (hrs)</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                            <Award size={20} />
                            <span>{wellnessData.waterIntake}</span>
                        </div>
                        <span className="text-zinc-400">Water (L)</span>
                    </div>
                </div>

                {/* Accomplishments */}
                <div className="flex flex-wrap gap-2">
                    {accomplishments.map((acc, idx) => (
                        <Button
                            key={idx}
                            variant="secondary"
                            className="text-xs px-2 py-1 cursor-default"
                        >
                            {acc}
                        </Button>
                    ))}
                </div>
            </CardContent>

            {/* Footer: Likes */}
            <CardFooter className="flex justify-start items-center">
                <Button
                    onClick={handleLike}
                    variant={liked ? "default" : "ghost"}
                    className="flex items-center gap-2"
                >
                    <Heart size={16} />
                    {likes} {likes === 1 ? "Like" : "Likes"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PostCard;
