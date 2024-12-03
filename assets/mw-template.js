
// var swiper6 = new Swiper(".image_swiper", {
//     effect: "creative",
//     creativeEffect: {
//         prev: {
//           shadow: true,
//           translate: [0, 0, -800],
//           rotate: [180, 0, 0],
//         },
//         next: {
//           shadow: true,
//           translate: [0, 0, -800],
//           rotate: [-180, 0, 0],
//         }
//     }
// });
window.addEventListener('scroll', function () {
    const boxes = document.querySelectorAll('.style__video')
    // 创建观察者，配置回调函数
    // 通过 isIntersecting 属性判断元素与视口是否相交
    const observer = new IntersectionObserver((entries, observer) => {
     entries.forEach((entry) => {
       if (entry.isIntersecting) {
         let videoElement = entry.target;
         videoElement.play()
       }
        // console.log(
        //   entry.target,
        //   entry.isIntersecting ? "visible" : "invisible"
        // );
      });
    })
    
    boxes.forEach((box) => {
      observer.observe(box);
    });
    scrollAnimation();
    showCommon();
    show();
    full();
})
// 首屏滚动特效
function scrollAnimation() {
    var partOne = document.getElementById('part_one');
    var scoller_img = document.getElementsByClassName('scoller_img')[0]
    var raceCommon_partOne = partOne.getBoundingClientRect();
    var raceCommonTop = raceCommon_partOne.top;

    var scoller_context = document.getElementsByClassName('scoller_context')[0]
    var raceCommon_scoller_context = scoller_context.getBoundingClientRect();
    var raceCommonScollerTop = raceCommon_scoller_context.top;

    if (raceCommonTop < 100) {
        scoller_img.classList.add('full');
    }
    if (raceCommonTop > 200) {
        scoller_img.classList.remove('full');
    }
    if (raceCommonScollerTop <= 350) {
        scoller_context.style.opacity = 1;
        scoller_context.style.transform = "translateY(0px)"
    }
    if (raceCommonScollerTop > 350) {
        scoller_context.style.opacity = 1;
        scoller_context.style.transform = "translateY(00px)"
    }
}
function showCommon() {
    var common_title = document.querySelectorAll('.common_title')
    common_title.forEach(item => {
        var raceCommon_title = item.getBoundingClientRect()
        var raceCommonTop = raceCommon_title.top
        // console.log('raceCommonTop', raceCommonTop)
        if (raceCommonTop < 700) {
            item.classList.remove('hide')
        }
        if (raceCommonTop > 900) {
            item.classList.add('hide')
        }
    })
}
function show() {
    var common_title = document.getElementById('common_title')
    var raceCommon_title = common_title.getBoundingClientRect()
    var raceCommonTop = raceCommon_title.top
    // console.log('raceCommonTop', raceCommonTop)
    if (raceCommonTop < 700) {
        common_title.classList.remove('hide')
    }
}
// 视频填充动画
function full() {
    var common_video = document.getElementById('common_video'),
        common_title = document.getElementById('common_title')

    var raceCommon_video = common_video.getBoundingClientRect()
    var raceCommonTop = raceCommon_video.top

    if (raceCommonTop < 100) {
        common_video.classList.add('full');
        common_title.classList.add('hide')
    }
    if (raceCommonTop > 200) {
        common_video.classList.remove('full');
    }
}
$(function() {
    $(".video_replay").on('click', function() {
        $(this).prev().trigger('play')
    })
    $(".bar_button").mousedown(function() {
      $(this)
        .parent()
        .addClass("stop");
      $(this)
        .parent()
        .next()
        .addClass("stop");
      $(this).attr("data-flag", "1");
    });
    $(".bar").mousedown(function() {
      $(this)
        .parent()
        .addClass("stop");
      $(this)
        .parent()
        .next()
        .addClass("stop");
      $(this).attr("data-flag", "1");
    });
  $(".div").mousemove(function(e) {
    const temp = $(this)
      .find(".bar_button")
      .attr("data-flag");
    const temp2 = $(this)
      .find(".bar")
      .attr("data-flag");
    if (temp == "1") {
      const w = $(this).width();
      const x = e.offsetX;
      const p = parseFloat((x / w).toFixed(2)) * 100;
      $(this)
        .children(".img1")
        .css("width", p + "%");
      $(this)
        .children(".img2")
        .css("left", p + "%");
    }
    if (temp2 == "1") {
      const w = $(this).width();
      const x = e.offsetX;
      const p = parseFloat((x / w).toFixed(2)) * 100;
      $(this)
        .children(".img1")
        .css("width", p + "%");
      $(this)
        .children(".img2")
        .css("left", p + "%");
    }
  });
  $(document).mouseup(function() {
    $(".img1,.img2").removeClass("stop");
    $(".bar").attr("data-flag", "0");
    $(".bar_button").attr("data-flag", "0");
  });
})