var mySwiper_four = new Swiper(".youtube_container", {
  // loop: true,
  slidesPerView: window.innerWidth > 1024 ? 2 : 1,
  spaceBetween: 20,
  //   effect: 'fade',
  pagination: {
    el: ".youtube_container .swiper-pagination",
  },
  navigation: {
    nextEl: ".youtube_container .swiper-button-next",
    prevEl: ".youtube_container .swiper-button-prev",
  },
});
var mySwiper_four = new Swiper(".youtube_kol_container", {
  // loop: true,
  slidesPerView: window.innerWidth > 1024 ? 2 : 1,
  spaceBetween: 20,
  //   effect: 'fade',
  pagination: {
    el: ".youtube_container .swiper-pagination",
  },
  navigation: {
    nextEl: ".youtube_container .swiper-button-next",
    prevEl: ".youtube_container .swiper-button-prev",
  },
});
var mySwiper_one = new Swiper(".swiper_one", {
  //slidesPerView: 3,
  spaceBetween: 36,
  centeredSlides: true,
  loop: true,
  //   effect: 'fade',
  autoplay: {
    delay: 4000,
  },
  pagination: {
    el: ".swiper-pagination-one",
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
    renderBullet: function (index, className) {
      switch (index) {
        case 0:
          text = "True-to Life One +<br> Billion Colors";
          break;
        case 1:
          text = "Gamers,<br> Behold!";
          break;
        case 2:
          text = "Stunning<br> 3D performance";
          break;
      }
      return '<span class="' + className + '">' + text + "</span>";
    },
  },
});
var mySwiper_two = new Swiper(".swiper_two", {
  //slidesPerView: 3,
  spaceBetween: 36,
  centeredSlides: true,
  loop: true,
  //   effect: 'fade',
  pagination: {
    el: ".swiper-pagination-two",
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
    renderBullet: function (index, className) {
      switch (index) {
        case 0:
          text = "Cinematic+ Floor Rising";
          break;
        case 1:
          text = "Cinematic";
          break;
        case 2:
          text = "DayLight";
          break;
      }
      return '<span class="' + className + '">' + text + "</span>";
    },
  },
});
var mySwiper_three = new Swiper(".introducing_swiper", {
  loop: true,
  //   effect: 'fade',
  pagination: {
    el: ".introducing_swiper .swiper-pagination",
  },
  navigation: {
    nextEl: ".introducing_swiper .swiper-button-next",
    prevEl: ".introducing_swiper .swiper-button-prev",
  },
});
var mySwiper_four = new Swiper(".testers-say-swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  //   effect: 'fade',
  autoplay: {
    delay: 4000,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var mySwiper_five = new Swiper(".thunder_collection", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  //   effect: 'fade',
  autoplay: {
    delay: 4000,
  },
});
// function isInViewport(element) {
//   const rect = element.getBoundingClientRect();
//   return (
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }
// window.addEventListener('scroll', () => {
//   const stickyElement = document.getElementById('swiper-pagination-one');
//   const rect = stickyElement.getBoundingClientRect();
//   if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
//     // 进入视口时的处理
//     stickyElement.style.position = 'fixed';
//     stickyElement.style.top = '56px';
//   } else {
//     // 离开视口时的处理
//     stickyElement.style.position = 'relative';
//     stickyElement.style.top = '0px';
//   }
// });
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
const targetElement1 = document.getElementById("one_image");
const targetElement2 = document.getElementById("two_image");
const targetElement3 = document.getElementById("three_image");
const one_list = document.getElementById("one_list");
const two_list = document.getElementById("two_list");
const three_list = document.getElementById("three_list");
targetElement1.style.opacity = "1";
one_list.style.opacity = "1";
window.addEventListener("scroll", function () {
  const viewportHeight = window.innerHeight;

  var targetElement1_y = targetElement1.getBoundingClientRect();
  var targetElement1_s = targetElement1_y.y;

  var targetElement2_y = targetElement2.getBoundingClientRect();
  var targetElement2_s = targetElement2_y.y;

  var targetElement3_y = targetElement3.getBoundingClientRect();
  var targetElement3_s = targetElement3_y.y;

  const distance1 =
    viewportHeight - (targetElement1_y.top + targetElement1_y.height);
  const distance2 =
    viewportHeight - (targetElement2_y.top + targetElement2_y.height);
  const distance3 =
    viewportHeight - (targetElement3_y.top + targetElement3_y.height);

  console.log("targetElement1_s", targetElement1_s);
  if (targetElement1_s) {
    console.log("distance2", distance2);
    targetElement1.style.opacity = "1";
    one_list.style.opacity = "1";
    two_list.style.opacity = "0";
    three_list.style.opacity = "0";
  }
  if (targetElement2_s == 40) {
    targetElement2.style.opacity = "1";
    one_list.style.opacity = "0";
    two_list.style.opacity = "1";
    three_list.style.opacity = "0";
  } else if (targetElement2_s > 40) {
    targetElement2.style.opacity = "0";
    one_list.style.opacity = "1";
    two_list.style.opacity = "0";
    three_list.style.opacity = "0";
  }
  if (targetElement3_s == 40) {
    targetElement3.style.opacity = "1";
    two_list.style.opacity = "0";
    three_list.style.opacity = "1";
  } else if (targetElement3_s > 40) {
    targetElement3.style.opacity = "0";
    two_list.style.opacity = "1";
    three_list.style.opacity = "0";
  }
});
