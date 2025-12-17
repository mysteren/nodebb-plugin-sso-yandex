# NodeBB Yandex SSO

[![npm version](https://badge.fury.io/js/nodebb-plugin-sso-yandex2.svg?nocache=1)](https://badge.fury.io/js/nodebb-plugin-sso-yandex2)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-sso-yandex2.svg)](https://www.npmjs.com/package/nodebb-plugin-sso-yandex2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | [Русский](README.ru.md)**

## About

NodeBB plugin that allows users to login and register via Yandex OAuth 2.0. Perfect for Russian-speaking communities.

**Features:**
- 🔐 Yandex OAuth 2.0 authentication
- 👤 Automatic user registration with profile data
- 🔗 Account linking/unlinking
- ⚙️ Easy admin panel configuration
- 📱 Mobile-friendly

## Installation

### Via npm

```bash
npm install nodebb-plugin-sso-yandex2
```

### Via NodeBB Admin Panel

1. Go to **Administration** → **Plugins**
2. Search for `nodebb-plugin-sso-yandex2`
3. Click **Install** and activate
4. Restart NodeBB

## Quick Setup

### 1. Create Yandex OAuth App

1. Visit https://oauth.yandex.com/client/new
2. Login with Yandex account
3. Create new application with platform "Web services"

### 2. Add Redirect URI

In Yandex console, add your callback URL:

```
https://your-forum.com/auth/yandex/callback
```

For local development:
```
http://localhost:4567/auth/yandex/callback
```

### 3. Configure Plugin

1. Go to **Admin Panel** → **Plugins** → **NodeBB Yandex SSO**
2. Enter **Client ID**
3. Enter **Client Secret**
4. Save and restart

## Usage

**Users:** Click "Login with Yandex" button on login page

**Admins:** Manage SSO settings in plugin configuration

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid redirect URI" | Verify URI matches exactly in both Yandex console and plugin settings |
| "Client ID invalid" | Check credentials in Yandex OAuth console |
| Users can't login | Restart NodeBB and verify plugin is activated |

## Development

```bash
npm install
npm run lint
```

**Requires:**
- Node.js 18+
- NodeBB 3.2+

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Create Pull Request

## Support

- 📧 Email: mysterenct@gmail.com
- 🐛 [Issues](https://github.com/mysteren/nodebb-plugin-sso-yandex/issues)
- 💬 [NodeBB Community](https://community.nodebb.org)

## License

MIT License - see [LICENSE](./LICENSE)

---

**Created by [TimofeyC](https://github.com/mysteren)**
