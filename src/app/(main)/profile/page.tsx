"use client";

import {
  Users,
  MessageCircle,
  Edit,
  Share2,
  Heart,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-56 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full border-4 border-black bg-zinc-950/40 backdrop-blur-md" />
            <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-green-500 border-2 border-black" />
          </div>
        </div>
      </div>

      <div className="pt-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Emioluwa Gbajabiamila
            </h1>

            <p className="text-zinc-400">
              @emioluwa
            </p>

            <p className="mt-3 text-zinc-300 max-w-xl text-sm leading-relaxed">
              Building meaningful connections and creating a
              safe space where everyone belongs.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-white text-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition text-sm font-medium">
              <Edit size={18} />
              Edit Profile
            </button>

            <button className="border border-zinc-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-zinc-900 transition text-sm">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            ["Friends", "124"],
            ["Communities", "12"],
            ["Posts", "58"],
            ["Messages", "2.3K"],
          ].map(([title, value]) => (
            <div
              key={title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <h3 className="text-zinc-400 text-sm">
                {title}
              </h3>

              <p className="text-2xl font-bold mt-2">
                {value}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3">
            About
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Software engineer, community builder and
            believer in authentic conversations.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Recent Photos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-zinc-800/10 opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Communities
          </h2>

          <div className="space-y-3">
            {["Tech Hub", "Safe Space", "Music Lovers"].map(
              (community) => (
                <div
                  key={community}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <Users size={18} className="text-zinc-500" />
                  <span>{community}</span>
                </div>
              )
            )}
          </div>
        </section>

        <section className="mt-8 pb-12">
          <h2 className="text-xl font-semibold mb-4">
            Recent Posts
          </h2>

          <div className="space-y-4">
            {[1, 2].map((post) => (
              <div
                key={post}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
              >
                <p className="text-sm leading-relaxed text-zinc-200">
                  Today was a good day. Grateful for the
                  people around me ❤️
                </p>

                <div className="flex gap-6 mt-4 text-zinc-400 text-xs">
                  <span className="flex items-center gap-2 cursor-pointer hover:text-red-400 transition">
                    <Heart size={16} /> 32
                  </span>

                  <span className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
                    <MessageCircle size={16} /> 8
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
