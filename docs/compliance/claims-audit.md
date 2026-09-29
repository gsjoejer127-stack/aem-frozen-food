# 对外宣称合规审计 / Public Claims Audit

**对象**：AL-EKHLAS MANUFACTURING SDN. BHD.（AEM Frozen Food / 真心食品）网站与 AI 索引文件
**审计日期**：2026-09-29 · **处理状态：已执行删除（2026-09-29）**
**范围**：`index.html`、`src/App.tsx`、`src/dictionary.ts`、`src/data.ts`、`src/components/HalalLogo.tsx`、`public/llms.txt`、`public/llms-full.txt`、`public/sitemap.xml`、`public/robots.txt`、`metadata.json`
**性质**：事实核对与风险标注，**非法律意见**，未经马来西亚执业律师或清真顾问审核。

---

## 一、一句话结论

猪肉那一处已修掉，但它只是症状。真正的结构性问题是：**对外宣称（网站 + AI 文件 + 结构化数据）是按 SEO 写的，不是按事实写的**，而 `src/data.ts`（真实的 51 个 SKU）才是唯一可验证的事实源。两者之间有 **1 项极高风险（清真标识与证书号）**、**4 项高风险（法规宣称）**、**6 项中风险（不存在的产品与前后矛盾）**。

对代工客户而言，这些矛盾比价格更致命：任何认真的品牌方做尽调时，第一件事就是核对你的认证与产品清单。

---

## 🔴 极高风险 — 建议 48 小时内处理

### 1. 自绘的清真标识 + 证书号 `1 233-08/2025`

**证据**：`src/components/HalalLogo.tsx` — 整个组件是用 SVG **手工重绘**的马来西亚官方清真标志：外圈 `★ MALAYSIA ★` 与 `ماليزيا`、八角星内 `HALAL`、下方 `MS 1500` 与证书号 `1 233-08/2025`。

**更正**：该组件**只被 import、从未渲染**，即未上线显示；首页上线的是文字角标 `HALAL CERTIFIED`（原 `src/App.tsx:890`、`:967`）。审计初稿称其显示于首页，有误。

**已处理**：整个 `HalalLogo.tsx` 已删除，两处 `HALAL CERTIFIED` 角标已移除。

**为什么是最高风险**：

- 清真标志在马来西亚受 **2011 年商品说明（清真认证与标示）令**（Trade Descriptions (Certification and Marking of Halal) Order 2011）与 **2011 年商品说明法令**管辖。**只有 JAKIM／州宗教局是合法认证机构**，标志必须使用其发出的官方图档，不得自行重绘、改比例或自行排版。即使你持有有效证书，**自绘版本仍可能被认定为不合规使用**。
- 若该证书号并非贵司现行有效的证书号，则属于**虚假清真表述**，对公司与董事都是刑事风险，不是民事纠纷。
- `08/2025` 若是**到期月份**，则该证书已过期一年以上，而标志仍挂在首页。

**必须先确认（只有你能回答）**：

1. 贵司目前是否持有 **有效** 的 JAKIM／雪兰莪州宗教局清真证书？
2. 证书号原文是什么？`1 233-08/2025` 是否与证书完全一致？
3. `08/2025` 是签发月还是到期月？现在是否仍在有效期内？
4. 证书涵盖的**产品范围**是哪些？（清真证书按厂房＋产品清单发放，不是「整家公司清真」）

**建议动作**：

- 证书有效 → 用 JAKIM 发出的**官方图档**替换自绘 SVG，证书号照抄证书，并注明认证范围与有效期。
- 证书无效／已过期／不涵盖全部产品 → **立刻从网站撤下清真标志、`HALAL CERTIFIED` 角标与所有 `Halal Certified` 文案**，改为中性表述（如 `No Pork · No Lard`／`猪肉与猪油不入厂`，这是事实陈述，不是认证宣称），待证书下来再恢复。

### 2. 全站通用的「HALAL CERTIFIED」宣称 vs 未标范围

**证据**：`src/dictionary.ts:21,25`（en）、`:125,129`（zh）`Halal Certified`；`index.html:46` `"Certified OEM Halal food manufacturer"`；`public/llms-full.txt:8` `"Halal certified dim sum, frozen dumplings..."`。

