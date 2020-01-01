from flask_restplus import Resource, Namespace, fields
from app.main.model.special_preparation import SpecialPreparation

special_preparation_ns = Namespace('Special preparation', description='Special preparation operations')
special_preparation_dto = special_preparation_ns.model('user', {
    'id': fields.Integer(required=True, description='SpecialPreparation ID'),
    'name': fields.String(required=True, description='SpecialPreparation Name'),
})


@special_preparation_ns.route('/<int:id>')
@special_preparation_ns.response(404, 'SpecialPreparation not found')
class SpecialPreparationResource(Resource):
    @special_preparation_ns.marshal_list_with(special_preparation_dto)
    def get(self, id):
        return SpecialPreparation.query.filter_by(id=id).first()


@special_preparation_ns.route('/')
class SpecialPreparationListResource(Resource):
    @special_preparation_ns.marshal_list_with(special_preparation_dto, envelope='items')
    def get(self):
        return SpecialPreparation.query.all()
