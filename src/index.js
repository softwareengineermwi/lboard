const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const getID = (e) => document.getElementById(e);
const refresh = (gameID) => __awaiter(this, void 0, void 0, function* () {
  const baseUrl = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameID}/scores/`;
  yield fetch(baseUrl)
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
});
getID('refresh').addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
  if (localStorage.getItem('gameID') !== null) {
    yield refresh(localStorage.getItem('gameID'));
  }
}));
const init = () => __awaiter(this, void 0, void 0, function* () {
  if (localStorage.getItem('gameID') == null) {
    yield fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
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
    yield refresh(localStorage.getItem('gameID'));
  }
  getID('sub_btn').addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const form = new FormData(getID('_form'));
    const formData = {};
    const entries = form.entries();
    entries.forEach((pair) => {
      const [key, value] = pair;
      formData[key] = value;
    });
    yield fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${localStorage.getItem('gameID')}/scores/`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json());
  }));
});
init();
