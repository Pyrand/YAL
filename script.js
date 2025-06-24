const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        showPage(page);
    });
});

function showPage(pageId) {
    pages.forEach(p => {
        if (p.id === pageId) {
            p.hidden = false;
        } else {
            p.hidden = true;
        }
    });
}

// User auth and list using localStorage
const authDiv = document.getElementById('auth');
const userListDiv = document.getElementById('userList');
let username = localStorage.getItem('username');
let myList = JSON.parse(localStorage.getItem('myList') || '[]');

function renderAuth() {
    if (username) {
        authDiv.textContent = `Logged in as ${username}`;
        renderList();
    } else {
        authDiv.innerHTML = `
            <input type="text" id="username" placeholder="Enter username">
            <button id="registerBtn">Register</button>
        `;
        document.getElementById('registerBtn').onclick = () => {
            const u = document.getElementById('username').value;
            if (u) {
                username = u;
                localStorage.setItem('username', username);
                renderAuth();
            }
        };
    }
}

function renderList() {
    userListDiv.innerHTML = '<h3>Your List</h3>';
    const ul = document.createElement('ul');
    myList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title;
        ul.appendChild(li);
    });
    userListDiv.appendChild(ul);
}

renderAuth();

// Search functionality
const searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = () => {
    const query = document.getElementById('searchQuery').value;
    if (!query) return;
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`)
        .then(resp => resp.json())
        .then(data => {
            const results = data.data || [];
            const container = document.getElementById('searchResults');
            container.innerHTML = '';
            results.forEach(anime => {
                const div = document.createElement('div');
                div.textContent = anime.title;
                const btn = document.createElement('button');
                btn.textContent = 'Add to list';
                btn.onclick = () => addToList(anime);
                div.appendChild(btn);
                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
        });
};

function addToList(anime) {
    if (!username) {
        alert('Please register first');
        return;
    }
    if (!myList.some(a => a.mal_id === anime.mal_id)) {
        myList.push({ mal_id: anime.mal_id, title: anime.title });
        localStorage.setItem('myList', JSON.stringify(myList));
        renderList();
    }
}

// Season functionality
const seasonBtn = document.getElementById('seasonBtn');
seasonBtn.onclick = () => {
    const season = document.getElementById('seasonSelect').value;
    const year = document.getElementById('seasonYear').value;
    fetch(`https://api.jikan.moe/v4/seasons/${year}/${season}`)
        .then(resp => resp.json())
        .then(data => {
            const results = data.data || [];
            const container = document.getElementById('seasonResults');
            container.innerHTML = '';
            results.forEach(anime => {
                const div = document.createElement('div');
                div.textContent = anime.title;
                container.appendChild(div);
            });
        })
        .catch(err => console.error(err));
};

// Random anime functionality
const randomBtn = document.getElementById('randomBtn');
randomBtn.onclick = () => {
    fetch('https://api.jikan.moe/v4/random/anime')
        .then(resp => resp.json())
        .then(data => {
            const anime = data.data;
            const container = document.getElementById('randomResult');
            container.innerHTML = anime ? anime.title : 'No result';
        })
        .catch(err => console.error(err));
};
