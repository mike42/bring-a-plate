from flask import request
from flask_login import logout_user, login_user, current_user
from flask_restplus import Resource, Namespace, fields

from app.main.model.host import Host
from app.main.model.invitation import Invitation
from app.main.service.login_service import HostUser, GuestUser

auth_ns = Namespace('Authentication', description='Authentication operations')

login_guest_dto = auth_ns.model('LoginGuest', {
    'code': fields.String(required=True, description='Invitation code', example="secret")
})
login_host_dto = auth_ns.model('LoginHost', {
    'username': fields.String(required=True, description='Username', example="example"),
    'password': fields.String(required=True, description='Password', example="secret")
})
login_result_dto = auth_ns.model('LoginResult', {
    'success': fields.Boolean(required=True, description='Username', example="true")
})


@auth_ns.route('/')
class AuthResource(Resource):
    def get(self):
        """
        Retrieve information about the active user
        """
        # TODO define data structure here so that the front-end knows whether to display a login box
        if current_user.is_anonymous:
            return {'message': 'Not authenticated'}
        return {'message': current_user.id}


@auth_ns.route('/login/host')
class LoginHostResource(Resource):
    @auth_ns.expect(login_host_dto)
    @auth_ns.marshal_with(login_result_dto)
    @auth_ns.response(401, 'Login failed.')
    def post(self):
        """
        Host login (username/password)
        """
        username = request.json['username']
        password = request.json['password']
        host = Host.query.filter_by(username=username).first()
        if host and host.check_password(password):
            user = HostUser(host)
            login_user(user)
            return {'success': True}, 200
        else:
            # Incorrect login
            logout_user()
            return {'success': False}, 401


@auth_ns.route('/login/guest')
class LoginGuestResource(Resource):
    @auth_ns.expect(login_guest_dto)
    @auth_ns.marshal_with(login_result_dto)
    @auth_ns.response(401, 'Login failed.')
    def post(self):
        """
        Guest login (invitation code)
        """
        invitation_code = request.json['code']
        invitation = Invitation.query.filter_by(code=invitation_code).first()
        if invitation:
            user = GuestUser(invitation)
            login_user(user)
            return {'success': True}, 200
        else:
            logout_user()
            return {'success': False}, 401


@auth_ns.route('/logout')
class LogoutResource(Resource):
    @auth_ns.marshal_with(login_result_dto)
    def post(self):
        """
        Log out
        """
        logout_user()
        return {'success': True}
