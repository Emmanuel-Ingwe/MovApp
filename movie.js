const autoCompleteConfig = {
    renderOPtion(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
             ${movie.Title} (${movie.year})
        `;
    },

    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
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
    }
};

createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'left');
    }
});
createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});


let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'd9835cc5',
            i: movie.imdbId
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const righSideStats = document.querySelectorAll('#rightsummary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = righSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};


const movieTemplate = movieDetail => {
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    );
    const metascore = parseInt(movieDetail.metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    let count = 0;
    const awards = movieDetail.Awards.split('').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    console.log(awards);

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

    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</P>
        <p class="subtle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</P>
        <p class="subtle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</P>
        <p class="subtle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</P>
        <p class="subtle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</P>
        <p class="subtle">IMDB Votes</p>
    </article>
    `;
};

