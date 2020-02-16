from flask_login import login_required
from flask_restplus import Resource, Namespace, fields

from app.main.model.host import Host

host_ns = Namespace('Host', description='Host operations')
host_dto = host_ns.model('Host', {
    'id': fields.Integer(required=True, description='Host ID'),
    'username': fields.String(required=True, description='Host Username'),
})


@host_ns.route('/')
class HostResource(Resource):
    @host_ns.marshal_with(host_dto, envelope='items')
    @login_required
    def get(self):
        """
        List event hosts
        """
        return Host.query.all()
