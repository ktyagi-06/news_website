
// ========== NEWS APP ==========

// 1️⃣ Get API Key from https://newsapi.org and paste it below:
const API_KEY = 6854a2ac195e4e11894e31e3ee9b6a4c; // replace with your actual key

const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Default news category on load
const defaultTopic = "latest";

// Fetch News Function
async function fetchNews(query = defaultTopic) {
  newsContainer.innerHTML = `<p style="text-align:center;">Loading news...</p>`;
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
    );
    const data = await response.json();

    if (data.articles.length === 0) {
      newsContainer.innerHTML = `<p style="text-align:center;">No news found for "${query}". Try another keyword!</p>`;
      return;
    }

    renderNews(data.articles.slice(0, 12)); // Show top 12
  } catch (error) {
    newsContainer.innerHTML = `<p style="text-align:center;color:red;">Error fetching news. Please check your API key or internet.</p>`;
    console.error(error);
  }
}

// Render News Cards
function renderNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("news-card");

    const img = document.createElement("img");
    img.classList.add("news-img");
    img.src = article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image";

    const content = document.createElement("div");
    content.classList.add("news-content");

    const title = document.createElement("h2");
    title.textContent = article.title;

    const desc = document.createElement("p");
    desc.textContent = article.description || "No description available.";

    const link = document.createElement("a");
    link.href = article.url;
    link.target = "_blank";
    link.textContent = "Read More";

    content.append(title, desc, link);
    card.append(img, content);
    newsContainer.appendChild(card);
  });
}

// Search Functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchNews(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchNews(query);
  }
});

// Load Default News on Start
fetchNews();
