function g(e) {
  return document.getElementById(e);
}
function refresh(gameID) {
  const baseUrl = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameID}/scores/`;
  fetch(baseUrl)
    .then((response) => response.json())
    .then((json) => {
      g('_scores').innerHTML = '';
      const scores = json.result;
      for (let o = 0; o < scores.length; o += 1) {
        const score = scores[o];
        const template = document.createElement('template');
        template.innerHTML = `<tr class="table__row">
            <td class="table__cell">
              ${score.user}
            </td>
            <td class="table__cell">
              ${score.score}
            </td>
          </tr>`;
        g('_scores').appendChild(template.content.firstChild);
      }
    });
}
g('refresh').addEventListener('click', () => {
  if (localStorage.getItem('gameID') !== null) {
    refresh(localStorage.getItem('gameID'));
  }
});
function init() {
  if (localStorage.getItem('gameID') == null) {
    fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
      method: 'POST',
      body: JSON.stringify({
        name: 'FooBar',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const str = json.result;
        const slug = str.substr(13, 21);
        localStorage.setItem('gameID', slug);
      });
  }
  else {
    refresh(localStorage.getItem('gameID'));
  }
  g('sub_btn').addEventListener('click', (event) => {
    event.preventDefault();
    const form = new FormData(g('_form'));
    const formData = {};
    for (const pair of form.entries()) {
      formData[pair[0]] = pair[1];
    }
    fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${localStorage.getItem('gameID')}/scores/`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json());
  });
}
init();
//# sourceMappingURL=index.js.map