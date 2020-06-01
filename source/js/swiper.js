import Swiper from 'swiper';

const sliderConfig = {
  featuresSlider: {
    slidesPerView: 1,
    a11y: true,
    grabCursor: true,
    pagination: {
      el: '.features__pagination',
      type: 'bullets',
      bulletClass: 'features__pagination-item',
      bulletActiveClass: 'features__pagination-item--active',
    },
  },

  reviewsSlider: {
    slidesPerView: 1,
    a11y: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.reviews__pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.reviews__button--next',
      prevEl: '.reviews__button--previous',
    },
  },
};

let featuresSlider = new Swiper ('.swiper-container', sliderConfig.featuresSlider);
const reviewsSlider = new Swiper ('.reviews__inner', sliderConfig.reviewsSlider);

const breakpoint = window.matchMedia('(min-width: 768px)');

const breakpointChecker = function() {
  if ( breakpoint.matches === true ) {
    if ( featuresSlider !== undefined ) featuresSlider.destroy( true, true );
     return;
  } else if ( breakpoint.matches === false ) {
    featuresSlider = new Swiper ('.swiper-container', sliderConfig.featuresSlider);
  }
};

breakpoint.addListener(breakpointChecker);

export {
  featuresSlider,
  reviewsSlider,
  breakpointChecker,
}
