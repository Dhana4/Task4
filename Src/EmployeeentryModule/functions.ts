import { EmployeeEntry } from "./employeeEntry";
let filtersActiveVar:boolean = false;
export function displayErrorMessage(inputElement: HTMLInputElement, message: string) {
    const parentDiv = inputElement.parentElement;
    let errorMessage = parentDiv!.querySelector('.error-message');
    if(!errorMessage){
        errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        parentDiv!.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
}
export function clearErrorMessage(event: Event) {
    const inputElement: HTMLInputElement = (event.target) as HTMLInputElement;
    const parentDiv = inputElement.parentElement;
    const errorMessage = parentDiv!.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}
export function attachCheckboxEventListener() {
    const deleteButton = document.getElementById('delete-bt')!;
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('#employee_table input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const anyChecked = Array.from(checkboxes).some(function (checkbox) {
                return checkbox.checked;
            });
            if (anyChecked) {
                deleteButton.style.backgroundColor = 'red';
                deleteButton.style.color = 'white';
            } else {
                deleteButton.style.backgroundColor = ''; 
                deleteButton.style.color = ''; 
            }
        });
    });
}
export function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all') as HTMLInputElement;
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('#employee_table input[type="checkbox"]');
    
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!this.checked) {
                selectAllCheckbox.checked = false;
            } else {
                let allChecked = true;
                checkboxes.forEach(function (cb) {
                    if (!cb.checked) {
                        allChecked = false;
                    }
                });
                selectAllCheckbox.checked = allChecked;
            }
        });
    });
}
export function filterRows(employee_array:EmployeeEntry[]){
    const filteredEmployees = applyFilters(employee_array);
    if (filteredEmployees.length === 0) {
        document.getElementById('employee_table')!.innerHTML = '<tr><td colspan="9">No employee found</td></tr>';
    }
    else{
        buildTable(filteredEmployees);
    }
}
export function applyFilters(employee_array:EmployeeEntry[]){
    const selectedStatusOptions = (document.getElementById("status") as HTMLSelectElement).selectedOptions;
    const selectedStatus = Array.from(selectedStatusOptions).map(option => option.value);

    const selectedLocationOptions = (document.getElementById('location') as HTMLSelectElement).selectedOptions;
    const selectedLocation = Array.from(selectedLocationOptions).map(option => option.value);

    const selectedDepartmentOptions = (document.getElementById('department') as HTMLSelectElement).selectedOptions;
    const selectedDepartment = Array.from(selectedDepartmentOptions).map(option => option.value);

    const letter = document.querySelector('#alphabets-bt .active-letter');
    const filteredEmployees = employee_array.filter(employee => {
        const name = employee.name.toUpperCase();
        let startsWithLetter : boolean = false;
        startsWithLetter = !letter ||  name.startsWith(letter.textContent!);
        const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(employee.status);
        const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(employee.location);
        const matchesDepartment = selectedDepartment.length === 0 || selectedDepartment.includes(employee.department);
        return startsWithLetter && matchesStatus && matchesLocation && matchesDepartment;
    });
    let filtersActiveVar = letter !== null || 
                selectedStatus.length > 0 || 
                selectedLocation.length > 0 || 
                selectedDepartment.length > 0; 
    setFiltersActive(filtersActiveVar);
    return filteredEmployees;
}
export function getFiltersActive() {
    return filtersActiveVar;
}
export function setFiltersActive(value:boolean) {
    filtersActiveVar = value;
  }
