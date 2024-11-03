import Link from "next/link";
import EcoScore from "@/components/ui/piechart";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from '@/components/ui/skeleton'

const App = () => {
  return (
    <>
      <main className="py-5 px-2 sm:p-0 sm:h-screen flex items-center justify-center">
        <div className="flex flex-col w-11/12 sm:w-2/3 gap-5">
          <h1 className="text-xl md:text-3xl lg:text-6xl font-extrabold leading-snug text-center">
            Incorporate{" "}<span className="text-green-900 italic">eco-friendly</span>{" "}habits into your daily life through recommendations, challenges and resources!
          </h1>
          <div className="flex items-center justify-center">
            <Link href="#" className="lg:text-3xl text-white font-medium bg-black px-4 py-2 md:px-6 md:py-3 rounded-md">Try now</Link>
          </div>
        </div>
      </main>
      <section className=" bg-slate-300/90 pt-5">
        <h2 className="text-center text-3xl font-extrabold mb-5">
          Features
        </h2>
        <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-10 p-5">
          <EcoScore />
            <div className="flex w-full flex-col items-center justify-center">
              <h3 className="text-xl font-extrabold text-slate-900/90">Eco Impact Tracker</h3>
              <Calendar />
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="bg-slate-900 p-5 pt-3 rounded-xl w-min">
                <h3 className="text-xl text-slate-50/90 pb-2">
                  Eco-News and Articles
                </h3>
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-slate-800" />
                    <Skeleton className="h-4 w-[200px] bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default App;
