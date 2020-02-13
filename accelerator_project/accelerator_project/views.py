from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect,requires_csrf_token
@csrf_protect
@requires_csrf_token
def index(request):
    # url = staticfiles_storage.url('index.html')
    return render(request, 'index.html', content_type="text/html")
