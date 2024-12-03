// 加购功能
$(".add_cart").on("click", function () {
  let params = [
    {
      id: $(this).attr("data-id"),
      quantity: 1,
    },
    {
      id: $(this).attr("data-giftId"),
      quantity: 1,
    },
  ];
  if (!$(this).attr("data-giftId")) {
    params = [
      {
        id: $(this).attr("data-id"),
        quantity: 1,
      },
    ];
  }
  event.stopPropagation();
  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: params,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      window.location.href = "/cart";
      // window.open("/cart", "_blank")
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
// 产品替换
$(".prodcut_variant_select").on("change", function () {
  const partenElement = $(this).parent().parent();
  const index_option = $(this).find("option:selected").index();
  const number_option = $(this).find("option").length - 1;
  console.log('index_option', index_option)
  console.log('number_option', number_option)
  let data_url = $(this).find("option:selected").attr("data-url");
  // let data_image_url = $(this).find('option:selected').attr('data-image');
  let data_price = $(this).find("option:selected").attr("data-price");
  let data_compareAtPrice = $(this)
    .find("option:selected")
    .attr("data-compareAtPrice");
  let data_vid = $(this).find("option:selected").attr("data-vid");
  let data_oprice = $(this).find("option:selected").attr("data-oprice");
  let data_ocompareAtPrice = $(this)
    .find("option:selected")
    .attr("data-ocompareAtPrice");
  let data_size = getNumbersFromString($(this).find("option:selected").html());
  let data_gift = $(this).find("option:selected").attr("data-giftId")
    ? $(this).find("option:selected").attr("data-giftId")
    : "";
  partenElement.find(".product_image").attr("href", data_url);
  partenElement
    .find(".product_price")
    .html(data_price + "<span> / </span>" + data_compareAtPrice);
  partenElement.find(".product_name").attr("href", data_url);
  partenElement.find(".learn_more").attr("href", data_url);
  partenElement.find(".checkout").attr("data-id", data_vid);
  partenElement.find(".checkout").attr("data-id", data_vid);
  partenElement.find(".f_nameAndprice").hide();
  // partenElement.find('[data-screensize="' + data_size[0] + '"]').show();
  partenElement.find('[data-screensize]').eq(number_option - index_option).show();
  partenElement.find('[data-stationsize]').eq(number_option - index_option).show();
  const difference = data_ocompareAtPrice - data_oprice;
  partenElement.find(".save_desc").text("Save $" + difference / 100);
  if (data_gift == "") {
    partenElement
      .find(".checkout")
      .attr("href", "https://awolvision.com/cart/" + data_vid + ":1");
  } else {
    partenElement
      .find(".checkout")
      .attr(
        "href",
        "https://awolvision.com/cart/" + data_vid + ":1,41594732445744:1"
      );
  }
  partenElement.find(".add_cart").attr("data-id", data_vid);
});
// 产品切换
$(".nav_item").click(function () {
  $(this).parent().find(".nav_item").removeClass("active");
  $(this).addClass("active");
  let value = $(this).html();
  $(this)
    .parent()
    .next()
    .find("[data-tag]")
    .each(function () {
      if ($(this).attr("data-tag") === value) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
});
// 返回顶部
$(".black_to_top").on("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 导航栏锚点定位
$(".event_nav_item").click(function () {
  const buttonContent = $(this).attr("data-name");
  const targetElement = $('[data-id="' + buttonContent + '"]');
  const elementPosition =
    targetElement.get(0).getBoundingClientRect().top + window.pageYOffset;

  // 设置目标滚动位置，并加上你想要的偏移量（例如 100px）
  let offset = window.innerWidth <= 1024 ? 130 : 20;

  window.scrollTo({
    top: elementPosition - offset,
    behavior: "smooth",
  });
});

$(window).scroll(function () {
  const scrollTop = $(window).scrollTop();
  const elements = $("[data-id]");

  console.log("elements", elements);

  elements.each(function () {
    const element = $(this);
    const tagValue = element.data("id");

    const targetElement = $('[data-name="' + tagValue + '"]');
    if (
      scrollTop > element.offset().top - $(window).height() / 2 &&
      scrollTop < element.offset().top + element.outerHeight() / 2
    ) {
      targetElement.addClass("nav_active");
    } else {
      targetElement.removeClass("nav_active");
    }
  });
});

// 展示更多
$(".rules_context_desc").not(":first").hide();
$(".view_more").on("click", function () {
  $(".rules_context_desc").not(":first").toggle(300);
  $(".more_tags").toggle();
  $(this).find("svg").hasClass("turn")
    ? $(this).find("svg").removeClass("turn")
    : $(this).find("svg").addClass("turn");
  $(this).find("span").text() == "Hide Details"
    ? $(this).find("span").text("View Details")
    : $(this).find("span").text("Hide Details");
});

// 中奖名单文案滚动动画
$(document).ready(function () {
  var items = $(".award_message");
  var currentIndex = 0;
  if (items.length > 1) {
    setInterval(function () {
      items.eq(currentIndex).fadeOut(500);
      currentIndex = (currentIndex + 1) % items.length;
      items.eq(currentIndex).fadeIn(500);
    }, 5000);
  }
});
$(function () {
  $(".f_nameAndprice").hide();
  $(".f_active").show();
});
// swiper加载
var mySwiper = new Swiper(".event_page_swiper_container", {
  autoplay: true, //可选选项，自动滑动
  loop: true,
  slidesPerView: window.innerWidth > 1024 ? 2 : 1,
  spaceBetween: 20,
  pagination: {
    el: ".event_swiper_contral .swiper-pagination",
  },
  navigation: {
    nextEl: ".event_swiper_contral .swiper-button-next",
    prevEl: ".event_swiper_contral .swiper-button-prev",
  },
});

function getNumbersFromString(str) {
  return str.match(/\d+/g);
}
