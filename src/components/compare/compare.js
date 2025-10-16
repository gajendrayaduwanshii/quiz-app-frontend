import React, { useState } from "react";
import styles from "./compare.module.scss";

const Compare = () => {
  const allProducts = [
    {
      id: 1,
      name: "Google Pixel 10 (Obsidian, 256 GB)",
      price: "₹79,999",
      image: "/images/pixel10.png",
      offer: null,
      oldPrice: null,
      highlights: [
        "12 GB RAM | 256 GB ROM",
        "16.0 cm (6.3 inch) Quad HD+ Display",
        "48MP + 13MP + 10.8MP | 10.5MP Front Camera",
        "4970 mAh Battery",
        "Tensor G5 Processor",
        "Colour (04)",
      ],
      general: [
        "Nano Sim",
        "Dual Sim(Physical + eSIM)",
        "5G, 4G, 3G, 2G",
        "4970 mAh",
        "Proximity Sensor, Ambient Light Sensor, Accelerometer, Gyrometer, Magnetometer, Barometer",
      ],
      storage: ["256 GB"],
      display: [
        "Quad HD+, 2424 x 1080 Pixels",
        "Aspect Ratio: 20:9, Smooth Display (60 Hz - 120 Hz), Corning Gorilla Glass Victus 2 Cover Glass",
        "Up to 2000 Nits (HDR) and Up to 3000 Nits (Peak Brightness)",
        ">2000000:1 Contrast Ratio, HDR Support, Full 24 bit Depth for 16 Million Colours",
      ],
      camera: [
        "Primary Camera: 48 MP",
        "Front Camera: 10.5 MP",
        "Full HD, Rear Camera 4K (at 24/30/60 fps)",
        "Dual Exposure, Wide Camera, 20X Zoom",
      ],
      connectivity: [
        "Yes, micro USB, USB Type C 3.2, Not OTG Compatible",
        "Yes, Wi-Fi 6E (802.11 ax)",
        "Yes, v6",
      ],
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 (256 GB)",
      price: "₹55,990",
      offer: "30% OFF",
      oldPrice: "₹79,999",
      image: "/images/s24.png",
      highlights: [
        "8 GB RAM | 256 GB ROM",
        "15.75 cm (6.2 inch) Full HD+ Display",
        "50MP + 10MP + 12MP | 12MP Front Camera",
        "4000 mAh Battery",
        "Exynos 2400 Processor",
        "Colour (04)",
      ],
      general: [
        "Nano Sim",
        "Dual SIM",
        "5G, 4G, 3G, 2G",
        "4970 mAh",
        "Accelerometer, Barometer, Fingerprint Sensor, Gyro Sensor, Light Sensor, Proximity Sensor",
      ],
      storage: ["256 GB"],
      display: [
        "Full HD+, 2340 x 1080 Pixels",
        "Max Refresh Rate: 120 Hz, Peak Brightness: 2600 nits",
      ],
      camera: [
        "Primary Camera: 50 MP",
        "Front Camera: 12 MP",
        "Full HD, UHD 8K (at 30 fps)",
        "UHD 4K (at 60 fps)",
      ],
      connectivity: [
        "Yes, micro USB, USB 3.2 Gen 1, OTG Compatible",
        "Yes, 802.11 a/b/g/n/ac/ax",
        "Yes, v5.3",
      ],
    },
    {
      id: 3,
      name: "Apple iPhone 15 (Pink, 128 GB)",
      price: "₹64,900",
      offer: "7% OFF",
      oldPrice: "₹69,900",
      image: "/images/iphone15.png",
      highlights: [
        "128 GB ROM",
        "15.49 cm (6.1 inch) Super Retina XDR Display",
        "48MP + 12MP | 12MP Front Camera",
        "5400 mAh Battery",
        "A16 Bionic Chip, 6 Core Processor",
        "Colour (04)",
      ],
      general: [
        "Nano Sim + eSIM",
        "Dual SIM(Nano + eSIM), 5G/4G VoLTE/GSM",
        "5G, 4G, 3G, 2G",
        "Face ID, Barometer, High Dynamic Range Gyro, Proximity Sensor, Dual Ambient Light Sensors",
      ],
      storage: ["128 GB"],
      display: [
        "Super Retina XDR Display, 2556 x 1179 Pixels",
        "Dynamic Island, HDR, True Tone, Wide Colour (P3)",
        "Contrast Ratio: 2,000,000:1, 1,600 nits Peak Brightness (HDR)",
      ],
      camera: [
        "Primary Camera: 48 MP",
        "Front Camera: 12 MP",
        "Rear True Tone Flash",
        "4K (at 24/25/30/60 fps)",
      ],
      connectivity: [
        "Not OTG Compatible",
        "Yes, Wi-Fi 6 (802.11ax)",
        "Yes, v5.3",
      ],
    },
    {
      id: 4,
      name: "OnePlus 12 (Titan Black, 256 GB)",
      price: "₹64,999",
      offer: "10% OFF",
      oldPrice: "₹71,999",
      image: "/images/oneplus12.png",
      highlights: [
        "16 GB RAM | 256 GB ROM",
        "17.02 cm (6.7 inch) QHD+ Display",
        "50MP + 48MP + 64MP | 32MP Front Camera",
        "5400 mAh Battery",
        "Snapdragon 8 Gen 3 Processor",
        "Colour (03)",
      ],
      general: [
        "Nano Sim",
        "Dual SIM",
        "5G, 4G, 3G, 2G",
        "5400 mAh",
        "In-display Fingerprint, Accelerometer, Electronic Compass, Gyroscope, Ambient Light Sensor, Proximity Sensor, Sensor Core",
      ],
      storage: ["256 GB"],
      display: [
        "QHD+, 3168 x 1440 Pixels",
        "LTPO AMOLED, 1-120 Hz Adaptive Refresh Rate",
        "4500 nits Peak Brightness, Dolby Vision",
        "HDR10+, 10-bit Color Depth",
      ],
      camera: [
        "Primary Camera: 50 MP",
        "Front Camera: 32 MP",
        "8K at 30fps, 4K at 30/60fps",
        "Hasselblad Camera, Night Mode 3.0",
      ],
      connectivity: [
        "USB Type-C 3.2, OTG Compatible",
        "Wi-Fi 7, NFC",
        "Bluetooth 5.4",
      ],
    },
  ];

  const [selected, setSelected] = useState([allProducts[0]]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    { title: "Highlights", key: "highlights" },
    { title: "General Feature", key: "general" },
    { title: "Storage", key: "storage" },
    { title: "Display", key: "display" },
    { title: "Camera", key: "camera" },
    { title: "Connectivity Feature", key: "connectivity" },
  ];

  const handleAdd = (id) => {
    if (selected.length >= 3) return;
    const product = allProducts.find((p) => p.id === id);
    if (product && !selected.find((s) => s.id === id)) {
      setSelected((prev) => [...prev, product]);
    }
  };

  const handleRemove = (id) => {
    setSelected(selected.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.compareContainer}>
      <h2>Compare Product</h2>

      <div className={styles.productGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {selected.map((p) => (
          <div className={styles.productCard} key={p.id}>
            <img src={p.image} alt={p.name} />
            <p className={styles.storageLabel}>256 GB</p>
            <h4>{p.name}</h4>
            {p.offer && <p className={styles.offerText}>{p.offer}</p>}
            <p className={styles.price}>
              {p.price}{" "}
              {p.oldPrice && (
                <span className={styles.oldPrice}>{p.oldPrice}</span>
              )}
            </p>
            <button
              className={styles.removeBtn}
              onClick={() => handleRemove(p.id)}
            >
              Remove
            </button>
          </div>
        ))}

        {selected.length < 3 && (
          <div className={styles.addProduct}>
            <select
              onChange={(e) => handleAdd(Number(e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>
                Add a product
              </option>
              {allProducts
                .filter((p) => !selected.find((s) => s.id === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {sections.map((section) => (
        isDesktop ? (
          <div key={section.key} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            <div className={styles.specGrid}>
              {selected.map((p) => (
                <div key={p.id} className={styles.specBox}>
                  <ul>
                    {p[section.key].map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <details key={section.key} className={styles.section}>
            <summary className={styles.sectionTitle}>{section.title}</summary>
            <div className={styles.specGrid}>
              {selected.map((p) => (
                <div key={p.id} className={styles.specBox}>
                  <ul>
                    {p[section.key].map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )
      ))}
    </div>
  );
};

export default Compare;
