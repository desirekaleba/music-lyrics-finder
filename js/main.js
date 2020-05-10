const form = document.querySelector('#lyrics-finder-form');
const searched = document.querySelector('#searched');
const found = document.querySelector('#found');
const seeMore = document.querySelector('#see-more');
const loader = document.querySelector('#loader');

const apiURL = 'https://api.lyrics.ovh';

async function search(item) {
    loader.style.display = 'block';
    const result = await fetch(`${apiURL}/suggest/${item}`)
    .then(data => {
        loader.style.display = 'none';
        return data.json();
    }).then(response_data => {
        console.log(response_data);
        displayData(response_data);
    });
    // const data = await result.json();

    // displayData(data);
}

function displayData(data) {
    found.innerHTML = `
        <h3>${data.total} <span class="fw-300">results found</span></h3>
        <ul class="songs">
            ${data.data.map(
                song => `<li class="song">
                            <span><strong>${song.artist.name}</strong>: ${song.title}</span>
                            <button class="btn btn-sec" data-artist="${song.artist.name}" data-songtitle="${song.title}">Find Lyrics</button>
                    </li>`
            )
            .join('')
            }
        </ul>
    `;

    if (data.prev || data.next) {
        seeMore.innerHTML = `
            ${data.prev ? 
                `<button class="btn btn-tri btn-prev" onclick="moreSongs('${data.prev}')">&lt; Prev</button>` : ''
            }
            ${data.next ?
                `<button class="btn btn-tri btn-next" onclick="moreSongs('${data.next}')">Next &gt;</button>` : ''
            }
        `;
        
    } else {
        seeMore.innerHTML = '';
    }
    // console.log(data);
}

async function moreSongs(url) {
    loader.style.display = 'block';
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response => {
            loader.style.display = 'none';
            return response.json();
        }).then(data => {
            displayData(data);
        });
    
}

async function getLyrics(artist, songTitle) {
    loader.style.display = 'block';
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    .then(response => {
        loader.style.display = 'none';
        return response.json();
    }).then(data => {
        if (data.error) {
            found.innerHTML = data.error;
        } else {
            const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

            found.innerHTML = `
                <h2><strong>${artist}<strong>: ${songTitle}<h2>
                <div class="lyrics">${lyrics}</div>
            `;
        }
        seeMore.innerHTML = '';
    });
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const searchedItem = searched.value.trim();

    if (!searchedItem) {
        alert('Please type in your song or artist name');
    } else {
        search(searchedItem);
    }
});

found.addEventListener('click', e => {
    const target = e.target;

    if (target.tagName === 'BUTTON') {
        const artist = target.getAttribute('data-artist');
        const songTitle = target.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    }
});