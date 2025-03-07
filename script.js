let userIP = 'Unknown';
let userCity = 'Unknown';
let userRegion = 'Unknown';
let userCountry = 'Unknown';
let countryCode = 'Unknown';
let searchClickCount = 0; // Track number of search button clicks

// Fetch user's real geolocation using JSONP
function fetchUserGeolocation() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    script.src = `https://freegeoip.tech/json/?callback=${callbackName}`;
    script.async = true;

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    script.onerror = function() {
      reject(new Error('JSONP request failed'));
    };

    document.body.appendChild(script);
  });
}

// Initialize user geolocation data
fetchUserGeolocation()
  .then(data => {
    userIP = data.ip || 'Unknown';
    userCity = data.city || 'Unknown';
    userRegion = data.region || 'Unknown';
    userCountry = data.country_name || 'Unknown';
    countryCode = data.country_code || 'Unknown';

    // Display location and flag
    const flag = getFlagEmoji(countryCode);
    const policeEmblem = getPoliceEmblem(countryCode);
    showResponse(`${flag} ${userCity}, ${userCountry} <img src="${policeEmblem}" class="police-emblem" alt="Police Emblem">`);
  })
  .catch(error => {
    console.error('Error fetching geolocation:', error);
  });

// Get flag emoji from country code
const getFlagEmoji = (code) => {
  if (!code || code === 'Unknown') return '';
  const offset = 127397; // Unicode offset for regional indicator symbols
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt() + offset));
};

// Map country codes to police emblems
const getPoliceEmblem = (code) => {
  const policeEmblems = {
    US: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Seal_of_the_United_States_Department_of_Justice.svg/1200px-Seal_of_the_United_States_Department_of_Justice.svg.png',
    SE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Polisens_logotyp.svg/1200px-Polisens_logotyp.svg.png',
    GB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Metropolitan_Police_Service_Logo.svg/1200px-Metropolitan_Police_Service_Logo.svg.png',
    DE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bundespolizei_logo.svg/1200px-Bundespolizei_logo.svg.png',
    FR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_de_la_Police_nationale_fran%C3%A7aise.svg/1200px-Logo_de_la_Police_nationale_fran%C3%A7aise.svg.png',
  };
  return policeEmblems[code] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/No_image_available.svg/1200px-No_image_available.svg.png'; // Default image
};

// Display response
const showResponse = (message) => {
  const responseBox = document.getElementById('responseBox');
  const responseText = document.getElementById('responseText');
  responseText.innerHTML = message;
  responseBox.style.display = 'block';
};

// Handle search button clicks
const handleSearch = () => {
  searchClickCount++;

  if (searchClickCount === 2) {
    // Redirect to https://r.mtdv.me/articles/hyperboringabc on second click
    window.location.href = 'https://r.mtdv.me/articles/hyperboringabc';
    return;
  }

  const responses = [
    `Vi tackar dig, serverat! By the way, your IP (${userIP}) seems to be having a great day too!`,
    `Ditt sök är så gott som löst! Oh, and I noticed you're browsing from ${userCity}, ${userCountry}!`,
    `Här är ditt svårighetsfria svar! Also, did you know your browser loves cookies? 🍪`,
    `Sökningen var en promenad i parken! Just like your last visit to ${userCity}... don't worry, I won't tell anyone.`,
    `Ditt sök är färdigt innan du hann blinka! Blink again, and I'll guess what you're thinking.`
  ];
  showResponse(responses[Math.floor(Math.random() * responses.length)]);

  // Shuffle button positions
  shuffleButtons();
};

// Rick roll
const rickRoll = () => {
  window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
};

// Shuffle button positions
const shuffleButtons = () => {
  const buttonContainer = document.getElementById('buttonContainer');
  const buttons = Array.from(buttonContainer.children);
  buttons.sort(() => Math.random() - 0.5); // Shuffle array
  buttonContainer.innerHTML = ''; // Clear container
  buttons.forEach(button => buttonContainer.appendChild(button)); // Re-append shuffled buttons
};
