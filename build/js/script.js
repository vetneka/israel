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

window.addEventListener('load', () => {
  const tabContainer = document.querySelector('[data-tabs="programs"]');
  tabContainer.addEventListener('click', handle);
});
