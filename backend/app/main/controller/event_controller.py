import csv
import io

from flask import make_response
from flask_login import login_required, current_user
from flask_restplus import Resource, Namespace, fields, abort

from app.main.model.event import Event
from app.main.model.invitation import InvitationPerson, Invitation, Attending

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


@event_ns.route('/attendees/export')
class InvitationListResource(Resource):
    @login_required
    def get(self):
        """
        List all attendees (CSV version)
        """
        if not current_user.is_host():
            abort(403, "Forbidden")
        all_people = InvitationPerson.query.all()
        rows = []
        for person in all_people:
            if person.response is not Attending.YES:
                continue
            invitation = Invitation.query.filter_by(id=person.invitation_id).first();
            if invitation is None:
                continue
            rows.append({
                'id': person.id,
                'name': person.name,
                'invitation_id': person.invitation_id,
                'invitation_name': invitation.name,
                'response': person.response,
                'allergies': ", ".join([x.name for x in person.allergens]),
                'special_preparation': ", ".join([x.name for x in person.special_preparations]),
            })
        si = io.StringIO()
        keys = rows[0].keys() if len(rows) > 0 else []
        cw = csv.DictWriter(si, fieldnames=keys)
        cw.writeheader()
        cw.writerows(rows)
        output = make_response(si.getvalue())
        output.headers["Content-Disposition"] = "attachment; filename=attendees.csv"
        output.headers["Content-type"] = "text/csv"
        return output

