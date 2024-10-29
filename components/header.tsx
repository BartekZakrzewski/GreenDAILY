const Header = () => {
  return (
    <header className="w-full flex justify-between p-2 border-b-2 border-gray-500/10">
      <h1 className="text-2xl my-auto">
        Green<span className="uppercase text-green-900 font-extrabold">daily</span>
      </h1>
      <div className="grid grid-cols-2 items-center px-2">
        <a href="#">Log in</a>
      <a href="#" className="bg-green-900 py-3 px-5 items-center rounded-md text-white">Sign in</a>
      </div>
    </header>
  );
};

export default Header;
