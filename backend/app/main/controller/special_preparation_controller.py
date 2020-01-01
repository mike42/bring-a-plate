from flask_login import login_required
from flask_restplus import Resource, Namespace, fields
from app.main.model.special_preparation import SpecialPreparation

special_preparation_ns = Namespace('Special preparation', description='Special preparation operations')
special_preparation_dto = special_preparation_ns.model('SpecialPreparation', {
    'id': fields.Integer(required=True, description='SpecialPreparation ID'),
    'name': fields.String(required=True, description='SpecialPreparation Name'),
})


@special_preparation_ns.response(404, 'SpecialPreparation not found')
@special_preparation_ns.route('/<int:id>')
class SpecialPreparationResource(Resource):
    @login_required
    @special_preparation_ns.marshal_list_with(special_preparation_dto)
    def get(self, id):
        return SpecialPreparation.query.filter_by(id=id).first()


@special_preparation_ns.route('/')
class SpecialPreparationListResource(Resource):
    @login_required
    @special_preparation_ns.marshal_list_with(special_preparation_dto, envelope='items')
    def get(self):
        return SpecialPreparation.query.all()