export function buildTable(employee_array:EmployeeEntry[]){
    const table = document.getElementById("employee_table") as HTMLTableSectionElement;
    table.innerHTML = ''; 
    employee_array.forEach(function (employee) {
        const row = table.insertRow();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-empNo', employee.empNo);
        row.insertCell(0).appendChild(checkbox);
        const profileCell = row.insertCell(1);
        profileCell.style.display = 'flex'; 
        profileCell.style.alignItems = 'center'; 
        profileCell.innerHTML = `
            <div>
                <img src="${employee.profilePic}" alt="Profile Pic" style="width: 40px; height: auto;border-radius: 50%;">
            </div>
            <div style="margin-left: 10px;">
                <p style="padding:0;margin:0">${employee.name}</p>
                <p style="padding:0;margin:0">${employee.email}</p>
            </div>
        `;
        row.insertCell(2).innerHTML = employee.location;
        row.insertCell(3).innerHTML = employee.department;
        row.insertCell(4).innerHTML = employee.role;
        row.insertCell(5).innerHTML = employee.empNo;
        const button = document.createElement('button')
        button.innerHTML = "Active";
        button.classList.add("active");
        row.insertCell(6).appendChild(button);
        row.insertCell(7).innerHTML = employee.joiningDate.toString();
        const img = document.createElement('img');
        img.src = '/Employee-images/dots.png'; 
        img.alt = 'employee options';
        img.classList.add('ellipsis-icon');  
        img.onclick = function (event) {
            showOptions(event, employee.empNo);
        };
        row.insertCell(8).appendChild(img);
    })
    updateSelectAllCheckbox();
    attachCheckboxEventListener();
}
export function showOptions(event: Event,empNo:string) {
    const targetRow = ((event.target) as HTMLImageElement) .closest('tr')!;
    const storedArray = localStorage.getItem('employee_array');
    let employeeArray: EmployeeEntry[] = [];
    if(storedArray){
        employeeArray = JSON.parse(storedArray);
    }
    const employee = employeeArray.find(entry => entry.empNo === empNo);
    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.innerHTML = `
        <ul>
            <li><a href="#" class="view-details">View Details</a></li>
            <li><a href="#" class="edit">Edit</a></li>
            <li><a href="#" class="delete">Delete</a></li>
        </ul>
    `;
    targetRow.appendChild(dropdownMenu);
    dropdownMenu.classList.add('show');

    const boundingRect = ((event.target) as HTMLImageElement) .getBoundingClientRect();
    dropdownMenu.style.top = boundingRect.bottom + 'px';
    dropdownMenu.style.left = boundingRect.right + 'px';

    document.addEventListener('click', function (event) {
        if (!((event.target) as HTMLImageElement).matches('.ellipsis-icon')) {
            dropdownMenu.classList.remove('show');
        }
    });

    dropdownMenu.querySelector('.view-details')!.addEventListener('click', function (event) {
        event.preventDefault();
        const name = employee!.name;
        const email = employee!.email;
        const dob=employee!.DOB;
        const location = employee!.location;
        const department = employee!.department;
        const role = employee!.role;
        const empNo = employee!.empNo;
        const joiningDate = employee!.joiningDate;
        const mobile=employee!.mobile;
        const status=employee!.status;
        const manager=employee!.manager;
        const project=employee!.project;

        const detailsText = `
        <html>
        <head>
            <title>Employee Details</title>
        </head>
        <body>
            <h1>Employee Details</h1>
            <p>Employee Number: ${empNo}</p>
            <p>Name: ${name}</p>
            <p>Date of Birth: ${dob}</p>
            <p>Email: ${email}</p>
            <p>Location: ${location}</p>
            <p>Department: ${department}</p>
            <p>Role: ${role}</p>
            <p>Joining Date: ${joiningDate}</p>
            <p> Status: ${status}</p>
            <p>Mobile: ${mobile}</p>
            <p>Manager: ${manager}</p>
            <p>Project: ${project}</P>
        </body>
        </html>
        `;
        const newWindow = window.open();
        newWindow?.document.write(detailsText);
    });  
    dropdownMenu.querySelector('.edit')!.addEventListener('click', function (event) {
        const rowData = [
            employee!.name,
            employee!.email,
            employee!.location,
            employee!.department,
            employee!.role,
            employee!.empNo,
            employee!.status,
            employee!.joiningDate,
            employee!.mobile,
            employee!.profilePic,
            employee!.DOB,
            employee!.manager,
            employee!.project
        ];
        localStorage.setItem('selectedEmployeeDetails', JSON.stringify(rowData)); 
        window.location.href = "addEmployee.html"; 
        event.preventDefault();
    });

    dropdownMenu.querySelector('.delete')!.addEventListener('click', function (event) {
        employeeArray=employeeArray.filter(employee => employee.empNo!==empNo)
        localStorage.setItem('employee_array', JSON.stringify(employeeArray));
        targetRow.remove();
        event.preventDefault();
    });
}