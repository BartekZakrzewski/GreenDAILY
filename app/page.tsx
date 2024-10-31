import Link from "next/link";

const App = () => {
  return (
    <>
      <main className="h-screen flex items-center justify-center">
        <div className="flex flex-col w-2/3 gap-5">
          <h1 className="text-2xl md:text-6xl text-center font-extrabold leading-snug">
            Incorporate{" "}<span className="text-green-900 italic">eco-friendly</span> habits into your daily life through recommendations, challenges and resources!
          </h1>
          <div className="flex items-center justify-center">
            <Link href="#" className="md:text-3xl text-white font-medium bg-black px-6 py-3 rounded-md">
              Try now
            </Link>
          </div>
        </div>
      </main>

      <section className="">
        
      </section>
    </>
  );
};

export default App;
