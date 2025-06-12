document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("content-container");
    const modal = document.getElementById("playlist-modal"); 
    const closeBtn = modal.querySelector(".close-button");
    const modalArt = document.getElementById("modal-art");
    const modalName = document.getElementById("modal-name");
    const modalAuthor = document.getElementById("modal-author");
    const modalSongs = document.getElementById("modal-songs");
    let currentPlaylist = null;
// 1) Load playlists via fetch().then() chaining
    fetch("data.json")
        .then((response) => {
        if (!response.ok) {
            throw new Error("Network error: " + response.status);
        }
        return response.json();
        })
        .then((data) => {
        data.playlists.forEach(updateExistingPlaylistTile);
        })
        .catch((err) => {
        console.error("Failed to load playlists:", err);
    });
//2) update each card 
    function updateExistingPlaylistTile(pl) {
        // Find the existing HTML tile by its 'data-id' attribute
        const tile = container.querySelector(`.content-box[data-id="${pl.id}"]`);

        if (!tile) {
            console.warn(`No existing tile found for playlist ID: ${pl.id}. Skipping update.`);
            return; // Exit if no matching tile is found
        }


        const h4 = tile.querySelector('h4');
        if (h4) {
            h4.textContent = pl.name;
        }

        const authorP = tile.querySelector('p'); // The author paragraph
        if (authorP) {
            authorP.textContent = `Created by ${pl.author}`;
        }

        const likeCountSpan = tile.querySelector('.like-count');
        if (likeCountSpan) {
            likeCountSpan.textContent = pl.likes;
        }


        // --- Re-attach event listeners (Crucial for existing elements) ---

        // Open modal when clicking the tile (but not the heart/like count)
        tile.addEventListener("click", (e) => {
            // Check if the clicked element or its parent is the heart/like count
            const clickedOnHeartOrCount = e.target.closest('.heart-icon, .like-count');
            if (!clickedOnHeartOrCount) {
                currentPlaylist = pl; 
                openModal(pl);
            }
        });

        const heart = tile.querySelector(".heart-icon");
        const count = tile.querySelector(".like-count");

        if (heart && count) { // Only attach if both heart and count elements exist
            heart.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent tile click from firing
                let n = parseInt(count.textContent, 10); // Get current like count
                if (heart.classList.contains("liked")) {
                    heart.classList.remove("liked");
                    count.textContent = --n; // Decrement likes
                } else {
                    heart.classList.add("liked");
                    count.textContent = ++n; // Increment likes
                }
                // Optional: Update playlist 'likes' in your data structure if you intend to save changes
                // pl.likes = n;
            });
        }
    }

    //shuffle stuff 
    
    
    document.getElementById("shuffleButton").addEventListener("click", () => {
    if (!currentPlaylist) return; // ⛔️ Guard clause: no playlist selected

    const shuffledPlaylist = {
        ...currentPlaylist,
        songs: [...currentPlaylist.songs]
    };

    for (let i = shuffledPlaylist.songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlaylist.songs[i], shuffledPlaylist.songs[j]] = [shuffledPlaylist.songs[j], shuffledPlaylist.songs[i]];
    }

    openModal(shuffledPlaylist);
});

// 3) Populate and show modal
    function openModal(pl) {
        modalArt.src = pl.img;
        modalName.textContent = pl.name;
        modalAuthor.textContent = "Created by " + pl.author;
        modalSongs.innerHTML = "";
        pl.songs.forEach((s) => {   
            const songDiv = document.createElement("div");
            songDiv.classList.add("song-item"); // add a class for styling
            songDiv.textContent = `${s.name} — ${s.artist} (${s.duration})`;
            modalSongs.appendChild(songDiv);
        });
        modal.classList.add("show");
    }

    // 4) Close handlers
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
        modal.classList.remove("show");
        }
    });
});

