from modeltranslation.translator import translator, TranslationOptions
from .models import Product

class ProductTranslationOptions(TranslationOptions):
    fields = ('name', 'description', 'longDescription')
translator.register(Product, ProductTranslationOptions)