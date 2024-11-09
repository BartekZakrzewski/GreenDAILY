"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { buttonVariants } from "@/components/components/ui/button";
import Link from "next/link";
import EcoScore from "@/components/components/ui/piechart";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/components/ui/card";
import { updateEcoScore } from "@/lib/auth";
import { useRouter } from "next/navigation";

const Questions = [
    {
        id: "recycling",
        question: "How often do you separate recyclables from regular trash?",
        options: ["Always", "Often", "Sometimes", "Rarely"] as const,
    },
    {
        id: "composting",
        question: "Do you compost organic waste (food scraps, yard waste)?",
        options: ["Yes, regularly", "Occasionally", "Rarely", "Never"] as const,
    },
    {
        id: "singleUsePlastics",
        question:
            "How often do you use single-use plastics (e.g., plastic bags, bottles)?",
        options: ["Never", "Rarely", "Often", "Always"] as const,
    },
    {
        id: "minimalPackaging",
        question:
            "How often do you try to reduce waste by buying products with minimal packaging?",
        options: ["Always", "Often", "Occasionally", "Never"] as const,
    },
    {
        id: "energySource",
        question: "What is your primary household energy source?",
        options: [
            "Renewable energy (solar, wind)",
            "Mostly renewable with some non-renewable",
            "Non-renewable (gas, coal)",
            "Unsure",
        ] as const,
    },
    {
        id: "energyEfficientAppliances",
        question:
            "Do you use energy-efficient appliances (e.g., LED lights, efficient HVAC systems)?",
        options: [
            "Yes, exclusively",
            "Mostly",
            "Some, but not all",
            "Rarely",
        ] as const,
    },
    {
        id: "heatingCooling",
        question: "How do you manage heating/cooling at home?",
        options: [
            "I use programmable thermostats and moderate temperatures year-round",
            "I adjust thermostats manually to save energy",
            "I use moderate temperatures without much thought to saving energy",
            "I prioritize comfort regardless of energy usage",
        ] as const,
    },
    {
        id: "turnOffElectronics",
        question: "Do you turn off lights and electronics when not in use?",
        options: ["Always", "Often", "Sometimes", "Rarely"] as const,
    },
    {
        id: "diet",
        question: "Which of these best describes your diet?",
        options: [
            "Plant-based (vegan/vegetarian)",
            "Mostly plant-based",
            "Mixed, with regular animal products",
            "Meat-heavy",
        ] as const,
    },
    {
        id: "localProduce",
        question: "How often do you buy local or seasonal produce?",
        options: ["Always", "Often", "Occasionally", "Rarely"] as const,
    },
    {
        id: "foodWaste",
        question:
            "How mindful are you about reducing food waste (e.g., meal planning, leftovers)?",
        options: [
            "Very mindful, I rarely waste food",
            "I try to minimize waste",
            "I don't think about it much",
            "I frequently waste food",
        ] as const,
    },
    {
        id: "processedFoods",
        question: "How often do you consume heavily processed foods?",
        options: ["Rarely", "Occasionally", "Often", "Almost always"] as const,
    },
    {
        id: "commute",
        question: "How do you usually commute?",
        options: [
            "Walk, bike, or public transport",
            "Carpool or electric vehicle",
            "Drive alone in a fuel-efficient car",
            "Drive alone in a standard car",
        ] as const,
    },
    {
        id: "airTravel",
        question: "How often do you travel by air?",
        options: [
            "Rarely or never",
            "Once or twice per year",
            "Three to five times per year",
            "More than five times per year",
        ] as const,
    },
    {
        id: "alternativeTransport",
        question:
            "Do you consider alternative transportation options (e.g., carpooling, public transport)?",
        options: ["Always", "Often", "Occasionally", "Rarely"] as const,
    },
    {
        id: "fuelEfficiency",
        question: "Do you consider fuel efficiency when choosing a vehicle?",
        options: [
            "Yes, it's a top priority",
            "It's somewhat important",
            "I don't prioritize it",
            "No, I don't consider it",
        ] as const,
    },
    {
        id: "waterSavingDevices",
        question:
            "Do you use water-saving devices (e.g., low-flow faucets/showerheads)?",
        options: [
            "Yes, all available options",
            "Some water-saving devices",
            "I don't use them",
            "I'm not sure",
        ] as const,
    },
    {
        id: "waterUse",
        question:
            "How conscious are you about limiting water use (e.g., shorter showers, no unnecessary watering)?",
        options: [
            "Very conscious",
            "Somewhat conscious",
            "Not very conscious",
            "Rarely consider it",
        ] as const,
    },
    {
        id: "sustainableProducts",
        question:
            "How often do you buy sustainable products or support eco-friendly brands?",
        options: ["Always", "Often", "Occasionally", "Rarely"] as const,
    },
    {
        id: "secondhandItems",
        question:
            "How often do you buy secondhand items (e.g., clothing, furniture)?",
        options: ["Often", "Occasionally", "Rarely", "Never"] as const,
    },
] as const;

