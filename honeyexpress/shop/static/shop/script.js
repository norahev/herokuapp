document.addEventListener('DOMContentLoaded', function () {
	var buttons = document.querySelectorAll(".more");
	buttons.forEach((button) => {
		button.addEventListener('click', openModal)
	});
	document.querySelector(".close").addEventListener('click', closeModal);
	window.addEventListener('click', outsideClick);
	document.querySelector(".menuX").addEventListener("click", function () {
		this.classList.toggle('change');
		var panel = document.getElementById("menu-modal");
		if (panel.style.display === "block") {
			panel.style.display = "none";
		} else {
			panel.style.display = "block";
		}
	});
});
let cartList = [];
var total = parseInt('0');

function openModal() {
	document.querySelector('#my-modal').style.display = 'block';
	document.querySelector(".modal-body").style.display = 'block';
	if (cartList.length > 0) {
		document.getElementById('orderform').style.display = 'none';
		document.getElementById('s').style.display = 'none';
		document.getElementById('cartid').style.display = 'block';
		document.getElementById('continue').style.display = 'none';
		document.getElementById('thanks').style.display = 'none';
		document.querySelector('.back').style.display = 'none';
	} else {
		document.getElementById('orderform').style.display = 'block';
		document.getElementById('s').style.display = 'none';
		document.getElementById('cartid').style.display = 'none';
		document.getElementById('continue').style.display = 'none';
		document.getElementById('thanks').style.display = 'none';
		document.querySelector('.back').style.display = 'none';
	}
	shop();
	local();
}

function closeModal() {
	goBack(continueShopping);
	document.querySelector('#my-modal').style.display = 'none';
}

function outsideClick(e) {
	if (e.target == document.querySelector('#my-modal')) {
		goBack(continueShopping);
		document.querySelector('#my-modal').style.display = 'none';
	}
}

function loadSize(chosenProduct) {
	document.getElementById('s').style.display = 'block';
	fetch(`/loadSize/${chosenProduct}`).then(response => response.json()).then(data => {
		document.querySelector("#productsize").innerHTML = `<option selected="true"disabled="disabled"value='option1'>--kg--</option>`;
		data.forEach(d => {
			Object.entries(d).forEach(([key, value]) => {
				if (key === "size") {
					const opt = document.createElement('option');
					opt.innerHTML = `${value}`;
					document.querySelector('#productsize').append(opt);
				}
			});
		})
	})
}

function loadPrice(chosenProduct, chosenSize, chosenQuantity) {
	fetch(`/loadPrice/${chosenProduct}/${chosenSize}`).then(response => response.json()).then(data => {
		price = data * chosenQuantity;
		document.querySelector("#price").innerHTML = `${price}.00`;
	})
}

function addToCart(chosenProduct, chosenSize, chosenQuantity, id) {
	document.querySelector(".back").style.display = 'none';
	document.getElementById("cartid").style.display = 'block';
	document.getElementById("orderform").style.display = 'none';
	document.getElementById("continue").style.display = 'none';
	document.getElementById("thanks").style.display = 'none';
	price = document.querySelector("#price").innerHTML;
	cartitem = {
		item: chosenProduct,
		size: chosenSize,
		quantity: chosenQuantity,
		price: price,
		id: id
	};
	showCart(cartitem);
	storeInfo(cartitem, cartitem);
	document.getElementById("shopmore").addEventListener('click', function () {
		continueShopping();
	});
	document.querySelector('#purchase').addEventListener('click', function () {
		purchase();
	})
}

function showCart(cartitem) {
	if (cartList !== []) {
		for (i = 0; i < cartList.length; i++) {
			if (cartList[i][0] === cartitem.item && cartList[i][1] === cartitem.size) {
				alert('This product and size is already in your basket.');
				return;
			}
		}
	}
	var element = document.createElement('div');
	element.innerHTML = `<div class="row cart-row"><span class="col-3 cart-item cart-column"class="product1">${cartitem.item}</span><span class="col-3 cart-size cart-column"class="product2">${cartitem.size}</span><span class="col-3 cart-quantity cart-column">${cartitem.quantity}</span><span class="col-3 cart-price cart-column">${cartitem.price}RON</span></div>`;
	cartList.push([`${cartitem.item}`, `${cartitem.size}`, `${cartitem.quantity}`, `${cartitem.id}`]);
	document.querySelector(".cart-items").append(element);
	storeInfo(cartList, cartList);
	updateTotal(cartitem.price);
}

function storeInfo(key, value) {
	if (!localStorage.getItem(key)) {
		localStorage.setItem(key, value);
	}
	var sobject = JSON.stringify(value);
	localStorage.setItem(key, sobject);
}

function local() {
	var values = [],
		keys = Object.keys(localStorage),
		i = keys.length;
	while (i--) {
		values.push(localStorage.getItem(keys[i]));
	}
}

function updateTotal(price) {
	total += parseInt(price);
	document.querySelector("#total").innerHTML = `${total}.00 RON`;
}

function getClientInfo() {
	name = document.getElementById('name').value;
	email = document.getElementById('email').value;
	address1 = document.getElementById('address1').value;
	address2 = document.getElementById('address2').value;
	phone = document.getElementById('phone').value;
	client = {
		name: name,
		email: email,
		address1: address1,
		address2: address2,
		phone: phone
	};
	storeInfo(client, client);
}

function continueShopping() {
	document.getElementById('orderform').style.display = 'block';
	document.getElementById('chooseproduct').style.display = 'block';
	document.getElementById('clientinfo').style.display = 'none';
	document.getElementById('cartid').style.display = 'none';
	document.getElementById("s").style.display = 'none';
	document.getElementById("continue").style.display = 'none';
	document.getElementById("thanks").style.display = 'none';
	document.querySelector(".back").style.display = 'block';
	goBack(myCart);
	setBackButtons("#producttype");
	setBackButtons("#quantity");
	setBackButtons("#productsize");
}

