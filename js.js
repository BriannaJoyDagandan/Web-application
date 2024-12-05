document.addEventListener("DOMContentLoaded", () => {
    const itemList = document.getElementById("item-list");
    const addItemBtn = document.getElementById("add-item-btn");
    const modal = document.getElementById("item-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    const itemForm = document.getElementById("item-form");
    const modalTitle = document.getElementById("modal-title");
    const itemIdField = document.getElementById("item-id");
    const itemNameField = document.getElementById("item-name");
    const itemDescriptionField = document.getElementById("item-description");

   
    function showModal(title, item = null) {
        modalTitle.textContent = title;
        if (item) {
            itemIdField.value = item.id;
            itemNameField.value = item.name;
            itemDescriptionField.value = item.description || "";
        } else {
            itemIdField.value = "";
            itemNameField.value = "";
            itemDescriptionField.value = "";
        }
        modal.style.display = "flex";
    }

    
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    addItemBtn.addEventListener("click", () => {
        showModal("Add Item");
    });

    itemForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = itemIdField.value;
        const name = itemNameField.value;
        const description = itemDescriptionField.value;

        if (id) {
         
            await fetch(`/api/items/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
        } else {
            
            await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
        }

        modal.style.display = "none";
        loadItems();
    });

    
    async function loadItems() {
        const response = await fetch("/api/items");
        const items = await response.json();
        itemList.innerHTML = items
            .map(
                (item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description || ""}</td>
                    <td>${item.date_created}</td>
                    <td>
                        <button onclick="editItem(${item.id})">Edit</button>
                        <button onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                </tr>
            `
            )
            .join("");
    }

    window.editItem = async (id) => {
        const response = await fetch(`/api/items/${id}`);
        const item = await response.json();
        showModal("Edit Item", item);
    };

    
    window.deleteItem = async (id) => {
        await fetch(`/api/items/${id}`, { method: "DELETE" });
        loadItems();
    };

    loadItems();
});
