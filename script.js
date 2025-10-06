// **NOTE:** Replace 'YOUR_NEWS_API_KEY' with an actual key from a provider (e.g., NewsAPI, GNews)
const NEWS_API_KEY = 6854a2ac195e4e11894e31e3ee9b6a4c; 
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines'; // Example URL for NewsAPI

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('local-news-container');
    const locationDisplay = document.getElementById('location-display');
    const loadingMessage = document.getElementById('loading-message');

    /**
     * Step 1: Get User Location
     */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // Once location is successfully retrieved, fetch the news
                fetchLocalNews(lat, lon);
            },
            (error) => {
                console.error("Geolocation Error:", error);
                loadingMessage.textContent = "Could not get your location. Displaying general news.";
                // Fallback to a general news search (e.g., global top headlines)
                fetchGeneralNews(); 
            }
        );
    } else {
        loadingMessage.textContent = "Geolocation is not supported by this browser. Displaying general news.";
        fetchGeneralNews();
    }

    /**
     * Step 2: Fetch Local News
     * NOTE: News APIs typically don't take lat/lon directly. 
     * We need to use a Geocoding service to convert lat/lon to a city/country, 
     * and then use that city/country as a search query.
     */
    async function fetchLocalNews(lat, lon) {
        try {
            // A. Reverse Geocoding: Convert Lat/Lon to City/Country Name
            // You would need an API for this (e.g., OpenCage, Google Maps Geocoding).
            // For simplicity, we'll simulate this by fetching based on a hardcoded general query or country code.
            
            // A BETTER implementation would use a reverse geocoding service:
            // const locationResponse = await fetch(`YOUR_GEOCODING_API_URL?lat=${lat}&lon=${lon}`);
            // const locationData = await locationResponse.json();
            // const countryCode = locationData.country_code; // or city name

            // **Simplified Approach (requires the user's IP-based country code):**
            // Fetching location-based news is typically done via a country code
            // determined by IP address or explicit user input. Since we have lat/lon,
            // we should ideally reverse geocode to get the country code. 
            // For a basic example, let's assume 'us' (United States) as a fallback for the API.
            
            const countryCode = 'us'; // Replace with a reverse geocoded code or an IP-based one
            locationDisplay.textContent = `(using approximate location code: ${countryCode.toUpperCase()})`;
            
            // B. Fetch News using the determined country code
            const url = `${NEWS_API_URL}?country=${countryCode}&apiKey=${NEWS_API_KEY}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`News API returned status ${response.status}`);
            }

            const data = await response.json();
            
            if (data.articles && data.articles.length > 0) {
                displayNews(data.articles);
            } else {
                newsContainer.innerHTML = '<p>No local news found for your area.</p>';
            }

        } catch (error) {
            console.error('Error fetching local news:', error);
            loadingMessage.textContent = "Error fetching news. Please check your API key and network connection.";
        }
    }
    
    /**
     * Step 3: Display News Articles
     */
    function displayNews(articles) {
        newsContainer.innerHTML = ''; // Clear loading message
        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'news-card';
            
            // Use a placeholder image if the article has no URL
            const imageUrl = article.urlToImage || 'placeholder.jpg'; 

            card.innerHTML = `
                <img src="${imageUrl}" alt="${article.title}">
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p>${article.description || 'No description available.'}</p>
                    <a href="${article.url}" target="_blank">Read More &rarr;</a>
                </div>
            `;
            newsContainer.appendChild(card);
        });
    }

    // Function to handle the search button click (optional, but good practice)
    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        if (query) {
             // You would implement a function to fetch news based on the search query here
             console.log("Searching for:", query);
             // Example: fetchNewsByQuery(query);
        }
    });
    
    // A simple fallback if geolocation fails
    function fetchGeneralNews() {
        // You would fetch news without a country/location filter here
        // Example: fetch(`${NEWS_API_URL}?q=top stories&apiKey=${NEWS_API_KEY}`);
        // For now, just a message:
        newsContainer.innerHTML = '<p>Showing general news headlines (if implemented) or check console for errors.</p>';
    }
});

// Load Default News on Start
fetchNews();

