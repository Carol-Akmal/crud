var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrice");
var productCateogryInput = document.getElementById("productCateogry");
var productDescriptionInput = document.getElementById("productDescription");
var productImageInput = document.getElementById("productImage");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");

var products = [];
var currentIndex = null;

var regex = {
  productName: { pattern: /^[A-Z][a-z]{2,10}$/, isValid: false },
  productPrice: { pattern: /^\d+(\.\d{1,2})?$/, isValid: false },
  productCateogry: { pattern: /^(tv|mobile|laptop)$/i, isValid: false },
  productDescription: { pattern: /[a-zA-Z]+/, isValid: false },
  productImage: { pattern: /\.(jpg|jpeg|png|gif)$/i, isValid: false }
};

if (localStorage.getItem("products")) {
  products = JSON.parse(localStorage.getItem("products"));
  displayproducts();
}

function getImageBase64(fileInput, callback) {
  const file = fileInput.files[0];
  if (!file) return callback("");
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

function addproduct() {
  getImageBase64(productImageInput, function (imageData) {
    var product = {
      productName: productNameInput.value,
      productPrice: productPriceInput.value,
      productCateogry: productCateogryInput.value,
      productDescription: productDescriptionInput.value,
      productImage: imageData
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    displayproducts();
    clearInputs();
    addBtn.disabled = true;
  });
}

function displayproducts() {
  var cartona = '';
  for (var i = 0; i < products.length; i++) {
    cartona += `
      <tr>
        <td>${i + 1}</td>
        <td>${products[i].productName}</td>
        <td>${products[i].productPrice}</td>
        <td>${products[i].productCateogry}</td>
        <td>${products[i].productDescription}</td>
        <td><img src="${products[i].productImage}" width="80"></td>
        <td>
          <button onclick="deleteproducts(${i})" class="btn btn-danger btn-sm">Delete</button>
          <button onclick="fillupdateInputs(${i})" class="btn btn-warning btn-sm">Update</button>
        </td>
      </tr>`;
  }
  document.getElementById("myBody").innerHTML = cartona;
}

function deleteproducts(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  displayproducts();
}

function fillupdateInputs(index) {
  currentIndex = index;
  var product = products[index];
  productNameInput.value = product.productName;
  productPriceInput.value = product.productPrice;
  productCateogryInput.value = product.productCateogry;
  productDescriptionInput.value = product.productDescription;

  addBtn.classList.add("d-none");
  updateBtn.classList.replace("d-none", "d-block");
}

function updateproduct() {
  getImageBase64(productImageInput, function (imageData) {
    if (imageData) {
      products[currentIndex].productImage = imageData;
    }
    products[currentIndex].productName = productNameInput.value;
    products[currentIndex].productPrice = productPriceInput.value;
    products[currentIndex].productCateogry = productCateogryInput.value;
    products[currentIndex].productDescription = productDescriptionInput.value;

    localStorage.setItem("products", JSON.stringify(products));
    displayproducts();
    clearInputs();

    updateBtn.classList.replace("d-block", "d-none");
    addBtn.classList.remove("d-none");
    addBtn.disabled = true;
  });
}

function clearInputs() {
  productNameInput.value = '';
  productPriceInput.value = '';
  productCateogryInput.value = '';
  productDescriptionInput.value = '';
  productImageInput.value = '';

  [productNameInput, productPriceInput, productCateogryInput, productDescriptionInput, productImageInput]
    .forEach(inp => inp.classList.remove("is-valid", "is-invalid"));
}

function validateProductInput(element) {
  let field = regex[element.id];
  let value =
    element.id === "productImage" && element.files.length
      ? element.files[0].name
      : element.value;

  if (field.pattern.test(value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    field.isValid = true;
    element.nextElementSibling.classList.add("d-none");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    field.isValid = false;
    element.nextElementSibling.classList.remove("d-none");
  }

  if (element.value === "") {
    element.classList.remove("is-valid", "is-invalid");
    field.isValid = false;
  }

  toggleAddBtn();
}

function toggleAddBtn() {
  if (
    regex.productName.isValid &&
    regex.productPrice.isValid &&
    regex.productCateogry.isValid &&
    regex.productDescription.isValid &&
    regex.productImage.isValid
  ) {
    addBtn.disabled = false;
  } else {
    addBtn.disabled = true;
  }
}
