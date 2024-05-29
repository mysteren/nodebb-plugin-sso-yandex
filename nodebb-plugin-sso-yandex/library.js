(function (module) {
	'use strict';
	/* globals require, module */

	const User = require.main.require('./src/user'),
		meta = require.main.require('./src/meta'),
		db = require.main.require('./src/database'),
		passport = require.main.require('passport'),
		passportYandex = require('passport-yandex').Strategy,
		nconf = require.main.require('nconf'),
		async = require.main.require('async');

	var constants = Object.freeze({
		'name': "Yandex",
		'admin': {
			'route': '/plugins/sso-yandex',
			'icon': 'icon-yandex'
		}
	});

	const Yandex = {
		settings: {
			id: process.env.SSO_YANDEX_CLIENT_ID || undefined,
			secret: process.env.SSO_YANDEX_CLIENT_SECRET || undefined,
			autoconfirm: 0,
			// style: 'light',
			disableRegistration: false,
		},
	};

	Yandex.init = function (data, callback) {

		const hostHelpers = require.main.require('./src/routes/helpers');

		hostHelpers.setupAdminPageRoute(data.router, '/admin/plugins/sso-yandex', (req, res) => {
			res.render('admin/plugins/sso-yandex', {
				title: constants.name,
				baseUrl: nconf.get('url'),
			});
		});


		// function render(req, res, next) {
		// 	res.render('admin/plugins/sso-yandex', {});
		// }

		// data.router.get('/admin/plugins/sso-yandex', data.middleware.admin.buildHeader, render);
		// data.router.get('/api/admin/plugins/sso-yandex', render);

		// callback();

		meta.settings.get('sso-yandex', (_, loadedSettings) => {
			if (loadedSettings.id) {
				Yandex.settings.id = loadedSettings.id;
			}
			if (loadedSettings.secret) {
				Yandex.settings.secret = loadedSettings.secret;
			}
			Yandex.settings.autoconfirm = loadedSettings.autoconfirm === 'on';
			// Yandex.settings.style = loadedSettings.style;
			Yandex.settings.disableRegistration = loadedSettings.disableRegistration === 'on';
			callback();
		});
	};

	Yandex.getStrategy = function (strategies, callback) {
		meta.settings.get('sso-yandex', function (err, settings) {
			if (!err && settings.id && settings.secret) {
				passport.use(new passportYandex({
					clientID: settings.id,
					clientSecret: settings.secret,
					callbackURL: nconf.get('url') + '/auth/yandex/callback'
				}, function (accessToken, refreshToken, profile, done) {
					Yandex.login(profile.id, profile.displayName, profile.emails[0].value, 'https://avatars.yandex.net/get-yapic/' + profile._json.default_avatar_id + '/islands-retina-50', function (err, user) {
						if (err) {
							return done(err);
						}
						done(null, user);
					});
				}));

				strategies.push({
					name: 'yandex',
					url: '/auth/yandex',
					callbackURL: '/auth/yandex/callback',
					icon: 'icon-yandex',
					icons: {
						svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 26 26"><path fill="#fc3f1d" d="M13 26c7.18 0 13-5.82 13-13S20.18 0 13 0 0 5.82 0 13s5.82 13 13 13z"></path><path fill="#fff" d="M17.15 20.28h-2.58V7.518h-1.149c-2.101 0-3.206 1.062-3.206 2.633 0 1.787.769 2.61 2.34 3.672l1.3.867-3.738 5.59H7.334l3.358-4.99c-1.932-1.374-3.011-2.728-3.011-4.987 0-2.85 1.971-4.778 5.73-4.778h3.738l.001 14.755z"></path></svg>`,
					},
					// scope: 'https://www.yandexapis.com/auth/userinfo.profile https://www.yandexapis.com/auth/userinfo.email'
					labels: {
						login: '[[yandexsso:sign-in]]',
						register: '[[yandexsso:sign-up]]',
					},
				});
			}

			callback(null, strategies);
		});
	};

	Yandex.login = function (yandexid, handle, email, picture, callback) {
		Yandex.getUidByYandexId(yandexid, function (err, uid) {
			if (err) {
				return callback(err);
			}

			if (uid !== null) {
				// Existing User
				callback(null, {
					uid: uid
				});
			} else {
				// New User
				var success = function (uid) {
					meta.settings.get('sso-yandex', function (err, settings) {
						var autoConfirm = settings && settings['autoconfirm'] === "on" ? 1 : 0;
						User.setUserField(uid, 'email:confirmed', autoConfirm);
						// Save yandex-specific information to the user
						User.setUserField(uid, 'yandexid', yandexid);
						db.setObjectField('yandexid:uid', yandexid, uid);

						// Save their photo, if present
						if (picture) {
							User.setUserField(uid, 'uploadedpicture', picture);
							User.setUserField(uid, 'picture', picture);
						}

						callback(null, {
							uid: uid
						});
					}); Z
				};

				User.getUidByEmail(email, function (err, uid) {
					if (err) {
						return callback(err);
					}

					if (!uid) {
						User.create({ username: handle, email: email }, function (err, uid) {
							if (err) {
								return callback(err);
							}

							success(uid);
						});
					} else {
						success(uid); // Existing account -- merge
					}
				});
			}
		});
	};

	Yandex.getUidByYandexId = function (yandexid, callback) {
		db.getObjectField('yandexid:uid', yandexid, function (err, uid) {
			if (err) {
				return callback(err);
			}
			callback(null, uid);
		});
	};

	Yandex.addMenuItem = function (custom_header, callback) {
		custom_header.authentication.push({
			"route": constants.admin.route,
			"icon": constants.admin.icon,
			"name": constants.name
		});

		callback(null, custom_header);
	}

	Yandex.deleteUserData = function (uid, callback) {
		async.waterfall([
			async.apply(User.getUserField, uid, 'yandexid'),
			function (oAuthIdToDelete, next) {
				db.deleteObjectField('yandexid:uid', oAuthIdToDelete, next);
			}
		], function (err) {
			if (err) {
				winston.error('[sso-yandex] Could not remove OAuthId data for uid ' + uid + '. Error: ' + err);
				return callback(err);
			}
			callback(null, uid);
		});
	};

	module.exports = Yandex;
}(module));
