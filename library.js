(function(module) {
	'use strict';
	/* globals require, module */

	var User = module.parent.require('./user'),
		meta = module.parent.require('./meta'),
		db = module.parent.require('../src/database'),
		passport = module.parent.require('passport'),
  		passportYandex = require('passport-yandex').Strategy,
  		nconf = module.parent.require('nconf'),
        async = module.parent.require('async');

	var constants = Object.freeze({
		'name': 'Yandex',
		'admin': {
			'route': '/plugins/sso-yandex',
			'icon': 'fa-key'
		}
	});

	var Yandex = {
		settings: undefined
	};

	Yandex.preinit = function(data, callback) {
		// Settings
		meta.settings.get('sso-yandex', function(err, settings) {
			Yandex.settings = settings;
			callback(null, data);
		});
	};

	Yandex.init = function(data, callback) {
		function render(req, res, next) {
			res.render('admin/plugins/sso-yandex', {});
		}

		data.router.get('/admin/plugins/sso-yandex', data.middleware.admin.buildHeader, render);
		data.router.get('/api/admin/plugins/sso-yandex', render);

		callback();
	};

	Yandex.getStrategy = function(strategies, callback) {
		meta.settings.get('sso-yandex', function(err, settings) {
			if (!err && settings.id && settings.secret) {
				passport.use(new passportYandex({
					clientID: settings.id,
					clientSecret: settings.secret,
					callbackURL: nconf.get('url') + '/auth/yandex/callback'
				}, function(accessToken, refreshToken, profile, done) {
					Yandex.login(profile.id, profile.displayName, profile.emails[0].value, 'https://avatars.yandex.net/get-yapic/' + profile._json.default_avatar_id + '/islands-retina-50', function(err, user) {
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
					icon: 'fa-key'
					// scope: 'https://www.yandexapis.com/auth/userinfo.profile https://www.yandexapis.com/auth/userinfo.email'
				});
			}

			callback(null, strategies);
		});
	};

	Yandex.login = function(yandexid, handle, email, picture, callback) {
		Yandex.getUidByYandexId(yandexid, function(err, uid) {
			if(err) {
				return callback(err);
			}

			if (uid !== null) {
				// Existing User
				callback(null, {
					uid: uid
				});
			} else {
				// New User
				var success = function(uid) {
					// Save yandex-specific information to the user
					User.setUserField(uid, 'yandexid', yandexid);
					db.setObjectField('yandexid:uid', yandexid, uid);
					var autoConfirm = Yandex.settings && Yandex.settings.autoconfirm === "on" ? 1: 0;
					User.setUserField(uid, 'email:confirmed', autoConfirm);
					
					// Save their photo, if present
					if (picture) {
						User.setUserField(uid, 'uploadedpicture', picture);
						User.setUserField(uid, 'picture', picture);
					}
					
					callback(null, {
						uid: uid
					});
				};

				User.getUidByEmail(email, function(err, uid) {
					if(err) {
						return callback(err);
					}

					if (!uid) {
						User.create({username: handle, email: email}, function(err, uid) {
							if(err) {
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

	Yandex.getUidByYandexId = function(yandexid, callback) {
		db.getObjectField('yandexid:uid', yandexid, function(err, uid) {
			if (err) {
				return callback(err);
			}
			callback(null, uid);
		});
	};

	Yandex.addMenuItem = function(custom_header, callback) {
		custom_header.authentication.push({
			"route": constants.admin.route,
			"icon": constants.admin.icon,
			"name": constants.name
		});

		callback(null, custom_header);
	}

	Yandex.deleteUserData = function(uid, callback) {
		async.waterfall([
			async.apply(User.getUserField, uid, 'yandexid'),
			function(oAuthIdToDelete, next) {
				db.deleteObjectField('yandexid:uid', oAuthIdToDelete, next);
			}
		], function(err) {
			if (err) {
				winston.error('[sso-yandex] Could not remove OAuthId data for uid ' + uid + '. Error: ' + err);
				return callback(err);
			}
			callback(null, uid);
		});
	};

	module.exports = Yandex;
}(module));
