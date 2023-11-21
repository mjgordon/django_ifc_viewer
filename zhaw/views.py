from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader

from django.views.decorators.csrf import csrf_exempt

import logging

import zhaw.wall_db as wall_db

from .models import IfcModel, WallElement

import json

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

@csrf_exempt
def update_type(request):
    body_json = json.loads(request.body)
    express_id = body_json["express_id"]
    type_name = body_json["new_type"]
    wall = WallElement.objects.get(express_id__exact=express_id)
    wall.type_name=type_name
    wall.save(update_fields=["type_name"])
    return HttpResponse()

@csrf_exempt
def update_name(request):
    body_json = json.loads(request.body)
    express_id = body_json["express_id"]
    wall_name = body_json["new_name"]
    wall = WallElement.objects.get(express_id__exact=express_id)
    wall.element_name=wall_name
    wall.save(update_fields=["element_name"])
    return HttpResponse()






