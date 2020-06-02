import 'element-closest-polyfill';
import '@babel/polyfill';

import svg4everybody from 'svg4everybody';
import IMask from 'imask';
import Modal from './js/Modal';
import { breakpointChecker } from './js/Swiper';

const tabClickHandler = function(evt) {
  evt.preventDefault();

  if (!evt.target.closest('.button') || evt.target.closest('.button--colored')) {
    return;
  };

  const previousTabButton = this.querySelector('.button--colored');
  previousTabButton.classList.remove('button--colored');

  const previousTabContent = this.querySelector(previousTabButton.hash);
  previousTabContent.classList.remove('tabs__content-item--active');

  const currentTabButton = evt.target.closest('.button');
  currentTabButton.classList.add('button--colored');

  const currentTabContent = this.querySelector(currentTabButton.hash);
  currentTabContent.classList.add('tabs__content-item--active');
};

const accordionClickHandler = function(evt) {
  evt.preventDefault();

  if (!evt.target.closest('.accordion__title')) {
    return;
  };

  const currentItem = evt.target.closest('.accordion__item');
  const previousItem = this.querySelector('.accordion__item--active');

  if (currentItem.classList.contains('accordion__item--active')) {
    currentItem.classList.remove('accordion__item--active');
  } else if (previousItem) {
    previousItem.classList.remove('accordion__item--active');
    currentItem.classList.add('accordion__item--active');
  } else {
    currentItem.classList.add('accordion__item--active');
  }
};

const addToLocalStorage = function(data) {
  for (const [key, value] of data.entries()) {
    localStorage.setItem(key, value);
  }
};

const formHandler = function(form, modal = null) {
  const phoneInput = form.querySelector('input[type="tel"]');

  [...form.elements].forEach((element) => {
    if (localStorage.getItem(element.name)) {
      element.value = localStorage.getItem(element.name);
    }
  });

  const patternMask = new IMask(phoneInput, {
    mask: '{+7} (000) 000 00 00',
    lazy: true,
    placeholderChar: '_'
  });

  phoneInput.addEventListener('focus', function() {
    patternMask.updateValue();
    patternMask.updateOptions({ lazy: false });
  });

  phoneInput.addEventListener('blur', function() {
    patternMask.updateOptions({ lazy: true });

    if (!patternMask.masked.rawInputValue) {
      patternMask.value = '';
    }
  });

  form.addEventListener('submit', function(evt) {
    evt.preventDefault();

    addToLocalStorage(new FormData(form));
    form.reset();

    if (modal) {
      modal.close();
    }

    new Modal(form.dataset.target).render();
  });
};

window.addEventListener('load', () => {
  breakpointChecker();
  svg4everybody();

  const tabContainer = document.querySelector('[data-tabs="programs"]');
  tabContainer.addEventListener('click', tabClickHandler);

  const accordionContainer = document.querySelector('[data-accordion="questions"]');
  accordionContainer.addEventListener('click', accordionClickHandler);

  const callOrder = document.querySelector('[data-toggle="modal"]');
  callOrder.addEventListener('click', (evt) => {
    evt.preventDefault();

    const callModal = new Modal(evt.target.dataset.target);
    callModal.render();

    const modalForm = document.querySelector('form[name="modal-form"]');
    modalForm.querySelector('input[name="user-name"]').focus();

    formHandler(modalForm, callModal);
  });

  [...document.querySelectorAll('main form')].forEach((form) => formHandler(form));
});

