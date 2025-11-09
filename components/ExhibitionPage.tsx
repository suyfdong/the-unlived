'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Pin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase, LetterPublic } from '@/lib/supabase';
import AdSenseAd from './AdSenseAd';
import Footer from './Footer';

// 为每张卡片生成随机的视觉属性(基于id保持一致性)
const getCardStyle = (id: string) => {
  // 使用id的哈希值作为随机种子,确保每次渲染相同
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return min + ((x - Math.floor(x)) * (max - min));
  };

  const rotation = random(-8, 8); // 增大倾斜角度 - 咖啡馆展板随意感
  const scale = random(0.90, 1.10); // 增大大小变化 - 更自然
  const zOffset = Math.floor(random(0, 8, 100)); // 增大z-index - 更多叠加

  return {
    rotation,
    scale,
    zOffset,
  };
};

// 信纸样式类型 - 不同的纸张质感
const getPaperStyle = (id: string) => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const styleIndex = seed % 6; // 6种不同的纸张样式

  const styles = [
    // 1. 经典便签纸 (默认)
    {
      type: 'sticky-note',
      texture: 'opacity-50',
      shadow: 'shadow-xl',
      border: 'border-2',
    },
    // 2. 明信片风格 (带边框装饰)
    {
      type: 'postcard',
      texture: 'opacity-40',
      shadow: 'shadow-2xl',
      border: 'border-4 border-double',
    },
    // 3. 撕边纸张
    {
      type: 'torn-paper',
      texture: 'opacity-40',
      shadow: 'shadow-lg',
      border: 'border-0',
      extraClass: 'relative overflow-visible',
    },
    // 4. 牛皮纸风格
    {
      type: 'kraft-paper',
      texture: 'opacity-60',
      shadow: 'shadow-2xl',
      border: 'border-2',
    },
    // 5. 横线笔记纸
    {
      type: 'lined-paper',
      texture: 'opacity-0',
      shadow: 'shadow-xl',
      border: 'border',
      hasLines: true,
    },
    // 6. 半透明描图纸
    {
      type: 'tracing-paper',
      texture: 'opacity-25',
      shadow: 'shadow-lg',
      border: 'border-2',
      extraClass: 'backdrop-blur-sm',
    },
  ];

  return styles[styleIndex];
};

// 便签纸颜色方案 - 根据信纸样式和收件人类型
const getPaperColor = (recipientType: string, paperType: string) => {
  // 牛皮纸风格 - 温和的米棕色
  if (paperType === 'kraft-paper') {
    return {
      bg: 'bg-gradient-to-br from-stone-200 to-amber-200',
      border: 'border-stone-400/70',
      shadow: 'shadow-stone-400/40',
      pin: 'text-amber-600',
    };
  }

  // 半透明描图纸 - 明显的灰蓝色
  if (paperType === 'tracing-paper') {
    return {
      bg: 'bg-gradient-to-br from-slate-200/90 to-blue-100/90',
      border: 'border-slate-500/70',
      shadow: 'shadow-slate-500/40',
      pin: 'text-blue-500',
    };
  }

  // 横线笔记纸 - 柔和米色
  if (paperType === 'lined-paper') {
    return {
      bg: 'bg-gradient-to-br from-stone-100 to-yellow-50',
      border: 'border-slate-400/70',
      shadow: 'shadow-slate-400/40',
      pin: 'text-indigo-500',
    };
  }

  // 明信片风格 - 米白偏奶油色
  if (paperType === 'postcard') {
    return {
      bg: 'bg-gradient-to-br from-orange-50 to-stone-100',
      border: 'border-orange-300/70',
      shadow: 'shadow-orange-300/40',
      pin: 'text-orange-600',
    };
  }

  // 撕边纸张 - 纯白色
  if (paperType === 'torn-paper') {
    return {
      bg: 'bg-gradient-to-br from-white to-slate-50',
      border: 'border-slate-400/60',
      shadow: 'shadow-slate-400/40',
      pin: 'text-teal-500',
    };
  }

  // 其他纸张根据收件人类型使用不同颜色
  const colors: { [key: string]: { bg: string; border: string; shadow: string; pin: string } } = {
    'lover': {
      bg: 'bg-gradient-to-br from-rose-50 to-pink-100/80',
      border: 'border-rose-200/50',
      shadow: 'shadow-rose-200/20',
      pin: 'text-rose-500',
    },
    'past-self': {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-100/80',
      border: 'border-blue-200/50',
      shadow: 'shadow-blue-200/20',
      pin: 'text-cyan-500',
    },
    'friend': {
      bg: 'bg-gradient-to-br from-purple-50 to-violet-100/80',
      border: 'border-purple-200/50',
      shadow: 'shadow-purple-200/20',
      pin: 'text-purple-500',
    },
    'no-one': {
      bg: 'bg-gradient-to-br from-stone-50 to-slate-100/80',
      border: 'border-stone-200/50',
      shadow: 'shadow-stone-200/20',
      pin: 'text-slate-600',
    },
    'parent': {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-100/80',
      border: 'border-green-200/50',
      shadow: 'shadow-green-200/20',
      pin: 'text-emerald-600',
    },
  };
  return colors[recipientType] || colors['no-one'];
};

