import ifcopenshell
import logging
import os

from django.conf import settings

from .models import IfcModel, WallElement



ifc_file = None

logger = logging.getLogger('django')

def unload():
    global ifc_file
    ifc_file = None
    IfcModel.objects.all().delete()
    WallElement.objects.all().delete()

def import_file():
    global ifc_file

    if ifc_file is None:
        ifc_file = ifcopenshell.open(os.path.join(settings.BASE_DIR, 'zhaw/data/racbasicsampleproject.ifc'))
        logger.info("Loaded")
        register_file(ifc_file)
        logger.info("Registered")
    else:
        logger.info("Already Loaded")
    


def register_file(ifc):
    person = ifc.by_type("IfcPerson")[0]
    author_name = f"{person.GivenName} {person.FamilyName}"

    project = ifc.by_type("IfcProject")[0]
    project_name = f"{project.Name} : {project.LongName}"

    model = IfcModel(project_name=project_name, author_name=author_name)
    model.save()

    walls = ifc.by_type("IfcWall")
    print(len(walls))

    print(walls[0].get_info())
    print(walls[0].Name)

    for wall in walls:
        step_id =  wall.id()
        name = wall.Name
        type_name = wall.ObjectType
        print(step_id)
        print(wall.ObjectType)
        print(ifcopenshell.util.element.get_type(wall))

        wall = WallElement(parent_model = model, express_id = step_id,element_name=name, type_name=type_name)
        wall.save()

def is_loaded():
    global ifc_file
    return ifc_file is not None