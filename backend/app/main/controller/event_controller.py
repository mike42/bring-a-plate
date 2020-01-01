from flask_restplus import Resource, Namespace

event_ns = Namespace('Event', description='Event operations')


@event_ns.route('/')
class EventResource(Resource):
    def get(self):
        """
        List events visible to this user
        """
        return []


@event_ns.route('/<int:id>')
@event_ns.response(404, 'Event not found')
class EventResource(Resource):
    def get(self, id):
        return {'id': id}
