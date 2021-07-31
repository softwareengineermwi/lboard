const getID = (e) => document.getElementById(e);
const refresh = async (gameID) => {
  const baseUrl = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameID}/scores/`;
  await fetch(baseUrl)
    .then((response) => response.json())
    .then((json) => {
      getID('_scores').innerHTML = '';
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
        getID('_scores').appendChild(template.content.firstChild);
      }
    });
};
getID('refresh').addEventListener('click', async () => {
  if (localStorage.getItem('gameID') !== null) {
    await refresh(localStorage.getItem('gameID'));
  }
});
const init = async () => {
  if (localStorage.getItem('gameID') == null) {
    await fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
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
  } else {
    await refresh(localStorage.getItem('gameID'));
  }
  getID('sub_btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const form = new FormData(getID('_form'));
    const formData = {};
    const entries = form.entries();
    entries.forEach((pair) => {
      const [key, value] = pair;
      formData[key] = value;
    });
    await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${localStorage.getItem('gameID')}/scores/`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json());
  });
};
init();
