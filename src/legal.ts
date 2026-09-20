/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Legal texts for AL-EKHLAS MANUFACTURING SDN. BHD. (AEM Frozen Food).
 *
 * Kept as data rather than JSX so clauses can be revised without touching the
 * component tree. Every clause carries all three languages at once: the PDPA
 * (s.7(3)) requires the privacy notice to be available in both Bahasa Malaysia
 * and English, and rendering them together satisfies that by default.
 *
 * Drafting rules for this file:
 *   - short clauses, plain wording, one idea per clause;
 *   - the Company gives no undertaking, guarantee or fixed timeframe anywhere;
 *   - anything the Company may do is expressed as a discretion, not a promise.
 *
 * NOTE FOR REVIEW: not reviewed by a lawyer.
 */

export type Tri = { en: string; zh: string; ms: string };

export type LegalDocId = 'terms' | 'refund' | 'pdpa';

export interface LegalClause {
  heading: Tri;
  body: Tri;
  /** 'warning' renders an amber call-out, 'consent' a green one. */
  tone?: 'warning' | 'consent';
}

export interface LegalDoc {
  id: LegalDocId;
  label: Tri;
  intro: Tri;
  clauses: LegalClause[];
}

export const LEGAL_LAST_UPDATED = '20 September 2026';

export const LEGAL_ENTITY = {
  name: 'AL-EKHLAS MANUFACTURING SDN. BHD.',
  regNo: '202401022253 (1568102-T)',
  address: 'No 27, Jalan P4/5, Bandar Teknologi Kajang, 43500 Semenyih, Selangor',
  phone: '+6014-941 3545',
  email: 'alekhlas.sales@gmail.com'
};

/* ------------------------------------------------------------------ */
/* 1. TERMS & CONDITIONS                                               */
/* ------------------------------------------------------------------ */

