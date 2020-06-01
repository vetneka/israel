import 'element-closest-polyfill';
import '@babel/polyfill';

import svg4everybody from 'svg4everybody';
import IMask from 'imask';
import Modal from './js/Modal';
import { breakpointChecker, featuresSlider, reviewSlider } from './js/Swiper';

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

const accordionClickHandler = function(evt) {
  evt.preventDefault();

  if (!evt.target.closest('.accordion__item') || evt.target.closest('.accordion__item--active')) return;

  const accordion = evt.target.closest('[data-accordion="questions"]');
  const currentItem = evt.target.closest('.accordion__item');
  const previousItem = accordion.querySelector('.accordion__item--active');

  previousItem.classList.remove('accordion__item--active');
  currentItem.classList.add('accordion__item--active');
};

const addToLocalStorage = function(data) {
  for (const key of data.keys()) {
    localStorage.setItem(key, value);
  }
};

const formHandler = function(form) {
  const phoneInput = form.querySelector('input[type="tel"]');
  let phoneInputMask;

  [...form.elements].forEach((element) => {
    if (localStorage.getItem(element.name)) {
      element.value = localStorage.getItem(element.name);
    }
  });

  phoneInput.addEventListener('focus', () => {
    phoneInputMask = IMask(
      phoneInput, {
        mask: '+7 (000) 000 00 00',
        placeholderChar: '_',
        lazy: false,
      });
  });

  form.addEventListener('submit', function(evt) {
    evt.preventDefault();

    console.log(form)
    const formData = new FormData(form);

    addToLocalStorage(formData);
    form.reset();
    phoneInputMask.updateValue();

    const currentShowedModal = document.querySelector('.modal--show');

    if (currentShowedModal) {
      currentShowedModal.classList.remove('modal--show');
    }

    new Modal(evt.target.dataset.target).render();
  });
};

window.addEventListener('load', () => {
  const storage = window.localStorage;
  breakpointChecker();
  svg4everybody();

  const tabContainer = document.querySelector('[data-tabs="programs"]');
  tabContainer.addEventListener('click', tabClickHandler);

  const accordionContainer = document.querySelector('[data-accordion="questions"]');
  accordionContainer.addEventListener('click', accordionClickHandler);

  const callOrder = document.querySelector('[data-toggle="modal"]');
  callOrder.addEventListener('click', (evt) => {
    evt.preventDefault();

    const callModal = new Modal(evt.target.dataset.target).render();
    console.log(callModal)
    const modalForm = document.querySelector('form[name="modal-form"]');

    formHandler(modalForm);
  });

  const forms = [...document.querySelectorAll('main form')];

  forms.forEach((form) => formHandler(form));
});