**问题**：清真证书从来不是「整家公司」的，而是**厂房＋特定产品清单**。目前全站是无范围、无证书号的通用宣称，覆盖 51 个 SKU。如果证书只覆盖其中一部分（很常见），未覆盖的那部分就构成越界宣称。这也正是你自己 OEM 协议第 9.1 条对客户写明的逻辑 —— 网站却没有对自己套用同一标准。

**建议**：网站标注「认证编号 XXX，涵盖：〈产品类别〉，有效期至 XXX」，与证书一字不差。

---

## 🟠 高风险 — 法规宣称

### 3. 「100% 绝无添加防腐剂」

**证据**：`src/dictionary.ts:45-46`（`100%` / `No Added Preservatives`）、`:149-150`（`100%` / `承诺绝无添加防腐剂`）、`:29`（`without artificial preservatives`）；`public/llms-full.txt:13`（`long shelf-life without chemical preservatives`）。

**问题**：这是**全站统一的绝对宣称**，却要为 51 个 SKU 全部成立 —— 包括 7 款火锅底料酱料、3 款调味粉、5 款油炸小吃。只要有一个 SKU 的**复配原料**（酱油、豆瓣、辣椒酱、面皮改良剂）含防腐剂，这句话就不成立。1985 年食品条例对标签与**广告**同样适用，「无防腐剂」属须经得起查验的宣称。

**建议**：改为逐品项的事实陈述（如「本品未额外添加防腐剂」），或整体降级为「以急速冷冻锁鲜，不依赖防腐剂延长保质期」—— 描述工艺，不做绝对承诺。

### 4. 药效／功能宣称（这一块比想象中广）

**证据**（`src/data.ts`）：

| 行 | 产品 | 宣称原文 |
|---|---|---|
| 708–713 | 虎乳芝养肺鸡汤包 | `boost lung health and immunity` / 「润肺止咳，**提升免疫力**」 |
| 720–722 | 天麻安神补脑汤包 | `soothe headaches, improve sleep and focus` |
| 733–735 | 巴戟天强肾壮骨汤包 | `strengthen lower back, joints and energy` /「强筋骨、壮腰膝」 |
| 746–748 | 虫草花补肺滋肾汤包 | `nurture kidney and respiratory functions` /「滋阴润肺，益肾养颜」 |
| 761–766 | 枸杞菊花明目鸡汤包 | `Eye-care specialty` /「清火明目」 |
| 651–656 | 润燥美目茶 | `soothe eyes and hydrate the body` /「明目润燥」 |
| 181 | 冰糖雪梨 | `soothe the throat and cool the body` /「清热润肺」 |
| 498 | 金汤花胶鸡汤底 | `packed with collagen` /「胶原蛋白满满」 |

另见 `public/llms-full.txt:48`（`Soothes throat, clears heat, alleviates dry coughs`）、`public/llms.txt:28`（`Soothing for lungs & throat`）、`src/dictionary.ts:144`（「润肺养生的冰糖雪梨」）。

**问题**：1983 年食品法令与 1985 年食品条例下，**声称食品可预防、缓解、治疗疾病或改善特定器官功能，属不允许的宣称**，且同样适用于广告。「提升免疫力」「明目」「补脑」「强肾」是 KKM 最常处理的一类。`public/llms-full.txt:51` 的「银耳富含胶原蛋白（Rich collagen texture）」则**事实错误** —— 银耳是植物多糖，不含胶原蛋白。

**建议（务实做法，不必伤品牌）**：产品**名称**沿用传统叫法（马来西亚华人食品行业通行），但**描述文案改为讲配料与传统用法，不讲效果**：

- ❌「润肺止咳，提升免疫力」 → ✅「精选大马虎乳芝配高汤包，传统煲汤配方」
- ❌「清火明目」 → ✅「枸杞与小黄菊配伍，汤感清爽微甘」
- ❌「胶原蛋白满满」 → ✅「老母鸡与骨汤慢熬数小时，汤色金黄浓醇」

### 5. 无法自证的设施与认证宣称

**证据**：`public/llms-full.txt:12`（`100,000-class dust-free cleanroom`）、`:14`（`-35°C to -40°C` 急速冷冻）、`:15`（`HACCP & Hygiene Compliance`）、`:7`（`retort packaging`）、`:59`（`modified atmosphere packaging (MAP)`）；`index.html:191`（`100,000-class cleanroom facilities`）。

