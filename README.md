# NodeBB Yandex SSO

NodeBB Plugin that allows users to login/register via their Yandex account.

## Installation

    npm install nodebb-plugin-sso-yandex

## Configuration

1. Create a **Yandex OAuth Client** via the [API Console](https://oauth.yandex.com/client/new)
1. Locate your Client ID and Password
1. Set your "Redirect URI" as the domain you access your NodeBB with `/auth/yandex/callback` appended to it (e.g. `https://forum.mygreatwebsite.com/auth/yandex/callback`)