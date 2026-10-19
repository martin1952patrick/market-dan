export type ProfileStatus = 'active' | 'pending' | 'suspended' | 'draft' | 'dormant';
export type ListingTier = 'elite' | 'spotlight' | 'premium' | 'standard' | null;
export type VisibilityPackageTier = 'elite' | 'spotlight' | 'premium' | 'standard';

export interface NearbyPlace {
  id: string;
  name: string;
  locationId: string; // which location this belongs to
  description?: string;
}

export interface MicroLocation {
  id: string;
  name: string;
  description?: string;
}

export interface VisibilityPackageConfig {
  tier: VisibilityPackageTier;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  durationDays: number;
  setByAdmin?: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt: string;
  thumbnail?: string;
}

export interface ClientProfile {
  id: string;
  numericId: number;
  name: string;
  businessName: string;
  email: string;
  password: string;
  phone: string;
  county: string;
  road: string;
  subcounty: string;
  division: string;
  location: string;
  subLocation: string;
  smallLocations?: string[]; // seller-managed small areas served, e.g. "87 Junction"
  description: string;
  avatar: string;
  avatarAlt: string;
  media: MediaItem[];
  uploadLimit: number;
  status: ProfileStatus;
  hidden: boolean;
  featured: boolean;
  featuredOrder: number | null;
  joinedDate: string;
  categories: string[];
  subCategories?: string[];
  views: number;
  subscriptionExpiry?: string;
  verified?: boolean;
  tier?: ListingTier;
  visibilityPackage?: VisibilityPackageConfig;
  freeTrialActivatedAt?: string; // ISO date string — set when seller activates free trial
  freeTrialEnded?: boolean; // true when admin ends trial or 30 days elapsed
  // Product detail fields
  itemType?: string;
  weight?: string;
  dimensions?: string;
  material?: string;
  colour?: string;
  style?: string;
  roomPlacement?: string;
  furnitureType?: string;
  condition?: string;
  warranty?: string;
  origin?: string;
  delivery?: string;
  assembly?: string;
  paymentMethods?: string;
  // Which product detail fields are enabled/visible on public profile
  enabledProductFields?: string[];
}

export interface Location {
  id: string;
  name: string;
  area: string;
  profileCount: number;
}

export interface Division {
  id: string;
  name: string;
  subcounty: string;
  county: string;
}

export interface Road {
  id: string;
  name: string;
  county: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  status: 'published' | 'draft';
  coverImage: string;
  coverImageAlt: string;
  tags: string[];
}

export const LOCATIONS: Location[] = [
{ id: 'loc-kinoo', name: 'Kinoo', area: 'Kiambu', profileCount: 8 },
{ id: 'loc-westlands', name: 'Westlands', area: 'Nairobi', profileCount: 12 },
{ id: 'loc-karen', name: 'Karen', area: 'Nairobi', profileCount: 7 },
{ id: 'loc-ruiru', name: 'Ruiru', area: 'Kiambu', profileCount: 5 },
{ id: 'loc-thika', name: 'Thika', area: 'Kiambu', profileCount: 9 },
{ id: 'loc-ngong', name: 'Ngong', area: 'Kajiado', profileCount: 4 },
{ id: 'loc-kasarani', name: 'Kasarani', area: 'Nairobi', profileCount: 6 },
{ id: 'loc-rongai', name: 'Rongai', area: 'Kajiado', profileCount: 3 },
{ id: 'loc-kikuyu', name: 'Kikuyu', area: 'Kiambu', profileCount: 6 },
{ id: 'loc-langata', name: 'Lang\'ata', area: 'Nairobi', profileCount: 5 },
{ id: 'loc-eastleigh', name: 'Eastleigh', area: 'Nairobi', profileCount: 11 },
{ id: 'loc-donholm', name: 'Donholm', area: 'Nairobi', profileCount: 4 }];