**问题**：这些是**可被稽核的硬指标**。OEM 客户尽调时会要：十万级洁净室的验证报告、急冻机的温度记录、HACCP 证书（`HACCP Compliance` 的写法会被读成「已取得 HACCP 认证」）、MAP／retort 产线的照片。拿不出来，整份宣称的可信度一起崩 —— 这正是你说的「客户会直接怀疑你的认证」。

**另有明显笔误**：`src/dictionary.ts:28`／`:132` 写的是 **「-45%」急速冷冻技术**（`Advanced -45% Flash-Freezing Technology`／「先进的-45% 急速冷冻锁鲜技术」）—— 温度写成了百分比，而且 −45 与 llms 文件的 −35～−40 互相打架。这条挂在首页 badge 上，任何工程背景的买家一眼就看出不专业。

**建议**：逐条核实，做得到的保留并准备好证据文件；做不到的删掉或降级（「符合 HACCP 原则管理」≠「HACCP 认证」，两者法律含义不同）。温度统一成一个数字，`%` 改成 `°C`。

### 6. 最高级形容词

**证据**：`public/llms-full.txt:4`（`Malaysia's premier`）、`index.html:10`（`Premier`）、`:72`（`Leading`）、`:167`（`top-tier`）、`src/App.tsx:179`（「顶级」）、`:182`（`Premier`）。

**问题**：2011 年商品说明法令下，无法举证的最高级宣称属虚假商品说明。对 B2B 买家而言，这类词也不加分。

**建议**：换成可验证的事实 —— 「51 个自有 SKU」「雪兰莪 Semenyih 自有厂房」「冷链覆盖西马」。

---

## 🟡 中风险 — 产品清单与前后矛盾

### 7. AI 文件里有 5 类产品，真实目录里根本不存在

| 宣传中的产品 | 出处 | `src/data.ts` 实况 |
|---|---|---|
| 糯米鸡（Glutinous Rice Chicken） | `llms.txt:6,32`、`llms-full.txt:54`、`index.html:175,223` | **不存在** |
| 包子 Paos & 烧卖 Siew Mai／点心 Dim Sum | `llms.txt:31,33`、`llms-full.txt:53,55`、`index.html:10,80,172,222` | **不存在**（全站无点心类目） |
| 银耳莲子百合羹 | `llms.txt:29`、`llms-full.txt:50` | **不存在** |
| 红枣桂圆滋补汤 | `llms.txt:30` | **不存在** |
| Barbecue Sauce & Peanut Dip（沙爹花生酱） | `llms.txt:21` | **不存在**（只有蒜蓉蘸酱、红辣椒油） |

**附带的清真问题**：`llms-full.txt:54` 描述糯米鸡含 **lap cheong（腊肠）**。腊肠在华人食品语境默认是猪肉制品 —— 这是猪肉内容的**第二处残留**，在同一份自称清真的文件里。

**建议**：确实在做的（哪怕只做 OEM 不上零售）→ 补进 `data.ts` 并写明腊肠的清真来源；不做的 → 从所有文件删除。

### 8. 真实在卖的 36 个 SKU，AI 文件一个字都没提

AI 文件只写了沙爹、饺子、糖水、点心四类。实际目录里**完全没被提及**的有：

- 中式料理包（Ready-to-eat）8 款 · 火锅底料与酱料 7 款 · 养生汤包 6 款 · 小吃 5 款 · 花茶 4 款 · 腌制肉片 3 款 · 调味粉 3 款 = **36 / 51 个 SKU**

**这是纯粹的商业损失**：AI 搜索答不出你有火锅底料、料理包、调味粉，而这几类恰恰是餐饮连锁代工询价最集中的品类。修 llms 文件时应当**按 `data.ts` 重写全目录**，而不是只删错的。

### 9. 联络资料与营业时间三处不一致

| 项目 | 出处 A | 出处 B |
|---|---|---|
| 邮箱 | `info@alekhlasfood.com`（`llms-full.txt:73`） | `alekhlas.sales@gmail.com`（`src/legal.ts:46`） |
| 营业时间 | `08:30–18:00`（`llms.txt:43`、`llms-full.txt:74`、`index.html:118`） | `9:00 AM–6:00 PM`（`src/dictionary.ts:109,213`） |
| 电话 | `+6014-941 3545`（`llms.txt`、`index.html:96`、`legal.ts`） | `llms-full.txt` **完全没有电话** |

