$(document).ready(function () {
  // thedeck holds all of our posts
  let rightContainer = $("#thedeck");
  let leftContainer = $("#leftContainer");
  let cards;
  let userCards;
  let cardTemp;
  let cardAdd;

  // nicescroll!
  $(function () {
    $("#leftContainer").niceScroll();
  });

  // Load first deck or create new one if none exists
  function newUserDeckCreate() {
    $.get("/api/check", function (data) {
      if (!data) {
        console.log("No decks detected, one has been created! " + data);
      } else {
        console.log("Deck exists! " + data);
      }
    });
  }

  // This function grabs cards from the database and updates the view
  function getCardsLeft(category) {
    let categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/cards/left" + categoryString, function (data) {
      cards = data;
      initializeRowsLeft();
    });
  }

    // This function grabs cards from the database and updates the view
    function getCardsLeftSearch(search) {
      $.get("/api/cards/left/" + search, function (data) {
        cards = data;
        initializeRowsLeft();
      });
    }

  function getCardsRight() {
    $.get("/api/cards/right", function (data) {
      // console.log("Usercards", data);
      userCards = data[0].Usercards;
      console.log("Returned Data: ", data[0].Usercards);
      initializeRowsRight();
    });
  }

  function addCardRight(card) {
    $.get("/api/cards/" + card, function (data) {
      cardAdd = JSON.stringify(data);
      console.log("Card to add: " + cardAdd);
      $.post("/api/cards/add", data, function () {
        location.reload();
      });
    });
  }

  function removeCardRight(card) {
    $.post("/api/cards/remove/" + card, function () {
      location.reload();
    });
  }

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
      cardsTemp.push(createNewRowRight(userCards[i].card_id, userCards[i].card_qnty));
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
    // newCard.data("post", post);
    return newCard;
  }

  // This function constructs a card's HTML on the right column
  function createNewRowRight(post, qnty) {
    let newDiv = $("<div>");
    let newCard = $("<div>");
    let newBody = $("<strong>");
    let newBG = $("<div>");
    let newBG2 = $("<div>");
    let newCC = $("<div>");

    $.get("/api/cards/" + post, function (data) {
      // console.log("Mtgcards", data);
      let cardTemp = data.card_name;
      let cardImage = data.card_image_url;
      newBody.text(" " + qnty + " - " +cardTemp);
      newBG2.attr({
        "class": "dc_pict_overlay",
        "style": "background: url(" + cardImage +") 140% 25%; background-repeat: no-repeat; background-size: 80%;"
      });
      newCC.text(qnty);
      newCC.attr({
        "class": "dc_ccopies dc_ccc dc_ib",
        "style": "background-color:#447484"
      });
    });

    newDiv.attr({
      "class": "dc_drow dc_cardintext",
      "data": post
    });

    newCard.attr({
      "class": "dc_cname dc_ccc dc_ib",
      "data": post
    });

    newBG.attr({
      "class": "dc_grad_overlay",
      "style": "background: linear-gradient(100deg,rgba(191,182,107,1) 40%,rgba(0,0,0,0) 90%);"
    });
    newDiv.append(newBG).append(newBG2).append(newCard);
    newCard.append(newBody);
    // append(newCC).
    return newDiv;
  }

  // Events listeners!
  $('#leftContainer').on('click', '.dc_card', function (event) {
    event.preventDefault();
    addCardRight($(this).attr("id"));
  });

  $('#thedeck').on('click', '.dc_cname', function (event) {
    event.preventDefault();
    removeCardRight($(this).attr("data"));
  });

  $('#filter').on('click', '.btn-group', function (event) {
    console.log('button pushed!');
    // handleFilterChange(event);
    let newPostCategory = $(this).val();
    console.log(newPostCategory);
    getCardsLeft(newPostCategory);
  });

  $('.form-inline').submit(function(e) {
    e.preventDefault();
    console.log(e);
    let inputTemp = $('#topSearch').val();
    console.log(inputTemp);
    getCardsLeftSearch(inputTemp);
  });

  newUserDeckCreate();
  getCardsLeft();
  getCardsRight();

});