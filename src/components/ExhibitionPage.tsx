import { Search, Filter } from 'lucide-react';

interface ExhibitionPageProps {
  onNavigate: (page: string) => void;
}

export default function ExhibitionPage({ onNavigate }: ExhibitionPageProps) {
  const exhibits = [
    {
      id: 1,
      category: 'To a Lover',
      preview: 'I wonder if you still think of that night under the cherry blossoms. The way the petals fell like snow, and how we promised...',
      color: 'border-pink-500/50 hover:border-pink-500',
      bgColor: 'from-pink-500/5 to-rose-600/5'
    },
    {
      id: 2,
      category: 'To Past Self',
      preview: 'You were brave to leave. You were brave to stay. Both are true, and both versions of you deserved compassion...',
      color: 'border-cyan-500/50 hover:border-cyan-500',
      bgColor: 'from-cyan-500/5 to-blue-600/5'
    },
    {
      id: 3,
      category: 'To a Friend',
      preview: 'Distance doesn\'t erase the years we shared. It only makes them clearer, like how you can see stars better...',
      color: 'border-purple-500/50 hover:border-purple-500',
      bgColor: 'from-purple-500/5 to-violet-600/5'
    },
    {
      id: 4,
      category: 'To No One',
      preview: 'Some words exist just to be written, not to be sent. They are prayers to the universe, confessions to the void...',
      color: 'border-amber-500/50 hover:border-amber-500',
      bgColor: 'from-amber-500/5 to-orange-600/5'
    },
    {
      id: 5,
      category: 'To a Parent',
      preview: 'I understand now what you couldn\'t say then. The weight of providing, the fear of failing, the love that sometimes...',
      color: 'border-green-500/50 hover:border-green-500',
      bgColor: 'from-green-500/5 to-emerald-600/5'
    },
    {
      id: 6,
      category: 'To a Lover',
      preview: 'Closure doesn\'t always come from the other person. Sometimes it comes from finally accepting that you gave all you could...',
      color: 'border-pink-500/50 hover:border-pink-500',
      bgColor: 'from-pink-500/5 to-rose-600/5'
    },
    {
      id: 7,
      category: 'To Past Self',
      preview: 'The choices you made with the information you had were enough. You don\'t need to forgive yourself because...',
      color: 'border-cyan-500/50 hover:border-cyan-500',
      bgColor: 'from-cyan-500/5 to-blue-600/5'
    },
    {
      id: 8,
      category: 'To a Friend',
      preview: 'Growing apart doesn\'t diminish what we were. People change, seasons change, but the imprint you left remains...',
      color: 'border-purple-500/50 hover:border-purple-500',
      bgColor: 'from-purple-500/5 to-violet-600/5'
    }
  ];

  const categories = [
    { name: 'All Letters', count: 847 },
    { name: 'To a Lover', count: 234 },
    { name: 'To a Friend', count: 156 },
    { name: 'To Past Self', count: 198 },
    { name: 'To a Parent', count: 123 },
    { name: 'To No One', count: 136 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            The Exhibition Hall
          </h1>
          <p className="text-gray-400 text-lg">
            A collection of unsent letters, answered by AI
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 shrink-0">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Filter size={18} />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex justify-between items-center group"
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-gray-500 group-hover:text-cyan-400">{category.count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-700 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exhibits.map((exhibit) => (
                <button
                  key={exhibit.id}
                  onClick={() => onNavigate('detail')}
                  className={`group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 ${exhibit.color} transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${exhibit.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs text-gray-500">
                        Exhibit #{String(10000 + exhibit.id).padStart(5, '0')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs border border-current text-gray-400 group-hover:text-white transition-colors">
                        {exhibit.category}
                      </span>
                    </div>

                    <p className="text-gray-300 leading-relaxed line-clamp-4 group-hover:text-white transition-colors">
                      {exhibit.preview}
                    </p>

                    <div className="mt-4 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more →
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 border border-gray-700 text-gray-400 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                Load More Letters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
