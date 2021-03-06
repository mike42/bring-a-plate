from time import sleep

from flask_migrate import Migrate

from app import blueprint
from app.main import create_app, db
from app.main.service.login_service import login_manager
from app.main.util import test_data

application = create_app()
application.register_blueprint(blueprint)
application.app_context().push()
login_manager.init_app(application)

migrate = Migrate(application, db)

# Small delay before each request, uncomment when testing loading animations!
# @application.before_request
# def delay():
#     sleep(0.5)

@application.route("/")
def home():
    return "This is an API service, try /api"


@application.before_first_request
def create_tables():
    db.create_all()
    test_data.go()


if __name__ == "__main__":
    application.run()
