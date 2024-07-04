<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->
	<div class="row m-0">
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
							<input type="text" id="secret" name="secret" title="OAuth Password" class="form-control"
								placeholder="OAuth Password">
						</div>
						<p class="help-block">
							The appropriate "Redirect URI" is your NodeBB's URL with `/auth/yandex/callback` appended to it.
						</p>
						<div class="form-check">
							<input type="checkbox" class="form-check-input" id="autoconfirm" name="autoconfirm">
							<label for="autoconfirm" class="form-check-label">
								Skip email verification for people who register using SSO?
							</label>
						</div>
						<div class="form-check">
							<input type="checkbox" class="form-check-input" id="disableRegistration" name="disableRegistration" />
							<label for="disableRegistration" class="form-check-label">
								Disable user registration via SSO
							</label>
						</div>
						<p class="form-text">
							Restricting registration means that only registered users can associate their account with this SSO strategy.
							This restriction is useful if you have users bypassing registration controls by using social media accounts, or
							if you wish to use the NodeBB registration queue.
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

