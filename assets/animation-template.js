// var scrollAnimation = {};
// window.onload = function () {

//         scrollAnimation = new ScrollAnimation('#canvas');
//         // scrollAnimation.loading();
//         scrollAnimation.drawImage();
//         let p = 0, t = 0;
//         var scrollFn = function (event) {
//             let top = this.pageYOffset
//             console.log(top)
//             //耳机动画
//             let er = document.querySelector(".product_animate"),
//                 eTop = er.offsetTop,
//                 lineTop = 0,      //上限
//                 lineBottom = 1680 * 1.8;  //下限
//             if (top <= lineTop) {
//                 console.log(1)
//                 scrollAnimation.index = 128;
//                 // scrollAnimation.drawImage();
//             } else if (top < lineBottom) {
//                 console.log(2)
//                 const index = Math.floor((top - lineTop) / (1680 * 1.8) * 128);
//                 let target = 128 - index;
//                 if (target != scrollAnimation.index) {
//                     scrollAnimation.index = target;
//                     scrollAnimation.drawImage();
//                 }
//             } else {
//                 console.log(3)
//                 scrollAnimation.index = 0;
//                 scrollAnimation.drawImage();
//             }
//             setTimeout(function () {
//                 t = top;
//             }, 0);
//         }
//         // scrollFn();
//         window.addEventListener("scroll", function() {
//             var product_animate = document.getElementById('product_animate')
//             var raceProduct_animate = product_animate.getBoundingClientRect()
//             var raceProduct_animateTop = raceProduct_animate.top
//             if (raceProduct_animateTop <= 0) {
//                 scrollFn()
//             }
//         });
// }
// let ScrollAnimation = function (id) {
//     // console.log(id)
//     this.canvas = document.querySelector(id);
//     this.ctx = this.canvas.getContext('2d');
//     this.index = 128;
//     let img = new Image();
//     this.loading();
//     this.drawImage();
// }
// ScrollAnimation.prototype = {
//     images: [],
//     loading: function () {
//         for (let i = 0; i <= 128; i++) {
//             let img = new Image();
//             img.src = `/cdn/shop/t/40/assets/1_0009_0${this.toUper(i)}.png?`;
//             this.images.push(img);
//         }
//     },
//     drawImage: function () {
//         this.index = this.index < 0 ? 0 : this.index > 128 ? 128 : this.index;
//         // let y = (this.index / 128) * 160;
//         // this.canvas.style.setProperty('--canvas-y', (y - 160) + 'px');
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         // console.log(this.images)
//         this.ctx.drawImage(this.images[128 - this.index], 0, 0);
//     },
//     toUper: function (i) {
//         // console.log(3)
//         if (i <= 0) return '000';
//         if (i < 10) return '00' + i;
//         if (i < 100) return '0' + i;
//         if (i > 128) return '128';
//         return i;
//     }
// }
window.addEventListener("scroll", function () {
    animation_fonts_show()
    full()
    show()
})
function animation_fonts_show() {
    var animation_fonts_show = document.getElementById('animation_fonts_show')
    var raceAnimation_fonts_show = animation_fonts_show.getBoundingClientRect()
    var raceAnimation_fonts_showTop = raceAnimation_fonts_show.top
    if (raceAnimation_fonts_showTop > 600) {
        $(".img_title_container").removeClass('show')
        $(".image_container").css('opacity', '0')
    }
    if (raceAnimation_fonts_showTop < 200) {
        $(".img_title_container").addClass('show')
        setTimeout(() => { $(".image_container").css('opacity', '1') }, 300)
    }
}
// 文字动画
function show() {
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
// 视频填充动画
function full() {
    var common_video = document.querySelectorAll('.common_video_animate')

    common_video.forEach(item => {
        var raceCommon_video = item.getBoundingClientRect()
        var raceCommonTop = raceCommon_video.top
        if (raceCommonTop < 100) {
            item.classList.add('full');
            // console.log('item.children', item.children)
            item.children[0].play();
        }
        if (raceCommonTop > 200) {
            item.classList.remove('full');
        }
    })


}