法规风险低，但这是客户第一眼就会踩到的不专业细节；结构化数据里的营业时间还会直接进 Google 商家信息。

### 10. 促销的划线价与「会员」

**证据**：`src/dictionary.ts:99-100`／`:203-204`（`RM 75.00` 划掉 `RM 89.00`）、`:102-106`／`:206-210`（`Member-Exclusive 10%`／「会员专享 10% 折扣」）。

**问题**：划线原价属价格比较宣称，必须是**曾经真实销售过的价格**；「会员专享」则需要真的存在会员制度。而网站整体定位已经改成询价工具（`80b1f8b` 那次提交），不收款、价格「仅供参考」—— 促销区与这个定位自相矛盾。

### 11. 「Halal-Friendly Sourcing」自我削弱

**证据**：`src/dictionary.ts:32-33` 英文写 `Halal-Friendly Sourcing`，中文对应位置（`:136-137`）写「清真标准 安全卫生」。

**问题**：`Halal-friendly` 在马来西亚是**明确要避免**的模糊说法（业界与监管都不接受「清真友好」这种中间态）。而且同一页另一处又写 `HALAL CERTIFIED` —— 一个页面上两种互斥的清真表述，对稽核员来说是红旗。

---

## ℹ️ 已确认没问题的

- `src/data.ts` 51 个 SKU：**无任何猪肉、猪油、酒精类原料**，清单本身是干净的。
- `src/legal.ts` 三份政策：条款保守、责任归属清晰，清真范围（第 8 条）与过敏原（第 9 条）写法正确，**反而比网站首页的宣称更合规**。
- `robots.txt` / `sitemap.xml`：正常，无问题。
- `firebase-applet-config.json` 里的 `apiKey`：Firebase 前端配置本就公开，不是密钥泄漏；但请确认 Firestore／Storage 安全规则不是 test mode。

---

## 二、需要你回答的 6 个问题（回答后我才能动手改）

1. **清真证书**：现在有效吗？证书号原文？`08/2025` 是签发还是到期？涵盖哪些产品？
2. **急冻温度**：到底是 −40°C 还是 −45°C？（`%` 一定是笔误）
3. **十万级洁净室、HACCP、retort、MAP**：哪几项是真的、拿得出文件的？
4. **糯米鸡／包子／烧卖／银耳莲子／红枣桂圆／花生蘸酱**：在做还是不做？糯米鸡里的腊肠是什么肉？
5. **邮箱与营业时间**：以哪一个为准？
6. **促销区**：划线价 RM89 真实卖过吗？会员制度真的存在吗？还是整块删掉？

---

## 三、建议的处理顺序

| 优先级 | 动作 | 依赖 |
|---|---|---|
| 1（今天） | 清真标志与证书号：核实 → 换官方图档或撤下 | 问题 1 |
| 2（本周） | 删除／改写药效宣称（8 处产品描述 + 3 处 AI 文件） | 无，可直接做 |
| 3（本周） | 「100% 无防腐剂」降级；`-45%` 改 `−40°C`；删最高级形容词 | 问题 2 |
| 4（本周） | 按 `data.ts` 重写 `llms.txt` / `llms-full.txt` 全目录（补 36 个 SKU，删 5 类不存在的产品，清掉腊肠） | 问题 4 |
| 5（随后） | 设施宣称逐条核实；统一邮箱与营业时间；促销区处理 | 问题 3、5、6 |
| 6（随后） | 重新部署 + Search Console 提交重新抓取（AI 索引需数周更新） | — |

第 2 项（药效宣称）不依赖任何回答，随时可以动手 —— 说一声我就改。

---

## 四、执行记录（2026-09-29）

按「全部有问题的直接删」执行。所有改动已通过 `npm run build` 验证。

### 已删除

