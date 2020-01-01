from flask_login import login_required
from flask_restplus import Resource, Namespace

from app.main.model.host import Host

host_ns = Namespace('Host', description='Host operations')


@host_ns.route('/')
class HostResource(Resource):
    @login_required
    def get(self):
        """
        List event hosts
        """
        return Host.query.all()
