// Gives out a loan of 5 that's added to the player's money
function loan() {
  var money = document.getElementById("money").innerHTML;
  var debt = document.getElementById("debt").innerHTML;
  if (money < 1) {
    var loan = 5;
    money = parseFloat(money) + parseInt(loan);
    document.getElementById("money").innerHTML = money;

    debt = parseFloat(debt) + parseInt(loan);
    document.getElementById("debt").innerHTML = debt;
  }
}

// Pays player's loan back
function pay() {
  var money = document.getElementById("money").innerHTML;
  var debt = document.getElementById("debt").innerHTML;
  money = parseFloat(money);
  debt = parseFloat(debt);

  if (money < debt) {
    debt = parseFloat(debt) - parseFloat(money);
    document.getElementById("debt").innerHTML = debt;
    document.getElementById("money").innerHTML = 0;
  } else if (money > debt || money == debt) {
    debt = parseFloat(debt) - parseFloat(money);
    money = Math.abs(debt);
    document.getElementById("debt").innerHTML = 0;
    document.getElementById("money").innerHTML = money;
  }
}
