export const perfumes = [
  {
    id: "obsidian-oud",
    name: "Obsidian Oud",
    subtitle: {
      en: "Extrait de Parfum • Smoky & Resinous",
      bg: "Екстракт от парфюм • Опушен и смолист",
    },
    category: "woody",
    basePrice: 240,
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    variants: [
      { size: "50ml", price: 240, stock: 12 },
      { size: "100ml", price: 340, stock: 5 },
    ],
    notes: {
      top: { en: ["Black Pepper", "Bergamot", "Cardamom"], bg: ["Черен пипер", "Бергамот", "Кардамон"] },
      heart: { en: ["Smoked Incense", "Bulgarian Rose", "Labdanum"], bg: ["Опушен тамян", "Българска роза", "Лабданум"] },
      base: { en: ["Agarwood (Oud)", "Black Amber", "Vetiver"], bg: ["Агарово дърво (Уд)", "Черен кехлибар", "Ветивер"] },
    },
    description: {
      en: "An architectural study in shadow and warmth. Wild agarwood meets a dark heart of smoked incense and damascena absolute.",
      bg: "Архитектурна симфония от сянка и топлина. Див уд се среща с тъмно сърце от опушен тамян и абсолю от роза дамасцена.",
    },
    bottleColor: "#1A1612",
    accentColor: "#D4AF37",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85",
    ],
    completeTheLookIds: ["velvet-santal", "noir-vetiver"],
  },
  {
    id: "velvet-santal",
    name: "Velvet Santal",
    subtitle: {
      en: "Eau de Parfum • Creamy Woods & Spice",
      bg: "Парфюмна вода • Кремообразни дървесини и подправки",
    },
    category: "amber",
    basePrice: 210,
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    variants: [
      { size: "50ml", price: 210, stock: 18 },
      { size: "100ml", price: 295, stock: 9 },
    ],
    notes: {
      top: { en: ["Violet Leaf", "Saffron"], bg: ["Листа от теменужка", "Шафран"] },
      heart: { en: ["Australian Sandalwood", "Orris Root"], bg: ["Австралийско сандалово дърво", "Корен от ирис"] },
      base: { en: ["Tonka Bean", "Cedarwood", "White Musk"], bg: ["Тонка боб", "Кедър", "Бял мускус"] },
    },
    description: {
      en: "Intimate skin chemistry elevated by rare sandalwood, powdery orris butter, and warm roasted tonka.",
      bg: "Интимна кожна химия, издигната от рядко сандалово дърво, пудрен ирис и топла печена тонка.",
    },
    bottleColor: "#241914",
    accentColor: "#C89D7C",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85",
    ],
    completeTheLookIds: ["obsidian-oud", "lumiere-blanche"],
  },
  {
    id: "noir-vetiver",
    name: "Noir Vétiver",
    subtitle: {
      en: "Extrait de Parfum • Earthy & Crisp",
      bg: "Екстракт от парфюм • Землист и свеж",
    },
    category: "fresh",
    basePrice: 225,
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    variants: [
      { size: "50ml", price: 225, stock: 8 },
      { size: "100ml", price: 315, stock: 14 },
    ],
    notes: {
      top: { en: ["Bitter Grapefruit", "Cypress"], bg: ["Горчив грейпфрут", "Кипарис"] },
      heart: { en: ["Haitian Vetiver", "Coriander Seed"], bg: ["Хаитянски ветивер", "Семена от кориандър"] },
      base: { en: ["Oakmoss", "Patchouli", "Dry Amber"], bg: ["Дъбов мъх", "Пачули", "Сух кехлибар"] },
    },
    description: {
      en: "Rain on cold slate. Crisp bitter citrus cuts through deep volcanic roots and dark forest oakmoss.",
      bg: "Дъжд върху студен камък. Свеж горчив цитрус прорязва дълбоки вулканични корени и тъмен горски мъх.",
    },
    bottleColor: "#101816",
    accentColor: "#8FA89B",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85",
    ],
    completeTheLookIds: ["obsidian-oud", "velvet-santal"],
  },
  {
    id: "lumiere-blanche",
    name: "Lumière Blanche",
    subtitle: {
      en: "Eau de Parfum • Floral & Mineral",
      bg: "Парфюмна вода • Флорален и минерален",
    },
    category: "floral",
    basePrice: 195,
    isFeatured: true,
    isNew: true,
    rating: 4.7,
    variants: [
      { size: "50ml", price: 195, stock: 20 },
      { size: "100ml", price: 275, stock: 11 },
    ],
    notes: {
      top: { en: ["Neroli", "White Tea", "Aldehydes"], bg: ["Нероли", "Бял чай", "Алдехиди"] },
      heart: { en: ["Jasmine Sambac", "Orange Blossom"], bg: ["Жасмин самбак", "Портокалов цвят"] },
      base: { en: ["Ambroxan", "Mineral Salt", "Cashmere Wood"], bg: ["Амброксан", "Минерална сол", "Кашмирено дърво"] },
    },
    description: {
      en: "Cold morning light through silk curtains. Luminous white florals anchored by crisp ambroxan and mineral skin notes.",
      bg: "Студена утринна светлина през копринени завеси. Сияйни бели цветя върху свеж амброксан и минерални нотки.",
    },
    bottleColor: "#1E1E24",
    accentColor: "#E2DFD7",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85",
    ],
    completeTheLookIds: ["velvet-santal", "noir-vetiver"],
  },
];