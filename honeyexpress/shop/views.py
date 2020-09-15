from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from .models import Order, Product, Size
from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import gettext as _
from django.core.mail import send_mass_mail
from django.utils import translation
from django.conf import settings

import json


def index(request):
    info = _("My father's dream was always to become a beekeeper."+
    "He started working with them about 30 years ago, at first it was just a hobby."+
    "When my brother and I became old enough we started to do our share of work in the slowly growing business.We do our best to take care of our little friends."+
    "Our honey is completely natural and raw, there are no added substances in it."+
    "We work in this field, because we care about bees and the balance of nature."+
    "Without bees, there won't be a future for this planet."+
    "For this reason, it is important for us and for every small business working in this area, that people contribute to our work, by buying our products."+
    "It is people like us who help the bees stay alive and healthy.")
    products = Product.objects.all()
    return render(request, "index.html", {'products':products, 'info':info})

def loadSize(request, chosenProduct):
    product = Product.objects.get(id=chosenProduct)
    sizes = Size.objects.filter(productid=product.id)
    return JsonResponse([size.serialize() for size in sizes], safe=False)

def loadPrice(request, chosenProduct, chosenSize):
    product = Product.objects.get(id=chosenProduct)
    try:
        p = Size.objects.get(productid=product.id, size=chosenSize)
        price = p.price
    except:
        return JsonResponse([], safe=False)
    return JsonResponse([price], safe=False)

@csrf_exempt
def purchase(request):
    if request.method != 'POST':
        error = _("Post request required.")
        return JsonResponse({"error" : error}, status=400)
    data = json.loads(request.body)
    clientName = data["name"]
    clientEmail = data["email"]
    clientAddress = data["address"]
    clientPhone = data["phone"]
    clientRequest = data["request"]
    if not clientName and not clientEmail and not clientAddress and not clientPhone:
        error = _("Your personal details were not sent, please try again.")
        return JsonResponse({"error" : error}, status=400)
    product = data.get("item","")
    pid = data.get("id", "")
    size = data.get("size", "")
    quantity = data.get("quantity", "")
    if not product and not size and not quantity:
        error = _("Your order could not be placed, please try again.")
        return JsonResponse({"error" : error}, status=400)
    newOrder = Order(
        user = clientName,
        productid = Product.objects.get(id=pid),
        email=clientEmail,
        phone=clientPhone,
        address=clientAddress,
        quantity=quantity,
        request=clientRequest
    )
    newOrder.save()
    order = newOrder
    message = _("Order placed successfully.")
    mailmessage1 = (_('Order information'), _('You have the following order from honeyexpress: *order id: ')+ str(order.id) + _('; *product: ') +
    product + _('; *size and *quantity: ') + str(size) + '--' + str(quantity), 'honeyexpressinfo@gmail.com', [clientEmail])
    mailmessage2 = ('Order information', 'New order: *order id: '+ str(order.id) + '; *product: ' + product + '; *size and *quantity: ' +
     str(size) + '--' + str(quantity) + 'for ' + clientName + 'special request: ' + clientRequest, 'honeyexpressinfo@gmail.com', ['honeyexpressinfo@gmail.com'])
    send_mass_mail((mailmessage1, mailmessage2), fail_silently=False)
    return JsonResponse({"message" : message})

def change_language(request):
    response = HttpResponseRedirect('/')
    if request.method == 'POST':
        language = request.POST.get('language')
        if language:
            if language != settings.LANGUAGE_CODE and [lang for lang in settings.LANGUAGES if lang[0] == language]:
                redirect_path = f'/{language}/'
            elif language == settings.LANGUAGE_CODE:
                redirect_path = '/'
            else:
                return response
            from django.utils import translation
            translation.activate(language)
            response = HttpResponseRedirect(redirect_path)
            response.set_cookie(settings.LANGUAGE_COOKIE_NAME, language)
    return response


