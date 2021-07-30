function g(e) {
    return document.getElementById(e);
}
g('refresh').addEventListener('click', () => {
    location.reload();
});
function init() {
    if (localStorage.getItem('gameID') == null) {
        fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
            method: 'POST',
            body: JSON.stringify({
                name: 'FooBar'
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .then((res) => res.json())
            .then((json) => {
            const str = json.result;
            console.log(str);
            const slug = str.substr(13, 21);
            localStorage.setItem("gameID", slug);
            location.reload();
        });
    }
    const baseUrl = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${localStorage.getItem('gameID')}/scores/`;
    g('sub_btn').addEventListener('click', (event) => {
        event.preventDefault();
        const form = new FormData(g("_form"));
        const formData = {};
        for (let pair of form.entries()) {
            formData[pair[0]] = pair[1];
        }
        fetch(baseUrl, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    });
    fetch(baseUrl)
        .then((response) => response.json())
        .then((json) => {
        const scores = json.result;
        for (let o = 0; o < scores.length; o++) {
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
onload = init();
//# sourceMappingURL=index.js.map