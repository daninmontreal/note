let $balance;
let $incomeTotal;
let $outcomeTotal;
let $income;
let $expense;
let $all;
let $incomeList;
let $expenseList;
let $allList;

let $expenseBtn;
let $incomeBtn;
let $allBtn;

let $addExpense;
let $expenseTitle;
let $expenseAmount;

let $addIncome;
let $incomeTitle;
let $incomeAmount;

let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;

function show($element){
    $element.removeClass("hide");
}


function hide( elements ){
    elements.forEach(($e)=>{
      $e.addClass("hide");
    });
}

function active($element){
    $element.addClass("active");
}

function inactive( elements ){
    elements.forEach( $element => {
        $element.removeClass("active");
    })
}

function clearElement(elements){
    elements.forEach( $element => {
        $element.html("");
    })
}

function showEntry($list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    $list.prepend(entry);
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        $incomeAmount.val(ENTRY.amount);
        $incomeTitle.val(ENTRY.title);
    }else if(ENTRY.type == "expense"){
        $expenseAmount.val(ENTRY.amount);
        $expenseTitle.val(ENTRY.title);
    }

    deleteEntry(entry);
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);
    updateUI();
}

function updateUI(){
    //console.log(ENTRY_LIST);
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    let sign = (income >= outcome) ? "$" : "-$";
    
    $balance.html(`<small>${sign}</small>${balance}`);
    $outcomeTotal.html(`<small>$</small>${outcome}`);
    $incomeTotal.html(`<small>$</small>${income}`);

    clearElement([$expenseList, $incomeList, $allList]);

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry($expenseList, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry($incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry($allList, entry.type, entry.title, entry.amount, index)
    });

    
   localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function clearInput(es) {
    es.forEach(($e)=>{
       $e.val("");
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}


$(()=>{

    ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];

    $balance = $(".balance .value");
    $incomeTotal = $(".income-total");
    $outcomeTotal = $(".outcome-total");
    
    $income = $("#income");
    $expense = $("#expense");
    $all = $("#all");

    $incomeList = $("#income .list");
    $expenseList = $("#expense .list");
    $allList = $("#all .list");

    $expenseBtn = $(".tab1");
    $incomeBtn = $(".tab2");
    $allBtn = $(".tab3");

    $expenseBtn.on("click", (e)=>{
        console.log("expense clicked");
        show($expense);
        hide([$income, $all]);
        active($expenseBtn);
        inactive([$incomeBtn, $allBtn]);
        
    });

    $incomeBtn.on("click", (e)=>{
        show($income);
        hide([$expense, $all]);
        active($incomeBtn);
        inactive([$expenseBtn, $allBtn]);
        
    });

    $allBtn.on("click", (e)=>{
        show($all);
        hide([$income, $expense]);
        active($allBtn);
        inactive([$incomeBtn, $expenseBtn]);
        
    });

    $addExpense = $("#add-expense");
    $expenseTitle = $("#expense-title-input");
    $expenseAmount = $("#expense-amount-input");

    $addIncome = $("#add-income");
    $incomeTitle = $("#income-title-input");
    $incomeAmount = $("#income-amount-input");

    $addExpense.on("click", (e)=>{
        if(!$expenseTitle.val() || !$expenseAmount.val()){
            return;
        }

        ENTRY_LIST.push({
            type:"expense",
            title:$expenseTitle.val(),
            amount: parseInt($expenseAmount.val())
        })

        updateUI();
        clearInput([$expenseTitle, $expenseAmount]);
    });

    $addIncome.on("click", (e)=>{
        if(!$incomeTitle.val() || !$incomeAmount.val()){
            return;
        }

        ENTRY_LIST.push({
            type:"income",
            title:$incomeTitle.val(),
            amount: parseInt($incomeAmount.val())
        })

        updateUI();
        clearInput([$incomeTitle, $incomeAmount]);
    });

    let editOrDel = (event) => {
        const DELETE = "delete", EDIT = "edit";
        const targetBtn = event.target;

        const entry = targetBtn.parentNode;

        if (targetBtn.id == DELETE) {
            deleteEntry(entry);
        } else if (targetBtn.id == EDIT) {
            editEntry(entry);
        }
    }

    $incomeList.on("click", editOrDel);
    $expenseList.on("click", editOrDel);
    $allList.on("click", editOrDel);

    updateUI();

});