const TERMS: LegalDoc = {
  id: 'terms',
  label: { en: 'Terms & Conditions', zh: '条款与细则', ms: 'Terma & Syarat' },
  intro: {
    zh: '本条款适用于 AL-EKHLAS MANUFACTURING SDN. BHD.（以下简称「本公司」）的所有报价、销售与代工安排。您提交询价、索取样品或下单，即表示同意本条款。',
    en: 'These Terms apply to all quotations, sales and contract manufacturing by AL-EKHLAS MANUFACTURING SDN. BHD. (the Company). By submitting an enquiry, requesting a sample or placing an order, you (the Buyer) agree to these Terms.',
    ms: 'Terma ini terpakai bagi semua sebut harga, jualan dan pengilangan kontrak oleh AL-EKHLAS MANUFACTURING SDN. BHD. (Syarikat). Dengan menghantar pertanyaan, meminta sampel atau membuat pesanan, anda (Pembeli) bersetuju dengan Terma ini.'
  },
  clauses: [
    {
      heading: { en: '1. No Offer, No Guarantee', zh: '1. 非要约，不构成保证', ms: '1. Bukan Tawaran, Tiada Jaminan' },
      body: {
        zh: '本网站所载价格、规格、图片、库存及交期均为参考资料，不构成要约或保证。本网站之选购清单功能仅用于生成询价讯息，不构成订单。合约仅在本公司以书面（含 WhatsApp）确认订单后成立。口头内容不具约束力。',
        en: 'Prices, specifications, images, stock and lead times on this website are reference information only. They are not an offer and not a guarantee. The selection list on this website generates an enquiry message and is not an order. A contract arises only when the Company confirms the order in writing, including by WhatsApp. Oral statements do not bind the Company.',
        ms: 'Harga, spesifikasi, imej, stok dan tempoh penghantaran di laman web ini adalah maklumat rujukan sahaja. Ia bukan tawaran dan bukan jaminan. Senarai pilihan di laman web ini menjana mesej pertanyaan dan bukan pesanan. Kontrak hanya wujud apabila Syarikat mengesahkan pesanan secara bertulis, termasuk melalui WhatsApp. Kenyataan lisan tidak mengikat Syarikat.'
      }
    },
    {
      heading: { en: '2. Prices and Payment', zh: '2. 价格与付款', ms: '2. Harga dan Pembayaran' },
      body: {
        zh: '本网站不收取任何款项，亦不提供任何在线支付方式。价格以马币计算，未含 SST 及其他政府税费，并可随时调整。最终价格、付款方式与付款时间，一律由本公司销售团队于确认订单时另行议定。除非本公司另行书面批准账期，否则须于出货前全额付清；逾期款项本公司有权计息并暂停出货。货款全数结清前，货物所有权仍属本公司。',
        en: 'This website takes no payment and offers no online payment facility of any kind. Prices are in Ringgit Malaysia, exclude SST and other government charges, and may change at any time. Final pricing, the method of payment and the time for payment are agreed separately with the Company sales team when the order is confirmed. Unless the Company approves a credit term in writing, payment is due in full before dispatch; the Company may charge interest on overdue sums and suspend further dispatch. Ownership of the goods stays with the Company until payment is received in full.',
        ms: 'Laman web ini tidak menerima sebarang bayaran dan tidak menyediakan apa-apa kemudahan pembayaran dalam talian. Harga dalam Ringgit Malaysia, tidak termasuk SST dan caj kerajaan lain, dan boleh berubah pada bila-bila masa. Harga akhir, kaedah pembayaran dan masa pembayaran dipersetujui secara berasingan dengan pasukan jualan Syarikat semasa pesanan disahkan. Melainkan Syarikat meluluskan terma kredit secara bertulis, bayaran penuh perlu dibuat sebelum penghantaran; Syarikat boleh mengenakan faedah ke atas jumlah tertunggak dan menggantung penghantaran. Pemilikan barangan kekal dengan Syarikat sehingga bayaran diterima sepenuhnya.'
      }
    },
    {
      heading: { en: '3. Delivery', zh: '3. 配送', ms: '3. Penghantaran' },
      body: {
        zh: '运费、配送范围及时段以订单确认时的报价为准，并可随时调整。所有交期均为估计，本公司不保证准时送达，亦不就延误承担任何责任。',
        en: 'Delivery charges, coverage and time slots are as quoted at order confirmation and may change at any time. All delivery dates are estimates. The Company does not guarantee delivery on any particular date and accepts no liability for delay.',
        ms: 'Caj penghantaran, liputan dan slot masa adalah seperti yang disebut harga semasa pengesahan pesanan dan boleh berubah pada bila-bila masa. Semua tarikh penghantaran adalah anggaran. Syarikat tidak menjamin penghantaran pada mana-mana tarikh tertentu dan tidak menerima liabiliti atas kelewatan.'
      }
    },
    {
      heading: { en: '4. Risk Passes on Delivery', zh: '4. 风险于交付时转移', ms: '4. Risiko Berpindah Semasa Penghantaran' },
      body: {
        zh: '货物风险于送达买方指定地址或买方提货时转移予买方。买方须安排人员签收，并预先备妥足够冷冻储存空间。若因无人签收、地址错误、拒收或储存空间不足导致配送失败，相关运费及货物损失由买方承担。',
        en: 'Risk passes to the Buyer on delivery to the nominated address, or on collection. The Buyer must have an authorised person present to receive the goods and adequate frozen storage ready. If delivery fails because no one is present, the address is wrong, the goods are refused or storage is inadequate, the Buyer bears the delivery cost and the loss of the goods.',
        ms: 'Risiko berpindah kepada Pembeli semasa penghantaran ke alamat yang dinyatakan, atau semasa pengambilan. Pembeli mesti menyediakan wakil yang sah untuk menerima barangan dan storan beku yang mencukupi. Jika penghantaran gagal kerana tiada orang hadir, alamat salah, barangan ditolak atau storan tidak mencukupi, Pembeli menanggung kos penghantaran dan kerugian barangan.'
      }
    },
    {
      heading: { en: '5. Inspection on Delivery', zh: '5. 交付时验收', ms: '5. Pemeriksaan Semasa Penghantaran' },
      tone: 'warning',
      body: {
        zh: '买方须于交付当下检查数量、品项、包装及冷冻状态。任何问题须于交付后两（2）小时内以 WhatsApp 通知本公司并附照片证据。逾时未通知，货物视为已接受，其后不得就该批货物索偿。',
        en: 'The Buyer must check quantity, items, packaging and frozen condition at the point of delivery. Any issue must be reported to the Company by WhatsApp within two (2) hours of delivery, with photographic evidence. If no report is made within that time the goods are treated as accepted and no claim may be made afterwards for that consignment.',
        ms: 'Pembeli mesti memeriksa kuantiti, item, pembungkusan dan keadaan beku semasa penghantaran. Sebarang isu mesti dilaporkan kepada Syarikat melalui WhatsApp dalam tempoh dua (2) jam selepas penghantaran, dengan bukti bergambar. Jika tiada laporan dibuat dalam tempoh tersebut, barangan dianggap diterima dan tiada tuntutan boleh dibuat selepas itu bagi penghantaran berkenaan.'
      }
    },
    {
      heading: { en: '6. Storage and Handling by the Buyer', zh: '6. 买方之储存与处理', ms: '6. Penyimpanan dan Pengendalian oleh Pembeli' },
      tone: 'warning',
      body: {
        zh: '收货后买方须立即以 -18°C 或以下冷冻储存，并维持冷链不中断，解冻后不得再冷冻。因买方或其雇员、代理、分销商或客户储存、处理、烹调、运输不当所致之任何品质问题、食安事故或第三方索偿，本公司概不负责，买方并须对本公司作出全额补偿。',
        en: 'After taking delivery the Buyer must store the products at -18°C or below and keep the cold chain unbroken. Thawed products must not be refrozen. The Company is not responsible for any quality issue, food safety incident or third party claim arising from storage, handling, cooking or transport by the Buyer or its staff, agents, distributors or customers, and the Buyer shall indemnify the Company in full against such claims.',
        ms: 'Selepas menerima penghantaran, Pembeli mesti menyimpan produk pada -18°C atau lebih rendah dan mengekalkan rantaian sejuk. Produk yang telah cair tidak boleh dibekukan semula. Syarikat tidak bertanggungjawab atas sebarang isu kualiti, insiden keselamatan makanan atau tuntutan pihak ketiga akibat penyimpanan, pengendalian, memasak atau pengangkutan oleh Pembeli atau kakitangan, ejen, pengedar atau pelanggannya, dan Pembeli hendaklah menanggung rugi Syarikat sepenuhnya.'
      }
    },
    {
      heading: { en: '7. Product Information', zh: '7. 产品资料', ms: '7. Maklumat Produk' },
      body: {
        zh: '产品描述、图片、重量及份量仅供参考。原料、批次及包装作业之自然差异属正常，不构成缺陷。本公司可随时调整配方、原料来源及包装，恕不另行通知。',
        en: 'Product descriptions, images, weights and portion counts are for reference only. Natural variation between raw materials, batches and packing runs is normal and is not a defect. The Company may change recipes, raw material sources and packaging at any time without notice.',
        ms: 'Penerangan produk, imej, berat dan bilangan bahagian adalah untuk rujukan sahaja. Variasi semula jadi antara bahan mentah, kelompok dan pembungkusan adalah normal dan bukan kecacatan. Syarikat boleh menukar resipi, sumber bahan mentah dan pembungkusan pada bila-bila masa tanpa notis.'
      }
    },
    {
      heading: { en: '8. Halal Scope', zh: '8. 清真范围', ms: '8. Skop Halal' },
      tone: 'warning',
      body: {
        zh: '本公司之清真认证（如适用）仅及于本厂生产过程至出货为止。交付后维持清真完整性之责任全在买方，包括储存隔离、再加工、分装、重贴标签及销售环节。买方不得就本公司产品作出超出本公司认证范围之清真声明。',
        en: 'The halal certification held by the Company, where applicable, covers the production process in its own plant up to dispatch. After delivery, responsibility for halal integrity rests entirely with the Buyer, including segregated storage, reprocessing, repacking, relabelling and the point of sale. The Buyer must not make any halal representation about the products beyond the scope of the Company certification.',
        ms: 'Pensijilan halal yang dipegang Syarikat, jika berkenaan, meliputi proses pengeluaran di kilangnya sendiri sehingga penghantaran. Selepas penghantaran, tanggungjawab integriti halal terletak sepenuhnya pada Pembeli, termasuk penyimpanan berasingan, pemprosesan semula, pembungkusan semula, pelabelan semula dan titik jualan. Pembeli tidak boleh membuat representasi halal mengenai produk melebihi skop pensijilan Syarikat.'
      }
    },
    {
      heading: { en: '9. Allergens', zh: '9. 过敏原', ms: '9. Alergen' },
      body: {
        zh: '产品于共用设施生产，可能含有或接触麸质、大豆、蛋、花生、坚果、芝麻、甲壳类及乳制品。买方转售、分装或供餐时，须自行向终端消费者作出成分与过敏原告知，相关责任由买方承担。',
        en: 'Products are made in a shared facility and may contain or come into contact with gluten, soy, egg, peanut, tree nuts, sesame, crustaceans and dairy. Where the Buyer resells, repacks or serves the products, the Buyer is responsible for ingredient and allergen disclosure to end consumers and bears the resulting liability.',
        ms: 'Produk dibuat dalam kemudahan yang dikongsi dan mungkin mengandungi atau bersentuhan dengan gluten, soya, telur, kacang tanah, kacang pokok, bijan, krustasia dan tenusu. Apabila Pembeli menjual semula, membungkus semula atau menghidangkan produk, Pembeli bertanggungjawab membuat pendedahan ramuan dan alergen kepada pengguna akhir dan menanggung liabiliti berkenaan.'
      }
    },
    {
      heading: { en: '10. OEM and ODM', zh: '10. 代工生产（OEM / ODM）', ms: '10. OEM dan ODM' },
      body: {
        zh: '代工须另签书面协议。买方须保证其提供之配方、品牌、商标、包装美术稿及标签合法且不侵害第三方权利，并就此对本公司作出全额补偿。代工订单一经投产不得取消或退货，实际产出量之差异按实结算。',
        en: 'Contract manufacturing is subject to a separate written agreement. The Buyer warrants that every recipe, brand, trade mark, artwork and label it supplies is lawful and does not infringe third party rights, and shall indemnify the Company in full in that respect. Once a contract manufacturing order is in production it cannot be cancelled or returned, and the Buyer settles against actual output.',
        ms: 'Pengilangan kontrak tertakluk kepada perjanjian bertulis berasingan. Pembeli menjamin bahawa setiap resipi, jenama, cap dagangan, reka bentuk dan label yang dibekalkan adalah sah dan tidak melanggar hak pihak ketiga, dan hendaklah menanggung rugi Syarikat sepenuhnya. Setelah pesanan pengilangan kontrak memasuki pengeluaran, ia tidak boleh dibatalkan atau dipulangkan, dan Pembeli menjelaskan bayaran mengikut output sebenar.'
      }
    },
    {
      heading: { en: '11. Intellectual Property', zh: '11. 智慧财产权', ms: '11. Harta Intelek' },
      body: {
        zh: '本网站所有内容、商标、标志、产品名称、文案与设计均属本公司或其授权人所有，未经书面同意不得复制、改作或商业使用。',
        en: 'All content, trade marks, logos, product names, copy and design on this website belong to the Company or its licensors and may not be copied, adapted or used commercially without written consent.',
        ms: 'Semua kandungan, cap dagangan, logo, nama produk, teks dan reka bentuk di laman web ini adalah milik Syarikat atau pemberi lesennya dan tidak boleh disalin, disesuaikan atau digunakan secara komersial tanpa kebenaran bertulis.'
      }
    },
    {
      heading: { en: '12. Limitation of Liability', zh: '12. 责任限制', ms: '12. Had Liabiliti' },
      tone: 'warning',
      body: {
        zh: '在法律允许之最大范围内，本公司就任何索偿之责任总额，以买方就引致该索偿之货物实际已付之发票金额为上限，且不就利润、营业额、商誉、营运中断、商机或客户之损失，或任何间接、附带、衍生损失承担责任。本条不排除依马来西亚法律不得排除之责任。',
        en: 'To the fullest extent permitted by law, the total liability of the Company for any claim is limited to the invoice value actually paid by the Buyer for the goods giving rise to the claim, and the Company is not liable for loss of profit, turnover, goodwill, business interruption, opportunity or customers, or for any indirect, incidental or consequential loss. This clause does not exclude liability which cannot be excluded under Malaysian law.',
        ms: 'Setakat yang dibenarkan undang-undang, jumlah liabiliti Syarikat bagi mana-mana tuntutan adalah terhad kepada nilai invois yang sebenarnya dibayar oleh Pembeli bagi barangan yang menimbulkan tuntutan, dan Syarikat tidak bertanggungjawab atas kehilangan keuntungan, perolehan, nama baik, gangguan perniagaan, peluang atau pelanggan, atau sebarang kerugian tidak langsung, sampingan atau berbangkit. Klausa ini tidak mengecualikan liabiliti yang tidak boleh dikecualikan di bawah undang-undang Malaysia.'
      }
    },
    {
      heading: { en: '13. Force Majeure', zh: '13. 不可抗力', ms: '13. Force Majeure' },
      body: {
        zh: '因天灾、水灾、火灾、疫病、公共卫生命令、罢工、停电、冷链设备故障、原料短缺、运输中断、法规变更或认证机构决定等超出本公司合理控制之事件所致之延误或无法履约，本公司不负责任。',
        en: 'The Company is not liable for delay or failure to perform caused by events beyond its reasonable control, including acts of God, flood, fire, epidemic, public health orders, strikes, power failure, cold chain equipment failure, raw material shortage, transport disruption, regulatory change or decisions of a certification body.',
        ms: 'Syarikat tidak bertanggungjawab atas kelewatan atau kegagalan melaksanakan akibat peristiwa di luar kawalan munasabahnya, termasuk bencana alam, banjir, kebakaran, wabak, perintah kesihatan awam, mogok, kegagalan bekalan elektrik, kerosakan peralatan rantaian sejuk, kekurangan bahan mentah, gangguan pengangkutan, perubahan peraturan atau keputusan badan pensijilan.'
      }
    },
    {
      heading: { en: '14. Records, Changes and Governing Law', zh: '14. 纪录、修订与管辖法律', ms: '14. Rekod, Pindaan dan Undang-Undang' },
      body: {
        zh: 'WhatsApp 对话、电邮往来及本公司订单纪录，构成订单内容之有效证据。本公司可随时修订本条款，修订版一经公布即生效并适用于其后订单。本条款受马来西亚法律管辖，以英文版本为准，中文及马来文版本仅供参考。',
        en: 'WhatsApp conversations, email correspondence and the Company order records are valid evidence of the content of an order. The Company may revise these Terms at any time; a revised version takes effect on publication and applies to later orders. These Terms are governed by the laws of Malaysia. The English version prevails; the Chinese and Malay versions are for reference.',
        ms: 'Perbualan WhatsApp, surat-menyurat e-mel dan rekod pesanan Syarikat adalah bukti sah kandungan pesanan. Syarikat boleh menyemak semula Terma ini pada bila-bila masa; versi yang disemak berkuat kuasa apabila diterbitkan dan terpakai bagi pesanan kemudian. Terma ini dikawal oleh undang-undang Malaysia. Versi Bahasa Inggeris adalah muktamad; versi Bahasa Cina dan Bahasa Melayu adalah untuk rujukan.'
      }
    }
  ]
};

