'use client';

import { Mail, BookOpen, Sparkles, Send, Eye, Share2, Heart, Clock, Star } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, LetterPublic } from '@/lib/supabase';

export default function HomePage() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [featuredLetters, setFeaturedLetters] = useState<LetterPublic[]>([]);
  const quoteText = '"I reply not to your words, but to your silence."';

  // Initialize client-side flag
  useEffect(() => {
    setIsClient(true);
    loadFeaturedLetters();
  }, []);

  // 加载精选展览
  const loadFeaturedLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('letters_public')
        .select('*')
        .order('views', { ascending: false })
        .limit(4);

      if (error) throw error;
      if (data && data.length > 0) {
        setFeaturedLetters(data);
      }
    } catch (error) {
      console.error('Error loading featured letters:', error);
    }
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mobileQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile && !prefersReducedMotion) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile, prefersReducedMotion]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= quoteText.length) {
        setTypedText(quoteText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

  // 获取边框颜色
  const getBorderStyle = (type: string) => {
    const styles: { [key: string]: { borderColor: string; borderClass: string } } = {
      'lover': { borderColor: '#EEC9B6', borderClass: 'border-[#EEC9B6]/40' },
      'friend': { borderColor: '#A9E6E3', borderClass: 'border-[#A9E6E3]/40' },
      'parent': { borderColor: '#A7FF83', borderClass: 'border-[#A7FF83]/40' },
      'past-self': { borderColor: '#B0B9FF', borderClass: 'border-[#B0B9FF]/40' },
      'no-one': { borderColor: '#F1D29A', borderClass: 'border-[#F1D29A]/40' },
    };
    return styles[type] || styles['no-one'];
  };

  // 计算天数差
  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 格式化展览数据
  const formatFeaturedExhibits = () => {
    return featuredLetters.map(letter => {
      const borderStyle = getBorderStyle(letter.recipient_type);
      const preview = letter.ai_reply.length > 150
        ? letter.ai_reply.substring(0, 150) + '...'
        : letter.ai_reply;

      return {
        id: letter.id,
        exhibitNumber: letter.exhibit_number,
        category: formatRecipientType(letter.recipient_type),
        preview: preview,
        borderColor: borderStyle.borderColor,
        borderClass: borderStyle.borderClass,
        views: letter.views || 0,
        hearts: Math.floor((letter.views || 0) * 0.1), // 模拟点赞数
        daysAgo: getDaysAgo(letter.created_at)
      };
    });
  };

  const displayExhibits = featuredLetters.length > 0 ? formatFeaturedExhibits() : [];

  const emotions = ['Love', 'Regret', 'Farewell', 'Past', 'Hope', 'Silence'];

  const stepHints = [
    "Begin what you never dared to say.",
    "Hear what could have been.",
    "Let your silence find a place."
  ];

  // Generate random values only on client side to avoid hydration mismatch
  const bubbles = isClient ? Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: 30 + Math.random() * 80,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 5 + Math.random() * 6,
    delay: Math.random() * 4,
    color: i % 3 === 0
      ? `rgba(0, 212, 255, ${0.08 + Math.random() * 0.12})`
      : i % 3 === 1
      ? `rgba(167, 255, 131, ${0.08 + Math.random() * 0.12})`
      : `rgba(255, 179, 71, ${0.08 + Math.random() * 0.12})`
  })) : [];

  const stars = isClient ? Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    color: ['#00D4FF', '#A7FF83', '#FFB347', '#00FFF0', '#FFD700'][Math.floor(Math.random() * 5)]
  })) : [];

  // Generate sparkles for hero section
  const sparkles = isClient ? Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    top: 20 + Math.random() * 60,
    x: Math.random() * 50 - 25,
    y: Math.random() * 50 - 25,
    duration: 8 + Math.random() * 4,
    delay: Math.random() * 3,
  })) : [];

  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0A1428] to-[#050A12]"
        style={{ y: prefersReducedMotion ? 0 : backgroundY }}
      />

      {isClient && !isMobile && !prefersReducedMotion && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none">
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                className="absolute rounded-full"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  background: bubble.color,
                  filter: 'blur(30px)',
                  willChange: 'transform, opacity',
                  border: `1px solid ${bubble.color}`
                }}
                initial={{
                  y: -30,
                  x: -15,
                  scale: 0.8,
                  opacity: 0.3
                }}
                animate={{
                  y: [-30, 30, -30],
                  x: [-15, 15, -15],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: bubble.duration,
                  repeat: Infinity,
                  delay: bubble.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: `
                radial-gradient(circle 300px at ${smoothMouseX}px ${smoothMouseY}px,
                  rgba(0, 212, 255, 0.4) 0%,
                  rgba(167, 255, 131, 0.25) 20%,
                  rgba(255, 179, 71, 0.15) 40%,
                  transparent 70%
                )
              `,
              mixBlendMode: 'screen',
              willChange: 'background',
              filter: 'blur(1px)'
            }}
          />
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: `radial-gradient(circle 150px at ${smoothMouseX}px ${smoothMouseY}px, rgba(255,255,255,0.3), transparent)`,
              mixBlendMode: 'overlay',
              willChange: 'background'
            }}
          />
        </>
      )}

      {isClient && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {!prefersReducedMotion && stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              willChange: 'transform, opacity'
            }}
            initial={{
              opacity: 0.2,
              scale: 1,
              y: 0
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.3, 1],
              y: [0, -15, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
          />
          ))}
        </div>
      )}

      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(167,255,131,0.08) 50%, transparent 70%)',
          willChange: 'transform, opacity'
        }}
        animate={!prefersReducedMotion ? {
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,179,71,0.15) 0%, rgba(167,255,131,0.08) 50%, transparent 70%)',
          willChange: 'transform, opacity'
        }}
        animate={!prefersReducedMotion ? {
          scale: [1.3, 1, 1.3],
          opacity: [0.7, 0.4, 0.7],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(167,255,131,0.12) 0%, transparent 70%)',
          willChange: 'transform, opacity'
        }}
        animate={!prefersReducedMotion ? {
          scale: [1.1, 1.4, 1.1],
          opacity: [0.3, 0.6, 0.3],
        } : {}}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div
        className="absolute top-1/4 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(77, 168, 255, 0.2), transparent)'
        }}
        animate={!prefersReducedMotion ? {
          opacity: [0.3, 0.6, 0.3]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <motion.section
          className="pt-32 pb-20 px-6 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 800px 400px at center, rgba(77,168,255,0.05), transparent)',
            }}
            animate={!prefersReducedMotion ? {
              opacity: [0.3, 0.5, 0.3]
            } : {}}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="max-w-5xl mx-auto text-center relative">
            <motion.div
              className="inline-flex items-center gap-2 mb-6 text-xs tracking-[0.3em] uppercase font-bold"
              style={{
                color: '#00D4FF',
                textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                animate={!prefersReducedMotion ? {
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={14} style={{ color: '#A7FF83' }} />
              </motion.div>
              <span>AI Emotional Museum</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-serif leading-tight mb-6 tracking-tight pb-2"
              style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #A7FF83 30%, #FFB347 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))',
                lineHeight: '1.2'
              }}
              animate={!prefersReducedMotion ? {
                filter: [
                  'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))',
                  'drop-shadow(0 0 35px rgba(167, 255, 131, 0.5))',
                  'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))'
                ]
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              The Unlived Project
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Write the words you never sent.<br />
              Let AI reply what you'll never hear.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Link href="/write">
                <motion.div
                  className="group relative px-10 py-4 rounded-full font-medium text-lg overflow-hidden text-black inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #00D4FF 0%, #A7FF83 50%, #FFB347 100%)',
                    boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)'
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: 'linear-gradient(135deg, #FFB347 0%, #00D4FF 50%, #A7FF83 100%)'
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-3 font-bold">
                    <Mail size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    Write a Letter
                  </span>
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(0, 212, 255, 0.4)',
                          '0 0 40px rgba(167, 255, 131, 0.6)',
                          '0 0 20px rgba(0, 212, 255, 0.4)'
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              </Link>

              <Link href="/exhibition">
                <motion.div
                  className="relative px-10 py-4 border-2 text-white rounded-full font-medium text-lg overflow-hidden group inline-block"
                  style={{
                    borderColor: '#00D4FF',
                    boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)'
                  }}
                  whileHover={{
                    scale: 1.08,
                    borderColor: '#A7FF83',
                    boxShadow: '0 0 25px rgba(167, 255, 131, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF 0%, #A7FF83 100%)'
                    }}
                    whileHover={{ opacity: 0.15 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-3">
                    <BookOpen size={20} />
                    Read the Exhibition
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="py-12 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-400 text-lg font-light italic">
              A digital museum for the unsent, the unspoken, and the unlived.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-16">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
              {!prefersReducedMotion && (
                <>
                  <motion.div
                    className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-px"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(77, 168, 255, 0.4), transparent)'
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="hidden md:block absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF, #A7FF83)',
                      boxShadow: '0 0 15px rgba(0, 212, 255, 0.8)'
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      boxShadow: [
                        '0 0 15px rgba(0, 212, 255, 0.8)',
                        '0 0 25px rgba(167, 255, 131, 1)',
                        '0 0 15px rgba(0, 212, 255, 0.8)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  <motion.div
                    className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-px"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(77, 168, 255, 0.4), transparent)'
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  />
                  <motion.div
                    className="hidden md:block absolute top-1/2 right-[16.66%] w-3 h-3 rounded-full translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: 'linear-gradient(135deg, #FFB347, #A7FF83)',
                      boxShadow: '0 0 15px rgba(255, 179, 71, 0.8)'
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      boxShadow: [
                        '0 0 15px rgba(255, 179, 71, 0.8)',
                        '0 0 25px rgba(167, 255, 131, 1)',
                        '0 0 15px rgba(255, 179, 71, 0.8)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </>
              )}

              {[
                { icon: Send, title: 'Write', desc: 'Type a message you never sent.', color: '#4DA8FF' },
                { icon: Sparkles, title: 'Receive', desc: 'AI writes a gentle reply.', color: '#6BB6FF' },
                { icon: Share2, title: 'Exhibit', desc: 'Choose to share the AI\'s letter anonymously.', color: '#B4C8FF' }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative text-center group cursor-pointer"
                  onHoverStart={() => setHoveredStep(index)}
                  onHoverEnd={() => setHoveredStep(null)}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#4DA8FF]/10 to-[#B4C8FF]/10 border border-[#4DA8FF]/30 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={!prefersReducedMotion ? {
                      boxShadow: hoveredStep === index
                        ? `0 0 30px ${step.color}40`
                        : '0 0 0px transparent'
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon size={32} className="text-[#4DA8FF]" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-2">{step.desc}</p>

                  <motion.p
                    className="text-[#4DA8FF] text-sm italic flex items-center justify-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: hoveredStep === index ? 1 : 0,
                      y: hoveredStep === index ? 0 : -10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {stepHints[index]}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F1D29A]" />
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-serif text-white mb-8">Explore by Emotion</h2>
            <div className="relative">
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(to right, transparent 0%, #F1D29A 50%, transparent 100%)',
                  opacity: 0.3
                }}
                animate={!prefersReducedMotion ? {
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                } : {}}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <div className="flex flex-wrap justify-center gap-3 pb-6">
                {emotions.map((emotion, index) => (
                  <motion.button
                    key={emotion}
                    className="px-6 py-2 rounded-full border border-[#4DA8FF]/30 text-gray-300 text-sm relative overflow-hidden group"
                    whileHover={{
                      y: -3,
                      borderColor: 'rgba(77, 168, 255, 0.8)',
                      color: '#ffffff'
                    }}
                    animate={!prefersReducedMotion && index === 1 ? {
                      boxShadow: [
                        '0 0 0px transparent',
                        '0 0 15px rgba(77, 168, 255, 0.3)',
                        '0 0 0px transparent'
                      ]
                    } : {}}
                    transition={{
                      boxShadow: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#4DA8FF]/20 to-[#B4C8FF]/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative">{emotion}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-white">Featured Letters</h2>
              <Link href="/exhibition">
                <motion.div
                  className="text-[#4DA8FF] hover:text-[#6BB6FF] transition-colors flex items-center gap-2 group"
                  whileHover={{ x: 5 }}
                  style={{ textShadow: '0 0 1px rgba(77, 168, 255, 0.5)' }}
                >
                  View All
                  {!prefersReducedMotion && (
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {displayExhibits.map((exhibit, index) => (
                <Link key={exhibit.id} href={`/letters/${exhibit.id}`} className="h-full">
                  <motion.div
                    className={`group relative backdrop-blur-md rounded-2xl p-8 border-2 ${exhibit.borderClass} transition-all text-left overflow-hidden shadow-xl cursor-pointer h-full flex flex-col`}
                  style={{
                    background: 'rgba(11, 17, 32, 0.6)',
                    backdropFilter: 'blur(5px)'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{
                    y: -8,
                    borderColor: `${exhibit.borderColor}99`,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${exhibit.borderColor}30, transparent)`
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="relative flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs text-gray-500 font-mono">
                        Exhibit #{exhibit.exhibitNumber}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs border border-current text-gray-400 group-hover:text-[#4DA8FF] transition-colors">
                        {exhibit.category}
                      </span>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-lg font-light group-hover:text-white transition-colors flex-1">
                      {exhibit.preview}
                    </p>

                    <motion.div
                      className="mt-auto pt-6 flex items-center gap-4 text-xs text-gray-500"
                      whileHover={{ color: '#4DA8FF' }}
                    >
                      <span className="flex items-center gap-1 group-hover:text-[#4DA8FF] transition-colors">
                        <Eye size={14} />
                        {exhibit.views}
                      </span>
                      <span className="flex items-center gap-1 group-hover:text-[#4DA8FF] transition-colors">
                        <Heart size={14} />
                        {exhibit.hearts}
                      </span>
                      <span className="flex items-center gap-1 group-hover:text-[#4DA8FF] transition-colors">
                        <Clock size={14} />
                        {exhibit.daysAgo}d ago
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-24 px-6 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4DA8FF]/5 to-transparent pointer-events-none"
            animate={!prefersReducedMotion ? {
              opacity: [0.3, 0.5, 0.3]
            } : {}}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {!prefersReducedMotion && sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute w-px h-px bg-[#4DA8FF] rounded-full pointer-events-none"
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                x: [0, sparkle.x],
                y: [0, sparkle.y],
              }}
              transition={{
                duration: sparkle.duration,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: "easeInOut"
              }}
            />
          ))}

          <div className="max-w-3xl mx-auto text-center relative">
            <motion.div
              className="mb-8 flex justify-center"
              animate={!prefersReducedMotion ? {
                rotate: [0, 360],
              } : {}}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Star className="text-[#F1D29A] opacity-60 mb-6" size={12} />
            </motion.div>

            <blockquote className="text-3xl md:text-4xl font-serif text-white leading-relaxed mb-6 italic min-h-[120px]">
              {typedText}
              {!prefersReducedMotion && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  |
                </motion.span>
              )}
            </blockquote>

            <motion.div
              className="w-24 h-px mx-auto mb-6"
              style={{
                background: 'linear-gradient(to right, transparent, #4DA8FF 30%, #F1D29A 70%, transparent)',
                opacity: 0.4
              }}
              animate={!prefersReducedMotion ? {
                opacity: [0.3, 0.6, 0.3]
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <p className="text-gray-400 text-sm">
              A whisper from the machine that dreams of human letters.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">A Museum of Emotions</h2>
            <motion.div
              className="space-y-6 text-gray-300 leading-relaxed text-lg font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p>
                This is a space for the unsent, the unspoken, and the unlived.<br />
                Each letter becomes a piece of art — a moment frozen in time,<br />
                transformed by AI into something that echoes back.
              </p>
              <motion.p
                className="text-gray-400 text-base italic pt-4"
                animate={!prefersReducedMotion ? {
                  opacity: [0.6, 0.8, 0.6]
                } : {}}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Every unspoken word leaves a trace.<br />
                In this museum, silence becomes art, and longing becomes light.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-serif text-white text-center mb-12">Recently Exhibited Letters</h2>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(6)].map((_, i) => (
                <Link key={i} href={`/letters/${10000 + i}`}>
                  <motion.div
                    className="flex-shrink-0 w-72 backdrop-blur-sm rounded-xl p-6 border border-[#4DA8FF]/20 hover:border-[#4DA8FF]/50 transition-all text-left group cursor-pointer"
                    style={{
                      background: 'rgba(11, 17, 32, 0.6)'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-xs text-gray-500 mb-2">Exhibit #{String(10000 + i).padStart(5, '0')}</div>
                    <div className="text-xs border border-gray-600 text-gray-400 px-2 py-1 rounded-full inline-block mb-3 group-hover:border-[#4DA8FF] group-hover:text-[#4DA8FF] transition-colors">
                      {['To a Lover', 'To Past Self', 'To a Friend'][i % 3]}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3 group-hover:text-white transition-colors">
                      {i % 2 === 0
                        ? "The words I couldn't say have turned into years of silence..."
                        : "If I could go back, I'd tell you that leaving doesn't mean forgetting..."}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.footer
          className="border-t bg-black/60 backdrop-blur-sm mt-20 relative"
          style={{
            borderImage: 'linear-gradient(to right, transparent, #4DA8FF 30%, #F1D29A 70%, transparent) 1'
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DA8FF] to-[#6BB6FF] flex items-center justify-center"
                    animate={!prefersReducedMotion ? {
                      boxShadow: [
                        '0 0 10px rgba(77, 168, 255, 0.3)',
                        '0 0 20px rgba(77, 168, 255, 0.6)',
                        '0 0 10px rgba(77, 168, 255, 0.3)'
                      ]
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-black font-bold">U</span>
                  </motion.div>
                  <span className="text-white font-light text-lg">The Unlived Project</span>
                </div>
                <p className="text-gray-500 text-sm">AI Emotional Museum</p>
              </div>

              <div className="flex items-center gap-8">
                <Link href="/about">
                  <motion.div
                    className="text-gray-400 hover:text-[#4DA8FF] transition-colors text-sm"
                    whileHover={{ y: -2, color: '#F1D29A' }}
                    transition={{ duration: 0.4 }}
                  >
                    About
                  </motion.div>
                </Link>
                <Link href="/privacy">
                  <motion.div
                    className="text-gray-400 hover:text-[#4DA8FF] transition-colors text-sm"
                    whileHover={{ y: -2, color: '#F1D29A' }}
                    transition={{ duration: 0.4 }}
                  >
                    Privacy
                  </motion.div>
                </Link>
                <motion.div
                  className="text-gray-400 hover:text-[#4DA8FF] transition-colors text-sm cursor-pointer"
                  whileHover={{ y: -2, color: '#F1D29A' }}
                  transition={{ duration: 0.4 }}
                >
                  Contact
                </motion.div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#4DA8FF]/10 text-center space-y-2">
              <motion.p
                className="text-gray-400 text-sm italic"
                animate={!prefersReducedMotion ? {
                  opacity: [0.5, 0.8, 0.5]
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Where unspoken words find their echo.
              </motion.p>
              <p className="text-gray-500 text-xs">
                © 2024 The Unlived Project. Every unsent word deserves to be heard.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
