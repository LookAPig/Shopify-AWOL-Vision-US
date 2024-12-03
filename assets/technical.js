
const window_width = window.innerWidth;
const swiperContainer1 = document.getElementById('technical_salepoints');
const swiperContainer2 = document.getElementById('technical_users_images');
const swiperContainer3 = document.getElementById('technical_medium_swiper');
// const swiperContainer4 = document.getElementById('yotube_swiper');
var swiper1 = new Swiper(".technical_salepoints", {
  slidesPerView: window_width < 1024 ? 1 : 2,
  spaceBetween: 20,
  autoplay: {
    delay: 1500
  },
//   centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

var swiper2 = new Swiper(".technical_users_images", {
  slidesPerView: 1 ,
  autoplay: {
    delay: 1500
  },
  spaceBetween: 50,
//   centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

var swiper3 = new Swiper(".technical_medium_swiper", {
  slidesPerView: 1 ,
  spaceBetween: 20,
  autoplay: {
    delay: 1500
  },
//   centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

var swiper4 = new Swiper(".yotube_swiper", {
  slidesPerView: 1 ,
  spaceBetween: 30,
//   centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

var swiper5 = new Swiper(".product_bundleds", {
  slidesPerView: window_width < 1024 ? 1 : 3,
  spaceBetween: 26,
//   centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

const tab_items = document.querySelectorAll('.tab_item');
const product_detail_items = document.querySelectorAll('.product_detail_items');
tab_items.forEach(item => {
  item.addEventListener('click', () => {
    for (const element of tab_items) {
      element.classList.remove('active');
    }
    for (const element2 of product_detail_items) {
      element2.classList.remove('active');
      element2.classList.remove('op');
    }
    item.classList.toggle('active');
    const id = item.getAttribute('data-index');
    let element = document.getElementById(id)
    element.classList.toggle('active');
    setTimeout(function(){
      element.classList.toggle('op');
    }, 100)
  });
});
window.addEventListener('scroll', () => {
  // 获取轮播容器在页面中的位置
  const containerTop1 = swiperContainer1.getBoundingClientRect().top;
  const containerTop2 = swiperContainer2.getBoundingClientRect().top;
  const containerTop3 = swiperContainer3.getBoundingClientRect().top;
  // const containerTop4 = swiperContainer4.getBoundingClientRect().top;

  // 判断是否滚动到轮播容器位置
  if (containerTop1 < window.innerHeight &&!swiper1.autoplay.running) {
    // 启动自动轮播
    swiper1.autoplay.start();
  } else if (containerTop1 > window.innerHeight || swiper1.autoplay.running) {
    // 停止自动轮播
    swiper1.autoplay.stop();
  }
  // 判断是否滚动到轮播容器位置
  if (containerTop2 < window.innerHeight &&!swiper2.autoplay.running) {
    // 启动自动轮播
    swiper2.autoplay.start();
  } else if (containerTop2 > window.innerHeight || swiper2.autoplay.running) {
    // 停止自动轮播
    swiper2.autoplay.stop();
  }
  if (containerTop3 < window.innerHeight &&!swiper3.autoplay.running) {
    // 启动自动轮播
    swiper3.autoplay.start();
  } else if (containerTop3 > window.innerHeight || swiper3.autoplay.running) {
    // 停止自动轮播
    swiper3.autoplay.stop();
  }
  // if (containerTop4 < window.innerHeight &&!swiper4.autoplay.running) {
  //   // 启动自动轮播
  //   swiper4.autoplay.start();
  // } else if (containerTop4 > window.innerHeight || swiper4.autoplay.running) {
  //   // 停止自动轮播
  //   swiper4.autoplay.stop();
  // }
});
window.onload = function() {
// 获取所有具有相同类名的元素
const elements1 = document.getElementsByClassName('first_line');
const elements2 = document.getElementsByClassName('second_line');
const elements3 = document.getElementsByClassName('third_line');
const elements4 = document.getElementsByClassName('forth_line');
const elements5 = document.getElementsByClassName('fifth_line');
const elements6 = document.getElementsByClassName('sixth_line');
const elements7 = document.getElementsByClassName('seventh_line');
const elements8 = document.getElementsByClassName('eighth_line');
const elements9 = document.getElementsByClassName('nine_line');
const elements10 = document.getElementsByClassName('ten_line');
const elements11 = document.getElementsByClassName('eleven_line');
console.log('elements1', elements1)
// 存储最高高度
let maxHeight1 = 0;
let maxHeight2 = 0;
let maxHeight3 = 0;
let maxHeight4 = 0;
let maxHeight5 = 0;
let maxHeight6 = 0;
let maxHeight7 = 0;
let maxHeight8 = 0;
let maxHeight9 = 0;
let maxHeight10 = 0;
let maxHeight11 = 0;

// 遍历元素，找到最高高度
for (const element of elements1) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight1) {
    maxHeight1 = height;
  }
}
for (const element of elements2) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight2) {
    maxHeight2 = height;
  }
}
for (const element of elements3) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight3) {
    maxHeight3 = height;
  }
}
for (const element of elements4) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight4) {
    maxHeight4 = height;
  }
}
for (const element of elements5) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight5) {
    maxHeight5 = height;
  }
}
for (const element of elements6) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight6) {
    maxHeight6 = height;
  }
}
for (const element of elements7) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight7) {
    maxHeight7 = height;
  }
}
for (const element of elements8) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight8) {
    maxHeight8 = height;
  }
}
for (const element of elements9) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight9) {
    maxHeight9 = height;
  }
}
for (const element of elements10) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight10) {
    maxHeight10 = height;
  }
}
for (const element of elements11) {
  const height = element.children[0].offsetHeight;
  if (height > maxHeight11) {
    maxHeight11 = height;
  }
}
console.log('maxHeight10', maxHeight10)
console.log('maxHeight11', maxHeight11)
// 将最高高度设置给所有元素
for (const element of elements1) {
  element.style.height = maxHeight1 + 'px';
}
for (const element of elements2) {
  element.style.height = maxHeight2 + 'px';
}
for (const element of elements3) {
  element.style.height = maxHeight3 + 'px';
}
for (const element of elements4) {
  element.style.height = maxHeight4 + 'px';
}
for (const element of elements5) {
  element.style.height = maxHeight5 + 'px';
}
for (const element of elements6) {
  element.style.height = maxHeight6 + 'px';
}
for (const element of elements7) {
  element.style.height = maxHeight7 + 'px';
}
for (const element of elements8) {
  element.style.height = maxHeight8 + 'px';
}
for (const element of elements9) {
  element.style.height = maxHeight9 + 'px';
}
for (const element of elements10) {
  element.style.height = maxHeight10 + 'px';
}
for (const element of elements11) {
  element.style.height = maxHeight11 + 'px';
}

}