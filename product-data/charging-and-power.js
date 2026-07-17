(function () {
  function createUgreenChargingProduct(product) {
    const mainItemTitle = product.type === "Desktop Charger" ? "Desktop Charger" : "Wall Charger";

    return {
      id: product.id,
      name: product.name,
      category: "Charging and Power",
      specsLine: product.specsLine,
      priceText: "Insert price here",
      priceNumber: null,
      url: `product.html?product=${product.id}`,
      images: [product.image],
      whoIsThisFor: product.whoIsThisFor,
      specs: [
        ["Product Name", product.name],
        ["Brand", "UGREEN"],
        ["Series", product.series],
        ["Type", product.type],
        ["Total Output", product.totalOutput],
        ["Ports", product.ports],
        ["Technology", product.technology || "GaN fast charging"],
        ...(product.extraSpecs || [])
      ],
      included: [
        {
          title: mainItemTitle,
          text: `The ${product.name} is included as the main product.`
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Documentation",
          text: "Quick-start, safety, or warranty documentation is included when supplied in the official package."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    };
  }

  window.tcsChargingAndPowerProducts = {
    "anker-prime-20k-220w-power-bank-black-myth-wukong-edition": {
      id: "anker-prime-20k-220w-power-bank-black-myth-wukong-edition",
      name: "Anker Prime Power Bank (20K, 220W) Black Myth: Wukong Edition",
      category: "Charging and Power",
      specsLine: "Anker Prime | 20,100mAh | 220W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-prime-20k-220w-power-bank-black-myth-wukong-edition",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1782256183/anker-prime-20k-220w-power-bank-black-myth-wukong-edition-1.jpg"
      ],
      whoIsThisFor: "A limited-edition Anker Prime power bank for users who want high-output USB-C charging, real-time power tracking, and a Black Myth: Wukong collector finish in one compact travel battery.",
      specs: [
        ["Product Name", "Anker Prime Power Bank (20K, 220W) Black Myth: Wukong Edition"],
        ["Model Number", "A110G"],
        ["Brand", "Anker"],
        ["Series", "Anker Prime"],
        ["Type", "Power Bank"],
        ["Edition", "Black Myth: Wukong Limited Edition"],
        ["Total Capacity", "20,100mAh"],
        ["Total Output", "220W Max"],
        ["USB-C Output", "5V⎓3A / 9V⎓3A / 10V⎓2.25A / 12V⎓3A / 15V⎓3A / 20V⎓5A / 28V⎓5A (140W Max)"],
        ["USB-A Output", "5V⎓3A / 9V⎓2A / 10V⎓2.25A / 12V⎓1.5A (22.5W Max)"],
        ["USB-C Input", "5V⎓3A / 9V⎓3A / 12V⎓3A / 15V⎓3A / 20V⎓5A (100W Max)"],
        ["Charging Base Input", "15~25.2V⎓5A (100W Max, charging base sold separately)"],
        ["Ports", "2 x USB-C, 1 x USB-A"],
        ["Charging Technology", "PowerIQ 4.0"],
        ["Safety Monitoring", "ActiveShield 4.0"],
        ["Display", "Smart display with real-time charging details"],
        ["App Support", "Bluetooth monitoring through the Anker app"],
        ["Dimensions", "1.73 x 1.99 x 5.79 in / 44 x 50 x 147 mm"],
        ["Weight", "1.12 lb / 510 g"],
        ["Color", "Black with gold Black Myth: Wukong detailing"]
      ],
      included: [
        {
          title: "Anker Prime Power Bank",
          text: "The Anker Prime Power Bank (20K, 220W) Black Myth: Wukong Edition is included as the main product."
        },
        {
          title: "USB-C Charging Cable",
          text: "A USB-C charging cable is included when supplied with your stock or package. The charging base is sold separately."
        },
        {
          title: "Documentation",
          text: "Quick-start, safety, or warranty documentation is included when supplied in the official package."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "anker-charger-140w-4-port-pd-3-1": {
      id: "anker-charger-140w-4-port-pd-3-1",
      name: "Anker 140W 4-Port PD 3.1 Charger",
      category: "Charging and Power",
      specsLine: "Anker | 4-Port Charger | 140W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-charger-140w-4-port-pd-3-1",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1782261976/anker-charger-140w-4-port-dark-gray-1.jpg"
      ],
      defaultVariant: "dark-gray",
      variantSelectorLabel: "Choose Color",
      variants: [
        {
          id: "dark-gray",
          capacity: "Dark Gray",
          priceText: "Insert price here",
          priceNumber: null,
          images: [
            "https://res.cloudinary.com/dhtamisqn/image/upload/v1782261976/anker-charger-140w-4-port-dark-gray-1.jpg"
          ],
          specs: [
            ["Selected Color", "Dark Gray"],
            ["Color", "Dark Gray"]
          ]
        },
        {
          id: "silver",
          capacity: "Silver",
          priceText: "Insert price here",
          priceNumber: null,
          images: [
            "https://res.cloudinary.com/dhtamisqn/image/upload/v1782261976/anker-charger-140w-4-port-silver-1.jpg"
          ],
          specs: [
            ["Selected Color", "Silver"],
            ["Color", "Silver"]
          ]
        }
      ],
      whoIsThisFor: "A compact high-output wall charger for users who want to fast charge laptops, phones, tablets, handheld devices, and accessories from one 4-port charging brick.",
      specs: [
        ["Product Name", "Anker 140W 4-Port PD 3.1 Charger"],
        ["Model Number", "B2697"],
        ["Brand", "Anker"],
        ["Type", "Wall Charger"],
        ["Total Wattage", "140W Max"],
        ["Ports", "3 x USB-C, 1 x USB-A"],
        ["USB-C1 Output", "Up to 140W"],
        ["USB-C2 Output", "Up to 140W"],
        ["USB-C3 Output", "Up to 40W"],
        ["USB-A Output", "Up to 33W"],
        ["Two-Port Output", "USB-C1 + USB-C2: 70W + 70W"],
        ["Four-Port Output", "Maximum output reduces to 134W when charging four devices"],
        ["Input", "100-240V~, 50 / 60Hz, 2.6A Max"],
        ["Technology", "GaN, PD 3.1"],
        ["Display", "Touchscreen display for power, port status, and temperature"],
        ["Plug", "Foldable plug"],
        ["Dimensions", "2.72 x 2.72 x 1.42 in / 69 x 69 x 36 mm"],
        ["Weight", "13.93 oz / 395 g"],
        ["Available Colors", "Dark Gray, Silver"]
      ],
      included: [
        {
          title: "Wall Charger",
          text: "The selected Anker 140W 4-Port PD 3.1 Charger color variant is included as the main product."
        },
        {
          title: "USB-C Cable",
          text: "A USB-C cable is included with this Anker charger package."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "anker-laptop-power-bank-25k-165w-built-in-and-retractable-cables": {
      id: "anker-laptop-power-bank-25k-165w-built-in-and-retractable-cables",
      name: "Anker Laptop Power Bank 25,000mAh 165W",
      category: "Charging and Power",
      specsLine: "Anker | 25,000mAh | 165W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-laptop-power-bank-25k-165w-built-in-and-retractable-cables",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1782322406/anker-laptop-power-bank-25k-165w-built-in-and-retractable-cables-1.jpg"
      ],
      whoIsThisFor: "A high-capacity portable power bank for laptop users, travelers, students, and anyone who wants built-in USB-C cables without carrying extra charging cables.",
      specs: [
        ["Product Name", "Anker Laptop Power Bank 25,000mAh 165W"],
        ["Brand", "Anker"],
        ["Type", "Power Bank"],
        ["Capacity", "25,000mAh / 90Wh"],
        ["Total Output", "Up to 165W"],
        ["Single USB-C Output", "Up to 100W"],
        ["Multi-Device Output", "Up to 130W when charging three or four devices"],
        ["Ports", "2 built-in USB-C cables, 1 USB-C port, 1 USB-A port"],
        ["Built-In Cable", "Retractable USB-C cable up to 2.3 ft"],
        ["Carry Cable", "Second built-in USB-C cable doubles as a lanyard-style cable"],
        ["Display", "Screen for battery level, power output, temperature, and battery health"],
        ["Passthrough Charging", "Supported through the built-in USB-C cables"],
        ["Airline Friendly", "Carry-on compliant at under 100Wh"],
        ["Weight", "About 600g"]
      ],
      included: [
        {
          title: "Power Bank",
          text: "The Anker Laptop Power Bank 25K 165W is included as the main product."
        },
        {
          title: "Built-In USB-C Cables",
          text: "The product includes its built-in retractable USB-C cable and second built-in USB-C cable."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "anker-prime-charger-250w-6-ports-ganprime": {
      id: "anker-prime-charger-250w-6-ports-ganprime",
      name: "Anker Prime 250W 6-Port Charger GANprime",
      category: "Charging and Power",
      specsLine: "Anker Prime | 6-Port Charger | 250W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-prime-charger-250w-6-ports-ganprime",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1782322407/anker-prime-charger-250w-6-ports-ganprime-1.jpg"
      ],
      whoIsThisFor: "A powerful desktop charging station for users who want to charge laptops, phones, tablets, earbuds, and accessories from one compact multi-port charger.",
      specs: [
        ["Product Name", "Anker Prime Charger (250W, 6 Ports, GaNPrime)"],
        ["Brand", "Anker"],
        ["Series", "Anker Prime"],
        ["Type", "Desktop Charger"],
        ["Total Output", "250W"],
        ["Ports", "4 x USB-C, 2 x USB-A"],
        ["USB-C1 Output", "Up to 140W"],
        ["USB-C2 / USB-C3 / USB-C4 Output", "Up to 100W each"],
        ["USB-A Output", "Up to 22.5W each"],
        ["Display", "2.26-inch LCD for real-time charging information"],
        ["Controls", "Smart control dial"],
        ["Charging Modes", "AI Power Mode, Port Priority Mode, Dual-Laptop Mode, Low Current Mode"],
        ["App Support", "Bluetooth monitoring and control through the Anker app"],
        ["Technology", "GaNPrime"],
        ["Use Case", "Desktop charging for laptops and multiple mobile devices"]
      ],
      included: [
        {
          title: "Desktop Charger",
          text: "The Anker Prime Charger 250W 6-Port GaNPrime unit is included as the main product."
        },
        {
          title: "Power Cable",
          text: "A power cable is included when supplied with the official package."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

        "anker-prime-docking-station-14-in-1-triple-display-displaylink-dl7400-black-myth-wukong-edition": {
      id: "anker-prime-docking-station-14-in-1-triple-display-displaylink-dl7400-black-myth-wukong-edition",
      name: "Anker Prime DisplayLink Dock 14-in-1: Black Myth: Wukong Edition",
      category: "Charging and Power",
      specsLine: "Anker Prime | 14-in-1 Dock | Triple Display",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-prime-docking-station-14-in-1-triple-display-displaylink-dl7400-black-myth-wukong-edition",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1782322406/anker-prime-docking-station-14-in-1-triple-display-displaylink-dl7400-black-myth-wukong-edition-1.jpg"
      ],
      whoIsThisFor: "A premium workstation dock for laptop users who need triple-display output, fast wired networking, card readers, USB expansion, and high-wattage laptop charging from one desktop hub.",
      specs: [
        ["Product Name", "Anker Prime DisplayLink Dock 14-in-1: Black Myth: Wukong Edition"],
        ["Brand", "Anker"],
        ["Series", "Anker Prime"],
        ["Type", "Docking Station"],
        ["Model", "DL7400"],
        ["Total Ports", "14"],
        ["Display Support", "Up to three external displays"],
        ["Display Outputs", "2 x HDMI, 1 x DisplayPort"],
        ["Maximum Display Output", "Up to one 8K display or multiple 4K displays, depending on device support"],
        ["Host Connection", "USB-C upstream with up to 140W laptop charging"],
        ["Data Speed", "Up to 10Gbps on supported USB-C connections"],
        ["Network", "2.5Gb Ethernet"],
        ["Card Readers", "SD and TF / microSD card slots"],
        ["Audio", "Headphone / microphone combo jack"],
        ["Cooling", "Built-in cooling with ActiveShield 3.0 temperature monitoring"],
        ["Display", "Front digital display for charging and connection status"],
        ["Edition", "Black Myth: Wukong Edition"],
        ["Dimensions", "About 7.7 x 3.6 x 1.9 in / 195 x 92 x 48 mm"]
      ],
      included: [
        {
          title: "Docking Station",
          text: "The Anker Prime Docking Station 14-in-1 DL7400 Black Myth: Wukong Edition is included as the main product."
        },
        {
          title: "Host Cable",
          text: "A USB-C host cable is included when supplied with the official package."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "anker-nano-charger-45w-smart-display-180-foldable": {
      id: "anker-nano-charger-45w-smart-display-180-foldable",
      name: "Anker Nano Charger (45W, Smart Display, 180-Degree Foldable)",
      category: "Charging and Power",
      specsLine: "Anker Nano | 45W | Smart Display",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-nano-charger-45w-smart-display-180-foldable",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324900/anker-nano-charger-45w-smart-display-180-orange-1.jpg"],
      defaultVariant: "orange",
      variantSelectorLabel: "Choose Color",
      variants: [
        {
          id: "orange",
          capacity: "Orange",
          priceText: "Insert price here",
          priceNumber: null,
          images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324900/anker-nano-charger-45w-smart-display-180-orange-1.jpg"],
          specs: [["Selected Color", "Orange"], ["Color", "Orange"]]
        },
        {
          id: "aurora-white",
          capacity: "Aurora White",
          priceText: "Insert price here",
          priceNumber: null,
          images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324899/anker-nano-charger-45w-smart-display-180-foldable-aurora-white-1.jpg"],
          specs: [["Selected Color", "Aurora White"], ["Color", "Aurora White"]]
        },
        {
          id: "black-stone",
          capacity: "Black Stone",
          priceText: "Insert price here",
          priceNumber: null,
          images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324894/anker-nano-charger-45w-smart-display-180-foldable-black-stone-1.jpg"],
          specs: [["Selected Color", "Black Stone"], ["Color", "Black Stone"]]
        },
        {
          id: "misty-blue",
          capacity: "Misty Blue",
          priceText: "Insert price here",
          priceNumber: null,
          images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324891/anker-nano-charger-45w-smart-display-180-misty-blue-1.jpg"],
          specs: [["Selected Color", "Misty Blue"], ["Color", "Misty Blue"]]
        }
      ],
      whoIsThisFor: "A compact smart-display USB-C wall charger for phones, tablets, earbuds, and travel setups where a small 45W charger with live charging information is useful.",
      specs: [
        ["Product Name", "Anker Nano Charger (45W, Smart Display, 180-Degree Foldable)"],
        ["Model Number", "A121D"],
        ["Brand", "Anker"],
        ["Type", "Wall Charger"],
        ["Total Output", "45W Max"],
        ["Port", "1 x USB-C"],
        ["Input", "100-240V~ 50 / 60Hz, 1.5A Max"],
        ["Output", "5V=3A / 9V=3A / 15V=3A / 20V=2.25A"],
        ["Display", "Smart display for wattage, temperature, charging status, and animations"],
        ["Plug", "Dual foldable prongs with 90-degree and 180-degree positioning"],
        ["Safety", "ActiveShield 5.0"],
        ["Dimensions", "1.34 x 1.40 x 1.57 in / 34 x 35.5 x 40 mm"],
        ["Weight", "2.65 oz / 75 g"],
        ["Available Colors", "Orange, Aurora White, Black Stone, Misty Blue"],
        ["Cable Included", "No charging cable included"]
      ],
      included: [
        { title: "Wall Charger", text: "The selected Anker Nano Charger 45W color variant is included as the main product." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Documentation", text: "Quick-start, safety, or warranty documentation is included when supplied in the official package." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "anker-prime-tb5-docking-station-14-in-1-8k-thunderbolt-5": {
      id: "anker-prime-tb5-docking-station-14-in-1-8k-thunderbolt-5",
      name: "Anker Prime TB5 Docking Station (14-in-1, 8K, Thunderbolt 5)",
      category: "Charging and Power",
      specsLine: "Anker Prime | 14-in-1 Dock | Thunderbolt 5",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-prime-tb5-docking-station-14-in-1-8k-thunderbolt-5",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324896/anker-prime-tb5-docking-station-14-in-1-8k-thunderbolt-5-1.jpg"],
      whoIsThisFor: "A premium Thunderbolt 5 dock for power users, creators, and laptop workstations that need high-speed data, dual 8K display support, Ethernet, card readers, and laptop charging.",
      specs: [
        ["Product Name", "Anker Prime TB5 Docking Station (14-in-1, 8K, Thunderbolt 5)"],
        ["Brand", "Anker"],
        ["Series", "Anker Prime"],
        ["Type", "Docking Station"],
        ["Total Ports", "14"],
        ["Host Connection", "Thunderbolt 5 USB-C upstream"],
        ["Host Charging", "Up to 140W"],
        ["Downstream Thunderbolt", "2 x Thunderbolt 5 USB-C"],
        ["Thunderbolt Data Speed", "Up to 120Gbps with supported systems"],
        ["Display Support", "Up to dual 8K displays, host dependent"],
        ["Display Outputs", "Thunderbolt 5, HDMI 2.1, DisplayPort 2.1"],
        ["Network", "2.5Gb Ethernet"],
        ["Card Readers", "SD and TF / microSD"],
        ["Audio", "3.5mm audio jack"],
        ["Front Charging", "USB-C front ports support up to 45W combined"],
        ["Dimensions", "4.6 x 4.6 x 3.0 in / 116 x 116 x 75 mm"],
        ["Weight", "38 oz / 1,086 g"]
      ],
      included: [
        { title: "Docking Station", text: "The Anker Prime TB5 14-in-1 Docking Station is included as the main product." },
        { title: "Thunderbolt 5 Cable", text: "A Thunderbolt 5 USB-C cable is included when supplied with the official package." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "anker-nano-charger-30w": {
      id: "anker-nano-charger-30w",
      name: "Anker Nano Charger (30W)",
      category: "Charging and Power",
      specsLine: "Anker Nano | USB-C | 30W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-nano-charger-30w",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324897/anker-nano-charger-30w-1.jpg"],
      whoIsThisFor: "A tiny USB-C wall charger for phones, tablets, earbuds, and everyday travel charging.",
      specs: [
        ["Product Name", "Anker Nano Charger (30W)"],
        ["Brand", "Anker"],
        ["Series", "Anker Nano"],
        ["Type", "Wall Charger"],
        ["Total Output", "30W"],
        ["Port", "1 x USB-C"],
        ["Plug", "Foldable prongs"],
        ["Safety Certification", "TUV Rheinland certified"],
        ["Weight", "About 0.08 lb / 36 g"],
        ["Use Case", "Phones, tablets, earbuds, handheld devices, and compact travel charging"]
      ],
      included: [
        { title: "Wall Charger", text: "The Anker Nano Charger 30W is included as the main product." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Documentation", text: "Quick-start, safety, or warranty documentation is included when supplied in the official package." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "anker-735-charger-nano-ii-65w": {
      id: "anker-735-charger-nano-ii-65w",
      name: "Anker 735 Charger (Nano II 65W)",
      category: "Charging and Power",
      specsLine: "Anker | 3-Port Charger | 65W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-735-charger-nano-ii-65w",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324896/anker-735-charger-nano-ii-65w-1.jpg"],
      whoIsThisFor: "A compact 3-port charger for users who want one travel charger for a laptop, phone, and accessories.",
      specs: [
        ["Product Name", "Anker 735 Charger (Nano II 65W)"],
        ["Brand", "Anker"],
        ["Series", "Nano II"],
        ["Type", "Wall Charger"],
        ["Total Output", "65W"],
        ["Ports", "2 x USB-C, 1 x USB-A"],
        ["USB-A Output", "Up to 22.5W"],
        ["Power Distribution", "Automatically adjusts output when multiple devices are connected"],
        ["Plug", "Foldable prongs"],
        ["Use Case", "Phones, tablets, USB-C laptops, earbuds, keyboards, mice, and travel charging"]
      ],
      included: [
        { title: "Wall Charger", text: "The Anker 735 Charger Nano II 65W is included as the main product." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Documentation", text: "Quick-start, safety, or warranty documentation is included when supplied in the official package." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "anker-prime-charging-docking-station-14-in-1-dual-display-160w": {
      id: "anker-prime-charging-docking-station-14-in-1-dual-display-160w",
      name: "Anker Prime Charging Docking Station (14-in-1, Dual Display, 160W)",
      category: "Charging and Power",
      specsLine: "Anker Prime | 14-in-1 Dock | 160W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-prime-charging-docking-station-14-in-1-dual-display-160w",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1782324902/anker-prime-charging-docking-station-14-in-1-dual-display-160w-1.jpg"],
      whoIsThisFor: "A desktop charging dock for laptop users who want one station for dual display output, USB expansion, and high-wattage charging.",
      specs: [
        ["Product Name", "Anker Prime Charging Docking Station (14-in-1, Dual Display, 160W)"],
        ["Brand", "Anker"],
        ["Series", "Anker Prime"],
        ["Type", "Charging Docking Station"],
        ["Total Ports", "14"],
        ["Total Charging Output", "160W"],
        ["Display Support", "Dual display"],
        ["Power Cable", "Built-in / unremovable power cable"],
        ["Use Case", "Laptop docking, desktop charging, display expansion, and multi-device workstation setups"]
      ],
      included: [
        { title: "Charging Docking Station", text: "The Anker Prime Charging Docking Station 14-in-1 Dual Display 160W is included as the main product." },
        { title: "Built-In Power Cable", text: "The unit includes its built-in power cable." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "anker-prime-thunderbolt-5-cable-80gbps-240w": {
      id: "anker-prime-thunderbolt-5-cable-80gbps-240w",
      name: "Anker Prime Thunderbolt 5 Cable (80Gbps, 240W)",
      category: "Charging and Power",
      specsLine: "Anker Prime | Thunderbolt 5 Cable | 240W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-prime-thunderbolt-5-cable-80gbps-240w",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1783115889/anker-prime-thunderbolt-5-cable-80gbps-240w-1.jpg"],
      whoIsThisFor: "A premium Thunderbolt 5 cable for users who want high-speed USB-C data, 240W charging, and powerful display or dock connections from one cable.",
      specs: [
        ["Product Name", "Anker Prime Thunderbolt 5 Cable"],
        ["Brand", "Anker"],
        ["Series", "Anker Prime"],
        ["Type", "Thunderbolt 5 Cable"],
        ["Connector", "USB-C to USB-C"],
        ["Data Transfer", "Up to 80Gbps"],
        ["Charging", "Up to 240W"],
        ["Cable Length Options", "3.3 ft / 1.7 ft, depending on selected version"],
        ["Use Case", "Thunderbolt docks, USB-C laptops, high-speed storage, displays, and fast charging"]
      ],
      included: [
        { title: "Thunderbolt 5 Cable", text: "The Anker Prime Thunderbolt 5 Cable is included as the main product." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Documentation", text: "Quick-start, safety, or warranty documentation is included when supplied in the official package." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "anker-maggo-10000mah-power-bank": {
      id: "anker-maggo-10000mah-power-bank",
      name: "Anker MagGo Power Bank (10K, Slim)",
      category: "Charging and Power",
      specsLine: "Anker MagGo | 10,000mAh | 30W",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=anker-maggo-10000mah-power-bank",
      images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1783116115/anker-maggo-10000mah-power-bank-1.jpg"],
      defaultVariant: "black",
      variantSelectorLabel: "Choose Color",
      variants: [
        {
          id: "black",
          capacity: "Black",
          priceText: "Insert price here",
          priceNumber: null,
          images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1783116115/anker-maggo-10000mah-power-bank-1.jpg"],
          specs: [["Selected Color", "Black"], ["Color", "Black"]]
        },
        {
          id: "white",
          capacity: "White",
          priceText: "Insert price here",
          priceNumber: null,
          images: ["https://res.cloudinary.com/dhtamisqn/image/upload/v1783116603/anker-maggo-10000mah-power-bank-white-1.jpg"],
          specs: [["Selected Color", "White"], ["Color", "White"]]
        }
      ],
      whoIsThisFor: "A slim magnetic power bank for iPhone users who want 10,000mAh portable charging, wireless MagSafe-style charging, and faster USB-C charging in a pocket-friendly design.",
      specs: [
        ["Product Name", "Anker MagGo Power Bank (10K, Slim)"],
        ["Brand", "Anker"],
        ["Series", "MagGo"],
        ["Type", "Power Bank"],
        ["Capacity", "10,000mAh"],
        ["Wireless Charging", "Up to 15W"],
        ["USB-C Charging", "Up to 30W"],
        ["Connector", "USB-C"],
        ["Magnetic Charging", "MagSafe-style magnetic wireless charging"],
        ["Dimensions", "0.58 x 2.78 x 4.09 in"],
        ["Use Case", "iPhone wireless charging, travel, everyday carry, and USB-C device charging"],
        ["Available Colors", "Black, White"]
      ],
      included: [
        { title: "Power Bank", text: "The selected Anker MagGo Power Bank color variant is included as the main product." },
        { title: "USB-C Cable", text: "A USB-C cable is included when supplied with the official package." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

        "ugreen-nexode-65w-3-port-gan-fast-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-65w-3-port-gan-fast-charger",
      name: "UGREEN Nexode Charger GaN Fast 3-Port 65W",
      series: "Nexode",
      type: "Wall Charger",
      specsLine: "UGREEN Nexode | 3-Port | 65W",
      totalOutput: "65W Max",
      ports: "2 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397625/UGREEN_Nexode_Charger_GaN_Fast_3-Port_65W.jpg",
      whoIsThisFor: "A compact GaN wall charger for users who want one 65W charger for phones, tablets, USB-C laptops, handheld devices, and everyday accessories.",
      extraSpecs: [["Single-Port Output", "Up to 65W"], ["Power Distribution", "Automatically adjusts output across connected devices"], ["Safety", "Built-in protection for overcurrent, overvoltage, overheating, and short circuit"]]
    }),

    "ugreen-uno-charger-65w-black": createUgreenChargingProduct({
      id: "ugreen-uno-charger-65w-black",
      name: "UGREEN Uno Charger 65W Black",
      series: "Uno",
      type: "Wall Charger",
      specsLine: "UGREEN Uno | 3-Port | 65W",
      totalOutput: "65W Max",
      ports: "2 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397624/UGREEN_Uno_Charger_65W_Black.jpg",
      whoIsThisFor: "A playful compact charger for users who want 65W laptop and phone charging with a charging-status LED face.",
      extraSpecs: [["Display", "LED face reacts to charging status"], ["Color", "Black"], ["Safety", "GaN charging with built-in protection features"]]
    }),

    "ugreen-nexode-100w-4-port-gan-fast-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-100w-4-port-gan-fast-charger",
      name: "UGREEN Nexode Charger GaN Fast 4-Port 100W",
      series: "Nexode",
      type: "Wall Charger",
      specsLine: "UGREEN Nexode | 4-Port | 100W",
      totalOutput: "100W Max",
      ports: "3 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397624/UGREEN_Nexode_Charger_GaN_Fast_4-Port_100W.jpg",
      whoIsThisFor: "A 100W multi-port charger for charging a USB-C laptop, phone, tablet, earbuds, and accessories from one wall charger.",
      extraSpecs: [["Single-Port Output", "Up to 100W"], ["Input", "100-240V~ 50/60Hz"], ["Protection", "Overcurrent, overvoltage, overheating, and short-circuit protection"]]
    }),

    "ugreen-zapix-200w-8-port-gan-desktop-fast-charger": createUgreenChargingProduct({
      id: "ugreen-zapix-200w-8-port-gan-desktop-fast-charger",
      name: "UGREEN Zapix Charger GaN Desktop Fast 8-Port 200W",
      series: "Zapix",
      type: "Desktop Charger",
      specsLine: "UGREEN Zapix | 8-Port | 200W",
      totalOutput: "200W Max",
      ports: "8 total charging ports",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397623/UGREEN_Zapix_Charger_GaN_Desktop_Fast_8-port_200W.jpg",
      whoIsThisFor: "A desktop charging hub for desks, family setups, and workstations that need many devices connected at the same time.",
      extraSpecs: [["Use Case", "Multi-device desktop charging"], ["Power Input", "AC power cord"], ["Safety", "GaN charging with built-in protection features"]]
    }),

    "ugreen-nexode-100w-4-port-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-100w-4-port-charger",
      name: "UGREEN Nexode Charger 4-Port 100W",
      series: "Nexode",
      type: "Wall Charger",
      specsLine: "UGREEN Nexode | 4-Port | 100W",
      totalOutput: "100W Max",
      ports: "3 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397621/UGREEN_Nexode_Charger_4-Port_100W.jpg",
      whoIsThisFor: "A four-port 100W charger for users who want one compact charger for a laptop and several mobile devices.",
      extraSpecs: [["Single-Port Output", "Up to 100W"], ["Input", "100-240V~ 50/60Hz"], ["Color", "Black"]]
    }),

    "ugreen-nexode-200w-6-port-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-200w-6-port-charger",
      name: "UGREEN Nexode Charger 6-Port 200W",
      series: "Nexode",
      type: "Desktop Charger",
      specsLine: "UGREEN Nexode | 6-Port | 200W",
      totalOutput: "200W Max",
      ports: "6 total charging ports",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397612/UGREEN_Nexode_Charger_6-Port_200W.jpg",
      whoIsThisFor: "A multi-port desktop charger for users who want to charge multiple laptops, phones, tablets, and accessories from one station.",
      extraSpecs: [["Use Case", "Desktop multi-device charging"], ["Power Input", "AC power cord"], ["Safety", "GaN charging with built-in protection features"]]
    }),

    "ugreen-nexode-500w-6-port-desktop-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-500w-6-port-desktop-charger",
      name: "UGREEN Nexode Charger Desktop 6-Port 500W",
      series: "Nexode",
      type: "Desktop Charger",
      specsLine: "UGREEN Nexode | 6-Port | 500W",
      totalOutput: "500W Max",
      ports: "5 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397617/UGREEN_Nexode_Charger_Desktop_6-Port_500W.jpg",
      whoIsThisFor: "A high-output desktop charger for demanding workstations, shared desks, gaming laptops, USB-C laptops, and many mobile devices.",
      extraSpecs: [["USB-C1 Output", "Up to 240W"], ["USB-C2/C3/C4/C5 Output", "Up to 100W each"], ["USB-A Output", "Up to 20W"], ["Dimensions", "146 x 114.6 x 60.6 mm"], ["Weight", "2207 g"]]
    }),

    "ugreen-nexode-pro-100w-3-port-gan-fast-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-pro-100w-3-port-gan-fast-charger",
      name: "UGREEN Nexode Pro Charger GaN Fast 3-Port 100W",
      series: "Nexode Pro",
      type: "Wall Charger",
      specsLine: "UGREEN Nexode Pro | 3-Port | 100W",
      totalOutput: "100W Max",
      ports: "2 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397615/UGREEN_Nexode_Pro_Charger_GaN_Fast_3-Port_100W.jpg",
      whoIsThisFor: "A compact 100W charger for users who want fast charging for a USB-C laptop plus two smaller devices.",
      extraSpecs: [["Single-Port Output", "Up to 100W"], ["Compatibility", "USB-C laptops, tablets, phones, handheld devices, and accessories"], ["Safety", "Built-in multi-level charging protection"]]
    }),

    "ugreen-uno-charger-100w": createUgreenChargingProduct({
      id: "ugreen-uno-charger-100w",
      name: "UGREEN Uno Charger 100W",
      series: "Uno",
      type: "Wall Charger",
      specsLine: "UGREEN Uno | 4-Port | 100W",
      totalOutput: "100W Max",
      ports: "3 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397616/UGREEN_Uno_Charger_100W.jpg",
      whoIsThisFor: "A playful high-output charger for users who want 100W laptop charging, four ports, and a charging-status face display.",
      extraSpecs: [["Display", "Animated face display for charging status"], ["Single-Port Output", "Up to 100W"], ["Dimensions", "About 52.1 x 49 x 82 mm"]]
    }),

        "ugreen-nexode-300w-5-port-desktop-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-300w-5-port-desktop-charger",
      name: "UGREEN Nexode Charger Desktop 5-Port 300W",
      series: "Nexode",
      type: "Desktop Charger",
      specsLine: "UGREEN Nexode | 5-Port | 300W",
      totalOutput: "300W Max",
      ports: "4 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397611/UGREEN_Nexode_Charger_Desktop_5-port_300W.jpg",
      whoIsThisFor: "A powerful desktop charger for users who want to charge several laptops and mobile devices from one compact station.",
      extraSpecs: [["Laptop Charging", "Smart 140W, 100W, and 60W distribution across USB-C ports"], ["Included Cable", "240W charging cable on official package"], ["Dimensions", "3.6 x 2 x 4.3 inches"]]
    }),

    "ugreen-nexode-200w-4-port-gan-fast-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-200w-4-port-gan-fast-charger",
      name: "UGREEN Nexode Charger GaN Fast 4-Port 200W",
      series: "Nexode",
      type: "Wall Charger",
      specsLine: "UGREEN Nexode | 4-Port | 200W",
      totalOutput: "200W Max",
      ports: "3 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397611/UGREEN_Nexode_Charger_GaN_Fast_4-Port_200W.jpg",
      whoIsThisFor: "A high-output charger for users who want strong multi-device charging, including two laptop-class USB-C devices.",
      extraSpecs: [["Single-Port Output", "Up to 140W"], ["Dual-Laptop Charging", "Two USB-C ports can each provide up to 100W"], ["Color", "Space Gray"]]
    }),

    "ugreen-zapix-65w-5-port-gan-fast-charger": createUgreenChargingProduct({
      id: "ugreen-zapix-65w-5-port-gan-fast-charger",
      name: "UGREEN Zapix Charger GaN Fast 5-Port 65W",
      series: "Zapix",
      type: "Wall Charger",
      specsLine: "UGREEN Zapix | 5-Port | 65W",
      totalOutput: "65W Max",
      ports: "5 total charging ports",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397609/UGREEN_Zapix_Charger_GaN_Fast_5-port_65W.jpg",
      whoIsThisFor: "A multi-port 65W charger for users who want many everyday devices connected without needing a large desktop station.",
      extraSpecs: [["Use Case", "Phones, tablets, earbuds, smartwatches, and compact USB-C devices"], ["Technology", "GaN fast charging"], ["Safety", "Built-in protection features"]]
    }),

    "ugreen-nexode-pro-65w-3-port-gan-fast-charger": createUgreenChargingProduct({
      id: "ugreen-nexode-pro-65w-3-port-gan-fast-charger",
      name: "UGREEN Nexode Pro Charger GaN Fast 3-Port 65W",
      series: "Nexode Pro",
      type: "Wall Charger",
      specsLine: "UGREEN Nexode Pro | 3-Port | 65W",
      totalOutput: "65W Max",
      ports: "2 x USB-C, 1 x USB-A",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397608/UGREEN_Nexode_Pro_Charger_GaN_Fast_3-Port_65W.jpg",
      whoIsThisFor: "A slim 65W charger for travel, desk setups, and users who want laptop-class charging from a small multi-port charger.",
      extraSpecs: [["Input Voltage", "100-240V AC"], ["Total USB Ports", "3"], ["Color", "Black"]]
    }),

    "ugreen-zapix-100w-6-port-gan-desktop-fast-charger": createUgreenChargingProduct({
      id: "ugreen-zapix-100w-6-port-gan-desktop-fast-charger",
      name: "UGREEN Zapix Charger GaN Desktop Fast 6-Port 100W",
      series: "Zapix",
      type: "Desktop Charger",
      specsLine: "UGREEN Zapix | 6-Port | 100W",
      totalOutput: "100W Max",
      ports: "6 total charging ports",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397604/UGREEN_Zapix_Charger_GaN_Desktop_Fast_6-port_100W.jpg",
      whoIsThisFor: "A desktop charging hub for users who want one station for phones, tablets, earbuds, smartwatches, and light USB-C laptop charging.",
      extraSpecs: [["Use Case", "Desktop multi-device charging"], ["Technology", "GaN fast charging"], ["Safety", "Built-in protection features"]]
    }),

    "ugreen-cable-usb-c-100w": createUgreenChargingProduct({
      id: "ugreen-cable-usb-c-100w",
      name: "UGREEN Cable USB-C 100W",
      series: "USB-C Cable",
      type: "Charging Cable",
      specsLine: "UGREEN | Charging Cable | 100W",
      totalOutput: "100W Max",
      ports: "USB-C to USB-C",
      technology: "USB-C Power Delivery charging",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1783115238/UGREEN_Cable_USB-C_100W.jpg",
      whoIsThisFor: "A USB-C charging cable for users who want up to 100W fast charging for USB-C phones, tablets, laptops, handhelds, and everyday accessories.",
      extraSpecs: [["Connector", "USB-C to USB-C"], ["Charging", "Up to 100W"], ["Use Case", "Phones, tablets, USB-C laptops, handheld devices, and everyday charging"]]
    }),

    "ugreen-usb-c-gen4-240w-80gbps-usb-4": createUgreenChargingProduct({
      id: "ugreen-usb-c-gen4-240w-80gbps-usb-4",
      name: "UGREEN Cable USB-C Gen4 240W (80Gbps, USB 4.0, 16K/8K 60Hz)",
      series: "USB-C Gen4",
      type: "Charging Cable",
      specsLine: "UGREEN | USB4 Cable | 240W",
      totalOutput: "240W Max",
      ports: "USB-C to USB-C",
      technology: "USB4 / USB-C Gen4",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1783116250/ugreen-usb-c-gen4-240w-80gbps-usb-4.jpg",
      whoIsThisFor: "A high-performance USB-C cable for users who want 240W charging, 80Gbps data transfer, and high-resolution display support from one cable.",
      extraSpecs: [["Data Transfer", "Up to 80Gbps"], ["Video Output", "Up to 16K / 8K 60Hz, device dependent"], ["Charging", "Up to 240W"], ["Connector", "USB-C to USB-C"]]
    }),

    "ugreen-uno-usb-c-to-usb-c-cable-100w": createUgreenChargingProduct({
      id: "ugreen-uno-usb-c-to-usb-c-cable-100w",
      name: "UGREEN Uno Cable USB-C to USB-C 100W",
      series: "Uno",
      type: "Charging Cable",
      specsLine: "UGREEN Uno | Charging Cable | 100W",
      totalOutput: "100W Max",
      ports: "USB-C to USB-C",
      technology: "USB-C Power Delivery charging",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1783116382/ugreen-uno-usb-c-to-usb-c-cable-100w-1.jpg",
      whoIsThisFor: "A playful USB-C cable for charging phones, tablets, USB-C laptops, Steam Deck, and everyday devices with a durable Uno-style design.",
      extraSpecs: [["Data Transfer", "Up to 480Mbps"], ["Chip", "E-marker chip"], ["Compatibility", "Phones, tablets, laptops, Steam Deck, CarPlay, and Android Auto"], ["Connector", "USB-C to USB-C"]]
    }),

    "ugreen-usb-c-to-usb-c-right-angle-2m-100w": createUgreenChargingProduct({
      id: "ugreen-usb-c-to-usb-c-right-angle-2m-100w",
      name: "UGREEN USB-C to USB-C Right Angle 2M 100W Cable",
      series: "Right Angle USB-C",
      type: "Charging Cable",
      specsLine: "UGREEN | 2M Cable | 100W",
      totalOutput: "100W Max",
      ports: "USB-C to USB-C",
      technology: "USB-C Power Delivery charging",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1783116708/ugreen-usb-c-to-usb-c-right-angle-2m-100w-1.jpg",
      whoIsThisFor: "A right-angle USB-C cable for desk setups, gaming handhelds, phones, tablets, and laptops where a 90-degree connector helps cable routing.",
      extraSpecs: [["Cable Length", "2M"], ["Charging", "100W / 5A"], ["Connector", "USB-C to USB-C right angle"], ["Use Case", "Fast charging with cleaner cable routing"]]
    }),
  };
}());
