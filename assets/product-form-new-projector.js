(function () {

  console.log("projector 模板正确, 这是当前的产品", location.href);



  /**
   * @等待直到指定类名的元素存在
   * @param {string} className - 目标元素的类名
   * @param {function} callback - 元素存在时执行的回调函数
   */
  const waitForElement = (selectorClass, attrName, callback) => {
    if (!selectorClass) {
      return console.error("waitForElement >>>>>>>> 未传入类名");
    }

    const observer = new MutationObserver(() => {
      const targetElement = document.querySelector(selectorClass);

      if (attrName) {
        if (targetElement && targetElement[attrName]) {
          observer.disconnect(); // 停止观察

          callback(targetElement); // 执行 回调函数
        }
      } else {
        if (targetElement && targetElement.innerHTML.trim()) {
          observer.disconnect(); // 停止观察

          callback(targetElement); // 执行回调函数
        }
      }
    });

    // 开始观察文档主体以检测DOM变化
    observer.observe(document.body, {
      childList: true, // 观察子节点变化
      subtree: true, // 观察所有后代节点
    });
  };

  const parentElement = document.querySelector(".product-form__variants"); // 替换为实际的父元素选择器

  const toggleSizeVisible = (visible = true, targetClickEle) => {
    // 判断是否是等于 Screen Size, Size 不需要滚动
    const isScreenSizeWrap = targetClickEle
      ?.closest(".product-form__option-selector")
      ?.querySelector(".product-form__option-info .product-form__option-name")
      ?.innerText?.includes("Size");

    console.log("是否是 size 选项", targetClickEle, isScreenSizeWrap);

    /**
     *@滚动到指定位置
     */
    const scrollToEle = (targetEle) => {
      // 获取元素的位置
      const elementPosition =
        targetEle.getBoundingClientRect().top + window.pageYOffset;

      // 设置目标滚动位置，并加上你想要的偏移量（例如 100px）
      const offset = window.innerWidth <= 1024 ? 270 : 200;

      setTimeout(() => {
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }, 500)
    };

    const sizeWrapEle = document.querySelector(
      ".product-form .product-form__variants .product-form__option-selector:nth-child(2)"
    );

    if (visible) {
      sizeWrapEle.style.display = "block"; // 设置为可见

      !isScreenSizeWrap && scrollToEle(sizeWrapEle);
    } else {
      sizeWrapEle.style.display = "none"; // 设置为隐藏
    }
  };

  function formatMoney(cents, format = "") {
    if (typeof cents === "string") {
      cents = cents.replace(".", "");
    }

    // 默认格式化为不带小数的金额
    const formatString = format || "<span class=trans-money>${{amount}}</span>";

    // 确保传入的是数字
    cents = parseFloat(cents);

    function formatWithDelimiters(number, thousands, decimal) {
      thousands = thousands || ",";
      decimal = decimal || ".";

      // 将分值转换为金额单位
      number = (number / 100).toFixed(2);

      // 将整数和小数分开
      let parts = number.split(".");
      let dollarsAmount = parts[0].replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        "$1" + thousands
      );
      let centsAmount = parts[1];

      // 如果小数部分为 "00" 则省略小数部分，否则保留小数部分
      return centsAmount === "00"
        ? dollarsAmount
        : dollarsAmount + decimal + centsAmount;
    }

    // 调用格式化函数，不带小数的格式化金额
    let value = formatWithDelimiters(cents);

    // 返回格式化的字符串
    return formatString.replace(/\{\{\s*amount\s*\}\}/, value);
  }

  const productMetaApi = {
    priceClass: "price--large",

    unitPriceClass: "",

    updateLabels(variant) {
      const eles = document.querySelectorAll("[new-data-product-label-list]");

      eles.forEach((productLabelList) => {
        if (!productLabelList) {
          return;
        }
        if (!variant) {
          productLabelList.innerHTML = "";
        } else {
          productLabelList.innerHTML = "";
          if (!variant["available"]) {
            productLabelList.innerHTML = `<span class="label label--subdued">${window.themeVariables.strings.collectionSoldOut}</span>`;
          } else if (variant["compare_at_price"] > variant["price"]) {
            let savings = "";
            if (window.themeVariables.settings.discountMode === "percentage") {
              savings = `${Math.round(
                ((variant["compare_at_price"] - variant["price"]) * 100) /
                variant["compare_at_price"]
              )}%`;
            } else {
              savings = formatMoney(
                variant["compare_at_price"] - variant["price"]
              );
            }
            productLabelList.innerHTML = `<span class="label label--highlight">${window.themeVariables.strings.collectionDiscount.replace(
              "@savings@",
              savings
            )}</span>`;
          }
        }
      });
    },

    updatePrices(variant) {
      const eles = document.querySelectorAll("[new-data-product-price-list]");

      eles.forEach((productPrices) => {
        if (!productPrices) return;

        if (!variant) {
          productPrices.style.display = "none";
        } else {
          productPrices.innerHTML = "";
          if (variant["compare_at_price"] > variant["price"]) {
            productPrices.innerHTML += `<span class="price price--highlight ${this.priceClass
              }"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice
              }</span>${formatMoney(variant["price"])}</span>`;
            productPrices.innerHTML += `<span class="price price--compare"><span class="visually-hidden">${window.themeVariables.strings.productRegularPrice
              }</span>${formatMoney(variant["compare_at_price"])}</span>`;
          } else {
            productPrices.innerHTML += `<span class="price ${this.priceClass
              }"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice
              }</span>${formatMoney(variant["price"])}</span>`;
          }
          if (variant["unit_price_measurement"]) {
            let referenceValue = "";
            if (variant["unit_price_measurement"]["reference_value"] !== 1) {
              referenceValue = `<span class="unit-price-measurement__reference-value">${variant["unit_price_measurement"]["reference_value"]}</span>`;
            }
            productPrices.innerHTML += `
          <div class="price text--subdued ${this.unitPriceClass}">
            <div class="unit-price-measurement">
              <span class="unit-price-measurement__price">${formatMoney(
              variant["unit_price"]
            )}</span>
              <span class="unit-price-measurement__separator">/</span>
              ${referenceValue}
              <span class="unit-price-measurement__reference-unit">${variant["unit_price_measurement"]["reference_unit"]
              }</span>
            </div>
          </div>
        `;
          }
          productPrices.style.display = "";
        }
      });
    },
  };

  /**
   * @全局变量
   * */

  const giftIds = [];

  /**
   * @处理选中事件
   */
  const handelSelected = (targetClickEle) => {
    const searchParamsInstance = new URL(location.href).searchParams;

    const productData = document.querySelector(
      ".product-form .product-form__variants"
    ).product;

    const variantsData = productData.variants;

    const variantId =
      Number(searchParamsInstance.get("variant")) || variantsData[0].id;

    // 找到选中的这个变体数据
    const variantData = variantsData.find(
      (variantItem) => variantItem.id === variantId
    );

    /**
     * 处理单个变体数据 逻辑
     **/

    console.log("toggleSizeVisible", variantId, variantsData[0].id);
    // 第一个是不需要展示 size 的
    if (variantId === variantsData[0].id) {
      toggleSizeVisible(false, targetClickEle);
    } else {
      toggleSizeVisible(true, targetClickEle);
    }

    // 更改价格
    productMetaApi.updateLabels(variantData);

    productMetaApi.updatePrices(variantData);

    // End 处理单个变体数据逻辑

    // console.log(
    //   "子 变体数据 >>>>>>>>>>>>>>",
    //   variantData,
    //   "variantsData >>",
    //   variantsData,
    //   "variantId",
    //   variantId
    // );

    const childVariantIds = variantData.featured_image.variant_ids;

    const parentVariantName = variantData.option1;

    const updateVariants = [];

    updateVariants.push({
      name: parentVariantName,
      price: variantData.price,
      compare_at_price: variantData.compare_at_price,
    });

    childVariantIds.forEach((childVariantId) => {
      const childrenVariantData = variantsData.find(
        (variantItem) => variantItem.id === childVariantId
      );

      updateVariants.push({
        name: childrenVariantData.option2,
        price: childrenVariantData.price,
        compare_at_price: childrenVariantData.compare_at_price,
      });
    });

    const variantLabelEles = document.querySelectorAll(
      ".product-form__variants .product-form__option-selector .block-swatch-list .block-swatch__item"
    );

    // 寻找元素下面的第一个文本节点，然后去变体数据里面进行寻找
    variantLabelEles.forEach((variantEle) => {
      const firstLevelText = variantEle
        .querySelector(".product_option_title")
        .innerText.trim();

      updateVariants.forEach((updateVariantItem, updateVariantIndex) => {
        if (updateVariantItem.name !== firstLevelText) return;

        // 这里的 0 是 option 模块的选中的那一个单选商品
        if (updateVariantIndex === 0) {
          // 去除 from 文本
          variantEle.querySelector(
            ".product_bundle_price .from_price"
          ).style.display = "none";

          // 存眼镜 id
          const giftContainerEle = variantEle.querySelector(
            ".product-gifts-container"
          );

          if (giftContainerEle) {
            giftIds.push($(giftContainerEle).attr("data-variants"));
          }
        }

        const priceEles = variantEle.querySelectorAll(
          ".product_bundle_price .price_with_compare .trans-money"
        );

        const currentPrice = (updateVariantItem.price / 100).toLocaleString();

        const comparePrice = (
          updateVariantItem.compare_at_price / 100
        ).toLocaleString();

        priceEles[0].innerText = "$" + currentPrice;

        if (priceEles.length === 2) {
          if (updateVariantItem.compare_at_price > 0) {
            priceEles[1].innerText = "$" + comparePrice;
          } else {
            priceEles[1].innerText = "";
          }
        }
      });
    });
  };

  const handelRating = () => {
    $(".app_block_new").css("display", "none");

    const productRatingCommentsWraperClassName =
      window.innerWidth < 1024
        ? ".product-rating-comments-wrapper-mobile"
        : ".product-rating-comments-wrapper";

    $(`${productRatingCommentsWraperClassName} .app_block_new`).css(
      "display",
      "block"
    );

    const commentsCount = $(
      `${productRatingCommentsWraperClassName} .wc_product_review_title .wc_product_review_avg_badge_count`
    ).text();

    const hideReview = String(commentsCount) === "0";

    if (hideReview) {
      $(`${productRatingCommentsWraperClassName} .app_block_new`).css(
        "display",
        "none"
      );

      $(`${productRatingCommentsWraperClassName}`).css("display", "none");
    }
  };

  /**
   * @监听事件
   * */

  /**
   * 监听选项点击事件
   */
  parentElement.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target.tagName === "LABEL" &&
      target.classList.contains("block-swatch__item")
    ) {
      // console.log(
      //   "在父元素下发生点击事件，目标元素为符合条件的 label 标签：",
      //   target
      // );

      setTimeout(() => {
        handelSelected(target);
      }, 10);
    }
  });

  // 等待 dom 节点里面是否有一个属性
  waitForElement(
    ".product-form .product-form__variants",
    "product",
    (targetEle) => {
      // console.log("成功检测到数据变化 >>>>>>>>>>>>>>>>>>>>", targetEle.product);

      handelSelected();
    }
  );

  waitForElement(
    ".product-rating-comments-wrapper .wc_product_review_title .wc_product_review_text",
    null,
    (targetEle) => {
      // console.log("评价模块渲染出来了 >>>>>>>>>>>>>>>>>>>>", targetEle);

      handelRating();
    }
  );

  waitForElement(
    ".shopify-payment-button .shopify-payment-button__more-options",
    null,
    (targetEle) => {
      console.log("shop pay 出现 >>>>>>>>>>>>>>>");

      if (location?.href?.includes("4k-3d-triple-laser-projector-ltv-3500-pro")) {

        const btnEle = document.querySelector('.shopify-payment-button')

        if(btnEle) {
          btnEle.style.display = 'block !important'
        }
        
        console.log("3500 pro 才出现 >>>>>>>>>>>>>>>");
      }

    }
  );

})();