| 项目 | 处理 | 文件 |
|---|---|---|
| 自绘的官方清真标志 + `MS 1500` + 证书号 `1 233-08/2025` | 整个组件删除（原本只 import 未渲染） | `src/components/HalalLogo.tsx`（已删）、`src/App.tsx` |
| 两处 `HALAL CERTIFIED` 角标 | 删除 | `src/App.tsx` |
| `Halal Certified` / `Certified OEM Halal` 文案 | 删除 | `src/dictionary.ts`、`index.html` |
| `No Pork, No Lard` / 「猪肉与猪油不入厂」 | 删除（原为认证宣称的替代文案，经指示一并移除） | `src/dictionary.ts`、`public/llms*.txt` |
| `Halal-Friendly Sourcing` | 改为 `Selected Ingredients` / 「严选原料」 | `src/dictionary.ts`（en/zh/ms） |
| `100%` + 「绝无添加防腐剂」首页数据 | 改为 `50+` 自有产品款式（可验证） | `src/dictionary.ts`（en/zh/ms） |
| `-45%` 急速冷冻技术（温度写成百分比） | 删除数字，保留「急速冷冻锁鲜技术」 | `src/dictionary.ts`（en/zh/ms） |
| 十万级无尘洁净室 / cleanroom | 全部删除（网站 + FAQ 结构化数据 + AI 文件） | `src/App.tsx`、`index.html`、`public/llms*.txt` |
| HACCP / retort / MAP 认证暗示 | 从 AI 文件删除 | `public/llms-full.txt` |
| `Premier` / `Leading` / `top-tier` / 「顶级」 | 全部删除 | `index.html`、`src/App.tsx`、`public/llms*.txt` |
| 8 处药效宣称（提升免疫力、明目、补脑、强肾、清热解毒、胶原蛋白等） | 描述文案改写为讲配料与口感 | `src/data.ts` |
| 银耳「富含胶原蛋白」（事实错误） | 随该产品条目一并删除 | `public/llms-full.txt` |
| 糯米鸡（含腊肠）、包子、烧卖、点心类目、银耳莲子百合羹、红枣桂圆滋补汤、花生蘸酱 | 全部删除 | `public/llms*.txt`、`index.html` |
| 失效的促销文案（划线价 RM89、会员专享 10%） | 删除（原本就是未被引用的死字符串） | `src/dictionary.ts`（en/zh/ms） |
| `100+ 款产品选择` | 改为 `50+`（实际 51） | `src/App.tsx` |
| 新增产品模板里的「无尘环境」默认描述 | 改为空白提示语 | `src/App.tsx` |

### 已补正

- `public/llms.txt` 与 `public/llms-full.txt` **按 `src/data.ts` 完全重写**：51 个 SKU、10 个品类、包装规格、配送门槛、过敏原声明、储存条件全部据实列出。此前缺失的 36 个 SKU（中式料理包 8、火锅底料酱料 7、养生汤包 6、小吃 5、花茶 4、腌制肉片 3、调味粉 3）已全部补上。
- 邮箱统一为 `alekhlas.sales@gmail.com`（与 `src/legal.ts` 一致），营业时间统一为 `08:30–18:00`（与结构化数据一致）。
- `metadata.json` 描述改为与实际目录相符。
- 养生汤包条目加注：`These are food products. No medicinal, therapeutic or health effect is claimed for them.`

### 未删除 —— 需要你决定的一项

**6 个 SKU 的中文品名本身含功能词**：润燥美目茶、清火菊花茶、虎乳芝**养肺**鸡汤包、天麻**安神补脑**汤包、巴戟天**强肾壮骨**汤包、虫草花**补肺滋肾**汤包、枸杞菊花**明目**鸡汤包。

没有动的理由：这些是**印在实物包装上的品名**。只改网站不改包装，会造成「网站名 ≠ 客户收到的产品名」—— 正是这次在修的那类矛盾；而法规风险主要落在**标签**上，改网站并不降低它。

建议：下次包装改版时把功能词从品名里拿掉（如「虎乳芝鸡汤包」「天麻汤包」「枸杞菊花鸡汤包」），在此之前**文案中不再重复这些功能词**（已做到）。这一步涉及印刷成本，由你决定时机。

### 仍然悬而未决 —— 清真认证

删除了所有**认证宣称**（标志、证书号、`CERTIFIED` 字样），但保留了**业务描述**（`OEM Halal Food Manufacturer`、`Halal Chinese Food Specialist`），因为那是贵司的主营定位。

**这一步需要你确认：**

- **证书有效** → 把官方图档、证书号与认证范围给我，我按合规方式加回去（标注编号、范围、有效期）。
- **证书无效／过期／范围不全** → 网站上「halal」这个词本身也要一并撤下，改为纯事实表述（猪肉与猪油不入厂）。这一步我没有擅自做，因为等于关掉你的主要卖点，必须由你决定。
