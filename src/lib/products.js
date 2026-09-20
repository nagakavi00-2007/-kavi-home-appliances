export const CATEGORIES = [
  "Air Conditioners",
  "Refrigerators",
  "Washing Machines",
  "Televisions",
  "Microwave Ovens",
  "Mixer Grinders",
  "Fans",
  "Water Heaters",
  "Water Purifiers",
  "Vacuum Cleaners",
  "Kitchen Appliances",
  "Home Cleaning Appliances",
  "Small Appliances",
  "Premium Home Appliances",
];

export const BRANDS = [
  "Samsung",
  "LG",
  "Whirlpool",
  "Haier",
  "Bosch",
  "Panasonic",
  "Voltas",
  "Bajaj",
  "Philips",
  "Milton",
  "V-Guard",
  "Crompton",
];

/** @param {string} seed */
const placeholderImage = (seed) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

/** @type {Record<string, string>} */
export const CATEGORY_IMAGES = {
  Refrigerators: "/images/refrigerator-category.jpg",
  "Washing Machines": placeholderImage("photo-1626806787461-102c1bfaaea1"),
  "Air Conditioners": placeholderImage("photo-1581578731548-c64695cc6952"),
  "Televisions": placeholderImage("photo-1593305841991-05c297ba4575"),
  "Microwave Ovens": placeholderImage("photo-1556911220-e15b29be8c8f"),
  "Mixer Grinders": "/images/mixer-grinder-category.jpg",
  "Vacuum Cleaners": "/images/vacuum-cleaner-category.jpg",
  "Water Heaters": placeholderImage("photo-1558618666-fcd25c85cd64"),
  "Water Purifiers": placeholderImage("photo-1584305574647-0cc949a2bb9f"),
  "Kitchen Appliances": placeholderImage("photo-1556910103-1c02745aae4d"),
  Fans: "/images/fan-category.jpg",
  "Home Cleaning Appliances": placeholderImage("photo-1581578731548-c64695cc6952"),
  "Small Appliances": placeholderImage("photo-1524758631624-e2822e304c36"),
  "Premium Home Appliances": placeholderImage("photo-1556910103-1c02745aae4d"),
};

export const HERO_IMAGE = placeholderImage("photo-1585518419759-7fe2e0fbf8a6");

/** @param {string} category */
export const getCategoryImage = (category) =>
  CATEGORY_IMAGES[category] || CATEGORY_IMAGES["Small Appliances"];

const productImages = {
  "001": "/images/refrigerator-category.jpg",
  "002": "https://upload.wikimedia.org/wikipedia/commons/3/35/LG_refrigerator.jpg",
  "003": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Whirlpool_Stainless_Steel_Refrigerator_-_Kitchen_Appliances_%2853075130097%29.jpg",
  "004": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Lavatrice_Bosch.JPG",
  "005": "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=1200&q=80",
  "006": "https://upload.wikimedia.org/wikipedia/commons/2/26/Washing_machine_Whirlpool_%281%29.jpg",
  "007": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Air_conditioner%2C_Sofia_%28P1070790%29.jpg",
  "008": "https://upload.wikimedia.org/wikipedia/commons/6/64/Split_LG.jpg",
  "009": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Panasonic_AIR_CONDITIONER_INDOOR_UNIT_CS-C10KJ2_%282%29.jpg",
  "010": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
  "011": "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=1200&q=80",
  "012": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
  "013": "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=1200&q=80",
  "014": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=1200&q=80",
  "015": "https://upload.wikimedia.org/wikipedia/commons/4/4a/A_table-top_mixer-grinder_or_mixie.jpg",
  "016": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=80",
  "017": "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&w=1200&q=80",
  "018": "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1200&q=80",
  "019": "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80",
  "020": "https://upload.wikimedia.org/wikipedia/commons/4/40/True_Hepa_Vacuum_Cleaner.jpg",
  "021": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",
  "022": "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
  "023": "https://upload.wikimedia.org/wikipedia/commons/0/02/Eureka_Forbes_RO_water_purifier.jpg",
  "024": "https://upload.wikimedia.org/wikipedia/commons/5/53/Aquaguard_Water_Purifier_RO_Enhanced_-_Snap_2581.JPG",
  "025": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Forno_a_microonde_Samsung.jpg",
  "026": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Airfryer_Convert.jpg",
  "027": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Modern_ceiling_fan.jpg",
  "028": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Electric_Oscillating_Table_Fan_by_Emerson.jpg",
  "029": "https://upload.wikimedia.org/wikipedia/commons/4/4a/A_table-top_mixer-grinder_or_mixie.jpg",
  "030": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Electric_Kettle_by_MASA.jpg",
  "031": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Induction_Cooktop_Rolling_Boil.jpg",
  "032": "https://media3.bsh-group.com/Images/5120x/26752616_Bosch_Freestanding_Dish_1600x1014.webp",
  "033": "https://upload.wikimedia.org/wikipedia/commons/3/35/LG_refrigerator.jpg",
  "034": "https://upload.wikimedia.org/wikipedia/commons/0/01/Samsung_Eco_bubble.jpg",
  "035": "https://upload.wikimedia.org/wikipedia/commons/3/34/Split_Haier.jpg",
};

