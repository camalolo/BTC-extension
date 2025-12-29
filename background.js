// Function to update the badge with fee text
function updateBadge(feeText) {
  console.log('updateBadge called with feeText:', feeText);
  try {
    let shortFee;
    if (feeText === 'Error') {
      shortFee = 'Err';
    } else {
      const feeAmount = Number.parseFloat(feeText);
      // One-liner: Format based on magnitude, max 4 chars
      shortFee = feeAmount.toFixed(feeAmount >= 100 ? 0 : (feeAmount >= 10 ? 1 : 2)).slice(0, 4);
    }

    chrome.action.setBadgeText({ text: shortFee });
    chrome.action.setBadgeBackgroundColor({ color: '#222222' }); // Dark grey
    console.log('Badge updated with:', shortFee);
  } catch (error) {
    console.error('Error updating badge:', error);
    chrome.action.setBadgeText({ text: 'Err' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' }); // Red for error
  }
}

// Rest of the code remains unchanged...
function fetchBitcoinFee(forceUpdate = false) {
  console.log('fetchBitcoinFee called');
  chrome.storage.local.get(['fee', 'lastUpdate'], (result) => {
    console.log('Storage data retrieved:', result);
    
    const now = Date.now();
    const lastUpdate = result.lastUpdate || 0;
    console.log('Current time:', now, 'Last update:', lastUpdate);

    if ((now - lastUpdate > 30 * 60 * 1000) || forceUpdate) {
      console.log('Fetching new fee estimate from API');
      fetch('https://blockstream.info/api/fee-estimates')
        .then(response => {
          console.log('API response status:', response.status);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then(data => {
          console.log('API response data:', data);
          const newFee = data['6'];
          console.log('New fee (6 blocks):', newFee);
          chrome.storage.local.set({ fee: newFee, lastUpdate: now }, () => {
            console.log('Fee and lastUpdate saved to storage');
          });
          updateBadge(newFee);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          if (error instanceof TypeError) {
            console.error('Failed to fetch. Retrying in 30 seconds');
            setTimeout(fetchBitcoinFee, 30_000);
          } else {
            updateBadge('Error');
          }
        });
    } else if (result.fee) {
      console.log('Using cached fee:', result.fee);
      updateBadge(result.fee);
    } else {
      console.log('No cached fee available');
      updateBadge('Error');
    }
  });
}

chrome.action.onClicked.addListener(() => {
  console.log('Icon clicked, refreshing Bitcoin fee');
  fetchBitcoinFee(true);
});

console.log('Extension loaded, initiating first fetch');
fetchBitcoinFee();

console.log('Creating alarm for periodic updates');
chrome.alarms.create('updateBitcoinFee', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
  if (alarm.name === 'updateBitcoinFee') {
    fetchBitcoinFee();
  }
});