(function () {
  // 移动端.js
  // pc，判空
  if (window.innerWidth >= 1024) return;

  console.log("这里是移动端");

  const productsData = [
    {
      image:
        "//awolvision.com/cdn/shop/files/1_ca67cdfe-80a1-4503-a8d6-2bc32181f010_400x.jpg?v=1693912063",
      title: "LTV-3500 Pro",
      subTitle: "Masterpiece Innovation and Tech",
      price: "$5,999.00",
      link: "https://awolvision.com/products/4k-3d-triple-laser-projector-ltv-3500-pro",
      id: 1,
    },
    {
      image:
        "//awolvision.com/cdn/shop/files/1_ca67cdfe-80a1-4503-a8d6-2bc32181f010_400x.jpg?v=1693912063",
      title: "LTV-3000 Pro",
      subTitle: "Balanced Performance and Value",
      price: "$3,999.00",
      link: "https://awolvision.com/products/4k-3d-triple-laser-projector-ltv-3000pro",
      id: 2,
    },
    {
      image:
        "//awolvision.com/cdn/shop/files/1_ca67cdfe-80a1-4503-a8d6-2bc32181f010_400x.jpg?v=1693912063",
      title: "LTV-2500",
      subTitle: "Entry Model With Reliable Features",
      price: "$2,999.00",
      link: "https://awolvision.com/products/awol-vision-4k-tri-chroma-laser-projector-ltv-2500",
      id: 3,
    },
  ];

  const specificationsData = [
    {
      categoryTitle: "Key Features",
      categoryChildren: [
        {
          paramTitle: "Brightness",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "3500 Peak Lumens",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "3000 Peak Lumens",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "2600 Peak Lumens",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Resolution",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_2.svg?v=1726197475",
              text: "4K@60Hz",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_2.svg?v=1726197475",
              text: "4K@60Hz",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_2.svg?v=1726197475",
              text: "4K@60Hz",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Color Space",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_3.svg?v=1726197475",
              text: "107% BT.2020",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_3.svg?v=1726197475",
              text: "107% BT.2020",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_3.svg?v=1726197475",
              text: "107% BT.2020",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Contrast Ratio",
          paramChildren: [
            {
              type: "icon-text",
              text: "2500:1",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_4.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              text: "2500:1",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_4.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              text: "2500:1",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_4.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Active 3D",
          paramChildren: [
            {
              type: "icon-text",
              text: "Yes",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_5.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              text: "Yes",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_5.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              text: "Yes",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_5.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Input Lag",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_6.svg?v=1726197475",
              text: "15ms 4K@60Hz, 8ms 1080p@120Hz in Turbo Mode",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_6.svg?v=1726197475",
              text: "15ms 4K@60Hz, 8ms 1080p@120Hz in Turbo Mode",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_6.svg?v=1726197475",
              text: "15ms 4K@60Hz, 8ms 1080p@120Hz in Turbo Mode",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "HDR",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_7.svg?v=1726197475",
              text: "Dolby Vision, HDR 10+, HDR 10, HLG",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_7.svg?v=1726197475",
              text: "Dolby Vision, HDR 10+, HDR 10, HLG",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_7.svg?v=1726197475",
              text: "Dolby Vision, HDR 10+, HDR 10, HLG",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "HDMI",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_8.svg?v=1726197474",
              text: "3*HDMI(eARC on HDMI 2)",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_8.svg?v=1726197474",
              text: "3*HDMI(eARC on HDMI 2)",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_8.svg?v=1726197474",
              text: "3*HDMI(eARC on HDMI 2)",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Audio Performance",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_9.svg?v=1726197475",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_9.svg?v=1726197475",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_9.svg?v=1726197475",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "IP Control",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: false,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Projection",
      categoryChildren: [
        {
          paramTitle: "Projection Size",
          paramChildren: [
            {
              type: "text",
              text: "80-150 inches",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "80-150 inches",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "80-150 inches",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Lens",
          paramChildren: [
            {
              type: "text",
              text: "Customized Ricoh F2.0 pure glass lens with super sharpness",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Customized Ricoh F2.0 pure glass lens with super sharpness",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Customized Ricoh F2.0 pure glass lens with super sharpness",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Wide Color Gamut(WCG)",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "24FPS",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Throw Ratio",
          paramChildren: [
            {
              type: "text",
              text: "0.25: 1",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "0.25: 1",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "0.25: 1",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Eectric Focus",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Keystone Correction",
          paramChildren: [
            {
              type: "text",
              text: "8 points",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "8 points",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "8 points",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "MEMC",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Auto Brightness Adjustment",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Laser Outlet Blocked Detect",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Eye Safety",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Platform",
      categoryChildren: [
        {
          paramTitle: "Display Technology",
          paramChildren: [
            {
              type: "text",
              text: "Tl 0.47-inch ecd DMD",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Tl 0.47-inch pico DMD",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Tl 0.47-inch pico DMD",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Light Source",
          paramChildren: [
            {
              type: "text",
              text: "Tri-Color Pure Laser",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Tri-Color Pure Laser",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Tri-Color Pure Laser",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Laser Life",
          paramChildren: [
            {
              type: "text",
              text: "25,000+ hours",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "25,000+ hours",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "25,000+ hours",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Software OS",
          paramChildren: [
            {
              type: "text",
              text: "Android 9.0",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Android 9.0",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Android 9.0",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "RAM/EMMC",
          paramChildren: [
            {
              type: "text",
              text: "3G/128G",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "3G/128G",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "3G/128G",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Audio & Noise",
      categoryChildren: [
        {
          paramTitle: "Audio Output Power",
          paramChildren: [
            {
              type: "text",
              text: "36w (Stereo)",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "36w (Stereo)",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "36w (Stereo)",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Audio Performance",
          paramChildren: [
            {
              type: "text",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Noise",
          paramChildren: [
            {
              type: "text",
              text: "<=30dB",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Bluetooth Speaker Mode",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Power",
      categoryChildren: [
        {
          paramTitle: "Power Supply",
          paramChildren: [
            {
              type: "text",
              text: "100 - 240V@50-60Hz",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "100 - 240V@50-60Hz",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "100 - 240V@50-60Hz",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Power Consumption",
          paramChildren: [
            {
              type: "text",
              text: "320 W",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "185 W",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "175 W",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Standby Mode",
          paramChildren: [
            {
              type: "text",
              text: "0.5 W",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "0.5 W",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "0.5 W",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Remote Contrel",
          paramChildren: [
            {
              type: "text",
              text: "Yes, IR&Bluetooth dual mode",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Yes, IR&Bluetooth dual mode",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Yes, IR&Bluetooth dual mode",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Connectivity",
      categoryChildren: [
        {
          paramTitle: "USB",
          paramChildren: [
            {
              type: "text",
              text: "2*USB 2.0",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "2*USB 2.0",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "2*USB 2.0",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Ethernet",
          paramChildren: [
            {
              type: "text",
              text: "1*LAN",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "1*LAN",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "1*LAN",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Digital Audio Output",
          paramChildren: [
            {
              type: "text",
              text: "1*S/PDIF",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "1*S/PDIF",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "1*S/PDIF",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Analog Video input",
          paramChildren: [
            {
              type: "text",
              text: "1*AV In",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "1*AV In",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "1*AV In",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "TV Stick compartment",
          paramChildren: [
            {
              type: "text",
              text: "1",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "1",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "1",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Wi-Fi",
          paramChildren: [
            {
              type: "text",
              text: "Yes, 802.11a/b/g/n/ac (Dual-Band)",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Yes, 802.11a/b/g/n/ac (Dual-Band)",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Yes, 802.11a/b/g/n/ac (Dual-Band)",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Buetooth",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Wireless Screen Mirroring",
          paramChildren: [
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "General",
      categoryChildren: [
        {
          paramTitle: "Dimensions",
          paramChildren: [
            {
              type: "text",
              text: "  23.6*13.9*5.7 inches / 599*353*145 mm",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "  23.6*13.9*5.7 inches / 599*353*145 mm",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "  23.6*13.9*5.7 inches / 599*353*145 mm",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Weight",
          paramChildren: [
            {
              type: "text",
              text: "23.8 lbs / 10.8 kg",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Packaged Dimensions",
          paramChildren: [
            {
              type: "text",
              text: "29.0*19.5*12.1 inches / 736*495*307 mm",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Packaged Weight",
          paramChildren: [
            {
              type: "text",
              text: "31.7 lbs / 14.4 kg",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Working Temperature",
          paramChildren: [
            {
              type: "text",
              text: "32-104°F / 0-40℃",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "32-104°F / 0-40℃",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "32-104°F / 0-40℃",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Storage Temperature",
          paramChildren: [
            {
              type: "text",
              text: "-4-140°F / -20-60℃",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "-4-140°F / -20-60℃",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "-4-140°F / -20-60℃",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
  ];

  const diffSpecificationsData = [
    {
      categoryTitle: "Key Features",
      categoryChildren: [
        {
          paramTitle: "Brightness",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "3500 Peak Lumens",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "3000 Peak Lumens",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "2600 Peak Lumens",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "IP Control",
          paramChildren: [
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: false,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Platform",
      categoryChildren: [
        {
          paramTitle: "Display Technology",
          paramChildren: [
            {
              type: "text",
              text: "Tl 0.47-inch ecd DMD",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "Tl 0.47-inch pico DMD",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "Tl 0.47-inch pico DMD",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "Audio & Noise",
      categoryChildren: [
        {
          paramTitle: "Noise",
          paramChildren: [
            {
              type: "text",
              text: "<=30dB",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },

    {
      categoryTitle: "Power",
      categoryChildren: [
        {
          paramTitle: "Power Consumption",
          paramChildren: [
            {
              type: "text",
              text: "320 W",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "185 W",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "175 W",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
    {
      categoryTitle: "General",
      categoryChildren: [
        {
          paramTitle: "Weight",
          paramChildren: [
            {
              type: "text",
              text: "23.8 lbs / 10.8 kg",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Packaged Dimensions",
          paramChildren: [
            {
              type: "text",
              text: "29.0*19.5*12.1 inches / 736*495*307 mm",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
        {
          paramTitle: "Packaged Weight",
          paramChildren: [
            {
              type: "text",
              text: "31.7 lbs / 14.4 kg",
              visible: true,
              productName: "LTV-3500 Pro",
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
              productName: "LTV-3000 Pro",
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
              productName: "LTV-2500",
            },
          ],
        },
      ],
    },
  ];

  const productNameMap = [
    {
      keyArr: ["LTV-3500 Pro", "LTV-3000 Pro"],
      paramTitles: [
        "Brightness",
        "Noise",
        "Power Consumption",
        "Weight",
        "Packaged Dimensions",
        "Packaged Weight",
        "Display Technology",
      ],
    },
    {
      keyArr: ["LTV-3500 Pro", "LTV-2500"],
      paramTitles: [
        "Brightness",
        "IP Control",
        "Noise",
        "Power Consumption",
        "Weight",
        "Packaged Dimensions",
        "Packaged Weight",
        "Display Technology",
      ],
    },
    {
      keyArr: ["LTV-3000 Pro", "LTV-2500"],
      paramTitles: ["Brightness", "IP Control", "Power Consumption"],
    },
  ];

  const createShowDiffWrapEle = () => {
    const wrap = document.createElement("div");

    wrap.className = "show-diff-wrap";

    wrap.innerHTML = `
    <span class="diff-check-btn">
      <img src="https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_14.svg?v=1726312631" alt="Show difference">
    </span>
    <span class="diff-text">Only show difference</span>`;

    return wrap;
  };

  const createProductEle = (value) => {
    const productData =
      productsData.find((product) => product.title === value) || {};

    const productWrap = document.createElement("div");

    productWrap.className = "product-wrap";

    productWrap.innerHTML = `
      <img src="${productData.image}" alt="" class="image">
      <span class="sub-title">${productData.subTitle}</span>
      <span class="price">${productData.price}</span>
      <a class="shop-now" href="${productData.link}">SHOP NOW</a>
    `;

    return productWrap;
  };

  const createSelectorEle = () => {
    const wrapEle = document.createElement("div");

    wrapEle.className = "selectors-wrap";

    wrapEle.innerHTML = `
        <div id="productSelector1" class="select-wrap" >
            <div  class="select-trigger">
              <span class="select-value" >LTV-3500 Pro</span>

            </div>
            <img class="arrow" src="https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_15.svg?v=1726738458" />
            <div class="options-wrap" >

            <div class="select-item-option">
               <span>LTV-3500 Pro</span>
            </div>

           <div class="select-item-option">
                <span >LTV-3000 Pro</span>
            </div>
       
            <div class="select-item-option">
            <span >LTV-2500</span>
            </div>
       
       
      
          
            </div>
        </div>

      <div id="productSelector2" class="select-wrap" >
            <div  class="select-trigger">
              <span class="select-value" >LTV-3000 Pro</span>

            </div>
            <img class="arrow" src="https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_15.svg?v=1726738458" />
            <div class="options-wrap" >
            <div class="select-item-option">
               <span>LTV-3500 Pro</span>
            </div>

           <div class="select-item-option">
                <span >LTV-3000 Pro</span>
            </div>
       
            <div class="select-item-option">
            <span >LTV-2500</span>
            </div>
            </div>
        </div>
       `;

    return wrapEle;
  };

  const renderSelectors = () => {
    const container = document.querySelector(".product-introduction-wrap");

    container.appendChild(createSelectorEle());
  };

  const renderProducts = () => {
    // 获取容器元素
    const container = document.querySelector(".product-introduction-wrap");

    container.querySelectorAll(".product-wrap").forEach((el) => el.remove());

    selectorApi
      .getValues()
      .forEach((selectValue) =>
        container.appendChild(createProductEle(selectValue))
      );
  };

  const renderShowDiffWrap = () => {
    // 高度元素
    const fillHeightEle = document.querySelector(
      ".product-introduction-container-fill-height"
    );

    // 获取目标元素的下一个兄弟元素
    const fillHeightEleNextSibling = fillHeightEle.nextSibling;

    // 插入新元素到目标元素的前一个兄弟元素前面
    fillHeightEle.parentNode.insertBefore(
      createShowDiffWrapEle(),
      fillHeightEleNextSibling
    );
  };

  const renderSpecificationsList = (data, rootEle) => {
    rootEle.innerHTML = "";

    const renderParamsChildren = (children) => {
      let template = "";

      selectorApi.getValues().forEach((productName) => {
        const item = children.find(
          (paramItem) => paramItem.productName === productName
        );

        if (!item) {
          console.log("item >>>>>>>>>", item, children);
        }

        if (!item.visible) {
          return (template += `
            <div class="param-item-1">-</span></div>
          `);
        }

        if (item.type === "icon-text") {
          return (template += `
          <div class="param-item-1"><img src="${item.icon}" /><span>${item.text}</span></div>
        `);
          k;
        }

        if (item.type === "icon") {
          return (template += `
          <div class="param-item-2"><img src="${item.icon}" /></div>
        `);
        }

        if (item.type === "text") {
          return (template += `
          <div class="param-item-2">${item.text}</div>
        `);
        }
      });

      return template;
    };

    const renderCategoryChildren = (children) => {
      let template = "";

      children.forEach((item) => {
        const itemStr = `
        <div class="param-items-wrap">
          <span class="param-title">${item.paramTitle}</span>
          ${renderParamsChildren(item.paramChildren)}
        </div>
        `;

        template += itemStr;
      });

      return template;
    };

    data.forEach((category) => {
      const categoryWrap = document.createElement("div");

      categoryWrap.className = "product-category-wrap";

      categoryWrap.innerHTML = `
          <div class="category-title-wrap">
            <span class="category-title">${category.categoryTitle}</span>
            <img  class="category-expand-btn" src="https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_13.svg?v=1726296238" />
          </div>
          <div class="params-list-wrap">
          ${renderCategoryChildren(category.categoryChildren)}

          </div>
      `;

      rootEle.appendChild(categoryWrap);
    });
  };

  const productCategoryApi = {
    getAll() {
      return document.querySelectorAll(".product-category-wrap");
    },

    expandAll() {
      const productCategoryWrapEles = this.getAll();

      productCategoryWrapEles.forEach((ele) => this.expandTargetEle(ele));
    },

    expandTargetEle(targetEle) {
      const paramsListWrap = targetEle.querySelector(".params-list-wrap");

      // 切换'flip-over'类来触发箭头翻转 动画
      targetEle
        .querySelector(".category-title-wrap .category-expand-btn")
        .classList.toggle("flip-over");

      // 动态计算内容的最大高度
      const scrollHeight = paramsListWrap.scrollHeight;

      if ([0, "", "0px"].includes(paramsListWrap.style.maxHeight)) {
        paramsListWrap.style.maxHeight = `${2000}px`;
      } else {
        paramsListWrap.style.maxHeight = "0px";
      }
    },

    expand(num = 1) {
      if (!num) return;

      const productCategoryWrapEles = this.getAll();

      const targetEle = productCategoryWrapEles[num - 1];

      this.expandTargetEle(targetEle);
    },

    hideBtn(num) {
      if (!num) return;

      const categoryTitleWrapEle = document.querySelectorAll(
        ".product-specifications-list-container .product-category-wrap .category-title-wrap"
      )[num - 1];

      categoryTitleWrapEle.onclick = null;

      const btnEle = categoryTitleWrapEle.querySelector(".category-expand-btn");

      btnEle.style.display = "none";
    },

    flipAllBtn() {
      // 找到 .product-category-wrap 和它的子集 .params-list-wrap
      const eles = document.querySelectorAll(
        ".product-category-wrap .category-expand-btn"
      );
      // 切换'flip-over'类来触发 箭头翻转 动画
      eles.forEach((ele) => ele.classList.toggle("flip-over"));
    },
  };

  const selectorApi = {
    getValues() {
      return Array.from(
        document.querySelectorAll(".select-wrap .select-trigger span")
      ).map((ele) => ele.textContent);
    },

    getEles() {
      return Array.from(document.querySelectorAll(".select-wrap"));
    },

    getEle(num = 1) {
      return Array.from(document.querySelectorAll(".select-wrap"))[num - 1];
    },

    updateOptions() {
      const selectItemptionEles = document.querySelectorAll(
        ".selectors-wrap .select-wrap .options-wrap .select-item-option"
      );

      selectItemptionEles.forEach((selectItemptionEle) => {
        const selectTextEle = selectItemptionEle.querySelector("span");

        const selectValue = selectTextEle.textContent;

        if (this.getValues().includes(selectValue)) {
          selectTextEle.style.color = "#BFBFBF";

          selectItemptionEle.style.pointerEvents = "none"; // 禁用点击事件
        } else {
          selectTextEle.style.color = "#1B1D1D";

          selectItemptionEle.style.pointerEvents = "auto"; // 恢复点击事件
        }
      });
    },
  };

  const utilsApi = {
    filterParamTitles(data, paramTitles) {
      return data
        .map((category) => {
          // 过滤 categoryChildren，保留符合 paramTitle 的项
          const filteredCategoryChildren = category.categoryChildren
            .map((param) => {
              if (paramTitles.includes(param.paramTitle)) {
                return param; // 保留符合 paramTitle 的项
              }
              return null; // 排除不符合的项
            })
            .filter(Boolean); // 移除 null 项

          // 如果 categoryChildren 还有数据，返回该 category，否则返回 null
          if (filteredCategoryChildren.length > 0) {
            return {
              ...category,
              categoryChildren: filteredCategoryChildren,
            };
          }
          return null; // 如果没有 categoryChildren，返回 null
        })
        .filter(Boolean); // 移除 null 项
    },

    areArraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }

      const valueStr1 = arr1.slice().sort().join("+"); // 复制并排序数组
      const valueStr2 = arr2.slice().sort().join("+");

      return valueStr1 === valueStr2;
    },

    // 查找匹配的 paramTitles
    findParamTitles(inputArr, productNameMap) {
      for (const item of productNameMap) {
        if (this.areArraysEqual(inputArr, item.keyArr)) {
          console.log("item.paramTitles >>>>>>>>>>>", item.paramTitles);
          return item.paramTitles; // 返回 paramTitles 数组
        }
      }
      return []; // 如果没有匹配，返回空数组
    },
  };

  const specificationDataApi = {
    getDiffSpecificationsData() {
      const selectValues = selectorApi.getValues();

      const paramTitles = utilsApi.findParamTitles(
        selectValues,
        productNameMap
      );

      const newData = utilsApi.filterParamTitles(
        diffSpecificationsData,
        paramTitles
      );

      console.log("showDiff newDiff >>>>>>>>>>>>", newData);

      return newData;
    },
  };

  const scrollApi = {
    scrollToShowDiffBtn() {
      const messageHeight =
        document.querySelector(".announcement-bar.announcement-bar--multiple")
          .offsetHeight || 0;

      const dffHeight = 70 - messageHeight;
      document.documentElement.scrollTo(0, 465 - dffHeight);
    },
  };

  /**
   * 全局变量
   */
  let showDiff = false;

  /**
   * 监听选择器
   */

  const listenSelectors = () => {
    const selectWrapEles = document.querySelectorAll(".select-wrap");

    let isAnimating = false; // 防止在动画期间触发多次点击

    const handleOptionClick = () => {
      renderProducts();

      // 获取容器元素
      const container = document.querySelector(
        ".product-specifications-list-container"
      );

      // 如果正在动画，忽略点击
      if (isAnimating) return;

      isAnimating = true;

      // 开始隐藏现有内容，淡出
      container.style.opacity = "0";

      // 等待淡出动画完成
      setTimeout(() => {
        // 是否展示差异 or 全部内容
        if (showDiff) {
          const newDiffSpecificationsData =
            specificationDataApi.getDiffSpecificationsData();

          renderSpecificationsList(newDiffSpecificationsData, container);

          productCategoryApi.expandAll();
        } else {
          renderSpecificationsList(specificationsData, container);

          productCategoryApi.expand(1);
        }

        productCategoryApi.hideBtn(1);

        // productCategoryApi.flipAllBtn();

        // 切换内容后淡入
        container.style.display = "block";

        container.style.opacity = "1";

        scrollApi.scrollToShowDiffBtn();

        listenCategoryExpandBtn();

        // 标记动画结束
        setTimeout(() => {
          isAnimating = false;
        }, 1000); // 与 transition 动画时长一致
      }, 1000); // 等待 1 秒，让淡出动画完成
    };

    // 点击下拉框触发事件
    selectWrapEles.forEach((selectWrapEle) => {
      // 打开下拉框
      selectWrapEle.addEventListener("click", () => {
        selectorApi.updateOptions();

        selectWrapEle.classList.toggle("open");
      });

      // 监听option 被点击
      const optionEles = selectWrapEle.querySelectorAll(
        ".options-wrap .select-item-option"
      );

      // 点击选项时，更新显示的选项，并关闭下拉框
      optionEles.forEach((optionEle) => {
        optionEle.addEventListener("click", function (e) {
          e.stopPropagation(); // 阻止事件冒泡
          // const selectWrapEle = optionEle.closest(".select-wrap");

          const valueEle = selectWrapEle.querySelector(".select-trigger span");

          valueEle.textContent = optionEle.textContent.trim();

          selectWrapEle.classList.remove("open");

          handleOptionClick();
        });
      });
    });

    // 关闭所有下拉框的函数
    const closeAllSelects = () => {
      selectWrapEles.forEach((selectWrapEle) => {
        selectWrapEle.classList.remove("open");
      });
    };

    // 点击页面其他地方时，关闭所有下拉框
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".select-wrap")) {
        closeAllSelects();
      }
    });
  };

  /**
   * 监听展示差异按钮
   */
  const listenShowDiffBtn = () => {
    const showDiffBtnWrapEle = document.querySelector(".show-diff-wrap");

    const diffBtnWrap = showDiffBtnWrapEle.querySelector(".diff-check-btn");

    const hookIconEle = showDiffBtnWrapEle.querySelector("img");

    let isAnimating = false; // 防止在动画期间触发多次点击

    const handleClick = () => {
      // 获取容器元素
      const container = document.querySelector(
        ".product-specifications-list-container"
      );

      // 如果正在动画，忽略点击
      if (isAnimating) return;
      isAnimating = true;

      // 开始隐藏现有内容，淡出
      container.style.opacity = "0";

      // 等待淡出动画完成
      setTimeout(() => {
        // 是否展示差异 or 全部内容
        if (showDiff) {
          diffBtnWrap.style.backgroundColor = "#EAEAEA";

          hookIconEle.style.opacity = 1;

          const newDiffSpecificationsData =
            specificationDataApi.getDiffSpecificationsData();

          renderSpecificationsList(newDiffSpecificationsData, container);

          productCategoryApi.expandAll();
        } else {
          hookIconEle.style.opacity = 0;

          diffBtnWrap.style.backgroundColor = "#fff";

          renderSpecificationsList(specificationsData, container);

          productCategoryApi.expand(1);
        }

        productCategoryApi.hideBtn(1);

        // 切换内容后淡入
        container.style.display = "block";

        container.style.opacity = "1";

        scrollApi.scrollToShowDiffBtn();

        listenCategoryExpandBtn();

        // 标记动画结束
        setTimeout(() => {
          isAnimating = false;
        }, 1000); // 与 transition 动画时长一致
      }, 1000); // 等待 1 秒，让淡出动画完成

      showDiff = !showDiff;
    };

    showDiffBtnWrapEle.addEventListener("click", handleClick);
  };

  /**
   * 监听展开收起按钮
   */
  const listenCategoryExpandBtn = () => {
    const handleClick = (targetEle) => {
      const paramsListWrap = targetEle
        .closest(".product-category-wrap")
        .querySelector(".params-list-wrap");

      // 切换'flip-over'类来触发 箭头翻转 动画
      targetEle
        .querySelector(".category-expand-btn")
        .classList.toggle("flip-over");

      // 动态计算内容的最大高度
      const scrollHeight = paramsListWrap.scrollHeight;

      if ([0, "", "0px"].includes(paramsListWrap.style.maxHeight)) {
        paramsListWrap.style.maxHeight = `${scrollHeight}px`;
      } else {
        paramsListWrap.style.maxHeight = "0px";
      }
    };

    const handleSingle = (targetEle) => {
      // 绑定点击事件
      targetEle.addEventListener("click", () => handleClick(targetEle));
    };

    // 找到所有 .category-expand-btn 元素
    const categoryTitleWraps = document.querySelectorAll(
      ".category-title-wrap"
    );

    categoryTitleWraps.forEach((categoryTitleWrap, index) => {
      // 第一个过滤不监听
      if (index === 0) return;

      handleSingle(categoryTitleWrap);
    });
  };

  /**
   * 监听窗口滚动
   */
  const listenWindowScroll = () => {
    window.addEventListener("scroll", function () {
      // 获取元素
      const productContainer = document.querySelector(
        ".product-introduction-container"
      );

      const productContainerFillHeight = document.querySelector(
        ".product-introduction-container-fill-height"
      );

      // 获取当前滚动条距离视窗顶部的距离
      const scrollPosition = window.scrollY;

      // 当滚动条距离顶部 638px 时，添加类 "ceiling"
      if (scrollPosition >= 428) {
        productContainerFillHeight.style.height = 328 + "px";

        productContainer.classList.add("ceiling");
      } else {
        productContainer.classList.remove("ceiling");

        productContainerFillHeight.style.height = "0px";
      }
    });
  };

  const init = () => {
    renderSelectors();

    renderProducts();

    renderShowDiffWrap();

    // 获取容器 元素
    const SpecificationsListcontainerEle = document.querySelector(
      ".product-specifications-list-container"
    );

    renderSpecificationsList(
      specificationsData,
      SpecificationsListcontainerEle
    );

    SpecificationsListcontainerEle.style.opacity = "1";

    productCategoryApi.expand(1);

    productCategoryApi.hideBtn(1);

    listenSelectors();

    listenCategoryExpandBtn();

    listenShowDiffBtn();

    listenWindowScroll();
  };

  init();
})();
