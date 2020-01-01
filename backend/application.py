from flask_migrate import Migrate

from app import blueprint
from app.main import create_app, db
from app.main.model import user

application = create_app()
application.register_blueprint(blueprint)
migrate = Migrate(application, db)

@application.route("/")
def home():
    return "This is an API service, try /api"


if __name__ == "__main__":
    application.run()
