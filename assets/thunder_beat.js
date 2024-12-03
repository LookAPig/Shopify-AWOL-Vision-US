$(function () {
    $(".ultra_item").on("click", function () {
      $(".ultra_item").removeClass("active");
      $(".ultra_img").removeClass("active");
      $(this).addClass("active");
      let index = $(this).index();
      $(".ultra_img").eq(index).addClass("active");
    });
    $(".show_more").hide();
    $("#thunder_room_products_dialog .promotion_container").hide();
    $("#thunder_room_products_dialog .show_more").show();
    $(".show_more").on("click", function () {
      $(".show_more").hide();
      $(".promotion_container").show(300);
    });
  });

const targetElement1 = document.getElementById('one_image');
const targetElement2 = document.getElementById('two_image');
const targetElement3 = document.getElementById('three_image');
const one_list = document.getElementById('one_list');
const two_list = document.getElementById('two_list');
const three_list = document.getElementById('three_list');
targetElement1.style.opacity = '1'
one_list.style.opacity = '1'
window.addEventListener('scroll', function () {

    const viewportHeight = window.innerHeight;

    var targetElement1_y = targetElement1.getBoundingClientRect()
    var targetElement1_s = targetElement1_y.y

    var targetElement2_y = targetElement2.getBoundingClientRect()
    var targetElement2_s = targetElement2_y.y

    var targetElement3_y = targetElement3.getBoundingClientRect()
    var targetElement3_s = targetElement3_y.y
    
    const distance1 = viewportHeight - (targetElement1_y.top + targetElement1_y.height);
    const distance2 = viewportHeight - (targetElement2_y.top + targetElement2_y.height);
    const distance3 = viewportHeight - (targetElement3_y.top + targetElement3_y.height);

    console.log('targetElement1_s', targetElement1_s)
    if (targetElement1_s) {
      console.log('distance2', distance2)
        targetElement1.style.opacity = '1'
        one_list.style.opacity = '1'
        two_list.style.opacity = '0'
        three_list.style.opacity = '0'
    }
    if (targetElement2_s == 40) {
        targetElement2.style.opacity = '1'
        one_list.style.opacity = '0'
        two_list.style.opacity = '1'
        three_list.style.opacity = '0'
    } else if (targetElement2_s > 40) {
        targetElement2.style.opacity = '0'
        one_list.style.opacity = '1'
        two_list.style.opacity = '0'
        three_list.style.opacity = '0'
    }
    if (targetElement3_s == 40) {
        targetElement3.style.opacity = '1'
        two_list.style.opacity = '0'
        three_list.style.opacity = '1'
    } else if (targetElement3_s > 40) {
        targetElement3.style.opacity = '0'
        two_list.style.opacity = '1'
        three_list.style.opacity = '0'
    }
})