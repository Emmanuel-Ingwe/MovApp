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

createAutocomplete({
    root: document.querySelector('.autocomplete'),
    renderOPtion(movie) {
        const imSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
             ${movie.Title}
        `;
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
        <p class="title">${movieDetail.imdbRating}</P>
        <p class="subtle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</P>
        <p class="subtle">IMDB Votes</p>
    </article>
    `;
};

