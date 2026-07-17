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
