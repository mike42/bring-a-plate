from flask_login import login_required
from flask_restplus import Resource, Namespace, fields

from app.main.model.invitation import Invitation, InvitationPerson

invitation_ns = Namespace('Invitation', description='Invitation operations')
invitation_dto = invitation_ns.model('Invitation', {
    'id': fields.Integer(required=True, description='Invitation ID'),
    'name': fields.String(required=True, description='Invitation Name'),
})

invitation_person_dto = invitation_ns.model('InvitationPerson', {
    'id': fields.Integer(required=True, description='Person ID'),
    'name': fields.String(required=True, description='Person Name'),
    'response': fields.String(required=True, description='Person Response')
})


@invitation_ns.response(404, 'Invitation not found')
@invitation_ns.route('/<int:id>')
class InvitationResource(Resource):
    @login_required
    def get(self, id):
        return {'id': id}


@invitation_ns.response(404, 'Invitation not found')
@invitation_ns.route('/<int:id>/people')
class InvitationPeopleResource(Resource):
    @invitation_ns.marshal_list_with(invitation_person_dto, envelope='items')
    @login_required
    def get(self, id):
        return InvitationPerson.query.filter_by(invitation_id=id).all()


@invitation_ns.route('/')
class InvitationListResource(Resource):
    @invitation_ns.marshal_list_with(invitation_dto, envelope='items')
    @login_required
    def get(self):
        """
        List all invitations
        """
        return Invitation.query.all()
