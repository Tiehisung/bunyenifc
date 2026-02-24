import { CountupMetricCard } from "@/components/Metrics/Cards";
import { motion } from "framer-motion";
import { ChevronRight, Trophy, Users, Target, Shield } from "lucide-react";
import { IQueryResponse } from "@/types";
import { IPlayerMetrics } from "@/types/metrics.interface";

interface IProps {
  metrics?: IQueryResponse<IPlayerMetrics>;
}

export default function HERO({ metrics }: IProps) {
  // console.log({ metrics });

  const stats = [
    {
      value: metrics?.data?.matchStats?.winRate,
      label: "Win Rate",
      icon: <Trophy className="w-5 h-5" />,
      suffix: "%",
      isCountup: false,
    },
    {
      value: metrics?.data?.activePlayers ?? 0,
      label: "Active Players",
      icon: <Users className="w-5 h-5" />,
      suffix: "+",
      isCountup: false,
    },
    {
      value: "100",
      label: "Fan Dedication",
      icon: <Target className="w-5 h-5" />,
      suffix: "%",
      isCountup: false,
    },
    {
      value: "Est. 2024",
      label: "Legacy Years",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-primary via-primary/80 to-primary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-red-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-l from-yellow-500/10 to-transparent rounded-full blur-3xl"></div>

        {/* Animated floating footballs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ y: 0, x: i * 100 }}
            animate={{
              y: [0, -100, 0],
              x: [i * 100, i * 100 + 50, i * 100],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-white/20"></div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="text-center lg:text-left"
          >
            {/* Badge & Tagline */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center border-4 border-yellow-500 shadow-2xl">
                  <span className="text-2xl font-bold text-white">KFC</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-black">⚽</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-yellow-500 font-bold text-sm uppercase tracking-[0.3em]">
                  Professional Football Club
                </div>
                <div className="text-white/80 text-sm">Since 2024</div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6"
            >
              <span className="text-white">BORN TO </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-yellow-500">
                PLAY
              </span>
              <br />
              <span className="text-white">BUILT TO </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-red-600">
                WIN
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl"
            >
              At <span className="font-bold text-yellow-400">Konjiehi FC</span>,
              we play for pride, for our people, and for the love of football.
              Together, we rise — stronger every season.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
            >
              <button className="group relative px-8 py-4 bg-linear-to-r from-red-600 to-red-700 text-white font-bold rounded-full text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/30">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Join Our Legacy
                  <ChevronRight
                    className={`w-5 h-5 transition-transform group-hover:translate-x-2  `}
                  />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => {
                  window.location.href = "/highlights";
                }}
                className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              >
                Watch Highlights
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <CountupMetricCard
                  icon={stat.icon}
                  value={stat?.value ?? ""}
                  countupSuffix={stat.suffix}
                  isCountUp={stat.isCountup}
                  description={stat.label}
                  isLoading={!metrics?.data}
                  key={index}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image with Overlay */}
                <div className="aspect-4/5 bg-linear-to-br from-gray-800 to-black relative">
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80"></div>

                  {/* Team Photo Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-64 h-64 mx-auto mb-6 rounded-full bg-linear-to-br from-red-600/20 to-yellow-500/20 border-4 border-white/10 flex items-center justify-center">
                        <div className="w-56 h-56 rounded-full bg-linear-to-br from-red-700 to-red-900 flex items-center justify-center">
                          <span className="text-6xl">⚽</span>
                        </div>
                      </div>
                      <div className="text-white font-bold text-2xl mb-2">
                        THE SQUAD {new Date().getFullYear()}
                      </div>
                      <div className="text-yellow-400 text-lg">
                        Champions in the Making
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 left-10 w-16 h-16 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-2xl"
                  >
                    <Trophy className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-linear-to-br from-red-600 to-red-700 flex items-center justify-center shadow-2xl"
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Floating Tagline Card */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-linear-to-r from-primary to-black p-6 rounded-2xl shadow-2xl border border-white/10 max-w-xs"
              >
                <div className="text-yellow-400 font-bold text-lg mb-2">
                  YOUR PASSION
                </div>
                <div className="text-white text-2xl font-black mb-2">
                  YOUR LEGACY
                </div>
                <div className="text-white/70 text-sm">
                  Be part of something greater. Join the Konjieh FC family
                  today.
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
