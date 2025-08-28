import React from 'react';
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";

const Page = () => {
    const samplePosts = [
        {
            userName: "Alice Johnson",
            profileImage: "img.png", // replace with a real path or URL
            wellnessData: {
                steps: 10234,
                sleepHours: 7,
                waterIntake: 2,
            },
            accomplishments: ["Morning Run", "Meditation", "10k Steps"],
        },
        {
            userName: "Bob Smith",
            profileImage: "img.png",
            wellnessData: {
                steps: 8765,
                sleepHours: 6,
                waterIntake: 1.5,
            },
            accomplishments: ["Yoga Session", "Read Book", "Cycling"],
        },
        {
            userName: "Bob Smith",
            profileImage: "img.png",
            wellnessData: {
                steps: 8765,
                sleepHours: 6,
                waterIntake: 1.5,
            },
            accomplishments: ["Yoga Session", "Read Book", "Cycling"],
        },
        {
            userName: "Bob Smith",
            profileImage: "img.png",
            wellnessData: {
                steps: 8765,
                sleepHours: 6,
                waterIntake: 1.5,
            },
            accomplishments: ["Yoga Session", "Read Book", "Cycling"],
        },
    ];
    return (
        <div>
            <SearchBar/>
            <div className={"mx-2"}>
                {samplePosts.map((post, idx) => (
                    <PostCard
                        key={idx}
                        userName={post.userName}
                        profileImage={post.profileImage}
                        wellnessData={post.wellnessData}
                        accomplishments={post.accomplishments}
                    />
                ))}
            </div>
        </div>
    );
};

export default Page;