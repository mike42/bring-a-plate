from flask_login import login_required
from flask_restplus import Resource, Namespace

from app.main.model.invitation import Invitation

invitation_ns = Namespace('Invitation', description='Invitation operations')


@invitation_ns.route('/')
class InvitationResource(Resource):
    @login_required
    def get(self):
        """
        List all invitations
        """
        return Invitation.query.all()
