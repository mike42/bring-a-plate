from flask_login import login_required
from flask_restplus import Resource, Namespace, fields, abort

from app.main.model.event import Event

event_ns = Namespace('Event', description='Event operations')
event_dto = event_ns.model('Event', {
    'id': fields.Integer(required=True, description='Event ID'),
    'name': fields.String(required=True, description='Event Name'),
})


@event_ns.route('/')
class EventListResource(Resource):
    @event_ns.marshal_list_with(event_dto, envelope='items')
    @login_required
    def get(self):
        """
        List events visible to this user
        """
        return Event.query.all()


@event_ns.response(404, 'Event not found')
@event_ns.route('/<int:id>')
class EventResource(Resource):
    @event_ns.marshal_with(event_dto)
    @login_required
    def get(self, id):
        item = Event.query.filter_by(id=id).first()
        if not item:
            abort(404, 'Event not found')
        return item
