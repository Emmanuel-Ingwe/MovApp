const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'd9835cc5',
            s: searchTerm
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
      <div class="dropdown-menu">
         <div class="dropdown-content results"></div>
      </div>
    </div>
`;


const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = async event => {
    const movies = await fetchData(event.target.value);

    if (!movies.lenght) {
        dropdown.classList.remove('is-active');
        return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : item.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
        <img src="${imgSrc}"/>
        ${movie.Title}
        `;
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
        });

        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'd9835cc5',
            i: movie.imdbId
        }
    });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = movieDetail => {
    return `
    <article class="media">
        <figure class="media-left">
          <p class="image">
             <img src="${movieDetail.Poster}"/>
          </p>
        </figure>
        <div class="media-content">
           <div class="content">
              <h1>${movieDetail.Title}</h1>
              <h4>${movieDetail.Genre}</h4>
              <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</P>
        <p class="subtle">Awards</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</P>
        <p class="subtle">B0x Office</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</P>
        <p class="subtle">Metascore</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</P>
        <p class="subtle">Awards</p>
    </article>
    `;
};

