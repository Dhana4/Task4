import { EmployeeEntry } from './EmployeeentryModule/employeeEntry.js';
import { displayErrorMessage,clearErrorMessage } from "./EmployeeentryModule/functions.js";
let editRoleData = false;
let roleIdIfEdit: string | null = null;
let employee_array: EmployeeEntry[] = [];
let assignedEmployeeIds: string[] = [];
document.addEventListener('DOMContentLoaded', function () {
    const storedEmployees = (localStorage.getItem('employee_array'));
    if (storedEmployees) {
        employee_array = JSON.parse(storedEmployees) as EmployeeEntry[];
    }
    (document.getElementById('searchInput') as HTMLInputElement).addEventListener('input', function (event: Event) {
        const searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
        if (searchQuery.length > 0) {
            const filteredEmployees = employee_array.filter(employee => {
                return employee.name.toLowerCase().includes(searchQuery);
            })
            displayFilteredEmployees(filteredEmployees);
        }
        else {
            displayFilteredEmployees([]);
        }
    })
    const selectedRowAsString = localStorage.getItem("selectedRole");
    let selectedRowData: [string, string, string, string, string , string[]] | null = null;
    if (selectedRowAsString) {
        selectedRowData = JSON.parse(selectedRowAsString);
    }
    if (selectedRowData) {
        editRoleData = true;
        roleIdIfEdit = selectedRowData[0];
        (document.getElementById('roleName') as HTMLInputElement).value = selectedRowData[1];
        (document.getElementById('locationOfEmployee') as HTMLInputElement).value = selectedRowData[3];
        (document.getElementById('departmentOfEmployee') as HTMLInputElement).value = selectedRowData[2];
        (document.getElementsByTagName('textarea')[0] as HTMLTextAreaElement).value = selectedRowData[4];
        assignedEmployeeIds = selectedRowData[5];
        localStorage.removeItem('selectedRole');
    }

    const addRoleButton = document.getElementById("add-role-button") as HTMLButtonElement;
    if (editRoleData == true) {
        addRoleButton.innerText = "Update";
    }
    addRoleButton.addEventListener('click', addRole);

    const cancelButton = document.getElementById("cancel-button") as HTMLButtonElement;
    cancelButton.addEventListener("click", cancelAction);

    (document.getElementById('roleName') as HTMLInputElement).addEventListener('input', clearErrorMessage);

})
function addToAssignedEmployees(employeeId: string) {
    assignedEmployeeIds.push(employeeId);
}
function removeFromAssignedEmployees(employeeId: string) {
    const index = assignedEmployeeIds.indexOf(employeeId);
    if (index !== -1) {
        assignedEmployeeIds.splice(index, 1);
    }
}
function displayFilteredEmployees(filteredEmployees: EmployeeEntry[]) {
    const searchResultsDiv = document.getElementById('searchResults') as HTMLDivElement;
    searchResultsDiv.innerHTML = '';

    filteredEmployees.forEach(employee => {
        const row = document.createElement('div');
        row.style.display = "flex";
        row.style.border = "1px solid grey";
        row.style.padding = "1%";
        row.style.margin = "1%";
        row.style.width = "19rem";
        row.style.height = "3rem";
        const img = document.createElement('img');
        img.src = employee.profilePic;
        img.alt = 'Employee Image';
        img.style.width = '2.5rem';
        img.style.height = '2.5rem';
        img.style.borderRadius = "50%";
        img.style.padding = "2% 0 0 2%";
        row.appendChild(img);
        const spacer = document.createElement('div');
        spacer.style.width = '1rem';
        row.appendChild(spacer);

        const name = document.createElement('p');
        name.textContent = employee.name;
        name.style.padding = "2% 0 0 0";
        row.appendChild(name);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginLeft = 'auto';
        checkbox.style.marginRight = '.5rem';
        checkbox.style.accentColor = 'red';
        checkbox.style.width = '1.1rem';
        if(editRoleData == true){
            if (assignedEmployeeIds.includes(employee.empNo)) {
                checkbox.checked = true;
            }
        }
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                addToAssignedEmployees(employee.empNo);
            } else {
                removeFromAssignedEmployees(employee.empNo);
            }
        });
        row.appendChild(checkbox);

        searchResultsDiv.appendChild(row);
    });
}

function generateUniqueId() {
    return 'role_' + Date.now();
}

function addRole() {
    const roleNameInput = document.getElementById('roleName') as HTMLInputElement;
    const roleName = roleNameInput.value;
    const department = (document.getElementById('departmentOfEmployee') as HTMLInputElement).value;
    const location = (document.getElementById('locationOfEmployee') as HTMLInputElement).value;
    const description =(document.getElementsByTagName('textarea')[0] as HTMLTextAreaElement).value;
    let roleId = roleIdIfEdit;
    const rolePattern = /^[A-Z ]+$/i;
    let isError = false;
    if (!roleName.trim()) {
        displayErrorMessage(roleNameInput, 'Role Name is required');
        isError = true;
    }
    if (roleName.trim() && !roleName.match(rolePattern)) {
        displayErrorMessage(roleNameInput, 'Role Name should contain only alphabets');
        isError = true;
    }
    if (isError === false) {
        if (editRoleData === true) {
            for (let i = 0; i < roles_array.length; i++) {
                if (roles_array[i].id === roleIdIfEdit) {
                    roles_array.splice(i, 1);
                    break;
                }
            }
            var updateMessage = document.getElementById('update-message') as HTMLDivElement;
            updateMessage.style.display = 'block';
        }
        else {
            roleId = generateUniqueId();
            var successMessage = document.getElementById('success-message') as HTMLDivElement;
            successMessage.style.display = 'block';
        }
        const roleEntry = {
            id: roleId,
            roleName: roleName,
            department: department,
            location: location,
            status:"Active",
            description:description,
            assignedEmployees : assignedEmployeeIds
        }
        roles_array.push(roleEntry);
        assignedEmployeeIds.forEach(employeeId => {
            const employeeIndex = employee_array.findIndex(employee => employee.empNo === employeeId);
            if (employeeIndex !== -1) {
                employee_array[employeeIndex].role = roleName;
                employee_array[employeeIndex].department = department;
                employee_array[employeeIndex].location = location;
            }
        });
        saveEmployees();
        saveRoles();
        setTimeout(function () {
            if (editRoleData === true) {
                updateMessage.style.display = 'none';
            }
            else {
                successMessage.style.display = 'none';
            }
            window.location.href = "role.html";
        }, 1500);
    }
}

function initializeRoles() {
    const storedRoles = localStorage.getItem('roles_array');
    if (storedRoles) {
        return JSON.parse(storedRoles);
    } else {
        return [];
    }
}
let roles_array = initializeRoles();

function saveRoles() {
    localStorage.setItem('roles_array', JSON.stringify(roles_array));
}
function saveEmployees(){
    localStorage.setItem('employee_array',JSON.stringify(employee_array));
}
function cancelAction(event: Event) {
    event.preventDefault();
    window.location.href = "role.html";
}