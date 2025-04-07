//Seleciona os elementos do formulario
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

//Seleciona os elementos da lista
const expenseList = document.querySelector('ul');
const expensesTotal = document.querySelector('aside header h2');
const expensesQuantity = document.querySelector('aside header p span');

//Captura o evento de input para formatar o valor
amount.oninput = () => {
  //Obtem o valor atual do input e remove os caracteres não numericos
  let value = amount.value.replace(/\D/g, '');

  //Tranformar o valor em centavos
  value = Number(value) / 100;

  //Atualiza o valor do input
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  //Formata o valor no padrão BTL (Real brasileiro)
  value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return value;
}

//Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  //Previne o comportamento padrão de recarregar a pagina
  event.preventDefault();
  const newExpense = {
    //Cria um objeto com os detalhes da nova despesa
    id: new Date().getTime,
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  //Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense);
};

//Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    //Cria o elemento de li para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement('li');
    expenseItem.classList.add('expense');

    //Cria o elemento da categoria.
    const expenseIcon = document.createElement('img');
    expenseIcon.setAttribute('src', `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute('alt', newExpense.category_name);

    //Cria a info da despesa.
    const expenseInfo = document.createElement('div');
    expenseInfo.classList.add('expense-info');

    //Cria o nome da despesa.
    const expenseName = document.createElement('strong');
    expenseName.textContent = newExpense.expense;

    //Cria a categoria da despesa.
    const expenseCategory = document.createElement('span');
    expenseCategory.textContent = newExpense.category_name;

    //Adiciona nome e categoria na div das informações das despesa.
    expenseInfo.append(expenseName, expenseCategory);

    //Cria o valor da despesa.
    const expenseAmount = document.createElement('span');
    expenseAmount.classList.add('expense-amount');
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace('R$', '')}`;

    //Adiciona o item na lista.
    expenseItem.append(expenseIcon);

    //Cria o incone de remover
    const removeIcon = document.createElement('img');
    removeIcon.classList.add('remove-icon');
    removeIcon.setAttribute('src', './img/remove.svg');
    removeIcon.setAttribute('alt', 'remover');

    //Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    //Adiciona o item na lista.
    expenseList.append(expenseItem);

    //Limpa o formulário para adicionar um novo item.
    formClear();

    //Atualiza os totais
    updateTotals();
  } catch (error) {
    alert('Não foi possivel atualizar a lista de despesas.');
    console.log(error);
  }
}

//Atualizar os totais.
function updateTotals() {
  try {
    //Recupera todos os itens (li) da lista (ul).
    const items = expenseList.children;

    //Atualizar a quantidade de itens da lista.
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? 'despesas' : 'despesa'
    }`;

    //Variavel para incrementar o total.
    let total = 0;

    //Percorre os itens(li) da lista(ul).
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector('.expense-amount');
      //Remove caracteres não numericos e substitui a virgula peelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, '')
        .replace(',', '.');

      //Converte o valor para float.
      value = parseFloat(value);

      //Verifica se é um numero válido.
      if (isNaN(value)) {
        return alert(
          'Não foi possivel calcular o total! O valor não parce ser um numero.'
        );
      }

      //Incrementa o valor total.
      total += Number(value);
    }

    //Cria a span para adicionar o R$ formatado.
    const symbolBRL = document.createElement('small');
    symbolBRL.textContent = 'R$';

    //Formata o valor e remove o R$ que será exibidop pelo small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace('R$', '');

    //Limpa o conteudo do elemento.
    expensesTotal.innerHTML = '';

    //Adiciona o simbolo da moeda e o valor total formatado.
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert('Não foi possivel atualizar os totais.');
  }
}

//Evento que captura o clique nos itens da lista.
expenseList.addEventListener('click', function (event) {
  //Verificar se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains('remove-icon')) {
    //Obtém a li pasi do elemento clicado.
    const item = event.target.closest('.expense');
    //Remove item da lista.
    item.remove();
  }
  //Atualiza os totais.
  updateTotals();
});

function formClear() {
  //Limpa os inputs.
  expense.value = '';
  category.value = '';
  amount.value = '';

  //Coloca o foco no input de amount.
  expense.focus();
}
