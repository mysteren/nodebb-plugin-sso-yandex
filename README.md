# NodeBB Yandex SSO
[![npm version](https://badge.fury.io/js/nodebb-plugin-sso-yandex2.svg?nocache=1)](https://badge.fury.io/js/nodebb-plugin-sso-yandex2)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-sso-yandex2.svg)](nodebb-plugin-sso-yandex2)

NodeBB Plugin that allows users to login/register via their Yandex account.

## Installation

    npm install nodebb-plugin-sso-yandex2

## Configuration

1. Create a **Yandex OAuth Client** via the [API Console](https://oauth.yandex.com/client/new)
2. Locate your Client ID and Client secret
3. Set your "Redirect URI" as the domain you access your NodeBB with `/auth/yandex/callback` appended to it (e.g. `https://{my-site-host}/auth/yandex/callback`)