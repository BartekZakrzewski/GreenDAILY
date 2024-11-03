import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full flex flex-wrap justify-between p-2 border-b-2 border-slate-500/10 bg-slate-500/20 sticky">
      <h1 className="sm:text-2xl my-auto">
        Green<span className="uppercase text-green-900 font-extrabold">daily</span>
      </h1>
      <div className="flex items-center justify-center gap-2 sm:gap-0 sm:grid sm:grid-cols-2 sm:items-center sm:px-2 text-sm sm:text-base text-nowrap">
        <Link href="#">Log in</Link>
        <Link href="#" className="bg-green-900 py-3 px-5 items-center rounded-md text-white">Sign in</Link>
      </div>
    </header>
  );
};

export default Header;