export const DIVISIONS: Division[] = [
{ id: 'div-kikuyu', name: 'Kikuyu', subcounty: 'Kiambu', county: 'Kiambu' },
{ id: 'div-limuru', name: 'Limuru', subcounty: 'Kiambu', county: 'Kiambu' },
{ id: 'div-lari', name: 'Lari', subcounty: 'Kiambu', county: 'Kiambu' },
{ id: 'div-thika', name: 'Thika', subcounty: 'Thika', county: 'Kiambu' },
{ id: 'div-ruiru', name: 'Ruiru', subcounty: 'Ruiru', county: 'Kiambu' },
{ id: 'div-westlands', name: 'Westlands', subcounty: 'Westlands', county: 'Nairobi' },
{ id: 'div-karen', name: 'Karen', subcounty: 'Karen', county: 'Nairobi' },
{ id: 'div-kasarani', name: 'Kasarani', subcounty: 'Kasarani', county: 'Nairobi' },
{ id: 'div-langata', name: 'Lang\'ata', subcounty: 'Lang\'ata', county: 'Nairobi' },
{ id: 'div-eastleigh', name: 'Eastleigh', subcounty: 'Eastleigh', county: 'Nairobi' },
{ id: 'div-ngong', name: 'Ngong', subcounty: 'Ngong', county: 'Kajiado' },
{ id: 'div-rongai', name: 'Rongai', subcounty: 'Rongai', county: 'Kajiado' }];


export const ROADS: Road[] = [
{ id: 'road-waiyaki', name: 'Waiyaki Way', county: 'Nairobi' },
{ id: 'road-langata', name: "Lang'ata Road", county: 'Nairobi' },
{ id: 'road-thika', name: 'Thika Road', county: 'Nairobi' },
{ id: 'road-mombasa', name: 'Mombasa Road', county: 'Nairobi' },
{ id: 'road-ngong', name: 'Ngong Road', county: 'Nairobi' },
{ id: 'road-limuru', name: 'Limuru Road', county: 'Kiambu' },
{ id: 'road-kiambu', name: 'Kiambu Road', county: 'Kiambu' },
{ id: 'road-kangundo', name: 'Kangundo Road', county: 'Nairobi' },
{ id: 'road-magadi', name: 'Magadi Road', county: 'Kajiado' }];


