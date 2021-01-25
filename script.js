let questionsMap = {};

// start game listener calls the function callApi()
document.querySelector('button').addEventListener('click', async function() {
	document.querySelector('#game').innerHTML = '';
	await callApi();
	document.querySelector('button').innerText = 'Restart Game';
});

// gets data from api and then uses that to call genHTML()
async function callApi() {
	const data = await axios.get('https://jservice.io/api/categories/', { params: { count: 100 } });
	const categories = data.data;
	let sixRandNumbsList = [];
	while (sixRandNumbsList.length !== 6) {
		sixRandNumbsList.push(Math.floor(Math.random() * 100));
	}
	let sixCats = [];
	for (let nums of sixRandNumbsList) {
		const catId = categories[nums].id;
		let clues = await axios.get('https://jservice.io/api/clues', { params: { category: catId } });
		sixCats.push(clues.data);
	}
	genHTML(sixCats);
}

// generates the HTML by calling genHead() and genBody()
function genHTML(data) {
	const gameDiv = document.querySelector('#game');
	const cols = 6;
	const questionsPerCol = 5;
	genBody(questionsPerCol, cols, gameDiv, data);
}

function genBody(questionsPerCol, cols, gameDiv, data) {
	for (let col = 0; col < cols; col++) {
		let colDiv = document.createElement('div');
		colDiv.style.display = 'flex';
		colDiv.style.flexDirection = 'column';
		colDiv.classList.add('col-2', `bg-blue`, 'justify-content-between');
		let headDiv = document.createElement('div');
		headDiv.setAttribute(
			'style',
			'height: 8vh; padding: 10px; overflow: auto; text-align: center; color: black; font-size: 20px; display: flex; justify-content: center; align-items: center;'
		);
		headDiv.setAttribute('class', 'border row bg-info');
		headDiv.innerText = data[col][0].category.title.toUpperCase();
		colDiv.append(headDiv);
		for (let quest = 0; quest < questionsPerCol; quest++) {
			let questionDiv = document.createElement('div');
			questionDiv.setAttribute(
				'style',
				'height: 16vh; padding: 10px; overflow: auto; text-align: center; display: flex; justify-content: center; align-items: center;'
			);
			questionDiv.setAttribute('class', 'border row bg-primary question');
			questionDiv.setAttribute('id', `${col}-${quest}-0`);
			let question = data[col][quest].question;
			let answer = data[col][quest].answer;
			questionsMap[`${col}-${quest}-1`] = question;
			questionsMap[`${col}-${quest}-2`] = answer;
			questionDiv.innerText = '?';
			colDiv.append(questionDiv);
		}
		gameDiv.append(colDiv);
	}
}

document.querySelector('#game').addEventListener('click', function(event) {
	if ($(event.target).hasClass('question')) {
		console.log(event.target.id);
		if (event.target.id.slice(-2) === '-0') {
			let newBaseId = event.target.id.slice(0, -2);
			event.target.innerText = questionsMap[`${newBaseId}-1`];
			event.target.id = `${newBaseId}-1`;
		} else if (event.target.id.slice(-2) === '-1') {
			let newBaseId = event.target.id.slice(0, -2);
			event.target.innerText = questionsMap[`${newBaseId}-2`];
			event.target.id = `${newBaseId}-2`;
		}
	}
});
