document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.getElementById('addUser');
  const userInput = document.getElementById('userInput');
  const blockedList = document.getElementById('blockedUsers');

  // Load and display blocked users
  chrome.storage.sync.get(['blockedUsers'], function (result) {
    const blockedUsers = result.blockedUsers || [];
    blockedUsers.forEach((user) => addUserToList(user));
  });

  // Add user to block list
  addButton.addEventListener('click', function () {
    const user = userInput.value.trim();
    if (user) {
      chrome.storage.sync.get(['blockedUsers'], function (result) {
        const blockedUsers = result.blockedUsers || [];
        if (!blockedUsers.includes(user)) {
          blockedUsers.push(user);
          chrome.storage.sync.set({ blockedUsers: blockedUsers }, function () {
            addUserToList(user);
            userInput.value = '';
          });
        }
      });
    }
  });

  function addUserToList(user) {
    const li = document.createElement('li');
    li.textContent = user;
    blockedList.appendChild(li);
  }
});
