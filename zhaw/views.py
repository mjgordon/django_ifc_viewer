from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader

from django.views.decorators.csrf import csrf_exempt

import logging

import zhaw.wall_db as wall_db

from .models import IfcModel, WallElement

logger = logging.getLogger('django')



def index(request):
    template = loader.get_template("zhaw/index.html")

    context = {
        "loaded": wall_db.is_loaded(),
    }
    return HttpResponse(template.render(context, request))

@csrf_exempt
def load_file(request):
    logger.info("Importing File")
    wall_db.import_file()
    
    return HttpResponse()


def unload(request):
    logger.info("Unloaded File")
    wall_db.unload()
    return HttpResponse("Unloaded")


def get_model_data(request):
    models = IfcModel.objects.all()
    data = serializers.serialize('json',models)
    return HttpResponse(data, content_type='application/json')


def get_wall_data(request):
    walls = WallElement.objects.all()
    data = serializers.serialize('json',walls)
    return HttpResponse(data, content_type='application/json')

def get_wall_data_filtered(request, type_name):
    walls = WallElement.objects.filter(type_name__exact=type_name)
    data = serializers.serialize('json',walls)
    return HttpResponse(data, content_type='application/json')




