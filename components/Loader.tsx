import React, { useMemo } from "react";
import { motion } from "framer-motion";

const quotes = [
    "Wellness is the key to unlocking your best self.",
    "Take care of your body, it’s the only place you have to live.",
    "A healthy outside starts from the inside.",
    "Small steps every day lead to big changes.",
    "Balance is not something you find, it’s something you create.",
];

function Loader() {
    // Pick a random quote on each render
    const randomQuote = useMemo(
        () => quotes[Math.floor(Math.random() * quotes.length)],
        []
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-950">
            <motion.div
                className="flex flex-col items-center space-y-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Spinner */}
                <motion.div
                    className="w-12 h-12 border-4 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"
                    aria-label="Loading..."
                />

                {/* Quote */}
                <motion.p
                    key={randomQuote} // re-animate on new quote
                    className="text-zinc-300 italic text-lg max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    &#34;{randomQuote}&#34;
                </motion.p>
            </motion.div>
        </div>
    );
}

export default Loader;
