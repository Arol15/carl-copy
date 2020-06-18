// root js file for client side js
window.addEventListener("DOMContentLoaded", (e) => {
  let sideBarOpener = document.querySelector(".side-bar-opener");
  let sideBar = document.querySelector(".side-bar");
  let favoriteButtons = document.querySelectorAll("span.favorite-click");
  let favoriteDiv = document.querySelector(".favorites");
  let createProjectBtn = document.querySelector(".project-new");
  let modal = document.getElementById("myModal");
  // Hides side bar
  sideBarOpener.addEventListener("click", (e) => {
    if (sideBar.getAttribute("class") === "side-bar") {
      sideBar.setAttribute("class", "side-bar side-bar__isCollapsed");
      sideBarOpener.innerHTML = "⇛";
    } else {
      sideBar.setAttribute("class", "side-bar");
      sideBarOpener.innerHTML = "⇚";
    }
  });

  // adds to favorites
  for (const favoriteButton of favoriteButtons) {
    favoriteButton.addEventListener("click", (e) => {
      let previousSiblingInnerHTML =
        favoriteButton.previousElementSibling.innerHTML;
      let node = document.createElement("p");
      node.appendChild(document.createTextNode(previousSiblingInnerHTML));
      node.setAttribute("class", `favorite-project`);
      node.setAttribute("id", previousSiblingInnerHTML);
      console.log(node);
      if (favoriteButton.getAttribute("class") === "favorite-click favorited") {
        favoriteButton.setAttribute("class", "favorite-click");
        favoriteButton.innerHTML = "☆";
        favoriteDiv.removeChild(
          document.getElementById(previousSiblingInnerHTML)
        );
      } else {
        favoriteDiv.appendChild(node);
        favoriteButton.setAttribute("class", "favorite-click favorited");
        favoriteButton.innerHTML = "★";
      }
    });
  }

  // Creates project
  createProjectBtn.addEventListener("click", (e) => {
    modal.style.display = "block";
  });
});
