// Sample group of members
let members = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
];

// Initialize member checkboxes dynamically
const membersContainer = document.getElementById('members');
members.forEach(member => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `member-${member.id}`;
    checkbox.value = member.id;

    const label = document.createElement('label');
    label.htmlFor = `member-${member.id}`;
    label.textContent = member.name;

    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(label);
    membersContainer.appendChild(div);
});

// Handle the calculation
function calculateAmount() {
    const spentAmount = parseFloat(document.getElementById('spentAmount').value);
    if (isNaN(spentAmount) || spentAmount <= 0) {
        alert('Please enter a valid amount spent.');
        return;
    }

    // Get selected members
    const selectedMembers = [];
    members.forEach(member => {
        const checkbox = document.getElementById(`member-${member.id}`);
        if (checkbox.checked) {
            selectedMembers.push(member);
        }
    });

    if (selectedMembers.length === 0) {
        alert('Please select at least one member.');
        return;
    }

    // Calculate how much each person needs to pay
    const totalPeople = selectedMembers.length;
    const amountPerPerson = (spentAmount / totalPeople).toFixed(2);

    // Display the result
    let resultMessage = `<strong>${selectedMembers[0].name}</strong> spent $${spentAmount}.<br>`;
    resultMessage += 'Each selected person should pay: $' + amountPerPerson + '<br><br>';
    resultMessage += 'Payment breakdown:<br>';

    selectedMembers.forEach(member => {
        if (member.id !== selectedMembers[0].id) {
            resultMessage += `${member.name} needs to pay $${amountPerPerson} to ${selectedMembers[0].name}<br>`;
        }
    });

    document.getElementById('message').innerHTML = resultMessage;
}
