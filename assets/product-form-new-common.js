(function () {
  console.log("common 模板 产品是应该是 >>>>>>>>>>>>", location.href);

  /**
   * @等待直到指定类名的元素存在
   * @param {string} className - 目标元素的类名
   * @param {function} callback - 元素存在时执行的回调函 数
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

          callback(targetElement); // 执行回调函数
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

  const toggleSizeVisible = () => {
    const sizeWrapEle = document.querySelector(
      ".product-form .product-form__variants .product-form__option-selector:nth-child(2)"
    );

    sizeWrapEle.style.display = "block"; // 设置为可见

    // 获取元素的位置
    const elementPosition =
      sizeWrapEle.getBoundingClientRect().top + window.pageYOffset;

    // 设置目标滚动位置，并加上你想要的偏移量（例如 100px）
    const offset = window.innerWidth <= 1024 ? 70 : 200;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  };

  // 格式化价格
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
            productPrices.innerHTML += `<span class="price price--highlight ${
              this.priceClass
            }"><span class="visually-hidden">${
              window.themeVariables.strings.productSalePrice
            }</span>${formatMoney(variant["price"])}</span>`;
            productPrices.innerHTML += `<span class="price price--compare"><span class="visually-hidden">${
              window.themeVariables.strings.productRegularPrice
            }</span>${formatMoney(variant["compare_at_price"])}</span>`;
          } else {
            productPrices.innerHTML += `<span class="price ${
              this.priceClass
            }"><span class="visually-hidden">${
              window.themeVariables.strings.productSalePrice
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
              <span class="unit-price-measurement__reference-unit">${
                variant["unit_price_measurement"]["reference_unit"]
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
   * @过滤product_variants
   */
  function filterAndUpdateVariantIds(data) {
    // 遍历每个对象
    return data.map((item) => {
      // 检查 variant_ids 是否存在并且是数组
      if (Array.isArray(item.featured_image.variant_ids)) {
        // 存储匹配的 variant_ids
        const filteredIds = [];

        // 检查 variant_ids 中的每个 id
        item.featured_image.variant_ids.forEach((variantId) => {
          // 如果该 id 在数据中存在且 option1 匹配，则添加到 filteredIds
          const matchingItem = data.find(
            (innerItem) => innerItem.id === variantId
          );

          if (matchingItem && matchingItem.option1 === item.option1) {
            filteredIds.push(variantId);
          }
        });

        // 更新原对象的 variant_ids 字段
        item.featured_image.variant_ids = filteredIds;
      } else {
        console.warn(
          `Item with id ${item.id} does not have a valid variant_ids array.`
        );
      }

      return item;
    });
  }

  /**
   * @处理选中事件
   */
  const handelSelected = () => {
    const searchParamsInstance = new URL(location.href).searchParams;

    const productData = document.querySelector(
      ".product-form .product-form__variants"
    ).product;

    const variantsData = filterAndUpdateVariantIds(productData.variants);

    const variantId =
      Number(searchParamsInstance.get("variant")) || variantsData[0].id;

    // 找到选中的这个变体数据
    const variantData = variantsData.find(
      (variantItem) => variantItem.id === variantId
    );

    /**
     * 点击选项滚动
     **/
    // toggleSizeVisible(true);

    // 更改价格
    productMetaApi.updateLabels(variantData);

    productMetaApi.updatePrices(variantData);

    // End 处理单个变体数据 逻辑

    // 子变体 id 数组
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

        // 这里的 0 是 option 模块的选中的那一个 单选商品
        if (updateVariantIndex === 0) {
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

        priceEles[1].innerText = "$" + comparePrice;
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
      target.classList.contains("common-swatch__item")
    ) {
      // console.log(
      //   "在父元素下发生点击事件，目标元素为符合条件的 label 标签：",
      //   target
      // );

      setTimeout(() => {
        handelSelected();
      }, 10);
    }
  });

  /**
   * 监听添加购物车事件
   */
  document.querySelector('[oid="add-to-cart"]').onsubmit = function () {
    let vid = document.querySelector('[oid="add-to-cart"]').id.value;

    let quantity = document.querySelector(".quantity-new-selector__input").value;

    // 这个 礼物 id 在全局里面

    const ids = [giftIds[giftIds.length - 1]];

    const uniqueIds = ids;

    const params = [{ id: vid, quantity: quantity }];

    uniqueIds
      .filter(Boolean)
      .forEach((uniqueId) => params.push({ id: uniqueId, quantity: quantity }));

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: params,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res?.items) return;

        window.location.href = "/cart";
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return false;
  };

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
})();
