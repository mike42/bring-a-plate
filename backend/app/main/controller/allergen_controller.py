from flask_restplus import Namespace, Resource

allergen_ns = Namespace('Allergen', description='Allergen operations')


@allergen_ns.route('/<int:id>')
@allergen_ns.response(404, 'Allergen not found')
class AllergenResource(Resource):
    def get(self, id):
        return {'id': id}
