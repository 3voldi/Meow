import { CROP_CONFIG } from "@cass-modules/GardenConfig";

export const EVENT_CONFIG = {
  WEEKLY_CYCLE: 7 * 24 * 60 * 60 * 1000,
  WEATHER_CYCLE: 1 * 60 * 60 * 1000,
  // LONG ASF
  EVENT_CYCLE: 4 * 60 * 60 * 1000,
  EVENTS: [
    {
      name: "No Event",
      icon: "🌱",
      isNoEvent: true,
      effect: {
        mutationChance: 0.1,
        growthMultiplier: 1,
      },
      shopItems: [],
    },
    {
      name: "Frost",
      icon: "❄️",
      effect: {
        mutationChance: 0.2,
        growthMultiplier: 0.9,
        mutationType: "Chilled",
      },
      shopItems: [],
    },
    {
      name: "Thunderstorm",
      icon: "⛈️",
      effect: {
        mutationChance: 0.25,
        growthMultiplier: 1.5,
        mutationType: "Shocked",
      },
      shopItems: [
        {
          icon: "🪷",
          name: "Lotus Seed",
          key: "gsLotus",
          flavorText: "A rare seed available during Thunderstorm!",
          price: 500,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsLotus",
              name: "Lotus Seed",
              flavorText: "A rare seed from Thunderstorm.",
              icon: "🪷",
              type: "gardenSeed",
              sellPrice: 250,
              cropData: {
                baseValue: 1000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 1,
              },
            });
          },
        },
      ],
    },

    {
      name: "Easter Event 2025",
      icon: "🐣",
      effect: {
        mutationChance: 0.2,
        growthMultiplier: 1.2,
        mutationType: "Chocolate",
      },
      shopItems: [
        {
          icon: "🍫",
          name: "Chocolate Carrot Seed",
          key: "gsChocoCarrot",
          flavorText: "A sweet carrot from the Easter Event!",
          price: 200,
          rarity: "Common",
          stockChance: 1.0,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsChocoCarrot",
              name: "Chocolate Carrot Seed",
              flavorText: "A sweet carrot from the Easter Event.",
              icon: "🍫",
              type: "gardenSeed",
              sellPrice: 100,
              cropData: {
                baseValue: 400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 1.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍭",
          name: "Red Lollipop Seed",
          key: "gsRedLollipop",
          flavorText: "A sugary treat from the Easter Event.",
          price: 500,
          rarity: "Uncommon",
          stockChance: 0.8,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsRedLollipop",
              name: "Red Lollipop Seed",
              flavorText: "A sugary treat from the Easter Event.",
              icon: "🍭",
              type: "gardenSeed",
              sellPrice: 250,
              cropData: {
                baseValue: 1000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 2,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌻",
          name: "Candy Sunflower Seed",
          key: "gsCandySunflower",
          flavorText: "A radiant flower from the Easter Event.",
          price: 1200,
          rarity: "Rare",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCandySunflower",
              name: "Candy Sunflower Seed",
              flavorText: "A radiant flower from the Easter Event.",
              icon: "🌻",
              type: "gardenSeed",
              sellPrice: 600,
              cropData: {
                baseValue: 2400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 2.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🥚",
          name: "Easter Egg Seed",
          key: "gsEasterEgg",
          flavorText: "A festive egg from the Easter Event.",
          price: 3000,
          rarity: "Legendary",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsEasterEgg",
              name: "Easter Egg Seed",
              flavorText: "A festive egg from the Easter Event.",
              icon: "🥚",
              type: "gardenSeed",
              sellPrice: 1500,
              cropData: {
                baseValue: 6000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🌸",
          name: "Candy Blossom Seed",
          key: "gsCandyBlossom",
          flavorText: "A divine bloom from the Easter Event.",
          price: 6000,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCandyBlossom",
              name: "Candy Blossom Seed",
              flavorText: "A divine bloom from the Easter Event.",
              icon: "🌸",
              type: "gardenSeed",
              sellPrice: 3000,
              cropData: {
                baseValue: 12000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🍫💦",
          name: "Chocolate Sprinkler",
          key: "gtChocoSprinkler",
          flavorText: "Boosts Chocolate mutations for Easter crops.",
          price: 1000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtChocoSprinkler",
              name: "Chocolate Sprinkler",
              flavorText: "Boosts Chocolate mutations for Easter crops.",
              icon: "🍫💦",
              type: "gardenTool",
              sellPrice: 500,
              toolData: {
                growthMultiplier: 1.2,
                mutationChance: { Chocolate: 0.3 },
              },
            });
          },
        },
      ],
    },
    {
      name: "Angry Plant Event",
      icon: "🌿😣",
      effect: {
        mutationChance: 0.25,
        growthMultiplier: 1.1,
        mutationType: "Angry",
      },
      shopItems: [
        {
          icon: "🍒",
          name: "Cranberry Seed",
          key: "gsCranberry",
          flavorText: "A tart fruit from the Angry Plant Event.",
          price: 3500,
          rarity: "Legendary",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCranberry",
              name: "Cranberry Seed",
              flavorText: "A tart fruit from the Angry Plant Event.",
              icon: "🍒",
              type: "gardenSeed",
              sellPrice: 1750,
              cropData: {
                baseValue: 7000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🥭",
          name: "Durian Seed",
          key: "gsDurian",
          flavorText: "A pungent fruit from the Angry Plant Event.",
          price: 4000,
          rarity: "Legendary",
          stockChance: 0.25,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsDurian",
              name: "Durian Seed",
              flavorText: "A pungent fruit from the Angry Plant Event.",
              icon: "🥭",
              type: "gardenSeed",
              sellPrice: 2000,
              cropData: {
                baseValue: 8000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍆",
          name: "Eggplant Seed",
          key: "gsEggplant",
          flavorText: "A versatile veggie from the Angry Plant Event.",
          price: 5000,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsEggplant",
              name: "Eggplant Seed",
              flavorText: "A versatile veggie from the Angry Plant Event.",
              icon: "🍆",
              type: "gardenSeed",
              sellPrice: 2500,
              cropData: {
                baseValue: 10000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🪷",
          name: "Lotus Seed",
          key: "gsLotus",
          flavorText: "A serene flower from the Angry Plant Event.",
          price: 6000,
          rarity: "Divine",
          stockChance: 0.15,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsLotus",
              name: "Lotus Seed",
              flavorText: "A serene flower from the Angry Plant Event.",
              icon: "🪷",
              type: "gardenSeed",
              sellPrice: 3000,
              cropData: {
                baseValue: 12000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🪴",
          name: "Venus Fly Trap Seed",
          key: "gsVenusFlyTrap",
          flavorText: "A carnivorous plant from the Angry Plant Event.",
          price: 6500,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsVenusFlyTrap",
              name: "Venus Fly Trap Seed",
              flavorText: "A carnivorous plant from the Angry Plant Event.",
              icon: "🪴",
              type: "gardenSeed",
              sellPrice: 3250,
              cropData: {
                baseValue: 13000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
                harvests: 1,
              },
            });
          },
        },
        // {
        //   icon: "🌱",
        //   name: "Basic Seed Pack",
        //   key: "gtBasicSeedPack",
        //   flavorText: "A pack of basic seeds from the Angry Plant Event.",
        //   price: 500,
        //   rarity: "Common",
        //   stockChance: 0.8,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtBasicSeedPack",
        //       name: "Basic Seed Pack",
        //       flavorText: "A pack of basic seeds from the Angry Plant Event.",
        //       icon: "🌱",
        //       type: "gardenTool",
        //       sellPrice: 250,
        //       toolData: {
        //         seedTypes: ["gsCarrot", "gsStrawberry", "gsBlueberry"],
        //       },
        //     });
        //   },
        // },
        // {
        //   icon: "🌟",
        //   name: "Premium Seed Pack",
        //   key: "gtPremiumSeedPack",
        //   flavorText:
        //     "A pack of premium seeds with a chance for rainbow sacks.",
        //   price: 1500,
        //   rarity: "Rare",
        //   stockChance: 0.4,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtPremiumSeedPack",
        //       name: "Premium Seed Pack",
        //       flavorText:
        //         "A pack of premium seeds with a chance for rainbow sacks.",
        //       icon: "🌟",
        //       type: "gardenTool",
        //       sellPrice: 750,
        //       toolData: {
        //         seedTypes: ["gsTomato", "gsWatermelon", "gsOrangeTulip"],
        //       },
        //     });
        //   },
        // },
      ],
    },
    {
      name: "Lunar Glow Event",
      icon: "🌙",
      effect: {
        mutationChance: 0.3,
        growthMultiplier: 1.3,
        mutationType: "Moonlit",
      },
      shopItems: [
        {
          icon: "🌙",
          name: "Moonflower Seed",
          key: "gsMoonflower",
          flavorText: "Rare flower blooming under moonlight.",
          price: 8000,
          rarity: "Legendary",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonflower",
              name: "Moonflower Seed",
              flavorText: "Rare flower blooming under moonlight.",
              icon: "🌙",
              type: "gardenSeed",
              sellPrice: 4000,
              cropData: {
                baseValue: 16000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🍃",
          name: "Mint Seed",
          key: "gsMint",
          flavorText: "Refreshing herb with culinary uses.",
          price: 2200,
          rarity: "Rare",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMint",
              name: "Mint Seed",
              flavorText: "Refreshing herb with culinary uses.",
              icon: "🍃",
              type: "gardenSeed",
              sellPrice: 1100,
              cropData: {
                baseValue: 4400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 2,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍄",
          name: "Glowshroom Seed",
          key: "gsGlowshroom",
          flavorText: "Bioluminescent mushroom with unique glow.",
          price: 3000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsGlowshroom",
              name: "Glowshroom Seed",
              flavorText: "Bioluminescent mushroom with unique glow.",
              icon: "🍄",
              type: "gardenSeed",
              sellPrice: 1500,
              cropData: {
                baseValue: 6000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌟",
          name: "Starfruit Seed",
          key: "gsStarfruit",
          flavorText: "A radiant fruit from the Lunar Glow Event.",
          price: 3500,
          rarity: "Legendary",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsStarfruit",
              name: "Starfruit Seed",
              flavorText: "A radiant fruit from the Lunar Glow Event.",
              icon: "🌟",
              type: "gardenSeed",
              sellPrice: 1750,
              cropData: {
                baseValue: 7000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌼",
          name: "Moonglow Seed",
          key: "gsMoonglow",
          flavorText: "A glowing flower from the Lunar Glow Event.",
          price: 4000,
          rarity: "Legendary",
          stockChance: 0.25,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonglow",
              name: "Moonglow Seed",
              flavorText: "A glowing flower from the Lunar Glow Event.",
              icon: "🌼",
              type: "gardenSeed",
              sellPrice: 2000,
              cropData: {
                baseValue: 8000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌸",
          name: "Moon Blossom Seed",
          key: "gsMoonBlossom",
          flavorText: "A divine bloom from the Lunar Glow Event.",
          price: 6000,
          rarity: "Divine",
          stockChance: 0.15,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonBlossom",
              name: "Moon Blossom Seed",
              flavorText: "A divine bloom from the Lunar Glow Event.",
              icon: "🌸",
              type: "gardenSeed",
              sellPrice: 3000,
              cropData: {
                baseValue: 12000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🍌",
          name: "Blood Banana Seed",
          key: "gsBloodBanana",
          flavorText: "A rare fruit from the Lunar Glow Event.",
          price: 5500,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsBloodBanana",
              name: "Blood Banana Seed",
              flavorText: "A rare fruit from the Lunar Glow Event.",
              icon: "🍌",
              type: "gardenSeed",
              sellPrice: 2750,
              cropData: {
                baseValue: 11000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍈",
          name: "Moon Melon Seed",
          key: "gsMoonMelon",
          flavorText: "A juicy melon from the Lunar Glow Event.",
          price: 5200,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonMelon",
              name: "Moon Melon Seed",
              flavorText: "A juicy melon from the Lunar Glow Event.",
              icon: "🍈",
              type: "gardenSeed",
              sellPrice: 2600,
              cropData: {
                baseValue: 10400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🫐",
          name: "Celestiberry Seed",
          key: "gsCelestiberry",
          flavorText: "A celestial berry from the Lunar Glow Event.",
          price: 5000,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCelestiberry",
              name: "Celestiberry Seed",
              flavorText: "A celestial berry from the Lunar Glow Event.",
              icon: "🫐",
              type: "gardenSeed",
              sellPrice: 2500,
              cropData: {
                baseValue: 10000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🥭",
          name: "Moon Mango Seed",
          key: "gsMoonMango",
          flavorText: "A tropical fruit from the Lunar Glow Event.",
          price: 5500,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonMango",
              name: "Moon Mango Seed",
              flavorText: "A tropical fruit from the Lunar Glow Event.",
              icon: "🥭",
              type: "gardenSeed",
              sellPrice: 2750,
              cropData: {
                baseValue: 11000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌑",
          name: "Nightshade Seed",
          key: "gsNightshade",
          flavorText: "A mysterious crop from the Lunar Glow Event.",
          price: 4500,
          rarity: "Legendary",
          stockChance: 0.25,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsNightshade",
              name: "Nightshade Seed",
              flavorText: "A mysterious crop from the Lunar Glow Event.",
              icon: "🌑",
              type: "gardenSeed",
              sellPrice: 2250,
              cropData: {
                baseValue: 9000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🦔",
          name: "Hedgehog",
          key: "gpHedgehog",
          flavorText: "A spiky pet from the Lunar Glow Event.",
          price: 2000000,
          rarity: "Uncommon",
          stockChance: 0.6,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpHedgehog",
              name: "Hedgehog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦔",
              type: "gardenPetCage",
              sellPrice: 1000000,
              petData: {
                name: "Hedgehog",
                collectionRate: 0.1,
                seedTypes: ["gsMoonflower", "gsMint", "gsGlowshroom"],
              },
            });
          },
        },
        {
          icon: "🐹",
          name: "Mole",
          key: "gpMole",
          flavorText: "A digging pet from the Lunar Glow Event.",
          price: 2500000,
          rarity: "Uncommon",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpMole",
              name: "Mole",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐹",
              type: "gardenPetCage",
              sellPrice: 1250000,
              petData: {
                name: "Mole",
                collectionRate: 0.1,
                seedTypes: ["gsStarfruit", "gsMoonglow", "gsNightshade"],
              },
            });
          },
        },
        {
          icon: "🐸",
          name: "Frog",
          key: "gpFrog",
          flavorText: "A hopping pet from the Lunar Glow Event.",
          price: 2000000,
          rarity: "Uncommon",
          stockChance: 0.6,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpFrog",
              name: "Frog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐸",
              type: "gardenPetCage",
              sellPrice: 1000000,
              petData: {
                name: "Frog",
                collectionRate: 0.1,
                seedTypes: ["gsMoonBlossom", "gsBloodBanana", "gsMoonMelon"],
              },
            });
          },
        },
        {
          icon: "🐸🌙",
          name: "Echo Frog",
          key: "gpEchoFrog",
          flavorText: "A mystical frog from the Lunar Glow Event.",
          price: 3000000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpEchoFrog",
              name: "Echo Frog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐸🌙",
              type: "gardenPetCage",
              sellPrice: 1500000,
              petData: {
                name: "Echo Frog",
                collectionRate: 0.15,
                seedTypes: ["gsCelestiberry", "gsMoonMango"],
              },
            });
          },
        },
        {
          icon: "🦇",
          name: "Night Owl",
          key: "gpNightOwl",
          flavorText: "A nocturnal pet from the Lunar Glow Event.",
          price: 3500000,
          rarity: "Rare",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpNightOwl",
              name: "Night Owl",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦇",
              type: "gardenPetCage",
              sellPrice: 1750000,
              petData: {
                name: "Night Owl",
                collectionRate: 0.15,
                seedTypes: ["gsMoonflower", "gsMoonglow", "gsMoonBlossom"],
              },
            });
          },
        },
        {
          icon: "🦝",
          name: "Raccoon",
          key: "gpRaccoon",
          flavorText: "A sneaky pet from the Lunar Glow Event.",
          price: 3000000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpRaccoon",
              name: "Raccoon",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦝",
              type: "gardenPetCage",
              sellPrice: 1500000,
              petData: {
                name: "Raccoon",
                collectionRate: 0.15,
                seedTypes: ["gsBloodBanana", "gsMoonMelon", "gsCelestiberry"],
              },
            });
          },
        },
        {
          icon: "🥝",
          name: "Kiwi",
          key: "gpKiwi",
          flavorText: "A fuzzy pet from the Lunar Glow Event.",
          price: 4000000,
          rarity: "Legendary",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpKiwi",
              name: "Kiwi",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🥝",
              type: "gardenPetCage",
              sellPrice: 2000000,
              petData: {
                name: "Kiwi",
                collectionRate: 0.2,
                seedTypes: ["gsMoonMango", "gsNightshade"],
              },
            });
          },
        },
        {
          icon: "🦉",
          name: "Owl",
          key: "gpOwl",
          flavorText: "A wise pet from the Lunar Glow Event.",
          price: 5000000,
          rarity: "Legendary",
          stockChance: 0.15,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpOwl",
              name: "Owl",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦉",
              type: "gardenPetCage",
              sellPrice: 2500000,
              petData: {
                name: "Owl",
                collectionRate: 0.2,
                seedTypes: ["gsMoonflower", "gsStarfruit", "gsMoonglow"],
              },
            });
          },
        },
        {
          icon: "🥝🌑",
          name: "Blood Kiwi",
          key: "gpBloodKiwi",
          flavorText: "A rare pet from the Lunar Glow Event.",
          price: 6000000,
          rarity: "Mythical",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpBloodKiwi",
              name: "Blood Kiwi",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🥝🌑",
              type: "gardenPetCage",
              sellPrice: 3000000,
              petData: {
                name: "Blood Kiwi",
                collectionRate: 0.25,
                seedTypes: ["gsBloodBanana", "gsMoonMelon"],
              },
            });
          },
        },
        {
          icon: "🦔🌑",
          name: "Blood Hedgehog",
          key: "gpBloodHedgehog",
          flavorText: "A fierce pet from the Lunar Glow Event.",
          price: 6000000,
          rarity: "Mythical",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpBloodHedgehog",
              name: "Blood Hedgehog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦔🌑",
              type: "gardenPetCage",
              sellPrice: 3000000,
              petData: {
                name: "Blood Hedgehog",
                collectionRate: 0.25,
                seedTypes: ["gsCelestiberry", "gsMoonMango"],
              },
            });
          },
        },
        {
          icon: "🦉🌑",
          name: "Blood Owl",
          key: "gpBloodOwl",
          flavorText: "A mystical pet from the Lunar Glow Event.",
          price: 6500000,
          rarity: "Mythical",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpBloodOwl",
              name: "Blood Owl",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦉🌑",
              type: "gardenPetCage",
              sellPrice: 3250000,
              petData: {
                name: "Blood Owl",
                collectionRate: 0.25,
                seedTypes: ["gsMoonflower", "gsMoonglow"],
              },
            });
          },
        },
        {
          icon: "🐔💀",
          name: "Chicken Zombie",
          key: "gpChickenZombie",
          flavorText: "A spooky pet from the Lunar Glow Event.",
          price: 7000000,
          rarity: "Divine",
          stockChance: 0.05,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpChickenZombie",
              name: "Chicken Zombie",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐔💀",
              type: "gardenPetCage",
              sellPrice: 3500,
              petData: {
                name: "Chicken Zombie",
                collectionRate: 0.3,
                seedTypes: ["gsNightshade", "gsMoonBlossom"],
              },
            });
          },
        },
        {
          icon: "🌟",
          name: "Night Staff",
          key: "gtNightStaff",
          flavorText: "Boosts Moonlit mutations for Lunar crops.",
          price: 1500,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtNightStaff",
              name: "Night Staff",
              flavorText: "Boosts Moonlit mutations for Lunar crops.",
              icon: "🌟",
              type: "gardenTool",
              sellPrice: 750,
              toolData: {
                growthMultiplier: 1.3,
                mutationChance: { Moonlit: 0.3 },
              },
            });
          },
        },
        {
          icon: "🥚🌙",
          name: "Night Egg",
          key: "gtNightEgg",
          flavorText: "A mysterious egg from the Lunar Glow Event.",
          price: 1000,
          rarity: "Uncommon",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtNightEgg",
              name: "Night Egg",
              flavorText: "A mysterious egg from the Lunar Glow Event.",
              icon: "🥚🌙",
              type: "gardenTool",
              sellPrice: 500,
              toolData: { growthMultiplier: 1.1 },
            });
          },
        },
        {
          icon: "📡",
          name: "Star Caller",
          key: "gtStarCaller",
          flavorText: "Enhances Celestial mutations for Lunar crops.",
          price: 2000,
          rarity: "Rare",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtStarCaller",
              name: "Star Caller",
              flavorText: "Enhances Celestial mutations for Lunar crops.",
              icon: "📡",
              type: "gardenTool",
              sellPrice: 1000,
              toolData: {
                growthMultiplier: 1.2,
                mutationChance: { Celestial: 0.2 },
              },
            });
          },
        },
        // {
        //   icon: "📦",
        //   name: "Mysterious Crate",
        //   key: "gtMysteriousCrate",
        //   flavorText: "A crate of surprises from the Lunar Glow Event.",
        //   price: 2500,
        //   rarity: "Rare",
        //   stockChance: 0.3,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtMysteriousCrate",
        //       name: "Mysterious Crate",
        //       flavorText: "A crate of surprises from the Lunar Glow Event.",
        //       icon: "📦",
        //       type: "gardenTool",
        //       sellPrice: 1250,
        //       toolData: {
        //         seedTypes: ["gsMoonflower", "gsStarfruit", "gsMoonglow"],
        //       },
        //     });
        //   },
        // },
        // {
        //   icon: "🌱🌙",
        //   name: "Night Seed Pack",
        //   key: "gtNightSeedPack",
        //   flavorText: "A pack of lunar seeds from the Lunar Glow Event.",
        //   price: 1500,
        //   rarity: "Rare",
        //   stockChance: 0.4,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtNightSeedPack",
        //       name: "Night Seed Pack",
        //       flavorText: "A pack of lunar seeds from the Lunar Glow Event.",
        //       icon: "🌱🌙",
        //       type: "gardenTool",
        //       sellPrice: 750,
        //       toolData: {
        //         seedTypes: ["gsMoonBlossom", "gsBloodBanana", "gsMoonMelon"],
        //       },
        //     });
        //   },
        // },
      ],
    },
    {
      name: "Blood Moon",
      icon: "🌑",
      effect: {
        mutationChance: 0.2,
        growthMultiplier: 0.8,
        mutationType: "Bloodlit",
      },
      shopItems: [
        {
          icon: "🌹",
          name: "Blood Rose Seed",
          key: "gsBloodRose",
          flavorText: "A rare seed available during Blood Moon!",
          price: 250,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsBloodRose",
              name: "Blood Rose Seed",
              flavorText: "A rare seed from Blood Moon.",
              icon: "🌹",
              type: "gardenSeed",
              sellPrice: 125,
              cropData: {
                baseValue: 500,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 1,
              },
            });
          },
        },
      ],
    },
    {
      name: "Rainy Days",
      icon: "☔",
      effect: {
        mutationChance: 0.3,
        growthMultiplier: 1.5,
        mutationType: "Wet",
      },
      shopItems: [],
    },
  ],
};
