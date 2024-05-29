'use strict';

define('admin/plugins/sso-yandex', ['settings', 'alerts'], function (Settings, alerts) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('sso-yandex', $('.sso-yandex-settings'));

		$('#save').on('click', function () {
			Settings.save('sso-yandex', $('.sso-yandex-settings'), function () {
				alerts.alert({
					type: 'success',
					alert_id: 'sso-yandex-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					}
				})
			});
		});
	}

	return ACP;
})