export const CLIENT_PROFILES: ClientProfile[] = [
{
  id: 'client-001',
  numericId: 1,
  name: 'James Mwangi',
  businessName: 'Mwangi Furniture Works',
  email: 'james@mwangifurniture.co.ke',
  password: 'Furni@2026',
  phone: '+254 712 345 678',
  county: 'Kiambu',
  road: 'Waiyaki Way',
  subcounty: 'Kiambu',
  division: 'Kikuyu',
  location: 'Kinoo',
  subLocation: 'Kinoo Market',
  description:
  'Handcrafted solid mahogany and teak furniture made to order. Specialising in dining sets, bedroom suites, and custom wardrobes. Over 12 years of craftsmanship serving Nairobi and surrounding areas. We offer free delivery within 20km and a 2-year structural warranty on all pieces.',
  avatar: "https://images.unsplash.com/photo-1597078107996-f4c621173a4a",
  avatarAlt: 'James Mwangi, owner of Mwangi Furniture Works, smiling in workshop',
  media: [
  { id: 'media-001-1', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_16be3c6c2-1772173142757.png", alt: 'Solid mahogany dining table set with six chairs in showroom' },
  { id: 'media-001-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1c6f007ad-1785129012494.png", alt: 'Custom teak bedroom suite with wardrobe and bedside tables' },
  { id: 'media-001-3', type: 'image', url: "https://images.unsplash.com/photo-1728722740555-9c523d21bccd", alt: 'Craftsman working on wooden chair in carpentry workshop' }],

  uploadLimit: 6,
  status: 'active',
  hidden: false,
  featured: true,
  featuredOrder: 1,
  joinedDate: '2024-03-15',
  categories: ['Dining Sets', 'Bedroom', 'Custom Orders'],
  views: 1842,
  subscriptionExpiry: '2027-03-15'
},
{
  id: 'client-002',
  numericId: 2,
  name: 'Amina Hassan',
  businessName: 'Amina\'s Modern Interiors',
  email: 'amina@moderninteriors.co.ke',
  password: 'Amina@2026',
  phone: '+254 723 456 789',
  county: 'Nairobi',
  road: 'Waiyaki Way',
  subcounty: 'Westlands',
  division: 'Westlands',
  location: 'Westlands',
  subLocation: 'Westlands Ring Road',
  description:
  'Contemporary furniture imports and local designs. Sofas, coffee tables, TV units, and office furniture. We source premium materials from Italy and Malaysia, combining them with local craftsmanship. Showroom open Monday–Saturday 9am–6pm in Westlands.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_141e51895-1763296519617.png",
  avatarAlt: 'Amina Hassan, furniture business owner, professional portrait',
  media: [
  { id: 'media-002-1', type: 'image', url: "https://images.unsplash.com/photo-1721613886942-b0a2989b8f46", alt: 'Modern grey sectional sofa in bright living room' },
  { id: 'media-002-2', type: 'image', url: "https://images.unsplash.com/photo-1718049719673-70ee6f6dfa28", alt: 'Minimalist white coffee table with glass top in contemporary setting' },
  { id: 'media-002-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_18a201090-1764741125375.png", alt: 'Modern TV unit with open shelving in dark walnut finish' }],

  uploadLimit: 6,
  status: 'active',
  hidden: false,
  featured: true,
  featuredOrder: 2,
  joinedDate: '2024-01-22',
  categories: ['Sofas', 'Office', 'Living Room'],
  views: 2341,
  subscriptionExpiry: '2027-01-22'
},
{
  id: 'client-003',
  numericId: 3,
  name: 'Peter Kamau',
  businessName: 'Karen Luxury Furnishings',
  email: 'peter@karenluxury.co.ke',
  password: 'Peter@2026',
  phone: '+254 734 567 890',
  county: 'Nairobi',
  road: "Lang'ata Road",
  subcounty: 'Karen',
  division: 'Karen',
  location: 'Karen',
  subLocation: 'Karen Hardy',
  description:
  'Premium bespoke furniture for discerning homes. Specialising in high-end upholstery, imported hardwoods, and designer lighting. Each piece is a collaboration between our master craftsmen and interior designers. Minimum order KES 50,000.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15ebdb31b-1763300068284.png",
  avatarAlt: 'Peter Kamau, luxury furniture specialist, professional headshot',
  media: [
  { id: 'media-003-1', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1da7b258a-1767479203570.png", alt: 'Luxury velvet armchair in deep emerald green with gold legs' },
  { id: 'media-003-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_180c7ecac-1769348740880.png", alt: 'Bespoke king-size bed frame in polished walnut with upholstered headboard' },
  { id: 'media-003-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1e3c07dc6-1769302179738.png", alt: 'Designer dining table with marble top and brass base in luxury home' }],

  uploadLimit: 6,
  status: 'active',
  hidden: false,
  featured: true,
  featuredOrder: 3,
  joinedDate: '2024-02-08',
  categories: ['Luxury', 'Bespoke', 'Upholstery'],
  views: 1567,
  subscriptionExpiry: '2027-02-08'
},
{
  id: 'client-004',
  numericId: 4,
  name: 'Grace Njeri',
  businessName: 'Thika Road Furniture Hub',
  email: 'grace@thikaroad.co.ke',
  password: 'Grace@2026',
  phone: '+254 745 678 901',
  county: 'Kiambu',
  road: 'Thika Road',
  subcounty: 'Thika',
  division: 'Thika',
  location: 'Thika',
  subLocation: 'Thika Town',
  description:
  'Affordable quality furniture for every budget. Large showroom with 200+ pieces on display. Sofas, beds, dining sets, and children\'s furniture. Layaway plans available. We deliver across Nairobi and Kiambu County.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d3e218f1-1773085528466.png",
  avatarAlt: 'Grace Njeri, furniture shop owner, warm smile portrait',
  media: [
  { id: 'media-004-1', type: 'image', url: "https://images.unsplash.com/photo-1703250151890-9d299b88e886", alt: 'Large furniture showroom with multiple sofa sets on display' },
  { id: 'media-004-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1bc09eb69-1772271756552.png", alt: 'Affordable three-piece sofa set in brown leather' },
  { id: 'media-004-3', type: 'image', url: "https://images.unsplash.com/photo-1722603931794-b92901acd088", alt: 'Children\'s bedroom set with bunk bed and study desk' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-05-10',
  categories: ['Sofas', 'Children\'s', 'Budget-Friendly'],
  views: 934
},
{
  id: 'client-005',
  numericId: 5,
  name: 'Samuel Otieno',
  businessName: 'Kasarani Office Solutions',
  email: 'samuel@kasaranioffice.co.ke',
  password: 'Samuel@2026',
  phone: '+254 756 789 012',
  county: 'Nairobi',
  road: 'Thika Road',
  subcounty: 'Kasarani',
  division: 'Kasarani',
  location: 'Kasarani',
  subLocation: 'Kasarani Stadium',
  description:
  'Office furniture specialists — desks, ergonomic chairs, filing cabinets, and reception counters. We supply homes, schools, and corporate offices. Bulk discounts available for orders over 10 units.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18c66c46c-1763301780768.png",
  avatarAlt: 'Samuel Otieno, office furniture specialist, business portrait',
  media: [
  { id: 'media-005-1', type: 'image', url: "https://images.unsplash.com/photo-1652850842324-9b9c9174b1a2", alt: 'Modern office workstation setup with ergonomic chair and monitor arm' },
  { id: 'media-005-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1bf32a885-1767524756873.png", alt: 'Open plan office with rows of desks and task chairs' },
  { id: 'media-005-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_116523a83-1767098219917.png", alt: 'Reception counter in light oak finish with built-in storage' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-06-18',
  categories: ['Office', 'Ergonomic', 'Corporate'],
  views: 678
},
{
  id: 'client-006',
  numericId: 6,
  name: 'Fatuma Wanjiku',
  businessName: 'Ngong Rattan & Wicker',
  email: 'fatuma@ngongrattan.co.ke',
  password: 'Fatuma@2026',
  phone: '+254 767 890 123',
  county: 'Kajiado',
  road: 'Magadi Road',
  subcounty: 'Ngong',
  division: 'Ngong',
  location: 'Ngong',
  subLocation: 'Ngong Town',
  description:
  'Natural rattan, wicker, and bamboo furniture handmade by local artisans. Outdoor sets, indoor lounge chairs, plant stands, and decorative baskets. Eco-friendly and sustainably sourced.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_178e1db16-1783887337298.png",
  avatarAlt: 'Fatuma Wanjiku, rattan furniture artisan, outdoor portrait',
  media: [
  { id: 'media-006-1', type: 'image', url: "https://images.unsplash.com/photo-1719324923575-f06caabfa92c", alt: 'Rattan outdoor dining set on garden patio with cushions' },
  { id: 'media-006-2', type: 'image', url: "https://images.unsplash.com/photo-1599599068573-ed5fb939bd0e", alt: 'Wicker armchair with tropical print cushion in sunlit room' },
  { id: 'media-006-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_17690d68c-1770573304210.png", alt: 'Bamboo plant stand collection with various heights' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-07-04',
  categories: ['Outdoor', 'Rattan', 'Eco-Friendly'],
  views: 512
},
{
  id: 'client-007',
  numericId: 7,
  name: 'Brian Kipchoge',
  businessName: 'Ruiru Budget Beds',
  email: 'brian@ruirubeds.co.ke',
  password: 'Brian@2026',
  phone: '+254 778 901 234',
  county: 'Kiambu',
  road: 'Thika Road',
  subcounty: 'Ruiru',
  division: 'Ruiru',
  location: 'Ruiru',
  subLocation: 'Ruiru Town',
  description:
  'Bedroom specialists at unbeatable prices. Single, double, queen, and king beds with optional mattresses. Delivery available to Ruiru, Juja, and Thika areas.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1aa7d9ef6-1763296853575.png",
  avatarAlt: 'Brian Kipchoge, bed furniture retailer, friendly portrait',
  media: [
  { id: 'media-007-1', type: 'image', url: "https://images.unsplash.com/photo-1714138107718-baa87d3ea624", alt: 'King-size bed with white linen and wooden headboard in bedroom' },
  { id: 'media-007-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1174ed463-1772271759034.png", alt: 'Children\'s single bed with storage drawers underneath' },
  { id: 'media-007-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_161128db6-1774021236600.png", alt: 'Double bed frame in dark espresso finish' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-07-19',
  categories: ['Bedroom', 'Beds', 'Budget-Friendly'],
  views: 445
},
{
  id: 'client-008',
  numericId: 8,
  name: 'Lucy Achieng',
  businessName: 'Eastleigh Furniture Mall',
  email: 'lucy@eastleighfurniture.co.ke',
  password: 'Lucy@2026',
  phone: '+254 789 012 345',
  county: 'Nairobi',
  road: 'Kangundo Road',
  subcounty: 'Eastleigh',
  division: 'Eastleigh',
  location: 'Eastleigh',
  subLocation: '1st Avenue',
  description:
  'The largest furniture selection in Eastleigh. Imported and locally made furniture at wholesale prices. Visit our 3-storey showroom on 1st Avenue.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ed4c1572-1763295037377.png",
  avatarAlt: 'Lucy Achieng, furniture mall manager, professional photo',
  media: [
  { id: 'media-008-1', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_12ffab3c5-1766965960567.png", alt: 'Multi-storey furniture showroom interior with various displays' },
  { id: 'media-008-2', type: 'image', url: "https://images.unsplash.com/photo-1680503397654-cd18497b1b41", alt: 'Imported leather sofa collection in showroom' }],

  uploadLimit: 3,
  status: 'pending',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-08-01',
  categories: ['Wholesale', 'Imported', 'All Types'],
  views: 89
},
{
  id: 'client-009',
  numericId: 9,
  name: 'David Mutua',
  businessName: 'Rongai Woodcraft',
  email: 'david@rongaiwoodcraft.co.ke',
  password: 'David@2026',
  phone: '+254 790 123 456',
  county: 'Kajiado',
  road: 'Magadi Road',
  subcounty: 'Rongai',
  division: 'Rongai',
  location: 'Rongai',
  subLocation: 'Rongai Centre',
  description:
  'Traditional Kenyan woodcraft furniture. Kiondo-inspired designs, carved chairs, and decorative pieces. Perfect for homes that want authentic African character.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_4cdcb0e92-1791111908416.png",
  avatarAlt: 'David Mutua, traditional woodcraft artisan, workshop portrait',
  media: [
  { id: 'media-009-1', type: 'image', url: "https://images.unsplash.com/photo-1566760980567-132d9f9e4d6d", alt: 'Carved wooden African-style chair with intricate patterns' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-07-28',
  categories: ['Traditional', 'Carved', 'Decorative'],
  views: 287
},
{
  id: 'client-010',
  numericId: 10,
  name: 'Mercy Wambua',
  businessName: 'Kikuyu Sofa Centre',
  email: 'mercy@kikuyusofa.co.ke',
  password: 'Mercy@2026',
  phone: '+254 701 234 567',
  county: 'Kiambu',
  road: 'Waiyaki Way',
  subcounty: 'Kikuyu',
  division: 'Kikuyu',
  location: 'Kikuyu',
  subLocation: 'Kikuyu Town',
  description:
  'Sofa specialists with over 50 designs to choose from. Custom upholstery in any fabric or leather. Repair and reupholstery services also available.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1bb5d2cb2-1763294526193.png",
  avatarAlt: 'Mercy Wambua, sofa specialist, friendly business portrait',
  media: [
  { id: 'media-010-1', type: 'image', url: "https://images.unsplash.com/photo-1680503397090-0483be73406f", alt: 'Showroom display of various sofa designs and colours' },
  { id: 'media-010-2', type: 'image', url: "https://images.unsplash.com/photo-1645817082556-39df99018f31", alt: 'Custom upholstered sectional sofa in mustard yellow fabric' },
  { id: 'media-010-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b2848dab-1772196144462.png", alt: 'Leather chesterfield sofa in deep burgundy with button tufting' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-06-02',
  categories: ['Sofas', 'Upholstery', 'Custom'],
  views: 723
},
{
  id: 'client-011',
  numericId: 11,
  name: 'Hassan Ochieng',
  businessName: 'Lang\'ata Home Depot',
  email: 'hassan@langata.co.ke',
  password: 'Hassan@2026',
  phone: '+254 712 987 654',
  county: 'Nairobi',
  road: "Lang'ata Road",
  subcounty: 'Lang\'ata',
  division: 'Lang\'ata',
  location: 'Lang\'ata',
  subLocation: 'Langata Road',
  description:
  'Complete home furnishing solutions. Furniture, curtains, carpets, and home accessories under one roof. We do full home setups for new homeowners and apartments.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1373c1c56-1763291648235.png",
  avatarAlt: 'Hassan Ochieng, home depot owner, professional portrait',
  media: [
  { id: 'media-011-1', type: 'image', url: "https://images.unsplash.com/photo-1721394748916-9e9b1c7bd913", alt: 'Complete living room setup with sofa, curtains and carpet' },
  { id: 'media-011-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_146cc8ee3-1772751062741.png", alt: 'Master bedroom fully furnished with matching furniture set' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-05-27',
  categories: ['Full Home', 'Carpets', 'Accessories'],
  views: 598
},
{
  id: 'client-012',
  numericId: 12,
  name: 'Esther Karimi',
  businessName: 'Donholm Kids Corner',
  email: 'esther@donholmkids.co.ke',
  password: 'Esther@2026',
  phone: '+254 723 876 543',
  county: 'Nairobi',
  road: 'Kangundo Road',
  subcounty: 'Donholm',
  division: 'Donholm',
  location: 'Donholm',
  subLocation: 'Donholm Phase 5',
  description:
  'Children\'s furniture specialists. Safe, colourful, and durable bedroom sets, study desks, toy storage, and play tables designed specifically for kids aged 2–12.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_451fe4393-1791111907410.png",
  avatarAlt: 'Esther Karimi, children\'s furniture specialist, warm portrait',
  media: [
  { id: 'media-012-1', type: 'image', url: "https://images.unsplash.com/photo-1697543383021-64b43a6552bd", alt: 'Colourful children\'s bedroom with bunk bed and toy storage' },
  { id: 'media-012-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1776b6e1c-1766861076467.png", alt: 'Children\'s study desk with bookshelf and ergonomic chair' },
  { id: 'media-012-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1d4edfb21-1772190762228.png", alt: 'Play table with coloured chairs for young children' }],

  uploadLimit: 3,
  status: 'suspended',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-04-14',
  categories: ['Children\'s', 'Study', 'Play'],
  views: 312
},
{
  id: 'client-013',
  numericId: 58,
  name: 'Mbote Kamau',
  businessName: 'Mbote Furniture Studio',
  email: 'mbote@gmail.com',
  password: 'Mbote@123',
  phone: '+254 700 000 058',
  county: 'Nairobi',
  road: 'Waiyaki Way',
  subcounty: 'Westlands',
  division: 'Westlands',
  location: 'Westlands',
  subLocation: 'Westlands Sarit',
  description:
  'Modern and contemporary furniture studio based in Westlands. Specialising in custom-built pieces, modular shelving, and minimalist living room sets. We work closely with clients to bring their vision to life.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15ebdb31b-1763300068284.png",
  avatarAlt: 'Mbote Kamau, furniture studio owner, professional portrait',
  media: [
  { id: 'media-013-1', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_16ba92929-1767458836633.png", alt: 'Modern minimalist sofa in light grey fabric in studio showroom' },
  { id: 'media-013-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_105fabdbd-1772955239072.png", alt: 'Custom modular shelving unit in white and oak finish' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-09-01',
  categories: ['Sofas', 'Custom Orders', 'Living Room'],
  views: 124,
  subscriptionExpiry: '2027-09-01'
},
{
  id: 'client-014',
  numericId: 14,
  name: 'Evans Ochieng',
  businessName: 'Evans Ochieng Furniture',
  email: 'evans@ochiengfurniture.co.ke',
  password: 'Evans@2026',
  phone: '+254 711 222 333',
  county: 'Nairobi',
  road: 'Ngong Road',
  subcounty: 'Langata',
  division: "Lang'ata",
  location: "Lang'ata",
  subLocation: "Lang'ata Shopping Centre",
  description:
  "Quality furniture at affordable prices. Specialising in living room sets, bedroom furniture, and dining tables. We offer free delivery within Nairobi and a 1-year warranty on all products. Visit our showroom along Ngong Road.",
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_112193a91-1763294779964.png",
  avatarAlt: 'Evans Ochieng, furniture business owner, professional portrait',
  media: [
  { id: 'media-014-1', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_193a8b75c-1785500918094.png", alt: 'Modern living room sofa set in grey fabric with wooden legs' },
  { id: 'media-014-2', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_16be3c6c2-1772173142757.png", alt: 'Dining table set with six chairs in natural oak finish' },
  { id: 'media-014-3', type: 'image', url: "https://img.rocket.new/generatedImages/rocket_gen_img_106d16631-1772752383799.png", alt: 'Bedroom furniture set with wardrobe and bedside tables' }],

  uploadLimit: 3,
  status: 'active',
  hidden: false,
  featured: false,
  featuredOrder: null,
  joinedDate: '2024-10-01',
  categories: ['Sofas', 'Bedroom', 'Dining Sets'],
  views: 341,
  subscriptionExpiry: '2027-10-01'
}];


export const BLOG_POSTS: BlogPost[] = [
{
  id: 'blog-001',
  title: 'How to Choose the Right Sofa for Your Living Room',
  excerpt: 'A sofa is often the centrepiece of a living room. Here\'s what to consider before you buy — from fabric to frame construction.',
  content: 'Full content here...',
  author: 'FurniMarket Editorial',
  publishedDate: '2026-07-28',
  status: 'published',
  coverImage: "https://images.unsplash.com/photo-1653972233971-8d7852fb815d",
  coverImageAlt: 'Beautiful living room with large grey sofa and decorative cushions',
  tags: ['Sofas', 'Buying Guide', 'Living Room']
},
{
  id: 'blog-002',
  title: '5 Furniture Trends Dominating Nairobi Homes in 2026',
  excerpt: 'From japandi minimalism to bold African prints, these are the styles our sellers are getting the most enquiries about.',
  content: 'Full content here...',
  author: 'FurniMarket Editorial',
  publishedDate: '2026-07-15',
  status: 'published',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_16689fd47-1772068177556.png",
  coverImageAlt: 'Modern Nairobi apartment interior with trendy furniture pieces',
  tags: ['Trends', 'Interior Design', '2026']
},
{
  id: 'blog-003',
  title: 'The Complete Guide to Caring for Solid Wood Furniture',
  excerpt: 'Solid wood lasts a lifetime if treated right. Learn the oiling, polishing, and humidity tips that professional craftsmen use.',
  content: 'Full content here...',
  author: 'James Mwangi',
  publishedDate: '2026-07-05',
  status: 'published',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_16f71ab05-1764985983013.png",
  coverImageAlt: 'Craftsman applying wood oil to solid mahogany dining table surface',
  tags: ['Maintenance', 'Wood', 'Tips']
},
{
  id: 'blog-004',
  title: 'Setting Up a Home Office: Ergonomics on a Budget',
  excerpt: 'Work from home comfortably without spending a fortune. We\'ve rounded up the best affordable office furniture available from our sellers.',
  content: 'Full content here...',
  author: 'FurniMarket Editorial',
  publishedDate: '2026-06-22',
  status: 'draft',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7ac86f4-1768262410387.png",
  coverImageAlt: 'Neat home office setup with ergonomic chair and standing desk',
  tags: ['Office', 'Ergonomics', 'Budget']
}];


export const WEEKLY_REGISTRATIONS = [
{ week: 'Wk 22', count: 3 },
{ week: 'Wk 23', count: 5 },
{ week: 'Wk 24', count: 2 },
{ week: 'Wk 25', count: 7 },
{ week: 'Wk 26', count: 4 },
{ week: 'Wk 27', count: 6 },
{ week: 'Wk 28', count: 8 },
{ week: 'Wk 29', count: 5 },
{ week: 'Wk 30', count: 9 },
{ week: 'Wk 31', count: 6 }];


export interface SiteSettings {
  siteHeading: string;
  metaTitle: string;
  nearbyPlaces: NearbyPlace[];
  microLocations: MicroLocation[];
  compulsoryProductFields?: string[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteHeading: 'Find Furniture Sellers Near You',
  metaTitle: 'FurniMarket Kenya — Find Furniture Sellers Near You',
  compulsoryProductFields: [],
  nearbyPlaces: [
  { id: 'np-001', name: 'Dagoretti Corner', locationId: 'loc-karen', description: 'Shopping hub near Karen' },
  { id: 'np-002', name: 'Hardy', locationId: 'loc-karen', description: 'Upmarket area adjacent to Karen' },
  { id: 'np-003', name: 'Langata', locationId: 'loc-karen', description: 'Residential area near Karen' },
  { id: 'np-004', name: 'Parklands', locationId: 'loc-westlands', description: 'Residential suburb near Westlands' },
  { id: 'np-005', name: 'Lavington', locationId: 'loc-westlands', description: 'Upscale area near Westlands' },
  { id: 'np-006', name: 'Loresho', locationId: 'loc-westlands', description: 'Quiet suburb near Westlands' },
  { id: 'np-007', name: 'Githurai', locationId: 'loc-kasarani', description: 'Busy market area near Kasarani' },
  { id: 'np-008', name: 'Roysambu', locationId: 'loc-kasarani', description: 'Residential area near Kasarani' },
  { id: 'np-009', name: 'Kahawa', locationId: 'loc-kasarani', description: 'University area near Kasarani' },
  { id: 'np-010', name: 'Limuru', locationId: 'loc-kinoo', description: 'Tea-growing town near Kinoo' },
  { id: 'np-011', name: 'Kabete', locationId: 'loc-kinoo', description: 'Agricultural area near Kinoo' }],

  microLocations: [
  { id: 'ml-001', name: 'Uthiru', description: 'Small area along Waiyaki Way' },
  { id: 'ml-002', name: 'Kabete', description: 'Agricultural area near Kinoo' },
  { id: 'ml-003', name: 'Muguga', description: 'Quiet residential area off Waiyaki Way' },
  { id: 'ml-004', name: 'Sigona', description: 'Golf club area near Kikuyu' }]

};

export const LOCATION_DISTRIBUTION = [
{ name: 'Westlands', value: 12 },
{ name: 'Eastleigh', value: 11 },
{ name: 'Thika', value: 9 },
{ name: 'Kinoo', value: 8 },
{ name: 'Kasarani', value: 6 },
{ name: 'Kikuyu', value: 6 },
{ name: 'Karen', value: 7 },
{ name: 'Others', value: 12 }];

// Helper: generate shareable profile URL slug
// Format: /county/subcounty/location/numericId/business-name
// e.g. /kiambu/kikuyu/kinoo/1/mwangi-furniture-works
export function getProfileUrl(profile: ClientProfile): string {
  const slugify = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const county = slugify(profile.county || profile.location);
  const subcounty = slugify(profile.subcounty || profile.location);
  const location = slugify(profile.location);
  const businessSlug = slugify(profile.businessName);
  return `/${county}/${subcounty}/${location}/${profile.numericId}/${businessSlug}`;
}