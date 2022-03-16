const content = document.getElementById('content');
const pagesUrl = './pages';

const loadPage = (page) => {
  fetch(pagesUrl + page + '.html')
    .then((res) => {
      return res.text();
    })
    .then(res => {
      const main = document.getElementsByName('fade');
      console.log(main);
      main.forEach(ele => {
        ele.classList.add('fade-out');
      })
      setTimeout(() => {
        content.innerHTML = res;
        window.scrollTo(0, 0);
        if (page == "/home") {
          loadWorks(true);
          window.scrollTo(0, 0);
        } else {
          loadWorks(false);
          window.scrollTo(0, 0);
        }
      }, 1500)
      window.scrollTo(0, 0);
    })
    .catch((err) => {
      console.log('Failed to fetch resource: ', err)
    })
}

const loadWorks = (isHome) => {
  const card = (isHome) ? './pages/card.html' : './pages/works_card.html';
  let tags = '';
  fetch('./pages/tags.html')
    .then(res => res.text())
    .then(res => {
      tags = res;
      return fetch(card);
    })
    .then(res => res.text())
    .then(res => addCard(isHome, res, tags))
}

const move = (e) => {
  e.classList.add('no-animation');
  const pos = document.getElementById('works');
  const ele = document.getElementById('moving_w');
  ele.style.top = pos.getBoundingClientRect().y;
  ele.style.left = pos.getBoundingClientRect().x;
  console.log('x: ' + pos.getBoundingClientRect().x + ', y: ' + pos.getBoundingClientRect().y);
  ele.classList.add('nav-link-clicked');
}

function addCard(isHome, text, tags_text) {
  const container = document.getElementById('works');
  let html = "";
  const works_array = (isHome) ? works.slice(0, 3) : works;
  works_array.forEach((item, index) => {
    html += addData(item, index + 1);
  })
  container.innerHTML = html;

  function addData(item, index) {
    return text.replace('__title__', item.title)
      .replaceAll('__image__', item.image)
      .replace('__url__', item.url)
      .replace('__content__', item.content)
      .replace('__href__', item.href)
      .replace('__tags__', addTags(item.tags))
      .replace('__number__', index.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
      .replace('__index__', index - 1);
  }

  function addTags(tags) {
    let html = '';
    tags.forEach(tag => {
      html += tags_text.replace('__tag__', tag)
    })
    return html;
  }
}

const imgModal = document.getElementById('img-modal')
imgModal.addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget,
  recipient = button.getAttribute('data-bs-src'),
  index = button.getAttribute('data-bs-index'),
  modalImg = imgModal.querySelector('.img-fluid'),
  modalTitle = imgModal.querySelector('#title'),
  modalContent = imgModal.querySelector('#description'),
  modalUrl = imgModal.querySelector('#url'),
  modalHref = imgModal.querySelector('#href');

  modalTitle.innerHTML = works[index].title;
  modalContent.innerHTML = works[index].content;
  modalHref.href = works[index].href;
  modalUrl.href = works[index].url;
  modalImg.src = recipient;
})

document.addEventListener('DOMContentLoaded', () => {
  let page = (window.location.hash.substring(1)) ? window.location.hash.substring(1) : window.location.pathname;
  console.log(page)
  if (page == "" || page == "/" || page == "work" || page == "contact") page = "/home";
  loadPage(page);
})

window.addEventListener('hashchange', () => {
  let page = (window.location.hash.substring(1)) ? window.location.hash.substring(1) : window.location.pathname;
  console.log(page)
  if (page == "" || page == "/") page = "/home";
  if (page !== "work" && page !== "contact") loadPage(page);
}, false);
