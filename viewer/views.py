from django.http import HttpResponse
from django.template import loader

from viewer.models import IfcModel, Annotation

import logging
logger = logging.getLogger(__name__)


def index(request):
    models = IfcModel.objects.all()
    logger.info(models)
    template = loader.get_template("viewer/index.html")
    context = {
        "model_list": models,
    }
    return HttpResponse(template.render(context, request))


def model_view(request, owner_name, model_name):    
    ifc_model_record = IfcModel.objects.get(owner_name__exact=owner_name, model_name__exact=model_name)

    logger.info(ifc_model_record)
    template = loader.get_template("viewer/model_view.html")
    
    context = {
        "owner_name": owner_name,
        "model_name": model_name,
        "model_path": ifc_model_record.path
    }
    return HttpResponse(template.render(context, request))


def upload(request):
    return HttpResponse("hello worldj")