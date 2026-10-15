/**
 * Initial product list, generated from the website catalog (src/data.ts).
 * Only used by setup() when the Products sheet is empty. After that the
 * Products sheet is the source of truth - edit products there, not here.
 *
 * Columns: SKU, Name, 中文名, Category, Barcode, Base unit, Pack size,
 *          Units per carton, Reorder level
 */
var SEED_PRODUCTS = [
  ["sate-daging-mala","Sate Daging Pedas Mala","麻辣牛肉串","烧烤串","9552626879627","pkt","400g * Pkt",20,0],
  ["sate-kambing-mala","Sate Kambing Pedas Mala","麻辣羊肉串","烧烤串","9553636779624","pkt","400g * Pkt",20,0],
  ["sate-ayam-mala","Sate Ayam Pedas Mala","麻辣鸡肉串","烧烤串","9554636579627","pkt","400g * Pkt",20,0],
  ["sate-daging-classic","Sate Daging","牛肉串","烧烤串","9554134279623","pkt","400g * Pkt",20,0],
  ["sate-kambing-classic","Sate Kambing","羊肉串","烧烤串","9554939379627","pkt","400g * Pkt",20,0],
  ["sate-ayam-classic","Sate Ayam","鸡肉串","烧烤串","9554131379623","pkt","400g * Pkt",20,0],
  ["soup-pir-gula-batu","Air Pir Gula Batu","冰糖雪梨","传统糖水","9553183093709","pkt","450g * Pkt",12,0],
  ["soup-pir-gula-batu-bucket","Air Pir Gula Batu (With Bucket)","冰糖雪梨 (小桶装)","传统糖水","9553183093709","pkt","450g * Pkt",12,0],
  ["soup-kelapa-laut-longan","Air Kelapa Laut & Longan Manis","海底椰龙眼糖水","传统糖水","9553183093716","pkt","500g * Pkt",30,0],
  ["soup-nanas-longan","Air Nanas & Longan Manis","菠萝龙眼糖水","传统糖水","9553183093723","pkt","500g * Pkt",30,0],
  ["soup-kacang-manis","Sup Kacang Manis","传统花生糊","传统糖水","9551738298364","pkt","300g * Pkt",30,0],
  ["snack-ayam-goreng-krispi","Ayam Goreng Krispi","酥脆小酥肉","精致小吃","9558268768336","pkt","1kg * Pkt",10,0],
  ["snack-kuih-pulut-gula-merah","Kuih Pulut dengan Gula Merah","红糖糍粑","精致小吃","9558268783117","pkt","230g * Pkt",30,0],
  ["snack-kuih-labu","Kuih Labu (Pumpkin Pie)","黄金南瓜饼","精致小吃","9558268783315","pkt","24pcs * Pkt",30,0],
  ["snack-ice-cream-goreng","Ice Cream Goreng (3 Flavors Choice)","炸冰淇淋 (3种口味可选)","精致小吃","9552573738824","pkt","10pcs * Pkt",10,0],
  ["snack-susu-goreng","Susu Goreng","黄金炸鲜奶","精致小吃","9552573738879","pkt","180g * Pkt",30,0],
  ["dumpling-ayam-cendawan","Dumpling Ayam Cendawan","鸡肉香菇饺子","饺子系列","9555413427490","pck","2kg * Pck","",0],
  ["dumpling-ayam-kubis","Dumpling Ayam Kubis","鸡肉白菜饺子","饺子系列","9555413444138","pck","2kg * Pck","",0],
  ["dumpling-beef-leek","Dumpling Beef & Leek","牛肉大葱饺子","饺子系列","9555413941330","pck","2kg * Pck","",0],
  ["dumpling-kambing-lobak","Dumpling Kambing & Lobak","羊肉白萝卜饺子","饺子系列","9555414941347","pck","2kg * Pck","",0],
  ["rte-daging-masam-emas","Daging Masak Masam Emas","酸汤金汤肥牛","中式料理包","9551789215037","pkt","200g * Pkt",20,0],
  ["rte-daging-masak-merah","Daging Masak Merah","秘制红烧牛肉","中式料理包","9551789215068","unit","200g * Unit",12,0],
  ["rte-claypot-kambing","Claypot Kambing","滋补羊肉煲","中式料理包","9551789216027","pkt","350g * Pkt",20,0],
  ["rte-claypot-ayam","Claypot Ayam","香浓鸡肉煲","中式料理包","9551789217178","pkt","350g * Pkt",20,0],
  ["rte-ayam-masam-manis","Ayam Masam & Manis","经典酸甜鸡块","中式料理包","9551789217024","pkt","200g * Pkt",20,0],
  ["rte-ayam-cincang-terung","Ayam Cincang dengan Terung","鸡肉沫茄子","中式料理包","9551789217079","pkt","200g * Pkt",20,0],
  ["rte-ayam-cendawan","Ayam Cendawan","经典香菇焖鸡","中式料理包","9551789217185","pkt","200g * Pkt",20,0],
  ["rte-ayam-kuning","Ayam Kuning Berempah","秘制黄焖鸡","中式料理包","9551789217192","pkt","200g * Pkt",20,0],
  ["sauce-kolagen-ayam","Sup Kolagen Ayam Emas","金汤花胶鸡汤底","火锅底料 & 酱料","9551738298371","pkt","1kg * Pkt",12,0],
  ["sauce-jeruk-sayur","Sup Jeruk Sayur","正宗酸菜鱼汤底","火锅底料 & 酱料","9551738298388","pkt","1kg * Pkt",12,0],
  ["sauce-tomato","Sup Tomato","鲜番茄火锅底料","火锅底料 & 酱料","9551738298395","pkt","1kg * Pkt",10,0],
  ["sauce-ayam-masam-pedas","Sup Ayam Masam Pedas","泡椒酸辣鸡汤底","火锅底料 & 酱料","9551738298302","pkt","2kg * Pkt",12,0],
  ["sauce-mala-pedas","Sup Sichuan Mala Pedas","川味麻辣火锅底料","火锅底料 & 酱料","9551738298319","pkt","1kg * Pkt",10,0],
  ["sauce-minyak-cili","Minyak Cili Merah","特级秘制红辣椒油","火锅底料 & 酱料","9556789876875","pkt","500g * Pkt",12,0],
  ["sauce-sos-bawang-putih","Sos Bawang Putih","黄金蒜蓉蘸酱","火锅底料 & 酱料","9556789876868","pkt","500g * Pkt",12,0],
  ["diperap-isi-ikan","Isi Ikan Diperap","秘制腌制鱼片","秘制腌制肉片","9556321012303","pck","250g * pck",40,0],
  ["diperap-daging","Daging Diperap","秘制腌制牛肉片","秘制腌制肉片","9556321012334","pck","500g * pck","",0],
  ["diperap-kambing","Kambing Diperap","秘制腌制羊肉片","秘制腌制肉片","9556321012327","pck","500g * pck","",0],
  ["tea-ba-bao","Daun Teh Ba Bao","经典八宝茶","花茶","9551045275607","pck","25g * pck",30,0],
  ["tea-wolfberry","Daun Teh Wolfberry","润燥美目茶","花茶","9551045275638","pck","25g * pck",30,0],
  ["tea-roselle","Daun Teh Roselle","洛神花草茶","花茶","9551045275645","pck","25g * pck",30,0],
  ["tea-bunga-kekwa","Daun Teh Bunga Kekwa","清火菊花茶","花茶","9551045275669","pck","25g * pck",30,0],
  ["herbal-sup-kelapa","Sup Ayam Kelapa","椰子炖鸡汤底包","养生汤包","9551738298623","pkt","400g * Pkt","",0],
  ["herbal-sup-susu-harimau","Sup Ayam Cendawan Susu Harimau","虎乳芝养肺鸡汤包","养生汤包","9551738298548","pkt","400g * Pkt","",0],
  ["herbal-sup-tianma","Sup Rempah Tianma Tradisi","天麻安神补脑汤包","养生汤包","9551738298425","pkt","400g * Pkt","",0],
  ["herbal-sup-bajitian","Sup Rempah Bajitian","巴戟天强肾壮骨汤包","养生汤包","9551738298494","pkt","400g * Pkt","",0],
  ["herbal-sup-cordyceps","Sup Rempah Cendawan Cordyceps","虫草花补肺滋肾汤包","养生汤包","9551738298456","pkt","400g * Pkt","",0],
  ["herbal-sup-goji-kekwa","Sup Ayam Goji & Kekwa","枸杞菊花明目鸡汤包","养生汤包","9551738298616","pkt","400g * Pkt","",0],
  ["seasoning-lanzhou","Serbuk Perencah Mi Lanzhou","兰州牛肉面调料包","风味调味料","9550318268582","pkt","500g * Pkt",12,0],
  ["seasoning-bbq","Serbuk Perisa BBQ","经典风味烧烤撒料包","风味调味料","9551789218021","pkt","500g * Pkt",12,0],
  ["seasoning-mala-bbq","Serbuk Perisa Mala BBQ","秘制麻辣烧烤撒料包","风味调味料","AEM-ML-BBQ","pkt","500g * Pkt",12,0]
];

/**
 * Names staff type into the Jotform Production Packing Log that differ from
 * the product names above. setup() copies these into the Products sheet's
 * Aliases column, only where that cell is still empty. After that, add new
 * spellings in the sheet itself.
 */
var SEED_ALIASES = {
  'sate-daging-mala': 'Sate Daging Mala | 麻辣牛肉串',
  'sate-kambing-mala': 'Sate Kambing Mala',
  'sate-ayam-mala': 'Sate Ayam Mala',
  'sate-ayam-classic': 'Sate AyamS',
  'snack-ayam-goreng-krispi': 'Ayam Goreng Crispy | Ayam Goreng',
  'snack-kuih-pulut-gula-merah': 'Kuih Pulut Goreng | KPG | 炸糯米糕 | 椰糖糯米糕 | Kuih Pulut Gula Merah',
  'rte-ayam-cincang-terung': 'Ayam Cincang Terung',
  'rte-daging-masak-merah': 'Masak Merah | 红烧牛肉'
};
