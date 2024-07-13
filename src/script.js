// Fonction pour filtrer les bookmarks par tag
function filterByTag(tag, event) {
    if (event) {
        event.stopPropagation(); // Empêche l'événement de propagation pour éviter d'ouvrir le lien
    }

    var tags = document.querySelectorAll('.chip');
    var tagAlreadySelected = false;

    // Vérifie si le tag est déjà sélectionné
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].textContent === tag) {
            if (tags[i].classList.contains('selected')) {
                tags[i].classList.remove('selected');
                tagAlreadySelected = true;
            } else {
                tags[i].classList.add('selected');
                tagAlreadySelected = false;
            }
        }
    }

    // Met à jour les tags dans les tuiles en fonction de leur état sélectionné
    var tileTags = document.querySelectorAll('.tile .chip');
    for (var i = 0; i < tileTags.length; i++) {
        if (tileTags[i].textContent === tag) {
            if (tagAlreadySelected) {
                tileTags[i].classList.remove('selected');
            } else {
                tileTags[i].classList.add('selected');
            }
        }
    }

    // Si le tag a été sélectionné ou désélectionné, appliquer les filtres et mettre à jour les tags affichés
    updateURL();
    applyFilters();
    updateVisibleTags();
}

// Fonction pour effacer les filtres
function clearFilters() {
    var tags = document.querySelectorAll('.chip');
    for (var i = 0; i < tags.length; i++) {
        tags[i].classList.remove('selected');
    }
    document.getElementById('search').value = '';
    updateURL();
    applyFilters();
    updateVisibleTags();
}

// Fonction pour ordonner les tags par ordre alphabétique
function sortTags() {
    var tagContainer = document.getElementById('tag-container');
    var tags = Array.from(tagContainer.getElementsByClassName('chip'));
    tags.sort(function(a, b) {
        return a.textContent.localeCompare(b.textContent);
    });
    tags.forEach(function(tag) {
        tagContainer.appendChild(tag);
    });
}

// Appeler la fonction pour ordonner les tags au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    sortTags();
});

// Fonction pour mettre à jour l'URL avec les tags sélectionnés
function updateURL() {
    var selectedTags = [];
    var tags = document.querySelectorAll('.chip');
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].classList.contains('selected')) {
            selectedTags.push(tags[i].textContent);
        }
    }
    var searchQuery = document.getElementById('search').value;
    var params = new URLSearchParams();
    if (selectedTags.length > 0) {
        params.set('tags', selectedTags.join(','));
    }
    if (searchQuery) {
        params.set('search', searchQuery);
    }
    history.replaceState(null, '', '?' + params.toString());
}

// Fonction pour appliquer les filtres
function applyFilters() {
    var selectedTags = [];
    var tags = document.querySelectorAll('.chip');
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].classList.contains('selected')) {
            selectedTags.push(tags[i].textContent);
        }
    }
    var searchQuery = document.getElementById('search').value.toLowerCase();

    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        var tileTags = tile.getAttribute('data-tags').split(' ');
        var tileTitle = tile.querySelector('h5').textContent.toLowerCase();
        
        var matchTag = selectedTags.every(function(tag) {
            return tileTags.includes(tag);
        });
        
        var matchSearch = tileTitle.includes(searchQuery);

        if (selectedTags.length === 0 || matchTag) {
            if (!searchQuery || matchSearch) {
                tile.style.display = '';
            } else {
                tile.style.display = 'none';
            }
        } else {
            tile.style.display = 'none';
        }
    }
}

// Fonction pour mettre à jour dynamiquement la liste des tags affichés
function updateVisibleTags() {
    var selectedTags = [];
    var tags = document.querySelectorAll('.chip');
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].classList.contains('selected')) {
            selectedTags.push(tags[i].textContent);
        }
    }

    var tagCounts = {};
    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].style.display !== 'none') {
            var tileTags = tiles[i].getAttribute('data-tags').split(' ');
            for (var j = 0; j < tileTags.length; j++) {
                if (!selectedTags.includes(tileTags[j])) {
                    if (!tagCounts[tileTags[j]]) {
                        tagCounts[tileTags[j]] = 0;
                    }
                    tagCounts[tileTags[j]]++;
                }
            }
        }
    }

    var tagContainer = document.getElementById('tag-container');
    var allTags = tagContainer.getElementsByClassName('chip');
    for (var i = 0; i < allTags.length; i++) {
        var tag = allTags[i].textContent;
        if (tagCounts[tag] || selectedTags.includes(tag)) {
            allTags[i].style.display = 'inline-block';
        } else {
            allTags[i].style.display = 'none';
        }
    }
}

// Appliquer les filtres au chargement de la page en fonction de l'URL
document.addEventListener('DOMContentLoaded', function() {
    var params = new URLSearchParams(window.location.search);
    var tags = params.get('tags');
    if (tags) {
        tags.split(',').forEach(function(tag) {
            filterByTag(tag);
        });
    }
    var searchQuery = params.get('search');
    if (searchQuery) {
        document.getElementById('search').value = searchQuery;
    }
    applyFilters();
    updateVisibleTags();
});

// Ajouter l'événement keyup pour le champ de recherche
document.getElementById('search').addEventListener('keyup', function() {
    updateURL();
    applyFilters();
    updateVisibleTags();
});
