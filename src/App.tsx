/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Flame,
  Soup,
  Cookie,
  ChefHat,
  Sparkles,
  Beef,
  Coffee,
  HeartPulse,
  Grid,
  Search,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  ThumbsUp,
  Menu,
  Globe,
  ChevronRight,
  Heart,
  Barcode,
  FileText,
  ShieldAlert,
  HelpCircle,
  Award,
  ShieldCheck,
  Boxes,
  Layers,
  Store,
  Briefcase,
  Settings,
  Lock,
  Unlock,
  Trash2,
  RefreshCw,
  FileJson
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { CATEGORIES, PRODUCTS, DELIVERY_REGIONS, COMPANY_CONTACT } from './data';
import { Product, ProductVariant, CartItem, Language } from './types';
import { DICTIONARY } from './dictionary';
import {
  LEGAL_DOCS,
  LEGAL_DOC_ORDER,
  LEGAL_ENTITY,
  LEGAL_LAST_UPDATED,
  LegalDocId
} from './legal';
import Logo from './components/Logo';
import HalalLogo from './components/HalalLogo';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const LEGAL_LANG_ORDER: Record<Language, Language[]> = {
  zh: ['zh', 'en', 'ms'],
  en: ['en', 'zh', 'ms'],
  ms: ['ms', 'en', 'zh']
};

