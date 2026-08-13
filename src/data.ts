/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, DeliveryRegion } from './types';
// @ts-ignore
import brownSugarCibaImage from './assets/images/brown_sugar_ciba_1783817158846.jpg';

export const CATEGORIES: Category[] = [
  {
    id: 'ready-to-eat',
    name: 'Ready To Eat Meals',
    nameZh: '中式料理包',
    iconName: 'ChefHat',
    description: 'Chef-crafted authentic local and Chinese dishes. Just heat and serve in minutes.'
  },
  {
    id: 'satay',
    name: 'Satay Skewer',
    nameZh: '烧烤串',
    iconName: 'Flame',
    description: 'Fresh local meats expertly marinated on bamboo skewers, ready for grill or oven.'
  },
  {
    id: 'dumpling',
    name: 'Gourmet Dumplings',
    nameZh: '饺子系列',
    iconName: 'Cookie',
    description: 'Plump, juicy dumplings filled with premium meats and fresh local herbs.'
  },
  {
    id: 'diperap',
    name: 'Marinated Meats',
    nameZh: '秘制腌制肉片',
    iconName: 'Beef',
    description: 'Tender marinated fish, beef, and mutton slices perfectly seasoned for stir-fry or hotpot.'
  },
  {
    id: 'sauce',
    name: 'Premium Hotpot Soups & Sauces',
    nameZh: '火锅底料 & 酱料',
    iconName: 'FlameKindling',
    description: 'Rich soup bases, chili oils, and savory garlic pastes to elevate your dishes.'
  },
  {
    id: 'snack',
    name: 'Crispy Snacks',
    nameZh: '精致小吃',
    iconName: 'Sparkles',
    description: 'Irresistible bite-sized snacks, sweet treats, and golden crispy delights.'
  },
  {
    id: 'herbal-soup',
    name: 'Herbal Soup Pack',
    nameZh: '养生汤包',
    iconName: 'HeartPulse',
    description: 'Nourishing instant herbal soup packs blended for vitality and overall wellness.'
  },
  {
    id: 'dessert-soup',
    name: 'Chinese Dessert Soup',
    nameZh: '传统糖水',
    iconName: 'Soup',
    description: 'Refreshing, nourishing sweet soups (Tong Sui) perfect for any time of the day.'
  },
  {
    id: 'tea',
    name: 'Flower Tea',
    nameZh: '花茶',
    iconName: 'Coffee',
    description: 'Soothing natural flower tea bags crafted with high-quality blossoms and premium tea.'
  },
  {
    id: 'seasoning',
    name: 'Gourmet Seasoning',
    nameZh: '风味调味料',
    iconName: 'Grid',
    description: 'Professional seasoning powders including barbecue, mala, and Lanzhou ramen soup spices.'
  }
];

