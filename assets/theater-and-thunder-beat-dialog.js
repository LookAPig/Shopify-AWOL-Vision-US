(function () {
  const init = () => {
    // 移动节点到 body 最后，使用全局 弹窗避免图层父子干扰
    const dialogEle = document.querySelector("#terms_dialog");

    document.body.appendChild(dialogEle.cloneNode(true));

    dialogEle.remove();

    /**
     * @监听oepn dialog 打开事件
     */
    const openDialogBtnEles = document.querySelectorAll(".terms_dialog_open_btn");

    openDialogBtnEles.forEach((openDialogBtnEle) => {
      openDialogBtnEle.addEventListener("click", (event) => {
        event.preventDefault();

        const dialogEle = document.querySelector(
          "#terms_dialog"
        );

        dialogEle.showModal();
        document.body.style.overflow = 'hidden';
      });
    });

    /**
     * @监听oepn dialog 关闭事件
     */
    document
      .querySelector(".terms_dialog_close_btn")
      .addEventListener("click", () => {
        document.querySelector("#terms_dialog").close();
        document.body.style.overflow = 'auto';
      });
  };

  init();
})();