const LegalDocView = ({
  docId,
  lang,
  onSelect
}: {
  docId: LegalDocId;
  lang: Language;
  onSelect: (id: LegalDocId) => void;
}) => {
  const doc = LEGAL_DOCS[docId];
  const [primary, ...secondary] = LEGAL_LANG_ORDER[lang];

  const toneClass = (tone?: 'warning' | 'consent') =>
    tone === 'warning'
      ? 'bg-amber-50/70 border-amber-500'
      : tone === 'consent'
      ? 'bg-emerald-50/70 border-emerald-600'
      : 'bg-white border-slate-300';

  return (
    <div className="flex flex-col gap-5">
      {/* Switch between the three legal documents without leaving the modal */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
        {LEGAL_DOC_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-[3px] border transition-colors cursor-pointer ${
              id === docId
                ? 'bg-brand-green text-white border-brand-green'
                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-green hover:text-brand-green'
            }`}
          >
            {LEGAL_DOCS[id].label[lang]}
          </button>
        ))}
      </div>

      <p className="text-slate-700 text-xs leading-relaxed font-medium">{doc.intro[primary]}</p>

      <div className="flex flex-col gap-4">
        {doc.clauses.map((clause, i) => (
          <div key={i} className={`border-l-4 pl-3.5 pr-3 py-2.5 rounded-r-[3px] ${toneClass(clause.tone)}`}>
            <h4 className="font-extrabold text-slate-900 text-sm mb-1.5 uppercase tracking-wider">
              {clause.heading[primary]}
            </h4>
            <p className="text-slate-800 font-medium text-sm leading-relaxed">{clause.body[primary]}</p>
            {secondary.map((code) => (
              <p key={code} className="text-slate-500 text-[11px] leading-relaxed mt-1.5">
                {clause.body[code]}
              </p>
            ))}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 italic border-t border-slate-100 pt-3 leading-relaxed">
        {LEGAL_ENTITY.name} ({LEGAL_ENTITY.regNo}) · {LEGAL_ENTITY.address} · {LEGAL_ENTITY.phone} · {LEGAL_ENTITY.email}
        <br />
        Last updated: {LEGAL_LAST_UPDATED}
      </p>
    </div>
  );
};

export default function App() {
  // State
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese as requested (三全 / 思念 style)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [deliveryRegionId, setDeliveryRegionId] = useState<'klang-valley' | 'outstation'>('klang-valley');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Sender info for WhatsApp message
  const [senderName, setSenderName] = useState<string>('');
  const [senderAddress, setSenderAddress] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [companyRegNo, setCompanyRegNo] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('Restaurant / F&B Chain');

  // Seasonal Promo Discount & Bundling
  const [memberDiscountApplied, setMemberDiscountApplied] = useState<boolean>(false);

  // Food Recommender state (interactive feature)
  const [recommenderGoal, setRecommenderGoal] = useState<string>('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // Cart variant selected states for catalog (keeps track of chosen variant for each product id)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Dynamic SEO Document Title & Meta Description update based on language
  useEffect(() => {
    if (lang === 'zh') {
      document.title = 'AEM Frozen Food | OEM Halal Food & 清真中华美食研发制造工厂 (Malaysia)';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'AL-EKHLAS MANUFACTURING SDN BHD (AEM Frozen Food / 真心食品) - 马来西亚雪兰莪 Semenyih 顶级 OEM Halal food 清真速冻食品与清真中华美食（Halal Chinese food）研发制造厂，主打清真沙爹烤串、手工水饺、清真点心与冰糖雪梨炖汤。');
      }
    } else if (lang === 'en') {
      document.title = 'AEM Frozen Food | Premier OEM Halal Food Manufacturer & Halal Chinese Food Malaysia';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'AL-EKHLAS MANUFACTURING SDN BHD (AEM Frozen Food) - Premier OEM Halal Food Manufacturer & Halal Chinese Food supplier based in Semenyih, Selangor, Malaysia. Specialist in frozen satay skewers, halal dim sum, dumplings, and dessert soups.');
      }
    } else if (lang === 'ms') {
      document.title = 'AEM Frozen Food | Pengeluar OEM Halal Food & Makanan Cina Halal Malaysia';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'AL-EKHLAS MANUFACTURING SDN BHD (AEM Frozen Food) berpusat di Semenyih, Selangor. Pakar kilang OEM Halal food, makanan Cina Halal (dumpling, dim sum), sate sejuk beku, dan pembekal rantaian restoran B2B.');
      }
    }
  }, [lang]);

  // Favorites local state with localStorage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aem_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aem_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // State for active product in details modal
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Dynamic Product list (saves any added, edited or deleted products directly in localStorage)
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('merchant_custom_products');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS;
  });

  const saveProductsList = (newList: Product[]) => {
    setProductsList(newList);
    try {
      localStorage.setItem('merchant_custom_products', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  };

  // State for customized product images (stored in localStorage) - kept for backward compatibility and quick overlays
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('custom_product_images');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleUpdateProductImage = (productId: string, base64Data: string) => {
    // Also update directly in productsList if it exists there
    const updatedList = productsList.map(p => p.id === productId ? { ...p, image: base64Data } : p);
    saveProductsList(updatedList);

    setCustomImages((prev) => {
      const next = { ...prev, [productId]: base64Data };
      try {
        localStorage.setItem('custom_product_images', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return next;
    });
  };

  const handleResetProductImage = (productId: string) => {
    // Also restore in productsList from static PRODUCTS
    const originalProd = PRODUCTS.find(p => p.id === productId);
    if (originalProd) {
      const updatedList = productsList.map(p => p.id === productId ? { ...p, image: originalProd.image } : p);
      saveProductsList(updatedList);
    }

    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[productId];
      try {
        localStorage.setItem('custom_product_images', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return next;
    });
  };

  const handleResetAllProducts = () => {
    if (window.confirm(lang === 'zh' ? '您确定要重置所有商品的修改吗？这将会清空您自定义上传的所有图片、修改的价格、新增的商品，并恢复系统默认的演示数据！' : 'Are you sure you want to reset all products? This will clear all custom images, price edits, added items and restore default factory products.')) {
      saveProductsList(PRODUCTS);
      setCustomImages({});
      try {
        localStorage.removeItem('custom_product_images');
        localStorage.removeItem('merchant_custom_products');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getProductImage = (product: Product) => {
    return customImages[product.id] || product.image;
  };

  // Merchant Admin states.
  // The CMS console is only reachable via ?admin=1 so ordinary visitors never
  // see the merchant tooling, even if a previous session left the flag on.
  const isAdminUnlocked = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get('admin') === '1';
    } catch {
      return false;
    }
  }, []);

  const [adminModeStored, setAdminModeStored] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('merchant_admin_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const adminMode = isAdminUnlocked && adminModeStored;

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sync adminMode change
  const handleToggleAdminMode = (val: boolean) => {
    setAdminModeStored(val);
    try {
      localStorage.setItem('merchant_admin_mode', String(val));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync editingProduct state with selectedProductDetails in Admin Mode
  useEffect(() => {
    if (selectedProductDetails && adminMode) {
      setEditingProduct(JSON.parse(JSON.stringify(selectedProductDetails)));
    } else {
      setEditingProduct(null);
    }
  }, [selectedProductDetails, adminMode]);

  // State for the legal modal: 'terms' | 'refund' | 'pdpa' | 'why' | null
  const [openPolicyType, setOpenPolicyType] = useState<LegalDocId | 'why' | null>(null);

  // B2B Inquiry Form State
  const [b2bCompanyName, setB2bCompanyName] = useState<string>('');
  const [b2bContactName, setB2bContactName] = useState<string>('');
  const [b2bPhone, setB2bPhone] = useState<string>('');
  const [b2bBusinessType, setB2bBusinessType] = useState<string>('restaurant');
  const [b2bInterest, setB2bInterest] = useState<string>('wholesale');
  const [b2bMessage, setB2bMessage] = useState<string>('');
  const [b2bSuccess, setB2bSuccess] = useState<boolean>(false);

  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bContactName || !b2bPhone) {
      alert(lang === 'zh' ? '请填写联系人姓名和电话号码' : 'Please fill in contact name and phone number');
      return;
    }

    const businessTypeLabels: Record<string, string> = {
      restaurant: lang === 'zh' ? '餐饮连锁/餐馆' : 'Restaurant Chain',
      supermarket: lang === 'zh' ? '大型超市/商超' : 'Supermarket/Retailer',
      distributor: lang === 'zh' ? '食品经销商/批发商' : 'Food Distributor',
      catering: lang === 'zh' ? '酒店/团餐服务' : 'Hotel/Catering',
      oem: lang === 'zh' ? '贴牌代工品牌方 (OEM)' : 'OEM Brand',
      other: lang === 'zh' ? '其他合作类型' : 'Other Business'
    };

    const interestLabels: Record<string, string> = {
      wholesale: lang === 'zh' ? '大量采购 Bulk Purchase / 批发' : 'Bulk Wholesale Purchase',
      oem: lang === 'zh' ? '配方研发及贴牌代工 (OEM/ODM)' : 'Recipe Customization / OEM',
      distribution: lang === 'zh' ? '区域代理/分销商合作' : 'Regional Dealership / Distribution',
      other: lang === 'zh' ? '其他商务咨询' : 'Other Business Inquiry'
    };

    let msg = `💼 *AEM BUSINESS INQUIRY / 大量采购 Bulk Purchase 商务合作意向登记* 💼\n\n`;
    msg += `• *公司名称 / Company:* ${b2bCompanyName || '-'}\n`;
    msg += `• *联系人 / Contact:* ${b2bContactName}\n`;
    msg += `• *联系电话 / Phone:* ${b2bPhone}\n`;
    msg += `• *业务类型 / Business:* ${businessTypeLabels[b2bBusinessType] || b2bBusinessType}\n`;
    msg += `• *合作意向 / Interest:* ${interestLabels[b2bInterest] || b2bInterest}\n`;
    if (b2bMessage.trim()) {
      msg += `• *具体需求 / Details:* ${b2bMessage}\n`;
    }
    msg += `\n✉️ _Sent from AEM B2B Portal_`;

    const cleanPhone = COMPANY_CONTACT.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setB2bSuccess(true);
  };

  // Active language dictionary
  const t = useMemo(() => DICTIONARY[lang], [lang]);

  // Handle default variants initialization
  useEffect(() => {
    const defaults: Record<string, string> = {};
    productsList.forEach((product) => {
      if (product.variants.length > 0) {
        defaults[product.id] = product.variants[0].id;
      }
    });
    setSelectedVariants((prev) => ({ ...defaults, ...prev }));
  }, [productsList]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'favorites'
          ? favoriteIds.includes(product.id)
          : product.category === selectedCategory);
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(lowerQuery) ||
        product.nameZh.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.descriptionZh.toLowerCase().includes(lowerQuery);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery, favoriteIds, productsList]);

  // Featured Products
  const featuredProducts = useMemo(() => {
    return productsList.filter((p) => p.featured);
  }, [productsList]);

  // Calculate Cart Subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
  }, [cart]);

  // Calculate discount (10% of subtotal)
  const discountAmount = useMemo(() => {
    return memberDiscountApplied ? subtotal * 0.1 : 0;
  }, [memberDiscountApplied, subtotal]);

  // Subtotal after discount
  const subtotalAfterDiscount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  // Get Selected Delivery Region
  const activeRegion = useMemo(() => {
    return DELIVERY_REGIONS.find((r) => r.id === deliveryRegionId) || DELIVERY_REGIONS[0];
  }, [deliveryRegionId]);

  // Calculate Delivery Fee & Free Delivery Progress
  const isDeliveryFree = subtotalAfterDiscount >= activeRegion.minFreeOrder;
  const deliveryFee = subtotalAfterDiscount === 0 ? 0 : isDeliveryFree ? 0 : activeRegion.deliveryFee;
  const totalAmount = subtotalAfterDiscount + deliveryFee;
  const amountToFreeDelivery = activeRegion.minFreeOrder - subtotalAfterDiscount;

  // Add Item to Cart
  const handleAddToCart = (product: Product, variantId?: string) => {
    const chosenVariantId = variantId || selectedVariants[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVariantId) || product.variants[0];

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { product, variant, quantity: 1 }];
      }
    });

    // Pulse animation/feedback
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const updateCartQuantity = (productId: string, variantId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.variant.id === variantId) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Add Lunar New Year Bundle to order builder
  const handleSelectLNYBundle = () => {
    const lnyProducts = [
      { id: 'sate-daging-mala', variantType: 'pkt', qty: 1 },
      { id: 'dumpling-ayam-cendawan', variantType: 'pck', qty: 1 },
      { id: 'soup-pir-gula-batu', variantType: 'pkt', qty: 1 }
    ];

    setCart((prevCart) => {
      let updated = [...prevCart];
      lnyProducts.forEach((pInfo) => {
        const product = productsList.find((p) => p.id === pInfo.id);
        if (product) {
          const variant = product.variants.find((v) => v.type === pInfo.variantType) || product.variants[0];
          const existingIndex = updated.findIndex(
            (item) => item.product.id === product.id && item.variant.id === variant.id
          );

          if (existingIndex > -1) {
            // If already in cart, increment quantity
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + pInfo.qty
            };
          } else {
            // Add new cart item
            updated.push({ product, variant, quantity: pInfo.qty });
          }
        }
      });
      return updated;
    });

    // Automatically open the cart drawer to show items added
    setIsCartOpen(true);
  };

  // Dynamic Recommender logic
  const handleRecommenderClick = (goal: string) => {
    setRecommenderGoal(goal);
    let matched: Product[] = [];
    if (goal === 'quick-lunch') {
      // Ready to eat and dumplings are fast
      matched = productsList.filter((p) => p.category === 'ready-to-eat' || p.category === 'dumpling').slice(0, 3);
    } else if (goal === 'family-feast') {
      // Satay and premium hotpot soup bases
      matched = productsList.filter((p) => p.category === 'satay' || p.category === 'sauce').slice(0, 3);
    } else if (goal === 'refreshing') {
      // Chinese desserts and herbal tea
      matched = productsList.filter((p) => p.category === 'dessert-soup' || p.category === 'tea').slice(0, 3);
    } else if (goal === 'wellness') {
      // Herbal instant soup packs
      matched = productsList.filter((p) => p.category === 'herbal-soup').slice(0, 3);
    }
    setRecommendedProducts(matched);
  };

  // Format and generate WhatsApp Link
  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `🍡 *${COMPANY_CONTACT.name} - BORANG PESANAN / 订单明细* 🍡\n`;
    message += `==============================\n`;
    
    // Add corporate profile fields if present
    if (companyName.trim()) {
      message += `🏢 *Syarikat / 公司名称:* ${companyName}\n`;
    }
    if (companyRegNo.trim()) {
      message += `🆔 *No. SSM / 商业注册号:* ${companyRegNo}\n`;
    }
    if (businessType) {
      message += `💼 *Jenis Bisnes / 业务类型:* ${businessType}\n`;
    }
    if (senderName.trim()) {
      message += `👤 *Pelanggan / 客户:* ${senderName}\n`;
    }
    message += `📍 *Kawasan / 收货区域:* ${activeRegion.nameZh} / ${activeRegion.name}\n`;
    if (senderAddress.trim()) {
      message += `🏠 *Alamat / 地址:* ${senderAddress}\n`;
    }
    message += `==============================\n\n`;
    message += `📦 *PRODUK YANG DIPESAN / 订购单:* \n`;

    cart.forEach((item, index) => {
      const p = item.product;
      const v = item.variant;
      const itemTotal = v.price * item.quantity;
      message += `${index + 1}. *${p.name} (${p.nameZh})*\n`;
      message += `   Size: ${v.size}\n`;
      message += `   Qty: ${item.quantity} x RM${v.price.toFixed(2)} = *RM${itemTotal.toFixed(2)}*\n`;
      if (p.barcode) {
        message += `   Barcode: ${p.barcode}\n`;
      }
      message += `\n`;
    });

    message += `------------------------------\n`;
    message += `💵 *Subtotal / 商品总计:* RM${subtotal.toFixed(2)}\n`;
    if (memberDiscountApplied) {
      message += `🉐 *Diskaun Ahli / 会员折扣 (10%):* -RM${discountAmount.toFixed(2)}\n`;
      message += `💸 *Subtotal Selepas Diskaun / 折扣后小计:* RM${subtotalAfterDiscount.toFixed(2)}\n`;
    }
    message += `🚚 *Penghantaran / 运费:* ${
      deliveryFee === 0 ? 'PERCUMA / 免运费' : `RM${deliveryFee.toFixed(2)}`
    }\n`;
    message += `💰 *JUMLAH KESELURUHAN / 总付款额:* *RM${totalAmount.toFixed(2)}*\n\n`;

    message += `==============================\n`;
    message += `⚠️ _Sila sahkan ketersediaan stok & tarikh penghantaran bersama wakil jualan kami._\n`;
    message += `_请与我们的客服主管确认库存和配送日期。谢谢！_`;

    const encodedText = encodeURIComponent(message);
    const cleanPhone = COMPANY_CONTACT.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  // Get dynamic category icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="h-5 w-5" />;
      case 'Soup': return <Soup className="h-5 w-5" />;
      case 'Cookie': return <Cookie className="h-5 w-5" />;
      case 'ChefHat': return <ChefHat className="h-5 w-5" />;
      case 'Sparkles': return <Sparkles className="h-5 w-5" />;
      case 'Beef': return <Beef className="h-5 w-5" />;
      case 'Coffee': return <Coffee className="h-5 w-5" />;
      case 'HeartPulse': return <HeartPulse className="h-5 w-5" />;
      case 'Grid': return <Grid className="h-5 w-5" />;
      default: return <Grid className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-900 font-sans" id="aem-landing-app">
      
      {/* TOP STRIP / ANNOUNCEMENT BAR */}
      <div className="bg-brand-green text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 border-b border-brand-green-hover text-center" id="top-strip">
        <div className="max-w-7xl mx-auto">
          <span>🇲🇾 MALAYSIAN CULINARY STYLE • PREMIUM EXPORT SELECTIONS BY AEM</span>
        </div>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-slate-200 transition-all duration-200" id="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-extrabold text-slate-700" id="desktop-nav">
              <a href="#hero" className="hover:text-brand-green transition-colors">{t.home}</a>
              <a href="#catalog" className="hover:text-brand-green transition-colors">{t.products}</a>
              <a href="#story" className="hover:text-brand-green transition-colors">{t.story}</a>
              <a href="#company-profile" className="hover:text-brand-green transition-colors">{t.profile}</a>
              <a href="#footer" className="hover:text-brand-green transition-colors">{t.contact}</a>
            </nav>

            {/* Language Selection & Cart Action */}
            <div className="flex items-center gap-4" id="header-actions">
              {/* Language Switcher */}
              <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-[4px] text-[10px] font-black text-slate-600 border border-slate-200" id="lang-switcher">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${lang === 'en' ? 'bg-brand-green text-white shadow-sm' : 'hover:bg-slate-200'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('zh')}
                  className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${lang === 'zh' ? 'bg-brand-green text-white shadow-sm' : 'hover:bg-slate-200'}`}
                >
                  简体
                </button>
                <button
                  onClick={() => setLang('ms')}
                  className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${lang === 'ms' ? 'bg-brand-green text-white shadow-sm' : 'hover:bg-slate-200'}`}
                >
                  BM
                </button>
              </div>

              {/* Simplified switcher for mobile */}
              <div className="lg:hidden flex items-center bg-slate-100 rounded-[4px] px-2.5 py-1 border border-slate-200" id="lang-switcher-mobile">
                <Globe className="h-4 w-4 text-slate-500 mr-1" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="zh">中文</option>
                  <option value="en">EN</option>
                  <option value="ms">BM</option>
                </select>
              </div>

              {/* Instant WhatsApp Sales CTA */}
              <a
                href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20get%20an%20instant%20B2B%20wholesale%20price%20quote%20and%20product%20catalog."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2.5 rounded-[4px] font-extrabold text-xs tracking-wider uppercase shadow-sm transition-all transform hover:-translate-y-0.5"
                title="Direct WhatsApp Sales Line"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>WhatsApp Quote</span>
              </a>

              {/* Order Builder / Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-brand-green hover:bg-brand-green-hover text-white flex items-center gap-2 px-4 py-2.5 rounded-[4px] font-extrabold text-xs tracking-wider uppercase shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                id="cart-trigger-btn"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">{t.orderBuilder}</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white font-black text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-white shadow">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-brand-green cursor-pointer rounded-[4px] active:bg-slate-100 transition-colors"
                id="mobile-menu-toggle"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-slate-900" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 text-white text-sm font-bold border-b border-slate-800 shadow-xl overflow-hidden"
              id="mobile-nav-panel"
            >
              <div className="px-5 py-4 flex flex-col gap-2.5 text-left">
                <a
                  href="#hero"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[4px] bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all"
                >
                  <span>{t.home}</span>
                  <span className="text-slate-500 text-xs">→</span>
                </a>
                <a
                  href="#catalog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[4px] bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all"
                >
                  <span>{t.products}</span>
                  <span className="text-slate-500 text-xs">→</span>
                </a>
                <a
                  href="#story"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[4px] bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all"
                >
                  <span>{t.story}</span>
                  <span className="text-slate-500 text-xs">→</span>
                </a>
                <a
                  href="#company-profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[4px] bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all"
                >
                  <span>{t.profile}</span>
                  <span className="text-slate-500 text-xs">→</span>
                </a>
                <a
                  href="#footer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-[4px] bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all"
                >
                  <span>{t.contact}</span>
                  <span className="text-slate-500 text-xs">→</span>
                </a>

                {/* Quick Contact Buttons inside Mobile Menu Drawer */}
                <div className="pt-2 border-t border-slate-800 flex flex-col gap-2 mt-1">
                  <a
                    href="https://wa.me/60149413545"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-[4px] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-slate-950" />
                    <span>WhatsApp {lang === 'zh' ? '销售部 (+6014-941 3545)' : 'Sales Dept'}</span>
                  </a>
                  <a
                    href={`tel:${COMPANY_CONTACT.phone.replace(/[^0-9+]/g, '')}`}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-[4px] flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-green" />
                    <span>{lang === 'zh' ? '拨打电话咨询' : 'Call Phone Inquiry'}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* B2B MOVING PROMOTION BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-sans py-4 border-b border-amber-500/20 shadow-sm overflow-hidden z-30 relative animate-pulse" id="b2b-moving-banner">
        <div className="marquee-container w-full">
          {[1, 2].map((i) => (
            <div key={i} className="marquee-content whitespace-nowrap flex items-center shrink-0">
              <div className="flex items-center gap-16 uppercase font-black text-sm tracking-wide">
                
                <span className="flex items-center gap-3">
                  <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-3 py-1 rounded-[2px] uppercase tracking-wider">B2B PARTNER</span>
                  <span className="text-slate-900 font-extrabold font-sans text-sm">
                    Ready to Grow Your Restaurant Business? 让我们成为您的长期稳定的食品供应伙伴！
                  </span>
                </span>

                <span className="flex items-center gap-3 border-l border-slate-900/10 pl-6">
                  <span className="bg-slate-900/10 text-slate-900 text-[11px] font-black px-3.5 py-1 rounded-[2px]">
                    贴牌代工 (OEM/ODM)
                  </span>
                </span>

                <span className="flex items-center gap-3 border-l border-slate-900/10 pl-6">
                  <span className="bg-slate-900/10 text-slate-900 text-[11px] font-black px-3.5 py-1 rounded-[2px]">
                    冷链直达门店
                  </span>
                </span>

                <span className="flex items-center gap-3 border-l border-slate-900/10 pl-6">
                  <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-3 py-1 rounded-[2px] uppercase tracking-wider">B2B PARTNER</span>
                  <span className="text-slate-900 font-extrabold font-sans text-sm">
                    Ready to Grow Your Restaurant Business? 让我们成为您的长期稳定的食品供应伙伴！
                  </span>
                </span>

                <span className="flex items-center gap-3 border-l border-slate-900/10 pl-6">
                  <span className="bg-slate-900/10 text-slate-900 text-[11px] font-black px-3.5 py-1 rounded-[2px]">
                    贴牌代工 (OEM/ODM)
                  </span>
                </span>

                <span className="flex items-center gap-3 border-l border-slate-900/10 pl-6">
                  <span className="bg-slate-900/10 text-slate-900 text-[11px] font-black px-3.5 py-1 rounded-[2px]">
                    冷链直达门店
                  </span>
                </span>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-12 lg:py-20 border-b border-slate-200" id="hero">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left" id="hero-content">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-brand-green font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded-[4px] border border-emerald-100 self-center lg:self-start shadow-sm">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-ping" />
                {t.halalCertified}
              </div>

              {/* Title with editorial design */}
              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-none tracking-tighter">
                {t.heroTitle} <br className="hidden sm:inline" />
                <span className="text-brand-green inline-block mt-2">
                  {t.heroSub}
                </span>
              </h1>

              {/* Multi-language description */}
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed flex flex-col gap-2">
                <p className="font-extrabold text-slate-900 tracking-wide text-base sm:text-lg">
                  {t.heroDesc}
                </p>
                <p className="text-slate-600 font-medium text-xs sm:text-sm">
                  {t.heroDescZh}
                </p>
              </div>

              {/* Primary Call to Actions for Instant B2B Conversion */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 mt-2">
                <a
                  href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20get%20an%20instant%20B2B%20wholesale%20price%20quote%20for%20my%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white text-center font-extrabold uppercase tracking-wider text-xs px-6 py-4 rounded-[4px] shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                  <span>{lang === 'zh' ? '⚡ WhatsApp 5分钟快速报价' : '⚡ 5-Min WhatsApp B2B Quote'}</span>
                </a>

                <a
                  href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20request%20a%20Free%20Sample%20Kit%20for%20my%20restaurant/supermarket."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase tracking-wider text-xs px-6 py-4 rounded-[4px] shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🎁</span>
                  <span>{lang === 'zh' ? '索取免费试吃包' : 'Request Free Sample Kit'}</span>
                </a>

                <a
                  href="#catalog"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-center font-bold uppercase tracking-wider text-xs px-6 py-4 rounded-[4px] shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {t.ctaBrowse}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Delivery highlight ticker */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[11px] text-slate-500 mt-4 border-t border-slate-150 pt-6 uppercase font-bold tracking-wider">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-brand-green" />
                  <span>Klang Valley Free Delivery above <b className="text-slate-900">RM1000</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-green" />
                  <span>Fresh Cold Chain Shipping: <b className="text-slate-900">2-5 Days</b></span>
                </div>
              </div>
            </div>

            {/* Right Food Visual & Fast B2B Conversion Card */}
            <div className="lg:col-span-5 flex flex-col gap-4" id="hero-showcase">
              {/* Appetizing Collage Card */}
              <div className="relative bg-white border border-slate-200 p-2 rounded-[4px] overflow-hidden shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
                  alt="AEM Halal Chinese Frozen Food & Dim Sum"
                  className="w-full h-56 sm:h-64 object-cover rounded-[2px] shadow-inner transition-transform group-hover:scale-105 duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-slate-900/90 text-amber-400 font-extrabold text-[10px] px-3 py-1 rounded-[2px] backdrop-blur-xs border border-amber-400/30 uppercase tracking-widest shadow-lg">
                  100% JAKIM HALAL
                </div>
              </div>

              {/* Instant B2B Conversion Card */}
              <div className="bg-slate-900 text-white p-5 rounded-[4px] border-2 border-brand-green/80 shadow-xl flex flex-col gap-3 relative overflow-hidden" id="instant-b2b-quote-card">
                <div className="absolute top-0 right-0 bg-brand-green text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-[4px] tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" />
                  Instant B2B
                </div>

                <div>
                  <h3 className="font-sans font-black text-sm sm:text-base text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="text-brand-green">⚡</span>
                    {lang === 'zh' ? '1秒快速获取 B2B 报价与样品' : 'Fast 1-Click B2B Wholesale Inquiry'}
                  </h3>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                    {lang === 'zh' ? '选择您的需求类型，即刻直连 WhatsApp 销售主管：' : 'Select your business inquiry to chat directly with sales head:'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                  <a
                    href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20get%20your%20Wholesale%20Catalog%20and%20B2B%20Price%20List."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-750 text-white font-bold p-2.5 rounded-[3px] border border-slate-700 hover:border-brand-green transition-all flex flex-col gap-0.5 group"
                  >
                    <span className="text-brand-green text-[11px] font-extrabold group-hover:underline">📄 Wholesale Catalog</span>
                    <span className="text-slate-400 text-[10px]">{lang === 'zh' ? '获取批发报价表' : 'Price List PDF'}</span>
                  </a>

                  <a
                    href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20request%20a%20Free%20Sample%20Kit%20for%20testing."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-750 text-white font-bold p-2.5 rounded-[3px] border border-slate-700 hover:border-amber-400 transition-all flex flex-col gap-0.5 group"
                  >
                    <span className="text-amber-400 text-[11px] font-extrabold group-hover:underline">🎁 Free Sample Kit</span>
                    <span className="text-slate-400 text-[10px]">{lang === 'zh' ? '申请免费样品' : 'Taste Test Pack'}</span>
                  </a>

                  <a
                    href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20am%20interested%20in%20OEM/ODM%20Custom%20Recipe%20and%20Private%20Labeling."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-750 text-white font-bold p-2.5 rounded-[3px] border border-slate-700 hover:border-brand-green transition-all flex flex-col gap-0.5 group"
                  >
                    <span className="text-emerald-400 text-[11px] font-extrabold group-hover:underline">🏭 OEM / ODM Private Label</span>
                    <span className="text-slate-400 text-[10px]">{lang === 'zh' ? '代工定制贴牌' : 'Custom Formulation'}</span>
                  </a>

                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-brand-green hover:bg-brand-green-hover text-white font-black p-2.5 rounded-[3px] border border-brand-green transition-all flex flex-col justify-center text-left cursor-pointer group shadow-sm"
                  >
                    <span className="text-white text-[11px] font-black flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {lang === 'zh' ? '🛒 选购单生成器' : '🛒 Build Order'}
                    </span>
                    <span className="text-emerald-100 text-[10px]">{lang === 'zh' ? '在线选购预估' : 'Self Purchase Builder'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic font-normal leading-tight mt-1 text-left">
                  {t.salesDisclaimer}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPANY PROFILE SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004B2D] via-[#005A36] to-[#00331E] text-white py-16 border-b-4 border-brand-gold" id="company-profile">
        {/* Subtle background decorative shapes for "Geometric Balance" */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 rotate-45 transform -translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-gold/5 -rotate-12 transform translate-x-20 translate-y-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Badge and Titles */}
            <div className="md:col-span-5 flex flex-col gap-4 text-left">
              <span className="self-start bg-brand-gold text-[#002214] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-[2px] shadow-sm">
                {lang === 'zh' ? '公司简介' : lang === 'ms' ? 'PROFIL SYARIKAT' : 'COMPANY PROFILE'}
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3.5xl text-brand-gold leading-tight tracking-tighter">
                中国风味 · 清真标准 <br />
                <span className="text-white text-lg sm:text-xl font-bold tracking-tight block mt-1">
                  Authentic Chinese Flavours, Made Halal
                </span>
              </h2>
              <div className="w-20 h-1 bg-brand-gold mt-2 rounded-full" />
            </div>

            {/* Right Column: Paragraph descriptions in Chinese & English */}
            <div className="md:col-span-7 flex flex-col gap-6 text-left border-l-0 md:border-l-2 border-brand-gold/20 md:pl-8">
              <p className="text-sm sm:text-base leading-relaxed text-emerald-50 font-medium">
                我们的产品涵盖中国菜、川菜、火锅汤底、烧烤串、料理包、酱料、饺子、养生汤品及冷冻食品。每一款产品均采用优质原料，结合传统中式烹饪工艺与现代食品科技，在保留地道风味的同时，确保品质稳定、安全可靠，并符合清真食品要求。
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-emerald-100/85 font-sans italic border-t border-emerald-800/40 pt-4">
                Our product portfolio includes authentic Chinese cuisine, Sichuan specialties, hot pot soup bases, BBQ skewers, ready-to-eat meals, sauces, dumplings, herbal soups, and frozen foods. Every product is crafted using premium ingredients and modern food technology to preserve authentic flavours while ensuring consistent quality, food safety, and Halal compliance.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CORE B2B SERVICE CAPABILITIES SECTION */}
      <section className="bg-slate-50 py-16 border-b border-slate-200" id="highlights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-12 flex flex-col gap-3">
            {lang === 'zh' ? (
              <span className="text-brand-green text-3xl sm:text-4xl font-black tracking-tight block">
                合作共赢
              </span>
            ) : (
              <span className="text-xs font-extrabold tracking-widest text-brand-green uppercase">
                {lang === 'ms' ? 'KAPASITI & PERKHIDMATAN B2B' : 'B2B WHOLESALE & MANUFACTURING CAPABILITIES'}
              </span>
            )}
            <h2 className="font-sans font-black text-xl sm:text-3xl text-slate-900 leading-tight tracking-tighter">
              {lang === 'zh' ? (
                '三大核心业务，助力餐厅/连锁/酒店'
              ) : lang === 'ms' ? (
                '3 Kekuatan Utama Perniagaan B2B Kami'
              ) : (
                'Three Core Strengths Powering Your Business'
              )}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
              {lang === 'zh' ? '为客户提供高效、富有竞争力的稳定速冻食品供应链。' : lang === 'ms' ? 'Menyediakan rantaian bekalan makanan sejuk beku yang selamat, berkesan dan kompetitif.' : 'Delivering safe, certified, high-yield food manufacturing solutions across Southeast Asia.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-[4px] shadow-sm border border-slate-200 hover:border-brand-green/30 transition-all duration-300 flex flex-col gap-5 text-left group">
              <div className="p-3 bg-emerald-50 text-brand-green rounded-[4px] shrink-0 h-14 w-14 flex items-center justify-center transition-transform group-hover:scale-110">
                <Store className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-sans font-black text-slate-900 text-base uppercase tracking-wide">
                  {lang === 'zh' ? '大量现货 / Wholesale' : lang === 'ms' ? 'Bekalan Borong Besar' : 'Bulk Food Wholesale'}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {lang === 'zh' 
                    ? '长期为各大连锁火锅店、中西餐厅、茶餐室、学校及各大超市提供高复购、标准化的速冻产品。拥有稳定的高产能，可按需打包成商用大规格，显著降低采购与仓储成本。' 
                    : lang === 'ms'
                      ? 'Membekalkan produk sejuk beku bermutu tinggi dalam kuantiti besar untuk rangkaian restoran, hotel, kantin, dan pasar raya. Pakej komersial besar disediakan untuk mengurangkan kos pengurusan.'
                      : 'Supply standardized high-demand frozen foods to restaurant chains, hotels, central kitchens, canteens, and hypermarkets. Commercially sized bulk packaging options with competitive volume discounts.'}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-[4px] shadow-sm border border-slate-200 hover:border-brand-green/30 transition-all duration-300 flex flex-col gap-5 text-left group">
              <div className="p-3 bg-emerald-50 text-brand-green rounded-[4px] shrink-0 h-14 w-14 flex items-center justify-center transition-transform group-hover:scale-110">
                <Boxes className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-sans font-black text-slate-900 text-base uppercase tracking-wide">
                  {lang === 'zh' ? 'OEM & ODM 研发贴牌 / OEM' : lang === 'ms' ? 'Pembangunan OEM & ODM' : 'OEM & Private Labeling'}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {lang === 'zh' 
                    ? '提供专业的配方二次开发、极速打样、包材设计印刷到无菌恒温生产的一站式代工服务。无论是秘制烧烤串、特色汤品、饺子还是料理包，AEM 均能帮您实现品牌规模化量产。' 
                    : lang === 'ms'
                      ? 'Perkhidmatan sehenti daripada formula tersuai, penghasilan sampel pantas, reka bentuk pembungkusan hingga pengeluaran pukal steril. Sesuaikan sate, sup, dumpling atau sos mengikut jenama anda.'
                      : 'One-stop private label services. From custom recipe formulation, rapid sampling, and packaging design to sterile industrial-scale production. Bring your signature dumplings, skewers, or broths to market.'}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-[4px] shadow-sm border border-slate-200 hover:border-brand-green/30 transition-all duration-300 flex flex-col gap-5 text-left group">
              <div className="p-3 bg-emerald-50 text-brand-green rounded-[4px] shrink-0 h-14 w-14 flex items-center justify-center transition-transform group-hover:scale-110">
                <Truck className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-sans font-black text-slate-900 text-base uppercase tracking-wide">
                  {lang === 'zh' ? '全西马冷链干线配送 / Cold Chain' : lang === 'ms' ? 'Logistik Rantaian Sejuk' : 'Trunk Cold-Chain Logistics'}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {lang === 'zh' 
                    ? '我们自备并联营专业温控冷藏车队，全程负 18 摄氏度恒温保障。配送干线全面覆盖雪隆区及西马半岛各州主要城镇，支持全程温度追溯，保障货物离厂到库品质始终如一。' 
                    : lang === 'ms'
                      ? 'Lori sejuk beku komersial beroperasi pada suhu -18°C sepanjang perjalanan. Meliputi Lembah Klang dan semua bandar utama di Semenanjung Malaysia demi menjamin keselamatan kualiti produk.'
                      : 'Equipped with a commercial refrigerated truck fleet ensuring sub-zero -18°C temperature control. Nationwide trunk logistics routes across Peninsular Malaysia for safe, stable cargo delivery.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FOOD CATALOG */}
      <section className="py-16 bg-white" id="catalog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col gap-2">
            <span className="text-xs font-extrabold tracking-widest text-brand-green uppercase">
              {lang === 'zh' ? '精品速冻•全新升级' : 'AEM COLD TRUCK PREMIUM SELECTIONS'}
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-slate-900 leading-none tracking-tighter">
              {t.catalogTitle}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {t.catalogSub}
            </p>
          </div>

          {/* Search Bar & Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-50 p-4 rounded-[4px] border border-slate-200" id="catalog-controls">
            {/* Live Search field */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white border border-slate-200 rounded-[4px] pl-10 pr-4 py-2.5 text-xs outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/25 transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Total count badge */}
            <div className="shrink-0 text-[10px] uppercase font-black tracking-wider text-slate-500" id="products-count-badge">
              {filteredProducts.length} {lang === 'zh' ? '个美食选项符合搜索条件' : 'items matching filter criteria'}
            </div>
          </div>

          {/* Catalog Layout Grid (Category Sidebar + Product Grid) */}
          {selectedCategory === 'all' && !searchQuery ? (
            <div className="w-full" id="categories-grid-view">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* DB Categories */}
                {CATEGORIES.map((cat) => {
                  const catProductsCount = productsList.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const el = document.getElementById('catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white rounded-[6px] border border-slate-200 p-5 sm:p-6 text-left hover:border-brand-green hover:-translate-y-1 hover:shadow-md transition-all group flex flex-col justify-between h-full cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/[0.02] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                      
                      <div>
                        {/* Icon Container */}
                        <div className="w-12 h-12 rounded-[6px] bg-emerald-50 text-brand-green flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-all shadow-xs shrink-0">
                          {getCategoryIcon(cat.iconName)}
                        </div>
                        
                        <h3 className="font-sans font-black text-slate-900 text-sm sm:text-base mb-1 group-hover:text-brand-green transition-colors leading-tight">
                          {cat.nameZh}
                        </h3>
                        <p className="text-slate-400 font-bold text-[10px] sm:text-xs tracking-wider uppercase mb-2 line-clamp-1">
                          {cat.name}
                        </p>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-2 font-normal">
                          {lang === 'zh'
                            ? (cat.id === 'ready-to-eat' ? '精选地道中式招牌菜肴，加热即食。'
                               : cat.id === 'satay' ? '秘制沙爹烤串，香气四溢。'
                               : cat.id === 'dumpling' ? '皮薄馅足的多汁丰盈饺子。'
                               : cat.id === 'diperap' ? '秘制腌制肉片，鲜嫩入味。'
                               : cat.id === 'sauce' ? '浓郁火锅底料与秘制酱料。'
                               : cat.id === 'snack' ? '金黄酥脆的精致小吃与甜品。'
                               : cat.id === 'herbal-soup' ? '滋补养生膳食速递汤包。'
                               : cat.id === 'dessert-soup' ? '传统清润椰香港式糖水。'
                               : cat.id === 'tea' ? '天然花草袋泡茶，清香怡人。'
                               : '专业风味调味料系列。')
                            : cat.description
                          }
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-[3px]">
                          {catProductsCount} {lang === 'zh' ? '款商品' : 'items'}
                        </span>
                        <span className="text-xs font-black text-brand-green group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          {lang === 'zh' ? '进入查看' : 'View'} →
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Special "My Favorites" Card in Grid */}
                <button
                  onClick={() => {
                    setSelectedCategory('favorites');
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white rounded-[6px] border border-slate-200 p-5 sm:p-6 text-left hover:border-rose-500 hover:-translate-y-1 hover:shadow-md transition-all group flex flex-col justify-between h-full cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/[0.02] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                  
                  <div>
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-[6px] bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs shrink-0">
                      <Heart className="h-5 w-5 fill-rose-500/20 group-hover:fill-white" />
                    </div>
                    
                    <h3 className="font-sans font-black text-slate-900 text-sm sm:text-base mb-1 group-hover:text-rose-600 transition-colors leading-tight">
                      我的收藏商品
                    </h3>
                    <p className="text-slate-400 font-bold text-[10px] sm:text-xs tracking-wider uppercase mb-2">
                      My Favorites
                    </p>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-2 font-normal">
                      {lang === 'zh' ? '您收藏的所有招牌速冻美食及大单专属产品，随时快速下单。' : 'All your favorited signature frozen treats and high-demand selections.'}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded-[3px]">
                      {favoriteIds.length} {lang === 'zh' ? '款商品' : 'items'}
                    </span>
                    <span className="text-xs font-black text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {lang === 'zh' ? '进入查看' : 'View'} →
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* Sidebar Categories Filter (List format for premium desktop, overflow-row for mobile) */}
              <div className="lg:col-span-1" id="category-sidebar">
                {/* Category selector header */}
                <h3 className="hidden lg:block font-sans font-black uppercase tracking-wider text-slate-950 text-xs mb-4 text-left border-b border-slate-200 pb-2.5">
                  {lang === 'zh' ? '食品分类' : 'Food Categories'}
                </h3>
                
                {/* Categories list container */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-1.5 shrink-0 scrollbar-none" id="categories-list">
                  {/* All Categories Item */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-[4px] font-bold text-xs shrink-0 text-left transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-brand-green text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    <Grid className="h-4 w-4 shrink-0" />
                    <span className="flex flex-col leading-tight">
                      <span className="font-extrabold">全部分类</span>
                      <span className={`text-[10px] font-medium opacity-85 ${selectedCategory === 'all' ? 'text-emerald-100' : 'text-slate-500'}`}>All Categories</span>
                    </span>
                  </button>

                  {/* My Favorites Item */}
                  <button
                    onClick={() => setSelectedCategory('favorites')}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-[4px] font-bold text-xs shrink-0 text-left transition-all cursor-pointer ${
                      selectedCategory === 'favorites'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    <Heart className={`h-4 w-4 shrink-0 ${selectedCategory === 'favorites' ? 'fill-white text-white' : 'text-rose-500 fill-rose-500/20'}`} />
                    <span className="flex items-center gap-1.5 justify-between w-full">
                      <span className="flex flex-col leading-tight">
                        <span className="font-extrabold">我的收藏</span>
                        <span className={`text-[10px] font-medium opacity-85 ${selectedCategory === 'favorites' ? 'text-rose-100' : 'text-slate-500'}`}>My Favorites</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${selectedCategory === 'favorites' ? 'bg-rose-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {favoriteIds.length}
                      </span>
                    </span>
                  </button>

                  {/* DB Categories */}
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-[4px] font-bold text-xs shrink-0 text-left transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-brand-green text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      {getCategoryIcon(cat.iconName)}
                      <span className="flex flex-col leading-tight">
                        <span className="font-extrabold">{cat.nameZh}</span>
                        <span className={`text-[10px] font-medium opacity-85 ${selectedCategory === cat.id ? 'text-emerald-100' : 'text-slate-500'}`}>{cat.name}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* Informational sidebar banner */}
                <div className="hidden lg:flex flex-col gap-4 mt-8 bg-emerald-50/20 border border-brand-green/10 p-5 rounded-[4px] text-left">
                  <div className="p-2 bg-emerald-50 rounded-[2px] text-brand-green self-start">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs">
                    {lang === 'zh' ? '冷库锁鲜配送' : 'Cold Chain Storage'}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {lang === 'zh'
                      ? '所有速冻产品均为极速闪冻，配送过程使用恒温冷藏车，完美锁住出锅时刻的美味。'
                      : 'Our rapid flash freezing and refrigerated dispatch guarantee that all dishes arrive completely frozen.'}
                  </p>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="lg:col-span-3">
                {/* Category Title Header and back link */}
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="self-start flex items-center gap-1.5 text-xs font-black text-brand-green hover:text-brand-green-hover transition-colors bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-2 rounded-[3px] shadow-xs border border-brand-green/10 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{lang === 'zh' ? '返回所有分类' : 'Back to Categories'}</span>
                  </button>
                  
                  <div className="flex items-center gap-3 mt-2 border-b border-slate-150 pb-4">
                    <div className="p-2.5 bg-emerald-50 text-brand-green rounded-[4px] shrink-0">
                      {selectedCategory === 'favorites' ? (
                        <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                      ) : (
                        getCategoryIcon(CATEGORIES.find((c) => c.id === selectedCategory)?.iconName || 'Grid')
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                        {selectedCategory === 'favorites' 
                          ? '我的收藏商品' 
                          : CATEGORIES.find((c) => c.id === selectedCategory)?.nameZh || '搜索结果'
                        }
                      </h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {selectedCategory === 'favorites'
                          ? 'Saved items'
                          : CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Search results'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="bg-slate-50 rounded-[4px] border border-slate-200 p-12 text-center text-slate-400" id="no-products-found">
                    <AlertCircle className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-semibold">{lang === 'zh' ? '未找到符合要求的美食，请重新输入关键词或选择其他类别。' : 'No products found matching your search. Please try a different query.'}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6" id="products-grid">
                    {adminMode && (
                      <div 
                        onClick={() => {
                          const newId = 'custom-' + Date.now();
                          const newProd: Product = {
                            id: newId,
                            name: 'New Gourmet Food',
                            nameZh: '新增精品美食',
                            category: selectedCategory === 'all' || selectedCategory === 'favorites' ? 'satay' : selectedCategory,
                            barcode: '955' + Math.floor(1000000000 + Math.random() * 9000000000),
                            image: '',
                            description: 'Premium raw ingredients produced under rigorous quality management.',
                            descriptionZh: '精选上等原材料，在严格的质量控制和无尘环境中生产制造。',
                            variants: [
                              { id: 'v1', size: 'Standard / 规格', price: 10, type: 'pkt' }
                            ]
                          };
                          
                          const nextList = [newProd, ...productsList];
                          saveProductsList(nextList);
                          setSelectedProductDetails(newProd);
                        }}
                        className="bg-white/50 border-2 border-dashed border-slate-300 rounded-[6px] p-6 text-center hover:border-brand-green hover:bg-emerald-50/10 cursor-pointer flex flex-col items-center justify-center min-h-[220px] transition-all group"
                      >
                        <Plus className="h-8 w-8 text-slate-400 group-hover:text-brand-green mb-2 transition-colors" />
                        <span className="font-extrabold text-sm text-slate-700 group-hover:text-brand-green transition-colors">{lang === 'zh' ? '添加新商品' : 'Add New Product'}</span>
                      </div>
                    )}

                    {filteredProducts.map((p) => {
                      const selectedVariantId = selectedVariants[p.id] || (p.variants.length > 0 ? p.variants[0].id : '');
                      const selectedVariant = p.variants.find((v) => v.id === selectedVariantId) || p.variants[0];

                      return (
                        <div 
                          key={p.id}
                          className="bg-white rounded-[6px] border border-slate-200 shadow-xs flex flex-col h-full relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all duration-250 text-left"
                        >
                          {/* Card Top Section with Category Badge & Favorite button */}
                          <div className="p-4 pb-2.5 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50">
                            {adminMode ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingProduct(p);
                                }}
                                className="bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-[2px] shadow-sm border border-amber-400 flex items-center gap-1 hover:bg-amber-400 transition-all cursor-pointer z-10"
                              >
                                <span>✏️ {lang === 'zh' ? '编辑商品' : 'Edit Product'}</span>
                              </button>
                            ) : (
                              <div className="bg-slate-100 text-slate-600 font-bold text-[8px] tracking-wide uppercase py-0.5 px-2 rounded-[2px] border border-slate-200/50 flex items-center gap-1">
                                <span className="w-1 h-1 bg-brand-green rounded-full" />
                                {(() => {
                                  const catObj = CATEGORIES.find((c) => c.id === p.category);
                                  return (
                                    <span>{catObj ? `${catObj.nameZh} / ${catObj.name}` : p.category}</span>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(p.id);
                              }}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-full transition-all cursor-pointer z-10"
                              title={favoriteIds.includes(p.id) ? (lang === 'zh' ? '取消收藏' : 'Remove from Favorites') : (lang === 'zh' ? '收藏商品' : 'Add to Favorites')}
                            >
                              <Heart
                                className={`h-4 w-4 transition-all duration-200 active:scale-90 ${
                                  favoriteIds.includes(p.id)
                                    ? 'fill-rose-500 text-rose-500 scale-110'
                                    : 'text-slate-400'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Content Box */}
                          <div className="p-4 flex flex-col justify-between flex-grow text-left">
                            
                            {/* Titles and Desc */}
                            <div 
                              className="flex flex-col gap-1.5 cursor-pointer"
                              onClick={() => setSelectedProductDetails(p)}
                            >
                              <div className="flex flex-col leading-none">
                                <span className="font-sans font-black text-base text-slate-950 line-clamp-1 flex items-center justify-between gap-1">
                                  {p.nameZh}
                                  <span className="shrink-0 text-[8px] font-black tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.5 rounded-[2px] uppercase">
                                    {lang === 'zh' ? '支持OEM' : 'OEM Ready'}
                                  </span>
                                </span>
                                <span className="text-[11px] font-bold text-slate-400 line-clamp-1 tracking-wide mt-1">
                                  {p.name}
                                </span>
                              </div>
                              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed min-h-[32px] mt-1.5">
                                {lang === 'zh' ? p.descriptionZh : p.description}
                              </p>

                              {p.id === 'snack-ice-cream-goreng' && (
                                <div className="mt-2 flex flex-col gap-1">
                                  <span className="text-[9px] font-black text-brand-green tracking-wider uppercase">
                                    {lang === 'zh' ? '提供 3 种口味选择 :' : '3 FLAVORS SELECTION :'}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-[2px] shadow-2xs">
                                      {lang === 'zh' ? '🍦 香草 Vanilla' : '🍦 Vanilla'}
                                    </span>
                                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-amber-900/10 text-amber-950 border border-amber-900/20 rounded-[2px] shadow-2xs">
                                      {lang === 'zh' ? '🍫 巧克力 Chocolate' : '🍫 Chocolate'}
                                    </span>
                                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-[2px] shadow-2xs">
                                      {lang === 'zh' ? '🍠 芋泥 Yam' : '🍠 Yam'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Sizing and Variant choosing */}
                            <div className="mt-4 border-t border-slate-150 pt-3.5 flex flex-col gap-3">
                              {p.variants.length > 1 ? (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                                    {lang === 'zh' ? '选择规格 :' : 'CHOOSE SPECIFICATION :'}
                                  </span>
                                  <div className="grid grid-cols-2 gap-1.5" id={`variants-${p.id}`}>
                                    {p.variants.map((v) => (
                                      <button
                                        key={v.id}
                                        onClick={() => setSelectedVariants((prev) => ({ ...prev, [p.id]: v.id }))}
                                        className={`text-[10px] font-bold p-1.5 rounded-[4px] border text-center transition-all cursor-pointer ${
                                          selectedVariant.id === v.id
                                            ? 'border-brand-green bg-emerald-50/50 text-brand-green font-black'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                                        }`}
                                      >
                                        {v.size.split('*').pop()?.trim() || v.size}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                                    {lang === 'zh' ? '产品规格' : 'PRODUCT SIZE'}
                                  </span>
                                  <span className="text-xs font-extrabold text-slate-600">
                                    {selectedVariant.size}
                                  </span>
                                </div>
                              )}

                              {/* Price & Add to Cart Container */}
                              <div className="flex items-center justify-between gap-2 mt-1">
                                {/* Price */}
                                <div className="flex flex-col text-left leading-none">
                                  <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                                    PRICE (RM)
                                  </span>
                                  <span className="text-xl font-black text-brand-green mt-0.5">
                                    RM {selectedVariant.price.toFixed(2)}
                                  </span>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedProductDetails(p)}
                                    className="border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 flex items-center justify-center px-3 py-2 rounded-[4px] font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer h-9"
                                    title={lang === 'zh' ? '查看详情' : 'View Details'}
                                  >
                                    <span>{lang === 'zh' ? '详情' : 'Detail'}</span>
                                  </button>
                                  <button
                                    onClick={() => handleAddToCart(p, selectedVariant.id)}
                                    className="bg-brand-green hover:bg-brand-green-hover text-white flex items-center justify-center gap-1 px-3.5 py-2 rounded-[4px] font-bold uppercase text-[10px] tracking-wider shadow-sm transform transition-all active:scale-95 cursor-pointer h-9 text-nowrap"
                                    id={`add-btn-${p.id}`}
                                  >
                                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                                    <span>{lang === 'zh' ? '加购' : 'Add'}</span>
                                  </button>
                                </div>
                              </div>

                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Grid Navigation Helper at the bottom */}
                <div className="mt-12 bg-slate-50 border border-slate-200 p-6 rounded-[4px] text-center flex flex-col items-center gap-3">
                  <p className="text-xs text-slate-500 font-bold">
                    {lang === 'zh' ? '想看看其他食品分类吗？' : 'Want to view other food categories?'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-brand-green hover:bg-brand-green-hover text-white text-xs font-black px-4.5 py-2.5 rounded-[4px] shadow transition-all active:scale-95 cursor-pointer"
                  >
                    {lang === 'zh' ? '查看所有食品分类' : 'Browse All Categories'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* HERITAGE STORY & B2B INQUIRY SECTION - Combined Editorial Layout */}
      <section className="py-20 relative overflow-hidden bg-slate-900 text-white border-b border-slate-800" id="story">
        {/* Anchor for any residual b2b-inquiry navigation */}
        <div id="b2b-inquiry" className="absolute top-0" />

        {/* Background decorative images */}
        <div className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1920&q=80')" }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Narrative Content & Contact Info */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left" id="story-narrative">
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-white leading-tight tracking-tighter uppercase">
                {t.storyTitle}
              </h2>
              
              {/* Highlighted Brand Quote Banner */}
              {t.storyQuote && (
                <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-emerald-950/90 border-l-4 border-amber-400 rounded-r-lg shadow-xl my-2 backdrop-blur-md overflow-hidden group border-t border-r border-b border-white/5">
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-500"></div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-serif text-3xl sm:text-4xl leading-none select-none opacity-80 shrink-0 mt-0.5">“</span>
                    <blockquote className="font-serif font-bold text-sm sm:text-base md:text-[17px] text-amber-50/95 leading-relaxed tracking-wide shadow-sm">
                      {t.storyQuote}
                    </blockquote>
                    <span className="text-amber-400 font-serif text-3xl sm:text-4xl leading-none select-none opacity-80 shrink-0 self-end mb-0.5">”</span>
                  </div>
                </div>
              )}

              {/* Story content */}
              <div className="text-slate-300 text-xs sm:text-sm leading-relaxed flex flex-col gap-4">
                <p>{t.storyP1}</p>
                <p>{t.storyP2}</p>
                <p>{t.storyP3}</p>
                {t.storyP4 && <p className="text-[#34D399] font-sans font-black tracking-wide border-t border-white/5 pt-3 mt-1">{t.storyP4}</p>}
              </div>

              {/* Contact Info Cards */}
              <div className="flex flex-col gap-4 mt-2 bg-white/5 p-6 rounded-[4px] border border-white/10 shadow-sm text-left" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  {lang === 'zh' ? '销售与大量采购 Bulk Purchase 合作热线' : 'DIRECT SALES & BULK PURCHASE LINE'}
                </span>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-[#25D366] rounded-full">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase">{lang === 'zh' ? '销售部 WhatsApp' : 'Sales Department'}</span>
                    <a href="https://wa.me/60149413545" target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-brand-green transition-colors tracking-wide">
                      +6014-941 3545
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                  <div className="p-2 bg-emerald-500/10 text-brand-green rounded-full">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase">{lang === 'zh' ? '电子邮箱' : 'Official Email'}</span>
                    <a href={`mailto:${COMPANY_CONTACT.email}`} className="text-sm font-bold text-white hover:text-brand-green transition-colors">
                      {COMPANY_CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: B2B/PO Inquiry Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleB2bSubmit} className="bg-white p-8 rounded-[4px] border border-slate-200 shadow-2xl text-left flex flex-col gap-5 text-slate-900">
                <h3 className="font-sans font-black text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-green" />
                  {lang === 'zh' ? '留下您的资料 ，我们会尽快联系您' : lang === 'ms' ? 'Borang Kerjasama Perniagaan' : 'Business Partnership Form'}
                </h3>

                {b2bSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-slate-800 p-6 rounded-[4px] text-center flex flex-col items-center gap-3">
                    <div className="p-3 bg-emerald-500 text-white rounded-full">
                      <Check className="h-6 w-6 stroke-[3]" />
                    </div>
                    <h4 className="font-sans font-black text-slate-900 text-base">
                      {lang === 'zh' ? '意向提交成功！' : 'Inquiry Submitted!'}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm">
                      {lang === 'zh'
                        ? '我们已通过 WhatsApp 为您生成了大量采购 Bulk Purchase 合作意向文书。销售经理会即刻核对报价。您也可以随时直接点击下方的按钮重复发送。'
                        : 'We have generated your structured business message and directed you to WhatsApp. Our commercial team will get back to you shortly.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setB2bSuccess(false)}
                      className="mt-2 text-xs font-extrabold text-brand-green hover:underline cursor-pointer"
                    >
                      {lang === 'zh' ? '修改资料重新提交' : 'Edit info and resubmit'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                          {lang === 'zh' ? '公司/商号名称 (选填) :' : 'COMPANY/SHOP NAME (OPTIONAL) :'}
                        </label>
                        <input
                          type="text"
                          value={b2bCompanyName}
                          onChange={(e) => setB2bCompanyName(e.target.value)}
                          placeholder={lang === 'zh' ? '例如：南洋茶餐室集团' : 'e.g. Nanyang F&B Group'}
                          className="w-full text-xs font-bold border border-slate-200 rounded-[4px] px-3 py-2.5 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-800"
                        />
                      </div>

                      {/* Contact Person */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 tracking-wider uppercase flex items-center gap-1">
                          {lang === 'zh' ? '联系人姓名 * :' : 'CONTACT PERSON * :'}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={b2bContactName}
                          onChange={(e) => setB2bContactName(e.target.value)}
                          placeholder={lang === 'zh' ? '例如：陈经理 / Mr. Tan' : 'e.g. Mr. Tan'}
                          className="w-full text-xs font-bold border border-slate-200 rounded-[4px] px-3 py-2.5 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 tracking-wider uppercase flex items-center gap-1">
                          {lang === 'zh' ? '联系电话 * :' : 'CONTACT PHONE * :'}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={b2bPhone}
                          onChange={(e) => setB2bPhone(e.target.value)}
                          placeholder="e.g. +6014-9413545"
                          className="w-full text-xs font-bold border border-slate-200 rounded-[4px] px-3 py-2.5 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-800"
                        />
                      </div>

                      {/* Business Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                          {lang === 'zh' ? '您的业务类型 :' : 'YOUR BUSINESS TYPE :'}
                        </label>
                        <select
                          value={b2bBusinessType}
                          onChange={(e) => setB2bBusinessType(e.target.value)}
                          className="w-full text-xs font-bold border border-slate-200 rounded-[4px] px-3 py-2.5 bg-white focus:border-brand-green outline-none text-slate-800"
                        >
                          <option value="restaurant">{lang === 'zh' ? '餐饮连锁 / 独立餐馆' : 'Restaurant Chain / Bistro'}</option>
                          <option value="supermarket">{lang === 'zh' ? '超市 / 大型商超 / 零售店' : 'Supermarket / Hypermarket'}</option>
                          <option value="distributor">{lang === 'zh' ? '食品经销商 / 批发商' : 'Food Wholesaler / Distributor'}</option>
                          <option value="catering">{lang === 'zh' ? '酒店 / 团餐 / 中央厨房' : 'Hotel / Corporate Catering'}</option>
                          <option value="oem">{lang === 'zh' ? '贴牌代工品牌方 (OEM/ODM)' : 'Private Label Owner (OEM/ODM)'}</option>
                          <option value="other">{lang === 'zh' ? '其他合作类型' : 'Other Business'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Cooperation Interest */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                        {lang === 'zh' ? '您的合作意图 :' : 'COOPERATION PURPOSE :'}
                      </label>
                      <select
                        value={b2bInterest}
                        onChange={(e) => setB2bInterest(e.target.value)}
                        className="w-full text-xs font-bold border border-slate-200 rounded-[4px] px-3 py-2.5 bg-white focus:border-brand-green outline-none text-slate-800"
                      >
                        <option value="wholesale">{lang === 'zh' ? '采购 AEM 现有产品大货批发' : 'Buy Existing AEM Products Wholesale'}</option>
                        <option value="oem">{lang === 'zh' ? '定制配方研发 / 贴牌加工 (OEM)' : 'Custom Recipe / OEM Production'}</option>
                        <option value="distribution">{lang === 'zh' ? '成为 AEM 区域独家分销代理' : 'Apply for Regional Distribution Agent'}</option>
                        <option value="other">{lang === 'zh' ? '其他商务事宜咨询' : 'Other Business Consultations'}</option>
                      </select>
                    </div>

                    {/* Specific Requirements */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                        {lang === 'zh' ? '具体需求或留言 (选填) :' : 'SPECIFIC REQUIREMENTS / REMARKS (OPTIONAL) :'}
                      </label>
                      <textarea
                        value={b2bMessage}
                        onChange={(e) => setB2bMessage(e.target.value)}
                        placeholder={lang === 'zh' ? '请输入您具体的定制要求、主营区域、预计首次订货时间等...' : 'Please specify products of interest, expected sample delivery date, region of operation...'}
                        rows={3}
                        className="w-full text-xs font-bold border border-slate-200 rounded-[4px] px-3 py-2.5 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-800 resize-none"
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {lang === 'zh' ? '点击提交即表示您已阅读并同意我们的' : lang === 'ms' ? 'Dengan menghantar, anda telah membaca dan bersetuju dengan ' : 'By submitting, you confirm you have read and agree to our '}
                      <button
                        type="button"
                        onClick={() => setOpenPolicyType('terms')}
                        className="underline underline-offset-2 font-bold text-brand-green hover:text-emerald-700 cursor-pointer"
                      >
                        {lang === 'zh' ? '条款与细则、退款政策及 PDPA 个人资料保护声明' : lang === 'ms' ? 'Terma, Polisi Bayaran Balik & Notis PDPA' : 'Terms, Refund Policy & PDPA Notice'}
                      </button>
                      {lang === 'zh' ? '，并同意我们就此询价与您进行后续联系。' : lang === 'ms' ? ', dan bersetuju kami menghubungi anda untuk susulan.' : ', and consent to us contacting you for follow up.'}
                    </p>

                    <button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-[3px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon className="h-5 w-5 animate-pulse" />
                      {lang === 'zh' ? '发送大量采购 Bulk Purchase 合作意向至销售部 WhatsApp' : 'Send Bulk Purchase Inquiry to Sales WhatsApp'}
                    </button>
                    <p className="text-[10px] text-slate-400 italic text-center mt-2 font-normal leading-relaxed">
                      {t.salesDisclaimer}
                    </p>
                  </>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER & CONTACT INFO */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 text-left relative overflow-hidden" id="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-10 border-b border-slate-900 pb-12 mb-12">
            
            {/* Column 2: Navigation links */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <h4 className="text-white font-sans font-extrabold text-sm sm:text-base uppercase tracking-wider">
                {lang === 'zh' ? '快捷导航' : lang === 'ms' ? 'Navigasi Pantas' : 'Quick Navigation'}
              </h4>
              <div className="flex flex-col gap-3 text-sm sm:text-base font-medium text-left items-start">
                <a href="#hero" className="hover:text-brand-green transition-colors text-slate-300 hover:text-white">{t.home}</a>
                <a href="#catalog" className="hover:text-brand-green transition-colors text-slate-300 hover:text-white">{t.products}</a>
                <a href="#story" className="hover:text-brand-green transition-colors text-slate-300 hover:text-white">{t.story}</a>
                <a href="#company-profile" className="hover:text-brand-green transition-colors text-slate-300 hover:text-white">{t.profile}</a>
                
                <div className="border-t border-slate-850 w-full my-1" />

                <button
                  onClick={() => setOpenPolicyType('terms')}
                  className="hover:text-brand-green transition-colors flex items-center gap-2 cursor-pointer text-left text-sm sm:text-base font-medium text-slate-300 hover:text-white py-0.5"
                >
                  <FileText className="h-4.5 w-4.5 text-brand-green shrink-0" />
                  <span>Terms & Conditions 条款与细节</span>
                </button>
                <button
                  onClick={() => setOpenPolicyType('refund')}
                  className="hover:text-brand-green transition-colors flex items-center gap-2 cursor-pointer text-left text-sm sm:text-base font-medium text-slate-300 hover:text-white py-0.5"
                >
                  <ShieldAlert className="h-4.5 w-4.5 text-brand-green shrink-0" />
                  <span>Refund & Return Policy 退款与退货政策</span>
                </button>
                <button
                  onClick={() => setOpenPolicyType('pdpa')}
                  className="hover:text-brand-green transition-colors flex items-center gap-2 cursor-pointer text-left text-sm sm:text-base font-medium text-slate-300 hover:text-white py-0.5"
                >
                  <ShieldCheck className="h-4.5 w-4.5 text-brand-green shrink-0" />
                  <span>PDPA Notice &amp; Consent 个人资料保护声明</span>
                </button>
              </div>
            </div>

            {/* Column 3: Contact Details */}
            <div className="md:col-span-7 flex flex-col gap-3.5 text-left" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              <h4 className="text-white font-extrabold text-sm tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center gap-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
                {lang === 'zh' ? '联系我们 & 销售部' : lang === 'ms' ? 'Hubungi Kami & Jabatan Jualan' : 'Sales Inquiry & Support'}
              </h4>
              <div className="flex flex-col gap-3 text-xs" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                {/* Address Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-[4px] hover:border-slate-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-snug" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                        {lang === 'zh' ? '工厂地址' : lang === 'ms' ? 'Alamat Kilang' : 'Factory Address'}
                      </span>
                      <span className="leading-snug text-slate-100 font-normal text-xs sm:text-sm mt-0.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{COMPANY_CONTACT.address}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_CONTACT.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-full sm:w-auto text-center justify-center bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 sm:py-2 rounded-[4px] border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <span>{lang === 'zh' ? '地图导航' : lang === 'ms' ? 'Peta Lokasi' : 'View Map'}</span>
                    <span>→</span>
                  </a>
                </div>

                {/* Phone Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-[4px] hover:border-slate-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-snug" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                        {lang === 'zh' ? '联络电话 / 传真' : lang === 'ms' ? 'No. Telefon / Faks' : 'Contact Phone / Fax'}
                      </span>
                      <span className="leading-snug text-white font-bold text-xs sm:text-sm tracking-wide mt-0.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{COMPANY_CONTACT.phone}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${COMPANY_CONTACT.phone.replace(/[^0-9+]/g, '')}`}
                    className="shrink-0 w-full sm:w-auto text-center justify-center bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 sm:py-2 rounded-[4px] border border-brand-green/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <span>{lang === 'zh' ? '立即拨打' : lang === 'ms' ? 'Hubungi' : 'Call Now'}</span>
                    <span>→</span>
                  </a>
                </div>

                {/* WhatsApp 销售部 Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-[4px] hover:border-emerald-700/60 transition-colors">
                  <div className="flex items-start gap-3">
                    <WhatsAppIcon className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider leading-snug flex items-center gap-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                        WhatsApp {lang === 'zh' ? '销售部' : lang === 'ms' ? 'Jabatan Jualan' : 'Sales Dept'}
                        <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded font-bold" style={{ fontFamily: "'Times New Roman', Times, serif" }}>ONLINE</span>
                      </span>
                      <span className="leading-snug text-white font-bold text-xs sm:text-sm tracking-wide mt-0.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>+6014-941 3545</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/60149413545"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-full sm:w-auto text-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 sm:py-2 rounded-[4px] shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-pulse" />
                    <span>{lang === 'zh' ? '立即联络' : lang === 'ms' ? 'Chat WhatsApp' : 'Chat WhatsApp'}</span>
                  </a>
                </div>

                {/* Email Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-[4px] hover:border-slate-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-snug" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                        {lang === 'zh' ? '电子邮箱' : lang === 'ms' ? 'E-mel Rasmi' : 'Email Address'}
                      </span>
                      <span className="leading-snug text-slate-100 font-normal text-xs sm:text-sm mt-0.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{COMPANY_CONTACT.email}</span>
                    </div>
                  </div>
                  <a
                    href={`mailto:${COMPANY_CONTACT.email}`}
                    className="shrink-0 w-full sm:w-auto text-center justify-center bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 sm:py-2 rounded-[4px] border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <span>{lang === 'zh' ? '发送邮件' : lang === 'ms' ? 'Hantar E-mel' : 'Email Us'}</span>
                    <span>→</span>
                  </a>
                </div>

                {/* Working Hours Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-[4px]">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-snug" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                        {lang === 'zh' ? '营业时间' : lang === 'ms' ? 'Waktu Operasi' : 'Business Hours'}
                      </span>
                      <span className="leading-snug text-slate-100 font-normal text-xs sm:text-sm mt-0.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t.workingDays}</span>
                      <span className="leading-snug text-slate-400 text-xs sm:text-sm mt-0.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t.closedDays}</span>
                    </div>
                  </div>
                  <div className="shrink-0 self-start sm:self-center px-3.5 py-2 rounded-[4px] bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider select-none" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                    {lang === 'zh' ? '欢迎咨询' : lang === 'ms' ? 'Selamat Datang' : 'Welcome'}
                  </div>
                </div>

                {/* AI & Sales Disclaimer Card */}
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-[4px] text-[11px] italic text-slate-400 font-sans leading-relaxed text-left mt-1">
                  <p>{t.salesDisclaimer}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Legal and Trademark footnotes */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 border-t border-white/5 pt-5 mt-4">
            <div className="flex flex-col gap-1 text-left">
              <p>{t.copyRights}</p>
              <p className="text-[10px] text-slate-400 italic">{t.salesDisclaimer}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-400">
              <button
                onClick={() => setOpenPolicyType('terms')}
                className="hover:text-brand-green transition-colors flex items-center gap-1.5 cursor-pointer font-bold underline underline-offset-2 decoration-slate-600"
                aria-label="Terms and Conditions, Refund Policy and PDPA Notice"
              >
                <FileText className="h-3 w-3 text-brand-green" />
                <span>T&amp;C Apply</span>
              </button>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <span>Made with ❤️ in Malaysia</span>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <a href="#navbar" className="hover:text-white transition-colors">Back to Top ↑</a>
            </div>
          </div>

        </div>
      </footer>

      {/* WHATSAPP ORDER BUILDER DRAWER (Slide-out Cart) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="order-builder-drawer-portal">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900 cursor-pointer"
            />

            {/* Sidebar Box */}
            <div className="absolute inset-y-0 right-0 max-w-full pl-0 sm:pl-10 flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between h-full"
                id="drawer-container"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50 text-left">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-brand-green/10 text-brand-green rounded-[3px]">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-black text-sm uppercase tracking-wider text-slate-900">
                        {lang === 'zh' ? '大量采购 Bulk Purchase 意向单' : 'Bulk Purchase Order (PO) Builder'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {lang === 'zh' ? '冷链批发 • 意向选购清单' : 'Wholesale Cold-Chain Order Request'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-[4px] hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="h-5.5 w-5.5" />
                  </button>
                </div>
 
                {/* Main Content (Order lists and delivery calculation) */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-none">
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 my-auto text-slate-400 gap-3" id="drawer-empty-state">
                      <div className="p-4 bg-slate-100 rounded-[4px] text-slate-300">
                        <ShoppingBag className="h-10 w-10" />
                      </div>
                      <p className="text-sm font-semibold max-w-xs">{t.cartEmpty}</p>
                    </div>
                  ) : (
                    <>
                      {/* Products chosen */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase text-left">
                          {lang === 'zh' ? '已选美食明细' : 'SELECTED DISHES'}
                        </span>
                        
                        <div className="flex flex-col gap-2" id="drawer-cart-list">
                          {cart.map((item) => {
                            const p = item.product;
                            const v = item.variant;
                            return (
                              <div
                                key={`${p.id}-${v.id}`}
                                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-[4px] border border-slate-200 text-sm gap-4 text-left"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex flex-col leading-tight flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-extrabold text-slate-900 line-clamp-1">{lang === 'zh' ? p.nameZh : p.name}</span>
                                      
                                      {/* Quick Add Button directly next to product name */}
                                      <button
                                        onClick={() => updateCartQuantity(p.id, v.id, 1)}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-[10px] rounded-[3px] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                                        title={lang === 'zh' ? '快速加1' : 'Quick Add +1'}
                                      >
                                        <Plus className="h-3 w-3 stroke-[3]" />
                                        <span>{lang === 'zh' ? '快速+1' : 'Quick Add'}</span>
                                      </button>

                                      {/* Quick +5 for B2B bulk buyers */}
                                      <button
                                        onClick={() => updateCartQuantity(p.id, v.id, 5)}
                                        className="inline-flex items-center px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 font-black text-[10px] rounded-[3px] transition-all cursor-pointer active:scale-95 shrink-0"
                                        title={lang === 'zh' ? '批量加5' : 'Add +5'}
                                      >
                                        <span>+5</span>
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] text-slate-500 font-medium">{v.size}</span>
                                      <span className="text-xs font-black text-brand-green">RM {v.price.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
 
                                {/* Modifier controls */}
                                <div className="flex items-center gap-2 shrink-0 bg-white border border-slate-200 rounded-[4px] p-1">
                                  <button
                                    onClick={() => updateCartQuantity(p.id, v.id, -1)}
                                    className="p-1 rounded-[2px] text-slate-500 hover:bg-slate-100 cursor-pointer"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="font-bold text-xs text-slate-800 w-5 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartQuantity(p.id, v.id, 1)}
                                    className="p-1 rounded-[2px] text-slate-500 hover:bg-slate-100 cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
 
                      {/* Region Selector */}
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-[4px] flex flex-col gap-3 text-left">
                        <label className="text-[10px] font-black text-slate-500 tracking-wider uppercase">
                          {t.selectRegion}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDeliveryRegionId('klang-valley')}
                            className={`p-2.5 rounded-[4px] border text-xs font-extrabold text-center transition-all cursor-pointer ${
                              deliveryRegionId === 'klang-valley'
                                ? 'border-brand-green bg-emerald-50/50 text-brand-green'
                                : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                            }`}
                          >
                            {lang === 'zh' ? '雪隆区' : 'Klang Valley'} (RM40)
                          </button>
                          <button
                            onClick={() => setDeliveryRegionId('outstation')}
                            className={`p-2.5 rounded-[4px] border text-xs font-extrabold text-center transition-all cursor-pointer ${
                              deliveryRegionId === 'outstation'
                                ? 'border-brand-green bg-emerald-50/50 text-brand-green'
                                : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                            }`}
                          >
                            {lang === 'zh' ? '西马外州' : 'Outstation'} (RM40)
                          </button>
                        </div>
 
                        {/* Free Shipping Progress bar */}
                        <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-200/50">
                          {isDeliveryFree ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green">
                              <Check className="h-4 w-4 stroke-[3]" />
                              <span>{t.unlockedFreeDelivery}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500">
                                {t.freeDeliveryProgress.replace('{amount}', amountToFreeDelivery.toFixed(2))}
                              </span>
                              {/* progress bar visual */}
                              <div className="w-full bg-slate-200 h-1.5 rounded-[2px] overflow-hidden">
                                <div
                                  className="bg-brand-green h-full rounded-[2px] transition-all duration-300"
                                  style={{ width: `${Math.min(100, (subtotal / activeRegion.minFreeOrder) * 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
 
                      {/* Optional Sender Details fields */}
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-[4px] flex flex-col gap-3 text-left">
                        <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase">
                          {lang === 'zh' ? '💼 采购单位/企业信息' : '💼 B2B Purchaser Corporate Profile'}
                        </span>
                        <div className="flex flex-col gap-2.5">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">
                              {lang === 'zh' ? '企业/公司名称 (必填)' : 'Company Name (Required)'}
                            </label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder={lang === 'zh' ? '例如：双子星餐饮集团 Sdn Bhd' : 'e.g. Twin Towers Catering Sdn Bhd'}
                              className="w-full bg-white border border-slate-200 rounded-[4px] p-2.5 text-xs outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/10"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">
                              {lang === 'zh' ? '商业注册号 (SSM / Reg No)' : 'Company Registration No (SSM)'}
                            </label>
                            <input
                              type="text"
                              value={companyRegNo}
                              onChange={(e) => setCompanyRegNo(e.target.value)}
                              placeholder={lang === 'zh' ? '例如：202401xxxxxx' : 'e.g. 202401xxxxxx'}
                              className="w-full bg-white border border-slate-200 rounded-[4px] p-2.5 text-xs outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/10"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">
                              {lang === 'zh' ? '企业类型 / Business Type' : 'Business Category'}
                            </label>
                            <select
                              value={businessType}
                              onChange={(e) => setBusinessType(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-[4px] p-2.5 text-xs outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/10 text-slate-800 font-medium"
                            >
                              <option value="Restaurant / F&B Chain">{lang === 'zh' ? '连锁餐饮 / F&B Restaurant Chain' : 'Restaurant / F&B Chain'}</option>
                              <option value="Wholesaler / Distributor">{lang === 'zh' ? '食品批发商 / Food Wholesaler' : 'Wholesaler / Distributor'}</option>
                              <option value="Supermarket / Grocery Retail">{lang === 'zh' ? '超市/商超采购 / Supermarket Buyer' : 'Supermarket / Retailer'}</option>
                              <option value="Hotel / Resort Catering">{lang === 'zh' ? '酒店及宴会餐饮 / Hotel & Catering' : 'Hotel / Catering'}</option>
                              <option value="Central Kitchen / Food Factory">{lang === 'zh' ? '中央厨房 / Central Kitchen' : 'Central Kitchen'}</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">
                              {lang === 'zh' ? '代表/采购负责人 (必填)' : 'Authorized Representative Name'}
                            </label>
                            <input
                              type="text"
                              value={senderName}
                              onChange={(e) => setSenderName(e.target.value)}
                              placeholder={lang === 'zh' ? '联络人姓名' : 'Contact Person'}
                              className="w-full bg-white border border-slate-200 rounded-[4px] p-2.5 text-xs outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/10"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">
                              {lang === 'zh' ? '收货仓库/履约地址 (必填)' : 'Warehouse Delivery Address'}
                            </label>
                            <input
                              type="text"
                              value={senderAddress}
                              onChange={(e) => setSenderAddress(e.target.value)}
                              placeholder={lang === 'zh' ? '冷链车卸货地址' : 'Unloading bay full address'}
                              className="w-full bg-white border border-slate-200 rounded-[4px] p-2.5 text-xs outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/10"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
 
                {/* Footer Quote block & CTA */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                        <span>{t.subtotal}</span>
                        <span className="font-mono text-slate-800">RM {subtotal.toFixed(2)}</span>
                      </div>
                      {memberDiscountApplied && (
                        <div className="flex justify-between items-center text-xs text-brand-green font-extrabold bg-emerald-50/50 p-1.5 rounded-[4px] border border-emerald-100/50">
                          <span className="flex items-center gap-1">🏷️ {lang === 'zh' ? '专属会员折扣 (10%)' : lang === 'ms' ? 'Diskaun Ahli (10%)' : 'VIP Member Discount (10%)'}</span>
                          <span className="font-mono text-brand-green">-RM {discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                        <span>{t.deliveryFee} ({activeRegion.nameZh.split('(')[0].trim()})</span>
                        <span className="font-mono text-slate-800">
                          {deliveryFee === 0 ? (
                            <span className="text-brand-green font-extrabold">{t.freeDelivery}</span>
                          ) : (
                            `RM ${deliveryFee.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 my-1" />
                      <div className="flex justify-between items-center text-slate-900 font-extrabold">
                        <span className="text-sm">{lang === 'zh' ? '应付款总计' : 'Grand Total'}</span>
                        <span className="text-xl font-black text-brand-green font-mono">RM {totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
 
                    {/* Submit CTA */}
                    <button
                      onClick={handleSendWhatsAppOrder}
                      className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white py-3.5 rounded-[4px] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 animate-pulse"
                    >
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.69 1.97 14.221 1.01 11.605 1.01 6.166 1.01 1.742 5.38 1.738 10.81c-.001 1.696.446 3.354 1.294 4.817l-.146.536L1.572 22.37l6.23-1.613-.155-.203zM17.07 14.37c-.274-.135-1.62-.79-1.87-.88-.254-.09-.439-.135-.624.135-.185.27-.714.88-.874 1.06-.16.18-.32.2-.594.065-.274-.135-1.16-.425-2.208-1.353-.816-.722-1.367-1.616-1.527-1.888-.16-.27-.017-.417.119-.552.122-.122.274-.32.411-.48.135-.16.18-.27.27-.45.09-.18.045-.335-.022-.47-.068-.135-.624-1.488-.854-2.04-.225-.54-.473-.465-.649-.475-.165-.01-.355-.01-.545-.01-.19 0-.5.07-.76.355-.26.285-.99.96-.99 2.34 0 1.38.1 2.72.115 2.9.155.18 1.95 2.94 4.75 4.1.66.27 1.18.44 1.58.57.67.21 1.28.18 1.76.1.535-.08 1.62-.655 1.85-1.29.23-.63.23-1.17.16-1.285-.07-.115-.255-.18-.53-.315z" />
                      </svg>
                      <span>{t.sendWhatsApp}</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center leading-normal">
                      {t.whatsappDisclaimer}
                    </p>
                    <p className="text-[10px] text-slate-400 italic text-center leading-normal border-t border-slate-200/60 pt-2">
                      {t.salesDisclaimer}
                    </p>
                  </div>
                )}

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAILS MODAL ("按进去才看到") */}
      <AnimatePresence>
        {selectedProductDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[4px]">
            {/* Backdrop close */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={() => setSelectedProductDetails(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`relative bg-white rounded-lg shadow-2xl border border-slate-100 ${adminMode ? 'max-w-4xl md:flex-row' : 'max-w-xl'} w-full overflow-hidden flex flex-col z-10`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors z-20 cursor-pointer"
                title={lang === 'zh' ? '关闭' : 'Close'}
              >
                <X className="h-4 w-4" />
              </button>

              {adminMode && editingProduct ? (
                <>
                  {/* Left Side: CMS Media & Category */}
                  <div className="md:w-1/2 bg-slate-50 relative shrink-0 flex flex-col border-r border-slate-100 p-6 gap-4">
                    <span className="font-sans font-black text-xs text-brand-green uppercase tracking-wider block border-b border-slate-200 pb-2">
                      {lang === 'zh' ? '🏷️ 分类与基本设置' : '🏷️ Category & Settings'}
                    </span>

                    {/* Category Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {lang === 'zh' ? '归属商品分类' : 'Food Category'}
                      </label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
                        className="bg-white border border-slate-300 text-xs px-2.5 py-2 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none font-bold text-slate-800 cursor-pointer w-full"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nameZh} / {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Barcode input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {lang === 'zh' ? '商品条形码 (Barcode)' : 'Product Barcode'}
                      </label>
                      <input
                        type="text"
                        value={editingProduct.barcode || ''}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, barcode: e.target.value } : null)}
                        className="bg-white border border-slate-300 text-xs px-2.5 py-2 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none font-mono text-slate-700 w-full"
                        placeholder="e.g. 955..."
                      />
                    </div>

                    {/* Featured toggle checkbox */}
                    <label className="flex items-center gap-2 mt-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.featured}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                        className="rounded border-slate-300 text-brand-green focus:ring-brand-green h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        {lang === 'zh' ? '⭐ 设为推荐商品 (Featured)' : '⭐ Feature on Home'}
                      </span>
                    </label>
                  </div>

                  {/* Right Side: CMS Details & Specs */}
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between text-left overflow-y-auto max-h-[85vh]">
                    <div className="flex flex-col gap-4">
                      <span className="font-sans font-black text-xs text-brand-green uppercase tracking-wider block border-b border-slate-200 pb-2">
                        {lang === 'zh' ? '📝 产品信息 & 规格定价' : '📝 Info & Variants Pricing'}
                      </span>

                      {/* Name Zh */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {lang === 'zh' ? '商品中文名称' : 'Product Name (ZH)'}
                        </label>
                        <input
                          type="text"
                          value={editingProduct.nameZh}
                          onChange={(e) => setEditingProduct(prev => prev ? { ...prev, nameZh: e.target.value } : null)}
                          className="bg-white border border-slate-300 text-sm font-bold px-2.5 py-2 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-900 w-full"
                          placeholder="例如：黄金花胶鸡汤底"
                        />
                      </div>

                      {/* Name En */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {lang === 'zh' ? '商品英文名称' : 'Product Name (EN)'}
                        </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="bg-white border border-slate-300 text-sm px-2.5 py-2 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none font-semibold text-slate-700 w-full"
                          placeholder="e.g. Premium Fish Maw Chicken Soup"
                        />
                      </div>

                      {/* Description Zh */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {lang === 'zh' ? '中文产品介绍' : 'Product Description (ZH)'}
                        </label>
                        <textarea
                          value={editingProduct.descriptionZh}
                          onChange={(e) => setEditingProduct(prev => prev ? { ...prev, descriptionZh: e.target.value } : null)}
                          className="bg-white border border-slate-300 text-xs px-2.5 py-2 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-700 w-full h-16 resize-none leading-normal"
                          placeholder="中文描述..."
                        />
                      </div>

                      {/* Description En */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {lang === 'zh' ? '英文产品介绍' : 'Product Description (EN)'}
                        </label>
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                          className="bg-white border border-slate-300 text-xs px-2.5 py-2 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-700 w-full h-16 resize-none leading-normal"
                          placeholder="English description..."
                        />
                      </div>

                      {/* Variants List Editor */}
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            {lang === 'zh' ? '规格与对应定价 (Variants & Pricing)' : 'Variants & Pricing'}
                          </label>
                          <button
                            onClick={() => {
                              const newVar: ProductVariant = {
                                id: 'var-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                                size: '500g * Pkt',
                                price: 19.90,
                                type: 'pkt'
                              };
                              setEditingProduct(prev => prev ? { ...prev, variants: [...prev.variants, newVar] } : null);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-brand-green border border-emerald-200 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-[2px] cursor-pointer flex items-center gap-1 transition-all"
                          >
                            <Plus className="h-3 w-3 stroke-[2.5]" />
                            <span>{lang === 'zh' ? '新增规格' : 'Add Size'}</span>
                          </button>
                        </div>

                        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {editingProduct.variants.map((v, idx) => (
                            <div key={v.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded relative">
                              {/* Size input */}
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  value={v.size}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingProduct(prev => {
                                      if (!prev) return null;
                                      const updatedVars = [...prev.variants];
                                      updatedVars[idx] = { ...updatedVars[idx], size: val };
                                      return { ...prev, variants: updatedVars };
                                    });
                                  }}
                                  className="bg-white border border-slate-300 text-[10px] px-1.5 py-1 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none font-bold text-slate-800 w-full"
                                  placeholder="e.g. 400g * Pkt"
                                />
                              </div>

                              {/* Price input */}
                              <div className="w-20 shrink-0 flex items-center bg-white border border-slate-300 rounded focus-within:ring-1 focus-within:ring-brand-green px-1.5 py-1">
                                <span className="text-[9px] font-black text-slate-400 mr-1">RM</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={v.price}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setEditingProduct(prev => {
                                      if (!prev) return null;
                                      const updatedVars = [...prev.variants];
                                      updatedVars[idx] = { ...updatedVars[idx], price: val };
                                      return { ...prev, variants: updatedVars };
                                    });
                                  }}
                                  className="outline-none text-[10px] font-extrabold text-brand-green w-full font-mono text-right bg-transparent"
                                  placeholder="0.00"
                                />
                              </div>

                              {/* Unit Type dropdown */}
                              <div className="w-16 shrink-0">
                                <select
                                  value={v.type}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    setEditingProduct(prev => {
                                      if (!prev) return null;
                                      const updatedVars = [...prev.variants];
                                      updatedVars[idx] = { ...updatedVars[idx], type: val };
                                      return { ...prev, variants: updatedVars };
                                    });
                                  }}
                                  className="bg-white border border-slate-300 text-[9px] font-black px-1 py-1 rounded focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 outline-none text-slate-600 w-full"
                                >
                                  <option value="pkt">Pkt</option>
                                  <option value="ctn">Ctn</option>
                                  <option value="unit">Unit</option>
                                  <option value="box">Box</option>
                                  <option value="pck">Pck</option>
                                </select>
                              </div>

                              {/* Delete variant button */}
                              {editingProduct.variants.length > 1 && (
                                <button
                                  onClick={() => {
                                    setEditingProduct(prev => {
                                      if (!prev) return null;
                                      return { ...prev, variants: prev.variants.filter((_, i) => i !== idx) };
                                    });
                                  }}
                                  className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer shrink-0"
                                  title="Delete Variant"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Editor Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                      {/* Delete complete product */}
                      <button
                        onClick={() => {
                          if (window.confirm(lang === 'zh' ? '您确定要从目录中删除这款商品吗？此操作无法撤销。' : 'Are you sure you want to delete this product? This cannot be undone.')) {
                            const nextList = productsList.filter(p => p.id !== editingProduct.id);
                            saveProductsList(nextList);
                            setSelectedProductDetails(null);
                          }
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-[4px] border border-rose-200 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{lang === 'zh' ? '删除商品' : 'Delete'}</span>
                      </button>

                      <div className="flex items-center gap-2 justify-end w-full">
                        {/* Cancel button */}
                        <button
                          onClick={() => setSelectedProductDetails(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-[4px] border border-slate-200 transition-all cursor-pointer"
                        >
                          {lang === 'zh' ? '取消' : 'Cancel'}
                        </button>

                        {/* Save button */}
                        <button
                          onClick={() => {
                            if (!editingProduct.name.trim() || !editingProduct.nameZh.trim()) {
                              alert(lang === 'zh' ? '请填写商品的中英文名称！' : 'Please fill in both English and Chinese names!');
                              return;
                            }

                            const index = productsList.findIndex(p => p.id === editingProduct.id);
                            let nextList = [...productsList];
                            if (index > -1) {
                              nextList[index] = editingProduct;
                            } else {
                              nextList.unshift(editingProduct);
                            }
                            saveProductsList(nextList);

                            // Sync with custom images cache for immediate responsive updates
                            if (editingProduct.image) {
                              setCustomImages(prev => {
                                const next = { ...prev, [editingProduct.id]: editingProduct.image };
                                try {
                                  localStorage.setItem('custom_product_images', JSON.stringify(next));
                                } catch (e) {
                                  console.error('Failed to save custom images cache:', e);
                                }
                                return next;
                              });
                            }
                            
                            setSelectedVariants(prev => {
                              if (editingProduct.variants.length > 0) {
                                return { ...prev, [editingProduct.id]: editingProduct.variants[0].id };
                              }
                              return prev;
                            });

                            setSelectedProductDetails(null);
                          }}
                          className="bg-brand-green hover:bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-[4px] shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>{lang === 'zh' ? '保存修改' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                <>
                  {/* Details & Specs (Image-free layout) */}
                  <div className="w-full p-6 md:p-8 flex flex-col justify-between text-left">
                    <div className="flex flex-col gap-4">
                      {/* Title */}
                      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-3">
                        <h3 className="font-sans font-black text-xl text-slate-950">
                          {selectedProductDetails.nameZh}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {selectedProductDetails.name}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                          {lang === 'zh' ? '产品介绍' : 'PRODUCT DESCRIPTION'}
                        </span>
                        <div className="text-slate-600 text-xs leading-relaxed flex flex-col gap-2">
                          <p className="font-medium text-slate-800">{selectedProductDetails.descriptionZh}</p>
                          <p className="italic text-slate-500 font-sans">{selectedProductDetails.description}</p>
                        </div>
                      </div>

                      {/* Special detail notes (e.g. for ice cream goreng flavor selection) */}
                      {selectedProductDetails.id === 'snack-ice-cream-goreng' && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-brand-green tracking-wider uppercase">
                            {lang === 'zh' ? '可供口味选择 :' : 'AVAILABLE FLAVORS :'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[9px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-[2px]">Vanilla</span>
                            <span className="text-[9px] font-extrabold px-2 py-0.5 bg-amber-900/10 text-amber-950 border border-amber-900/20 rounded-[2px]">Chocolate</span>
                            <span className="text-[9px] font-extrabold px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-[2px]">Yam</span>
                          </div>
                        </div>
                      )}

                      {/* Barcode Display inside modal */}
                      {selectedProductDetails.barcode && (
                        <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-[4px]">
                          <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                            {lang === 'zh' ? '商品条形码' : lang === 'ms' ? 'BARKOD PRODUK' : 'PRODUCT BARCODE'}
                          </span>
                          <div className="flex items-center gap-2">
                            <Barcode className="h-4 w-4 text-slate-700" />
                            <span className="font-mono text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 border border-slate-200 rounded-[2px] tracking-widest shadow-2xs">
                              {selectedProductDetails.barcode}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sizing & Add to order at the bottom */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-4">
                      {/* Choose Variant inside modal */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                          {lang === 'zh' ? '选择产品规格 :' : lang === 'ms' ? 'PILIH SPESIFIKASI :' : 'CHOOSE SPECIFICATION :'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProductDetails.variants.map((v) => {
                            const isChosen = (selectedVariants[selectedProductDetails.id] || selectedProductDetails.variants[0].id) === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => setSelectedVariants((prev) => ({ ...prev, [selectedProductDetails.id]: v.id }))}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-[4px] border transition-all cursor-pointer ${
                                  isChosen
                                    ? 'border-brand-green bg-emerald-50/50 text-brand-green font-black'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                                }`}
                              >
                                {v.size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Price & Add to Cart */}
                      {(() => {
                        const chosenId = selectedVariants[selectedProductDetails.id] || selectedProductDetails.variants[0].id;
                        const chosenVariant = selectedProductDetails.variants.find((v) => v.id === chosenId) || selectedProductDetails.variants[0];
                        return (
                          <div className="flex items-center justify-between gap-4 mt-2">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 tracking-widest">PRICE (RM)</span>
                              <span className="text-xl font-black text-brand-green">RM {chosenVariant.price.toFixed(2)}</span>
                            </div>
                            <button
                              onClick={() => {
                                handleAddToCart(selectedProductDetails, chosenVariant.id);
                                setSelectedProductDetails(null);
                              }}
                              className="bg-brand-green hover:bg-brand-green-hover text-white flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-[4px] font-bold uppercase text-[10px] tracking-wider shadow-sm transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5 stroke-[3]" />
                              <span>{lang === 'zh' ? '加购此商品' : lang === 'ms' ? 'Tambah ke Pesanan' : 'Add to Order'}</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POLICIES MODAL ("服务条款与退款政策" - 按进去才看到) */}
      <AnimatePresence>
        {openPolicyType && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-[4px]">
            {/* Backdrop close */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={() => setOpenPolicyType(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative bg-white rounded-lg shadow-2xl border border-slate-100 max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col z-10 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                <div className="flex items-center gap-2.5">
                  {openPolicyType === 'why' ? (
                    <Award className="h-5 w-5 text-brand-green" />
                  ) : openPolicyType === 'terms' ? (
                    <FileText className="h-5 w-5 text-brand-green" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-brand-green" />
                  )}
                  <div className="flex flex-col">
                    <h3 className="font-sans font-black text-base sm:text-lg text-slate-950 leading-tight">
                      {openPolicyType === 'why'
                        ? (lang === 'zh' ? '为什么选择 AEM FOOD？' : lang === 'ms' ? 'Kenapa Pilih AEM FOOD?' : 'Why Choose AEM FOOD?')
                        : LEGAL_DOCS[openPolicyType].label[lang]
                      }
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      AL-EKHLAS MANUFACTURING SDN.BHD
                    </p>
                  </div>
                </div>

                {/* Close & Lang switch row */}
                <div className="flex items-center gap-3">
                  {/* Localized Modal Lang Switcher */}
                  <div className="flex bg-slate-250 p-0.5 rounded-[4px] text-[9px] font-black text-slate-600">
                    {(['en', 'zh', 'ms'] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-2 py-1 rounded-[2px] cursor-pointer uppercase transition-all ${
                          lang === l ? 'bg-brand-green text-white shadow-xs' : 'hover:bg-slate-350'
                        }`}
                      >
                        {l === 'zh' ? '中' : l}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setOpenPolicyType(null)}
                    className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-800 rounded-full transition-colors cursor-pointer"
                    title={lang === 'zh' ? '关闭' : 'Close'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed scrollbar-thin">
                {openPolicyType === 'why' ? (
                  // Why Choose Us list
                  <div className="space-y-6 text-left">
                    {/* Intro text */}
                    <div className="border-b border-slate-100 pb-4">
                      <p className="text-slate-900 font-extrabold text-base">
                        {lang === 'zh' ? '开启美味与品质兼具的现代化食品代加工及供应新篇章' : lang === 'ms' ? 'Mulakan lembaran baharu dalam pembuatan & pembekalan makanan moden dengan rasa dan kualiti' : 'Partner with AEM for modern, high-quality food manufacturing and supply solutions.'}
                      </p>
                      <p className="text-slate-500 italic text-xs mt-1">
                        Why Choose AEM FOOD? / 为什么选择我们？ / Kenapa Pilih Kami?
                      </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Feature 1 */}
                      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-[4px] flex gap-3.5 transition-all hover:bg-white hover:shadow-md hover:border-brand-green/35">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green mt-0.5">
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-950 text-sm">
                            {lang === 'zh' ? '正宗中国菜及川菜风味' : lang === 'ms' ? 'Cuisine Cina & Sichuan Tulen' : 'Authentic Chinese & Sichuan Cuisine'}
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {lang === 'zh' 
                              ? '我们提供最纯正的经典中国菜肴与热辣川味，完美传承东方美食的精髓。' 
                              : lang === 'ms' 
                              ? 'Kami menyajikan hidangan Cina klasik dan rasa Sichuan pedas yang paling tulen, mewarisi keunikan gastronomi Timur secara sempurna.' 
                              : 'We offer the most authentic classic Chinese dishes and spicy Sichuan flavors, perfectly inheriting the essence of Eastern gastronomy.'}
                          </p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-[4px] flex gap-3.5 transition-all hover:bg-white hover:shadow-md hover:border-brand-green/35">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green mt-0.5">
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-950 text-sm">
                            {lang === 'zh' ? '严格遵循 Halal 标准生产' : lang === 'ms' ? 'Pembuatan Patuh Halal yang Ketat' : 'Strict Halal-Compliant Manufacturing'}
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {lang === 'zh' 
                              ? '我们的整个生产流程、原料采购及卫生清洁均完全符合清真食品的安全卫生与质量认证标准。' 
                              : lang === 'ms' 
                              ? 'Keseluruhan proses pembuatan, perolehan bahan, dan pembersihan kami mematuhi piawaian keselamatan, kebersihan, dan kualiti Halal yang ketat.' 
                              : 'Our entire manufacturing process, ingredient sourcing, and cleaning procedures comply fully with strict Halal safety, hygiene, and quality standards.'}
                          </p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-[4px] flex gap-3.5 transition-all hover:bg-white hover:shadow-md hover:border-brand-green/35">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green mt-0.5">
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-950 text-sm">
                            {lang === 'zh' ? '现代化食品生产工厂' : lang === 'ms' ? 'Kemudahan Pembuatan Makanan Moden' : 'Modern Food Manufacturing Facility'}
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {lang === 'zh' 
                              ? '位于雪兰莪士毛月（Semenyih）的十万级无尘洁净中央大厨房，配备先进的高温高压灭菌及急速冷冻技术。' 
                              : lang === 'ms' 
                              ? 'Dapur pusat bilik bersih teknologi tinggi kami di Semenyih, Selangor dilengkapi dengan pensterilan suhu tinggi dan teknologi pembekuan pantas.' 
                              : 'Our high-tech cleanroom central kitchen in Semenyih, Selangor is equipped with advanced high-temperature sterilization and flash-freezing technology.'}
                          </p>
                        </div>
                      </div>

                      {/* Feature 4 */}
                      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-[4px] flex gap-3.5 transition-all hover:bg-white hover:shadow-md hover:border-brand-green/35">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green mt-0.5">
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-950 text-sm">
                            {lang === 'zh' ? '超过 100+ 款产品选择' : lang === 'ms' ? 'Pilihan Lebih Daripada 100+ Produk' : '100+ Product Selections'}
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {lang === 'zh' 
                              ? '从点心、汤底、酱料到各类即食特色小吃，丰富的产品线全方位满足不同餐饮场景。' 
                              : lang === 'ms' 
                              ? 'Daripada dim sum, pes sup, sos hingga ke pelbagai snek sedia dimakan, katalog kami yang luas memenuhi keperluan semua senario katering.' 
                              : 'From dim sum, soup bases, and sauces to various ready-to-eat local delicacies, our extensive catalog satisfies all culinary scenes.'}
                          </p>
                        </div>
                      </div>

                      {/* Feature 5 */}
                      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-[4px] flex gap-3.5 transition-all hover:bg-white hover:shadow-md hover:border-brand-green/35">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green mt-0.5">
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-950 text-sm">
                            {lang === 'zh' ? 'OEM / ODM 定制服务' : lang === 'ms' ? 'Penyelesaian OEM & ODM Profesional' : 'Professional OEM & ODM Solutions'}
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {lang === 'zh' 
                              ? '为餐饮品牌提供专属的配方研发、标准化生产及代加工服务，助力快速复制与落地。' 
                              : lang === 'ms' 
                              ? 'Kami menawarkan pembangunan resipi tersuai, pengeluaran standard, dan perkhidmatan pembungkusan bersama untuk jenama makanan berkembang pantas.' 
                              : 'We offer bespoke recipe development, standardized production, and co-packing services for food brands to accelerate scaling.'}
                          </p>
                        </div>
                      </div>

                      {/* Feature 6 */}
                      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-[4px] flex gap-3.5 transition-all hover:bg-white hover:shadow-md hover:border-brand-green/35">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green mt-0.5">
                          <Check className="h-4.5 w-4.5 stroke-[3]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-950 text-sm">
                            {lang === 'zh' ? '服务餐厅、连锁品牌、批发商及出口市场' : lang === 'ms' ? 'Membekal ke Restoran, Rangkaian Runcit, & Eksport' : 'Supplying Restaurants, Chains, & Export'}
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed font-medium">
                            {lang === 'zh' 
                              ? '我们的实力得到众多知名连锁餐饮、各大超市商超及全球海外批发伙伴的高度信赖。' 
                              : lang === 'ms' 
                              ? 'Keupayaan pembuatan kami dipercayai oleh rangkaian kedai makan terkemuka, pasar raya besar, dan rakan import borong global.' 
                              : 'Our manufacturing capability is trusted by leading F&B retail chains, hypermarkets, and global wholesale import partners.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom call to action */}
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-[4px] flex gap-3 text-emerald-950 mt-4">
                      <Sparkles className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="font-extrabold text-xs tracking-wider uppercase">
                          {lang === 'zh' ? '致力于卓越品质' : lang === 'ms' ? 'Komited untuk Kualiti Terbaik' : 'COMMITTED TO EXCELLENCE'}
                        </span>
                        <p className="text-xs font-semibold leading-relaxed">
                          {lang === 'zh' 
                            ? 'AEM Food 结合地道中华美食风味与严格的安全制造规范，为您提供最值得信赖的高标标准化餐饮供应链。' 
                            : lang === 'ms' 
                            ? 'AEM Food menggabungkan rasa masakan Cina yang asli dengan garis panduan pengeluaran keselamatan makanan yang ketat, menawarkan rantaian bekalan makanan standard yang boleh dipercayai.' 
                            : 'AEM Food blends authentic Chinese culinary heritage with modern manufacturing regulations, providing a highly reliable and standardized F&B supply chain.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <LegalDocView docId={openPolicyType} lang={lang} onSelect={setOpenPolicyType} />
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold text-slate-400">
                  © 2026 AL-EKHLAS MANUFACTURING
                </span>
                <button
                  onClick={() => setOpenPolicyType(null)}
                  className="bg-brand-green hover:bg-brand-green-hover text-white px-5 py-2 rounded-[3px] font-black uppercase text-[10px] tracking-wider cursor-pointer shadow-sm transition-colors"
                >
                  {lang === 'zh' ? '我已知晓并同意' : lang === 'ms' ? 'Saya Faham & Setuju' : 'I Understand & Agree'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CMS CONTROLLER WIDGET (merchant only, via ?admin=1) */}
      {isAdminUnlocked && (
      <div className="fixed bottom-[9.25rem] right-4 md:bottom-24 md:right-6 z-40 flex flex-col items-end gap-3" id="floating-cms-widget-container">
        <AnimatePresence>
          {isAdminPanelOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-slate-900 border border-slate-750 text-white p-5 rounded-lg shadow-2xl max-w-xs sm:max-w-sm w-80 sm:w-96 mb-2 flex flex-col gap-4 text-left backdrop-blur-md relative"
              id="cms-control-panel-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded">
                    <Settings className="h-4 w-4 animate-spin-slow" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-black text-xs uppercase tracking-wide text-amber-400">
                      AEM FOOD CMS
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {lang === 'zh' ? '可视化商户编辑器' : 'Visual Merchant Editor'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminPanelOpen(false)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between bg-slate-950/50 border border-slate-850 p-2.5 rounded">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'zh' ? '当前系统状态' : 'SYSTEM STATUS'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${adminMode ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-wider ${adminMode ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {adminMode 
                      ? (lang === 'zh' ? '● CMS 实时编辑中' : '● CMS ACTIVE') 
                      : (lang === 'zh' ? '○ 正常顾客浏览' : '○ BROWSE ONLY')}
                  </span>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <div className="flex items-center justify-between bg-slate-850/40 p-3 rounded border border-slate-800/80">
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-slate-100">
                    {lang === 'zh' ? '开启 CMS 编辑模式' : 'Enable CMS Mode'}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                    {lang === 'zh' ? '点击此处开启，立即实时编辑商品' : 'Toggle to modify gourmet catalog in real-time'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleAdminMode(!adminMode)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer outline-none relative flex items-center ${adminMode ? 'bg-brand-green' : 'bg-slate-700'}`}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: adminMode ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Short guidelines */}
              <div className="flex flex-col gap-2.5 text-slate-300 text-[10.5px] leading-relaxed border-t border-slate-850 pt-3">
                <p className="font-extrabold text-amber-400 uppercase tracking-wider text-[9px]">
                  {lang === 'zh' ? '💡 如何进行可视化编辑？' : '💡 HOW TO EDIT?'}
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 select-none shrink-0">1.</span>
                    <span>
                      {lang === 'zh' 
                        ? '开启上方开关后，在下方美食目录中选择您要修改的任意商品。' 
                        : 'With CMS switch ON, select any food item in the catalog below.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 select-none shrink-0">2.</span>
                    <span>
                      {lang === 'zh' 
                        ? '可点击直接上传本地真实照片、输入条形码、中英名称、描述与RM售价，然后保存。' 
                        : 'Upload real packaging images, modify descriptions, set RM prices, and click save.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 select-none shrink-0">3.</span>
                    <span>
                      {lang === 'zh' 
                        ? '在商品目录最上方，还会多出 ➕ 新增商品 卡片，支持无限添加录入自定义新品！' 
                        : 'Find the ➕ Add Product card at the top of the catalog to create custom items!'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 border-t border-slate-850 pt-3 mt-1">
                <button
                  onClick={handleResetAllProducts}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 font-extrabold text-[10px] uppercase tracking-wider py-2 rounded border border-slate-700 hover:border-slate-650 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{lang === 'zh' ? '重置出厂商品' : 'Reset Defaults'}</span>
                </button>
                <button
                  onClick={() => setIsAdminPanelOpen(false)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] uppercase tracking-wider py-2 px-4 rounded transition-all cursor-pointer"
                >
                  {lang === 'zh' ? '我知道了' : 'Got it'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CMS Launcher Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative group"
        >
          {/* Pulsing visual glow effect when active */}
          <span className={`absolute -inset-1 rounded-full opacity-35 animate-ping ${adminMode ? 'bg-amber-400' : 'bg-slate-400/20'}`} />
          
          <button
            onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
            className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-2 ${
              adminMode 
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-white/40' 
                : 'bg-slate-900 hover:bg-slate-850 text-white border-slate-750'
            }`}
            title={lang === 'zh' ? '可视化 CMS 控制台' : 'Visual CMS Console'}
          >
            {adminMode ? (
              <Sparkles className="w-6 h-6 animate-pulse text-slate-950" />
            ) : (
              <Settings className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Label tooltip that appears on hover */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-[4px] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-slate-750">
            <span className={`${adminMode ? 'text-amber-400' : 'text-slate-400'} mr-1 font-black`}>
              {adminMode ? '● CMS ACTIVE' : '○'}
            </span>
            {lang === 'zh' ? '商户可视化 CMS 控制台' : 'Visual CMS Console'}
          </div>
        </motion.div>
      </div>
      )}

      {/* MOBILE STICKY BOTTOM CONVERSION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-2" id="mobile-bottom-conversion-bar">
        <a
          href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20get%20an%20instant%20B2B%20wholesale%20price%20quote."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#25D366] active:bg-[#1fa851] text-white font-extrabold text-xs py-3 px-3 rounded flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider"
        >
          <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
          <span>{lang === 'zh' ? 'WhatsApp 5分钟报价' : 'Instant Quote'}</span>
        </a>

        <a
          href="https://wa.me/60149413545?text=Hello%20AEM%20Food,%20I%20would%20like%20to%20request%20a%20Free%20Sample%20Kit."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-amber-500 active:bg-amber-600 text-slate-950 font-black text-xs py-3 px-3 rounded flex items-center justify-center gap-1 shadow-md uppercase"
        >
          <span>🎁</span>
          <span>{lang === 'zh' ? '免费试吃' : 'Free Sample'}</span>
        </a>

        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-800 text-white font-black text-xs py-3 px-3 rounded flex items-center justify-center gap-1 border border-slate-700 active:bg-slate-700"
          aria-label="Open Order Builder"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-2" id="floating-whatsapp-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative group animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          {/* Pulsing visual glow effect */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping" />
          
          <a
            href="https://wa.me/60149413545"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 cursor-pointer border-2 border-white/20"
            title={lang === 'zh' ? '联系我们 & 销售部' : lang === 'ms' ? 'Hubungi Kami & Jabatan Jualan' : 'Contact Us & Sales Dept'}
          >
            <WhatsAppIcon className="w-8 h-8 fill-white" />
          </a>

          {/* Label tooltip that appears on hover */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-[4px] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-slate-750">
            <span className="text-[#25D366] font-extrabold mr-1">●</span>
            {lang === 'zh' ? '联系我们 & 销售部 (+6014-941 3545)' : lang === 'ms' ? 'Hubungi Kami & Jabatan Jualan (+6014-941 3545)' : 'Contact Us & Sales Dept (+6014-941 3545)'}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
