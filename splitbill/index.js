document.addEventListener("DOMContentLoaded", () => {
    const createGroupBtn = document.getElementById("createGroupBtn");
    const groupNameInput = document.getElementById("groupName");
    const groupList = document.getElementById("groupList");
    

    // Load groups from LocalStorage
    function loadGroups() {
        const groups = JSON.parse(localStorage.getItem("groups")) || [];
        groupList.innerHTML = "";
        groups.forEach((group, index) => {
            const groupItem = document.createElement("div");
            groupItem.classList.add("bg-white", "p-4", "rounded", "shadow-md");

            // Group name
            const groupName = document.createElement("h3");
            groupName.classList.add("text-lg", "font-semibold");
            groupName.innerText = group.name;

            // Buttons
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("mt-4", "flex", "flex-col", "space-y-2");

            const manageButton = document.createElement("button");
            manageButton.classList.add("bg-green-500", "text-white", "p-2", "rounded");
            manageButton.innerText = "Next";
            manageButton.addEventListener("click", () => manageGroup(index));

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("bg-red-500", "text-white", "p-2", "rounded");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", () => deleteGroup(index));

            buttonContainer.appendChild(manageButton);
            buttonContainer.appendChild(deleteButton);

            groupItem.appendChild(groupName);
            groupItem.appendChild(buttonContainer);
            groupList.appendChild(groupItem);
        });
    }

    // Create Group
    createGroupBtn.addEventListener("click", () => {
        const groupName = groupNameInput.value.trim();
        if (groupName) {
            const groups = JSON.parse(localStorage.getItem("groups")) || [];
            groups.push({ name: groupName, members: [], expenses: [] });
            localStorage.setItem("groups", JSON.stringify(groups));
            groupNameInput.value = "";
            loadGroups();
        }
    });

    // Delete Group
    window.deleteGroup = (index) => {
        const groups = JSON.parse(localStorage.getItem("groups")) || [];
        groups.splice(index, 1);
        localStorage.setItem("groups", JSON.stringify(groups));
        loadGroups();
    };

    // Manage Group
    window.manageGroup = (index) => {
        const groups = JSON.parse(localStorage.getItem("groups")) || [];
        const group = groups[index];
        localStorage.setItem("currentGroup", JSON.stringify(group));
        window.location.href = "manage.html";
    };

    loadGroups();
});
