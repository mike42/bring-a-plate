from flask_login import login_required
from flask_restplus import Namespace, Resource, fields

from app.main.model.allergen import Allergen

allergen_ns = Namespace('Allergen', description='Allergen operations')
allergen_dto = allergen_ns.model('Allergen', {
    'id': fields.Integer(required=True, description='Allergen ID', example='0'),
    'name': fields.String(required=True, description='Allergen Name', example='Green eggs and ham')
})


@allergen_ns.route('/<int:id>')
@allergen_ns.response(404, 'Allergen not found')
class AllergenResource(Resource):
    @allergen_ns.marshal_list_with(allergen_dto)
    @login_required
    def get(self, id):
        return Allergen.query.filter_by(id=id).first()


@allergen_ns.route('/')
class AllergenListResource(Resource):
    @allergen_ns.marshal_list_with(allergen_dto, envelope='items')
    @login_required
    def get(self):
        return Allergen.query.all()
