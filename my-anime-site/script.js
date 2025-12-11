const episodeListEl = document.getElementById('episodeList');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const errorMessage = document.getElementById('errorMessage');
const currentYear = document.getElementById('year');

const setYear = () => {
  currentYear.textContent = new Date().getFullYear();
};

const createEpisodeCard = (episode) => {
  const card = document.createElement('button');
  card.className = 'episode-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `${episode.title} (${episode.duration || 'Unknown length'})`);

  const thumbnail = document.createElement('img');
  thumbnail.className = 'episode-thumbnail';
  thumbnail.src = episode.thumbnail || 'https://via.placeholder.com/320x180/0d0d1a/ffffff?text=Episode';
  thumbnail.alt = episode.title;

  const info = document.createElement('div');

  const metaRow = document.createElement('div');
  metaRow.className = 'episode-meta';
  metaRow.innerHTML = `<span>Ep ${episode.number}</span><span>${episode.duration || ''}</span>`;

  const title = document.createElement('div');
  title.className = 'episode-title';
  title.textContent = episode.title;

  const description = document.createElement('div');
  description.className = 'episode-description';
  description.textContent = episode.description || '';

  info.appendChild(metaRow);
  info.appendChild(title);
  info.appendChild(description);

  card.appendChild(thumbnail);
  card.appendChild(info);

  card.addEventListener('click', () => selectEpisode(episode, card));

  return card;
};

const clearActiveCards = () => {
  const activeCards = document.querySelectorAll('.episode-card.active');
  activeCards.forEach((card) => card.classList.remove('active'));
};

const selectEpisode = (episode, card) => {
  videoSource.src = episode.videoUrl;
  videoPlayer.load();
  videoPlayer.play().catch(() => {});

  videoTitle.textContent = episode.title;
  videoDescription.textContent = episode.description || '';

  clearActiveCards();
  card.classList.add('active');
};

const renderEpisodes = (episodes) => {
  episodeListEl.innerHTML = '';
  episodes.forEach((episode, index) => {
    const card = createEpisodeCard(episode);
    episodeListEl.appendChild(card);
    if (index === 0) {
      selectEpisode(episode, card);
    }
  });
};

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
};

const fetchEpisodes = async () => {
  try {
    const response = await fetch('videos.json');
    if (!response.ok) {
      throw new Error('Could not load videos.json');
    }

    const data = await response.json();
    if (!data.series?.length) {
      showError('No series found. Add series data in videos.json.');
      return;
    }

    const [firstSeries] = data.series;
    if (!firstSeries.episodes?.length) {
      showError('No episodes found in the first series.');
      return;
    }

    renderEpisodes(firstSeries.episodes);
  } catch (error) {
    console.error(error);
    showError('Unable to load episodes right now. Please try again later.');
  }
};

const init = () => {
  setYear();
  fetchEpisodes();
};

init();
