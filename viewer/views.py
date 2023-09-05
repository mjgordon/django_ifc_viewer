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
    models = IfcModel.objects.all()
    logger.info(models)
    template = loader.get_template("viewer/model_view.html")
    context = {
        "model_list": models,
    }
    return HttpResponse(template.render(context, request))


def upload(request):
    return HttpResponse("hello worldj")