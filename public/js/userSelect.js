document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('userInput');
  const suggestionsBox = document.getElementById('suggestions');
  const hiddenId = document.getElementById('userId');

  const users = window.userList || [];

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    suggestionsBox.innerHTML = '';
    hiddenId.value = ''; // clear userId on input

    // If the input is empty, do not show suggestions

    if (!query) return;

    const matches = users.filter(user =>
      user.username.toLowerCase().includes(query)
    ).slice(0, 10);

    matches.forEach(user => {
      const div = document.createElement('div');
      div.className = 'suggestion';
      div.textContent = user.username;
      div.onclick = () => {
        input.value = user.username;
        hiddenId.value = user.id;
        suggestionsBox.innerHTML = '';
      }
      suggestionsBox.appendChild(div);
    });
  });
});