/* ------------------------------------------------------------------ */
/* 2. REFUND & RETURN POLICY                                           */
/* ------------------------------------------------------------------ */

const REFUND: LegalDoc = {
  id: 'refund',
  label: { en: 'Refund & Return Policy', zh: '退款与退货政策', ms: 'Polisi Bayaran Balik & Pemulangan' },
  intro: {
    zh: '本政策适用于本公司销售之所有冷冻食品。基于食品安全与卫生，冷冻食品一经交付即无法回收转售，故适用条件较一般商品严格。',
    en: 'This policy applies to all frozen food sold by the Company. For food safety and hygiene reasons frozen goods cannot be recovered for resale once delivered, so the conditions below are stricter than for general merchandise.',
    ms: 'Polisi ini terpakai bagi semua makanan sejuk beku yang dijual oleh Syarikat. Atas sebab keselamatan makanan dan kebersihan, barangan beku tidak boleh dipulihkan untuk jualan semula setelah dihantar, jadi syarat di bawah lebih ketat berbanding barangan am.'
  },
  clauses: [
    {
      heading: { en: '1. No Change of Mind Returns', zh: '1. 不接受因改变主意之退货', ms: '1. Tiada Pemulangan Kerana Berubah Fikiran' },
      tone: 'warning',
      body: {
        zh: '货物一经售出及交付，除本政策第 2 条所列情形外，恕不退货、不换货、不退款。订错品项、订多数量、口味不合或需求改变，均不属退换范围。',
        en: 'Once goods are sold and delivered there is no return, no exchange and no refund, except in the situations listed in clause 2. Ordering the wrong item, ordering too much, disliking the taste or a change in requirements are not grounds for return.',
        ms: 'Setelah barangan dijual dan dihantar, tiada pemulangan, tiada pertukaran dan tiada bayaran balik, kecuali dalam situasi yang disenaraikan dalam klausa 2. Tersalah pesan item, pesan terlalu banyak, tidak gemar rasa atau perubahan keperluan bukan alasan untuk pemulangan.'
      }
    },
    {
      heading: { en: '2. What May Be Considered', zh: '2. 可受理之情形', ms: '2. Apa Yang Boleh Dipertimbangkan' },
      body: {
        zh: '仅限以下于交付当下即已存在之情形：品项错误、数量短少、外包装明显破损，或产品于交付时已非冷冻状态。是否受理及如何处理，由本公司经核实后全权决定。',
        en: 'Only the following, where the condition already existed at the point of delivery: wrong item, short quantity, visibly damaged outer packaging, or product not in frozen condition on delivery. Whether a claim is accepted, and how it is dealt with, is determined by the Company at its sole discretion after verification.',
        ms: 'Hanya yang berikut, di mana keadaan tersebut sudah wujud semasa penghantaran: item salah, kuantiti kurang, pembungkusan luar rosak dengan jelas, atau produk tidak dalam keadaan beku semasa penghantaran. Sama ada tuntutan diterima, dan bagaimana ia diuruskan, ditentukan oleh Syarikat mengikut budi bicara mutlaknya selepas pengesahan.'
      }
    },
    {
      heading: { en: '3. Reporting Window and Evidence', zh: '3. 申报期限与证据', ms: '3. Tempoh Laporan dan Bukti' },
      tone: 'warning',
      body: {
        zh: '须于交付后两（2）小时内以 WhatsApp 连同订单编号提出，并提供未经修图之清晰照片，涵盖运输纸箱、产品包装、产品本身及完整可辨之出货标签。模糊、裁切、重复或经编辑之照片不予受理。逾时申报视为放弃索偿。',
        en: 'A claim must be raised by WhatsApp with the order number within two (2) hours of delivery, supported by clear unedited photographs showing the shipping carton, the product packaging, the product itself and the full legible shipping label. Blurred, cropped, duplicated or edited photographs will not be accepted. A claim raised after that window is treated as waived.',
        ms: 'Tuntutan mesti dibuat melalui WhatsApp dengan nombor pesanan dalam tempoh dua (2) jam selepas penghantaran, disokong dengan gambar jelas yang tidak disunting menunjukkan koton penghantaran, pembungkusan produk, produk itu sendiri dan label penghantaran yang lengkap dan boleh dibaca. Gambar kabur, dipotong, berulang atau disunting tidak akan diterima. Tuntutan selepas tempoh tersebut dianggap dilepaskan.'
      }
    },
    {
      heading: { en: '4. Not Eligible', zh: '4. 不受理之情形', ms: '4. Tidak Layak' },
      body: {
        zh: '下列情形一概不受理：产品已开封或部分使用；因买方储存、断电、冷链中断或运送不当而解冻或变质；包装轻微凹损但不影响食品安全；因买方延迟收货或延迟入库导致保质期缩短；买方拒收或无人签收；已超过保质期；以及任何未能提供第 3 条所述证据者。',
        en: 'The following are not eligible in any circumstances: product opened or partly used; thawing or deterioration caused by the Buyer storage, power failure, broken cold chain or improper transport; minor dents or creases in packaging which do not affect food safety; shortened shelf life caused by the Buyer delaying receipt or delaying transfer into storage; delivery refused or not received; product past its shelf life; and any claim without the evidence described in clause 3.',
        ms: 'Yang berikut tidak layak dalam apa jua keadaan: produk telah dibuka atau digunakan sebahagian; pencairan atau kemerosotan akibat penyimpanan Pembeli, gangguan elektrik, rantaian sejuk terputus atau pengangkutan tidak wajar; kemek atau lipatan kecil pada pembungkusan yang tidak menjejaskan keselamatan makanan; jangka hayat berkurangan akibat Pembeli melengahkan penerimaan atau pemindahan ke storan; penghantaran ditolak atau tidak diterima; produk melepasi jangka hayat; dan sebarang tuntutan tanpa bukti seperti dinyatakan dalam klausa 3.'
      }
    },
    {
      heading: { en: '5. Remedy Is at the Discretion of the Company', zh: '5. 补救方式由本公司决定', ms: '5. Remedi Mengikut Budi Bicara Syarikat' },
      tone: 'warning',
      body: {
        zh: '索偿如获受理，本公司可选择于下次配送时补货、开立扣账凭证（credit note）或退还货款，选择权在本公司。本公司不承诺任何特定之补救方式、金额或处理时限。退款方式与安排由本公司与买方另行确认。',
        en: 'Where a claim is accepted, the Company may at its option replace the goods on a subsequent delivery, issue a credit note, or refund the amount paid. The choice rests with the Company. The Company gives no undertaking as to any particular remedy, amount or processing time. The method and arrangement of any refund is confirmed separately between the Company and the Buyer.',
        ms: 'Apabila tuntutan diterima, Syarikat boleh mengikut pilihannya menggantikan barangan pada penghantaran berikutnya, mengeluarkan nota kredit, atau membayar balik jumlah yang dibayar. Pilihan terletak pada Syarikat. Syarikat tidak memberi sebarang jaminan mengenai remedi, jumlah atau tempoh pemprosesan tertentu. Kaedah dan pengaturan sebarang bayaran balik disahkan secara berasingan antara Syarikat dan Pembeli.'
      }
    },
    {
      heading: { en: '6. Custom and OEM Orders', zh: '6. 客制与代工订单', ms: '6. Pesanan Tempahan Khas dan OEM' },
      body: {
        zh: '客制配方、私人品牌及代工订单一经确认投产，不得取消、退货或退款。',
        en: 'Custom recipe, private label and contract manufacturing orders cannot be cancelled, returned or refunded once confirmed and in production.',
        ms: 'Pesanan resipi tempahan khas, label persendirian dan pengilangan kontrak tidak boleh dibatalkan, dipulangkan atau dibayar balik setelah disahkan dan dalam pengeluaran.'
      }
    },
    {
      heading: { en: '7. Cancellation', zh: '7. 订单取消', ms: '7. Pembatalan' },
      body: {
        zh: '出货前之取消申请，是否接受由本公司全权决定，并可扣除已产生之备货、包装及物流成本。已出货订单不得取消。',
        en: 'A request to cancel before dispatch may be accepted or declined by the Company at its sole discretion, and the Company may deduct picking, packing and logistics costs already incurred. Orders already dispatched cannot be cancelled.',
        ms: 'Permintaan pembatalan sebelum penghantaran boleh diterima atau ditolak oleh Syarikat mengikut budi bicara mutlaknya, dan Syarikat boleh menolak kos pengambilan, pembungkusan dan logistik yang telah ditanggung. Pesanan yang telah dihantar tidak boleh dibatalkan.'
      }
    },
    {
      heading: { en: '8. Maximum Liability', zh: '8. 责任上限', ms: '8. Liabiliti Maksimum' },
      body: {
        zh: '本公司就任何索偿之责任，以该批受影响货物之发票金额为上限，且不包括任何间接或衍生损失。',
        en: 'The liability of the Company for any claim is limited to the invoice value of the affected goods and does not extend to any indirect or consequential loss.',
        ms: 'Liabiliti Syarikat bagi mana-mana tuntutan adalah terhad kepada nilai invois barangan yang terjejas dan tidak meliputi sebarang kerugian tidak langsung atau berbangkit.'
      }
    }
  ]
};

