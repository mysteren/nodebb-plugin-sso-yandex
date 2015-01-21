<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Yandex Social Authentication</div>
			<div class="panel-body">
				<form role="form" class="sso-yandex-settings">
					<p>
						Create a <strong>Yandex OAuth Client</strong> via the
						<a href="https://oauth.yandex.com/client/new">OAuth Portal</a> and then paste
						your application details here.
					</p>
					<div class="form-group">
						<label for="OAuth ID">OAuth ID</label>
						<input type="text" id="id" name="id" title="OAuth ID" class="form-control" placeholder="OAuth ID"><br />
					</div>
					<div class="form-group">
						<label for="OAuth Password">OAuth Password</label>
						<input type="text" id="secret" name="secret" title="OAuth Password" class="form-control" placeholder="OAuth Password">
					</div>
					<p class="help-block">
						The appropriate "Redirect URI" is your NodeBB's URL with `/auth/yandex/callback` appended to it.
					</p>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script>
	require(['settings'], function(Settings) {
		Settings.load('sso-yandex', $('.sso-yandex-settings'));

		$('#save').on('click', function() {
			Settings.save('sso-yandex', $('.sso-yandex-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'sso-yandex-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				})
			});
		});
	});
</script>