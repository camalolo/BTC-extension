# Bitcoin Fees Chrome Extension

A simple Chrome extension that displays the current Bitcoin transaction fee estimate for approximately 1-hour confirmation time directly on the extension icon.

## Features

- **Real-time Fee Display**: Shows the current fee rate for 6-block confirmation (~1 hour) on the extension badge
- **Automatic Updates**: Refreshes fee data every 30 minutes
- **Manual Refresh**: Click the extension icon to force an immediate update
- **Error Handling**: Displays error status if API is unavailable
- **Caching**: Stores fee data locally to minimize API calls

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The Bitcoin Fees extension should now appear in your extensions list

## Usage

- The extension icon will display the current fee rate (in sat/vB)
- Click the icon to manually refresh the fee data
- Fee data updates automatically every 30 minutes

## API

This extension uses the [Blockstream.info Fee Estimates API](https://blockstream.info/api/fee-estimates) to fetch current fee rates.

## Permissions

- **Storage**: To cache fee data locally
- **Alarms**: To schedule periodic updates
- **Host Permissions**: Access to `https://blockstream.info/*` for API calls

## Files

- `manifest.json`: Extension manifest file
- `background.js`: Service worker handling fee fetching and badge updates
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons

## Development

To modify the extension:

1. Make changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test the changes

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.