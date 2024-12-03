(function () {
  // PC.js
  // 移动端，判空
  if (window.innerWidth < 1024) return;

  console.log("这里是pc 段");

  const productsData = [
    {
      image:
        "//awolvision.com/cdn/shop/files/1_ca67cdfe-80a1-4503-a8d6-2bc32181f010_400x.jpg?v=1693912063",
      title: "LTV-3500 Pro",
      subTitle: "Masterpiece Innovation and Tech",
      price: "$5,999.00",
      link: "https://awolvision.com/products/4k-3d-triple-laser-projector-ltv-3500-pro",
    },
    {
      image:
        "//awolvision.com/cdn/shop/files/1_ca67cdfe-80a1-4503-a8d6-2bc32181f010_400x.jpg?v=1693912063",
      title: "LTV-3000 Pro",
      subTitle: "Balanced Performance and Value",
      price: "$3,999.00",
      link: "https://awolvision.com/products/4k-3d-triple-laser-projector-ltv-3000pro",
    },
    {
      image:
        "//awolvision.com/cdn/shop/files/1_ca67cdfe-80a1-4503-a8d6-2bc32181f010_400x.jpg?v=1693912063",
      title: "LTV-2500",
      subTitle: "Entry Model With Reliable Features",
      price: "$2,999.00",
      link: "https://awolvision.com/products/awol-vision-4k-tri-chroma-laser-projector-ltv-2500",
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "3000 Peak Lumens",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "2600 Peak Lumens",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_2.svg?v=1726197475",
              text: "4K@60Hz",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_2.svg?v=1726197475",
              text: "4K@60Hz",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_3.svg?v=1726197475",
              text: "107% BT.2020",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_3.svg?v=1726197475",
              text: "107% BT.2020",
              visible: true,
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
            },
            {
              type: "icon-text",
              text: "2500:1",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_4.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon-text",
              text: "2500:1",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_4.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon-text",
              text: "Yes",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_5.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon-text",
              text: "Yes",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_5.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_6.svg?v=1726197475",
              text: "15ms 4K@60Hz, 8ms 1080p@120Hz in Turbo Mode",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_6.svg?v=1726197475",
              text: "15ms 4K@60Hz, 8ms 1080p@120Hz in Turbo Mode",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_7.svg?v=1726197475",
              text: "Dolby Vision, HDR 10+, HDR 10, HLG",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_7.svg?v=1726197475",
              text: "Dolby Vision, HDR 10+, HDR 10, HLG",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_8.svg?v=1726197474",
              text: "3*HDMI(eARC on HDMI 2)",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_8.svg?v=1726197474",
              text: "3*HDMI(eARC on HDMI 2)",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_9.svg?v=1726197475",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_9.svg?v=1726197475",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: false,
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
            },
            {
              type: "text",
              text: "80-150 inches",
              visible: true,
            },
            {
              type: "text",
              text: "80-150 inches",
              visible: true,
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
            },
            {
              type: "text",
              text: "Customized Ricoh F2.0 pure glass lens with super sharpness",
              visible: true,
            },
            {
              type: "text",
              text: "Customized Ricoh F2.0 pure glass lens with super sharpness",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "text",
              text: "0.25: 1",
              visible: true,
            },
            {
              type: "text",
              text: "0.25: 1",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "text",
              text: "8 points",
              visible: true,
            },
            {
              type: "text",
              text: "8 points",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "text",
              text: "Tl 0.47-inch pico DMD",
              visible: true,
            },
            {
              type: "text",
              text: "Tl 0.47-inch pico DMD",
              visible: true,
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
            },
            {
              type: "text",
              text: "Tri-Color Pure Laser",
              visible: true,
            },
            {
              type: "text",
              text: "Tri-Color Pure Laser",
              visible: true,
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
            },
            {
              type: "text",
              text: "25,000+ hours",
              visible: true,
            },
            {
              type: "text",
              text: "25,000+ hours",
              visible: true,
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
            },
            {
              type: "text",
              text: "Android 9.0",
              visible: true,
            },
            {
              type: "text",
              text: "Android 9.0",
              visible: true,
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
            },
            {
              type: "text",
              text: "3G/128G",
              visible: true,
            },
            {
              type: "text",
              text: "3G/128G",
              visible: true,
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
            },
            {
              type: "text",
              text: "36w (Stereo)",
              visible: true,
            },
            {
              type: "text",
              text: "36w (Stereo)",
              visible: true,
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
            },
            {
              type: "text",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
            },
            {
              type: "text",
              text: "Dolby Atmos, DTS Virtual X",
              visible: true,
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
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "text",
              text: "100 - 240V@50-60Hz",
              visible: true,
            },
            {
              type: "text",
              text: "100 - 240V@50-60Hz",
              visible: true,
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
            },
            {
              type: "text",
              text: "185 W",
              visible: true,
            },
            {
              type: "text",
              text: "175 W",
              visible: true,
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
            },
            {
              type: "text",
              text: "0.5 W",
              visible: true,
            },
            {
              type: "text",
              text: "0.5 W",
              visible: true,
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
            },
            {
              type: "text",
              text: "Yes, IR&Bluetooth dual mode",
              visible: true,
            },
            {
              type: "text",
              text: "Yes, IR&Bluetooth dual mode",
              visible: true,
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
            },
            {
              type: "text",
              text: "2*USB 2.0",
              visible: true,
            },
            {
              type: "text",
              text: "2*USB 2.0",
              visible: true,
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
            },
            {
              type: "text",
              text: "1*LAN",
              visible: true,
            },
            {
              type: "text",
              text: "1*LAN",
              visible: true,
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
            },
            {
              type: "text",
              text: "1*S/PDIF",
              visible: true,
            },
            {
              type: "text",
              text: "1*S/PDIF",
              visible: true,
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
            },
            {
              type: "text",
              text: "1*AV In",
              visible: true,
            },
            {
              type: "text",
              text: "1*AV In",
              visible: true,
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
            },
            {
              type: "text",
              text: "1",
              visible: true,
            },
            {
              type: "text",
              text: "1",
              visible: true,
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
            },
            {
              type: "text",
              text: "Yes, 802.11a/b/g/n/ac (Dual-Band)",
              visible: true,
            },
            {
              type: "text",
              text: "Yes, 802.11a/b/g/n/ac (Dual-Band)",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
            },
            {
              type: "icon",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_11.svg?v=1726197475",
              visible: true,
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
            },
            {
              type: "text",
              text: "  23.6*13.9*5.7 inches / 599*353*145 mm",
              visible: true,
            },
            {
              type: "text",
              text: "  23.6*13.9*5.7 inches / 599*353*145 mm",
              visible: true,
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
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
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
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
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
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
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
            },
            {
              type: "text",
              text: "32-104°F / 0-40℃",
              visible: true,
            },
            {
              type: "text",
              text: "32-104°F / 0-40℃",
              visible: true,
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
            },
            {
              type: "text",
              text: "-4-140°F / -20-60℃",
              visible: true,
            },
            {
              type: "text",
              text: "-4-140°F / -20-60℃",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "3000 Peak Lumens",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_1.svg?v=1726197475",
              text: "2600 Peak Lumens",
              visible: true,
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
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: true,
            },
            {
              type: "icon-text",
              icon: "https://cdn.shopify.com/s/files/1/0554/7445/4576/files/projectors_comparison_icon_10.svg?v=1726197475",
              text: "PJLink, Control 4, SAVANT and Crestron",
              visible: false,
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
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
            },
            {
              type: "text",
              text: "<=27dB",
              visible: true,
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
            },
            {
              type: "text",
              text: "185 W",
              visible: true,
            },
            {
              type: "text",
              text: "175 W",
              visible: true,
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
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
            },
            {
              type: "text",
              text: "26.5 lbs / 12 kg",
              visible: true,
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
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
            },
            {
              type: "text",
              text: "29.0*19.5*11.8 inches / 736*495*300 mm",
              visible: true,
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
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
            },
            {
              type: "text",
              text: "29.5 lbs / 13.4 kg",
              visible: true,
            },
          ],
        },
      ],
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

  const createProductEles = () => {
    return productsData.map((pcProduct) => {
      const productWrap = document.createElement("div");

      productWrap.className = "product-wrap";

      productWrap.innerHTML = `
        <img src="${pcProduct.image}" alt="" class="image">
        <span class="title">${pcProduct.title}</span>
        <span class="sub-title">${pcProduct.subTitle}</span>
        <span class="price">${pcProduct.price}</span>
        <a class="shop-now" href="${pcProduct.link}">SHOP NOW</a>
      `;

      return productWrap;
    });
  };

  const renderProducts = () => {
    // 获取容器元素
    const container = document.querySelector(".product-introduction-wrap");

    container.appendChild(createShowDiffWrapEle());

    createProductEles().forEach((productEle) =>
      container.appendChild(productEle)
    );
  };

  const renderSpecificationsList = (data, rootEle) => {
    rootEle.innerHTML = "";

    const renderParamsChildren = (children) => {
      let template = "";

      children.forEach((item) => {
        if (!item.visible) {
          return (template += `
            <div class="param-item-1">-</span></div>
          `);
        }

        if (item.type === "icon-text") {
          return (template += `
          <div class="param-item-1"><img src="${item.icon}" /><span>${item.text}</span></div>
        `);
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
      return document.querySelectorAll(
        ".product-specifications-list-container .product-category-wrap"
      );
    },

    expandAll() {
      const productCategoryWrapEles = this.getAll();

      productCategoryWrapEles.forEach((ele) => this.expandTargetEle(ele));
    },
    expandTargetEle(targetEle) {
      const paramsListWrap = targetEle.querySelector(".params-list-wrap");

      // 切换'flip-over'类来触发 箭头翻转 动画
      targetEle
        .querySelector(".category-title-wrap .category-expand-btn")
        .classList.toggle("flip-over");

      // 动态计算内容的最大高度
      console.dir(paramsListWrap);

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

  const scrollApi = {
    scrollToShowDiffBtn() {
      document.documentElement.scrollTo(0, 500);
    },
  };

  /**
   * 监听展示差异按钮
   */
  const listenShowDiffBtn = () => {
    const showDiffBtnWrapEle = document.querySelector(".show-diff-wrap");

    const diffBtnWrap = showDiffBtnWrapEle.querySelector(".diff-check-btn");

    const hookIconEle = showDiffBtnWrapEle.querySelector("img");

    let showDiff = false;
    let isAnimating = false; // 防止在动画期间触发多次点击

    showDiffBtnWrapEle.addEventListener("click", function () {
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

          renderSpecificationsList(diffSpecificationsData, container);

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
        }, 600); // 与 transition 动画时长一致
      }, 700); // 等待 1 秒，让淡出动画完成

      showDiff = !showDiff;
    });
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

      console.log("height >>>>>>>>>>", scrollHeight);

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
      if (scrollPosition >= 638) {
        productContainerFillHeight.style.height = 553 + "px";

        productContainer.classList.add("ceiling");
      } else {
        productContainer.classList.remove("ceiling");

        productContainerFillHeight.style.height = "0px";
      }
    });
  };

  const init = () => {
    renderProducts();

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

    listenCategoryExpandBtn();

    listenShowDiffBtn();

    listenWindowScroll();
  };

  init();
})();
