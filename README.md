# QR + Emoji Generator

Create beautiful QR codes with your favorite emoji in the center. Free, open source, and scannable.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Live Sites

- **Main:** [qremoji.cc](https://qremoji.cc) (Vercel)
- **Static:** [gh.qremoji.cc](https://gh.qremoji.cc) (GitHub Pages)

## Features

- Generate QR codes with any emoji overlay
- 60+ pre-selected emojis across 6 categories
- Custom emoji input support
- High error correction (H-level) ensures scannability
- Download as PNG
- Copy to clipboard
- Modern dark UI with glassmorphism design
- Fully responsive

## Two Versions

### 1. Static Version (GitHub Pages)
Pure HTML/CSS/JS - no build step required.

Located in `/docs` folder. Deploy to any static hosting:
- GitHub Pages
- Netlify
- Cloudflare Pages
- Any web server

### 2. Next.js Version (Vercel)
Full Next.js app with server-side QR generation.

Located in root folder. Deploy to Vercel:
```bash
npm install
npm run dev     # Development
npm run build   # Production build
```

## Tech Stack

### Static Version
- Vanilla HTML/CSS/JavaScript
- [qrcodejs](https://github.com/davidshimjs/qrcodejs) via CDN (MIT License)

### Next.js Version
- [Next.js](https://nextjs.org/) (MIT License)
- [qrcode](https://www.npmjs.com/package/qrcode) npm package (MIT License)
- [Tailwind CSS](https://tailwindcss.com/) (MIT License)

## License

MIT License - see [LICENSE](LICENSE) file.

## Third-Party Licenses

This project uses the following open source libraries:

| Library | License | URL |
|---------|---------|-----|
| qrcodejs | MIT | https://github.com/davidshimjs/qrcodejs |
| qrcode | MIT | https://github.com/soldair/node-qrcode |
| Next.js | MIT | https://github.com/vercel/next.js |
| Tailwind CSS | MIT | https://github.com/tailwindlabs/tailwindcss |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

Built with [Claude Code](https://claude.com/claude-code)
