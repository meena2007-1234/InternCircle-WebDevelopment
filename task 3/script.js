const billingToggle = document.getElementById("billingToggle");

const prices = document.querySelectorAll(".amount");

billingToggle.addEventListener("change", function () {

    prices.forEach(function (price) {

        if (billingToggle.checked) {
            price.textContent = price.dataset.yearly;
        } else {
            price.textContent = price.dataset.monthly;
        }

    });

});