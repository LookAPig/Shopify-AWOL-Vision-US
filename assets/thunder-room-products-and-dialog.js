(function () {
  const makeEleVisible = (selectElement) => {
    // 获取被选中的值
    const selectedValue = selectElement.value;

    // 首先隐藏所有相关元素

    const productItemWrapEle = selectElement.closest(".product_item_wrap");

    const msrpEles = productItemWrapEle.querySelectorAll(".msrp_wrap");

    msrpEles.forEach((el) => {
      el.style.display = "none";
    });

    // 显示选中的值对应的元素
    const targetMsrpEle = productItemWrapEle.querySelector(`.${selectedValue}`);

    targetMsrpEle.style.display = "block";
  };

  /**
   * @监听select 改变事件
   */

  const listenSelectsChange = () => {
    const selectEles = document.querySelectorAll(
      ".thunder_room_products_main .product_item_selector select"
    );
    selectEles.forEach((selectElement) => {
      selectElement.addEventListener("change", () =>
        makeEleVisible(selectElement)
      );
    });
  };

  const init = () => {
    // 打开价格
    const selectEles = document.querySelectorAll(
      ".thunder_room_products_main .product_item_selector select"
    );

    selectEles.forEach((selectElement) => makeEleVisible(selectElement));

    // 移动节点到 body 最后，使用全局 弹窗避免图层父子干扰
    const dialogEle = document.querySelector("#thunder_room_products_dialog");

    document.body.appendChild(dialogEle.cloneNode(true));

    dialogEle.remove();

    /**
     * @监听oepn dialog 打开事件
     */
    const openDialogBtnEles = document.querySelectorAll(".dialog_open_btn");
    const collection_item = document.querySelectorAll(".collection_item");

    openDialogBtnEles.forEach((openDialogBtnEle) => {
      openDialogBtnEle.addEventListener("click", (event) => {
        event.preventDefault();

        const dialogEle = document.querySelector(
          "#thunder_room_products_dialog"
        );

        dialogEle.showModal();
        document.body.style.overflow = "hidden";
      });
    });

    collection_item.forEach((collectionItemBtnEle) => {
      collectionItemBtnEle.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(event.target.id);
        const dialogEle = document.querySelector("#thunder_collection_dialog");

        dialogEle.showModal();
        document.body.style.overflow = "hidden";
      });
    });

    /**
     * @监听oepn dialog 关闭事件
     */
    document
      .querySelector(".dialog_close_btn")
      .addEventListener("click", () => {
        console.log("click");
        document.querySelector("#thunder_room_products_dialog").close();
        document.body.style.overflow = "auto";
      });
    document
      .querySelector(".dialog_close_btn2")
      .addEventListener("click", () => {
        console.log("click");
        document.querySelector("#thunder_collection_dialog").close();
        document.body.style.overflow = "auto";
      });
    listenSelectsChange();
  };

  init();
})();
// 切换下拉选项 修改结账按钮
$(".product_item_selector select").on("change", function () {
  var vId = $(this).find("option:selected").attr("data-id");
  console.log("123", $(this).parent());
  if ($(this).hasClass("no_gift")) {
    $(this)
      .parent()
      .parent()
      .find(".product_item_btn_wrap a")
      .attr("href", "https://awolvision.com/cart/" + vId + ":1");
  } else {
    $(this)
      .parent()
      .parent()
      .find(".product_item_btn_wrap a")
      .attr(
        "href",
        "https://awolvision.com/cart/" + vId + ":1,41594732445744:1"
      );
  }
});