/** @param {any} product */
const createProduct = ({ id, name, brand, category, description, mrp, sellingPrice, rating, reviewCount, emi, stock, warranty, colors = ["Silver"], isFeatured = false, isNew = false, daysAgo = 0 }) => {
  const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
  const createdDate = new Date(Date.now() - daysAgo * 86400000).toISOString();
  return {
    id,
    name,
    brand,
    category,
    description,
    image: getCategoryImage(category),
    mrp,
    sellingPrice,
    discount,
    rating,
    reviewCount,
    emi,
    stock,
    stockStatus: stock > 0 ? "In Stock" : "Out of Stock",
    warranty,
    colors,
    original_price: mrp,
    discount_price: sellingPrice,
    discount_percentage: discount,
    review_count: reviewCount,
    created_date: createdDate,
    is_featured: isFeatured,
    is_new: isNew,
  };
};

/** @type {any[][]} */
const productRows = [
  ["001", "Samsung 253L Double Door Refrigerator", "Samsung", "Refrigerators", "253L Frost Free Double Door Refrigerator", 34990, 29490, 4.5, 1248, 1389, 20, "1 Year", ["Silver", "Black"], true, false, 12],
  ["002", "LG Inverter Frost Free Refrigerator 322L", "LG", "Refrigerators", "322L Smart Inverter Frost Free Refrigerator", 48990, 41990, 4.6, 982, 1979, 14, "1 Year", ["Steel Blue"], true, true, 4],
  ["003", "Whirlpool 265L IntelliFresh Refrigerator", "Whirlpool", "Refrigerators", "265L Triple Door Refrigerator with Active Deo", 38990, 32990, 4.3, 764, 1556, 18, "1 Year", ["Grey"], false, false, 26],
  ["004", "Bosch 8kg Fully Automatic Washing Machine", "Bosch", "Washing Machines", "8kg Front Load Washing Machine with EcoSilence Drive", 52990, 44990, 4.7, 845, 2119, 9, "2 Years", ["White"], true, false, 8],
  ["005", "LG 7kg AI Direct Drive Washing Machine", "LG", "Washing Machines", "7kg Front Load Washing Machine with Steam", 41990, 34990, 4.5, 1130, 1649, 22, "2 Years", ["Graphite"], false, true, 2],
  ["006", "Whirlpool 7.5kg Top Load Washing Machine", "Whirlpool", "Washing Machines", "7.5kg Fully Automatic Top Load Washing Machine", 28990, 23990, 4.2, 626, 1130, 16, "2 Years", ["Grey"], false, false, 31],
  ["007", "Voltas 1.5 Ton 5 Star Inverter AC", "Voltas", "Air Conditioners", "1.5 Ton Inverter Split Air Conditioner with Copper Condenser", 49990, 37990, 4.4, 1542, 1789, 12, "1 Year", ["White"], true, false, 6],
  ["008", "LG 1.5 Ton Dual Inverter AC", "LG", "Air Conditioners", "1.5 Ton 5 Star Dual Inverter Split AC with HD Filter", 56990, 42990, 4.6, 1201, 2024, 11, "1 Year", ["White"], true, true, 3],
  ["009", "Panasonic 1 Ton Wi-Fi Inverter AC", "Panasonic", "Air Conditioners", "1 Ton 5 Star Wi-Fi Enabled Inverter Split AC", 45990, 33990, 4.3, 488, 1600, 8, "1 Year", ["White"], false, false, 22],
  ["010", "Samsung 55 inch Crystal 4K Smart TV", "Samsung", "Televisions", "55 inch 4K Ultra HD Smart LED TV with HDR", 74990, 54990, 4.7, 2086, 2589, 10, "1 Year", ["Black"], true, true, 1],
  ["011", "LG 43 inch 4K WebOS Smart TV", "LG", "Televisions", "43 inch 4K Ultra HD Smart LED TV with Dolby Audio", 49990, 35990, 4.5, 1774, 1693, 15, "1 Year", ["Black"], false, false, 19],
  ["012", "Panasonic 50 inch Google TV", "Panasonic", "Televisions", "50 inch 4K Google TV with Dolby Vision", 57990, 41990, 4.4, 713, 1979, 7, "1 Year", ["Black"], false, false, 36],
  ["013", "Bajaj 20L Grill Microwave Oven", "Bajaj", "Microwave Ovens", "20L Grill Microwave Oven with Auto Cook Menu", 11990, 8990, 4.2, 538, 423, 30, "1 Year", ["Black"], false, false, 14],
  ["014", "Panasonic 27L Convection Microwave Oven", "Panasonic", "Microwave Ovens", "27L Convection Microwave Oven with 101 Auto Menus", 18990, 14990, 4.5, 921, 706, 19, "1 Year", ["Silver"], true, false, 28],
  ["015", "Philips 750W Mixer Grinder", "Philips", "Mixer Grinders", "750W Mixer Grinder with 3 Stainless Steel Jars", 6999, 4999, 4.4, 1820, 235, 45, "2 Years", ["White", "Blue"], false, false, 5],
  ["016", "Bajaj 1000W Rex Mixer Grinder", "Bajaj", "Mixer Grinders", "1000W Mixer Grinder with Nutri-Pro Jars", 8499, 6299, 4.3, 904, 297, 36, "2 Years", ["Black"], false, true, 7],
  ["019", "Philips PowerPro Vacuum Cleaner", "Philips", "Vacuum Cleaners", "1900W Bagless Vacuum Cleaner with PowerCyclone", 12990, 9990, 4.4, 687, 470, 17, "2 Years", ["Red"], true, false, 9],
  ["020", "Eureka Forbes Quick Clean Vacuum Cleaner", "Eureka Forbes", "Home Cleaning Appliances", "1200W Wet and Dry Vacuum Cleaner", 10990, 7990, 4.1, 502, 376, 25, "1 Year", ["Black"], false, false, 33],
  ["021", "V-Guard 25L Water Heater", "V-Guard", "Water Heaters", "25L Storage Water Heater with 5 Star Rating", 18990, 13990, 4.5, 1124, 659, 18, "5 Years", ["White"], true, false, 11],
  ["022", "Bajaj 15L Storage Water Heater", "Bajaj", "Water Heaters", "15L Storage Water Heater with Titanium Armour", 15990, 11490, 4.3, 834, 541, 24, "5 Years", ["White"], false, true, 16],
  ["023", "Kent Grand Plus Water Purifier", "Kent", "Water Purifiers", "RO UV UF Water Purifier with 8L Storage", 19990, 14990, 4.6, 1460, 706, 10, "1 Year", ["White"], true, false, 4],
  ["024", "Aquaguard Delight RO Water Purifier", "Aquaguard", "Water Purifiers", "RO+UV Water Purifier with 6L Storage", 17990, 12990, 4.4, 968, 611, 16, "1 Year", ["White"], false, false, 24],
  ["025", "Samsung 28L Solo Microwave Oven", "Samsung", "Kitchen Appliances", "28L Solo Microwave Oven with Ceramic Enamel Cavity", 16990, 12990, 4.3, 409, 611, 14, "1 Year", ["Black"], false, false, 29],
  ["026", "Philips Air Fryer HD9252", "Philips", "Kitchen Appliances", "4.1L Digital Air Fryer with Rapid Air Technology", 12995, 8995, 4.6, 2210, 423, 32, "2 Years", ["Black"], true, true, 2],
  ["027", "Crompton High Speed Ceiling Fan", "Crompton", "Fans", "1200mm High Speed Ceiling Fan with Energy Efficient Motor", 3499, 2499, 4.2, 1388, 118, 60, "2 Years", ["White", "Brown"], false, false, 20],
  ["028", "Bajaj Majesty Table Fan", "Bajaj", "Fans", "400mm Table Fan with Powerful Air Delivery", 2999, 2199, 4.1, 747, 104, 42, "2 Years", ["White"], false, false, 45],
  ["029", "Philips 500W Juicer Mixer Grinder", "Philips", "Small Appliances", "500W Juicer Mixer Grinder with 3 Speed Control", 7999, 5799, 4.2, 638, 273, 27, "2 Years", ["White", "Blue"], false, false, 23],
  ["030", "Milton Thermosteel Electric Kettle", "Milton", "Small Appliances", "1.5L Electric Kettle with Auto Shut Off", 2499, 1799, 4.3, 991, 85, 55, "1 Year", ["Silver"], false, true, 6],
  ["031", "Bajaj 1200W Induction Cooktop", "Bajaj", "Small Appliances", "Induction Cooktop with Preset Cooking Menus", 3999, 2899, 4.4, 1152, 136, 48, "1 Year", ["Black"], false, false, 13],
  ["032", "Bosch 14 Place Settings Dishwasher", "Bosch", "Premium Home Appliances", "14 Place Settings Fully Integrated Dishwasher", 79990, 64990, 4.7, 324, 3059, 6, "2 Years", ["Silver"], true, false, 10],
  ["033", "LG 655L Side by Side Refrigerator", "LG", "Premium Home Appliances", "655L Side by Side Refrigerator with Smart Diagnosis", 129990, 104990, 4.8, 276, 4939, 5, "1 Year", ["Graphite"], true, true, 3],
  ["034", "Samsung 12kg AI EcoBubble Washing Machine", "Samsung", "Premium Home Appliances", "12kg AI EcoBubble Front Load Washing Machine", 84990, 69990, 4.7, 417, 3290, 8, "3 Years", ["Black"], true, false, 15],
  ["035", "Haier 1.5 Ton Smart Inverter AC", "Haier", "Air Conditioners", "1.5 Ton 5 Star Smart Inverter Split AC", 52990, 39990, 4.3, 592, 1882, 19, "1 Year", ["White"], false, true, 5],
];

export const PRODUCTS = productRows.map(([id, name, brand, category, description, mrp, sellingPrice, rating, reviewCount, emi, stock, warranty, colors, isFeatured, isNew, daysAgo]) => ({
  ...createProduct({ id: `product-${id}`, name, brand, category, description, mrp, sellingPrice, rating, reviewCount, emi, stock, warranty, colors, isFeatured, isNew, daysAgo }),
  image: productImages[id] || getCategoryImage(category),
}));

/** @type {Record<string, string>} */
export const COLOR_SWATCHES = {
  Silver: "#c0c4cc",
  Black: "#1c1c1c",
  White: "#f4f4f5",
  "Steel Blue": "#3b6fa5",
  Grey: "#7d8290",
  Champagne: "#e8c9a0",
  "Rose Gold": "#e8b4a0",
  Titanium: "#8a8d91",
  "Pearl White": "#f0f0ee",
  Graphite: "#3a3a3a",
  Brown: "#6b4a2b",
  Blue: "#2b6cb0",
};

/** @param {string} c */
export const getColorHex = (c) => COLOR_SWATCHES[c] || "#c0c4cc";