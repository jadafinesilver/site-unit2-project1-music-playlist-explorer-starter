document.addEventListener("DOMContentLoaded", () => {
    const songsContainer = document.querySelector(".songs");
    const songTiles = songsContainer ? Array.from(songsContainer.querySelectorAll(".song-tile")) : [];
    
    fetch("data.json") 
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error: " + response.status + " for " + response.url);
            }
            return response.json();
        })
        .then((data) => {
    
    const songsContainer = document.querySelector(".songs");
    if (!songsContainer) return;
    const randomIndex = Math.floor(Math.random() * data.playlists.length);
    const randomPlaylist = data.playlists[randomIndex];
    const playlistSongs = randomPlaylist.songs || [];
    const albumImg = document.querySelector(".album img");
    const titleElement = document.querySelector(".title h3");
    if (titleElement) {
        titleElement.textContent = randomPlaylist.name;
    }
    if (albumImg) {
        albumImg.src = randomPlaylist.img;
    }
    songsContainer.innerHTML = "";
    playlistSongs.forEach(song => {
        const tileElement = document.createElement("div");
        tileElement.classList.add("song-tile");
        tileElement.innerHTML = `
            <img src="${song.img || hardcodedSongImageSrc}" alt="${song.name || 'Song Image'}" />
            <div class="song-tile-text">
                <h4>${song.name || 'Unknown Song'}</h4>
                <p>${song.artist || 'Unknown Artist'}</p>
                <span>(${song.duration || 'N/A'})</span>
            </div>
        `;
        songsContainer.appendChild(tileElement);
    });
    songTiles.forEach((tileElement, index) => {
    const song = playlistSongs[index];
    if (song) {
        console.log("Loading song:", song.name, "Image:", song.img); 
        updateExistingSongTile(tileElement, song, hardcodedSongImageSrc);
    } else {
        tileElement.querySelector('img').src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="; // clear image
        tileElement.querySelector('img').alt = "No Song";
        tileElement.querySelector('.song-tile-text').innerHTML = `<p style="color: #ccc;">No song data</p>`;
    }
            });
        })
        .catch((err) => {
            console.error("Failed to load data:", err);
            if (songsContainer) songsContainer.innerHTML = "<p>Failed to load songs. Please try again later.</p>";
        });
    
        
    function updateExistingSongTile(tileElement, song, imageSrc) {
        // Get the image element within the song-tile
        const imgElement = tileElement.querySelector('img');
        if (imgElement) {
            imgElement.src = song.img || imageSrc;  // Use song.img if available, fallback to hardcoded
            imgElement.alt = song.name || 'Song Icon';
        }

        const songTileTextDiv = tileElement.querySelector('.song-tile-text');
        if (songTileTextDiv) {
            songTileTextDiv.innerHTML = `
                <h4>${song.name || 'Unknown Song'}</h4>
                <p>${song.artist || 'Unknown Artist'}</p>
                <span>(${song.duration || 'N/A'})</span>
            `;
        } else {
            console.warn("'.song-tile-text' div not found within a song tile:", tileElement);
        }
}


   
});