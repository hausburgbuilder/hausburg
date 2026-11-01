export interface House {
  id: string;
  name: string;
  tagline: string;
  category: 'all' | 'mansions' | 'minimalist' | 'family';
  categoryLabel: string;
  priceUSD: number;
  bloxburgCashEst: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  plotSize: 'Regular Plot' | 'Large Plot';
  buildTimeHours: number;
  buildTimeDisplay?: string;
  requiredGamepasses: string[];
  featured: boolean;
  mainImage: string;
  galleryImages: {
    url: string;
    caption: string;
  }[];
  shortDescription: string;
  fullDescription: string;
  features: string[];
}

export const HOUSES: House[] = [
  {
    id: 'villa-luminosa',
    name: 'Villa Luminosa',
    tagline: 'Modern Two-Story Luxury Mansion with Infinity Pool',
    category: 'mansions',
    categoryLabel: 'Modern Mansion',
    priceUSD: 28,
    bloxburgCashEst: 185000,
    bedrooms: 4,
    bathrooms: 3.5,
    floors: 2,
    plotSize: 'Large Plot',
    buildTimeHours: 2.5,
    requiredGamepasses: ['Multiple Floors', 'Advanced Placing'],
    featured: true,
    mainImage: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
    galleryImages: [
      {
        url: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
        caption: 'Illuminated main facade and infinity pool with sunken fire pit',
      },
      {
        url: '/src/assets/images/bloxburg_luxury_interior_1793408052401.jpg',
        caption: 'Double-height living lounge with open marble island kitchen',
      },
      {
        url: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
        caption: 'Perimeter terraces, glass balustrades, and architectural gardens',
      },
    ],
    shortDescription: 'Cutting-edge geometric architecture featuring floor-to-ceiling windows, an infinity pool with sunken fire pit, and cedar wood accents.',
    fullDescription: 'Villa Luminosa is the flagship residence from HAUSBURG in Bloxburg. Engineered for players seeking uncompromising architectural prestige. Its dual-volume design blends sleek black frames with warm cedar paneling and pure white masonry. Inside, a soaring double-height foyer leads to an open-plan entertainment lounge, quartz kitchen island, glass-enclosed cellar display, and direct sundeck access.',
    features: [
      'Infinity pool with integrated sunken fire pit lounge',
      'Open-concept chef kitchen with quartz breakfast bar',
      'Master bedroom suite with walk-in closet and private balcony',
      'Calculated warm ambient LED lighting optimized for dusk and night',
      'Integrated double carport and full botanical landscaping',
    ],
  },
  {
    id: 'residencia-nok',
    name: 'Nók Minimalist Estate',
    tagline: 'Contemporary Nordic Aesthetics with Pergola Rooftop',
    category: 'minimalist',
    categoryLabel: 'Minimalist Estate',
    priceUSD: 22,
    bloxburgCashEst: 135000,
    bedrooms: 3,
    bathrooms: 2.5,
    floors: 2,
    plotSize: 'Regular Plot',
    buildTimeHours: 2.0,
    requiredGamepasses: ['Multiple Floors', 'Advanced Placing'],
    featured: true,
    mainImage: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
    galleryImages: [
      {
        url: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
        caption: 'Dusk view featuring rooftop pergola with bistro string lights and garage',
      },
      {
        url: '/src/assets/images/bloxburg_luxury_interior_1793408052401.jpg',
        caption: 'Clean Scandinavian interior layout with organic warm lighting',
      },
      {
        url: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
        caption: 'Designer stone pavers, front pathway, and low-profile shrubbery',
      },
    ],
    shortDescription: 'Clean geometric lines, textured limestone facades, and an intimate rooftop pergola lounge ideal for socializing in Bloxburg.',
    fullDescription: 'The Nók Estate strikes an ideal balance between Bloxburg Cash budget optimization and striking visual presence. Every room is precisely sized for fluid player movement and roleplay ease. Highlights include a panoramic rooftop deck outfitted with a timber pergola and suspended fairy bulbs, alongside paved sports car parking.',
    features: [
      'Rooftop chill-out deck with wood pergola and string lights',
      '3 complete bedrooms equipped with desks and built-in wardrobes',
      'Highly optimized footprint for standard Bloxburg plots',
      'Covered internal garage for high-end vehicles',
      'Flagstone pathways with indirect low-profile walkway bollards',
    ],
  },
  {
    id: 'craftsman-pine-haven',
    name: 'Craftsman Pine Haven',
    tagline: 'Warm Suburban Craftsman Home with Natural Stone Masonry',
    category: 'family',
    categoryLabel: 'Family Home',
    priceUSD: 19,
    bloxburgCashEst: 98000,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    plotSize: 'Regular Plot',
    buildTimeHours: 1.5,
    requiredGamepasses: ['Advanced Placing'],
    featured: true,
    mainImage: '/src/assets/images/bloxburg_cozy_family_home_1793408053161.jpg',
    galleryImages: [
      {
        url: '/src/assets/images/bloxburg_cozy_family_home_1793408053161.jpg',
        caption: 'Charming front porch with timber posts, stone chimney, and flower beds',
      },
      {
        url: '/src/assets/images/bloxburg_luxury_interior_1793408052401.jpg',
        caption: 'Cozy living room with custom stone hearth fireplace',
      },
      {
        url: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
        caption: 'Inviting bedrooms and full country bath with classic tub',
      },
    ],
    shortDescription: 'The quintessential cozy family home in Bloxburg: dark slate gabled roof, natural stone base, and a warm welcome porch.',
    fullDescription: 'Inspired by alpine mountain lodges and classic American Craftsman architecture, Pine Haven delivers unmatched coziness for family roleplay. Built on a single level for fluid gameplay, it features a spacious country kitchen, carved stone fireplace, blooming front flower gardens, and a charming porch with rocking chairs and lantern glow.',
    features: [
      'Covered front porch with vintage lanterns and hand-crafted railings',
      'Central natural stone fireplace with aesthetic chimney flues',
      'Front garden with blooming hydrangeas, roses, and stone walkways',
      'Exceptional value-to-beauty ratio: under $100k $B in game funds',
      'Does not require the Multiple Floors gamepass to build',
    ],
  },
  {
    id: 'grand-penthouse-pavilion',
    name: 'The Glass Horizon Pavilion',
    tagline: 'Ultra-Luxury Grand Estate with In-Home Private Cinema',
    category: 'mansions',
    categoryLabel: 'Modern Mansion',
    priceUSD: 34,
    bloxburgCashEst: 240000,
    bedrooms: 5,
    bathrooms: 4,
    floors: 2,
    plotSize: 'Large Plot',
    buildTimeHours: 3.5,
    requiredGamepasses: ['Multiple Floors', 'Advanced Placing', 'Transform Tool (Optional)'],
    featured: false,
    mainImage: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
    galleryImages: [
      {
        url: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
        caption: 'Monumental facade with floating cantilevers and recessed uplighting',
      },
      {
        url: '/src/assets/images/bloxburg_luxury_interior_1793408052401.jpg',
        caption: 'Grand social hall with linear double fireplace and chandelier',
      },
      {
        url: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
        caption: 'Upper recreation terrace with outdoor barbecue and cocktail bar',
      },
    ],
    shortDescription: 'A premier statement estate conceived for players who want to set the highest standard on their Bloxburg server.',
    fullDescription: 'The Glass Horizon Pavilion is our most comprehensive build. Featuring a horseshoe layout that embraces a central reflecting water courtyard. Inside, it boasts 5 ensuite bedrooms, an immersive private cinema room with custom Bloxburg recliners, walk-in closets with backlit vanity mirrors, and a gourmet chef kitchen.',
    features: [
      'Private cinema room with HD projector and plush tiered loungers',
      '5 spacious ensuite bedrooms with private bathrooms',
      'Central water courtyard with sheet waterfalls and exotic plants',
      'Architectural cantilevers with hidden structure frames',
      'Expansive driveway and parking accommodation for up to 3 cars',
    ],
  },
  {
    id: 'monochrome-cube-studio',
    name: 'Monochrome Cube Residence',
    tagline: 'Pure Cubist Minimalism with Frosted Glass & Floating Volumes',
    category: 'minimalist',
    categoryLabel: 'Minimalist Estate',
    priceUSD: 24,
    bloxburgCashEst: 145000,
    bedrooms: 3,
    bathrooms: 3,
    floors: 2,
    plotSize: 'Regular Plot',
    buildTimeHours: 2.2,
    requiredGamepasses: ['Multiple Floors', 'Advanced Placing'],
    featured: false,
    mainImage: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
    galleryImages: [
      {
        url: '/src/assets/images/bloxburg_minimalist_estate_1793408052922.jpg',
        caption: 'Intersecting cubic volumes illuminated with matte black sconces',
      },
      {
        url: '/src/assets/images/bloxburg_luxury_interior_1793408052401.jpg',
        caption: 'Microcement dining space with sculptural lighting installation',
      },
      {
        url: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
        caption: 'Rear courtyard with lap pool and dark timber decking',
      },
    ],
    shortDescription: 'Architectural balance in pure white, charcoal gray, and natural oak with tempered acoustic glass walls.',
    fullDescription: 'Inspired by Swiss brutalist and contemporary villas. The Monochrome Cube Residence eliminates visual clutter to focus on line purity, concealed perimeter lighting, and effortless circulation that eliminates unnecessary walls inside Bloxburg.',
    features: [
      'Geometric cubic volumes with linear perimeter light grazing',
      'Seamless integrated lap pool with dark floating timber deck',
      'Open double-height rooms with structural glass partitions',
      'Master suite private balcony with seamless glass railings',
      'Fully equipped laundry room and butler pantry',
    ],
  },
  {
    id: 'meadow-cottage-bliss',
    name: 'Meadowbrook Cottage',
    tagline: 'Country Charm & Botanical Garden for Cozy Family Roleplay',
    category: 'family',
    categoryLabel: 'Family Home',
    priceUSD: 17,
    bloxburgCashEst: 89000,
    bedrooms: 2,
    bathrooms: 2,
    floors: 1,
    plotSize: 'Regular Plot',
    buildTimeHours: 1.5,
    requiredGamepasses: ['Advanced Placing'],
    featured: false,
    mainImage: '/src/assets/images/bloxburg_cozy_family_home_1793408053161.jpg',
    galleryImages: [
      {
        url: '/src/assets/images/bloxburg_cozy_family_home_1793408053161.jpg',
        caption: 'Picturesque country facade with gabled roofs and planter boxes',
      },
      {
        url: '/src/assets/images/bloxburg_luxury_interior_1793408052401.jpg',
        caption: 'Rustic kitchen with open shelving and farmhouse dining table',
      },
      {
        url: '/src/assets/images/bloxburg_modern_villa_1793408050800.jpg',
        caption: 'Garden area with tire swing, vegetable beds, and white picket fence',
      },
    ],
    shortDescription: 'A warm sanctuary featuring exposed timber beams, rustic shelves, an authentic hearth, and lush gardens.',
    fullDescription: 'The perfect retreat for players seeking tranquility and wholesome comfort in Bloxburg. Every texture has been curated with Bloxburg materials to feel hand-crafted: aged wood planks, woven wool carpets, and double-draped windows that diffuse warm afternoon sunlight.',
    features: [
      'Fenced vegetable garden with planter boxes and seasonal flowers',
      'Farmhouse kitchen with apron-front sink and curated pantry shelves',
      'Cozy bay window reading nook with garden views',
      'Budget-friendly and fast to build in a single live session',
      '100% cozy atmosphere tailored for recording videos and roleplay',
    ],
  },
];
