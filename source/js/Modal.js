import createFocusTrap from 'focus-trap';
import { templateContent } from './utils';

const existVerticalScroll = function() {
  return document.body.offsetHeight > window.innerHeight;
};

const getBodyScrollTop = function() {
  return (
    self.pageYOffset ||
    (document.documentElement && document.documentElement.ScrollTop) ||
    (document.body && document.body.scrollTop)
  );
};

export default class Modal {
  constructor(content) {
    const modalTemplate = document.querySelector(`#template-modal`);
    const modal = templateContent(modalTemplate);

    const modalContentTemplate = document.querySelector(`#content-${content}`);
    const modalContent = templateContent(modalContentTemplate).querySelector('.modal__content');

    modal.querySelector('.modal__body').insertAdjacentElement('afterbegin', modalContent);

    this.modal = modal.querySelector('.modal');
    this.buttonClose = this.modal.querySelector('.modal__close');

    this.onKeydownModalBind = this.onKeydownModal.bind(this);
    this.onClickModalBind = this.onClickModal.bind(this);

    this.focusTrap = createFocusTrap(this.modal, {
      onDeactivate: () => {
        this.modal.className = 'trap';
      },
      fallbackFocus: this.modal,
    });
  }

  close() {
    window.removeEventListener('keydown', this.onKeydownModalBind);
    this.focusTrap.deactivate();
    document.querySelector('main').removeChild(this.modal);

    if (existVerticalScroll()) {
      document.body.classList.remove("page--lock");
      window.scrollTo(0, +document.body.dataset.scrollY);
    }
  }

  onKeydownModal(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.close();
    }
  }

  onClickModal(evt) {
    if (
      evt.target.classList.contains('modal__overlay')
      || evt.target.classList.contains('modal__close')
      || evt.target.classList.contains('modal__button')
    ) {
      evt.preventDefault();
      this.close();
    }
  }

  addEvents() {
    this.modal.addEventListener('click', this.onClickModalBind);
    window.addEventListener('keydown', this.onKeydownModalBind);
  }

  render() {
    document.body.dataset.scrollY = `${getBodyScrollTop()}`;
    this.focusTrap.activate();

    this.modal.classList.add('modal--show');
    this.addEvents();
    document.querySelector('main').appendChild(this.modal);

    if (existVerticalScroll()) {
      document.body.classList.add("page--lock");
      document.body.style.top = `-${document.body.dataset.scrollY}px`;
    }
  }
};
