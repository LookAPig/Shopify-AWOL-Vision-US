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

    openDialogBtnEles.forEach((openDialogBtnEle) => {
      openDialogBtnEle.addEventListener("click", (event) => {
        event.preventDefault();
        
        const dialogEle = document.querySelector(
          "#thunder_room_products_dialog"
        );

        dialogEle.showModal();
      });
    });

    /**
     * @监听oepn dialog 关闭事件
     */
    document
      .querySelector(".dialog_close_btn")
      .addEventListener("click", () => {
        console.log('click')
        document.querySelector("#thunder_room_products_dialog").close();
      });

    listenSelectsChange();
  };

  init();
})();
