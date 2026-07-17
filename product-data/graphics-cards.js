(function () {
  window.tcsGraphicsCardProducts = {
    "intel-arc-b580-12gb": {
      id: "intel-arc-b580-12gb",
      name: "Intel Arc B580 12GB",
      category: "Graphics Card",
      specsLine: "Intel | Arc B580 | 12GB GDDR6",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=intel-arc-b580-12gb",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783114801/intel-arc-b580-12gb-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A value-focused 12GB graphics card for 1080p and 1440p gaming, everyday creator workloads, streaming, and users who want modern Intel Arc features with strong VRAM capacity.",
      specs: [
        // Official source: https://www.intel.com/content/www/us/en/products/sku/241598/intel-arc-b580-graphics/specifications.html
        ["Product Name", "Intel Arc B580 Graphics 12GB"],
        ["Brand", "Intel"],
        ["GPU Model", "Intel Arc B580"],
        ["Architecture", "Intel Xe2 / Battlemage"],
        ["Xe-Cores", "20"],
        ["Ray Tracing Units", "20"],
        ["XMX Engines", "160"],
        ["Graphics Clock", "2670 MHz"],
        ["Card Bus", "PCIe 4.0 x8"],
        ["Memory Size", "12GB"],
        ["Memory Type", "GDDR6"],
        ["Memory Speed", "19Gbps"],
        ["Memory Bus", "192-bit"],
        ["Memory Bandwidth", "456GB/s"],
        ["Total Board Power", "190W"],
        ["Card Size", "272 x 115 mm"],
        ["Slot Size", "2"],
        ["Recommended PSU", "600W"],
        ["Power Connector", "1 x 8-pin"],
        ["Use Case", "1080p and 1440p gaming, streaming, and everyday creator workloads"]
      ],
      included: [
        { title: "Graphics Card", text: "The Intel Arc B580 12GB graphics card is included as the main component." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Required Accessories", text: "Included accessories depend on the manufacturer package contents and may include documentation or adapters when supplied by Intel." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "rtx-5090-aorus-master": {
      id: "rtx-5090-aorus-master",
      name: "Aorus RTX 5090 Master 32GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5090 | AORUS Master",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5090-aorus-master",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349349/gigabyte-rtx-5090-aorus-master-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "Flagship graphics performance for extreme gaming, high-end rendering, AI workloads, and uncompromised creator systems.",
      specs: [
        ["Product Name", "AORUS GeForce RTX 5090 MASTER 32G"],
        ["Graphics Processing", "GeForce RTX 5090"],
        ["CUDA Cores", "21,760"],
        ["Memory Size", "32GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "512-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Cooling", "WINDFORCE cooling system"],
        ["Display Features", "LCD Edge View, RGB Halo"],
        ["BIOS", "Dual BIOS: Performance / Silent"],
        ["Warranty", "4 years with online registration"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The AORUS GeForce RTX 5090 MASTER 32G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Required Accessories",
          text: "Included accessories depend on the manufacturer package contents and may include required adapters, documentation, or support brackets when supplied by Gigabyte."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5080-aorus-master": {
      id: "rtx-5080-aorus-master",
      name: "Aorus RTX 5080 Master 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5080 | AORUS Master",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5080-aorus-master",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;

        if (imageNumber === 1) {
          return "https://res.cloudinary.com/dhtamisqn/image/upload/v1783195402/aorus-geforce-rtx5080-master-16g-1.jpg";
        }

        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349349/gigabyte-rtx-5090-aorus-master-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "High-end graphics performance for 4K gaming, streaming, rendering, AI workloads, and premium creator systems that need strong cooling and 16GB of GDDR7 memory.",
      specs: [
        // TODO: Confirm Card Size and Slot Size from the official Gigabyte specification page before adding compatibility values.
        ["Product Name", "AORUS GeForce RTX 5080 MASTER 16G"],
        ["Graphics Processing", "GeForce RTX 5080"],
        ["CUDA Cores", "10,752"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "256-bit"],
        ["Memory Clock", "30Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Cooling", "WINDFORCE cooling system"],
        ["Display Features", "LCD Edge View, RGB Halo"],
        ["BIOS", "Dual BIOS: Performance / Silent"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "850W"],
        ["Warranty", "4 years with online registration"]
      ],
      included: [
        { title: "Graphics Card", text: "The AORUS GeForce RTX 5080 MASTER 16G graphics card is included as the main component, inspected and prepared for the build or order." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes." },
        { title: "Required Accessories", text: "Included accessories depend on the manufacturer package contents and may include required adapters, documentation, or support brackets when supplied by Gigabyte." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "rtx-5070-aorus-master": {
      id: "rtx-5070-aorus-master",
      name: "Aorus RTX 5070 Master 12GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5070 | AORUS Master",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5070-aorus-master",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;

        if (imageNumber === 1) {
          return "https://res.cloudinary.com/dhtamisqn/image/upload/v1783195406/aorus-geforce-rtx5070-master-12g-1.jpg";
        }

        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349349/gigabyte-rtx-5090-aorus-master-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "Premium RTX 5070 graphics performance for high-refresh gaming, streaming, content creation, and clean AORUS builds that need strong cooling and 12GB of GDDR7 memory.",
      specs: [
        ["Product Name", "AORUS GeForce RTX 5070 MASTER 12G"],
        ["Graphics Processing", "GeForce RTX 5070"],
        ["CUDA Cores", "6,144"],
        ["Memory Size", "12GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "192-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Cooling", "WINDFORCE cooling system"],
        ["Display Features", "LCD Edge View, RGB Halo"],
        ["BIOS", "Dual BIOS: Performance / Silent"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "750W"],
        ["Warranty", "4 years with online registration"]
      ],
      included: [
        { title: "Graphics Card", text: "The AORUS GeForce RTX 5070 MASTER 12G graphics card is included as the main component, inspected and prepared for the build or order." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes." },
        { title: "Required Accessories", text: "Included accessories depend on the manufacturer package contents and may include required adapters, documentation, or support brackets when supplied by Gigabyte." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "msi-rtx5080-gaming-trio-oc-16gb": {
      id: "msi-rtx5080-gaming-trio-oc-16gb",
      name: "MSI GeForce RTX 5080 16G Gaming Trio OC",
      category: "Graphics Card",
      specsLine: "MSI | RTX 5080 | 16GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=msi-rtx5080-gaming-trio-oc-16gb",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782327775/msi-rtx5080-gaming-trio-oc-16gb-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A high-end RTX 5080 graphics card for 4K gaming, streaming, rendering, AI workloads, and premium custom PC builds that need strong cooling and 16GB of GDDR7 memory.",
      specs: [
        ["Product Name", "MSI GeForce RTX 5080 16G Gaming Trio OC"],
        ["Model Name", "G5080-16GTC"],
        ["Graphics Processing Unit", "NVIDIA GeForce RTX 5080"],
        ["CUDA Cores", "10,752"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Speed", "30Gbps"],
        ["Memory Bus", "256-bit"],
        ["Interface", "PCI Express Gen 5"],
        ["Core Clock", "Boost: 2700MHz, Extreme Performance: 2715MHz through MSI Center"],
        ["Outputs", "3 x DisplayPort 2.1b, 1 x HDMI 2.1b"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Displays", "4"],
        ["Power Consumption", "360W"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "850W"],
        ["Card Dimensions", "338 x 140 x 50mm"],
        ["Card Weight", "1362g"]
      ],
      included: [
        { title: "Graphics Card", text: "The MSI GeForce RTX 5080 16G Gaming Trio OC graphics card is included as the main component." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Required Accessories", text: "Included accessories depend on the manufacturer package contents and may include adapters, documentation, or support brackets when supplied by MSI." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "asus-proart-rtx5080-o16g": {
      id: "asus-proart-rtx5080-o16g",
      name: "ASUS ProArt GeForce RTX 5080 16GB GDDR7 OC Edition",
      category: "Graphics Card",
      specsLine: "ASUS ProArt | RTX 5080 | 16GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-proart-rtx5080-o16g",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782238837/asus-proart-rtx5080-o16g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A creator-focused RTX 5080 graphics card for rendering, design, video editing, AI workloads, and high-end workstation or gaming builds with a cleaner ProArt design.",
      specs: [
        ["Product Name", "ProArt GeForce RTX 5080 16GB GDDR7 OC Edition"],
        ["Model", "PROART-RTX5080-O16G"],
        ["Graphics Engine", "NVIDIA GeForce RTX 5080"],
        ["AI Performance", "1801 TOPs"],
        ["CUDA Cores", "10,752"],
        ["Video Memory", "16GB GDDR7"],
        ["Memory Speed", "30Gbps"],
        ["Memory Interface", "256-bit"],
        ["Bus Standard", "PCI Express 5.0"],
        ["Engine Clock", "OC Mode: 2730MHz, Default Mode: 2700MHz Boost"],
        ["Interface", "1 x HDMI 2.1b, 2 x DisplayPort 2.1b, 1 x USB Type-C"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Display Support", "4"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "850W"],
        ["Slot", "2.5 Slot"],
        ["SFF Ready", "Compatible"],
        ["Dimensions", "304 x 126 x 50mm"]
      ],
      included: [
        { title: "Graphics Card", text: "The ASUS ProArt GeForce RTX 5080 OC Edition graphics card is included as the main component." },
        { title: "Included Accessories", text: "ASUS lists a speed setup manual, 1-to-3 adapter cable, ProArt graphics card holder, ASUS Velcro hook and loop, and thank you card." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "msi-rtx5070-ti-gaming-trio-oc-16gb": {
      id: "msi-rtx5070-ti-gaming-trio-oc-16gb",
      name: "MSI GeForce RTX 5070 Ti 16G Gaming Trio OC",
      category: "Graphics Card",
      specsLine: "MSI | RTX 5070 Ti | 16GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=msi-rtx5070-ti-gaming-trio-oc-16gb",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782327775/msi-rtx5080-gaming-trio-oc-16gb-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A high-performance RTX 5070 Ti graphics card for 1440p and 4K gaming, streaming, rendering, AI workloads, and premium custom PC builds.",
      specs: [
        ["Product Name", "MSI GeForce RTX 5070 Ti 16G Gaming Trio OC"],
        ["Model Name", "G507T-16GTC"],
        ["Graphics Processing Unit", "NVIDIA GeForce RTX 5070 Ti"],
        ["CUDA Cores", "8,960"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Speed", "28Gbps"],
        ["Memory Bus", "256-bit"],
        ["Interface", "PCI Express Gen 5"],
        ["Core Clock", "Boost: 2572MHz, Extreme Performance: 2580MHz through MSI Center"],
        ["Outputs", "3 x DisplayPort 2.1b, 1 x HDMI 2.1b"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Displays", "4"],
        ["Power Consumption", "300W"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "750W"],
        ["Card Dimensions", "338 x 140 x 50mm"],
        ["Card Weight", "1296g"]
      ],
      included: [
        { title: "Graphics Card", text: "The MSI GeForce RTX 5070 Ti 16G Gaming Trio OC graphics card is included as the main component." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Required Accessories", text: "Included accessories depend on the manufacturer package contents and may include adapters, documentation, or support brackets when supplied by MSI." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "asus-tuf-rtx5070ti-o16g-gaming": {
      id: "asus-tuf-rtx5070ti-o16g-gaming",
      name: "ASUS TUF Gaming GeForce RTX 5070 Ti 16GB GDDR7 OC Edition",
      category: "Graphics Card",
      specsLine: "ASUS TUF | RTX 5070 Ti | 16GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-tuf-rtx5070ti-o16g-gaming",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782331268/asus-tuf-rtx5070-ti-oc-16gb-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A durable ASUS TUF RTX 5070 Ti graphics card for high-refresh gaming, 4K play, streaming, rendering, and custom builds that need strong cooling and ARGB styling.",
      specs: [
        ["Product Name", "ASUS TUF Gaming GeForce RTX 5070 Ti 16GB GDDR7 OC Edition"],
        ["Model", "TUF-RTX5070TI-O16G-GAMING"],
        ["Graphics Engine", "NVIDIA GeForce RTX 5070 Ti"],
        ["AI Performance", "1406 TOPs"],
        ["CUDA Cores", "8,960"],
        ["Video Memory", "16GB GDDR7"],
        ["Memory Speed", "28Gbps"],
        ["Memory Interface", "256-bit"],
        ["Bus Standard", "PCI Express 5.0"],
        ["Engine Clock", "OC Mode: 2610MHz, Default Mode: 2588MHz Boost"],
        ["Interface", "2 x HDMI 2.1b, 3 x DisplayPort 2.1b"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Display Support", "4"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "850W"],
        ["Slot", "3.125 Slot"],
        ["Aura Sync", "ARGB"],
        ["Dimensions", "329 x 140 x 62.5mm"]
      ],
      included: [
        { title: "Graphics Card", text: "The ASUS TUF Gaming GeForce RTX 5070 Ti OC Edition graphics card is included as the main component." },
        { title: "Included Accessories", text: "ASUS lists a speed setup manual, TUF graphics card holder, TUF Velcro hook and loop, TUF magnet, TUF Gaming certificate, thank you card, and 1-to-3 adapter cable." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "msi-rtx5060-ti-16g-gaming-trio-oc-white": {
      id: "msi-rtx5060-ti-16g-gaming-trio-oc-white",
      name: "MSI GeForce RTX 5060 Ti 16G Gaming Trio OC White",
      category: "Graphics Card",
      specsLine: "MSI | RTX 5060 Ti | 16GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=msi-rtx5060-ti-16g-gaming-trio-oc-white",
      images: Array.from({ length: 4 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782332397/msi-rtx5060-ti-16g-gaming-trio-oc-white-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A white RTX 5060 Ti graphics card for clean white builds, 1080p and 1440p gaming, streaming, and creator workloads that benefit from 16GB of GDDR7 memory.",
      specs: [
        ["Product Name", "MSI GeForce RTX 5060 Ti 16G Gaming Trio OC White"],
        ["Model Name", "G506T-16GTCW"],
        ["Graphics Processing Unit", "NVIDIA GeForce RTX 5060 Ti"],
        ["CUDA Cores", "4,608"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Speed", "28Gbps"],
        ["Memory Bus", "128-bit"],
        ["Interface", "PCI Express Gen 5 x16, uses x8"],
        ["Core Clock", "Boost: 2647MHz, Extreme Performance: 2662MHz through MSI Center"],
        ["Outputs", "3 x DisplayPort 2.1b, 1 x HDMI 2.1b"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Displays", "4"],
        ["Power Consumption", "180W"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "600W"],
        ["Card Dimensions", "300 x 125 x 44mm"],
        ["Card Weight", "844g"]
      ],
      included: [
        { title: "Graphics Card", text: "The MSI GeForce RTX 5060 Ti 16G Gaming Trio OC White graphics card is included as the main component." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Required Accessories", text: "Included accessories depend on the manufacturer package contents and may include adapters, documentation, or support brackets when supplied by MSI." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "asus-rog-astral-rtx5090-oc-32gb": {
      id: "asus-rog-astral-rtx5090-oc-32gb",
      name: "ASUS ROG Astral GeForce RTX 5090 32GB GDDR7 OC Edition",
      category: "Graphics Card",
      specsLine: "ASUS ROG | RTX 5090 | 32GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-rog-astral-rtx5090-oc-32gb",
      images: Array.from({ length: 8 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782334809/asus-rog-astral-rtx5090-oc-32gb-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A flagship RTX 5090 graphics card for extreme 4K gaming, rendering, AI workloads, and high-end enthusiast custom PC builds.",
      specs: [
        ["Product Name", "ROG Astral GeForce RTX 5090 32GB GDDR7 OC Edition"],
        ["Model", "ROG-ASTRAL-RTX5090-O32G-GAMING"],
        ["Graphics Engine", "NVIDIA GeForce RTX 5090"],
        ["AI Performance", "3352 TOPs"],
        ["CUDA Cores", "21,760"],
        ["Video Memory", "32GB GDDR7"],
        ["Memory Speed", "28Gbps"],
        ["Memory Interface", "512-bit"],
        ["Bus Standard", "PCI Express 5.0"],
        ["Engine Clock", "OC Mode: 2610MHz, Default Mode: 2580MHz Boost"],
        ["Interface", "2 x HDMI 2.1b, 3 x DisplayPort 2.1b"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Display Support", "4"],
        ["Power Connector", "1 x 16-pin"],
        ["Recommended PSU", "1000W"],
        ["Slot", "3.8 Slot"],
        ["Aura Sync", "ARGB"],
        ["Dimensions", "357.6 x 149.3 x 76mm"]
      ],
      included: [
        { title: "Graphics Card", text: "The ASUS ROG Astral GeForce RTX 5090 OC Edition graphics card is included as the main component." },
        { title: "Included Accessories", text: "ASUS lists a speed setup manual, ROG graphics card holder, ROG Velcro hook and loop, ROG magnet, ROG graphics card keycap, ROG PCB ruler, thank you card, and 1-to-4 adapter cable." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "asus-dual-rtx5060-o8g": {
      id: "asus-dual-rtx5060-o8g",
      name: "ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition",
      category: "Graphics Card",
      specsLine: "ASUS Dual | RTX 5060 | 8GB GDDR7",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-dual-rtx5060-o8g",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1782335728/asus-dual-rtx5060-o8g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A compact RTX 5060 graphics card for 1080p gaming, efficient creator workloads, and smaller custom PC builds that need an 8GB GDDR7 GPU.",
      specs: [
        ["Product Name", "ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition"],
        ["Model", "DUAL-RTX5060-O8G"],
        ["Graphics Engine", "NVIDIA GeForce RTX 5060"],
        ["AI Performance", "614 TOPs"],
        ["CUDA Cores", "3,840"],
        ["Video Memory", "8GB GDDR7"],
        ["Memory Speed", "28Gbps"],
        ["Memory Interface", "128-bit"],
        ["Bus Standard", "PCI Express 5.0"],
        ["Engine Clock", "OC Mode: 2565MHz, Default Mode: 2535MHz Boost"],
        ["Interface", "1 x HDMI 2.1b, 3 x DisplayPort 2.1b"],
        ["Maximum Resolution", "7680 x 4320"],
        ["Maximum Display Support", "4"],
        ["Power Connector", "1 x 8-pin"],
        ["Recommended PSU", "550W"],
        ["Slot", "2.5 Slot"],
        ["Dimensions", "228 x 123 x 50mm"]
      ],
      included: [
        { title: "Graphics Card", text: "The ASUS Dual GeForce RTX 5060 OC Edition graphics card is included as the main component." },
        { title: "Included Accessories", text: "ASUS lists a speed setup manual and thank you card." },
        { title: "Original Packaging", text: "The product comes with its original box and packaging where available." },
        { title: "Store Support", text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop." }
      ]
    },

    "rtx-5060-ti-aorus-elite": {
      id: "rtx-5060-ti-aorus-elite",
      name: "Aorus RTX 5060 Ti Elite 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5060 Ti | AORUS Elite 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5060-ti-aorus-elite",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349326/gigabyte-rtx-5060-ti-aorus-elite-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A strong choice for high-quality 1080p and 1440p gaming, smooth everyday performance, streaming, and creator workloads that benefit from modern NVIDIA features and 16GB of VRAM.",
      specs: [
        ["Product Name", "AORUS GeForce RTX 5060 Ti ELITE 16G"],
        ["Graphics Processing", "GeForce RTX 5060 Ti"],
        ["Core Clock", "2722 MHz"],
        ["CUDA Cores", "4,608"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=329 W=128 H=41 mm"],
        ["Recommended PSU", "650W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The AORUS GeForce RTX 5060 Ti ELITE 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide, warranty registration, and AORUS metal sticker."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5070-gaming-oc": {
      id: "rtx-5070-gaming-oc",
      name: "Gigabyte RTX 5070 Gaming OC 12GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5070 | Gaming OC 12G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5070-gaming-oc",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349308/gigabyte-rtx-5070-gaming-oc-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A premium choice for smooth 1440p gaming, high-refresh competitive play, streaming, and creator workloads that need strong modern GPU performance without stepping into flagship-level pricing.",
      specs: [
        ["Product Name", "GeForce RTX 5070 GAMING OC 12G"],
        ["Graphics Processing", "GeForce RTX 5070"],
        ["Core Clock", "2625 MHz"],
        ["CUDA Cores", "6,144"],
        ["Memory Size", "12GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "192-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=327 W=132 H=56 mm"],
        ["Recommended PSU", "750W"],
        ["Power Connector", "16-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5070 GAMING OC 12G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide, warranty registration, 1x 12V-2x6 to 2x PCIe 8-pin adapter, versatile VGA holder, and versatile VGA holder manual."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5060-eagle-oc": {
      id: "rtx-5060-eagle-oc",
      name: "Gigabyte RTX 5060 Eagle OC 8GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5060 | Eagle OC 8G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5060-eagle-oc",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349198/gigabyte-rtx-5060-eagle-oc-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A clean choice for efficient 1080p gaming, esports titles, everyday PC builds, streaming, and users who want modern NVIDIA features in a compact, lower-power graphics card.",
      specs: [
        ["Product Name", "GeForce RTX 5060 EAGLE OC 8G"],
        ["Graphics Processing", "GeForce RTX 5060"],
        ["Core Clock", "2550 MHz"],
        ["CUDA Cores", "3,840"],
        ["Memory Size", "8GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=208 W=120 H=40 mm"],
        ["Recommended PSU", "550W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5060 EAGLE OC 8G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5050-gaming-oc": {
      id: "rtx-5050-gaming-oc",
      name: "Gigabyte RTX 5050 Gaming OC 8GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5050 | Gaming OC 8G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5050-gaming-oc",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349323/gigabyte-rtx-5050-gaming-oc-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A practical choice for 1080p gaming, esports titles, compact gaming builds, and everyday users who want a modern RTX card with DLSS support without moving into higher-end GPU pricing.",
      specs: [
        ["Product Name", "GeForce RTX 5050 GAMING OC 8G"],
        ["Graphics Processing", "GeForce RTX 5050"],
        ["Core Clock", "2632 MHz"],
        ["CUDA Cores", "2,560"],
        ["Memory Size", "8GB"],
        ["Memory Type", "GDDR6"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "20Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=280 W=117 H=40 mm"],
        ["Recommended PSU", "550W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 2, HDMI 2.1b × 2"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5050 GAMING OC 8G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5060-windforce-max-oc-8g": {
      id: "rtx-5060-windforce-max-oc-8g",
      name: "Gigabyte RTX 5060 Windforce Max OC 8GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5060 | Windforce MAX OC 8G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5060-windforce-max-oc-8g",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1781349231/gigabyte-rtx-5060-windforce-max-oc-8g-1.jpg",
        ...Array.from({ length: 9 }, (_, index) => {
          const imageNumber = index + 2;
          return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349231/gigabyte-rtx-5060-windforce-max-oc-8g-${imageNumber}.jpg`;
        })
      ],
      whoIsThisFor: "A compact and efficient graphics card for 1080p gaming, esports titles, everyday gaming builds, streaming, and users who want modern RTX 50-series features, 8GB of GDDR7 memory, PCIe 5.0 support, and a smaller Windforce MAX cooling design.",
      specs: [
        ["Product Name", "GeForce RTX 5060 WINDFORCE MAX OC 8G"],
        ["Graphics Processing", "GeForce RTX 5060"],
        ["Core Clock", "2512 MHz"],
        ["CUDA Cores", "3,840"],
        ["Memory Size", "8GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Multi-view", "4"],
        ["Card Size", "L=199 W=116 H=40 mm"],
        ["PCB Form", "ATX"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Recommended PSU", "550W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5060 WINDFORCE MAX OC 8G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5060-ti-windforce-max-oc": {
      id: "rtx-5060-ti-windforce-max-oc",
      name: "Gigabyte RTX 5060 Ti Windforce Max OC 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5060 Ti | Windforce MAX OC 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5060-ti-windforce-max-oc",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349231/gigabyte-rtx-5060-windforce-max-oc-8g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A compact and efficient choice for 1080p and 1440p gaming, streaming, and creator workloads that benefit from 16GB of VRAM without needing a large triple-fan graphics card.",
      specs: [
        ["Product Name", "GeForce RTX 5060 Ti WINDFORCE MAX OC 16G"],
        ["Graphics Processing", "GeForce RTX 5060 Ti"],
        ["Core Clock", "2587 MHz"],
        ["CUDA Cores", "4,608"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=208 W=120 H=40 mm"],
        ["Recommended PSU", "650W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5060 Ti WINDFORCE MAX OC 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5070-ti-eagle-oc-sff-16g": {
      id: "rtx-5070-ti-eagle-oc-sff-16g",
      name: "Gigabyte RTX 5070 Ti Eagle OC SFF 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5070 Ti | Eagle OC SFF 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5070-ti-eagle-oc-sff-16g",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1781349233/gigabyte-rtx-5070-ti-eagle-oc-sff-16g-1.jpg",
        ...Array.from({ length: 9 }, (_, index) => {
          const imageNumber = index + 2;
          return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349233/gigabyte-rtx-5070-ti-eagle-oc-sff-16g-${imageNumber}.jpg`;
        })
      ],
      whoIsThisFor: "A compact high-performance graphics card for 1440p and high-refresh gaming, streaming, AI-assisted creator work, and SFF-ready builds that need RTX 5070 Ti performance, 16GB of GDDR7 memory, DLSS 4, PCIe 5.0, and strong cooling in a smaller Eagle OC design.",
      specs: [
        ["Product Name", "GeForce RTX 5070 Ti EAGLE OC SFF 16G"],
        ["Graphics Processing", "GeForce RTX 5070 Ti"],
        ["Core Clock", "2542 MHz"],
        ["CUDA Cores", "8,960"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "256-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Multi-view", "4"],
        ["Card Size", "L=304 W=126 H=50 mm"],
        ["PCB Form", "ATX"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Recommended PSU", "750W"],
        ["Power Connector", "16-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5070 Ti EAGLE OC SFF 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a VGA manual, 1x 12V-2x6 to 2x PCIe 8-pin adapter, versatile VGA holder, and versatile VGA holder manual."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5070-eagle-oc-sff": {
      id: "rtx-5070-eagle-oc-sff",
      name: "Gigabyte RTX 5070 Eagle OC SFF 12GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5070 | Eagle OC SFF 12G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5070-eagle-oc-sff",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349233/gigabyte-rtx-5070-ti-eagle-oc-sff-16g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A strong choice for compact high-performance builds, smooth 1440p gaming, streaming, and creator workloads that need RTX 5070 performance in a smaller SFF-friendly graphics card.",
      specs: [
        ["Product Name", "GeForce RTX 5070 EAGLE OC SFF 12G"],
        ["Graphics Processing", "GeForce RTX 5070"],
        ["Core Clock", "2587 MHz"],
        ["CUDA Cores", "6,144"],
        ["Memory Size", "12GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "192-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=290 W=120 H=50 mm"],
        ["Recommended PSU", "750W"],
        ["Power Connector", "16-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5070 EAGLE OC SFF 12G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide and 1x 12V-2x6 to 2x PCIe 8-pin adapter."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5060-eagle-max-oc": {
      id: "rtx-5060-eagle-max-oc",
      name: "Gigabyte RTX 5060 Eagle Max OC 8GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5060 | Eagle MAX OC 8G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5060-eagle-max-oc",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349232/gigabyte-rtx-5060-eagle-max-oc-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A solid choice for efficient 1080p gaming, esports titles, streaming, and everyday builds that need modern RTX features with a slightly larger Eagle MAX cooling design.",
      specs: [
        ["Product Name", "GeForce RTX 5060 EAGLE MAX OC 8G"],
        ["Graphics Processing", "GeForce RTX 5060"],
        ["Core Clock", "2550 MHz"],
        ["CUDA Cores", "3,840"],
        ["Memory Size", "8GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "28Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Card Size", "L=281 W=115 H=40 mm"],
        ["Recommended PSU", "550W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5060 EAGLE MAX OC 8G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-strix-rtx5070ti-o16g-gaming": {
      id: "rog-strix-rtx5070ti-o16g-gaming",
      name: "ROG Strix RTX 5070 Ti OC 16GB",
      category: "Graphics Card",
      specsLine: "ASUS ROG | RTX 5070 Ti | 16GB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-strix-rtx5070ti-o16g-gaming",
      images: Array.from({ length: 9 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349116/rog-strix-rtx5070ti-o16g-gaming-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A premium RTX 5070 Ti graphics card for high-refresh 1440p gaming, 4K gaming, streaming, rendering, AI-assisted workloads, and high-end builds that need 16GB of GDDR7 memory, strong cooling, PCIe 5.0 support, and ASUS ROG Strix styling.",
      specs: [
        ["Product Name", "ROG Strix GeForce RTX 5070 Ti 16GB GDDR7 OC Edition"],
        ["Graphic Engine", "NVIDIA GeForce RTX 5070 Ti"],
        ["AI Performance", "1406 TOPs"],
        ["Bus Standard", "PCI Express 5.0"],
        ["OpenGL", "OpenGL 4.6"],
        ["Video Memory", "16GB GDDR7"],
        ["Engine Clock", "OC Mode: 2625MHz / Default Mode: 2602MHz"],
        ["CUDA Cores", "8,960"],
        ["Memory Speed", "28Gbps"],
        ["Memory Interface", "256-bit"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Interface", "2× HDMI 2.1b, 3× DisplayPort 2.1b"],
        ["HDCP Support", "2.3"],
        ["Maximum Display Support", "4"],
        ["NVLink / CrossFire Support", "No"],
        ["Dimensions", "332 × 147.3 × 64mm"],
        ["Recommended PSU", "850W"],
        ["Power Connector", "1× 16-pin"],
        ["Slot", "3.2 Slot"],
        ["Aura Sync", "ARGB"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The ROG Strix GeForce RTX 5070 Ti 16GB GDDR7 OC Edition graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents may include a Speedsetup manual, ROG graphics card holder, ROG Velcro hook and loop, ROG magnet, ROG PCB ruler, thank you card, and 1-to-3 power cable."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rog-astral-lc-rtx5090-o32g-gaming": {
      id: "rog-astral-lc-rtx5090-o32g-gaming",
      name: "ROG Astral LC RTX 5090 OC 32GB",
      category: "Graphics Card",
      specsLine: "ASUS ROG | RTX 5090 | 32GB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rog-astral-lc-rtx5090-o32g-gaming",
      images: Array.from({ length: 9 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349107/asus-astral-rtx5090-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "For flagship gaming, rendering, AI workloads, creator systems, and high-end builds that need RTX 5090 performance, 32GB of GDDR7 memory, liquid cooling, PCIe 5.0 support, and ASUS ROG Astral styling.",
      specs: [
        ["Product Name", "ROG Astral LC GeForce RTX 5090 32GB GDDR7 OC Edition"],
        ["Graphic Engine", "NVIDIA GeForce RTX 5090"],
        ["AI Performance", "3352 TOPs"],
        ["Bus Standard", "PCI Express 5.0"],
        ["OpenGL", "OpenGL 4.6"],
        ["Video Memory", "32GB GDDR7"],
        ["Engine Clock", "OC Mode: 2610MHz / Default Mode: 2580MHz"],
        ["CUDA Cores", "21,760"],
        ["Memory Speed", "28Gbps"],
        ["Memory Interface", "512-bit"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Interface", "2× HDMI 2.1b, 3× DisplayPort 2.1b"],
        ["HDCP Support", "2.3"],
        ["Maximum Display Support", "4"],
        ["NVLink / CrossFire Support", "No"],
        ["Card Dimensions", "288.46 × 153.7 × 48mm"],
        ["Radiator Dimensions", "400 × 120 × 65mm"],
        ["Recommended PSU", "1000W"],
        ["Power Connector", "1× 16-pin"],
        ["Slot", "2.5 Slot"],
        ["Aura Sync", "ARGB"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The ROG Astral LC GeForce RTX 5090 32GB GDDR7 OC Edition graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents may include a Speedsetup manual, ROG graphics card holder, ROG Velcro hook and loop, ROG magnet, ROG PCB ruler, thank you card, and 1-to-4 adapter cable."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "zotac-gaming-rtx5080-amp-extreme-infinity": {
      id: "zotac-gaming-rtx5080-amp-extreme-infinity",
      name: "ZOTAC Gaming RTX 5080 AMP Extreme INFINITY",
      category: "Graphics Card",
      specsLine: "ZOTAC | RTX 5080 | 16GB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=zotac-gaming-rtx5080-amp-extreme-infinity",
      images: Array.from({ length: 6 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349068/zotac-gaming-rtx5080-amp-extreme-infinity-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A premium ZOTAC RTX 5080 graphics card for high-end 4K gaming, high-refresh 1440p gaming, streaming, rendering, AI-assisted creator work, and showcase builds that need 16GB of GDDR7 memory, strong cooling, DLSS 4 support, and a bold infinity mirror design.",
      specs: [
        // Official source: https://www.zotac.com/us/product/graphics_card/zotac-gaming-geforce-rtx-5080-amp-extreme-infinity
        ["Product Name", "ZOTAC Gaming GeForce RTX 5080 AMP Extreme INFINITY"],
        ["Brand", "ZOTAC Gaming"],
        ["Graphic Engine", "NVIDIA GeForce RTX 5080"],
        ["Architecture", "NVIDIA Blackwell"],
        ["CUDA Cores", "10,752"],
        ["Video Memory", "16GB GDDR7"],
        ["Memory Interface", "256-bit"],
        ["Memory Speed", "30Gbps"],
        ["Bus Standard", "PCI Express 5.0 x16"],
        ["Boost Clock", "2670MHz"],
        ["Cooling", "Vapor chamber cooling"],
        ["Design Features", "Infinity mirror front design, reinforced mid-frame"],
        ["NVIDIA Features", "DLSS 4, Ray Tracing, AI acceleration"],
        ["Power Consumption", "360W"],
        ["Power Connector", "1 x 12v-2x6 power input"],
        ["Recommended PSU", "850W"],
        ["Card Length", "332.1mm x 137.5mm x 69.6mm"],
        ["Display Outputs", "1× HDMI, 3× DisplayPort"],
        ["Slot Size", "3.5"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The ZOTAC Gaming GeForce RTX 5080 AMP Extreme INFINITY graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official ZOTAC package contents and may include a GPU support stand, power adapter cable, documentation, and setup accessories supplied by ZOTAC."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "asus-tuf-rtx5080-o16g-gaming": {
      id: "asus-tuf-rtx5080-o16g-gaming",
      name: "ASUS TUF RTX 5080 OC 16GB",
      category: "Graphics Card",
      specsLine: "ASUS TUF | RTX 5080 | 16GB",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=asus-tuf-rtx5080-o16g-gaming",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349081/asus-tuf-rtx5080-o16g-gaming-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A high-end ASUS TUF RTX 5080 graphics card for 4K gaming, high-refresh 1440p gaming, streaming, rendering, AI-assisted creator work, and premium gaming PCs that need 16GB of GDDR7 memory, strong cooling, PCIe 5.0 support, and durable TUF styling.",
      specs: [
        ["Product Name", "ASUS TUF Gaming GeForce RTX 5080 16GB GDDR7 OC Edition"],
        ["Model", "TUF-RTX5080-O16G-GAMING"],
        ["Graphic Engine", "NVIDIA GeForce RTX 5080"],
        ["AI Performance", "1801 TOPs"],
        ["Bus Standard", "PCI Express 5.0"],
        ["OpenGL", "OpenGL 4.6"],
        ["Video Memory", "16GB GDDR7"],
        ["Engine Clock", "OC Mode: 2730MHz / Default Mode: 2700MHz"],
        ["CUDA Cores", "10,752"],
        ["Memory Speed", "30Gbps"],
        ["Memory Interface", "256-bit"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Interface", "2× HDMI 2.1b, 3× DisplayPort 2.1b"],
        ["HDCP Support", "2.3"],
        ["Maximum Display Support", "4"],
        ["NVLink / CrossFire Support", "No"],
        ["Dimensions", "348 × 146 × 72mm"],
        ["Recommended PSU", "850W"],
        ["Power Connector", "1× 16-pin"],
        ["Slot", "3.6 Slot"],
        ["Aura Sync", "ARGB"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The ASUS TUF Gaming GeForce RTX 5080 16GB GDDR7 OC Edition graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents include a Speedsetup manual, TUF graphics card holder, TUF Velcro hook and loop, TUF magnet, TUF Gaming certificate, thank you card, and 1-to-3 adapter cable."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rtx-5080-windforce-oc-sff-16g": {
      id: "rtx-5080-windforce-oc-sff-16g",
      name: "Gigabyte RTX 5080 Windforce OC SFF 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RTX 5080 | Windforce OC SFF 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rtx-5080-windforce-oc-sff-16g",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349148/gigabyte-rtx-5080-windforce-oc-sff-16g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A high-end NVIDIA graphics card for 4K gaming, high-refresh 1440p gaming, rendering, streaming, AI-assisted creator work, and compact SFF-ready builds that need RTX 5080 performance with 16GB of GDDR7 memory.",
      specs: [
        ["Product Name", "GeForce RTX 5080 WINDFORCE OC SFF 16G"],
        ["Graphics Processing", "GeForce RTX 5080"],
        ["Core Clock", "2670 MHz"],
        ["CUDA Cores", "10,752"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR7"],
        ["Memory Bus", "256-bit"],
        ["Memory Clock", "30Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Multi-view", "4"],
        ["Card Size", "L=304 W=126 H=50 mm"],
        ["PCB Form", "ATX"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Recommended PSU", "850W"],
        ["Power Connector", "16-pin × 1"],
        ["Outputs", "DisplayPort 2.1b × 3, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The GeForce RTX 5080 WINDFORCE OC SFF 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a VGA manual, 1x 12V-2x6 to 3x PCIe 8-pin adapter, versatile VGA holder, and versatile VGA holder manual."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rx-9070-xt-gaming-oc-16g": {
      id: "rx-9070-xt-gaming-oc-16g",
      name: "Gigabyte RX 9070 XT Gaming OC 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RX 9070 XT | Gaming OC 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rx-9070-xt-gaming-oc-16g",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349166/gigabyte-rx-9070-xt-gaming-oc-16g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A high-performance AMD graphics card for strong 1440p and 4K gaming, high-refresh gameplay, creator work, streaming, and users who want Radeon RX 9070 XT performance with 16GB of GDDR6 memory and a larger Gaming OC cooling design.",
      specs: [
        ["Product Name", "Radeon RX 9070 XT GAMING OC 16G"],
        ["Graphics Processing", "Radeon RX 9070 XT"],
        ["Boost Clock", "Up to 3060 MHz"],
        ["Game Clock", "Up to 2520 MHz"],
        ["Stream Processors", "4,096"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR6"],
        ["Memory Bus", "256-bit"],
        ["Memory Clock", "20Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Multi-view", "4"],
        ["Card Size", "L=288 W=132 H=56 mm"],
        ["PCB Form", "ATX"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Recommended PSU", "850W"],
        ["Power Connector", "8-pin × 3"],
        ["Outputs", "DisplayPort 2.1a × 2, HDMI 2.1b × 2"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The Radeon RX 9070 XT GAMING OC 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a quick guide."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "aorus-radeon-rx9070-xt-elite-16gb": {
      id: "aorus-radeon-rx9070-xt-elite-16gb",
      name: "AORUS Radeon RX 9070 XT Elite 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RX 9070 XT | Elite 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=aorus-radeon-rx9070-xt-elite-16gb",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1783259016/aorus-radeon-rx9070-xt-elite-16gb-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A high-performance AMD graphics card for strong 1440p and 4K gaming, high-refresh gameplay, creator work, streaming, and users who want Radeon RX 9070 XT performance with 16GB of GDDR6 memory and an AORUS Elite cooling design.",
      specs: [
        ["Product Name", "AORUS Radeon RX 9070 XT ELITE 16G"],
        ["Graphics Processing", "Radeon RX 9070 XT"],
        ["Stream Processors", "4,096"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR6"],
        ["Memory Bus", "256-bit"],
        ["Memory Clock", "20Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Cooling", "WINDFORCE cooling system"],
        ["Display Features", "RGB lighting"],
        ["Digital Max Resolution", "7680 x 4320"],
        ["Multi-view", "4"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Outputs", "DisplayPort 2.1a x 2, HDMI 2.1b x 2"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The AORUS Radeon RX 9070 XT ELITE 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "Included accessories depend on the official graphics card package contents and may include documentation, adapters, or support accessories supplied by Gigabyte."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rx-9060-xt-gaming-oc-16g": {
      id: "rx-9060-xt-gaming-oc-16g",
      name: "Gigabyte RX 9060 XT Gaming OC 16GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RX 9060 XT | Gaming OC 16G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rx-9060-xt-gaming-oc-16g",
      images: [
        "https://res.cloudinary.com/dhtamisqn/image/upload/v1781349154/gigabyte-rx-9060-xt-gaming-oc-16g-1.jpg",
        ...Array.from({ length: 9 }, (_, index) => {
          const imageNumber = index + 2;
          return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349192/gigabyte-rx-9060-xt-gaming-oc-8g-${imageNumber}.jpg`;
        })
      ],
      whoIsThisFor: "A strong AMD graphics card for efficient 1080p and 1440p gaming, esports, everyday gaming builds, and users who want Radeon RX 9000-series performance with 16GB of GDDR6 memory and a clean Gaming OC cooler design.",
      specs: [
        ["Product Name", "Radeon RX 9060 XT GAMING OC 16G"],
        ["Graphics Processing", "Radeon RX 9060 XT"],
        ["Boost Clock", "Up to 3320 MHz"],
        ["Game Clock", "Up to 2780 MHz"],
        ["Stream Processors", "2,048"],
        ["Memory Size", "16GB"],
        ["Memory Type", "GDDR6"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "20Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Multi-view", "3"],
        ["Card Size", "L=281 W=118 H=40 mm"],
        ["PCB Form", "ATX"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Recommended PSU", "450W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1a × 2, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The Radeon RX 9060 XT GAMING OC 16G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a VGA manual."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

    "rx-9060-xt-gaming-oc-8g": {
      id: "rx-9060-xt-gaming-oc-8g",
      name: "Gigabyte RX 9060 XT Gaming OC 8GB",
      category: "Graphics Card",
      specsLine: "Gigabyte | RX 9060 XT | Gaming OC 8G",
      priceText: "Insert price here",
      priceNumber: null,
      url: "product.html?product=rx-9060-xt-gaming-oc-8g",
      images: Array.from({ length: 10 }, (_, index) => {
        const imageNumber = index + 1;
        return `https://res.cloudinary.com/dhtamisqn/image/upload/v1781349192/gigabyte-rx-9060-xt-gaming-oc-8g-${imageNumber}.jpg`;
      }),
      whoIsThisFor: "A strong AMD graphics card for efficient 1080p and 1440p gaming, esports, everyday gaming builds, and users who want Radeon RX 9000-series performance with 8GB of GDDR6 memory and a clean Gaming OC cooler design.",
      specs: [
        ["Product Name", "Radeon RX 9060 XT GAMING OC 8G"],
        ["Graphics Processing", "Radeon RX 9060 XT"],
        ["Boost Clock", "Up to 3320 MHz"],
        ["Game Clock", "Up to 2780 MHz"],
        ["Stream Processors", "2,048"],
        ["Memory Size", "8GB"],
        ["Memory Type", "GDDR6"],
        ["Memory Bus", "128-bit"],
        ["Memory Clock", "20Gbps"],
        ["Card Bus", "PCIe 5.0"],
        ["Digital Max Resolution", "7680 × 4320"],
        ["Multi-view", "3"],
        ["Card Size", "L=281 W=118 H=40 mm"],
        ["PCB Form", "ATX"],
        ["DirectX", "DirectX 12 API"],
        ["OpenGL", "OpenGL 4.6"],
        ["Recommended PSU", "450W"],
        ["Power Connector", "8-pin × 1"],
        ["Outputs", "DisplayPort 2.1a × 2, HDMI 2.1b × 1"]
      ],
      included: [
        {
          title: "Graphics Card",
          text: "The Radeon RX 9060 XT GAMING OC 8G graphics card is included as the main component, inspected and prepared for the build or order."
        },
        {
          title: "Original Packaging",
          text: "The product comes with its original box and packaging where available. Customers should keep the packaging for warranty and support purposes."
        },
        {
          title: "Included Accessories",
          text: "The official package contents list a VGA manual."
        },
        {
          title: "Store Support",
          text: "Purchases include store support, basic guidance, and free lifetime troubleshooting and diagnosis for products bought from The Computer Shop."
        }
      ]
    },

  };
}());
