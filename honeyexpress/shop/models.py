from django.db import models

class Product(models.Model): 
    name = models.CharField(max_length=20)
    description = models.TextField(max_length=150)
    longDescription = models.TextField(default="")
    image = models.ImageField(default='')
    def serialize(self):
        return {
            "id":self.id,
            "name":self.name,
            "description":self.description,
            "longDescription":self.longDescription,
            "image":self.image,
        }

class Size(models.Model):
    productid = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    def serialize(self):
        return {
            "size":self.size,
            "price":self.price,
        }

class Order(models.Model):
    user = models.CharField(max_length=35)
    email = models.EmailField()
    address = models.TextField(max_length=70)
    productid = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    phone = models.CharField(max_length=14)
    quantity = models.IntegerField()
    request = models.TextField(max_length=70)
    date = models.DateField(auto_now_add=True)


