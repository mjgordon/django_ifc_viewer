from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader

import logging

logger = logging.getLogger('django')



def index(request):
    template = loader.get_template("zhaw/index.html")
    context = {
    }
    return HttpResponse(template.render(context, request))
