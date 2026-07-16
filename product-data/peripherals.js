(function () {
  function createUgreenNasProduct(product) {
    return {
      id: product.id,
      name: product.name,
      category: "NAS Storage",
      specsLine: product.specsLine,
      priceText: "Insert price here",
      priceNumber: null,
      url: `product.html?product=${product.id}`,
      images: [product.image],
      whoIsThisFor: product.whoIsThisFor,
      specs: [
        ["Product Name", product.name],
        ["Accessory Type", "NAS Storage"],
        ["Brand", "UGREEN"],
        ["Series", "NASync"],
        ["Model", product.model],
        ["Drive Bays", product.driveBays],
        ["Maximum Storage", product.maximumStorage],
        ["Processor", product.processor],
        ["Memory", product.memory],
        ["Networking", product.networking],
        ["Ports", product.ports],
        ["Operating System", "UGOS Pro"],
        ...(product.extraSpecs || [])
      ],
      included: [
        {
          title: "NAS Unit",
          text: `The ${product.name} diskless NAS enclosure is included as the main accessory. Storage drives are sold separately unless your stock package says otherwise.`
        },
        {
          title: "Power Adapter",
          text: "A compatible power adapter is included when supplied with the official package."
        },
        {
          title: "Ethernet Cable and Accessories",
          text: "Ethernet cable, drive screws, tray keys, or setup accessories are included when supplied with the official package."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, setup guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    };
  }

  window.tcsPeripheralProducts = {
    "corsair-icue-link-rx120-rgb": {
      id: "corsair-icue-link-rx120-rgb",
      name: "Corsair iCUE LINK RX120 RGB 120mm PWM Fan",
      category: "Case Fan",
      specsLine: "Corsair | Case Fan | RGB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=corsair-icue-link-rx120-rgb",
      images: Array.from({ length: 3 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783159222/corsair-icue-link-rx120-rgb-140mm-triple-pack-${imageNumber}.jpg`;
      }),
      defaultVariant: "triple-pack",
      variantSelectorLabel: "Choose Pack",
      variants: [
        {
          id: "triple-pack",
          capacity: "Triple Pack",
          priceText: "Insert price here",
          priceNumber: null,
          images: Array.from({ length: 3 }, (_, index) => {
            const imageNumber = index + 1;
            return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783159222/corsair-icue-link-rx120-rgb-140mm-triple-pack-${imageNumber}.jpg`;
          }),
          specs: [
            ["Selected Pack", "Triple Pack"],
            ["Included Fans", "3 x 120mm RGB fans"]
          ]
        },
        {
          id: "single-pack",
          capacity: "Single Pack",
          priceText: "Insert price here",
          priceNumber: null,
          images: Array.from({ length: 3 }, (_, index) => {
            const imageNumber = index + 1;
            return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783159225/corsair-icue-link-rx120-rgb-140mm-single-pack-${imageNumber}.jpg`;
          }),
          specs: [
            ["Selected Pack", "Single Pack"],
            ["Included Fans", "1 x 120mm RGB fan"]
          ]
        }
      ],
      whoIsThisFor: "For builders who want clean iCUE LINK cable management, RGB lighting, PWM control, and strong 120mm case fan cooling.",
      specs: [
        ["Product Name", "iCUE LINK RX120 RGB 120mm PWM Fan"],
        ["Accessory Type", "Case Fan"],
        ["Brand", "Corsair"],
        ["Fan Size", "120mm"],
        ["Lighting", "RGB"],
        ["Control", "PWM"],
        ["Connection Design", "iCUE LINK single-cable ecosystem"],
        ["Fan Speed", "Up to 2100 RPM"],
        ["Fan Airflow", "Up to 74.2 CFM"],
        ["Fan Air Pressure", "Up to 4.38 mmH2O"],
        ["Noise Level", "Up to 36 dBA"],
        ["Bearing Type", "Magnetic Dome"],
        ["Dimensions", "120 x 120 x 25mm"],
        ["Software Support", "Corsair iCUE"]
      ],
      included: [
        { title: "Case Fan Pack", text: "The Corsair iCUE LINK RX120 RGB is included in the selected pack option, inspected and prepared for the order." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes." },
        { title: "Included Accessories", text: "Included accessories depend on the selected official fan package contents and may include iCUE LINK accessories, mounting screws, documentation, and required package cables supplied by Corsair." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "razer-huntsman-v3-pro-mini": {
      id: "razer-huntsman-v3-pro-mini",
      name: "Razer Huntsman V3 Pro Mini",
      category: "Keyboard",
      specsLine: "Razer | Keyboard | Wired",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-huntsman-v3-pro-mini",
      images: Array.from({ length: 3 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349863/razer-huntsman-v3-pro-mini-rgb-wired-mini-keyboard-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive gamers who want a compact, fast, and responsive keyboard for high-speed gameplay.",
      specs: [
        ["Product Name", "Razer Huntsman V3 Pro Mini"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "Razer"],
        ["Form Factor", "60% Mini"],
        ["Connection", "Wired"],
        ["Switch Type", "Razer Analog Optical Switches Gen-2"],
        ["Actuation Range", "Adjustable 0.1–4.0mm"],
        ["Rapid Trigger", "Yes"],
        ["Snap Tap", "Yes"],
        ["Keycaps", "Doubleshot PBT Keycaps"],
        ["Layout Features", "Dual-purpose modifier keys"],
        ["Lighting", "RGB"],
        ["Switch Lifespan", "100 million keystrokes"],
        ["Use Case", "Competitive gaming, esports, compact setups"]
      ],
      included: [
        {
          title: "Keyboard",
          text: "The Razer Huntsman V3 Pro Mini keyboard is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official keyboard package contents and may include the cable, documentation, and other accessories supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-huntsman-v3-pro-tkl-keyboard": {
      id: "razer-huntsman-v3-pro-tkl-keyboard",
      name: "Razer Huntsman V3 Pro TKL",
      category: "Keyboard",
      specsLine: "Razer | Keyboard | Wired",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-huntsman-v3-pro-tkl-keyboard",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349812/razer-huntsman-v3-pro-tkl-keyboard-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive gamers who want a fast tenkeyless keyboard with precise control and more desk space.",
      specs: [
        ["Product Name", "Razer Huntsman V3 Pro TKL"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "Razer"],
        ["Form Factor", "Tenkeyless / TKL"],
        ["Connection", "Wired"],
        ["Color", "Black"],
        ["Switch Type", "Razer Analog Optical Switches Gen-2"],
        ["Actuation Range", "Adjustable 0.1–4.0mm"],
        ["Rapid Trigger", "Yes"],
        ["Snap Tap", "Yes"],
        ["Lighting", "Razer Chroma RGB"],
        ["Keycaps", "Doubleshot PBT Keycaps"],
        ["Use Case", "Competitive gaming, esports, and compact setups"]
      ],
      included: [
        {
          title: "Keyboard",
          text: "The Razer Huntsman V3 Pro TKL keyboard is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official keyboard package contents and may include the cable, wrist rest, documentation, and other accessories supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-seiren-v3-chroma-usb-mic": {
      id: "razer-seiren-v3-chroma-usb-mic",
      name: "Razer Seiren V3 Chroma",
      category: "Gaming Microphone",
      specsLine: "Razer | Gaming Microphone | USB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-seiren-v3-chroma-usb-mic",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349852/razer-seiren-v3-chroma-usb-mic-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers, streamers, and creators who want a clean USB microphone with simple controls and RGB lighting.",
      specs: [
        ["Product Name", "Razer Seiren V3 Chroma"],
        ["Accessory Type", "Gaming Microphone"],
        ["Brand", "Razer"],
        ["Connection", "USB"],
        ["Microphone Type", "Supercardioid Condenser Microphone"],
        ["Capsule", "16mm condenser capsule"],
        ["Sample Rate", "96 kHz"],
        ["Bit Rate", "24-bit"],
        ["Frequency Response", "20 Hz – 20 kHz"],
        ["Tap-to-Mute", "Yes"],
        ["Lighting", "Razer Chroma RGB"],
        ["Reactive Lighting", "Stream and game reactive lighting"],
        ["Digital Gain Limiter", "Yes"],
        ["Shock Absorber", "Integrated shock absorber"],
        ["Headphone Monitoring", "3.5mm headphone monitoring jack"],
        ["Controls", "Multi-function tap-to-mute sensor, mic gain / volume control knob"],
        ["Use Case", "Gaming, streaming, chatting, and content creation"]
      ],
      included: [
        {
          title: "Gaming Microphone",
          text: "The Razer Seiren V3 Chroma USB microphone is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official microphone package contents and may include the USB cable, stand, documentation, and other accessories supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-basilisk-v3-pro-wireless": {
      id: "razer-basilisk-v3-pro-wireless",
      name: "Razer Basilisk V3 Pro Wireless",
      category: "Mouse",
      specsLine: "Razer | Mouse | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-basilisk-v3-pro-wireless",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349857/razer-basilisk-v3-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers who want a comfortable wireless mouse with strong customization, fast response, and premium RGB styling.",
      specs: [
        ["Product Name", "Razer Basilisk V3 Pro Wireless"],
        ["Accessory Type", "Mouse"],
        ["Brand", "Razer"],
        ["Connection", "Razer HyperSpeed Wireless / Bluetooth / Wired"],
        ["Sensor", "Razer Focus Pro 30K Optical Sensor"],
        ["Sensitivity", "True 30,000 DPI"],
        ["Acceleration", "Up to 70G"],
        ["Tracking Speed", "Up to 750 IPS"],
        ["Programmable Buttons", "11"],
        ["Switch Type", "Razer Optical Mouse Switches Gen-3"],
        ["Switch Lifespan", "90 million clicks"],
        ["Scroll Wheel", "4-way Razer HyperScroll Tilt Wheel"],
        ["Lighting", "13-zone Razer Chroma RGB"],
        ["On-board Profiles", "Hybrid on-board and cloud storage, 4+1 profiles"],
        ["Battery Life", "Up to 110 hours on HyperSpeed Wireless, up to 150 hours on Bluetooth"],
        ["Cable", "1.8m Razer Speedflex USB Type-C cable"],
        ["Dimensions", "130 × 75.4 × 42.5mm"],
        ["Weight", "112g excluding cable"],
        ["Use Case", "Gaming, productivity, RGB setups, and customizable control"]
      ],
      included: [
        {
          title: "Mouse",
          text: "The Razer Basilisk V3 Pro Wireless mouse is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official mouse package contents and may include the wireless dongle, USB cable, documentation, and other accessories supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-kraken-v4-pro-wireless": {
      id: "razer-kraken-v4-pro-wireless",
      name: "Razer Kraken V4 Pro Wireless",
      category: "Gaming Headset",
      specsLine: "Razer | Gaming Headset | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-kraken-v4-pro-wireless",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349846/razer-kraken-v4-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers who want a premium wireless headset with immersive audio, haptics, RGB lighting, and flexible connection options.",
      specs: [
        ["Product Name", "Razer Kraken V4 Pro Wireless"],
        ["Accessory Type", "Gaming Headset"],
        ["Brand", "Razer"],
        ["Connection", "2.4GHz Wireless, Bluetooth, USB Wired, 3.5mm"],
        ["Control Hub", "OLED Control Hub"],
        ["Haptics", "Razer Sensa HD Haptics"],
        ["Drivers", "Razer TriForce Bio-Cellulose 40mm Drivers"],
        ["Microphone", "Retractable Razer HyperClear Super Wideband Mic"],
        ["Spatial Audio", "THX Spatial Audio"],
        ["Lighting", "9-zone Razer Chroma RGB"],
        ["Wireless Mode", "Razer HyperSpeed Wireless"],
        ["Bluetooth", "Yes"],
        ["Wired Use", "USB and 3.5mm"],
        ["Use Case", "Gaming, immersive audio, streaming, chatting, and multi-platform setups"]
      ],
      included: [
        {
          title: "Gaming Headset",
          text: "The Razer Kraken V4 Pro Wireless gaming headset is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Control Hub",
          text: "The OLED Control Hub is included where supplied in the official package, allowing headset control and customization."
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

    "razer-raiju-v3-pro-for-ps5": {
      id: "razer-raiju-v3-pro-for-ps5",
      name: "Razer Raiju V3 Pro",
      category: "Controller",
      specsLine: "Razer | Controller | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-raiju-v3-pro-for-ps5",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349794/razer-raiju-v3-pro-for-ps5-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive PS5 and PC players who want a lightweight wireless pro controller with fast inputs, remappable controls, adjustable triggers, and tournament-ready customization.",
      specs: [
        ["Product Name", "Razer Raiju V3 Pro"],
        ["Accessory Type", "Controller"],
        ["Brand", "Razer"],
        ["Compatibility", "PlayStation 5 and PC"],
        ["Connection", "Razer HyperSpeed Wireless via included dongle / Wired USB-C to USB-A"],
        ["Wireless Mode", "2.4GHz Razer HyperSpeed Wireless"],
        ["Action Buttons", "Razer Mecha-Tactile PBT Action Buttons"],
        ["D-Pad", "Razer Mecha-Tactile PBT 8-way Floating D-Pad"],
        ["Multi-Function Buttons", "4 removable mouse click back paddles and 2 claw grip bumpers"],
        ["Triggers", "2 Hall Effect analog triggers with mouse click trigger stops"],
        ["Thumbsticks", "TMR analog thumbsticks with replaceable caps"],
        ["Polling Rate", "250Hz wireless on PS5, up to 2000Hz wired on PC"],
        ["Battery Life", "Up to 36 hours"],
        ["Cable", "2m USB-C to USB-A cable"],
        ["Carrying Case", "Included"],
        ["Audio", "3.5mm headset jack"],
        ["Weight", "258g"],
        ["Dimensions", "168.8 × 113.4 × 65.1mm"],
        ["Use Case", "Competitive PS5 gaming, PC gaming, esports, FPS, racing, fighting, and action games"]
      ],
      included: [
        {
          title: "Controller",
          text: "The Razer Raiju V3 Pro controller is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official controller package contents and may include the wireless dongle, 2m USB-C to USB-A cable, carrying case, replaceable thumbstick caps, toolkit, documentation, and other accessories supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-wolverine-v3-pro": {
      id: "razer-wolverine-v3-pro",
      name: "Razer Wolverine V3 Pro",
      category: "Controller",
      specsLine: "Razer | Controller | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-wolverine-v3-pro",
      images: Array.from({ length: 9 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349787/razer-wolverine-v3-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive Xbox and PC players who want a premium wireless esports controller with fast inputs, remappable controls, Hall Effect thumbsticks, mouse-click paddles, and trigger-stop control.",
      specs: [
        ["Product Name", "Razer Wolverine V3 Pro"],
        ["Accessory Type", "Controller"],
        ["Brand", "Razer"],
        ["Compatibility", "Xbox and PC"],
        ["System Requirement", "Xbox or PC with Windows 11 64-bit or higher"],
        ["Connection", "Razer HyperSpeed Wireless via included dongle / Wired USB-C to USB-A"],
        ["Wireless Mode", "2.4GHz Razer HyperSpeed Wireless"],
        ["Action Buttons", "Razer Mecha-Tactile Action Buttons"],
        ["D-Pad", "Razer Mecha-Tactile 8-way Floating D-Pad"],
        ["Multi-Function Buttons", "4 mouse click back paddles and 2 claw grip bumpers"],
        ["Triggers", "2 Hall Effect analog triggers with mouse click trigger stops"],
        ["Thumbsticks", "Anti-drift Hall Effect analog thumbsticks"],
        ["Lighting", "Razer Chroma RGB status indicator"],
        ["Audio", "3.5mm headset port"],
        ["Cable", "3m / 10ft USB-C to USB-A cable"],
        ["Carrying Case", "Included"],
        ["Color", "Black"],
        ["Use Case", "Competitive Xbox gaming, PC gaming, esports, FPS, racing, fighting, and action games"]
      ],
      included: [
        {
          title: "Controller",
          text: "The Razer Wolverine V3 Pro controller is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official controller package contents and may include the HyperSpeed wireless dongle, 3m USB-C to USB-A cable, carrying case, replaceable thumbstick caps, documentation, and other accessories supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "aorus-ez-chain-fan-120": {
      id: "aorus-ez-chain-fan-120",
      name: "AORUS EZ Chain Fan 120",
      category: "Case Fan",
      specsLine: "Gigabyte | Case Fan | ARGB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=aorus-ez-chain-fan-120",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349824/aorus-ez-chain-fan-120-3-pack-${imageNumber}.jpg`;
      }),
      defaultVariant: "3-pack",
      variantSelectorLabel: "Choose Pack",
      variants: [
        {
          id: "3-pack",
          capacity: "3 Pack",
          priceText: "Insert price here",
          priceNumber: null,
          images: Array.from({ length: 6 }, (_, index) => {
            const imageNumber = index + 1;
            return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349824/aorus-ez-chain-fan-120-3-pack-${imageNumber}.jpg`;
          }),
          specs: [
            ["Selected Pack", "3 Pack"],
            ["Included Fans", "3× 120mm ARGB fans"]
          ]
        },
        {
          id: "single-pack",
          capacity: "Single Pack",
          priceText: "Insert price here",
          priceNumber: null,
          images: Array.from({ length: 6 }, (_, index) => {
            const imageNumber = index + 1;
            return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349833/gigabyte-aorus-ez-chain-fan-120-${imageNumber}.jpg`;
          }),
          specs: [
            ["Selected Pack", "Single Pack"],
            ["Included Fans", "1× 120mm ARGB fan"]
          ]
        }
      ],
      whoIsThisFor: "For builders who want clean RGB case fans with easier cable management and strong airflow.",
      specs: [
        ["Product Name", "AORUS EZ Chain Fan 120"],
        ["Accessory Type", "Case Fan"],
        ["Brand", "Gigabyte AORUS"],
        ["Fan Size", "120mm"],
        ["Lighting", "ARGB"],
        ["Fan Speed", "600–2000 RPM ±10%"],
        ["Dimensions", "120 × 120 × 25mm"],
        ["Bearing Type", "HDB"],
        ["Fan Airflow", "60 CFM max"],
        ["Fan Air Pressure", "2.75 mmH2O max"],
        ["Noise Level", "8.2–29 dBA max"],
        ["MTTF", ">40,000 hours"],
        ["Color", "Black"],
        ["Connection Design", "EZ-Chain daisy-chain fan connection"],
        ["Warranty", "2 years"]
      ],
      included: [
        {
          title: "Case Fan Pack",
          text: "The AORUS EZ Chain Fan 120 is included in the selected pack option, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the selected official fan package contents and may include connection accessories, documentation, and mounting hardware supplied by Gigabyte."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-rapture-gt-ax11000-pro": {
      id: "rog-rapture-gt-ax11000-pro",
      name: "ROG Rapture GT-AX11000 Pro",
      category: "Router",
      specsLine: "ASUS ROG | Tri-Band WiFi 6 | AX11000",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-rapture-gt-ax11000-pro",
      images: Array.from({ length: 8 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349772/rog-rapture-gt-ax11000-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers, streamers, large homes, and high-performance network setups that need tri-band WiFi 6 speed, strong coverage, gaming traffic optimization, AiMesh support, and flexible multi-gig wired connectivity.",
      specs: [
        ["Product Name", "ROG Rapture GT-AX11000 Pro"],
        ["Accessory Type", "Router"],
        ["Brand", "ASUS ROG"],
        ["WiFi Standard", "WiFi 6 / 802.11ax"],
        ["WiFi Speed", "Up to 11,000Mbps"],
        ["Operating Frequency", "Tri-band WiFi: 2.4GHz / 5GHz-1 / 5GHz-2"],
        ["2.4GHz Data Rate", "Up to 1148Mbps"],
        ["5GHz-1 Data Rate", "Up to 4804Mbps"],
        ["5GHz-2 Data Rate", "Up to 4804Mbps"],
        ["Transmit / Receive", "2.4GHz 4×4, 5GHz-1 4×4, 5GHz-2 4×4"],
        ["Antenna", "8× external antennas, non-detachable"],
        ["Processor", "2.0GHz quad-core processor"],
        ["Memory", "256MB NAND flash and 1GB DDR4 RAM"],
        ["WAN / LAN Ports", "1× 2.5 Gigabit WAN, 1× 10 Gigabit WAN/LAN, 4× Gigabit LAN"],
        ["USB Ports", "1× USB 3.2 Gen 1, 1× USB 2.0"],
        ["Operating Modes", "Router / AiMesh Router, AiMesh Node, Access Point, Repeater, Media Bridge"],
        ["Gaming Features", "Triple-level game acceleration, VPN Fusion, gaming traffic optimization"],
        ["Network Features", "AiMesh support, Dual WAN, OFDMA, Beamforming, 1024-QAM, 160MHz bandwidth"],
        ["Use Case", "Gaming, streaming, large-home WiFi, high-speed wired networking, and AiMesh expansion"]
      ],
      included: [
        {
          title: "Gaming Router",
          text: "The ROG Rapture GT-AX11000 Pro gaming router is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official ASUS package contents and may include the power adapter, Ethernet cable, setup documentation, and related accessories supplied by ASUS."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "hyperx-quadcast-2-s-usb-microphone": {
      id: "hyperx-quadcast-2-s-usb-microphone",
      name: "HyperX QuadCast 2S ",
      category: "Gaming Microphone",
      specsLine: "HyperX | RGB USB Mic | 32-bit/192kHz",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=hyperx-quadcast-2-s-usb-microphone",
      images: Array.from({ length: 9 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349755/hyperx-quadcast-2-s-usb-microphone-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For streamers, gamers, creators, and podcasters who want a premium USB microphone with strong audio quality, deep RGB customization, multiple polar patterns, and easy desktop controls.",
      specs: [
        ["Product Name", "HyperX QuadCast 2S "],
        ["Accessory Type", "Gaming Microphone"],
        ["Brand", "HyperX"],
        ["Connection Type", "USB 2.0"],
        ["Cable Type", "USB-C to USB-C with USB-A adapter"],
        ["Audio Resolution", "Up to 32-bit / 192kHz"],
        ["Bit-depth", "16-bit, 24-bit, 32-bit"],
        ["Sampling Rates", "44.1kHz, 48kHz, 96kHz, 192kHz"],
        ["Polar Patterns", "Cardioid, Omnidirectional, Bidirectional, Stereo"],
        ["Microphone Element", "Three 14mm electret condenser capsules"],
        ["Headphone Frequency Response", "20Hz - 20kHz"],
        ["Microphone Sensitivity", "-8 dBFS ±4dB (94 dBSPL at 1kHz, default volume)"],
        ["Total Harmonic Distortion", "≤ 0.05% (1kHz / 0dBFS) - THD+N"],
        ["Special Features", "Tap-to-Mute sensor, 100+ aRGB LEDs, multifunction control knob"],
        ["Software Support", "HyperX NGENUITY"],
        ["Compatibility", "PC, Mac"],
        ["Color", "Black"]
      ],
      included: [
        {
          title: "USB Microphone",
          text: "The HyperX QuadCast 2 S USB microphone is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official HyperX package contents and may include the shock mount and stand, USB-C cable, USB-A adapter, and setup documentation supplied by HyperX."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-cobra-pro-lightweight-wireless-pc-gaming-mouse": {
      id: "razer-cobra-pro-lightweight-wireless-pc-gaming-mouse",
      name: "Razer Cobra Pro",
      category: "Mouse",
      specsLine: "Razer | Wireless Mouse | Chroma RGB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-cobra-pro-lightweight-wireless-pc-gaming-mouse",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349723/razer-cobra-pro-lightweight-wireless-pc-gaming-mouse-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers who want a compact premium wireless mouse with Razer HyperSpeed Wireless, Bluetooth, wired mode, Chroma RGB underglow, high-end sensor tracking, and a lightweight 77g body.",
      specs: [
        ["Product Name", "Razer Cobra Pro"],
        ["Accessory Type", "Mouse"],
        ["Brand", "Razer"],
        ["Color", "Black"],
        ["Form Factor", "Right-handed symmetrical"],
        ["Connectivity", "Razer HyperSpeed Wireless, Bluetooth, Wired USB"],
        ["Sensor", "Razer Focus Pro 30K Optical Sensor"],
        ["Max Sensitivity", "30,000 DPI"],
        ["Max Speed", "750 IPS"],
        ["Max Acceleration", "70G"],
        ["Programmable Buttons", "8"],
        ["Switch Type", "Razer Optical Mouse Switches Gen-3"],
        ["Switch Lifecycle", "90 million clicks"],
        ["On-board Memory Profiles", "5"],
        ["RGB Lighting", "Razer Chroma RGB with scroll wheel, logo, and multi-zone underglow"],
        ["Mouse Feet", "100% PTFE"],
        ["Polling Rate", "1000Hz, up to 8000Hz with compatible Razer accessories sold separately"],
        ["Battery Life", "Up to 100 hours on HyperSpeed Wireless, up to 170 hours on Bluetooth"],
        ["Cable", "USB Type-A to USB Type-C charging cable"],
        ["Dimensions", "119.6 × 62.5 × 38.1mm"],
        ["Weight", "77g excluding dongle and cable"]
      ],
      included: [
        {
          title: "Gaming Mouse",
          text: "The Razer Cobra Pro wireless gaming mouse is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official Razer package contents and may include the wireless USB dongle, USB dongle adapter, USB Type-A to USB Type-C charging cable, and product documentation supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-blackshark-v3-pro": {
      id: "razer-blackshark-v3-pro",
      name: "Razer BlackShark V3 Pro",
      category: "Gaming Headset",
      specsLine: "Razer | Wireless Headset | ANC",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-blackshark-v3-pro",
      images: Array.from({ length: 8 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349734/razer-blackshark-v3-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive gamers who want a premium wireless esports headset with ultra-low latency audio, hybrid active noise cancellation, THX Spatial Audio, strong microphone clarity, and long battery life.",
      specs: [
        ["Product Name", "Razer BlackShark V3 Pro"],
        ["Accessory Type", "Gaming Headset"],
        ["Brand", "Razer"],
        ["Color", "Black"],
        ["Connection Type", "2.4GHz Wireless, Bluetooth, USB Wired, 3.5mm"],
        ["Wireless Technology", "Razer HyperSpeed Wireless Gen-2"],
        ["Minimum 2.4GHz Latency", "10ms"],
        ["Headphone Frequency Response", "12Hz - 28kHz"],
        ["Impedance", "32Ω @ 1kHz"],
        ["Sensitivity", "108dBSPL/mW at 1kHz by HATS"],
        ["Drivers", "Customized Dynamic Bio-Cellulose 50mm Drivers"],
        ["Ear Cup Inner Diameter", "66 × 45mm"],
        ["Ear Cushions", "Dual-Layered Flowknit Memory Foam Cushions"],
        ["Microphone", "Detachable Razer HyperClear Full Band 12mm Mic"],
        ["Microphone Frequency Response", "20Hz - 20kHz"],
        ["Microphone Signal-to-Noise Ratio", "≥ 68dB"],
        ["Microphone Sampling Rate", "48kHz"],
        ["Microphone Sensitivity", "-42 ± 3dBV/Pa"],
        ["Microphone Pick-up Pattern", "Unidirectional"],
        ["Noise Cancellation", "Hybrid Active Noise Cancellation"],
        ["Spatial Audio", "THX Spatial Audio"],
        ["Bluetooth Codec", "AAC, SBC"],
        ["Battery Life", "Up to 70 hours on 2.4GHz connection"],
        ["Weight", "367g"]
      ],
      included: [
        {
          title: "Gaming Headset",
          text: "The Razer BlackShark V3 Pro wireless gaming headset is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official Razer package contents and may include the detachable microphone, wireless dongle, charging cable, 3.5mm cable or adapter, and product documentation supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-delta-s-animate": {
      id: "rog-delta-s-animate",
      name: "ROG Delta S Animate",
      category: "Gaming Headset",
      specsLine: "ASUS ROG | Wired Headset | USB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-delta-s-animate",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349509/rog-delta-s-animate-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gaming setups that need a premium wired USB headset with USB-C and USB-A support, hi-res audio, virtual 7.1 surround, AI noise-cancelling microphone, ESS DAC/amp hardware, and a lightweight foldable ROG design.",
      specs: [
        ["Product Name", "ROG Delta S Animate"],
        ["Accessory Type", "Gaming Headset"],
        ["Brand", "ASUS ROG"],
        ["Product Type", "USB Headset"],
        ["Usage Scenario", "Gaming"],
        ["Interface", "Wired"],
        ["Connection Type", "USB-A, USB-C"],
        ["Support Platform", "PC, Mac, PlayStation 4, PlayStation 5, Nintendo Switch"],
        ["Driver Material", "Neodymium magnet"],
        ["Driver Size", "50mm"],
        ["Headphones Impedance", "32 ohm"],
        ["Headphones Frequency Response", "20Hz - 40KHz"],
        ["Microphone Pick-up Pattern", "Unidirectional"],
        ["Microphone Sensitivity", "-40 dB"],
        ["Microphone Frequency Response", "100Hz - 10KHz"],
        ["AI Noise Cancelling Microphone", "Yes"],
        ["Hi-Fi DAC", "ESS 9281 Pro"],
        ["Hi-Fi Amp", "ESS 9281 Pro"],
        ["Active Noise Cancellation", "No"],
        ["Channel", "Virtual 7.1"],
        ["Lighting", "Single-colored LED"],
        ["Aura", "No"],
        ["Foldable", "Yes"],
        ["Weight", "310g"],
        ["Extra Ear Cushion", "Yes"],
        ["Color", "Black"],
        ["Cable", "1.5m USB-C cable, 1m USB-A cable"]
      ],
      included: [
        {
          title: "Gaming Headset",
          text: "The ROG Delta S Animate gaming headset is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the detachable microphone, user guide, ROG Hybrid ear cushion, and USB-C to USB-A adapter."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-delta-ii-gaming-headset": {
      id: "rog-delta-ii-gaming-headset",
      name: "ROG Delta II ",
      category: "Gaming Headset",
      specsLine: "ASUS ROG | Wireless Headset | RGB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-delta-ii-gaming-headset",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349573/rog-delta-ii-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gaming setups that need tri-mode wireless audio, Bluetooth, 3.5mm support, RGB lighting, and a detachable boom microphone.",
      specs: [
        ["Product Name", "ROG Delta II "],
        ["Accessory Type", "Gaming Headset"],
        ["Brand", "ASUS ROG"],
        ["Color", "Black"],
        ["Usage Scenario", "Gaming"],
        ["Interface", "Wireless"],
        ["Connection Type", "2.4GHz, Bluetooth, 3.5mm"],
        ["Support Platform", "PC, Mac, PlayStation 4, PlayStation 5, Nintendo Switch, iPad, iOS, Android, Bluetooth devices, Xbox via 3.5mm"],
        ["Driver Material", "Titanium-Plated Diaphragm Drivers"],
        ["Driver Size", "50mm"],
        ["Headphones Impedance", "32 ohm"],
        ["Headphones Frequency Response", "20Hz - 20KHz"],
        ["Microphone Pick-up Pattern", "Unidirectional"],
        ["Microphone Sensitivity", "-40 dB"],
        ["Microphone Frequency Response", "100Hz - 10KHz"],
        ["AI Noise Cancelling Microphone", "No"],
        ["Active Noise Cancellation", "No"],
        ["Channel", "Stereo"],
        ["Lighting", "RGB"],
        ["Aura", "Yes"],
        ["Battery", "1800mAh"],
        ["Weight", "318g"],
        ["Extra Ear Cushion", "Yes"],
        ["Cable", "1.5m USB-C to USB-A charging cable, 2m 3.5mm cable"]
      ],
      included: [
        {
          title: "Gaming Headset",
          text: "The ROG Delta II gaming headset is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the detachable microphone, ROG Hybrid ear cushion, wireless 2.4GHz USB-C dongle, USB-C to USB-A adapter, USB-C to USB-A charging cable, 3.5mm cable, and user guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-theta-7-1-gaming-headset": {
      id: "rog-theta-7-1-gaming-headset",
      name: "ROG Theta 7.1",
      category: "Gaming Headset",
      specsLine: "ASUS ROG | Wired Headset | 7.1 Surround",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-theta-7-1-gaming-headset",
      images: Array.from({ length: 7 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349559/rog-theta-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gaming setups that need wired 7.1 surround sound, USB-C / USB-A support, RGB lighting, and an AI noise-cancelling microphone.",
      specs: [
        ["Product Name", "ROG Theta 7.1"],
        ["Accessory Type", "Gaming Headset"],
        ["Brand", "ASUS ROG"],
        ["Color", "Black"],
        ["Interface", "Wired"],
        ["Connection Type", "USB-A, USB-C"],
        ["Support Platform", "PC, Mac, PlayStation 4, PlayStation 5, Nintendo Switch, Xbox One"],
        ["Driver Material", "Neodymium magnet"],
        ["Driver Size", "40mm front, 30mm × 3 center / side / rear"],
        ["Headphones Impedance", "32 ohm"],
        ["Headphones Frequency Response", "20Hz - 40KHz"],
        ["Microphone Pick-up Pattern", "Unidirectional"],
        ["Microphone Sensitivity", "-54 dB"],
        ["Microphone Frequency Response", "100Hz - 10KHz"],
        ["AI Noise Cancelling Microphone", "Yes"],
        ["Hi-Fi DAC", "SupremeFX S1220A"],
        ["Hi-Fi Amp", "ESS 9601"],
        ["Active Noise Cancellation", "No"],
        ["Channel", "7.1"],
        ["Lighting", "RGB"],
        ["Aura Sync", "Yes"],
        ["Foldable", "No"],
        ["Weight", "590g"],
        ["Extra Ear Cushion", "Yes"],
        ["Cable", "1.2m USB-C cable, 1m USB 2.0 cable"]
      ],
      included: [
        {
          title: "Gaming Headset",
          text: "The ROG Theta 7.1 gaming headset is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the detachable microphone, user guide, ROG Hybrid ear cushion, and USB-C to USB 2.0 Type-A adapter."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-carnyx-gaming-microphone": {
      id: "rog-carnyx-gaming-microphone",
      name: "ROG Carnyx ",
      category: "Gaming Microphone",
      specsLine: "ASUS ROG | USB Microphone | RGB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-carnyx-gaming-microphone",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349552/rog-carnyx-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gaming, streaming, podcasting, and content creation setups that need a USB condenser microphone with RGB lighting.",
      specs: [
        ["Product Name", "ROG Carnyx "],
        ["Accessory Type", "Gaming Microphone"],
        ["Brand", "ASUS ROG"],
        ["Usage Scenario", "Gaming, Multimedia"],
        ["Interface", "Wired"],
        ["Connector", "USB-A"],
        ["Support Platform", "PC, Mac"],
        ["Microphone Type", "25mm condenser capsule"],
        ["Polar Pattern", "Cardioid"],
        ["Sample Rate", "192KHz"],
        ["Bit Rate", "24-bit"],
        ["Max SPL", "120dB"],
        ["Microphone Sensitivity", "-37dB ± 3dB"],
        ["Microphone Frequency Response", "20Hz - 20KHz"],
        ["Lighting", "RGB"],
        ["Aura", "Yes"],
        ["Weight", "634g"],
        ["Cable", "3m USB-A to USB-C cable"]
      ],
      included: [
        {
          title: "Gaming Microphone",
          text: "The ROG Carnyx gaming microphone is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the 3m USB-A to USB-C cable and quick start guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-harpe-ii-ace-gaming-mouse": {
      id: "rog-harpe-ii-ace-gaming-mouse",
      name: "ROG Harpe II Ace",
      category: "Gaming Mouse",
      specsLine: "ASUS ROG | Wireless Mouse | 42000 DPI",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-harpe-ii-ace-gaming-mouse",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349534/rog-harpe-ii-ace-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gaming setups that need a lightweight wireless mouse with high-end sensor performance, 8000Hz polling, and tri-mode connectivity.",
      specs: [
        ["Product Name", "ROG Harpe II Ace"],
        ["Accessory Type", "Gaming Mouse"],
        ["Brand", "ASUS ROG"],
        ["Color", "Black / White"],
        ["Usage Scenario", "Gaming"],
        ["Interface", "Wireless / Wired"],
        ["Connectivity", "USB 2.0 (Type-C to Type-A), Bluetooth 5.1, RF 2.4GHz"],
        ["Sensor", "ROG AimPoint Pro"],
        ["Resolution", "42000 DPI"],
        ["Max Speed", "750 IPS"],
        ["Max Acceleration", "50G"],
        ["USB Report Rate", "8000 Hz"],
        ["RF 2.4G Report Rate", "8000 Hz"],
        ["Switch Type", "ROG 100M Optical Micro Switch"],
        ["Lighting", "Scroll wheel"],
        ["AURA Sync", "Yes"],
        ["Battery Type", "Lithium-ion battery"],
        ["Shape", "Right-handed Symmetrical"],
        ["Cable", "2-meter ROG Paracord"],
        ["Software", "Gear Link"],
        ["OS", "Windows 10, Windows 11"],
        ["Dimensions", "126.1(L) x 63.9(W) x 39.7(H) mm"],
        ["Weight", "48g (without dongle)"]
      ],
      included: [
        {
          title: "Gaming Mouse",
          text: "The ROG Harpe II Ace gaming mouse is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the wireless receiver, wireless receiver extender, ROG Paracord, mouse grip tape set, 100% PTFE mouse feet set, thank you card, warranty card, quick start guide, and ROG logo sticker."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-blackwidow-v4-75-keyboard-black": {
      id: "razer-blackwidow-v4-75-keyboard-black",
      name: "Razer BlackWidow V4 75%",
      category: "Keyboard",
      specsLine: "Razer | 75% Keyboard | Hot-Swappable",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-blackwidow-v4-75-keyboard-black",
      images: Array.from({ length: 7 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349711/razer-blackwidow-v4-75-keyboard-black-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers and keyboard enthusiasts who want a compact 75% wired mechanical keyboard with hot-swappable switches, Razer Chroma RGB, strong typing feel, media controls, and premium desk-space efficiency.",
      specs: [
        ["Product Name", "Razer BlackWidow V4 75%"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "Razer"],
        ["Color", "Black"],
        ["Keyboard Type", "Hot-swappable mechanical gaming keyboard"],
        ["Form Factor", "75% with function row and arrow keys"],
        ["Switch Type", "Razer Mechanical Switches Gen-3 Orange Tactile"],
        ["Switch Compatibility", "Most standard 3-pin or 5-pin mechanical switches"],
        ["RGB Backlighting", "Razer Chroma RGB"],
        ["Lighting Zones", "Per-key lighting with 2-side underglow"],
        ["Keycaps", "Doubleshot ABS"],
        ["Anti-Ghosting", "Yes"],
        ["Gaming Mode", "Yes"],
        ["Fully Programmable Keys", "Yes"],
        ["On-the-fly Macro Recording", "Yes"],
        ["Polling Rate", "Up to 8000Hz Ultrapolling"],
        ["Media Controls", "Multi-function roller and dedicated media keys"],
        ["Wrist Rest", "Magnetic plush leatherette wrist rest"],
        ["Cable Type", "Detachable Type-C cable"],
        ["Software Support", "Razer Synapse 4"],
        ["USB Pass-Through", "No"],
        ["Approx. Dimensions Without Wrist Rest", "321 × 155.5 × 24mm"],
        ["Approx. Dimensions With Wrist Rest", "321 × 240.5 × 24mm"],
        ["Approx. Weight Without Wrist Rest", "815g"],
        ["Approx. Weight With Wrist Rest", "986g"]
      ],
      included: [
        {
          title: "Gaming Keyboard",
          text: "The Razer BlackWidow V4 75% keyboard in black is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official Razer package contents and may include the detachable Type-C cable, magnetic plush leatherette wrist rest, 2-in-1 keycap and switch puller, and product documentation supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-blackwidow-v4-pro-75": {
      id: "razer-blackwidow-v4-pro-75",
      name: "Razer BlackWidow V4 Pro 75%",
      category: "Keyboard",
      specsLine: "Razer | 75% Keyboard | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-blackwidow-v4-pro-75",
      images: Array.from({ length: 2 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783899629/razer-blackwidow-v4-pro-75-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers and keyboard enthusiasts who want a premium 75% wireless mechanical keyboard with hot-swappable switches, OLED controls, Razer Chroma RGB, tri-mode connectivity, and a compact high-end desktop setup.",
      specs: [
        ["Product Name", "Razer BlackWidow V4 Pro 75%"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "Razer"],
        ["Keyboard Type", "Hot-swappable mechanical gaming keyboard"],
        ["Form Factor", "75% with function row and arrow keys"],
        ["Switch Type", "Razer Mechanical Switches"],
        ["Switch Compatibility", "Hot-swappable mechanical switch sockets"],
        ["Connection Type", "Razer HyperSpeed Wireless, Bluetooth, USB-C wired"],
        ["Display", "OLED display"],
        ["Controls", "Command Dial and media controls"],
        ["RGB Backlighting", "Razer Chroma RGB"],
        ["Polling Rate", "Up to 4000Hz wireless / 8000Hz wired"],
        ["Wrist Rest", "Magnetic plush leatherette wrist rest"],
        ["Software Support", "Razer Synapse"],
        ["Use Case", "Competitive gaming, premium wireless setups, compact desks, and keyboard enthusiast builds"]
      ],
      included: [
        {
          title: "Gaming Keyboard",
          text: "The Razer BlackWidow V4 Pro 75% keyboard is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official Razer package contents and may include the USB-C cable, wireless dongle, magnetic wrist rest, keycap and switch puller, and product documentation supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "hyperx-flipcast-microphone": {
      id: "hyperx-flipcast-microphone",
      name: "HyperX FlipCast",
      category: "Gaming Microphone",
      specsLine: "HyperX | Dynamic Mic | USB/XLR",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=hyperx-flipcast-microphone",
      images: Array.from({ length: 7 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781351726/hyperx-flipcast-microphone-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For streamers, creators, podcasters, and gaming setups that need a premium dynamic microphone with USB-C and XLR connectivity, onboard controls, clean vocal pickup, and easy PC recording.",
      specs: [
        ["Product Name", "HyperX FlipCast"],
        ["Accessory Type", "Gaming Microphone"],
        ["Brand", "HyperX"],
        ["Color", "Black"],
        ["Microphone Type", "Dynamic microphone"],
        ["Element", "Dynamic capsule"],
        ["Polar Pattern", "Cardioid"],
        ["Connectivity", "USB-C and XLR"],
        ["USB Specification", "USB 2.0 Type-A"],
        ["Cable Type", "USB Type-C to USB Type-C cable"],
        ["Bit-depth", "32-bit"],
        ["Sampling Rate", "192kHz"],
        ["Headphone Frequency Response", "20Hz - 20kHz"],
        ["Microphone Sensitivity", "-10 dB (1 V/Pa at 1kHz)"],
        ["Total Harmonic Distortion", "≤ 0.05% (1kHz / 0dBFS)"],
        ["Impedance", "1Ω"],
        ["Onboard Controls", "Tap-to-mute, level meter, and multi-function dial"],
        ["Software Support", "HyperX NGENUITY"],
        ["Compatibility", "PC"],
        ["Use Case", "Streaming, podcasting, content creation, voice recording, and gaming communication"]
      ],
      included: [
        {
          title: "Dynamic Microphone",
          text: "The HyperX FlipCast USB/XLR dynamic microphone is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official HyperX package contents and may include the USB Type-C cable, mounting accessories, and setup documentation supplied by HyperX. XLR equipment and XLR cable may be sold separately."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "hyperx-solocast-2-microphone": {
      id: "hyperx-solocast-2-microphone",
      name: "HyperX SoloCast 2",
      category: "Gaming Microphone",
      specsLine: "HyperX | USB Condenser Mic | Cardioid",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=hyperx-solocast-2-microphone",
      images: Array.from({ length: 8 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349675/hyperx-solocast-2-microphone-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers, streamers, and creators who want a compact plug-and-play USB microphone with clear voice capture, cardioid pickup, tap-to-mute control, and a simple desktop setup without needing extra accessories.",
      specs: [
        ["Product Name", "HyperX SoloCast 2"],
        ["Accessory Type", "Gaming Microphone"],
        ["Brand", "HyperX"],
        ["Color", "Black"],
        ["Microphone Type", "USB condenser microphone"],
        ["Element", "One 14mm electret condenser capsule"],
        ["Polar Pattern", "Cardioid"],
        ["Connectivity", "USB"],
        ["USB Specification", "USB 2.0 Type-A"],
        ["Cable Type", "USB Type-C to USB Type-A cable"],
        ["Bit-depth", "24-bit, 16-bit"],
        ["Sampling Rates", "96kHz, 48kHz, 44.1kHz"],
        ["Microphone Sensitivity", "-7.8 ±3 dB (1 V/Pa at 1kHz)"],
        ["Special Features", "Built-in shock mount, built-in pop filter, tap-to-mute with LED indicator"],
        ["Software Support", "HyperX NGENUITY"],
        ["Compatibility", "PC"],
        ["Use Case", "Gaming communication, streaming, voice chat, and content creation"]
      ],
      included: [
        {
          title: "USB Microphone",
          text: "The HyperX SoloCast 2 USB condenser microphone is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official HyperX package contents and may include the USB Type-C to USB Type-A cable, desktop stand, and setup documentation supplied by HyperX."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-viper-v3-pro": {
      id: "razer-viper-v3-pro",
      name: "Razer Viper V3 Pro",
      category: "Mouse",
      specsLine: "Razer | Mouse | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-viper-v3-pro",
      images: Array.from({ length: 9 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349516/razer-viper-v3-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive FPS and esports players who want an ultra-light wireless mouse with a clean symmetrical shape, Focus Pro 35K sensor, fast optical switches, 8K polling support, and strong battery life for tournament-level performance.",
      specs: [
        ["Product Name", "Razer Viper V3 Pro"],
        ["Accessory Type", "Mouse"],
        ["Brand", "Razer"],
        ["Color", "Black"],
        ["Form Factor", "Right-handed symmetrical"],
        ["Connectivity", "Razer HyperSpeed Wireless, Wired USB"],
        ["Sensor", "Razer Focus Pro 35K Optical Sensor Gen-2"],
        ["Max Sensitivity", "35,000 DPI"],
        ["Max Speed", "750 IPS"],
        ["Max Acceleration", "70G"],
        ["Resolution Accuracy", "99.8%"],
        ["Programmable Buttons", "6"],
        ["Switch Type", "Razer Optical Mouse Switches Gen-3"],
        ["Switch Lifecycle", "90 million clicks"],
        ["On-board Memory", "1 profile"],
        ["Mouse Feet", "100% PTFE"],
        ["Polling Rate", "Up to 8000Hz"],
        ["Battery Life", "Up to 95 hours at 1000Hz"],
        ["Cable", "USB Type-A to USB Type-C Speedflex charging cable"],
        ["Dimensions", "127.1 × 63.9 × 39.9mm"],
        ["Weight", "54g excluding cable"]
      ],
      included: [
        {
          title: "Gaming Mouse",
          text: "The Razer Viper V3 Pro wireless gaming mouse is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official Razer package contents and may include the HyperPolling wireless dongle, USB dongle adapter, USB Type-A to USB Type-C Speedflex cable, grip tape, and product documentation supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "razer-deathadder-v3-pro-mouse-black": {
      id: "razer-deathadder-v3-pro-mouse-black",
      name: "Razer DeathAdder V3 Pro",
      category: "Mouse",
      specsLine: "Razer | Wireless Mouse | 63g",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=razer-deathadder-v3-pro-mouse-black",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349660/razer-deathadder-v3-pro-mouse-black-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive gamers who want an ultra-light ergonomic wireless mouse with Razer HyperSpeed Wireless, a Focus Pro 30K Optical Sensor, fast optical switches, strong battery life, and a refined right-handed shape for esports play.",
      specs: [
        ["Product Name", "Razer DeathAdder V3 Pro"],
        ["Accessory Type", "Mouse"],
        ["Brand", "Razer"],
        ["Color", "Black"],
        ["Form Factor", "Right-handed ergonomic"],
        ["Connectivity", "Razer HyperSpeed Wireless, Wired USB"],
        ["Sensor", "Razer Focus Pro 30K Optical Sensor"],
        ["Max Sensitivity", "30,000 DPI"],
        ["Max Speed", "750 IPS"],
        ["Max Acceleration", "70G"],
        ["Resolution Accuracy", "99.8%"],
        ["Programmable Buttons", "5"],
        ["Switch Type", "Razer Optical Mouse Switches Gen-3"],
        ["Switch Lifecycle", "90 million clicks"],
        ["On-board Memory", "1 profile"],
        ["Mouse Feet", "100% PTFE"],
        ["Polling Rate", "1000Hz default, upgradeable to 8000Hz wireless with compatible Razer HyperPolling Wireless Dongle sold separately"],
        ["Battery Life", "Up to 90 hours"],
        ["Cable", "USB Type-A to USB Type-C Speedflex charging cable"],
        ["Dimensions", "128 × 68 × 44mm"],
        ["Weight", "63g excluding cable"]
      ],
      included: [
        {
          title: "Gaming Mouse",
          text: "The Razer DeathAdder V3 Pro wireless gaming mouse in black is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official Razer package contents and may include the wireless USB dongle, USB dongle adapter, USB Type-A to USB Type-C Speedflex charging cable, grip tape, and product documentation supplied by Razer."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "hyperx-alloy-origins-60-keyboard": {
      id: "hyperx-alloy-origins-60-keyboard",
      name: "HyperX Alloy Origins 60",
      category: "Keyboard",
      specsLine: "HyperX | 60% Keyboard | Wired",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=hyperx-alloy-origins-60-keyboard",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349650/hyperx-alloy-origins-60-keyboard-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers who want a compact 60% wired mechanical keyboard with HyperX switches, double shot PBT keycaps, RGB lighting, and a smaller footprint for more mouse space.",
      specs: [
        ["Product Name", "HyperX Alloy Origins 60"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "HyperX"],
        ["Color", "Black"],
        ["Keyboard Type", "Mechanical gaming keyboard"],
        ["Form Factor", "60%"],
        ["Switch Type", "HyperX Mechanical Switches"],
        ["Switch Options", "HyperX Red Linear or HyperX Aqua Tactile, depending on selected model"],
        ["Keycaps", "Double shot PBT keycaps"],
        ["Lighting", "Per-key RGB lighting"],
        ["Body", "Full aluminum body"],
        ["Software Support", "HyperX NGENUITY"],
        ["Compatibility", "PC, PS5, PS4, Xbox Series X|S, Xbox One"],
        ["Connection Type", "Wired USB"],
        ["Use Case", "Gaming, compact setups, desk-space saving, and fast keyboard control"]
      ],
      included: [
        {
          title: "Gaming Keyboard",
          text: "The HyperX Alloy Origins 60 mechanical gaming keyboard is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official HyperX package contents and may include the detachable USB cable, accessory keycaps, keycap puller, and setup documentation supplied by HyperX."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "hyperx-pulsefire-haste-wireless-mouse": {
      id: "hyperx-pulsefire-haste-wireless-mouse",
      name: "HyperX Pulsefire Haste Wireless",
      category: "Mouse",
      specsLine: "HyperX | Wireless Mouse | 61g",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=hyperx-pulsefire-haste-wireless-mouse",
      images: Array.from({ length: 8 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349637/hyperx-pulsefire-haste-wireless-mouse-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gamers who want an ultra-light wireless mouse with low-latency 2.4GHz performance, long battery life, a 61g honeycomb shell, responsive switches, and smooth PTFE skates for fast competitive play.",
      specs: [
        ["Product Name", "HyperX Pulsefire Haste Wireless"],
        ["Accessory Type", "Mouse"],
        ["Brand", "HyperX"],
        ["Color", "Black"],
        ["Connection Type", "2.4GHz Wireless / Wired"],
        ["Sensor", "Pixart PAW3335"],
        ["Max Resolution", "Up to 16,000 DPI"],
        ["DPI Presets", "400 / 800 / 1600 / 3200 DPI"],
        ["Speed", "450 IPS"],
        ["Acceleration", "40G"],
        ["Polling Rate", "1000Hz"],
        ["Buttons", "6"],
        ["Switches", "TTC Golden Micro Dustproof Switches"],
        ["Switch Durability", "80 million clicks"],
        ["Onboard Memory", "1 profile"],
        ["Battery Life", "Up to 100 hours"],
        ["Battery Type", "370mAh Li-ion polymer battery"],
        ["Charging Type", "Wired"],
        ["Cable Type", "Detachable HyperFlex USB Cable"],
        ["Mouse Feet", "Virgin-grade PTFE skates"],
        ["Lighting", "Per-LED RGB lighting"],
        ["Software Support", "HyperX NGENUITY"],
        ["Compatibility", "PC, PS5, PS4, Xbox Series X|S, Xbox One"],
        ["Weight", "61g"]
      ],
      included: [
        {
          title: "Gaming Mouse",
          text: "The HyperX Pulsefire Haste Wireless gaming mouse is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official HyperX package contents and may include the wireless USB receiver, USB adapter, detachable HyperFlex USB cable, grip tape, extra skates, and setup documentation supplied by HyperX."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "asus-tuf-gaming-be3600-router": {
      id: "asus-tuf-gaming-be3600-router",
      name: "ASUS TUF Gaming BE3600",
      category: "Router",
      specsLine: "ASUS TUF | WiFi 7 | BE3600",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-tuf-gaming-be3600-router",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349633/asus-tuf-gaming-be3600-router-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For gaming setups, home networks, and AiMesh expansion builds that need a dual-band WiFi 7 router with BE3600 speeds, 2.5G wired connectivity, gaming acceleration, strong security, and stable everyday operation.",
      specs: [
        ["Product Name", "ASUS TUF Gaming BE3600"],
        ["Accessory Type", "Router"],
        ["Brand", "ASUS TUF Gaming"],
        ["WiFi Standard", "WiFi 7 / 802.11be"],
        ["Product Segment", "BE3600: 688 + 2882 Mbps"],
        ["WiFi Data Rate", "2.4GHz up to 688 Mbps, 5GHz up to 2882 Mbps"],
        ["Operating Frequency", "Dual-band: 2.4GHz and 5GHz"],
        ["Transmit / Receive", "2.4GHz 2×2, 5GHz 2×2"],
        ["Antenna", "4× external antennas"],
        ["Processor", "2.0GHz quad-core processor"],
        ["Memory", "256MB flash and 1GB RAM"],
        ["Speed Features", "OFDMA, Beamforming, 4096-QAM, 20/40/80/160MHz bandwidth"],
        ["I/O Ports", "1× 2.5G WAN/LAN, 1× 1G WAN/LAN, 3× 1G LAN, 1× USB 3.2 Gen 1"],
        ["Operating Modes", "Wireless Router, Access Point, Media Bridge, Repeater, AiMesh Node"],
        ["Gaming Features", "Game Boost / Acceleration, Mobile Game Mode, Gaming Port"],
        ["Security", "AiProtection, VPN, WPA/WPA2/WPA3-Personal, WPA/WPA2-Enterprise, Firewall, Security Scan"],
        ["VPN Features", "Instant Guard, VPN Fusion, WireGuard, OpenVPN, PPTP, L2TP, IPSec support"],
        ["AiMesh", "Primary AiMesh Router and AiMesh Node support"],
        ["Power Supply", "12V / 2A"],
        ["Dimensions", "274 × 168 × 205mm"],
        ["Weight", "561g"]
      ],
      included: [
        {
          title: "Gaming Router",
          text: "The ASUS TUF Gaming BE3600 WiFi 7 router is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official ASUS package contents and may include the RJ-45 cable, power adapter, quick start guide, warranty card, and documentation supplied by ASUS."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "asus-rog-strix-gs-be18000-router": {
      id: "asus-rog-strix-gs-be18000-router",
      name: "ASUS ROG Strix GS-BE18000",
      category: "Router",
      specsLine: "ASUS ROG | WiFi 7 | BE18000",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-rog-strix-gs-be18000-router",
      images: Array.from({ length: 5 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349618/asus-rog-strix-gs-be18000-router-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For high-end gaming networks, streamers, large homes, and multi-gig wired setups that need tri-band WiFi 7, 6GHz support, eight 2.5G ports, gaming acceleration, AiMesh support, and strong ASUS security features.",
      specs: [
        ["Product Name", "ASUS ROG Strix GS-BE18000"],
        ["Accessory Type", "Router"],
        ["Brand", "ASUS ROG"],
        ["WiFi Standard", "WiFi 7 / 802.11be"],
        ["Product Segment", "BE18000: 688 + 5764 + 11529 Mbps"],
        ["WiFi Data Rate", "2.4GHz up to 688Mbps, 5GHz up to 5764Mbps, 6GHz up to 11529Mbps"],
        ["Operating Frequency", "Tri-band: 2.4GHz, 5GHz, 6GHz"],
        ["Transmit / Receive", "2.4GHz 2×2, 5GHz 4×4, 6GHz 4×4"],
        ["Antenna", "8× internal antennas"],
        ["Processor", "2.0GHz quad-core processor"],
        ["Memory", "256MB flash and 2GB DDR4 RAM"],
        ["Speed Features", "OFDMA, Beamforming, 4096-QAM, 20/40/80/160/320MHz bandwidth"],
        ["I/O Ports", "1× 2.5Gbps WAN, 7× 2.5Gbps LAN, 1× USB 3.2 Gen 1"],
        ["Operating Modes", "Router, AiMesh Node, Access Point, Repeater, Media Bridge"],
        ["Gaming Features", "Game Boost, Mobile Game Mode, Gear Accelerator, ROG First, OpenNAT, Gaming Port, Gaming Network"],
        ["Security", "AiProtection Pro, WPA/WPA2/WPA3 Personal, WPA/WPA2/WPA3 Enterprise, firewall, DNS-over-TLS, security scan"],
        ["VPN Features", "Instant Guard, VPN Fusion, WireGuard, OpenVPN, PPTP, L2TP, IPSec support"],
        ["AiMesh", "Primary AiMesh Router and AiMesh Node support"],
        ["Buttons", "WPS, Reset, Power"],
        ["LED Indicators", "WAN, LAN, WiFi, Power"],
        ["Power Supply", "12V with max 5A current / 12V with max 3A current"],
        ["Dimensions", "225 × 90 × 225mm"],
        ["Weight", "927.5g"]
      ],
      included: [
        {
          title: "Gaming Router",
          text: "The ASUS ROG Strix GS-BE18000 WiFi 7 gaming router is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official ASUS package contents and may include the RJ-45 cable, power adapter, quick start guide, warranty card, and documentation supplied by ASUS."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "steelseries-apex-pro-tkl-wireless-gen-3-black": {
      id: "steelseries-apex-pro-tkl-wireless-gen-3-black",
      name: "SteelSeries Apex Pro TKL Wireless Gen 3",
      category: "Keyboard",
      specsLine: "SteelSeries | TKL Wireless | OmniPoint 3.0",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=steelseries-apex-pro-tkl-wireless-gen-3-black",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349603/steelseries-apex-pro-tkl-wireless-gen-3-black-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For competitive gamers who want a premium TKL wireless keyboard with OmniPoint 3.0 Adjustable HyperMagnetic switches, Rapid Trigger, Rapid Tap, OLED controls, RGB lighting, and a compact esports-ready layout.",
      specs: [
        ["Product Name", "SteelSeries Apex Pro TKL Wireless Gen 3"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "SteelSeries"],
        ["Color", "Black"],
        ["Keyboard Size", "TKL / Tenkeyless"],
        ["Layout", "87 keys"],
        ["Switch Type", "OmniPoint 3.0 Adjustable HyperMagnetic Switches"],
        ["Actuation Range", "0.1mm - 4.0mm"],
        ["Connection Type", "2.4GHz Wireless, Bluetooth, USB-C Wired"],
        ["Wireless Technology", "Quantum 2.0 Wireless"],
        ["Lighting", "Per-key RGB"],
        ["Display", "OLED Smart Display"],
        ["Keycaps", "Double-shot PBT keycaps"],
        ["Gaming Features", "Rapid Trigger, Rapid Tap, Protection Mode, 2-in-1 Action Keys, GG QuickSet"],
        ["Build", "Premium aluminum top plate"],
        ["Cable", "Detachable USB-C"],
        ["Software Support", "SteelSeries GG"],
        ["Use Case", "Competitive gaming, esports, premium wireless setups, and compact desktop builds"]
      ],
      included: [
        {
          title: "Gaming Keyboard",
          text: "The SteelSeries Apex Pro TKL Wireless Gen 3 keyboard in black is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official SteelSeries package contents and may include the detachable USB-C cable, wireless receiver, adapter, keycap puller, and product documentation supplied by SteelSeries."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "steelseries-arctis-nova-pro": {
      id: "steelseries-arctis-nova-pro",
      name: "SteelSeries Arctis Nova Pro",
      category: "Gaming Headset",
      specsLine: "SteelSeries | Gaming Headset | Wired",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=steelseries-arctis-nova-pro",
      images: Array.from({ length: 2 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783899265/steelseries-arctis-nova-pro-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For PC and console gamers who want a premium wired headset with GameDAC control, high-resolution audio support, 360 spatial audio, a clear microphone, and a comfortable competitive gaming design.",
      specs: [
        ["Product Name", "SteelSeries Arctis Nova Pro"],
        ["Accessory Type", "Gaming Headset"],
        ["Brand", "SteelSeries"],
        ["Connection Type", "Wired"],
        ["Audio System", "Nova Pro Acoustic System"],
        ["DAC", "GameDAC Gen 2"],
        ["Spatial Audio", "360 Spatial Audio"],
        ["Drivers", "High-fidelity speaker drivers"],
        ["Frequency Response", "10Hz-40,000Hz"],
        ["Microphone", "ClearCast Gen 2 noise-cancelling microphone"],
        ["Software Support", "SteelSeries GG / Sonar"],
        ["Use Case", "Competitive gaming, high-resolution PC audio, console gaming, and premium wired headset setups"]
      ],
      included: [
        {
          title: "Gaming Headset",
          text: "The SteelSeries Arctis Nova Pro gaming headset is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official SteelSeries package contents and may include the GameDAC, headset cables, adapters, and product documentation supplied by SteelSeries."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "steelseries-aerox-9-wireless-mouse": {
      id: "steelseries-aerox-9-wireless-mouse",
      name: "SteelSeries Aerox 9 Wireless",
      category: "Mouse",
      specsLine: "SteelSeries | Wireless Mouse | 18 Buttons",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=steelseries-aerox-9-wireless-mouse",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349596/steelseries-aerox-9-wireless-mouse-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For MMO, MOBA, RPG, and productivity users who want a lightweight wireless gaming mouse with 18 programmable buttons, a 12-button side panel, long battery life, Bluetooth support, RGB lighting, and strong protection against dust, dirt, and splashes.",
      specs: [
        ["Product Name", "SteelSeries Aerox 9 Wireless"],
        ["Accessory Type", "Mouse"],
        ["Brand", "SteelSeries"],
        ["Color", "Black"],
        ["Connection Type", "2.4GHz Wireless, Bluetooth 5.0, USB Wired"],
        ["Wireless Technology", "Quantum 2.0 Wireless"],
        ["Sensor", "TrueMove Air Optical Gaming Sensor"],
        ["Buttons", "18 programmable buttons"],
        ["Side Panel", "12-button side panel"],
        ["Lighting", "3-zone PrismSync RGB"],
        ["RGB Colors", "16.8 million configurable colors"],
        ["Switches", "Golden Micro IP54 switches"],
        ["Protection", "AquaBarrier IP54 protection against water splashes, dust, and dirt"],
        ["Battery Life", "Up to 180 hours"],
        ["Weight", "89g"],
        ["Software Support", "SteelSeries GG"],
        ["Use Case", "MMO, MOBA, RPG, macros, shortcuts, competitive gaming, and wireless desktop setups"]
      ],
      included: [
        {
          title: "Gaming Mouse",
          text: "The SteelSeries Aerox 9 Wireless gaming mouse is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official SteelSeries package contents and may include the wireless dongle, USB cable, extension adapter, and product documentation supplied by SteelSeries."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-raikiri-ii-xbox-wireless-controller": {
      id: "rog-raikiri-ii-xbox-wireless-controller",
      name: "ROG Raikiri II Xbox Wireless",
      category: "Gaming Accessory",
      specsLine: "ASUS ROG | Xbox | Wireless",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-raikiri-ii-xbox-wireless-controller",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349594/rog-raikiri-ii-xbox-wireless-controller-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For Xbox and PC gamers who want a premium ROG wireless gamepad with wired, 2.4GHz, and Bluetooth connectivity, USB-C support, 3.5mm headset audio, included stand charger, and a complete accessory bundle.",
      specs: [
        ["Product Name", "ROG Raikiri II Xbox Wireless"],
        ["Accessory Type", "Gamepad"],
        ["Brand", "ASUS ROG"],
        ["Compatibility", "Windows 11, Xbox Series X|S, Xbox One"],
        ["Connectivity", "Wired, RF 2.4GHz, Bluetooth"],
        ["I/O Ports", "USB-C, 3.5mm jack"],
        ["Audio Output", "3.5mm analog audio port compatible with Xbox and PC"],
        ["Microphone Input", "3.5mm analog audio port compatible with Xbox and PC"],
        ["Cable", "2.5m USB-C to USB-A detachable cable"],
        ["Dimensions", "105 × 65 × 155mm"],
        ["Weight", "345g including cable"],
        ["Use Case", "Xbox gaming, Windows PC gaming, wireless gameplay, wired play, and headset-connected gameplay setups"]
      ],
      included: [
        {
          title: "Wireless Gamepad",
          text: "The ROG Raikiri II Xbox Wireless is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the USB Type-A to Type-C cable, USB wireless dongle, warranty book, quick start guide, ROG sticker, two high-profile thumbsticks, stand charger, stand holder set, and case."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-azoth-extreme-gaming-keyboard": {
      id: "rog-azoth-extreme-gaming-keyboard",
      name: "ROG Azoth Extreme",
      category: "Keyboard",
      specsLine: "ASUS ROG | Wireless Keyboard | RGB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-azoth-extreme-gaming-keyboard",
      images: Array.from({ length: 8 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349575/rog-azoth-extreme-gaming-keyboard-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For premium gaming setups, keyboard enthusiasts, and competitive players who want a high-end wireless mechanical keyboard with ROG NX switches, per-key RGB, Bluetooth, 2.4GHz wireless, USB wired mode, 8000Hz report rate support, and a full accessory bundle.",
      specs: [
        ["Product Name", "ROG Azoth Extreme"],
        ["Accessory Type", "Keyboard"],
        ["Brand", "ASUS ROG"],
        ["Color", "Black"],
        ["Key Switch", "ROG NX Mechanical Switches"],
        ["Switch Options", "Snow / Storm"],
        ["Connectivity", "USB 2.0 Type-C to Type-A, Bluetooth 5.1, RF 2.4GHz"],
        ["Lighting", "Per-key RGB"],
        ["AURA Sync", "Yes"],
        ["Anti-Ghosting", "N-Key Rollover"],
        ["Macro Keys", "All keys programmable"],
        ["USB Report Rate", "8000Hz with ROG Polling Rate Booster"],
        ["RF 2.4GHz Report Rate", "8000Hz with ROG Polling Rate Booster"],
        ["Cable", "2m USB Type-A to Type-C braided cable"],
        ["Software Support", "Armoury Crate"],
        ["Operating System", "Windows 11, macOS 10.11 or later"],
        ["Dimensions", "332 × 139 × 40mm"],
        ["Weight", "2200g with wrist rest"]
      ],
      included: [
        {
          title: "Gaming Keyboard",
          text: "The ROG Azoth Extreme Gaming Keyboard is included as the main accessory, inspected and prepared for the order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Official package contents include the wrist rest, ROG nameplate, two sets of magnetic feet, ROG Polling Rate Booster, ROG keycap puller, ROG switch puller, Ctrl keycap, two ROG NX switches, USB dongle, USB extender, 2m USB-C to USB-A cable, ROG cleaning cloth, silicone pins, foam stickers for stabilizer swaps, ROG sticker, quick start guide, warranty booklet, and ROG thank you card."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "ugreen-nasync-dxp8800-plus": createUgreenNasProduct({
      id: "ugreen-nasync-dxp8800-plus",
      name: "UGREEN NASync DXP8800 Plus",
      model: "DXP8800 Plus",
      specsLine: "UGREEN NASync | 8-Bay | 272TB",
      driveBays: "8 x SATA bays, 2 x M.2 NVMe slots",
      maximumStorage: "Up to 272TB",
      processor: "12th Gen Intel Core i5-1235U 10-core CPU",
      memory: "8GB DDR5, expandable to 64GB",
      networking: "2 x 10GbE LAN",
      ports: "2 x Thunderbolt 4, USB 3.2 Gen 2, HDMI 8K, SD card slot, PCIe x4",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397914/UGREEN_NASync_DXP8800Plus.jpg",
      whoIsThisFor: "A high-capacity 8-bay NAS for creators, teams, and power users who need fast shared storage, dual 10GbE networking, Thunderbolt 4, and room for large media libraries.",
      extraSpecs: [["RAID Support", "JBOD, Basic, RAID 0, RAID 1, RAID 5, RAID 6, RAID 10"], ["Use Case", "Team storage, media libraries, backup, Docker, and high-speed file sharing"]]
    }),

    "ugreen-nasync-dxp2800": createUgreenNasProduct({
      id: "ugreen-nasync-dxp2800",
      name: "UGREEN NASync DXP2800",
      model: "DXP2800",
      specsLine: "UGREEN NASync | 2-Bay | 80TB",
      driveBays: "2 x SATA bays, 2 x M.2 NVMe slots",
      maximumStorage: "Up to 80TB",
      processor: "12th Gen Intel N100 quad-core CPU",
      memory: "8GB DDR5",
      networking: "1 x 2.5GbE LAN",
      ports: "USB-C, USB-A, HDMI 4K, 2.5GbE LAN",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397913/UGREEN_NASync_DXP2800.jpg",
      whoIsThisFor: "A compact 2-bay NAS for home users, creators, and small offices that want private cloud storage, automatic backups, media streaming, and faster-than-gigabit networking.",
      extraSpecs: [["System Type", "Diskless NAS enclosure"], ["Media Features", "4K HDMI output and AI-powered photo management"], ["Storage Drives", "Compatible with 3.5-inch and 2.5-inch SATA drives plus M.2 SSDs"]]
    }),

    "ugreen-nasync-dxp480t-plus": createUgreenNasProduct({
      id: "ugreen-nasync-dxp480t-plus",
      name: "UGREEN NASync DXP480T Plus",
      model: "DXP480T Plus",
      specsLine: "UGREEN NASync | All-Flash | 32TB",
      driveBays: "4 x M.2 NVMe SSD slots",
      maximumStorage: "Up to 32TB all-flash storage",
      processor: "12th Gen Intel Core i5-1235U 10-core CPU",
      memory: "8GB DDR5, expandable to 64GB",
      networking: "1 x 10GbE LAN, Wi-Fi 6",
      ports: "Thunderbolt 4, 10GbE LAN, HDMI 8K, USB ports",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397913/UGREEN_NASync_DXP480T.jpg",
      whoIsThisFor: "An all-flash NAS for creators and editors who need quiet, compact, high-speed storage for active projects, media libraries, and remote access.",
      extraSpecs: [["Storage Type", "NVMe all-flash"], ["Peak Network Speed", "10GbE supports up to 1250MB/s theoretical transfer speed"], ["Use Case", "Video editing, high-speed media work, and SSD-based shared storage"]]
    }),

    "ugreen-nasync-dh2300": createUgreenNasProduct({
      id: "ugreen-nasync-dh2300",
      name: "UGREEN NASync DH2300",
      model: "DH2300",
      specsLine: "UGREEN NASync | 2-Bay | 64TB",
      driveBays: "2 x SATA bays",
      maximumStorage: "Up to 64TB",
      processor: "Rockchip RK3576 8-core processor",
      memory: "4GB LPDDR4X",
      networking: "1 x 1GbE LAN",
      ports: "1 x USB-C, 2 x USB-A, 1GbE LAN, HDMI 4K",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397913/UGREEN_NASync_DH2300.jpg",
      whoIsThisFor: "A beginner-friendly 2-bay NAS for families and home users who want easy private cloud storage, backups, photo organization, and media access.",
      extraSpecs: [["AI Performance", "6 TOPS local AI processing"], ["System Storage", "32GB internal storage for UGOS Pro"], ["RAID Support", "JBOD, Basic, RAID 0, RAID 1"]]
    }),

    "ugreen-nasync-dxp6800-pro": createUgreenNasProduct({
      id: "ugreen-nasync-dxp6800-pro",
      name: "UGREEN NASync DXP6800 Pro",
      model: "DXP6800 Pro",
      specsLine: "UGREEN NASync | 6-Bay | 208TB",
      driveBays: "6 x SATA bays, 2 x M.2 NVMe slots",
      maximumStorage: "Up to 208TB",
      processor: "12th Gen Intel Core i5-1235U 10-core CPU",
      memory: "8GB DDR5, expandable to 64GB",
      networking: "2 x 10GbE LAN",
      ports: "2 x Thunderbolt 4, HDMI 8K, SD card slot, USB 3.2, USB 2.0",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397908/UGREEN_NASync_DXP6800Pro.jpg",
      whoIsThisFor: "A powerful 6-bay NAS for small teams, creators, and advanced home labs that need fast networking, Thunderbolt 4, expandable memory, and large storage pools.",
      extraSpecs: [["RAID Support", "JBOD, Basic, RAID 0, RAID 1, RAID 5, RAID 6, RAID 10"], ["Use Case", "Team collaboration, shared media storage, backups, and high-speed file transfers"]]
    }),

    "ugreen-nasync-dh4300-plus": createUgreenNasProduct({
      id: "ugreen-nasync-dh4300-plus",
      name: "UGREEN NASync DH4300 Plus",
      model: "DH4300 Plus",
      specsLine: "UGREEN NASync | 4-Bay | 128TB",
      driveBays: "4 x SATA bays",
      maximumStorage: "Up to 128TB",
      processor: "Rockchip RK3588 8-core processor",
      memory: "8GB LPDDR4X",
      networking: "1 x 2.5GbE LAN",
      ports: "USB-C, USB-A, HDMI, 2.5GbE LAN",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397907/UGREEN_NASync_DH4300_Plus.jpg",
      whoIsThisFor: "A starter-friendly 4-bay NAS for home and small office users who want larger local backup capacity, photo management, and private cloud access.",
      extraSpecs: [["AI Performance", "6 TOPS local AI processing"], ["M.2 Storage", "Not supported"], ["RAID Support", "JBOD, Basic, RAID 0, RAID 1, RAID 5, RAID 6, RAID 10"]]
    }),

    "ugreen-nasync-dxp4800-plus": createUgreenNasProduct({
      id: "ugreen-nasync-dxp4800-plus",
      name: "UGREEN NASync DXP4800 Plus",
      model: "DXP4800 Plus",
      specsLine: "UGREEN NASync | 4-Bay | 144TB",
      driveBays: "4 x SATA bays, 2 x M.2 NVMe slots",
      maximumStorage: "Up to 144TB",
      processor: "Intel Pentium Gold 8505 5-core CPU",
      memory: "8GB DDR5, expandable to 64GB",
      networking: "1 x 10GbE LAN, 1 x 2.5GbE LAN",
      ports: "USB-C 10Gbps, USB-A, SD card slot, HDMI 4K, Ethernet",
      image: "https://res.cloudinary.com/dhtamisqn/image/upload/v1782397907/UGREEN_NASync_DXP4800Plus.jpg",
      whoIsThisFor: "A versatile 4-bay NAS for freelancers, creators, and small offices that need fast 10GbE transfers, SSD caching, automatic backups, and private cloud storage.",
      extraSpecs: [["Storage Drives", "Compatible with 3.5-inch and 2.5-inch SATA drives plus M.2 SSDs"], ["Transfer Speed", "10GbE supports up to 1250MB/s theoretical transfer speed"], ["RAID Support", "JBOD, Basic, RAID 0, RAID 1, RAID 5, RAID 6, RAID 10"]]
    })
  };
}());
