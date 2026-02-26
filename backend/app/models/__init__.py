# Import both models here so Base.metadata.create_all() finds them
# and creates both tables automatically on startup
from app.models.employee import Employee
from app.models.attendance import Attendance