function shop() {
	document.getElementById('addtocart').disabled = true;
	const element = document.querySelector("#producttype");
	element.addEventListener('change', (event) => {
		chosenProduct = event.target.value;
		loadSize(chosenProduct);
		try {
			loadPrice(chosenProduct, chosenSize, chosenQuantity);
		} catch {
			const s = document.querySelector("#productsize");
			s.addEventListener('change', (event) => {
				chosenSize = event.target.value;
				try {
					loadPrice(chosenProduct, chosenSize, chosenQuantity);
				} catch {
					const p = document.querySelector('#quantity');
					p.addEventListener('change', (event) => {
						chosenQuantity = event.target.value;
						try {
							loadPrice(chosenProduct, chosenSize, chosenQuantity);
							document.getElementById('addtocart').disabled = false;
						} catch {
							return;
						}
					})
				}
			})
		}
	});
	document.querySelector("#addtocart").addEventListener('click', function () {
		pt = document.getElementById("producttype");
		id = document.querySelector('#producttype').value;
		chosenProduct = pt.options[pt.selectedIndex].text;
		chosenSize = document.getElementById("productsize").value;
		chosenQuantity = document.getElementById("quantity").value;
		addToCart(chosenProduct, chosenSize, chosenQuantity, id);
		if (!localStorage.getItem('client')) {
			getClientInfo();
		}
	});
};

function setBackButtons(button) {
	document.querySelector(button).value = 'option1';
}

function purchase() {
	document.querySelector(".back").style.display = 'block';
	document.getElementById('orderform').style.display = 'block';
	document.getElementById('chooseproduct').style.display = 'none';
	document.getElementById('clientinfo').style.display = 'block';
	document.getElementById('cartid').style.display = 'none';
	document.getElementById("s").style.display = 'none';
	document.getElementById("continue").style.display = 'block';
	document.getElementById("shopmore").style.display = 'none';
	document.querySelector("#purchase").style.display = 'none';
	document.getElementById("thanks").style.display = 'none';
	div = document.getElementById('req');
	div.innerHTML = `<label for="request">Special request</label><textarea class="form-control"id="request"rows="3"placeholder="...">`;
	error = document.querySelector('#error');
	goBack(myCart);
	document.querySelector("#continue").addEventListener('click', function () {
		name = document.getElementById('name').value;
		email = document.getElementById('email').value;
		address1 = document.getElementById('address1').value;
		address2 = document.getElementById('address2').value;
		phone = document.getElementById('phone').value;
		request = document.getElementById('request').value;
		if (name == '') {
			error.innerHTML = '<h4>"* Required."</h4>';
			return;
		} else if (email == '') {
			error.innerHTML = '<h4>"* Required."</h4>';
			return;
		} else if (address1 == '') {
			error.innerHTML = '<h4>"*Required."</h4>';
			return;
		} else if (phone == '') {
			error.innerHTML = '<h4>"*Required."</h4>';
			return;
		} else {
			error.innerHTML = '';
		}
		client = {
			name: name,
			email: email,
			address: address1 + address2,
			phone: phone,
			request: request
		};
		continuePurchase(client);
	})
}

function placeOrder(client, item, size, quantity, id) {
	fetch('/placeOrder/', {
		method: 'POST',
		body: JSON.stringify({
			name: client.name,
			email: client.email,
			address: client.address,
			phone: client.phone,
			request: client,
			request,
			id: id,
			item: item,
			size: size,
			quantity: quantity
		})
	}).then(response => response.json()).then(result => {
		if (result.message !== "Order placed successfully.") {
			alert(result.error)
		}
		showThanks();
	})
}

function continuePurchase(client) {
	document.getElementById('orderform').style.display = 'block';
	document.getElementById('chooseproduct').style.display = 'none';
	document.getElementById('clientinfo').style.display = 'none';
	document.getElementById('cartid').style.display = 'block';
	document.getElementById("s").style.display = 'none';
	document.getElementById("continue").style.display = 'none';
	document.getElementById("shopmore").style.display = 'block';
	document.querySelector("#purchase").style.display = 'block';
	goBack(purchase);
	document.getElementById('purchase').addEventListener('click', function () {
		order = cartList;
		for (o = 0; o < order.length; o++) {
			placeOrder(client, order[o][0], order[o][1], order[o][2], order[o][3])
		}
	})
}

function myCart() {
	document.getElementById('orderform').style.display = 'block';
	document.getElementById('chooseproduct').style.display = 'none';
	document.getElementById('clientinfo').style.display = 'none';
	document.getElementById('cartid').style.display = 'block';
	document.getElementById("s").style.display = 'none';
	document.getElementById("continue").style.display = 'none';
	document.getElementById("shopmore").style.display = 'block';
	document.querySelector("#purchase").style.display = 'block';
	document.querySelector(".back").style.display = 'none';
}

function showThanks() {
	document.querySelector('#thanks').style.display = 'block';
	document.getElementById('orderform').style.display = 'none';
	document.getElementById('chooseproduct').style.display = 'none';
	document.getElementById('clientinfo').style.display = 'none';
	document.getElementById('cartid').style.display = 'none';
	document.getElementById("s").style.display = 'none';
	document.getElementById("continue").style.display = 'none';
	document.getElementById("shopmore").style.display = 'none';
	document.querySelector("#purchase").style.display = 'none';
	localStorage.clear();
	cartList = [];
	document.querySelector(".close").addEventListener("click", function () {
		window.location.reload(false);
	})
}

function goBack(funct) {
	document.querySelector(".back").addEventListener('click', funct);
}
