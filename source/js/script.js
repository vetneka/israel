const handle = (evt) => {
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

const breakpointChecker = function() {
  if ( breakpoint.matches === true ) {
    if ( mySwiper !== undefined ) mySwiper.destroy( true, true );
     return;
  } else if ( breakpoint.matches === false ) {
    return enableSwiper();
  }
};

window.addEventListener('load', () => {
  breakpoint.addListener(breakpointChecker);
  breakpointChecker();

  const tabContainer = document.querySelector('[data-tabs="programs"]');
  tabContainer.addEventListener('click', handle);
});
