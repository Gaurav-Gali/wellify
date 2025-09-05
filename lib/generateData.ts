export const generateSampleData = () => {
    const data = [];
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
        const day = weekdays[i];

        // Generate realistic sample data with some variation
        const baseSteps = 7000 + Math.random() * 5000; // 7000-12000 steps
        const baseSpo2 = 95 + Math.random() * 5; // 95-100%
        const baseStress = 20 + Math.random() * 60; // 20-80 stress
        const baseWater = 1.5 + Math.random() * 2; // 1.5-3.5L water
        const baseCalories = 1800 + Math.random() * 800; // 1800-2600 calories
        const baseInactivity = 30 + Math.random() * 40; // 30-70% inactivity

        // Calculate cumulative score based on all metrics (simplified)
        const stepScore = Math.min(baseSteps / 100, 100);
        const spo2Score = baseSpo2;
        const stressScore = 100 - baseStress;
        const waterScore = Math.min(baseWater * 25, 100);
        const calorieScore = Math.min(baseCalories / 25, 100);
        const inactivityScore = 100 - baseInactivity;

        const cumulativeScore = Math.round(
            (stepScore + spo2Score + stressScore + waterScore + calorieScore + inactivityScore) / 6
        );

        data.push({
            day,
            steps: Math.round(baseSteps),
            spo2: Math.round(baseSpo2 * 10) / 10,
            stress: Math.round(baseStress),
            water: Math.round(baseWater * 10) / 10,
            calories: Math.round(baseCalories),
            inactivity: Math.round(baseInactivity),
            cumulativeScore: Math.min(Math.max(cumulativeScore, 0), 100),
        });
    }

    return data;
};