type QuestionId = (typeof Questions)[number]["id"];
type OptionType<T extends QuestionId> = (typeof Questions)[number] & { id: T };

const formSchema = z.object(
    Object.fromEntries(
        Questions.map((q) => [
            q.id,
            z.enum(q.options as unknown as [string, ...string[]]),
        ]),
    ) as { [K in QuestionId]: z.ZodEnum<[string, ...string[]]> },
);

type FormValues = z.infer<typeof formSchema>;

const EcoScoreEval = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userEcoScore, setUserEcoScore] = useState<any>();
    const router = useRouter();

    const { id, slug } = useParams<{ id: string; slug: string }>();

    useEffect(() => {
        const _user = pb.authStore.model;

        if (_user && _user.id == id) {
            setUser(_user);
            const fetchEcoScore = async () => {
                try {
                    const records = await pb
                        .collection("GetEcoScore")
                        .getFullList()
                        .then((res) =>
                            res.filter((record) => record.user_id == _user.id),
                        );
                    setUserEcoScore(records[0]);
                    if (records[0].id == slug) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (err) {
                    console.log(err.originalError);
                }
            };
            fetchEcoScore();
        } else {
            setIsAuthenticated(false);
        }
    }, [id, slug]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const _calcScore = (values: z.infer<typeof formSchema>) => {
        let totalScore = 0;
        Object.entries(values).forEach(([questionId, answer]) => {
            const question = Questions.find((q) => q.id === questionId);

            if (question) {
                const score =
                    3 -
                    question.options.findIndex((option) => option === answer);
                totalScore += score;
            }
        });

        const maxPossibleScore = Questions.length * 3;
        const percentageScore = Math.round(
            (totalScore / maxPossibleScore) * 100,
        );

        return {
            rawScore: totalScore,
            percentageScore: percentageScore,
        };
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const score = _calcScore(values);
        console.log(`Raw Score: ${score.rawScore}`);
        console.log(`Percentage Score: ${score.percentageScore}%`);

        if (userEcoScore?.id) {
            try {
                await updateEcoScore(userEcoScore.id, score.percentageScore);
                router.refresh();
            } catch (err) {
                console.error("Failed to update eco score:", err);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center gap-2 sm:gap-0 sm:grid sm:grid-cols-2 sm:items-center sm:px-2 text-sm sm:text-base text-nowrap">
                <Link href="/auth/login">Log in</Link>
                <Link
                    className={`${buttonVariants({ variant: "_default" })}`}
                    href="/auth/signup"
                >
                    Sign up
                </Link>
            </div>
        );
    }
    return (
        <main>
            <div className="flex flex-col items-center">
                <EcoScore userEcoScore={userEcoScore.ecoscore} />
                <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground px-1.5">
                    <span className="font-extrabold">{user.email}&apos;s</span>{" "}
                    current{" "}
                    <span className="text-green-500 italic">Eco Score</span>
                </div>
            </div>
            <div className="flex items-center justify-center ">
                <Card className="w-full max-w-3xl mx-auto bg-slate-900 text-white mt-2">
                    <CardHeader>
                        <CardTitle>
                            <span className="text-green-500 italic">
                                EcoScore
                            </span>{" "}
                            Evaluation
                        </CardTitle>
                        <CardDescription>
                            Answer the following questions about your lifestyle
                            habits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-"
                            >
                                {Questions.map((q, index) => (
                                    <FormField
                                        key={q.id}
                                        control={form.control}
                                        name={q.id}
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>
                                                    {index + 1}. {q.question}
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        {q.options.map(
                                                            (
                                                                option,
                                                                optionIndex,
                                                            ) => (
                                                                <FormItem
                                                                    className="flex items-center space-x-3 space-y-0"
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                >
                                                                    <FormControl className="bg-white">
                                                                        <RadioGroupItem
                                                                            value={
                                                                                option
                                                                            }
                                                                            className="text-green-500"
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {option}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            ),
                                                        )}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default EcoScoreEval;
