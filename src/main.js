import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

let query = '';
let page = 1;
const perPage = 15;

const formEl = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more');

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  query = event.currentTarget.elements['searchQuery'].value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search term!' });
    return;
  }

  page = 1;
  document.getElementById('gallery').innerHTML = '';
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);

    if (!data || !data.hits) {
      iziToast.error({ message: 'Invalid API response' });
      return;
    }

    if (data.hits.length === 0) {
      iziToast.warning({ message: 'No images found. Try another search!' });
      return;
    }

    renderGallery(data.hits);

    if (data.totalHits > perPage) showLoadMoreBtn();
  } catch (error) {
    iziToast.error({ message: 'Something went wrong while fetching data.' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    renderGallery(data.hits, true);

    const totalPages = Math.ceil(data.totalHits / perPage);
    if (page < totalPages) showLoadMoreBtn();
    else
      iziToast.info({ message: 'You have reached the end of search results.' });

    smoothScroll();
  } catch (error) {
    iziToast.error({ message: 'Failed to load more images.' });
  } finally {
    hideLoader();
  }
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hidden');
}
function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hidden');
}

function smoothScroll() {
  const gallery = document.querySelector('.gallery');
  if (!gallery.firstElementChild) return;
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}
