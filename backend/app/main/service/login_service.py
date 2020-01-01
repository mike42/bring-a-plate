from flask import jsonify
from flask_login import LoginManager, UserMixin, current_user
from flask_restplus import abort

from app.main.model.host import Host
from app.main.model.invitation import Invitation

login_manager = LoginManager()


class BaseUser(UserMixin):
    def is_host(self):
        raise NotImplementedError()


class HostUser(BaseUser):
    def __init__(self, host):
        """
        :type host: Host
        """
        self.host = host
        self.id = "host:%d" % host.id

    def is_host(self):
        return True


class GuestUser(BaseUser):
    def __init__(self, guest):
        """
        :type guest: Guest
        """
        self.guest = guest
        self.id = "guest:%d" % guest.id

    def is_host(self):
        return False


@login_manager.user_loader
def load_user(user_id):
    """
    @type user_id: string
    """
    if user_id.startswith('host:'):
        host_id = user_id[5:]
        host = Host.query.filter_by(id=host_id).first()
        if host:
            return HostUser(host)
    elif user_id.startswith('guest:'):
        guest_id = user_id[6:]
        guest = Invitation.query.filter_by(id=guest_id).first()
        if guest:
            return GuestUser(guest)
    return None


@login_manager.unauthorized_handler
def unauthorized():
    if current_user.is_anonymous:
        abort(401, 'You must log in to access this resource')
