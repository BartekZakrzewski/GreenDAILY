"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EcoScore from "@/components/components/ui/piechart";
import { Button, buttonVariants } from "@/components/components/ui/button";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { createEcoJournal, getEcoJournal, getEcoScore, updateEcoJournal, updateEcoScore } from "@/lib/auth";
import { Calendar } from "@/components/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Articles = [
    {
        title: "25 Eco Friendly Habits You Should Incorporate In Your Day To Day Life",
        content: "Climate change is real, and its effects are worsening due to our careless actions. Human greed has caused widespread environmental neglect, pushing us toward a potential crisis. However, adopting simple eco-friendly habits can improve the planet’s health and our own.\n\nHere are some easy, impactful habits to help the environment:\n\n1. Avoid food waste: Buy, cook, and store only what you need.\n2. Say no to single-use plastic: Use reusable alternatives instead.\n3. Eat less meat: Reduce carbon emissions and improve your health.\n4. Start composting: Turn biodegradable waste into fertilizer.\n5. Walk or use public transport: Save fuel and stay healthy.\n6. Conserve water: Use it wisely as drinking water is limited.\n7. Buy organic foods: Avoid genetically modified products.\n8. Use fuel catalysts: Burn fuel efficiently to cut harmful emissions.\n9. Reduce indoor pollution: Use plants and ventilation.\n10. Keep indoor plants: They purify air and produce oxygen.\n11. Fix faulty appliances: Save energy by ensuring efficiency.\n12. Choose green cleaners: Avoid harmful chemicals.\n13. Use eco-friendly cutlery: Replace plastic with biodegradable options.\n14. Use non-toxic cosmetics: Better for your skin and the planet.\n15. Buy eco-friendly clothing: Support brands using recycled materials.\n16. Carry a reusable mug: Reduce waste from disposable cups.\n17. Skip bottled water: Refill recyclable bottles.\n18. Use rechargeable batteries: Avoid toxic waste from disposables.\n19. Repair broken items: Save money and reduce waste.\n20. Donate usable items: Help others and reduce clutter.\n21. Service your car regularly: Improve efficiency and cut emissions.\n22. Dispose of waste properly: Learn to segregate and recycle.\n23. Use renewable energy: Opt for wind and solar power.\n24. Save paper: Store information digitally when possible.\n25. Shop thrifted items: Reduce demand for new production.\n\nThese simple actions can greatly benefit the environment and humanity. It’s time to take responsibility and make conscious choices for a healthier planet.",
        source: "https://greenfeels.in/blogs/eco-friendly/25-eco-friendly-habits-you-should-incorporate-in-your-day-to-day-life?srsltid=AfmBOoqLliVLcQMDZVXvxG0NV48q9ptmW5b0Mg0d4EuvR_IYrJ_YQ5Uz",
    },
    {
        title: "Eco-friendly recycling technology restores spent battery cathode materials",
        content: "The growing use of electric vehicles and portable devices has created a global issue: managing used batteries. Recycling these batteries is essential to prevent harmful metals from contaminating soil and water. Traditional recycling methods extract metals like lithium, nickel, and cobalt but require harmful chemicals, high temperatures, and substantial energy, leading to wastewater and high carbon emissions.\n\nTo address these challenges, direct recycling aims to restore materials without chemically altering them. However, it is costly and complex, involving high temperatures and pressures.\n\nA team led by Dr. Jung-Je Woo at the Korea Institute of Energy Research (KIER) has developed an eco-friendly and cost-effective method for recycling lithium-ion battery cathodes. Their process rejuvenates used cathode materials by immersing them in a restoration solution at room temperature and pressure, avoiding high-energy and chemical-intensive steps.\n\nThis method uses galvanic corrosion, where bromine in the solution reacts with aluminum from the battery, causing aluminum to corrode and release electrons. These electrons restore lithium ions into the cathode material, returning it to its original state. Unlike traditional methods, this reaction occurs directly within the battery cell, making the process more efficient.\n\nTests showed that the restored cathode performs as well as new materials. Dr. Woo highlighted that this innovative approach eliminates harmful chemicals and high temperatures, offering a sustainable way to recycle batteries, reduce carbon emissions, and support a circular resource economy.",
        source: "https://www.techexplorist.com/eco-friendly-recycling-technology-restores-spent-battery-cathode-materials/92636/",
    },
    {
        title: "Fun and simple tips for raising environmentally conscious kids",
        content: "Children’s Day and Sustainability\n\nIn India, November 14 marks Children’s Day, celebrating childhood and the birth anniversary of Pandit Jawaharlal Nehru, India’s first Prime Minister. He believed in nurturing children’s potential. On this day, let’s commit to ensuring kids grow up with clean air, water, and sustainable values.\n\nHow to Teach Kids Sustainability\n\n1. Lead by Example\nChildren imitate adults, so practice sustainability at home. Turn off unused lights, conserve water, and show kids how small actions can make a big impact.\n\n2. Use Reusable Items\nEncourage reusable water bottles, cloth towels, and grocery bags. Avoid single-use plastic, a major pollutant, and teach kids to follow these habits too.\n\n3. Support Eco-Friendly Brands\nChoose sustainable brands for your child’s needs. Brands like Brown Living, Amala Earth, and The Green Chapter focus on environmentally responsible production.\n\n4. Upcycle Toys\nOpen-ended toys last longer and are more versatile. Get creative with DIY toys using items like cardboard boxes. Repurpose items like paper rolls for fun crafts or gift wrapping.\n\n5. Donate\nKids outgrow clothes and toys quickly. Donate them to organisations like Goonj or circulate them among your friends to reduce waste and extend their use.\n\n6. Plant Something Together\nPlanting seeds teaches kids to care for nature. Grow herbs or small plants together—it’s fun, educational, and helps reduce your carbon footprint.\n\n7. Read About the Planet\nBooks like The Lorax, We Are Water Protectors, and Rewild the World teach kids about environmental issues in an engaging way. Stories help instill eco-friendly values early.\n\nBy taking small, mindful steps, we can guide children toward sustainable habits and a healthier planet for future generations. As parents, we play a key role in shaping their values.",
        source: "https://www.telegraphindia.com/my-kolkata/lifestyle/childrens-day-2024-teaching-eco-friendly-habits-to-our-future-generations/cid/2063179",
    },
    {
        title: "Save more than £130 on energy bills by doing 4 quick and simple switches at home",
        content: 'Energy expert Joshua Houston from GreenMatch warns that household appliances left on standby can significantly increase your electricity bills, using up to 10% of your home\'s energy. He advises using smart power strips or unplugging devices when not in use to reduce this "vampire power."\n\n' + 'Houston also recommends avoiding leaving the heating on low all day. Modern heating systems with thermostats or smart devices are more efficient and cost-effective, allowing you to heat your home only when needed. Using a programmable thermostat can save up to £130 annually.\n\n' + 'Surprisingly, washing dishes by hand may cost more than using a dishwasher. Energy-efficient dishwashers use less water and energy—about 12% less energy and 30% less water than hand-washing. Houston suggests skipping the pre-rinse and letting the dishwasher clean the dishes.\n\n' + 'Lastly, Houston advises against cranking the thermostat too high when cold, as it just wastes energy. Instead, set it to a steady temperature, typically 18-21°C for UK homes, for optimal efficiency.',
        source: "https://www.express.co.uk/life-style/property/1976420/how-to-save-money-reduce-energy-bills",
    },
    {
        title: "How Does Second-Hand Shopping Help the Environment? A Comprehensive Guide",
        content: 'How Second-hand Shopping Helps the Environment\n\n' + 'In today’s world, everything we buy affects the planet. The more we consume, the more waste we create. But what if we could reduce our impact by simply choosing second-hand items instead of new ones? Here’s how buying used goods helps the environment.\n\n' + 'The Environmental Benefits of Second-hand Shopping\n\n' + 'Second-hand shopping is gaining popularity, and thanks to online platforms like Faircado, it’s easier than ever to buy pre-owned items. From furniture to electronics, second-hand options are widely available. Let’s look at how buying used helps the planet:\n\n' + '1. Reduces Waste\n' + 'Buying second-hand keeps items out of landfills, giving them a second life. Only 15% of consumer textiles are recycled, so buying used can significantly reduce waste.\n\n' + '2. Reduces Pollution\n' + 'Manufacturing new items creates pollution at every stage, from raw material extraction to production. By buying second-hand, we cut down on pollution and reduce our environmental impact.\n\n' + '3. Saves Natural Resources\n' + 'Making new products uses valuable resources like oil and metals. By choosing second-hand, we help conserve these non-renewable materials.\n\n' + '4. Saves Water\n' + 'Producing new items uses huge amounts of water. For example, making one cotton t-shirt requires around 712 gallons. When we buy used, we save water—one of the world’s most precious resources.\n\n' +
            '5. Saves Energy\n' +
            'Producing new goods consumes a lot of energy, much of it from non-renewable sources. By opting for second-hand, we reduce energy use, including the energy needed to ship new products around the world.\n\n' +
            'Practical Tips for Second-hand Shopping\n\n' +
            'Second-hand shopping is not only good for the environment, but it also saves money. To find second-hand items, start by checking local thrift stores. If you can’t find what you need locally, try online platforms like eBay, Craigslist, or Poshmark. However, avoid buying used items like underwear or socks, and be mindful that you may not always find exactly what you\'re looking for.\n\n' +
            'It’s also important to buy intentionally—only purchase what you will truly use and love. Taking care of things you already own can help them last longer.\n\n' +
            'Conclusion\n\n' +
            'Second-hand shopping is more than just a trend; it’s a powerful way to reduce waste, save resources, and lower our environmental impact. By choosing second-hand, we contribute to a healthier planet and reduce the need for new production. The more people make this choice, the bigger the impact we can have.\n\n' +
            'So, next time you’re thinking about buying something new, ask yourself: “How does second-hand shopping help the environment?” By embracing used goods, you’ll be making a difference for the planet—and for your wallet.',
        source: "https://faircado.com/mag/how-does-second-hand-shopping-help-the-environment-a-comprehensive-guide/",
    },
    {
        title: "Top 10: Green Transport Solutions",
        content: 'Green Transport Solutions for a Sustainable Future\n\nAs companies and countries work towards decarbonizing their operations, green transport solutions are crucial. These eco-friendly alternatives help reduce greenhouse gas emissions, improve air quality, and promote sustainable mobility. Let\'s look at some of the top green transport solutions driving a cleaner future.\n\n### 10. Cycling Infrastructure\nCity: Copenhagen\nCopenhagen promotes cycling through its "Bicycle Superhighways," a network of dedicated bike lanes connecting the city center with suburbs. This initiative reduces reliance on fossil fuels, improves air quality, and encourages healthier lifestyles. Cycling now accounts for 49% of daily commutes in Copenhagen, cutting carbon emissions by 30% since 1995.\n\n### 9. Synthetic Fuels\nCompany: Porsche\nPorsche is investing in synthetic fuels (eFuels) made from renewable sources. These fuels reduce CO₂ emissions by up to 85% compared to conventional fuels. eFuels offer a way to decarbonize sectors like aviation and shipping, while still using existing combustion engines.\n\n### 8. Public Transport\nCompany: Transport for London\nLondon’s public transport system is transitioning to zero-emission vehicles, including buses powered by electricity and hydrogen. The city aims to reduce transport emissions by 45% by 2030. Electric buses save 23 tonnes of CO₂ each year compared to diesel buses.\n\n### 7. Biofuels\nCompany: Shell\nShell is using sustainable aviation fuel (SAF) to reduce emissions in aviation. SAF, made from waste and non-food crops, can reduce CO₂ emissions by up to 80%. Shell aims to produce 2 million tonnes of SAF annually by 2025, helping to decarbonize aviation.\n\n### 6. Hydrogen Fuel\nCompany: Iberdrola\nIberdrola is developing green hydrogen, produced from renewable energy, for use in transport. Hydrogen fuel cells emit only water vapor, making them an efficient and clean alternative, especially for heavy-duty transport. The company’s green hydrogen facility in Spain will reduce CO₂ emissions by up to 48,000 tonnes annually.\n\n### 5. Efficient Logistics\nCompany: UPS\nUPS uses the ORION system to optimize delivery routes, saving 10 million gallons of fuel and reducing CO₂ emissions by 100,000 tonnes per year. Efficient logistics reduce waste, improve supply chain performance, and minimize fuel consumption, contributing to greener transport.\n\n### 4. Sustainable Fuel for Cargo Transport\nCompany: Maersk\nMaersk is adopting sustainable fuels like biofuels and green methanol for its shipping operations. These fuels can reduce CO₂ emissions by up to 85%. Maersk’s carbon-neutral vessels, powered by green methanol, are set to revolutionize the shipping industry’s environmental impact.\n\n### 3. Urban Planning\nCity: London\nLondon’s Ultra Low Emission Zone (ULEZ) charges vehicles that don’t meet strict emission standards, promoting cleaner transport. Since the introduction of ULEZ, 96% of vehicles now meet the emission standards, significantly reducing air pollution.\n\n### 2. Smart Mobility Solutions\nCompany: Mercedes-Benz\nMercedes-Benz is developing smart mobility solutions like the Intelligent World Drive, which optimizes traffic flow and reduces emissions using AI and connected vehicle technology. These solutions can reduce urban traffic emissions by up to 20%.\n\n### 1. Electric Vehicles and EV Infrastructure\nCompany: Tesla\nTesla leads the electric vehicle (EV) revolution with its popular cars and Supercharger network. Tesla’s EVs produce 65% less CO₂ over their lifetime than petrol cars. The Supercharger network, which now runs on renewable energy, has saved over 4 million tonnes of CO₂ since its inception.\n\n### Conclusion\nGreen transport solutions—like electric vehicles, smart mobility, and efficient logistics—are reshaping the future of transportation. By adopting sustainable practices and technologies, companies and cities are reducing emissions and contributing to a cleaner, greener planet.',
        source: "https://sustainabilitymag.com/top10/top-10-green-transport-solutions",
    }, 
]

const UserDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userEcoScore, setUserEcoScore] = useState<any>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [ecoJournalContent, setEcoJournalContent] = useState<string>();
    const [ecoJournal, setEcoJournal] = useState<{[key: string]: string}[]>();
    const { toast } = useToast();
    const { id } = useParams<{ id: string }>();

     useEffect(() => {
        const _user = pb.authStore.model;

        if (_user && _user.id == id) {
            setUser(_user);
            setIsAuthenticated(true);
            const fetchEcoScore = async () => {
                const record = await getEcoScore(_user);
                setUserEcoScore(record);
            }
            fetchEcoScore();
            const fetchEcoJournal = async () => {
                const records = await getEcoJournal(_user);
                setEcoJournal(records);
            }
            fetchEcoJournal();
        } else {
            setIsAuthenticated(false);
        }
    }, [id]);

    useEffect(() => {
        if(ecoJournal && selectedDate != undefined && ecoJournal.filter((item) => item.date == selectedDate.toString().slice(4, 15)).length != 0) {
            setEcoJournalContent(ecoJournal.filter((item) => item.date == selectedDate.toString().slice(4, 15)).at(0).content);
        } else {
            setEcoJournalContent("");
        }
    }, [selectedDate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(ecoJournal && selectedDate != undefined) {
            if(ecoJournal.filter((item) => item.date == selectedDate.toString().slice(4, 15)).length != 0) {
                console.log(ecoJournal)
                const record = await updateEcoJournal(ecoJournal.filter((item) => item.date == selectedDate.toString().slice(4, 15)).at(0).id, ecoJournalContent);
            } else {
                const record = await createEcoJournal(ecoJournalContent, selectedDate.toString().slice(4, 15), user.id);
            }
        }

        toast({
          title: `${selectedDate.toISOString().slice(0, 10)}`,
          description: "Your journal has been updated",
        })

        const fetchEcoJournal = async () => {
            const records = await getEcoJournal(user);
            setEcoJournal(records);
        }
        fetchEcoJournal();
    }

    if (!isAuthenticated) {
        return (
            <div className='flex items-center justify-center gap-2 sm:gap-0 sm:grid sm:grid-cols-2 sm:items-center sm:px-2 text-sm sm:text-base text-nowrap'>
                <Link href="/auth/login">Log in</Link>
                <Link className={`${buttonVariants({ variant: "_default"})}`} href="/auth/signup" >Sign up</Link>
            </div>
        );
    }
    return (
        <main className="flex flex-col">
            <h1 className="font-extrabold p-6 text-xl italic text-center border-b-[1px] border-opacity-5">{ user.email }</h1>
            <section className="flex flex-col">
                <div className="flex flex-col items-center">
                    <EcoScore userEcoScore={userEcoScore?.ecoscore} />
                    <Link className={buttonVariants({ variant: "default"})} href={`/dashboard/${id}/${userEcoScore?.id}`}>Calculate your <span className="text-green-400 italic">Eco Score</span></Link>
                </div>
                <div className="flex flex-col md:flex-row mt-10 justify-center items-center px-8 md:px-16 bg-slate-700/30">
                    <Calendar 
                        mode="single"
                        className="w-min"
                        selected={selectedDate}
                        onSelect={setSelectedDate} footer={
                        selectedDate ?
                        `Selected: ${selectedDate.toString().slice(4, 15)}` 
                            : "Pick a day."
                    } />
                    <div className="w-full h-full">
                        <form 
                            onSubmit={handleSubmit} 
                            className="flex flex-col space-y-8"
                        >
                            <Textarea 
                                value={ecoJournalContent} 
                                onChange={
                                    (e) => { 
                                      setEcoJournalContent(e.target.value)
                                    }
                                }
                                placeholder={
                                `Write about you eco habits on ${selectedDate && selectedDate.toString().slice(4, 15)} here`
                                } 
                            />
                            <Button type="submit">Update Journal</Button>
                        </form>
                    </div>
                </div>
            </section>
            <Toaster />
            <section className="grid grid-cols-1 bg-slate-900 p-6 items-center space-y-6">
                <h1 className="text-white text-3xl font-extrabold">Eco Articles</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 justify-items-center items-start gap-4">
                    {
                        Articles.map((article, index) => (
                            <Dialog key={index}>
                                <DialogTrigger className="w-full">
                                    <Card className="border-2 border-white/20">
                                        <CardHeader className="text-white text-xl font-bold">
                                            <CardTitle>{article.title}</CardTitle>
                                            <CardDescription>
                                                <Link href={article.source} className="underline">
                                                    Source
                                                </Link>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-white text-justify space-y-4 flex flex-col items-center">
                                            <p className="text-white text-justify line-clamp-4 text-ellipsis">
                                                { article.content }
                                            </p>
                                            <Button variant="outline" className="bg-slate-900 text-green-500 border-green-500">
                                                Find out more
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md bg-slate-500/20 backdrop-blur-md">
                                    <DialogHeader className="pb-2 border-b-2 border-slate-500/10">
                                      <DialogTitle className="text-white">{ article.title }</DialogTitle>
                                      <DialogDescription className="text-white/80">
                                        <Link href={article.source} className="underline">
                                            Source
                                        </Link>
                                      </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-80 w-80 mx-auto">
                                        <p className="text-white">
                                            { article.content }
                                        </p>
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        ))
                    }
                </div>
            </section>
        </main>
    );
};

export default UserDashboard;
