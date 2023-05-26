let searchTerm = '';
let currentPage = 1;

function fetchingAPI() {
  const url = `https://openlibrary.org/search.json?q=${searchTerm}&page=${currentPage}&limit=10`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { docs } = data;
      const bookInfos = docs.map((item) => {
        const { title, author_name, subject, publisher, cover_i } = item;

        // Extract the thumbnail image URL or use a placeholder if not available
        const thumbnail = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : './img/book-placeholder.png';

        return {
          title,
          authors: author_name,
          subjects: truncateText(subject, 50),
          publisher: truncateText(publisher, 50),
          thumbnail,
        };
      });

      const searchResultsDiv = document.getElementById('search-results');
      const placeholderImg = './img/book-placeholder.png';

      bookInfos.forEach((info) => {
        const resultHTML = `
          <div class="col-lg-4 col-md-6 my-3">
            <div class="card">
              <img src="${info.thumbnail}" class="card-img-top" alt="${info.title}">
              <div class="card-body">
                <h5 class="card-title">${info.title}</h5>
                <p class="card-text">Author: ${info.authors}</p>
                <p class="card-text">Subjects: ${info.subjects}</p>
                <p class="card-text">Publisher: ${info.publisher}</p>
              </div>
            </div>
          </div>
        `;
        searchResultsDiv.innerHTML += resultHTML;
      });

      currentPage++;
    })
    .catch(error => {
      console.log('Error fetching API:', error);
    });
}

function truncateText(text, maxLength) {
  if (typeof text === 'string' && text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  } else if (typeof text !== 'string') {
    return '';
  }
  return text;
}

function loadMoreBooks() {
  fetchingAPI();
}

document.addEventListener('DOMContentLoaded', () => {
  const loadMoreButton = document.getElementById('load-more');

  loadMoreButton.addEventListener('click', loadMoreBooks);

  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("search-input");
    searchTerm = searchInput.value;
    currentPage = 1;
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';
    fetchingAPI();
  });

  fetchingAPI();
});
