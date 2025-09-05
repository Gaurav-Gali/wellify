import {atom} from "jotai";

export type ReminderType = {
    id?: string;
    userId?: string;
    reminderName: string;
    duration:number;
    actionPath: string;
};

type UserStats = {
    steps: number;
    spo2: number;
    stress: number;
    waterIntake: number;
    calories: number;
    inactivity: number;
    cumulativeScore: number;
    avgScore: number;
    idealScore: number;
};

export const ReminderAtom =  atom<ReminderType[]>([
    {
        id:"1",
        reminderName: "Drink Water",
        duration: 2,
        actionPath: "/hydration",
    },
]);

export const StatsAtom = atom<UserStats>();

export const overallScoreAtom = atom<number|null>(null);