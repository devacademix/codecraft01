import { Trophy, Users, Crown, Medal, Target, Zap } from 'lucide-react';

const Leaderboard = () => {
  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/30 rounded-full blur-[128px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/10 to-amber-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30 mb-6">
            <Crown className="size-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Elite Rankings</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Our <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Top Coders</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The brightest minds of Codecraft Coding Club - coming soon after results!
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-500" />
            <div className="flex items-center gap-2 text-violet-400">
              <Trophy className="size-5" />
              <span className="font-semibold">Top 10 Rankers</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-500" />
          </div>

          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-violet-500/20 to-amber-500/20 rounded-full mb-6 border border-violet-500/30">
              <Target className="size-16 text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
              The leaderboard will be updated once the examination results are announced. Stay tuned!
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500/20 rounded-full border border-violet-500/30">
              <Zap className="size-5 text-violet-400 animate-pulse" />
              <span className="text-violet-300">Results announced soon</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group-hover:border-amber-500/30 transition-all">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-2xl">👑</span>
              </div>
              <div className="mt-6">
                <div className="text-6xl mb-4">🥇</div>
                <h3 className="text-lg font-bold text-white">Gold Medal</h3>
                <p className="text-amber-400 text-sm mt-1">Top Performer</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-slate-500 text-sm">Waiting for results...</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-300 to-slate-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group-hover:border-slate-400/30 transition-all">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🥈</span>
              </div>
              <div className="mt-6">
                <div className="text-6xl mb-4">🥈</div>
                <h3 className="text-lg font-bold text-white">Silver Medal</h3>
                <p className="text-slate-400 text-sm mt-1">Runner Up</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-slate-500 text-sm">Waiting for results...</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group-hover:border-orange-500/30 transition-all">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-2xl">🥉</span>
              </div>
              <div className="mt-6">
                <div className="text-6xl mb-4">🥉</div>
                <h3 className="text-lg font-bold text-white">Bronze Medal</h3>
                <p className="text-orange-400 text-sm mt-1">Third Place</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-slate-500 text-sm">Waiting for results...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-500">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-violet-400" />
            <span>All members ranked</span>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="size-4 text-amber-400" />
            <span>Top 10 displayed</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-orange-400" />
            <span>Weekly updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;