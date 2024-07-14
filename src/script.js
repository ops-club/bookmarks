document.addEventListener('DOMContentLoaded', (event) => {
    let selectedTags = new Set();
    const tagContainer = document.getElementById('tag-container');
    const searchInput = document.getElementById('search');
    const searchQueryInput = document.getElementById('search-query');
    const searchEngineSelect = document.getElementById('search-engine');

    function updateTags() {
        document.querySelectorAll('.chip').forEach(chip => {
            if (selectedTags.has(chip.textContent)) {
                chip.classList.add('selected');
            } else {
                chip.classList.remove('selected');
            }
        });
    }

    window.filterByTag = function(tag, event) {
        event.stopPropagation();
        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
        } else {
            selectedTags.add(tag);
        }
        updateTags();
        applyFilters();
    };

    window.clearFilters = function() {
        selectedTags.clear();
        searchInput.value = '';
        updateTags();
        applyFilters();
    };

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const filteredTags = Array.from(selectedTags);
        const tiles = document.querySelectorAll('.tile');
        
        tiles.forEach(tile => {
            const matchesSearch = query === '' || tile.innerText.toLowerCase().includes(query);
            const matchesTags = filteredTags.length === 0 || filteredTags.every(tag => tile.dataset.tags.includes(tag));
            
            if (matchesSearch && matchesTags) {
                tile.style.display = 'inline-block';
            } else {
                tile.style.display = 'none';
            }
        });
        
        // Update URL with filters
        const params = new URLSearchParams();
        if (filteredTags.length > 0) {
            params.set('tags', filteredTags.join(','));
        }
        if (query) {
            params.set('search', query);
        }
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
    }

    window.executeSearch = function() {
        const query = searchQueryInput.value;
        const engine = searchEngineSelect.value;
        if (query) {
            window.open(`${engine}${encodeURIComponent(query)}`, '_self');
        }
    };

    window.toggleFolder = function(header) {
        const folderGroup = header.nextElementSibling;
        const arrow = header.querySelector('.arrow');

        if (folderGroup.style.display === 'none') {
            folderGroup.style.display = 'block';
            arrow.classList.remove('collapsed');
        } else {
            folderGroup.style.display = 'none';
            arrow.classList.add('collapsed');
        }
    };

    window.toggleAllFolders = function(action) {
        const folders = document.querySelectorAll('.folder-group');
        const arrows = document.querySelectorAll('.folder-header .arrow');

        folders.forEach((folder, index) => {
            folder.style.display = action === 'expand' ? 'block' : 'none';
            if (action === 'expand') {
                arrows[index].classList.remove('collapsed');
            } else {
                arrows[index].classList.add('collapsed');
            }
        });
    };

    // Initially collapse all folders
    // document.querySelectorAll('.folder-group').forEach(folder => {
    //     folder.style.display = 'none';
    // });
});
