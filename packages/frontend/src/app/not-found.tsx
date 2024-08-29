import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative flex h-screen flex-col bg-bg">
      <div className="grid h-screen place-content-center bg-white px-4">
        {/* Background Layer with Shapes /}
        <div className="absolute inset-0 -z-10 flex justify-center items-center"></div>
        <div className="text-center relative z-10">
          {/ Yellow Triangle /}
          <div className="absolute inset-0 -z-10 flex justify-center items-center">
            <div className="absolute top-4 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-geay-700 z-10"></div>
            <div className="absolute top-0 left-0 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-yellow-400 z-1"></div>
            <div className="absolute top-10 left-20 w-64 h-36 bg-indigo-600 z-1"></div>
          </div>

          {/ Indigo Square */}
        <Image
          src="/transhumans-roboto.png"
          alt="Not Found"
          className="mx-auto h-56 w-auto text-black sm:h-64 z-10"
          priority
          width={800}
          height={400}
        />

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </h1>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          We can`t find that page.
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Don't forget to blink.
        </h2>
      </div>
    </div>
  );
}