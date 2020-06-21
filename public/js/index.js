

// root js file for client side js
window.addEventListener("DOMContentLoaded", (e) => {
  let sideBarOpener = document.querySelector(".side-bar-opener");
  let sideBar = document.querySelector(".side-bar");
  let favoriteButtons = document.querySelectorAll("span.favorite-click");
  let favoriteDiv = document.querySelector(".favorites");
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
      // console.log(node);
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
  let createProjectBtn = document.querySelector(".project-new");
  let createModal = document.getElementById("createModal");
  createProjectBtn.addEventListener("click", (e) => {
    createModal.style.display = "block";
  });

  // Deletes Project
  // const deleteConfirmation = document.querySelector('.delete-confirmation')
  // const deleteButtons = document.querySelectorAll('.delete-button')
  // const deleteModal = document.getElementById('deleteModal');
  // for (const deleteButton of deleteButtons) {
  //   deleteButton.addEventListener('click', e => {
  //     e.target.nextSibling.style.display = "block"
  //     console.log(e.target)
  //     console.log(e.target.nextSibling)
  //     e.preventDefault();
  //   })
  // }

  // // Edit project
  // const editConfirmation = document.querySelector('.edit-confirmation')
  // const editButtons = document.querySelectorAll('.edit-button')
  // for (const editButton of editButtons) {
  //   editButton.addEventListener('click', e => {
  //     e.target.nextSibling.style.display = "block"

  //     e.preventDefault();
  //   })
  // }
});
