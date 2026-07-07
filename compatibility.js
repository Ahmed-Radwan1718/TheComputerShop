window.TCS_COMPATIBILITY = (function () {
  const products = {
    "amd-ryzen-5-9600x": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 65, hasIntegratedGraphics: true },
    "amd-ryzen-7-9700x": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 65, hasIntegratedGraphics: true },
    "amd-ryzen-7-9800x3d": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 120, hasIntegratedGraphics: true },
    "amd-ryzen-9-9900x": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 120, hasIntegratedGraphics: true },
    "amd-ryzen-9-9900x3d": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 120, hasIntegratedGraphics: true },
    "amd-ryzen-9-9950x": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 170, hasIntegratedGraphics: true },
    "amd-ryzen-9-9950x3d": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 170, hasIntegratedGraphics: true },
    "amd-ryzen-9-9950x3d2-dual-edition": { category: "cpu", socket: "AM5", memoryType: "DDR5", tdpW: 200, hasIntegratedGraphics: true },

    "intel-core-ultra-5-245k": { category: "cpu", socket: "LGA1851", memoryType: "DDR5", tdpW: 125, maxTurboW: 159, hasIntegratedGraphics: true },
    "intel-core-ultra-7-265k": { category: "cpu", socket: "LGA1851", memoryType: "DDR5", tdpW: 125, maxTurboW: 250, hasIntegratedGraphics: true },
    "intel-core-ultra-7-270k-plus": { category: "cpu", socket: "LGA1851", memoryType: "DDR5", tdpW: 125, maxTurboW: 250, hasIntegratedGraphics: true },
    "intel-core-ultra-9-285k": { category: "cpu", socket: "LGA1851", memoryType: "DDR5", tdpW: 125, maxTurboW: 250, hasIntegratedGraphics: true },

    "aorus-waterforce-ii-360": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "LGA115x", "AM5", "AM4"], radiatorMm: 360 },
    "aorus-waterforce-x-ii-360-ice": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "LGA115x", "AM5", "AM4", "TR4", "sTR5"], radiatorMm: 360 },
    "corsair-nautilus-360-rs-argb": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "AM5", "AM4"], radiatorMm: 360 },
    "asus-tuf-gaming-lc-iii-360-argb-lcd": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "AM5", "AM4"], radiatorMm: 360 },
    "aorus-waterforce-ii-240": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "LGA115x", "AM5", "AM4"], radiatorMm: 240 },
    "arctic-liquid-freezer-iii-pro-360-a-rgb": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "LGA115x", "AM5", "AM4"], radiatorMm: 360 },
    "cooler-master-masterliquid-360-core-ii": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "LGA115x", "AM5", "AM4"], radiatorMm: 360 },
    "rog-ryujin-iii-360-argb-extreme": { category: "cooler", socketSupport: ["LGA1851", "LGA1700", "LGA1200", "LGA115x", "AM5", "AM4"], radiatorMm: 360 },

    "b860m-aorus-elite-wifi6e": { category: "motherboard", socket: "LGA1851", chipset: "B860", formFactor: "Micro-ATX", memoryType: "DDR5", memorySlots: 4, maxMemoryGb: 256, m2Slots: 3, sataPorts: 4 },
    "b850-aorus-elite-wifi7": { category: "motherboard", socket: "AM5", chipset: "B850", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemoryGb: 256, m2Slots: 3, sataPorts: 4 },

    "corsair-dominator-titanium-rgb-96gb-ddr5-7000-cl40": { category: "memory", memoryType: "DDR5", modules: 2, capacityGb: 96 },
    "corsair-vengeance-rgb-48gb-ddr5-6000-c36": { category: "memory", memoryType: "DDR5", modules: 2, capacityGb: 48 },
    "gskill-trident-z5-rgb-ddr5": { category: "memory", memoryType: "DDR5", modules: 2, capacityGb: 96 },
    "klevv-cras-v-rgb-ddr5": { category: "memory", memoryType: "DDR5", modules: 2, capacityGb: 32 },

    "samsung-9100-pro-nvme-ssd": { category: "storage", interface: "M.2 NVMe", formFactor: "M.2 2280", watts: 8 },
    "aorus-gen5-14000-ssd": { category: "storage", interface: "M.2 NVMe", formFactor: "M.2 2280", watts: 8 },
    "wd-black-gaming-hard-drive": { category: "storage", interface: "SATA", formFactor: "3.5-inch", watts: 8 },

    "gigabyte-c500-panoramic-stealth": { category: "case", motherboardSupport: ["ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 410, maxCpuCoolerHeightMm: 170, maxPsuLengthMm: 200, radiatorSupportMm: [120, 140, 240, 360] },
    "aorus-c500-glass": { category: "case", motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 420, maxCpuCoolerHeightMm: 190, maxPsuLengthMm: 220, radiatorSupportMm: [120, 140, 240, 280, 360, 420] },
    "aorus-c400-glass": { category: "case", motherboardSupport: ["ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 360, maxCpuCoolerHeightMm: 168, maxPsuLengthMm: 160, radiatorSupportMm: [120, 240, 360] },
    "fractal-design-north-xl-charcoal-black": { category: "case", motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 413, maxCpuCoolerHeightMm: 155, maxPsuLengthMm: 290, radiatorSupportMm: [120, 140, 240, 280, 360, 420] },
    "rog-strix-helios-ii": { category: "case", motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 450, maxCpuCoolerHeightMm: 190, maxPsuLengthMm: 220, radiatorSupportMm: [120, 140, 240, 280, 360, 420] },
    "rog-cronox": { category: "case", motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 400, maxCpuCoolerHeightMm: 180, maxPsuLengthMm: 200, radiatorSupportMm: [120, 240, 360] },
    "lian-li-o11-dynamic-evo-xl": { category: "case", motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 460, maxCpuCoolerHeightMm: 167, maxPsuLengthMm: 220, radiatorSupportMm: [240, 280, 360, 420] },
    "corsair-6500d-airflow-case": { category: "case", motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMm: 400, maxCpuCoolerHeightMm: 190, maxPsuLengthMm: 225, radiatorSupportMm: [120, 140, 240, 280, 360] },

    "aorus-elite-p850w-platinum-pg5": { category: "psu", wattageW: 850, formFactor: "ATX", lengthMm: 150, pcie16Pin: 1, pcie8Pin: 6 },
    "aorus-elite-p1000w-platinum-pg5": { category: "psu", wattageW: 1000, formFactor: "ATX", lengthMm: 150, pcie16Pin: 1, pcie8Pin: 6 },
    "ud1600pm-pg5-ai-top": { category: "psu", wattageW: 1600, formFactor: "ATX", lengthMm: 150, pcie16Pin: 2, pcie8Pin: 8 }
  };

  function baseId(part) {
    return String((part && (part.productId || part.id)) || "").split("::")[0];
  }

  function getSpec(part) {
    return products[baseId(part)] || null;
  }

  function issue(level, text) {
    return { level: level, text: text };
  }

  function selectedParts(build) {
    const parts = [];
    ["cpu", "cooler", "motherboard", "memory", "storage", "gpu", "case", "psu"].forEach(function (key) {
      if (build[key]) parts.push(build[key]);
    });

    Object.keys(build.extraParts || {}).forEach(function (key) {
      parts.push.apply(parts, build.extraParts[key] || []);
    });

    if (build.gpu2) parts.push(build.gpu2);
    return parts.filter(Boolean);
  }

  function estimateWattage(build) {
    return selectedParts(build).reduce(function (sum, part) {
      const spec = getSpec(part);
      if (!spec) return sum + 25;
      return sum + (spec.maxTurboW || spec.boardPowerW || spec.tdpW || spec.watts || 0);
    }, 0);
  }

  function check(build) {
    const issues = [];
    const cpu = getSpec(build.cpu);
    const motherboard = getSpec(build.motherboard);
    const caseSpec = getSpec(build.case);
    const psu = getSpec(build.psu);
    const gpuParts = [build.gpu, build.gpu2].filter(Boolean);
    const gpuSpecs = gpuParts.map(getSpec).filter(Boolean);
    const storageSpecs = [build.storage].concat(build.extraParts && build.extraParts.storage || []).map(getSpec).filter(Boolean);
    const memorySpecs = [build.memory].concat(build.extraParts && build.extraParts.memory || []).map(getSpec).filter(Boolean);

    selectedParts(build).forEach(function (part) {
      if (!getSpec(part)) {
        issues.push(issue("warn", "Missing compatibility data: " + part.name + " is not in compatibility.js yet."));
      }
    });

    if (cpu && motherboard && cpu.socket !== motherboard.socket) {
      issues.push(issue("bad", "CPU socket mismatch: CPU uses " + cpu.socket + " but motherboard uses " + motherboard.socket + "."));
    }

    if (cpu && motherboard && cpu.memoryType && motherboard.memoryType && cpu.memoryType !== motherboard.memoryType) {
      issues.push(issue("bad", "CPU memory mismatch: CPU supports " + cpu.memoryType + " but motherboard uses " + motherboard.memoryType + "."));
    }

    memorySpecs.forEach(function (memory) {
      if (motherboard && memory.memoryType && motherboard.memoryType && memory.memoryType !== motherboard.memoryType) {
        issues.push(issue("bad", "Memory type mismatch: RAM is " + memory.memoryType + " but motherboard uses " + motherboard.memoryType + "."));
      }
    });

    if (motherboard && memorySpecs.length) {
      const modules = memorySpecs.reduce(function (sum, memory) { return sum + (memory.modules || 0); }, 0);
      const capacity = memorySpecs.reduce(function (sum, memory) { return sum + (memory.capacityGb || 0); }, 0);

      if (motherboard.memorySlots && modules > motherboard.memorySlots) {
        issues.push(issue("bad", "Too many RAM sticks: selected RAM uses " + modules + " slots but motherboard has " + motherboard.memorySlots + "."));
      }

      if (motherboard.maxMemoryGb && capacity > motherboard.maxMemoryGb) {
        issues.push(issue("bad", "Too much RAM: selected RAM is " + capacity + "GB but motherboard supports up to " + motherboard.maxMemoryGb + "GB."));
      }
    }

    if (motherboard && caseSpec && caseSpec.motherboardSupport && !caseSpec.motherboardSupport.includes(motherboard.formFactor)) {
      issues.push(issue("bad", "Case motherboard support mismatch: case does not list support for " + motherboard.formFactor + "."));
    }

    gpuSpecs.forEach(function (gpu) {
      if (caseSpec && gpu.lengthMm && caseSpec.maxGpuLengthMm && gpu.lengthMm > caseSpec.maxGpuLengthMm) {
        issues.push(issue("bad", "GPU clearance mismatch: GPU is " + gpu.lengthMm + "mm but case supports up to " + caseSpec.maxGpuLengthMm + "mm."));
      }
    });

    if (motherboard && storageSpecs.length) {
      const m2Count = storageSpecs.filter(function (storage) { return storage.interface === "M.2 NVMe"; }).length;
      const sataCount = storageSpecs.filter(function (storage) { return storage.interface === "SATA"; }).length;

      if (motherboard.m2Slots && m2Count > motherboard.m2Slots) {
        issues.push(issue("bad", "Too many M.2 drives: selected " + m2Count + " but motherboard supports " + motherboard.m2Slots + "."));
      }

      if (motherboard.sataPorts && sataCount > motherboard.sataPorts) {
        issues.push(issue("bad", "Too many SATA drives: selected " + sataCount + " but motherboard supports " + motherboard.sataPorts + "."));
      }
    }

    if (psu) {
      const estimated = estimateWattage(build);
      const recommendedGpuPsu = gpuSpecs.reduce(function (max, gpu) { return Math.max(max, gpu.recommendedPsuW || 0); }, 0);
      const needed = Math.max(Math.ceil(estimated * 1.25), recommendedGpuPsu);

      if (psu.wattageW && needed && psu.wattageW < needed) {
        issues.push(issue("bad", "PSU wattage too low: estimated safe target is " + needed + "W but PSU is " + psu.wattageW + "W."));
      }

      if (caseSpec && psu.lengthMm && caseSpec.maxPsuLengthMm && psu.lengthMm > caseSpec.maxPsuLengthMm) {
        issues.push(issue("bad", "PSU clearance mismatch: PSU is " + psu.lengthMm + "mm but case supports up to " + caseSpec.maxPsuLengthMm + "mm."));
      }
    }

    if (cpu && !build.gpu && !build.gpu2 && cpu.hasIntegratedGraphics !== true) {
      issues.push(issue("warn", "Video card required: selected CPU does not have integrated graphics."));
    }

    return issues;
  }

  function partIsCompatible(build, categoryKey, part) {
    const testBuild = Object.assign({}, build);
    testBuild[categoryKey] = part;
    return !check(testBuild).some(function (item) {
      return item.level === "bad";
    });
  }

  return {
    products: products,
    getSpec: getSpec,
    check: check,
    estimateWattage: estimateWattage,
    partIsCompatible: partIsCompatible
  };
})();