/* ------------------------------------------------------------------ */
/* 3. PDPA NOTICE & CONSENT                                            */
/* ------------------------------------------------------------------ */

const PDPA: LegalDoc = {
  id: 'pdpa',
  label: { en: 'PDPA Notice & Consent', zh: '个人资料保护声明与同意', ms: 'Notis & Persetujuan PDPA' },
  intro: {
    zh: '本声明依据马来西亚《2010 年个人资料保护法令》（PDPA）发出。资料使用者为 AL-EKHLAS MANUFACTURING SDN. BHD.（公司编号 202401022253 (1568102-T)）。',
    en: 'This notice is issued under the Personal Data Protection Act 2010 of Malaysia. The data user is AL-EKHLAS MANUFACTURING SDN. BHD. (Company No. 202401022253 (1568102-T)).',
    ms: 'Notis ini dikeluarkan di bawah Akta Perlindungan Data Peribadi 2010 Malaysia. Pengguna data ialah AL-EKHLAS MANUFACTURING SDN. BHD. (No. Syarikat 202401022253 (1568102-T)).'
  },
  clauses: [
    {
      heading: { en: '1. Your Consent', zh: '1. 您的同意', ms: '1. Persetujuan Anda' },
      tone: 'consent',
      body: {
        zh: '当您透过本网站、WhatsApp、电话、电邮或任何其他管道向本公司提交询价、索取样品、登记商务合作或下达订单时，即表示您已阅读本声明，并同意本公司为下述目的收集、记录、持有、储存、使用及披露您的个人资料，包括用于后续跟进联系及产品推广。',
        en: 'By submitting an enquiry, requesting a sample, registering a business interest or placing an order with the Company through this website, WhatsApp, telephone, email or any other channel, you confirm that you have read this notice and consent to the Company collecting, recording, holding, storing, using and disclosing your personal data for the purposes set out below, including follow up contact and product marketing.',
        ms: 'Dengan menghantar pertanyaan, meminta sampel, mendaftarkan minat perniagaan atau membuat pesanan dengan Syarikat melalui laman web ini, WhatsApp, telefon, e-mel atau mana-mana saluran lain, anda mengesahkan bahawa anda telah membaca notis ini dan bersetuju Syarikat mengumpul, merekod, memegang, menyimpan, menggunakan dan mendedahkan data peribadi anda bagi tujuan yang dinyatakan di bawah, termasuk hubungan susulan dan pemasaran produk.'
      }
    },
    {
      heading: { en: '2. Data We Collect', zh: '2. 我们收集的资料', ms: '2. Data Yang Kami Kumpul' },
      body: {
        zh: '姓名、职称、公司名称与注册编号、联络电话与 WhatsApp 号码、电邮、送货与账单地址、业务类别、采购需求、订单与付款纪录，以及您与本公司之往来通讯内容。资料主要由您直接提供。',
        en: 'Name, job title, company name and registration number, contact and WhatsApp number, email, delivery and billing address, business category, purchasing requirements, order and payment records, and the content of your correspondence with the Company. This data is provided mainly by you directly.',
        ms: 'Nama, jawatan, nama syarikat dan nombor pendaftaran, nombor telefon dan WhatsApp, e-mel, alamat penghantaran dan bil, kategori perniagaan, keperluan pembelian, rekod pesanan dan pembayaran, serta kandungan surat-menyurat anda dengan Syarikat. Data ini dibekalkan terutamanya oleh anda secara langsung.'
      }
    },
    {
      heading: { en: '3. Purposes', zh: '3. 使用目的', ms: '3. Tujuan' },
      body: {
        zh: '处理询价与报价、确认与履行订单、安排配送、开立发票与收款、信用评估、售后与投诉处理、样品与报价之后续跟进、法定纪录保存与稽核，以及向您传送新品、价目表、促销与活动资讯。',
        en: 'Handling enquiries and quotations, confirming and fulfilling orders, arranging delivery, invoicing and collection, credit assessment, after sales and complaint handling, following up on samples and quotations, keeping statutory records and supporting audits, and sending you information on new products, price lists, promotions and events.',
        ms: 'Mengendalikan pertanyaan dan sebut harga, mengesahkan dan memenuhi pesanan, mengatur penghantaran, mengeluarkan invois dan kutipan, penilaian kredit, perkhidmatan selepas jualan dan aduan, susulan sampel dan sebut harga, menyimpan rekod berkanun dan menyokong audit, serta menghantar maklumat produk baharu, senarai harga, promosi dan acara kepada anda.'
      }
    },
    {
      heading: { en: '4. Disclosure', zh: '4. 资料披露对象', ms: '4. Pendedahan' },
      body: {
        zh: '本公司可能将您的资料披露予：冷链与物流服务商、银行与支付服务商、通讯平台服务商（包括 WhatsApp / Meta 及 Google）、会计师、稽核师、法律顾问，以及依法有权要求之政府机关或监管单位。',
        en: 'The Company may disclose your data to cold chain and logistics providers, banks and payment providers, communication platform providers including WhatsApp / Meta and Google, accountants, auditors, legal advisers, and government or regulatory bodies entitled to require it by law.',
        ms: 'Syarikat boleh mendedahkan data anda kepada penyedia rantaian sejuk dan logistik, bank dan penyedia pembayaran, penyedia platform komunikasi termasuk WhatsApp / Meta dan Google, akauntan, juruaudit, penasihat undang-undang, serta badan kerajaan atau kawal selia yang berhak memintanya di sisi undang-undang.'
      }
    },
    {
      heading: { en: '5. Transfer Outside Malaysia', zh: '5. 跨境传输', ms: '5. Pemindahan Ke Luar Malaysia' },
      body: {
        zh: '由于本公司使用 WhatsApp 与电邮等通讯服务，您的资料可能被储存或处理于马来西亚境外之伺服器。您提交资料即表示同意此项传输。',
        en: 'Because the Company uses communication services such as WhatsApp and email, your data may be stored or processed on servers outside Malaysia. By submitting your data you consent to that transfer.',
        ms: 'Oleh kerana Syarikat menggunakan perkhidmatan komunikasi seperti WhatsApp dan e-mel, data anda mungkin disimpan atau diproses pada pelayan di luar Malaysia. Dengan menghantar data anda, anda bersetuju dengan pemindahan tersebut.'
      }
    },
    {
      heading: { en: '6. Retention', zh: '6. 保存期限', ms: '6. Tempoh Penyimpanan' },
      body: {
        zh: '本公司将于业务及法定需要之期间内保存您的资料，包括依税务与公司法规所要求之纪录保存期间。',
        en: 'The Company retains your data for as long as it is needed for business purposes and for the periods required by law, including record keeping periods under tax and company legislation.',
        ms: 'Syarikat menyimpan data anda selama ia diperlukan untuk tujuan perniagaan dan bagi tempoh yang dikehendaki undang-undang, termasuk tempoh penyimpanan rekod di bawah perundangan cukai dan syarikat.'
      }
    },
    {
      heading: { en: '7. Your Rights and Marketing Opt Out', zh: '7. 您的权利与退出推广', ms: '7. Hak Anda dan Penarikan Pemasaran' },
      tone: 'consent',
      body: {
        zh: '您有权要求查阅或更正您的个人资料，并有权随时以书面方式（WhatsApp +6014-941 3545 或电邮 alekhlas.sales@gmail.com）要求本公司停止将您的资料用于推广用途。停止推广不影响本公司为履行现有订单、售后服务、收款及法定纪录保存所必要之处理。查阅要求本公司可依法收取规费。',
        en: 'You may request access to or correction of your personal data, and you may at any time ask the Company in writing, by WhatsApp on +6014-941 3545 or by email to alekhlas.sales@gmail.com, to stop using your data for marketing. Stopping marketing does not affect processing necessary to fulfil existing orders, provide after sales service, collect payment or keep statutory records. The Company may charge a prescribed fee for an access request.',
        ms: 'Anda boleh meminta akses kepada atau pembetulan data peribadi anda, dan anda boleh pada bila-bila masa meminta Syarikat secara bertulis, melalui WhatsApp di +6014-941 3545 atau e-mel ke alekhlas.sales@gmail.com, untuk berhenti menggunakan data anda bagi pemasaran. Penghentian pemasaran tidak menjejaskan pemprosesan yang perlu untuk memenuhi pesanan sedia ada, perkhidmatan selepas jualan, kutipan bayaran atau penyimpanan rekod berkanun. Syarikat boleh mengenakan fi yang ditetapkan bagi permintaan akses.'
      }
    },
    {
      heading: { en: '8. Business Identity and Feedback', zh: '8. 商业身份与回馈素材之使用', ms: '8. Identiti Perniagaan dan Maklum Balas' },
      tone: 'consent',
      body: {
        zh: '买方下单即授予本公司一项非独家、免付权利金之授权，允许本公司于客户名录、网站、社交媒体、价目表、展会及其他推广材料中使用买方之商号名称、商业标志及合作事实。买方或其代表提供之评价、推荐语、照片或影片，本公司亦得复制、编辑、翻译及公开发布。此项授权仅涉及商业身份资讯，不涉及个人资料；买方可随时以书面要求本公司于往后新制作之材料中停止使用。',
        en: 'By placing an order the Buyer grants the Company a non exclusive, royalty free licence to use the Buyer business name, business logo and the fact of the business relationship in customer lists, on the website, on social media, in price lists, at trade shows and in other promotional material. Reviews, testimonials, photographs or videos provided by the Buyer or its representatives may likewise be reproduced, edited, translated and published by the Company. This licence covers business identity information only and not personal data. The Buyer may ask the Company in writing to stop using it in new material produced afterwards.',
        ms: 'Dengan membuat pesanan, Pembeli memberikan Syarikat lesen bukan eksklusif dan bebas royalti untuk menggunakan nama perniagaan, logo perniagaan dan fakta hubungan perniagaan Pembeli dalam senarai pelanggan, di laman web, di media sosial, dalam senarai harga, di pameran perdagangan dan dalam bahan promosi lain. Ulasan, testimoni, gambar atau video yang diberikan oleh Pembeli atau wakilnya juga boleh diterbitkan semula, disunting, diterjemah dan diterbitkan oleh Syarikat. Lesen ini meliputi maklumat identiti perniagaan sahaja dan bukan data peribadi. Pembeli boleh meminta Syarikat secara bertulis untuk berhenti menggunakannya dalam bahan baharu yang dihasilkan selepas itu.'
      }
    },
    {
      heading: { en: '9. If You Do Not Provide Data', zh: '9. 不提供资料之后果', ms: '9. Jika Data Tidak Diberikan' },
      body: {
        zh: '若您不提供上述必要资料，本公司可能无法处理您的询价、确认订单或安排配送。',
        en: 'If you do not provide the data described above, the Company may be unable to process your enquiry, confirm your order or arrange delivery.',
        ms: 'Jika anda tidak memberikan data yang dinyatakan di atas, Syarikat mungkin tidak dapat memproses pertanyaan anda, mengesahkan pesanan anda atau mengatur penghantaran.'
      }
    },
    {
      heading: { en: '10. Language', zh: '10. 语言', ms: '10. Bahasa' },
      body: {
        zh: '本声明以英文及马来文版本为准，中文版本仅供参考。如有任何疑问，请联络本公司。',
        en: 'This notice is issued in English and Bahasa Malaysia, which prevail. The Chinese version is provided for reference. Please contact the Company with any question.',
        ms: 'Notis ini dikeluarkan dalam Bahasa Inggeris dan Bahasa Malaysia, yang mana kedua-duanya muktamad. Versi Bahasa Cina disediakan untuk rujukan. Sila hubungi Syarikat untuk sebarang pertanyaan.'
      }
    }
  ]
};

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  terms: TERMS,
  refund: REFUND,
  pdpa: PDPA
};

export const LEGAL_DOC_ORDER: LegalDocId[] = ['terms', 'refund', 'pdpa'];
