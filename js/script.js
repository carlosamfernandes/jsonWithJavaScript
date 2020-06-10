/* 
Estado da aplicação (state)
 */
let tabResults = null;
let tabStatistics = null;
let allPeople = [];
let selectedPeople = [];
let countMale = 0;
let countFemale = 0;
let sumAges = 0;
let averageAge = 0;
let searchButton = document.querySelector('#search-button');
let searchField = document.querySelector('#search-field');

window.addEventListener('load', () => {
  tabResults = document.querySelector('#tabResults');
  tabStatistics = document.querySelector('#tabStatistics');

  fetchPeople();
  render();
});

//ver por ultimo
function render() {
  renderPeople();
  handleSearchField();
  renderStatistics();
  cleanAll();
}

//ok
async function fetchPeople() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();

  allPeople = json.results.map((person) => {
    const { name, dob, gender, picture } = person;

    return {
      name: `${name.first} ${name.last}`,
      age: dob.age,
      gender: gender,
      picture: picture.medium,
    };
  });
  render();
}

//ok
function renderPeople() {
  let peopleHTML = `<div> <div>${selectedPeople.length} usuário(s) encontrado(s)</div>`;

  selectedPeople.forEach((person) => {
    const { picture, name, age, gender } = person;
    const personHTML = `
          <div class='person'>
            <div>
              <img src="${picture}" alt="${name} picture">
            </div>
            <div>
            <span>${name}, ${age} anos</span>
          </div>  
        `;
    peopleHTML += personHTML;
  });
  peopleHTML += '</div>';
  tabResults.innerHTML = peopleHTML;
}
//ok
function searchPeople(typedName) {
  typedName = searchField.value.toLowerCase();
  selectedPeople = allPeople.filter(
    (person) => person.name.toLowerCase().indexOf(typedName) >= 0
  );
  // Ordem Alfabética (ordering)
  selectedPeople = selectedPeople.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  render();
  return selectedPeople;
}

//ok
function handleSearchField() {
  searchField.addEventListener('keyup', searchPeople);
  searchButton.addEventListener('click', searchPeople);
}

//ok
function runStatistics() {
  sumAges = selectedPeople.reduce((acc, current) => {
    return acc + current.age;
  }, 0);
  averageAge = new Intl.NumberFormat('pt-BR').format(
    sumAges / selectedPeople.length
  );

  let male = selectedPeople.filter((person) => {
    return person.gender === 'male';
  });
  countMale = male.length;

  let female = selectedPeople.filter((person) => {
    return person.gender === 'female';
  });
  countFemale = female.length;
}

//ok
function renderStatistics() {
  runStatistics();

  const statisticsHTML = `
    <div>
        <div>Estatísticas</div>
        <div class='statistics'>
            <div>
                <span>Male: ${countMale}</span>
                <span>Female: ${countFemale}</span>
            </div>
            <div>
                <span>Sum of ages: ${sumAges}</span>
                <span>Avarage age: ${averageAge}</span>
            </div> 
        </div> 
    `;
  tabStatistics.innerHTML = statisticsHTML;
}

function cleanAll() {
  if (!searchField.value) {
    tabResults.innerHTML = '';
    tabStatistics.innerHTML = '';
  }
}
