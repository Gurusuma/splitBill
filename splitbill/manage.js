

document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backButton");
    const groupTitle = document.getElementById("groupTitle");
    const memberNameInput = document.getElementById("memberName");
    const expenseAmountInput = document.getElementById("expenseAmount");
    const payerSelect = document.getElementById("payerSelect");
    const memberList = document.getElementById("memberList");
    const balanceList = document.getElementById("balanceList");
    const errorMessageMember = document.createElement("span");
    const errorMessageExpense = document.createElement("span");

    // Load the current group
    const currentGroup = JSON.parse(localStorage.getItem("currentGroup"));

    if (currentGroup) {
        groupTitle.innerText = currentGroup.name;

        // Add Member
        const addMemberBtn = document.getElementById("addMemberBtn");
        addMemberBtn.addEventListener("click", () => {
            const memberName = memberNameInput.value.trim();

            // Check if the member name is not empty
            if (!memberName) {
                // Create error message if empty
                if (!document.getElementById("error-message-member")) {
                    errorMessageMember.id = "error-message-member";
                    errorMessageMember.textContent = "Please fill this field.";
                    errorMessageMember.classList.add("text-red-500", "text-sm");
                    memberNameInput.classList.add("border-red-500");
                    memberNameInput.parentElement.appendChild(errorMessageMember);
                }
            } else {
                // Clear error if valid input
                errorMessageMember.remove();
                memberNameInput.classList.remove("border-red-500");

                // Add member
                currentGroup.members.push({ name: memberName, balance: 0 });
                localStorage.setItem("currentGroup", JSON.stringify(currentGroup));
                memberNameInput.value = "";
                updateMemberList();
                updatePayerSelect();
                updateBalanceSheet();
            }
        });

        // Add Expense
        const addExpenseBtn = document.getElementById("addExpenseBtn");
        addExpenseBtn.addEventListener("click", () => {
            const expenseAmount = parseFloat(expenseAmountInput.value.trim());
            const payer = payerSelect.value;

            // Validate expense amount and payer
            if (!expenseAmount || isNaN(expenseAmount)) {
                // Create error message if not a number
                if (!document.getElementById("error-message-expense")) {
                    errorMessageExpense.id = "error-message-expense";
                    errorMessageExpense.textContent = "Please enter only numbers.";
                    errorMessageExpense.classList.add("text-red-500", "text-sm");
                    expenseAmountInput.classList.add("border-red-500");
                    expenseAmountInput.parentElement.appendChild(errorMessageExpense);
                }
            } else if (!payer) {
                // Create error message if no payer selected
                alert("Please select a payer.");
            } else {
                // Clear error if valid input
                errorMessageExpense.remove();
                expenseAmountInput.classList.remove("border-red-500");

                // Add expense
                currentGroup.expenses.push({ amount: expenseAmount, paidBy: payer });
                localStorage.setItem("currentGroup", JSON.stringify(currentGroup));
                expenseAmountInput.value = "";
                payerSelect.value = "";
                updateBalanceSheet();
            }
        });

        // Update Member List (Display added members)
        function updateMemberList() {
            memberList.innerHTML = "";
            currentGroup.members.forEach((member, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("flex", "justify-between", "items-center");

                const memberName = document.createElement("span");
                memberName.textContent = member.name;
                listItem.appendChild(memberName);

                // Cross Symbol for Deleting Member
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("text-red-500", "text-2xl", "font-bold");
                deleteBtn.textContent = "×";
                deleteBtn.addEventListener("click", () => {
                    deleteMember(index);
                });

                listItem.appendChild(deleteBtn);
                memberList.appendChild(listItem);
            });
        }

        // Delete Member
        function deleteMember(index) {
            currentGroup.members.splice(index, 1);
            localStorage.setItem("currentGroup", JSON.stringify(currentGroup));
            updateMemberList();
            updatePayerSelect();
            updateBalanceSheet();
        }

        // Update Payer Select (Populate the payer dropdown)
        function updatePayerSelect() {
            payerSelect.innerHTML = '<option value="">Select Payer</option>'; // Reset dropdown
            currentGroup.members.forEach(member => {
                const option = document.createElement("option");
                option.value = member.name;
                option.textContent = member.name;
                payerSelect.appendChild(option);
            });
        }

        // Update Balance Sheet
        function updateBalanceSheet() {
            balanceList.innerHTML = "";
            let totalExpense = 0;

            // Calculate total expense
            currentGroup.expenses.forEach(exp => totalExpense += exp.amount);

            const equalShare = totalExpense / currentGroup.members.length;
            const balances = [];

            // Calculate individual member balances
            currentGroup.members.forEach(member => {
                let balance = currentGroup.expenses.reduce((acc, expense) => {
                    if (expense.paidBy === member.name) {
                        return acc + expense.amount;
                    }
                    return acc;
                }, 0);

                // Calculate how much they owe or are owed
                balance = balance - equalShare;
                balances.push({ member, balance });
            });

            // Display balance sheet
            balances.forEach(balance => {
                if (balance.balance > 0) {
                    // If balance > 0, they are owed money
                    balanceList.innerHTML += `<li>${balance.member.name}: Owes ${balance.balance.toFixed(2)} from the group.</li>`;
                } else if (balance.balance < 0) {
                    // If balance < 0, they owe money
                    balanceList.innerHTML += `<li>${balance.member.name}: Owes ${Math.abs(balance.balance).toFixed(2)} to ${currentGroup.expenses[0].paidBy}</li>`;
                } else {
                    // If balance == 0, they don't owe or are owed anything
                    balanceList.innerHTML += `<li>${balance.member.name}: No amount owed.</li>`;
                }
            });
        }

        // Back Button
        backButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });

        // Initial updates
        updateMemberList();
        updatePayerSelect();
        updateBalanceSheet();
    }
});


