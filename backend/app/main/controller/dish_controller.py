from flask_restplus import Resource, Namespace

dish_ns = Namespace('Dish', description='Dish operations')


@dish_ns.route('/<int:id>')
@dish_ns.response(404, 'Dish not found')
class DishResource(Resource):
    def get(self, id):
        return {'id': id}
