from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name='index'),
    path("loadSize/<int:chosenProduct>", views.loadSize, name='loadSize'),
    path("loadPrice/<int:chosenProduct>/<str:chosenSize>", views.loadPrice, name='loadPrice'),
    path("placeOrder/", views.purchase, name='purchase')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)