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
					<div class="checkbox">
						<label for="showSiteTitle" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
							<input type="checkbox" class="mdl-switch__input" id="showSiteTitle" name="autoconfirm" />
							<span class="mdl-switch__label">Skip email verification for people who register using SSO?</span>
						</label>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>