// 格式化收件人类型
const formatRecipientType = (type: string) => {
  const formats: { [key: string]: string } = {
    'lover': 'To a Lover',
    'friend': 'To a Friend',
    'parent': 'To a Parent',
    'past-self': 'To Past Self',
    'no-one': 'To No One',
  };
  return formats[type] || type;
};

export default function ExhibitionPage() {
  const [exhibits, setExhibits] = useState<LetterPublic[]>([]);
  const [filteredExhibits, setFilteredExhibits] = useState<LetterPublic[]>([]);
  const [displayedExhibits, setDisplayedExhibits] = useState<LetterPublic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 24; // 每页显示24个

  useEffect(() => {
    setIsMounted(true);
    // 页面加载时强制滚动到顶部
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadExhibits();
  }, []);

  useEffect(() => {
    filterExhibits();
  }, [selectedCategory, searchQuery, exhibits]);

  useEffect(() => {
    updateDisplayedExhibits();
  }, [filteredExhibits, page]);

  const loadExhibits = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('letters_public')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200); // 加载更多数据到本地

    if (error) {
      console.error('Error loading exhibits:', error);
    } else {
      setExhibits(data || []);
    }
    setIsLoading(false);
  };

  const filterExhibits = () => {
    let filtered = exhibits;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.recipient_type === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(e =>
        e.ai_reply.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExhibits(filtered);
    setPage(1); // 重置分页
  };

  const updateDisplayedExhibits = () => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    const displayed = filteredExhibits.slice(startIndex, endIndex);
    setDisplayedExhibits(displayed);
    setHasMore(endIndex < filteredExhibits.length);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const categories = [
    { id: 'all', label: 'All Letters' },
    { id: 'lover', label: 'Lovers' },
    { id: 'friend', label: 'Friends' },
    { id: 'past-self', label: 'Past Self' },
    { id: 'parent', label: 'Parents' },
    { id: 'no-one', label: 'No One' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 pt-40 md:pt-24 pb-12">
        {/* 标题区域 */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-amber-100 mb-3">
            Exhibition Wall
          </h1>
          <p className="text-slate-400 text-lg">
            A collection of unspoken words, now echoing
          </p>
        </motion.div>

        {/* 搜索和筛选 */}
        <div className="mb-12 space-y-6">
          {/* 搜索框 */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search through the letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* 分类标签 */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Filter size={18} className="text-slate-500" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-900 font-medium'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-slate-500 mt-4">Loading memories...</p>
          </div>
        )}

        {/* 展览墙 - 瀑布流布局 - 咖啡馆展板风格 */}
        {!isLoading && displayedExhibits.length > 0 && (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {displayedExhibits.map((exhibit, index) => {
              const cardStyle = getCardStyle(exhibit.id);
              const paperStyle = getPaperStyle(exhibit.id);
              const paperColor = getPaperColor(exhibit.recipient_type, paperStyle.type);

              return (
                <motion.div
                  key={exhibit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: isMounted ? cardStyle.rotation : 0,
                    scale: isMounted ? cardStyle.scale : 1,
                  }}
                  transition={{
                    delay: Math.min(index * 0.01, 0.2), // 减少延迟
                    duration: 0.2, // 缩短动画时长
                  }}
                  className="break-inside-avoid mb-4"
                  style={{
                    zIndex: isMounted ? cardStyle.zOffset : 0,
                  }}
                >
                  <Link href={`/letters/${exhibit.id}`}>
                    <motion.div
                      className={`relative ${paperColor.bg} ${paperColor.border} ${paperStyle.border} ${paperStyle.type === 'torn-paper' ? '' : 'rounded-lg'} p-4 md:p-6 ${paperStyle.shadow} ${paperColor.shadow} cursor-pointer ${paperStyle.extraClass || ''}`}
                      whileHover={{
                        scale: 1.05,
                        rotate: isMounted ? cardStyle.rotation * 0.5 : 0,
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      {/* 图钉效果 */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Pin
                          size={24}
                          className={`${paperColor.pin} drop-shadow-md`}
                          style={{ transform: 'rotate(45deg)' }}
                        />
                      </div>

                      {/* 展览编号 - 手写风格 */}
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <span className="text-xs text-slate-600 font-mono opacity-60">
                          #{exhibit.exhibit_number}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-white/50 text-slate-700`}>
                          {formatRecipientType(exhibit.recipient_type)}
                        </span>
                      </div>

                      {/* 横线笔记纸背景 - 简化 */}
                      {paperStyle.hasLines && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-red-300/40" />
                        </div>
                      )}

                      {/* 明信片装饰边框 - 简化 */}
                      {paperStyle.type === 'postcard' && (
                        <div className="absolute inset-4 pointer-events-none border border-dashed border-orange-400/30 rounded-md" />
                      )}

                      {/* 信件内容 - 移动端显示更少 */}
                      <div className="relative">
                        <p className="text-slate-700 text-sm leading-relaxed line-clamp-4 md:line-clamp-6 lg:line-clamp-8 whitespace-pre-wrap font-light">
                          {exhibit.ai_reply}
                        </p>

                        {/* 渐变遮罩 */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                      </div>

                      {/* 底部信息 */}
                      <div className="mt-4 pt-3 border-t border-slate-300/30 flex items-center justify-between text-xs text-slate-500">
                        <span>{exhibit.views || 0} views</span>
                        <span className="italic">Read more →</span>
                      </div>

                      {/* 纸张纹理效果 - 简化版 */}
                      <div className={`absolute inset-0 pointer-events-none ${paperStyle.texture} bg-slate-900/5 rounded-lg`} />

                      {/* 牛皮纸额外纹理 - 简化版 */}
                      {paperStyle.type === 'kraft-paper' && (
                        <>
                          <div className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-br from-stone-800/20 to-amber-900/20 rounded-lg" />
                          <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-r from-stone-900/10 via-transparent to-stone-900/10 rounded-lg" />
                        </>
                      )}

                      {/* 撕边效果 - 简化版 */}
                      {paperStyle.type === 'torn-paper' && (
                        <>
                          <div className="absolute -top-1 left-0 right-0 h-3 bg-white/80 blur-sm" />
                          <div className="absolute -bottom-1 left-0 right-0 h-3 bg-white/80 blur-sm" />
                        </>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* AdSense Ad - Before Load More */}
          {hasMore && (
            <div className="max-w-4xl mx-auto mt-12">
              <AdSenseAd
                adSlot="6413632624"
                adFormat="auto"
                fullWidthResponsive={true}
              />
            </div>
          )}

          {/* Load More 按钮 */}
          {hasMore && (
            <div className="text-center mt-8 mb-8">
              <motion.button
                onClick={loadMore}
                className="px-8 py-3 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500/50 text-amber-100 rounded-full font-medium transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More Letters
                <span className="ml-2 text-sm text-amber-300/70">
                  ({displayedExhibits.length} / {filteredExhibits.length})
                </span>
              </motion.button>
            </div>
          )}

        </>
        )}

        {/* 空状态 */}
        {!isLoading && filteredExhibits.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl text-slate-400 mb-2">No letters found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
