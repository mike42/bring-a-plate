from flask import request
from flask_login import login_required
from flask_restplus import Resource, Namespace, fields, abort

from app.main import db
from app.main.model.allergen import Allergen
from app.main.model.invitation import Invitation, InvitationPerson, Attending
from app.main.model.special_preparation import SpecialPreparation
from app.main.model.weak_entities import person_has_special_preparation, person_has_allergen

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

invitationperson_attending_dto = invitation_ns.model('InvitationPersonAttending', {
    'attending': fields.Boolean(required=True, description='Person Response')
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


@invitation_ns.response(404, 'Invitation not found')
@invitation_ns.route('/<int:invitation_id>/people/<int:person_id>/attending')
class InvitationPersonAttendingResource(Resource):
    @invitation_ns.expect(invitationperson_attending_dto)
    @login_required
    def post(self, invitation_id, person_id):
        attending = request.json['attending']
        person = InvitationPerson.query.filter_by(id=person_id).first()
        person.response = Attending.YES if attending is True else Attending.NO
        db.session.commit()
        return {}

@invitation_ns.response(404, 'Invitation not found')
@invitation_ns.route('/<int:invitation_id>/people/<int:person_id>/requirements')
class InvitationPersonRequirementsResource(Resource):
    @login_required
    def get(self, invitation_id, person_id):
        person = InvitationPerson.query.filter_by(id=person_id).first()
        if person is None:
            abort(404, 'Person not found')
        # Allergens -  Not very efficient, but the lists are quite short
        allergens = Allergen.query.all()
        res_allergen = []
        for i in allergens:
            val = False
            current = person.allergens.filter_by(id=i.id).first()
            if current is not None:
                val = True
            res_allergen.append({'id': i.id, 'name': i.name, 'value': val})
        # Similar for special prep
        special_preparations = SpecialPreparation.query.all()
        res_special_rep = []
        for i in special_preparations:
            val = False
            current = person.special_preparations.filter_by(id=i.id).first()
            if current is not None:
                val = True
            res_allergen.append({'id': i.id, 'name': i.name, 'value': val})
        db.session.commit()
        return {
            'allergen': res_allergen,
            'special_preparation': res_special_rep
        }

@invitation_ns.route('/')
class InvitationListResource(Resource):
    @invitation_ns.marshal_list_with(invitation_dto, envelope='items')
    @login_required
    def get(self):
        """
        List all invitations
        """
        return Invitation.query.all()
