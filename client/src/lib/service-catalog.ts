export const PPF_CATEGORIES: Record<string, Record<string, Record<string, number>>> = {
  Elite: {
    "Small Cars": {
      "TPU 5 Years Gloss": 55000,
      "TPU 5 Years Matt": 60000,
      "TPU 7 Years Gloss": 80000,
      "TPU 10 Years Gloss": 95000,
    },
    "Hatchback / Small Sedan": {
      "TPU 5 Years Gloss": 60000,
      "TPU 5 Years Matt": 70000,
      "TPU 7 Years Gloss": 85000,
      "TPU 10 Years Gloss": 105000,
    },
    "Mid-size Sedan / Compact SUV / MUV": {
      "TPU 5 Years Gloss": 70000,
      "TPU 5 Years Matt": 75000,
      "TPU 7 Years Gloss": 90000,
      "TPU 10 Years Gloss": 112000,
    },
    "SUV / MPV": {
      "TPU 5 Years Gloss": 80000,
      "TPU 5 Years Matt": 85000,
      "TPU 7 Years Gloss": 95000,
      "TPU 10 Years Gloss": 120000,
    },
  },
  "Garware Plus": {
    "Small Cars": { "TPU 5 Years Gloss": 62000 },
    "Hatchback / Small Sedan": { "TPU 5 Years Gloss": 65000 },
    "Mid-size Sedan / Compact SUV / MUV": { "TPU 5 Years Gloss": 70000 },
    "SUV / MPV": { "TPU 5 Years Gloss": 85000 },
  },
  "Garware Premium": {
    "Small Cars": { "TPU 8 Years Gloss": 80000 },
    "Hatchback / Small Sedan": { "TPU 8 Years Gloss": 85000 },
    "Mid-size Sedan / Compact SUV / MUV": { "TPU 8 Years Gloss": 90000 },
    "SUV / MPV": { "TPU 8 Years Gloss": 95000 },
  },
  "Garware Matt": {
    "Small Cars": { "TPU 5 Years Matt": 105000 },
    "Hatchback / Small Sedan": { "TPU 5 Years Matt": 110000 },
    "Mid-size Sedan / Compact SUV / MUV": { "TPU 5 Years Matt": 115000 },
    "SUV / MPV": { "TPU 5 Years Matt": 120000 },
  },
};

export const OTHER_SERVICES: Record<string, Record<string, number>> = {
  "Foam Washing": {
    "Small Cars": 400,
    "Hatchback / Small Sedan": 500,
    "Mid-size Sedan / Compact SUV / MUV": 600,
    "SUV / MPV": 700,
  },
  "Premium Washing": {
    "Small Cars": 600,
    "Hatchback / Small Sedan": 700,
    "Mid-size Sedan / Compact SUV / MUV": 800,
    "SUV / MPV": 900,
  },
  "Interior Cleaning": {
    "Small Cars": 2500,
    "Hatchback / Small Sedan": 3000,
    "Mid-size Sedan / Compact SUV / MUV": 3500,
    "SUV / MPV": 4500,
  },
  "Interior Steam Cleaning": {
    "Small Cars": 3500,
    "Hatchback / Small Sedan": 4000,
    "Mid-size Sedan / Compact SUV / MUV": 4500,
    "SUV / MPV": 5500,
  },
  "Leather Treatment": {
    "Small Cars": 5000,
    "Hatchback / Small Sedan": 5500,
    "Mid-size Sedan / Compact SUV / MUV": 6000,
    "SUV / MPV": 7000,
  },
  Detailing: {
    "Small Cars": 5000,
    "Hatchback / Small Sedan": 6500,
    "Mid-size Sedan / Compact SUV / MUV": 7000,
    "SUV / MPV": 9000,
  },
  "Paint Sealant Coating (Teflon)": {
    "Small Cars": 6500,
    "Hatchback / Small Sedan": 8500,
    "Mid-size Sedan / Compact SUV / MUV": 9500,
    "SUV / MPV": 11500,
  },
  "Ceramic Coating – 9H": {
    "Small Cars": 11000,
    "Hatchback / Small Sedan": 12500,
    "Mid-size Sedan / Compact SUV / MUV": 15000,
    "SUV / MPV": 18000,
  },
  "Ceramic Coating – MAFRA": {
    "Small Cars": 12500,
    "Hatchback / Small Sedan": 15000,
    "Mid-size Sedan / Compact SUV / MUV": 18000,
    "SUV / MPV": 21000,
  },
  "Ceramic Coating – MENZA PRO": {
    "Small Cars": 15000,
    "Hatchback / Small Sedan": 18000,
    "Mid-size Sedan / Compact SUV / MUV": 21000,
    "SUV / MPV": 24000,
  },
  "Ceramic Coating – KOCH CHEMIE": {
    "Small Cars": 18000,
    "Hatchback / Small Sedan": 22000,
    "Mid-size Sedan / Compact SUV / MUV": 25000,
    "SUV / MPV": 28000,
  },
  "Corrosion Treatment": {
    "Small Cars": 3500,
    "Hatchback / Small Sedan": 5000,
    "Mid-size Sedan / Compact SUV / MUV": 6000,
    "SUV / MPV": 7500,
  },
  "Windshield Coating": {
    "Small Cars": 2500,
    "Hatchback / Small Sedan": 3000,
    "Mid-size Sedan / Compact SUV / MUV": 3500,
    "SUV / MPV": 4000,
  },
  "Windshield Coating All Glasses": {
    "Small Cars": 5000,
    "Hatchback / Small Sedan": 5500,
    "Mid-size Sedan / Compact SUV / MUV": 6000,
    "SUV / MPV": 6500,
  },
  "Sun Control Film – Economy": {
    "Small Cars": 5200,
    "Hatchback / Small Sedan": 6000,
    "Mid-size Sedan / Compact SUV / MUV": 6500,
    "SUV / MPV": 8400,
  },
  "Sun Control Film – Standard": {
    "Small Cars": 7500,
    "Hatchback / Small Sedan": 8300,
    "Mid-size Sedan / Compact SUV / MUV": 9500,
    "SUV / MPV": 12500,
  },
  "Sun Control Film – Premium": {
    "Small Cars": 11500,
    "Hatchback / Small Sedan": 13000,
    "Mid-size Sedan / Compact SUV / MUV": 15000,
    "SUV / MPV": 18000,
  },
  "Sun Control Film – Ceramic": {
    "Small Cars": 13500,
    "Hatchback / Small Sedan": 15500,
    "Mid-size Sedan / Compact SUV / MUV": 18000,
    "SUV / MPV": 21000,
  },
};

export const VEHICLE_TYPES = [
  "Small Cars",
  "Hatchback / Small Sedan",
  "Mid-size Sedan / Compact SUV / MUV",
  "SUV / MPV",
];

export type SelectedService = {
  name: string;
  vehicleType: string;
  price: number;
};
