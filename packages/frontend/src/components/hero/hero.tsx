import { motion } from "framer-motion";
import Image from "next/image";
import GetStartedButton from "../common/get-started-button";

export function Hero() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative lg:mt-24 z-10">
      {/* Gradient bubbles */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 md:w-40 md:h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-36 h-36 md:w-60 md:h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="text-center h-screen flex flex-col items-center justify-center">
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-5xl font-normal tracking-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock unique <Evolve /> Discord
          <motion.div
            className="relative md:-mt-1"
            whileHover={{ scale: 1.05 }}
          >
            <Bot /> experiences with{" "}
            <span className="highlight-blue">Blinkord</span>{" "}
            <motion.div
              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-r-2 border-neon-blue z-10"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: -360 }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </motion.div>
        </motion.h1>

        <motion.h2
          className="font-medium mt-14 leading-10 text-lg md:text-xl"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Bring <span className="highlight-green">Blinks</span> into your{" "}
          <span className="highlight-cyan">Discord</span> community
        </motion.h2>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="font-medium opacity-50 mt-3 text-sm md:text-base">
            Create and share links that enable Solana interactions directly within your Discord Server
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <GetStartedButton className="mt-10" />
        </motion.div>
      </div>
    </div>
  );
}

function Evolve() {
  return (
    <motion.span
      className="relative inline-block group mx-1"
      whileHover={{ scale: 1.05 }}
    >
      <Image
        className="inline w-16 sm:w-20 md:w-24 lg:w-28 z-20 relative"
        width={192}
        height={108}
        src="/evolve.svg"
        alt="Person wearing helmet"
      />
      <motion.div
        className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-l-2 border-neon-blue z-10"
        animate={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-b-2 border-r-2 border-neon-pink z-10"
        animate={{ rotate: 0 }}
        whileHover={{ rotate: -360 }}
        transition={{ duration: 2, ease: "linear" }}
      />
      <motion.div
        className="absolute -inset-2 md:-inset-3 lg:-inset-4 bg-neon-purple/20"
        animate={{ rotate: [0, 360] }}
      />
    </motion.span>
  );
}

function Bot() {
  return (
    <motion.span
      className="relative inline-block group md:mx-2"
      whileHover={{ scale: 1.05 }}
    >
      <Image
        className="inline w-12 sm:w-16 md:w-20 z-20 relative"
        width={192}
        height={108}
        src="/transhumans-roboto.webp"
        alt="Transhuman Robot"
      />

      <div className="absolute inset-0 flex justify-center items-center">
        {/* //yellow */}
        <motion.div
          className="absolute top-0 sm:-top-4 -left-4 w-0 h-0 border-l-[15px] sm:border-l-[20px] md:border-l-[25px] lg:border-l-[35px] xl:border-l-[45px] border-l-transparent border-r-[15px] sm:border-r-[20px] md:border-r-[25px] lg:border-r-[35px] xl:border-r-[45px] border-r-transparent border-b-[30px] sm:border-b-[40px] md:border-b-[50px] lg:border-b-[70px] xl:border-b-[90px] border-b-yellow-400 z-1"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />

        {/* //purple */}
        <motion.div
          className="absolute top-1/4 xl:top-10 left-0 w-14 sm:w-12 md:w-16 lg:w-20 xl:w-24 h-10  lg:h-20 bg-indigo-600 z-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
      </div>
    </motion.span>
  );
}
