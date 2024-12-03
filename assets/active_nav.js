function scrollAnimation() {
  var partOne = document.getElementById("LTV-3500");
  var partTwo = document.getElementById("LTV-3000");
  var partThree = document.getElementById("Different");
  var partFour = document.getElementById("Special");

  var raceCommon_partOne = partOne.getBoundingClientRect();
  var raceCommonTop1 = raceCommon_partOne.top;
  var raceCommon_partTwo = partTwo.getBoundingClientRect();
  var raceCommonTop2 = raceCommon_partTwo.top;
  var raceCommon_partThree = partThree.getBoundingClientRect();
  var raceCommonTop3 = raceCommon_partThree.top;
  var raceCommon_partFour = partFour.getBoundingClientRect();
  var raceCommonTop4 = raceCommon_partFour.top;

  if (raceCommonTop1 <= 350) {
    $(".active_nav_itmes a").removeClass("active");
    $("#a-3500").addClass("active");
  }
  if (raceCommonTop2 <= 350) {
    $(".active_nav_itmes a").removeClass("active");
    $("#a-3000").addClass("active");
  }
  if (raceCommonTop3 <= 350) {
    $(".active_nav_itmes a").removeClass("active");
    $("#a-Different").addClass("active");
  }
  if (raceCommonTop4 <= 350) {
    $(".active_nav_itmes a").removeClass("active");
    $("#a-Special").addClass("active");
  }
}
window.addEventListener("scroll", function () {
  scrollAnimation();
});
$(document).ready(function () {
  let width = window.innerWidth;
  let onTop = width < 768 ? -150 : 40;
  let onTop1 = 40;
  let onTop2 = 40;
  let onTop3 = 40;
  let onTop4 = 40;
  if (width < 768) {
    onTop1 = -250;
    onTop2 = 150;
    onTop3 = -50;
    onTop4 = -260;
  }
  $(".active_nav_itmes a").on("click", function () {
    var e = $("#Different").offset().top,
      n = $("#LTV-3500").offset().top,
      q = $("#LTV-3000").offset().top,
      s = $("#Special").offset().top;
    $(".active_nav_itmes a").removeClass("active");
    $(this).addClass("active");
    if ($(this).attr("id") === "a-Different") {
      $("html, body").animate(
        {
          scrollTop: e - 100,
        },
        600
      );
    }
    if ($(this).attr("id") === "a-3500") {
      $("html, body").animate(
        {
          scrollTop: n - 100,
        },
        600
      );
    }
    if ($(this).attr("id") === "a-3000") {
      $("html, body").animate(
        {
          scrollTop: q - 100,
        },
        600
      );
    }
    if ($(this).attr("id") === "a-Special") {
      $("html, body").animate(
        {
          // scrollTop: s - 100,
          scrollTop: s - 100,
        },
        600
      );
    }
  });
});
