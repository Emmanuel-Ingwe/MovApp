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

        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input', debounce(onInput, 500));