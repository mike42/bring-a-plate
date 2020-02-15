from flask import request
from flask_login import login_required
from flask_restplus import Resource, Namespace, fields, abort
from sqlalchemy import distinct, func

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

person_specialpreparation_dto = invitation_ns.model('InvitationPersonSpecialPreparation', {
    'id': fields.Integer(required=True, description='ID'),
    'name': fields.String(required=True, description='Name'),
    'value': fields.Boolean(required=True, description='True if this applies')
})

person_allergen_dto = invitation_ns.model('InvitationPersonAllergen', {
    'id': fields.Integer(required=True, description='ID'),
    'name': fields.String(required=True, description='Name'),
    'value': fields.Boolean(required=True, description='True if this applies')
})

invitationperson_requirements_dto = invitation_ns.model('InvitationPersonRequirements', {
    'name': fields.String(required=True, description='Person Name'),
    'special_preparation': fields.List(fields.Nested(person_specialpreparation_dto)),
    'allergen': fields.List(fields.Nested(person_allergen_dto))
})

specialpreparation_count_dto = invitation_ns.model('SpecialPreparationCountDto', {
    'id': fields.Integer(required=True, description='ID'),
    'name': fields.String(required=True, description='Name'),
    'count': fields.Integer(required=True, description='Count')
})

allergen_count_dto = invitation_ns.model('AllergenCountDto', {
    'id': fields.Integer(required=True, description='ID'),
    'name': fields.String(required=True, description='Name'),
    'count': fields.Integer(required=True, description='Count')
})

invitationperson_catering_dto = invitation_ns.model('InvitationCatering', {
    'special_preparation': fields.List(fields.Nested(specialpreparation_count_dto)),
    'allergen': fields.List(fields.Nested(allergen_count_dto))
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
        if not attending:
            # Make counting easier!
            person.special_preparations = []
            person.allergens = []
        db.session.commit()
        return {}


@invitation_ns.response(404, 'Invitation not found')
@invitation_ns.route('/<int:invitation_id>/people/<int:person_id>/requirements')
class InvitationPersonRequirementsResource(Resource):
    @login_required
    @invitation_ns.marshal_with(invitationperson_requirements_dto)
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
            res_special_rep.append({'id': i.id, 'name': i.name, 'value': val})
        db.session.commit()
        return {
            'name': person.name,
            'allergen': res_allergen,
            'special_preparation': res_special_rep
        }

    @invitation_ns.marshal_with(invitationperson_requirements_dto)
    @invitation_ns.expect(invitationperson_requirements_dto)
    @login_required
    def post(self, invitation_id, person_id):
        person = InvitationPerson.query.filter_by(id=person_id).first()
        if person is None:
            abort(404, 'Person not found')
        # Handle allergens
        allergen_checked = {x['id']: x['value'] for x in request.json['allergen']}
        for allergen in Allergen.query.all():
            # Check current value
            existing_allergen = person.allergens.filter_by(id=allergen.id).first()
            if allergen_checked[allergen.id] and existing_allergen is None:
                # Need to add
                person.allergens.append(allergen)
            elif not allergen_checked[allergen.id] and existing_allergen is not None:
                # Need to delete
                person.allergens.remove(allergen)
        # Handle special preparations
        special_preparation_checked = {x['id']: x['value'] for x in request.json['special_preparation']}
        for special_preparation in SpecialPreparation.query.all():
            existing_special_preparations = person.special_preparations.filter_by(id=special_preparation.id).first()
            if special_preparation_checked[special_preparation.id] and existing_special_preparations is None:
                # Need to add
                person.special_preparations.append(special_preparation)
            elif not special_preparation_checked[special_preparation.id] and existing_special_preparations is not None:
                # Need to delete
                person.special_preparations.remove(special_preparation)
        db.session.commit()
        return request.json


@invitation_ns.response(404, 'Invitation not found')
@invitation_ns.route('/<int:invitation_id>/catering')
class InvitationPersonAttendingResource(Resource):
    @invitation_ns.marshal_with(invitationperson_catering_dto)
    @login_required
    def get(self, invitation_id):
        allergen_counts = []
        for allergen in Allergen.query.all():
            allergen_counts.append({
                'id': allergen.id,
                'name': allergen.name,
                'count': len(allergen.people)
            })
        special_preparation_counts = []
        for special_preparation in SpecialPreparation.query.all():
            special_preparation_counts.append({
                'id': special_preparation.id,
                'name': special_preparation.name,
                'count': len(special_preparation.people)
            })
        return {'allergen': allergen_counts, 'special_preparation': special_preparation_counts}


@invitation_ns.route('/')
class InvitationListResource(Resource):
    @invitation_ns.marshal_list_with(invitation_dto, envelope='items')
    @login_required
    def get(self):
        """
        List all invitations
        """
        return Invitation.query.all()
