from django.core import serializers
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

from viewer.models import IfcModel, Annotation

import logging

import json 

logger = logging.getLogger('django')


def index(request):
    ifc_model_records = IfcModel.objects.all()
    template = loader.get_template("viewer/index.html")
    context = {
        "model_list": ifc_model_records,
    }
    return HttpResponse(template.render(context, request))


def org_view(request, org_name):
    ifc_model_records = IfcModel.objects.filter(owner_organisation__url_name__exact=org_name)

    template = loader.get_template("viewer/index.html")

    context = {
        "model_list": ifc_model_records,
    }
    return HttpResponse(template.render(context, request))


def model_view(request, org_name, model_name):    
    ifc_model_record = IfcModel.objects.get(owner_organisation__url_name__exact=org_name, model_name__exact=model_name)
    #logger.info(ifc_model_record)

    template = loader.get_template("viewer/model_view.html")
    
    context = {
        "org_name":ifc_model_record.owner_organisation.name,
        "org_url": ifc_model_record.owner_organisation.url_name,
        "model_name": ifc_model_record.display_name,
        "model_url": ifc_model_record.model_name,
        "model_path": ifc_model_record.path
    }
    return HttpResponse(template.render(context, request))


def upload(request):
    return HttpResponse("hello world")


@csrf_exempt
def annotate(request):
    body_json = json.loads(request.body)
    #logger.info(body_json)

    parent_model = IfcModel.objects.get(owner_organisation__url_name__exact=body_json['org_url'], model_name__exact=body_json['model_url'])
    annotation = Annotation(parent_model=parent_model,express_id=body_json['express_id'],text=body_json['text'])

    annotation.save()

    return HttpResponse()


def get_annotations(request):
    #logger.info(request)
    org_url = request.GET.get('org_url')
    model_url = request.GET.get('model_url')

    parent_model = IfcModel.objects.get(owner_organisation__url_name__exact=org_url, model_name__exact=model_url)
    annotation_records = Annotation.objects.filter(parent_model__exact=parent_model)

    data = serializers.serialize('json',annotation_records)

    return HttpResponse(data, content_type='application/json')
