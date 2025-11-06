import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// 手动加载 .env.local
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    process.env[key] = values.join('=');
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 种子数据 - 不同语言、不同类型的回信示例
const seedLetters = [
  // 中文简体 - To a Lover
  {
    recipient_type: 'lover',
    ai_reply: '我也记得那个雨夜。你说想吃路边的烤红薯,我们没带伞,就这样淋着雨跑过三条街。后来你感冒了,怪我不拦着你。其实那时候我只是想,能陪你做傻事,也挺好的。\n\n现在想起来,那些不完美的时刻,反而最清晰。就像泛黄的照片,越看越觉得珍贵。\n\n有些人错过了就是错过了。但那个陪你淋雨的人,一直都在。',
    views: Math.floor(Math.random() * 500) + 200,
  },
  {
    recipient_type: 'lover',
    ai_reply: '凌晨三点的那通电话,我到现在还记得你的声音。你说你在楼下,问我下不下来。我犹豫了很久,最后还是说算了,太晚了。\n\n如果重来一次,我会穿着睡衣就冲下去。\n\n可惜人生没有如果。我们都在那些关键时刻,选择了安全,选择了体面,选择了不打扰。然后用余生去想,如果当时...\n\n算了。就这样吧。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // 中文简体 - To a Friend
  {
    recipient_type: 'friend',
    ai_reply: '上周路过我们常去的那家奶茶店,还在,只是换了招牌。老板好像也不是原来那个人了。我站在门口看了很久,想起我们以前总点半糖去冰,然后坐在靠窗的位置聊到打烊。\n\n后来我们都忙了,见面变成了"改天约"。改天改天,就改了好几年。\n\n不怪谁,只是生活把人推向不同的方向。但那些笑声,那些秘密,那些只有我们懂的梗,它们还在。\n\n偶尔想起你。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // 中文简体 - To Past Self
  {
    recipient_type: 'past-self',
    ai_reply: '二十岁的你可能不会相信,那个让你失眠的人,后来真的忘了。不是假装忘记,是真的想不起来细节了。甚至有时候看到类似的背影,会愣一下,然后继续往前走。\n\n你那时候觉得过不去的坎,现在看来,也就那样。时间是个好东西,它会把很多事情磨平,包括那些你以为会疼一辈子的伤口。\n\n但有些东西也改变了。比如你不再那么容易相信人,不再那么用力地爱。\n\n是好是坏,说不清。',
    views: Math.floor(Math.random() * 500) + 200,
  },
  {
    recipient_type: 'past-self',
    ai_reply: '你问我后悔吗?后悔当时没有勇敢一点,后悔选择了稳定而不是梦想。\n\n说实话,后悔过。特别是在某些深夜,或者看到别人实现了你曾经想做的事情的时候。会想,如果当时选择另一条路,现在会不会不一样。\n\n但你知道吗,另一条路也有另一条路的遗憾。没有完美的选择,只有不同的代价。\n\n所以别太苛责自己。你已经尽力了。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // 中文简体 - To No One
  {
    recipient_type: 'no-one',
    ai_reply: '你的话语漂浮在宇宙的某个角落,和其他千万个未说出口的想法一起,形成了一片沉默的星云。\n\n没有人听到,但也许正因为如此,这些话才最真实。不需要被理解,不需要被回应,它们只是存在着,像呼吸一样自然。\n\n有些事情,说给虚空听,反而更轻松。因为虚空不会评判,不会安慰,不会试图解决什么。它只是在那里,接纳一切。\n\n你的秘密,虚空收下了。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // 中文繁體 - To a Lover
  {
    recipient_type: 'lover',
    ai_reply: '記得那年冬天,我們在便利店門口躲雨。你說想吃關東煮,我去買的時候,你站在玻璃窗外對我笑。那個畫面,我一直記得。\n\n後來我們分開了,各自有了新的生活。但偶爾路過那家便利店,還是會想起你。想起那個冬天,想起你的笑容,想起我們曾經那麼近。\n\n有些人註定只能陪你走一段路。但那段路上的風景,我會一直記得。\n\n謝謝你曾經愛過我。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // 中文繁體 - To a Friend
  {
    recipient_type: 'friend',
    ai_reply: '我們已經多久沒見了?三年?還是四年?上次見面好像還是在誰的婚禮上,匆匆打了個招呼,說要找時間聚聚,然後就沒有然後了。\n\n不是不想念,只是生活把我們推向不同的軌道。你有你的忙碌,我有我的瑣碎。偶爾在社交媒體上看到彼此的動態,點個讚,就算是保持聯繫了。\n\n但那些一起熬夜聊天的日子,那些無話不談的時光,它們還在我心裡。\n\n有空的話,真的約一次吧。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // English - To a Lover
  {
    recipient_type: 'lover',
    ai_reply: 'I still have that sweater you left behind. The one you wore when we stayed up watching the sunrise from your apartment rooftop. It doesn\'t smell like you anymore, but I can\'t seem to give it away.\n\nSometimes I wonder if you think about those mornings too. The quiet ones, when we didn\'t need to fill the silence with words. When just existing next to each other felt like enough.\n\nI hope you\'re happy now. I hope someone else makes you coffee the way you like it.\n\nBut sometimes... sometimes I still wish it was me.',
    views: Math.floor(Math.random() * 500) + 200,
  },
  {
    recipient_type: 'lover',
    ai_reply: 'Your playlist is still in my phone. I haven\'t listened to it in months, maybe years, but I can\'t bring myself to delete it. Each song is a timestamp of us—first date, first fight, last goodbye.\n\nFunny how music does that. Turns memories into something you can press play on whenever you\'re feeling masochistic.\n\nI heard that one song yesterday. You know which one. And for three minutes and forty-two seconds, I was back there with you.\n\nThen it ended.\n\nLike we did.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // English - To a Friend
  {
    recipient_type: 'friend',
    ai_reply: 'I drove past our old neighborhood last week. The corner store is gone—replaced by some trendy café with oat milk lattes and succulents. The basketball court where we spent every summer is still there though. Someone had repainted the lines.\n\nI sat in my car for a while, watching kids play. None of them were us.\n\nWe promised we\'d stay close, remember? But life had other plans. Different cities, different priorities, different versions of ourselves.\n\nI don\'t blame you for the distance. Sometimes people grow in different directions.\n\nStill miss you though.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // English - To Past Self
  {
    recipient_type: 'past-self',
    ai_reply: 'That thing you\'re worried about right now? The one keeping you up at 3am? You\'ll survive it. Not in the way you\'re hoping—there\'s no clean resolution, no moment where everything suddenly makes sense.\n\nYou just... keep going. And one day you\'ll realize you haven\'t thought about it in weeks.\n\nBut here\'s what nobody tells you: surviving changes you. You\'ll be harder in some places, softer in others. You\'ll learn to trust yourself more and others less.\n\nI can\'t tell you if that\'s good or bad.\n\nIt just is.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // Japanese - To a Lover
  {
    recipient_type: 'lover',
    ai_reply: 'あの日、駅のホームで手を振ったきみの姿を、まだ覚えている。電車が動き出して、きみの顔が小さくなっていくのを見ながら、これが最後かもしれないって思った。\n\n本当に最後だった。\n\nあれから何年も経って、きみの声も、笑い方も、少しずつ薄れていく。でも不思議なことに、あの日の寂しさだけは鮮明なまま。\n\n今でもたまに、あの時「行かないで」って言えばよかったって思う。\n\nでも言わなかった。\n\nそれが僕たちだった。',
    views: Math.floor(Math.random() * 500) + 200,
  },
  {
    recipient_type: 'lover',
    ai_reply: '雨の匂いを嗅ぐと、きみを思い出す。理由は分からない。ただ、雨の日によく一緒にいた気がするから。\n\n傘を忘れて、コンビニで透明な傘を買った日。二人で一つの傘に入って、でも全然足りなくて、結局二人とも濡れた日。\n\n些細な記憶ばかり残ってる。大事な会話とか、ちゃんとした思い出とかじゃなくて、何でもない瞬間。\n\nでもそういうのが、一番消えない。\n\nまた雨だ。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // Japanese - To a Friend
  {
    recipient_type: 'friend',
    ai_reply: '久しぶりにあの頃の写真を見た。修学旅行、文化祭、卒業式。画面の中のきみは笑ってる。僕も笑ってる。\n\nあの時は、ずっとこうやって一緒にいられると思ってた。大人になっても、同じように笑い合えると思ってた。\n\nでも現実は違った。進路が分かれて、住む場所が変わって、連絡も減っていった。\n\n誰が悪いわけでもない。ただ、そういうものなんだろう。\n\nでも、たまには連絡してもいいかな。',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // Korean - To a Lover
  {
    recipient_type: 'lover',
    ai_reply: '그날 밤 편의점 앞에서 나눈 대화, 아직도 기억해. 네가 좋아하던 딸기우유 사주면서, 우리 내일도 보자고 했던 거. \n\n그런데 내일이 오지 않았어. 아니, 왔는데 우리가 없었던 거지.\n\n가끔 그 편의점 앞을 지나가. 습관처럼 딸기우유 코너를 봐. 너는 없지만, 그 기억은 여전히 그 자리에 있어.\n\n잘 지내고 있어? 나는... 뭐, 그럭저럭.\n\n보고 싶어.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // Korean - To Past Self
  {
    recipient_type: 'past-self',
    ai_reply: '그때 네가 밤새 고민하던 그 선택, 결국 어떻게 했는지 알아? 둘 다 안 했어. 겁이 나서, 실패할까봐, 후회할까봐. 그냥 그대로 있었어.\n\n그게 제일 후회돼. 시도라도 해볼걸. 망하더라도 뭔가 배웠을 텐데.\n\n지금의 나는 안전하게 살고 있어. 크게 나쁘지도, 좋지도 않은 삶. 그냥... 평범해.\n\n네가 원하던 게 이거였나?\n\n아니었을 거야.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // Korean - To a Friend
  {
    recipient_type: 'friend',
    ai_reply: '인스타에서 네 근황 봤어. 결혼했더라. 축하해. 진심으로.\n\n초대장은 안 왔지만, 뭐 당연하지. 우리 마지막으로 연락한 게 언제였더라. 3년? 4년?\n\n그래도 가끔 생각해. 우리 맨날 붙어다니던 시절. PC방 가고, 떡볶이 먹고, 별거 아닌 일로 웃고.\n\n그때는 영원할 줄 알았는데.\n\n잘 살아. 행복해.\n\n나도 괜찮아.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // More English - To No One
  {
    recipient_type: 'no-one',
    ai_reply: 'Sometimes the words we don\'t say are the loudest ones. They echo in the spaces between conversations, in the silence after "I\'m fine," in the moments we almost speak but don\'t.\n\nMaybe that\'s why you\'re here. Writing to no one. Because no one expects anything back. No one will misunderstand, or try to fix it, or tell you it\'ll be okay.\n\nThe void is honest like that. It just listens.\n\nAnd sometimes, that\'s enough.',
    views: Math.floor(Math.random() * 500) + 200,
  },

  // More Chinese - To Parent
  {
    recipient_type: 'parent',
    ai_reply: '我知道你尽力了。在那个年代,能养大我们已经很不容易。没有多余的钱,没有多余的时间,更没有多余的耐心。\n\n但我还是会想,如果你能多抱抱我,多说几句"我爱你",会不会不一样。\n\n现在我也当了父母,才明白你当时有多累。才明白爱不一定要说出口,它藏在每一顿饭里,每一次接送里,每一个你咬牙坚持的瞬间里。\n\n我懂了。虽然有点晚。\n\n谢谢你。',
    views: Math.floor(Math.random() * 500) + 200,
  },
];

async function seedExhibition() {
  console.log('开始填充展览墙种子数据...');

  for (let i = 0; i < seedLetters.length; i++) {
    const letter = seedLetters[i];

    // 生成展览编号
    const { data: exhibitNumber } = await supabase.rpc('generate_exhibit_number');

    if (!exhibitNumber) {
      console.error(`第 ${i + 1} 条数据生成展览编号失败`);
      continue;
    }

    // 插入到 letters_public
    const { error } = await supabase
      .from('letters_public')
      .insert({
        exhibit_number: exhibitNumber,
        ai_reply: letter.ai_reply,
        recipient_type: letter.recipient_type,
        views: letter.views,
      })
      .select()
      .single();

    if (error) {
      console.error(`第 ${i + 1} 条数据插入失败:`, error);
    } else {
      console.log(`✓ 已添加: Exhibit ${exhibitNumber} (${letter.recipient_type})`);
    }

    // 稍微延迟一下，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n✨ 种子数据填充完成!');
  console.log(`总共添加了 ${seedLetters.length} 条展览数据`);
}

seedExhibition().catch(console.error);
