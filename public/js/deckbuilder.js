$(document).ready(function () {
  // rightContainer holds all of our posts
  let rightContainer = $("#rightContainer");
  let leftContainer = $("#leftContainer");
  let cardFilterSelect = $("#filter");
  cardFilterSelect.on("change", handleFilterChange);
  let cards;
  let userCards;
  let cardTemp;
  let cardAdd;

  // Load first deck or create new one if none exists
  function newUserDeckCreate() {
    $.get("/api/check", function (data) {
      if(!data) {
        console.log("No decks detected, one has been created! " + data);
      } else {
        console.log("Deck exists! " + data);
      }
    });
  }

  // This function grabs posts from the database and updates the view
  function getCardsLeft(category) {
    let categoryString = category || "";
    if (categoryString) {
      // console.log('category changed');
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/cards/left" + categoryString, function (data) {
      // console.log("Mtgcards", data);
      cards = data;
      // console.log(cards);
      initializeRowsLeft();
    });
  }

  function getCardsRight() {
    $.get("/api/cards/right", function (data) {
      // console.log("Usercards", data);
      userCards = data[0].Usercards;
      // console.log("Returned Data: " , data[0].Usercards);
      initializeRowsRight();
    });
  }

  function addCardRight(card) {
    $.get("/api/cards/" + card, function (data) {
      cardAdd = JSON.stringify(data);
      console.log("Card to add: " + cardAdd);
      $.post("/api/cards/card", data);
      location.reload();
    });
  }

  $('#leftContainer').on('click', '.dc_card', function (event) {
    event.preventDefault();
    addCardRight($(this).attr("id"));
  });

  newUserDeckCreate();
  getCardsLeft();
  getCardsRight();

  function initializeRowsLeft() {
    leftContainer.empty();
    let cardsToAdd = [];
    for (let i = 0; i < cards.length; i++) {
      cardsToAdd.push(createNewRow(cards[i]));
    }
    leftContainer.append(cardsToAdd);
  }

  function initializeRowsRight() {
    rightContainer.empty();
    cardsTemp = [];
    for (let i = 0; i < userCards.length; i++) {
      cardsTemp.push(createNewRowRight(userCards[i].card_id,userCards[i].card_qnty));
    }
    rightContainer.append(cardsTemp);
  }

  // This function constructs a card's HTML
  function createNewRow(post) {
    let newCard = $("<div>");
    let newBody = $("<img>");

    newCard.attr({
      "id": post.id,
      "class": "dc_point dc_card dc_ib"
    });
    newBody.attr({
      "src": post.card_image_url,
      "width": "180",
      "style": "height:251px !important",
      "class": "lazy dc_cardpict",
      "title": post.card_name
    });
    newCard.append(newBody);
    newCard.data("post", post);
    return newCard;
  }

  // This function constructs a card's HTML
  function createNewRowRight(post,qnty) {
    let newCard = $("<div>");
    let newBody = $("<strong>");

    newCard.attr({
      "class": "dc_cname dc_ccc dc_ib"
    });
    $.get("/api/cards/" + post, function (data) {
      // console.log("Mtgcards", data);
      cardTemp = data.card_name;
      newBody.text(cardTemp + " " + qnty);
    });
    console.log(post);
    newCard.append(newBody);
    // newCard.data("post", post);
    return newCard;
  }

  // This function handles reloading new posts when the filter changes
  function handleFilterChange() {
    let newPostCategory = $(this).val();
    getCardsLeft(newPostCategory);
  }

});