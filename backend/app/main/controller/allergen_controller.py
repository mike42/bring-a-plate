from flask_restplus import Namespace, Resource, fields
from app.main.model.allergen import Allergen

allergen_ns = Namespace('Allergen', description='Allergen operations')
allergen_dto = allergen_ns.model('user', {
    'id': fields.Integer(required=True, description='Allergen ID'),
    'name': fields.String(required=True, description='Allergen Name'),
})


@allergen_ns.route('/<int:id>')
@allergen_ns.response(404, 'Allergen not found')
class AllergenResource(Resource):
    @allergen_ns.marshal_list_with(allergen_dto)
    def get(self, id):
        return Allergen.query.filter_by(id=id).first()


@allergen_ns.route('/')
class AllergenListResource(Resource):
    @allergen_ns.marshal_list_with(allergen_dto, envelope='items')
    def get(self):
        return Allergen.query.all()
