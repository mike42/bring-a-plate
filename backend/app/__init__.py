from flask import Blueprint
from flask_restplus import Api

from app.main.controller.allergen_controller import allergen_ns
from app.main.controller.special_preparation_controller import special_preparation_ns
from app.main.controller.event_controller import event_ns
from app.main.controller.dish_controller import dish_ns
from app.main.controller.user_controller import user_ns

blueprint = Blueprint('api', __name__, url_prefix='/api')

authorizations = {
    'ApiKeyHeader': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'X-API-Key',
    }
}
api = Api(blueprint, version='1.0', title='Bring a Plate',
          description='REST API for event management.',
          authorizations=authorizations,
          security='ApiKeyHeader')

api.add_namespace(allergen_ns, path='/allergen')
api.add_namespace(dish_ns, path='/dish')
api.add_namespace(event_ns, path='/event')
api.add_namespace(special_preparation_ns, path='/preparation')
api.add_namespace(user_ns, path='/user')
