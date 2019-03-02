$(document).ready(function () {
  // rightContainer holds all of our posts
  let rightContainer = $("#rightContainer");
  let leftContainer = $("#leftContainer");
  let postCategorySelect = $("#category");
  postCategorySelect.on("change", handleCategoryChange);
  let cards;

  // This function grabs posts from the database and updates the view
  function getPosts(category) {
    let categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts/left" + categoryString, function (data) {
      console.log("Posts", data);
      cards = data;
      initializeRowsLeft();
    });
  }

  // Getting the initial list of posts
  getPosts();
  // InitializeRows handles appending all of our constructed post HTML inside
  // leftContainer
  function initializeRowsLeft() {
    leftContainer.empty();
    let cardsToAdd = [];
    for (let i = 0; i < cards.length; i++) {
      cardsToAdd.push(createNewRow(cards[i]));
    }
    leftContainer.append(cardsToAdd);
  }

  // This function constructs a card's HTML
  function createNewRow(post) {
    let newCard = $("<div>");
    let newBody = $("<img>");

    newCard.attr({
      "id":post.id,
      "class":"dc_point dc_card dc_ib"
    });

    newBody.attr({
      "src":post.card_image_url,
      "width":"180",
      "style":"height:251px !important",
      "class":"lazy dc_cardpict",
      "title":"Welcome to the Jungle"
    });

    newCard.append(newBody);
    newCard.data("post", post);
    return newCard;
  }

  // This function handles reloading new posts when the category changes
  function handleCategoryChange() {
    let newPostCategory = $(this).val();
    getPosts(newPostCategory);
  }

});
