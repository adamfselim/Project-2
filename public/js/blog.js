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
  
    // This function grabs posts from the database and updates the view
    function getCardsLeft(category) {
      let categoryString = category || "";
      if (categoryString) {
        // console.log('category changed');
        categoryString = "/category/" + categoryString;
      }
      $.get("/api/posts/left" + categoryString, function (data) {
        // console.log("Mtgcards", data);
        cards = data;
        // console.log(cards);
        initializeRowsLeft();
      });
    }
  
    function getCardsRight() {
      $.get("/api/posts/right", function (data) {
        // console.log("Usercards", data);
        userCards = data;
        initializeRowsRight();
      });
    }
  
    function addCardRight(card) {
      $.get("/api/posts/" + card, function (data) {
        cardAdd = JSON.stringify(data);
        console.log("Card to add: " + cardAdd);
        $.post("/api/posts/card", data);
      });
    }
  
    $('#leftContainer').on('click', '.dc_card', function (event) {
      event.preventDefault();
      addCardRight($(this).attr("id"));
    });
  
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
      let cardsTemp = [];
      let cardsToAdd = JSON.parse(userCards[0].deck_list);
      // console.log(cardsToAdd);
      // console.log('Rows Right ' + userCards[0].deck_list);
      for (let i = 0; i < cardsToAdd.length; i++) {
        cardsTemp.push(createNewRowRight(cardsToAdd[i].id));
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
        "title": "Welcome to the Jungle"
      });
      newCard.append(newBody);
      newCard.data("post", post);
      return newCard;
    }
  
    // This function constructs a card's HTML
    function createNewRowRight(post) {
      let newCard = $("<div>");
      let newBody = $("<strong>");
  
      newCard.attr({
        "class": "dc_cname dc_ccc dc_ib"
      });
      $.get("/api/posts/" + post, function (data) {
        // console.log("Mtgcards", data);
        cardTemp = data.card_name;
        newBody.text(cardTemp);
      });
      newCard.append(newBody);
      newCard.data("post", post);
      return newCard;
    }
  
    // This function handles reloading new posts when the filter changes
    function handleFilterChange() {
      let newPostCategory = $(this).val();
      getCardsLeft(newPostCategory);
    }
  
  });