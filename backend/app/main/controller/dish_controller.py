from flask_login import login_required
from flask_restplus import Resource, Namespace

dish_ns = Namespace('Dish', description='Dish operations')


@dish_ns.response(404, 'Dish not found')
@dish_ns.route('/<int:id>')
class DishResource(Resource):
    @login_required
    def get(self, id):
        return {'id': id}
