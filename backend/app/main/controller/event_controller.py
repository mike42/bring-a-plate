from flask_login import login_required
from flask_restplus import Resource, Namespace

event_ns = Namespace('Event', description='Event operations')


@event_ns.route('/')
class EventResource(Resource):
    @login_required
    def get(self):
        """
        List events visible to this user
        """
        return []


@event_ns.response(404, 'Event not found')
@event_ns.route('/<int:id>')
class EventResource(Resource):
    @login_required
    def get(self, id):
        return {'id': id}
