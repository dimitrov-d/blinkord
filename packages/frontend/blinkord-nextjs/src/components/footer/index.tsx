import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full p-4 relative">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left side */}
        <div className="flex-1 relative">
          <Image
            src="/Union.svg"
            alt="Union"
            width={50}
            height={50}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          />
          <div className="w-full h-[1px] bg-purple-600 " />
        </div>

        {/* Center */}
        <div className="z-20">
          <Image src="/smiley.svg" alt="Smiley Face" width={100} height={100} />
        </div>

        {/* Right side */}
        <div className="flex items-center flex-1 justify-end relative">
          <div className="w-full h-[1px] bg-purple-600" />
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex items-center z-10">
            <Image
              src="/star-purple.svg"
              alt="Purple Star"
              width={100}
              height={100}
              className="rounded-full object-cover "
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
