document.addEventListener('DOMContentLoaded', () => {
  const timeFrameSelect = document.getElementById('timeFrame');
  const refreshButton = document.getElementById('refreshButton');
  const coinList = document.getElementById('coinList');

  // Birdeye API endpoint and your API key
  const API_ENDPOINT = 'https://public-api.birdeye.so/public/tokenlist';
  const API_KEY = 'YOUR_BIRDEYE_API_KEY'; // Replace with your actual API key

  async function fetchTopMemecoins(timeFrame) {
    try {
      const response = await fetch(`${API_ENDPOINT}?sort_by=${timeFrame}_volume_change&sort_type=desc&offset=0&limit=100`, {
        headers: {
          'X-API-KEY': API_KEY
        }
      });
      const data = await response.json();
      return data.data.tokens.filter(token => token.tag === 'meme').slice(0, 10);
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  function displayMemecoins(memecoins, timeFrame) {
    coinList.innerHTML = '';
    memecoins.forEach(coin => {
      const coinItem = document.createElement('div');
      coinItem.className = 'coin-item';
      coinItem.innerHTML = `
        <a href="https://birdeye.so/token/${coin.address}?chain=solana" target="_blank" class="coin-symbol">
          <img src="${coin.logo_url || 'placeholder.png'}" alt="${coin.symbol}" class="coin-logo">
          <span class="coin-name">${coin.symbol}</span>
        </a>
        <span class="coin-volume">${timeFrame} Volume: $${Number(coin[`${timeFrame}_volume`]).toLocaleString()}</span>
        <span class="coin-price">$${Number(coin.price).toLocaleString()}</span>
      `;
      coinList.appendChild(coinItem);
    });
  }

  async function updateMemecoins() {
    const timeFrame = timeFrameSelect.value;
    const memecoins = await fetchTopMemecoins(timeFrame);
    displayMemecoins(memecoins, timeFrame);
  }

  timeFrameSelect.addEventListener('change', updateMemecoins);
  refreshButton.addEventListener('click', updateMemecoins);

  // Initial load
  updateMemecoins();
});