export const PRODUCTS: Product[] = [
  // --- SATAY ---
  {
    id: 'sate-daging-mala',
    name: 'Sate Daging Pedas Mala',
    nameZh: '麻辣牛肉串',
    category: 'satay',
    barcode: '9552626879627',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
    description: 'Premium beef skewers infused with authentic tongue-numbing Sichuan Mala spices. Sizzling and aromatic.',
    descriptionZh: '精选嫩牛肉，融汇四川正宗麻辣风味，辛香酥麻，回味无穷。',
    featured: true,
    variants: [
      { id: 'sdm-pkt', size: '400g * Pkt', price: 29.00, type: 'pkt' },
      { id: 'sdm-ctn', size: '400g * 20Pkt * Ctn', price: 580.00, type: 'ctn' }
    ]
  },
  {
    id: 'sate-kambing-mala',
    name: 'Sate Kambing Pedas Mala',
    nameZh: '麻辣羊肉串',
    category: 'satay',
    barcode: '9553636779624',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    description: 'Tender mutton chunks marinated with bold Mala spices. Rich, spicy, and perfectly savory.',
    descriptionZh: '严选优质羊肉，麻辣鲜香，肥而不腻，烤后香气扑鼻。',
    variants: [
      { id: 'skm-pkt', size: '400g * Pkt', price: 33.00, type: 'pkt' },
      { id: 'skm-ctn', size: '400g * 20Pkt * Ctn', price: 660.00, type: 'ctn' }
    ]
  },
  {
    id: 'sate-ayam-mala',
    name: 'Sate Ayam Pedas Mala',
    nameZh: '麻辣鸡肉串',
    category: 'satay',
    barcode: '9554636579627',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Succulent chicken breast skewers marinated in spicy Sichuan pepper oil and traditional seasonings.',
    descriptionZh: '鲜嫩鸡肉串，裹满麻辣佐料，鲜美多汁，香气饱满。',
    variants: [
      { id: 'sam-pkt', size: '400g * Pkt', price: 25.00, type: 'pkt' },
      { id: 'sam-ctn', size: '400g * 20Pkt * Ctn', price: 500.00, type: 'ctn' }
    ]
  },
  {
    id: 'sate-daging-classic',
    name: 'Sate Daging',
    nameZh: '牛肉串',
    category: 'satay',
    barcode: '9554134279623',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Classic Malaysian style beef satay. Richly aromatic with local spices like lemongrass, turmeric, and cumin.',
    descriptionZh: '大马传统风味牛肉串，香茅、黄姜、孜然香气交织，经典醇厚。',
    featured: true,
    variants: [
      { id: 'sdc-pkt', size: '400g * Pkt', price: 26.00, type: 'pkt' },
      { id: 'sdc-ctn', size: '400g * 20Pkt * Ctn', price: 520.00, type: 'ctn' }
    ]
  },
  {
    id: 'sate-kambing-classic',
    name: 'Sate Kambing',
    nameZh: '羊肉串',
    category: 'satay',
    barcode: '9554939379627',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional marinated mutton skewers. Incredibly tender, rich, and juicy with local herbal notes.',
    descriptionZh: '古法风味羊肉串，去腥留鲜，肉质滑嫩，汁水丰盈。',
    variants: [
      { id: 'skc-pkt', size: '400g * Pkt', price: 30.00, type: 'pkt' },
      { id: 'skc-ctn', size: '400g * 20Pkt * Ctn', price: 600.00, type: 'ctn' }
    ]
  },
  {
    id: 'sate-ayam-classic',
    name: 'Sate Ayam',
    nameZh: '鸡肉串',
    category: 'satay',
    barcode: '9554131379623',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    description: 'Malaysian national favorite chicken satay. Soft, sweet-savory marinade, perfect for the whole family.',
    descriptionZh: '大马国民美味鸡肉串，香甜入味，肉质弹牙，家少皆宜。',
    variants: [
      { id: 'sac-pkt', size: '400g * Pkt', price: 22.00, type: 'pkt' },
      { id: 'sac-ctn', size: '400g * 20Pkt * Ctn', price: 440.00, type: 'ctn' }
    ]
  },

  // --- DESSERT SOUPS ---
  {
    id: 'soup-pir-gula-batu',
    name: 'Air Pir Gula Batu',
    nameZh: '冰糖雪梨',
    category: 'dessert-soup',
    barcode: '9553183093709',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    description: 'Sweet, soothing pear nectar double-boiled with rock sugar to soothe the throat and cool the body.',
    descriptionZh: '雪梨温润，加冰糖悉心慢炖，清甜滋润，清热润肺。',
    featured: true,
    variants: [
      { id: 'pgb-pkt', size: '450g * Pkt', price: 6.00, type: 'pkt' },
      { id: 'pgb-ctn12', size: '450g * 12Pkt * Ctn', price: 78.00, type: 'ctn' }
    ]
  },
  {
    id: 'soup-pir-gula-batu-bucket',
    name: 'Air Pir Gula Batu (With Bucket)',
    nameZh: '冰糖雪梨 (小桶装)',
    category: 'dessert-soup',
    barcode: '9553183093709',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    description: 'Convenient bucket-sized serving of our traditional sweet double-boiled pear rock sugar soup.',
    descriptionZh: '传统冰糖雪梨，精美桶装，携带便利，清甜更尽兴。',
    variants: [
      { id: 'pgb-bkt-pkt', size: '450g * Pkt', price: 6.50, type: 'pkt' },
      { id: 'pgb-bkt-ctn12', size: '450g * 12Pkt * Ctn', price: 78.00, type: 'ctn' }
    ]
  },
  {
    id: 'soup-kelapa-laut-longan',
    name: 'Air Kelapa Laut & Longan Manis',
    nameZh: '海底椰龙眼糖水',
    category: 'dessert-soup',
    barcode: '9553183093716',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Classic tropical refreshment combining sweet sea coconut and dried longan. Deeply hydrating.',
    descriptionZh: '热带经典清凉糖水，香甜海底椰肉伴随干龙眼，清甜消暑。',
    variants: [
      { id: 'kll-pkt', size: '500g * Pkt', price: 5.50, type: 'pkt' },
      { id: 'kll-ctn', size: '500g * 30Pkt * Ctn', price: 165.00, type: 'ctn' }
    ]
  },
  {
    id: 'soup-nanas-longan',
    name: 'Air Nanas & Longan Manis',
    nameZh: '菠萝龙眼糖水',
    category: 'dessert-soup',
    barcode: '9553183093723',
    image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=600&q=80',
    description: 'A vibrant fruity fusion of tangy sweet pineapple chunks and juicy sweet longan fruits.',
    descriptionZh: '菠萝的微酸清甜与龙眼蜜香碰撞，带来满口爽朗果香。',
    variants: [
      { id: 'anl-pkt', size: '500g * Pkt', price: 5.50, type: 'pkt' },
      { id: 'anl-ctn', size: '500g * 30Pkt * Ctn', price: 165.00, type: 'ctn' }
    ]
  },
  {
    id: 'soup-kacang-manis',
    name: 'Sup Kacang Manis',
    nameZh: '传统花生糊',
    category: 'dessert-soup',
    barcode: '9551738298364',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    description: 'Velvety, rich cream roasted peanut soup. Creamy, aromatic, and comforting traditional Chinese dessert.',
    descriptionZh: '炒制花生细磨慢熬，口感丝滑，浓郁醇香，温暖心扉。',
    variants: [
      { id: 'skm-p-pkt', size: '300g * Pkt', price: 7.00, type: 'pkt' },
      { id: 'skm-p-ctn', size: '300g * 30Pkt * Ctn', price: 210.00, type: 'ctn' }
    ]
  },

  // --- SNACKS ---
  {
    id: 'snack-ayam-goreng-krispi',
    name: 'Ayam Goreng Krispi',
    nameZh: '酥脆小酥肉',
    category: 'snack',
    barcode: '9558268768336',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
    description: 'Golden, crispy, seasoned chicken bites. Perfectly spiced, crispy outside and tender inside.',
    descriptionZh: '外表金黄酥脆，内里肉质细嫩，特调香料入味，极佳小零嘴。',
    variants: [
      { id: 'agk-pkt', size: '1kg * Pkt', price: 38.00, type: 'pkt' },
      { id: 'agk-ctn', size: '1kg * 10Pkt * Ctn', price: 370.00, type: 'ctn' }
    ]
  },
  {
    id: 'snack-kuih-pulut-gula-merah',
    name: 'Kuih Pulut dengan Gula Merah',
    nameZh: '红糖糍粑',
    category: 'snack',
    barcode: '9558268783117',
    image: brownSugarCibaImage,
    description: 'Chewy glutinous rice cakes served with rich, fragrant liquid brown sugar syrup (gula merah).',
    descriptionZh: '软糯香Q的糯米糍粑，淋上浓郁红糖浆，外酥里糯，甜而不腻。',
    variants: [
      { id: 'kpg-pkt', size: '230g * Pkt', price: 5.30, type: 'pkt' },
      { id: 'kpg-box', size: '230g * Box', price: 6.50, type: 'box' },
      { id: 'kpg-ctn', size: '230g * 30Pkt * Ctn', price: 195.00, type: 'ctn' }
    ]
  },
  {
    id: 'snack-kuih-labu',
    name: 'Kuih Labu (Pumpkin Pie)',
    nameZh: '黄金南瓜饼',
    category: 'snack',
    barcode: '9558268783315',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy fried pumpkin pies with a soft sweet pumpkin filling. Golden and naturally sweet.',
    descriptionZh: '色泽金黄夺目，软甜南瓜内馅，外层香脆，散发淡淡南瓜芬芳。',
    variants: [
      { id: 'kl-pkt', size: '24pcs * Pkt', price: 15.00, type: 'pkt' },
      { id: 'kl-ctn', size: '24pcs * 30Pkt * Ctn', price: 450.00, type: 'ctn' }
    ]
  },
  {
    id: 'snack-ice-cream-goreng',
    name: 'Ice Cream Goreng (3 Flavors Choice)',
    nameZh: '炸冰淇淋 (3种口味可选)',
    category: 'snack',
    barcode: '9552573738824',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80',
    description: 'A magical dessert! Warm crispy bread coating wrapped around ice-cold, premium ice cream. 3 flavors choice: Vanilla, Chocolate, and Yam.',
    descriptionZh: '冰火交织的美味！外层包点酥香，内里香甜冰淇淋。提供 3 种口味选择：香草味、巧克力味、芋泥味（下单请在备注中注明所需口味）。',
    variants: [
      { id: 'icg-pkt', size: '10pcs * Pkt', price: 25.00, type: 'pkt' },
      { id: 'icg-ctn', size: '10pcs * 10Pkt * Ctn', price: 250.00, type: 'ctn' }
    ]
  },
  {
    id: 'snack-susu-goreng',
    name: 'Susu Goreng',
    nameZh: '黄金炸鲜奶',
    category: 'snack',
    barcode: '9552573738879',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy fried milk nuggets with a sweet, creamy, molten custard milk center.',
    descriptionZh: '外脆内柔，奶香浓郁，一口咬下，温热甜润的牛奶内芯在舌尖融化。',
    variants: [
      { id: 'sg-pkt', size: '180g * Pkt', price: 8.60, type: 'pkt' },
      { id: 'sg-ctn', size: '180g * 30Pkt * Ctn', price: 250.00, type: 'ctn' }
    ]
  },

  // --- DUMPLINGS ---
  {
    id: 'dumpling-ayam-cendawan',
    name: 'Dumpling Ayam Cendawan',
    nameZh: '鸡肉香菇饺子',
    category: 'dumpling',
    barcode: '9555413427490',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    description: 'Thick, bouncy dumplings filled with savory minced chicken breast and earthy, fragrant shiitake mushrooms.',
    descriptionZh: '面皮劲道，包裹鲜美多汁的鸡肉与浓郁香菇丁，满口鲜美。',
    featured: true,
    variants: [
      { id: 'dac-pck', size: '2kg * Pck', price: 54.00, type: 'pck' }
    ]
  },
  {
    id: 'dumpling-ayam-kubis',
    name: 'Dumpling Ayam Kubis',
    nameZh: '鸡肉白菜饺子',
    category: 'dumpling',
    barcode: '9555413444138',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    description: 'Comforting, classic dumplings stuffed with sweet minced chicken and crisp, fresh cabbage slices.',
    descriptionZh: '爽脆白菜遇上软嫩鸡肉，经典家常口味，清甜不腻，鲜美爽口。',
    variants: [
      { id: 'dak-pck', size: '2kg * Pck', price: 54.00, type: 'pck' }
    ]
  },
  {
    id: 'dumpling-beef-leek',
    name: 'Dumpling Beef & Leek',
    nameZh: '牛肉大葱饺子',
    category: 'dumpling',
    barcode: '9555413941330',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    description: 'Rich, robust dumplings featuring minced beef seasoned with fragrant local Chinese leeks.',
    descriptionZh: '劲道面皮包入浓郁牛肉大葱馅，汁多味浓，饱满扎实。',
    variants: [
      { id: 'dbl-pck', size: '2kg * Pck', price: 54.00, type: 'pck' }
    ]
  },
  {
    id: 'dumpling-kambing-lobak',
    name: 'Dumpling Kambing & Lobak',
    nameZh: '羊肉白萝卜饺子',
    category: 'dumpling',
    barcode: '9555414941347',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    description: 'Premium mutton dumplings seasoned beautifully with crisp white radish, reducing gaminess for ultimate flavor.',
    descriptionZh: '清甜白萝卜搭配鲜美羊肉，温补鲜嫩，去腥提味，汁水充盈。',
    variants: [
      { id: 'dkl-pck', size: '2kg * Pck', price: 56.00, type: 'pck' }
    ]
  },

  // --- READY TO EAT ---
  {
    id: 'rte-daging-masam-emas',
    name: 'Daging Masak Masam Emas',
    nameZh: '酸汤金汤肥牛',
    category: 'ready-to-eat',
    barcode: '9551789215037',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    description: 'Tender beef slices in a luxurious golden pumpkin-and-wild-pepper sour soup. Extravagantly appetizing.',
    descriptionZh: '精选肥牛切片置于金灿酸汤，酸辣开胃，汤头浓郁，热辣过瘾。',
    variants: [
      { id: 'dme-pkt', size: '200g * Pkt', price: 8.80, type: 'pkt' },
      { id: 'dme-ctn', size: '20Pkt * Ctn', price: 176.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-daging-masak-merah',
    name: 'Daging Masak Merah',
    nameZh: '秘制红烧牛肉',
    category: 'ready-to-eat',
    barcode: '9551789215068',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
    description: 'Malaysian classic sweet-spicy red cooked beef or deep Chinese braised red beef style. Savory, meltingly tender.',
    descriptionZh: '古法慢炖，色泽红亮，肉质软烂，酱香甜辣，大马经典下饭菜。',
    featured: true,
    variants: [
      { id: 'dmm-unit', size: '200g * Unit', price: 9.00, type: 'unit' },
      { id: 'dmm-pkt', size: '1kg * Pkt', price: 36.00, type: 'pkt' },
      { id: 'dmm-ctn', size: '1kg * 12Pkt * Ctn', price: 456.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-claypot-kambing',
    name: 'Claypot Kambing',
    nameZh: '滋补羊肉煲',
    category: 'ready-to-eat',
    barcode: '9551789216027',
    image: 'https://images.unsplash.com/photo-1547928500-4722f55cd91e?auto=format&fit=crop&w=600&q=80',
    description: 'Rich, warming claypot style braised mutton with traditional Chinese warming herbs and soy sauces.',
    descriptionZh: '陶罐慢火煨炖，羊肉酥烂，浓缩中草药与香料精华，暖身滋补。',
    variants: [
      { id: 'ck-pkt', size: '350g * Pkt', price: 11.00, type: 'pkt' },
      { id: 'ck-ctn', size: '20Pkt * Ctn', price: 220.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-claypot-ayam',
    name: 'Claypot Ayam',
    nameZh: '香浓鸡肉煲',
    category: 'ready-to-eat',
    barcode: '9551789217178',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
    description: 'Aromatic claypot style chicken stew cooked with thick premium soy sauce, ginger, and sesame oil.',
    descriptionZh: '黑酱油、生姜与麻油焖煮鸡块，香气浓郁逼人，滑嫩多汁。',
    variants: [
      { id: 'ca-pkt', size: '350g * Pkt', price: 6.50, type: 'pkt' },
      { id: 'ca-ctn', size: '20Pkt * Ctn', price: 130.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-ayam-masam-manis',
    name: 'Ayam Masam & Manis',
    nameZh: '经典酸甜鸡块',
    category: 'ready-to-eat',
    barcode: '9551789217024',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy fried chicken chunks tossed in a glossy, tangy, sweet tomato and pineapple-based sauce.',
    descriptionZh: '酸甜可口，番茄与菠萝调配出黄金比例酱汁裹满鸡丁，经典百搭。',
    variants: [
      { id: 'amm-pkt', size: '200g * Pkt', price: 5.80, type: 'pkt' },
      { id: 'amm-ctn', size: '20Pkt * Ctn', price: 116.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-ayam-cincang-terung',
    name: 'Ayam Cincang dengan Terung',
    nameZh: '鸡肉沫茄子',
    category: 'ready-to-eat',
    barcode: '9551789217079',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2ad4dc9b4?auto=format&fit=crop&w=600&q=80',
    description: 'Savory minced chicken sautéed with melt-in-the-mouth purple eggplants in garlic paste sauce.',
    descriptionZh: '鸡肉碎咸香多汁，茄子软糯入味，蒜香浓厚，下饭第一名。',
    variants: [
      { id: 'act-pkt', size: '200g * Pkt', price: 5.80, type: 'pkt' },
      { id: 'act-ctn', size: '20Pkt * Ctn', price: 116.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-ayam-cendawan',
    name: 'Ayam Cendawan',
    nameZh: '经典香菇焖鸡',
    category: 'ready-to-eat',
    barcode: '9551789217185',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    description: 'Hearty homestyle chicken stewed with flavorful plump shiitake mushrooms in natural jus broth.',
    descriptionZh: '滑嫩鸡块与香菇鲜汤完美契合，慢火焖煮，香气渗入骨髓。',
    variants: [
      { id: 'ace-pkt', size: '200g * Pkt', price: 5.80, type: 'pkt' },
      { id: 'ace-ctn', size: '20Pkt * Ctn', price: 116.00, type: 'ctn' }
    ]
  },
  {
    id: 'rte-ayam-kuning',
    name: 'Ayam Kuning Berempah',
    nameZh: '秘制黄焖鸡',
    category: 'ready-to-eat',
    barcode: '9551789217192',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    description: 'Malaysian-Chinese fusion stewed yellow gravy chicken cooked with ginger, garlic, and fresh turmeric roots.',
    descriptionZh: '融合黄姜、生姜与大蒜，文火慢煨黄焖鸡，色泽金黄，浓香粘稠。',
    variants: [
      { id: 'akb-pkt', size: '200g * Pkt', price: 6.80, type: 'pkt' },
      { id: 'akb-ctn', size: '20Pkt * Ctn', price: 136.00, type: 'ctn' }
    ]
  },

  // --- SAUCES & HOTPOT SOUP BASES ---
  {
    id: 'sauce-kolagen-ayam',
    name: 'Sup Kolagen Ayam Emas',
    nameZh: '金汤花胶鸡汤底',
    category: 'sauce',
    barcode: '9551738298371',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    description: 'Luxurious Golden Chicken soup base packed with collagen from hours of slow simmering marrow bone broth.',
    descriptionZh: '精选老母鸡慢熬数小时，汤色金黄亮泽，胶原蛋白满满，鲜美浓醇。',
    variants: [
      { id: 'ska-pkt', size: '1kg * Pkt', price: 36.00, type: 'pkt' },
      { id: 'ska-ctn', size: '1kg * 12Pkt * Ctn', price: 430.00, type: 'ctn' }
    ]
  },
  {
    id: 'sauce-jeruk-sayur',
    name: 'Sup Jeruk Sayur',
    nameZh: '正宗酸菜鱼汤底',
    category: 'sauce',
    barcode: '9551738298388',
    image: 'https://images.unsplash.com/photo-1547928500-4722f55cd91e?auto=format&fit=crop&w=600&q=80',
    description: 'Tangy, spicy Sichuan fermented mustard green hotpot soup base. A classic savory sensation.',
    descriptionZh: '四川老坛酸菜酿造，微辣清酸，熬制高汤开胃生津，涮鱼绝配。',
    variants: [
      { id: 'sjs-pkt', size: '1kg * Pkt', price: 28.00, type: 'pkt' },
      { id: 'sjs-ctn', size: '1kg * 12Pkt * Ctn', price: 330.00, type: 'ctn' }
    ]
  },
  {
    id: 'sauce-tomato',
    name: 'Sup Tomato',
    nameZh: '鲜番茄火锅底料',
    category: 'sauce',
    barcode: '9551738298395',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Rich, sweet, and tangy premium hotpot soup base made of sun-ripened fresh tomato puree.',
    descriptionZh: '采用阳光熟番茄打磨熬制，酸爽香甜，浓郁浓稠，营养健康。',
    variants: [
      { id: 'st-pkt', size: '1kg * Pkt', price: 28.00, type: 'pkt' },
      { id: 'st-ctn', size: '1kg * 10Pkt * Ctn', price: 280.00, type: 'ctn' }
    ]
  },
  {
    id: 'sauce-ayam-masam-pedas',
    name: 'Sup Ayam Masam Pedas',
    nameZh: '泡椒酸辣鸡汤底',
    category: 'sauce',
    barcode: '9551738298302',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    description: 'A punchy, dynamic hotpot base featuring pickled wild peppers. Extra tangy, sour and hot.',
    descriptionZh: '正宗四川泡椒调味，酸辣带劲，回甘清爽，酣畅淋漓。',
    variants: [
      { id: 'samp-pkt', size: '2kg * Pkt', price: 56.00, type: 'pkt' },
      { id: 'samp-ctn', size: '2kg * 12Pkt * Ctn', price: 672.00, type: 'ctn' }
    ]
  },
  {
    id: 'sauce-mala-pedas',
    name: 'Sup Sichuan Mala Pedas',
    nameZh: '川味麻辣火锅底料',
    category: 'sauce',
    barcode: '9551738298319',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
    description: 'The ultimate numbingly hot Sichuan Mala soup block. Rich oil, loaded with peppercorns and dried chili.',
    descriptionZh: '正宗川蜀牛油/植物油麻辣底料，辣而不燥，麻味绵长。',
    variants: [
      { id: 'smp-pkt', size: '1kg * Pkt', price: 28.00, type: 'pkt' },
      { id: 'smp-ctn', size: '1kg * 10Pkt * Ctn', price: 280.00, type: 'ctn' }
    ]
  },
  {
    id: 'sauce-minyak-cili',
    name: 'Minyak Cili Merah',
    nameZh: '特级秘制红辣椒油',
    category: 'sauce',
    barcode: '9556789876875',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    description: 'Deep red, immensely fragrant seasoned chili oil. Packed with toasted chili flakes and spices.',
    descriptionZh: '红亮剔透，辣油鲜美，拌面、蘸饺子、凉拌菜绝佳调味品。',
    variants: [
      { id: 'mcm-pkt', size: '500g * Pkt', price: 18.00, type: 'pkt' },
      { id: 'mcm-ctn', size: '500g * 12Pkt * Ctn', price: 210.00, type: 'ctn' }
    ]
  },
  {
    id: 'sauce-sos-bawang-putih',
    name: 'Sos Bawang Putih',
    nameZh: '黄金蒜蓉蘸酱',
    category: 'sauce',
    barcode: '9556789876868',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
    description: 'Thick, fragrant golden garlic sauce. Ideal condiment for steam seafood, hotpot dipping, or stir-fries.',
    descriptionZh: '精研生蒜慢火熬制，辟腥提鲜，蒜香饱满持久。',
    variants: [
      { id: 'sbp-pkt', size: '500g * Pkt', price: 18.00, type: 'pkt' },
      { id: 'sbp-ctn', size: '500g * 12Pkt * Ctn', price: 210.00, type: 'ctn' }
    ]
  },

  // --- DI PERAP (MARINATED MEATS) ---
  {
    id: 'diperap-isi-ikan',
    name: 'Isi Ikan Diperap',
    nameZh: '秘制腌制鱼片',
    category: 'diperap',
    barcode: '9556321012303',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    description: 'Velvety tender fish fillets pre-marinated to retain moisture. Perfect for hotpot, acid-soup or stir fry.',
    descriptionZh: '鱼肉软嫩，秘法腌制，不散不老，下锅即熟，口感滑溜。',
    variants: [
      { id: 'iid-pkt', size: '250g * pck', price: 8.60, type: 'pck' },
      { id: 'iid-ctn', size: '40pck * ctn', price: 344.00, type: 'ctn' }
    ]
  },
  {
    id: 'diperap-daging',
    name: 'Daging Diperap',
    nameZh: '秘制腌制牛肉片',
    category: 'diperap',
    barcode: '9556321012334',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy, thinly sliced beef cuts beautifully tenderized and marinated. Cook in seconds.',
    descriptionZh: '精切嫩肉片，肉质嫩滑多汁，火锅涮肉、爆炒皆宜。',
    variants: [
      { id: 'did-pkt', size: '500g * pck', price: 22.00, type: 'pck' },
      { id: 'did-2kg', size: '2kg * pck', price: 80.00, type: 'pck' }
    ]
  },
  {
    id: 'diperap-kambing',
    name: 'Kambing Diperap',
    nameZh: '秘制腌制羊肉片',
    category: 'diperap',
    barcode: '9556321012327',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=600&q=80',
    description: 'Succulent mutton slices tenderly prepared with herbs to neutralize gamey aroma. Fragrant and delicious.',
    descriptionZh: '优质羊肉切片，秘制调料去膻味，肉香醇厚，烧烤爆炒首选。',
    variants: [
      { id: 'kid-pkt', size: '500g * pck', price: 30.00, type: 'pck' },
      { id: 'kid-2kg', size: '2kg * pck', price: 120.00, type: 'pck' }
    ]
  },

  // --- TEA (TEH SACKET) ---
  {
    id: 'tea-ba-bao',
    name: 'Daun Teh Ba Bao',
    nameZh: '经典八宝茶',
    category: 'tea',
    barcode: '9551045275607',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional wellness tea blend with red dates, wolfberries, longan, rock sugar, chrysanthemum, and green tea.',
    descriptionZh: '红枣、枸杞、龙眼、冰糖、菊花与绿茶融为一体，甘甜清爽。',
    variants: [
      { id: 'tbb-pkt', size: '25g * pck', price: 5.00, type: 'pck' },
      { id: 'tbb-ctn', size: '30pck * ctn', price: 150.00, type: 'ctn' }
    ]
  },
  {
    id: 'tea-wolfberry',
    name: 'Daun Teh Wolfberry',
    nameZh: '润燥美目茶',
    category: 'tea',
    barcode: '9551045275638',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    description: 'Nourishing botanical blend designed to soothe eyes and hydrate the body. Loaded with premium goji berries.',
    descriptionZh: '特调配方，明目润燥，茶汤澄澈甜润，手机族、电脑族必备。',
    variants: [
      { id: 'twb-pkt', size: '25g * pck', price: 4.00, type: 'pck' },
      { id: 'twb-ctn', size: '30pck * ctn', price: 120.00, type: 'ctn' }
    ]
  },
  {
    id: 'tea-roselle',
    name: 'Daun Teh Roselle',
    nameZh: '洛神花草茶',
    category: 'tea',
    barcode: '9551045275645',
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80',
    description: 'Tangy-sweet herbal tea made from dried roselle calyces. Vibrant red and full of antioxidants.',
    descriptionZh: '自然酸甜，呈红宝石般瑰丽色彩，解腻生津，抗氧好帮手。',
    variants: [
      { id: 'tr-pkt', size: '25g * pck', price: 4.00, type: 'pck' },
      { id: 'tr-ctn', size: '30pck * ctn', price: 120.00, type: 'ctn' }
    ]
  },
  {
    id: 'tea-bunga-kekwa',
    name: 'Daun Teh Bunga Kekwa',
    nameZh: '清火菊花茶',
    category: 'tea',
    barcode: '9551045275669',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    description: 'Refreshing aromatic tea made from selected golden chrysanthemum flowers. Clears summer heat.',
    descriptionZh: '精选金丝黄菊，清香悠长，清热解毒，夏日防暑常备。',
    variants: [
      { id: 'tbk-pkt', size: '25g * pck', price: 4.00, type: 'pck' },
      { id: 'tbk-ctn', size: '30pck * ctn', price: 120.00, type: 'ctn' }
    ]
  },

  // --- HERBAL INSTANT SOUP PACKS ---
  {
    id: 'herbal-sup-kelapa',
    name: 'Sup Ayam Kelapa',
    nameZh: '椰子炖鸡汤底包',
    category: 'herbal-soup',
    barcode: '9551738298623',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    description: 'Refreshing sweet herbal base with coconut flavors. Brings island warmth and sweetness to chicken soup.',
    descriptionZh: '清甜椰香高汤包，蕴含椰肉与天然草本，汤头鲜甜清润。',
    variants: [
      { id: 'sak-pkt', size: '400g * Pkt', price: 8.50, type: 'pkt' }
    ]
  },
  {
    id: 'herbal-sup-susu-harimau',
    name: 'Sup Ayam Cendawan Susu Harimau',
    nameZh: '虎乳芝养肺鸡汤包',
    category: 'herbal-soup',
    barcode: '9551738298548',
    image: 'https://images.unsplash.com/photo-1547928500-4722f55cd91e?auto=format&fit=crop&w=600&q=80',
    description: 'Precious Tiger Milk Mushroom (Cendawan Susu Harimau) boiled to boost lung health and immunity.',
    descriptionZh: '大马国宝级药材“虎乳芝”特配高汤包，润肺止咳，提升免疫力。',
    featured: true,
    variants: [
      { id: 'scs-pkt', size: '400g * Pkt', price: 8.50, type: 'pkt' }
    ]
  },
  {
    id: 'herbal-sup-tianma',
    name: 'Sup Rempah Tianma Tradisi',
    nameZh: '天麻安神补脑汤包',
    category: 'herbal-soup',
    barcode: '9551738298425',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'A traditional herbal blend highlighting Gastrodia (Tianma) to soothe headaches, improve sleep and focus.',
    descriptionZh: '精配天麻中草药，宁神安脑，缓解头痛头晕，清心醒脑。',
    variants: [
      { id: 'srt-pkt', size: '400g * Pkt', price: 8.50, type: 'pkt' }
    ]
  },
  {
    id: 'herbal-sup-bajitian',
    name: 'Sup Rempah Bajitian',
    nameZh: '巴戟天强肾壮骨汤包',
    category: 'herbal-soup',
    barcode: '9551738298494',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    description: 'Nourishing soup base highlighting Morinda Root (Bajitian) to strengthen lower back, joints and energy.',
    descriptionZh: '巴戟天经典药膳包，强筋骨、壮腰膝，消除疲劳，增强体力。',
    variants: [
      { id: 'srb-pkt', size: '400g * Pkt', price: 8.50, type: 'pkt' }
    ]
  },
  {
    id: 'herbal-sup-cordyceps',
    name: 'Sup Rempah Cendawan Cordyceps',
    nameZh: '虫草花补肺滋肾汤包',
    category: 'herbal-soup',
    barcode: '9551738298456',
    image: 'https://images.unsplash.com/photo-1547928500-4722f55cd91e?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant golden cordyceps flowers matched with supporting herbs to nurture kidney and respiratory functions.',
    descriptionZh: '精选金黄虫草花，色泽诱人，滋阴润肺，益肾养颜。',
    variants: [
      { id: 'src-pkt', size: '400g * Pkt', price: 8.50, type: 'pkt' }
    ]
  },
  {
    id: 'herbal-sup-goji-kekwa',
    name: 'Sup Ayam Goji & Kekwa',
    nameZh: '枸杞菊花明目鸡汤包',
    category: 'herbal-soup',
    barcode: '9551738298616',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    description: 'Eye-care specialty herbal soup pack. Golden sweet wolfberry and crisp cooling chrysanthemum flavor.',
    descriptionZh: '清火明目特调，枸杞蜜香加小黄菊清凉，汤感清爽微甘。',
    variants: [
      { id: 'sag-pkt', size: '400g * Pkt', price: 8.50, type: 'pkt' }
    ]
  },

  // --- SEASONINGS ---
  {
    id: 'seasoning-lanzhou',
    name: 'Serbuk Perencah Mi Lanzhou',
    nameZh: '兰州牛肉面调料包',
    category: 'seasoning',
    barcode: '9550318268582',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'The secret spice mix of Lanzhou beef ramen. Deeply flavorful blend of 15 authentic dry spices.',
    descriptionZh: '十五种传统天然香料黄金配比，一包还原正宗兰州拉面清香高汤底。',
    variants: [
      { id: 'sml-pkt', size: '500g * Pkt', price: 30.00, type: 'pkt' },
      { id: 'sml-ctn', size: '500g * 12Pkt * Ctn', price: 350.00, type: 'ctn' }
    ]
  },
  {
    id: 'seasoning-bbq',
    name: 'Serbuk Perisa BBQ',
    nameZh: '经典风味烧烤撒料包',
    category: 'seasoning',
    barcode: '9551789218021',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Savory, sweet, smoky barbecue dry-rub powder. Perfect for skewered chicken, meats or fries.',
    descriptionZh: '咸甜微熏，香气四溢。最适宜作为烧烤肉串、海鲜或炸物撒粉。',
    variants: [
      { id: 'sbb-pkt', size: '500g * Pkt', price: 30.00, type: 'pkt' },
      { id: 'sbb-ctn', size: '500g * 12Pkt * Ctn', price: 350.00, type: 'ctn' }
    ]
  },
  {
    id: 'seasoning-mala-bbq',
    name: 'Serbuk Perisa Mala BBQ',
    nameZh: '秘制麻辣烧烤撒料包',
    category: 'seasoning',
    barcode: 'AEM-ML-BBQ',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Zesty Sichuan pepper and red chili dry seasoning powder. Adds a punchy numbing thrill to bbq skewers.',
    descriptionZh: '精选汉源花椒与二荆条红椒打磨，麻辣过瘾，激发肉食深层香味。',
    variants: [
      { id: 'smb-pkt', size: '500g * Pkt', price: 30.00, type: 'pkt' },
      { id: 'smb-ctn', size: '500g * 12Pkt * Ctn', price: 350.00, type: 'ctn' }
    ]
  }
];

export const DELIVERY_REGIONS: DeliveryRegion[] = [
  {
    id: 'klang-valley',
    name: 'Klang Valley / Selangor',
    nameZh: '雪隆区 (Klang Valley)',
    minFreeOrder: 1000,
    deliveryFee: 40,
    description: 'Direct temperature-controlled cold truck courier delivery across Selangor and KL cities. Free delivery for orders RM1000 and above, otherwise RM40 flat fee.',
    descriptionZh: '雪隆各大市区冷链物流专车直送，订单满 RM1000 免运费，低于 RM1000 统一收取 RM40 冷链运费。'
  },
  {
    id: 'outstation',
    name: 'Outstation (Other States in Peninsular Malaysia)',
    nameZh: '外州区域 (西马半岛其他州属)',
    minFreeOrder: 1500,
    deliveryFee: 40,
    description: 'Special cold chain delivery partner dispatch across West Malaysia. Free delivery for orders RM1500 and above, otherwise RM40 flat fee.',
    descriptionZh: '西马外州冷链专线配送，订单满 RM1500 免运费，低于 RM1500 统一收取 RM40 冷链运费。'
  }
];

export const COMPANY_CONTACT = {
  phone: '+6014-941 3545',
  email: 'alekhlas.sales@gmail.com',
  address: 'No 27, Jalan P4/5, Bandar Teknologi Kajang, 43500 Semenyih, Selangor',
  name: 'AL-EKHLAS MANUFACTURING SDN.BHD',
  regNo: '202401022253 (1568102-T)'
};
