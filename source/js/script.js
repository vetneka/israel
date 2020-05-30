const tabClickHandler = (evt) => {
  const { target } = evt;

  if (!target.closest('.button')) return;

  evt.preventDefault();

  if (target.closest('.button--colored')) return;

  const tabs = target.closest('.tabs');
  const current = tabs.querySelector('.button--colored');
  current.classList.remove('button--colored');

  const currentTabContent = document.querySelector(current.hash);
  currentTabContent.classList.remove('tabs__content-item--active');

  target.classList.add('button--colored');

  const nextTabContent = document.querySelector(target.hash);
  nextTabContent.classList.add('tabs__content-item--active');
};

const breakpoint = window.matchMedia('(min-width: 768px)');

let mySwiper;

const enableSwiper = function() {
  mySwiper = new Swiper ('.swiper-container', {
     slidesPerView: 1,
     a11y: true,
     grabCursor: true,
     pagination: {
      el: '.features__pagination',
      type: 'bullets',
      bulletClass: 'features__pagination-item',
      bulletActiveClass: 'features__pagination-item--active',
    },
  });
};

const enableReviewsSlider = function() {
  const reviewSlider = new Swiper ('.reviews__inner', {
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
  });
};

const breakpointChecker = function() {
  if ( breakpoint.matches === true ) {
    if ( mySwiper !== undefined ) mySwiper.destroy( true, true );
     return;
  } else if ( breakpoint.matches === false ) {
    return enableSwiper();
  }
};

const accordionClickHandler = function(evt) {
  evt.preventDefault();

  if (!evt.target.closest('.accordion__item') || evt.target.closest('.accordion__item--active')) return;

  const accordion = evt.target.closest('[data-accordion="questions"]');
  const currentItem = evt.target.closest('.accordion__item');
  const previousItem = accordion.querySelector('.accordion__item--active');

  previousItem.classList.remove('accordion__item--active');
  currentItem.classList.add('accordion__item--active');
};

/* const sliderClickHandler = function (evt) {
  if (!evt.target.closest('.reviews__navigation-button')) return;

  const currentNavButton = evt.target.closest('.reviews__navigation-button');

  const reviewsList = evt.target.closest('.reviews__list');
  const count = reviewsList.querySelector('.reviews__navigation-count');

  const currentActiveSlide = reviewsList.querySelector('.reviews__item--active');
  currentActiveSlide.classList.remove('reviews__item--active');

  if (currentNavButton.classList.contains('reviews__navigation-button--previous')) {
    if (currentActiveSlide.previousElementSibling) {
      currentActiveSlide.previousElementSibling.classList.add();
    }
  } else if (currentNavButton.classList.contains('reviews__navigation-button--next')) {

  }

}; */

window.addEventListener('load', () => {
  enableReviewsSlider();

  breakpoint.addListener(breakpointChecker);
  breakpointChecker();

  const tabContainer = document.querySelector('[data-tabs="programs"]');
  tabContainer.addEventListener('click', tabClickHandler);

  const accordionContainer = document.querySelector('[data-accordion="questions"]');
  accordionContainer.addEventListener('click', accordionClickHandler);

  // const slider = document.querySelector('.reviews__navigation');
  // slider.addEventListener('click', sliderClickHandler);
});
