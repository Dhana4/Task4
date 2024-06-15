import {EmployeeEntry} from './EmployeeentryModule/employeeEntry.js';
import { getFiltersActive, updateSelectAllCheckbox , filterRows, applyFilters , buildTable}  from './EmployeeentryModule/functions.js';
declare const $: any;
let filtersActive = getFiltersActive();
let activeLetter : String|null = null;
let exportInProgress = false;
document.addEventListener('DOMContentLoaded', function(){
    console.log("Hello");
    const employeeArrayAsString = (localStorage.getItem('employee_array'));
    let employee_array: EmployeeEntry[] = [];
    if(employeeArrayAsString){
        employee_array = JSON.parse(employeeArrayAsString) as EmployeeEntry[];
    }
    console.log(employee_array);
    buildTable(employee_array);

    const alphabetBtns: NodeListOf<HTMLDivElement>= document.querySelectorAll('#alphabets-bt div') ;
    alphabetBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const letter = this.textContent!;
            filterRowsByLetter(letter,employee_array,btn);
            filtersActive = getFiltersActive();
        });
    });

    document.getElementById('apply-btn')!.addEventListener('click', function () {
        filterRows(employee_array);
        filtersActive = getFiltersActive();
    });
    document.getElementById('reset')!.addEventListener('click', function () {
        resetFilters(employee_array);
        filtersActive = getFiltersActive();
    });
    const selectDropDowns: NodeListOf<HTMLSelectElement> = document.querySelectorAll('#status, #location, #department')
    selectDropDowns.forEach(function (select) {
        select.addEventListener('change', function () {
            const anyOptionSelected = Array.from(select.selectedOptions).some(function (option) {
                return option.value !== '';
            });
            if (anyOptionSelected) {
                document.getElementById('apply-btn')!.style.display = 'block';
                document.getElementById('reset')!.style.display = 'block';
            } else {
                document.getElementById('apply-btn')!.style.display = 'none';
                document.getElementById('reset')!.style.display = 'none';
            }
        });
    });
    const deleteButton = document.getElementById('delete-bt')!;
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('#employee_table input[type="checkbox"]');
    document.getElementById('select-all')!.addEventListener('change', function () {
        const userCheckBox=document.getElementById("select-all") as HTMLInputElement;
        const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('#employee_table input[type="checkbox"]');
        if(userCheckBox.checked)
        {
            checkboxes.forEach(function (checkbox) {
            checkbox.checked=true;
            });
            deleteButton.style.backgroundColor='red';
            deleteButton.style.color='white';
        }
        else
        {
            checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
            });
            deleteButton.style.backgroundColor = '';
            deleteButton.style.color = '';
        }
    });
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateSelectAllCheckbox();
            const anyChecked = Array.from(checkboxes).some(function (checkbox) {
                return checkbox.checked;
            });
            if (anyChecked) {
                deleteButton.style.backgroundColor='red';
                deleteButton.style.color='white';
            } else {
                deleteButton.style.backgroundColor = ''; 
                deleteButton.style.color = ''; 
            }
        });
    });
    document.getElementById('delete-bt')!.addEventListener('click', function () {
        const table = document.getElementById('employee_table') as HTMLTableElement;
        const rows = table?.rows;
        let employeesToDelete:EmployeeEntry[] = [];
        for (let i = 0; i < rows.length; i++) { 
            const checkbox = rows[i].cells[0].querySelector('input[type="checkbox"]') as HTMLInputElement;
            if (checkbox.checked) {
                const empNo = checkbox.getAttribute('data-empNo');
                const employeeToDelete:EmployeeEntry = employee_array.find(employee => employee.empNo === empNo)!;
                if (employeeToDelete) {
                    employeesToDelete.push(employeeToDelete);
                }
            }
        }
        if (employeesToDelete.length > 0 && confirm("Are you sure to delete the selected employees?")) {
            employee_array = employee_array.filter(employee => !employeesToDelete.includes(employee));
            
            localStorage.setItem("employee_array", JSON.stringify(employee_array));
            if (filtersActive) {
                filterRows(employee_array); 
                filtersActive = getFiltersActive();
            } else {
                buildTable(employee_array);
            }
            const selectAllCheckbox = document.getElementById('select-all') as HTMLInputElement;
            selectAllCheckbox.checked = false;
            deleteButton.style.backgroundColor = '';
            deleteButton.style.color = '';
        } 
    });
    document.getElementById('export-but')!.addEventListener('click', function(){
        if(filtersActive==true){
            const filteredEmployees = applyFilters(employee_array);
            exportToExcel(filteredEmployees);
        }
        else{
            exportToExcel(employee_array);
        }
    });

    let UserNamesortOrder = 'asc'; 
    document.querySelector('#sort-username-btn')!.addEventListener('click', function () {
        sortTableRowsByUserName(UserNamesortOrder,employee_array);
        UserNamesortOrder = (UserNamesortOrder === 'asc') ? 'desc' : 'asc';
    });
    let locationSortOrder = 'asc'; 
    document.getElementById('sort-location-btn')!.addEventListener('click', function () {
        sortTableRowsByLocation(locationSortOrder,employee_array);
        locationSortOrder = (locationSortOrder === 'asc') ? 'desc' : 'asc';
    });

    let departmentSortOrder = 'asc'; 
    document.getElementById('sort-department-btn')!.addEventListener('click', function () {
        sortTableRowsByDepartment(departmentSortOrder,employee_array);
        departmentSortOrder = (departmentSortOrder === 'asc') ? 'desc' : 'asc';
    });

    let roleSortOrder = 'asc'; 
    document.getElementById('sort-role-btn')!.addEventListener('click', function () {
        sortTableRowsByRole(roleSortOrder,employee_array);
        roleSortOrder = (roleSortOrder === 'asc') ? 'desc' : 'asc';
    });

    let empNoSortOrder = 'asc'; 
    document.getElementById('sort-empNo-btn')!.addEventListener('click', function () {
        sortTableRowsByEmpNo(empNoSortOrder,employee_array);
        empNoSortOrder = (empNoSortOrder === 'asc') ? 'desc' : 'asc';
    });

    let joiningDateSortOrder = 'asc';
    document.getElementById('sort-joiningdate-btn')!.addEventListener('click', function () {
        sortTableRowsByJoiningDate(joiningDateSortOrder,employee_array);
        joiningDateSortOrder = (joiningDateSortOrder === 'asc') ? 'desc' : 'asc';
    });
})

function exportToExcel(employee_array:EmployeeEntry[]) {
    if (exportInProgress) {
        return;
    }
    exportInProgress = true;
    let visibleRows = [];
    const headings = 'Name,Date of birth,Email,Mobile,Location,Department,Role,Emp No,Status,Joining Date,Manager,Project';

    visibleRows.push(headings);

    employee_array.forEach(function(employee) {
        const rowData = [
            employee.name,
            employee.DOB,
            employee.email,
            employee.mobile,
            employee.location,
            employee.department,
            employee.role,
            employee.empNo,
            employee.status,
            employee.joiningDate,
            employee.manager,
            employee.project
        ];
        visibleRows.push(rowData.join(','));
    });
    const data = visibleRows.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute('download', 'employee_data.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    exportInProgress = false;
}

function resetFilters(employee_array :EmployeeEntry[]){
    const multiSelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.selectpicker'); 
    multiSelects.forEach(select => {
        //select.selectedIndex = -1;
        $(select).val([]);
        $(select).selectpicker('refresh');
        //select.dispatchEvent(new Event('change'));
    });
    const userCheckBox=document.getElementById("select-all") as HTMLInputElement;
    userCheckBox.checked = false;
    filterRows(employee_array);
    filtersActive = getFiltersActive();
}
function filterRowsByLetter(letter:string,employee_array:EmployeeEntry[],btn:HTMLDivElement){
    if(activeLetter===letter){
        activeLetter = null;
        btn.classList.remove('active-letter');
        document.getElementById('alphabets-img')!.classList.remove('active-filter');
        const userCheckBox=document.getElementById("select-all") as HTMLInputElement;
        userCheckBox.checked = false;
        filterRows(employee_array);
        filtersActive = getFiltersActive();
    }
    else{
        activeLetter = letter;
        document.querySelectorAll('#alphabets-bt div').forEach(function (button) {
            button.classList.remove('active-letter');
        });
        btn.classList.add('active-letter');
        document.getElementById('alphabets-img')!.classList.add('active-filter');
        filterRows(employee_array);
        filtersActive = getFiltersActive();
    }
}

function sortTableRowsByUserName(order:string,employee_array:EmployeeEntry[]) {
    const sortedArray = employee_array.slice();
    sortedArray.sort(function (a, b) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (order === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });
    filterRows(sortedArray);
}

function sortTableRowsByLocation(order:string,employee_array:EmployeeEntry[]) {
    const sortedArray = employee_array.slice();
    sortedArray.sort(function (a, b) {
        const locationA = a.location.toLowerCase();
        const locationB = b.location.toLowerCase();
        if (order === 'asc') {
            return locationA.localeCompare(locationB);
        } else {
            return locationB.localeCompare(locationA);
        }
    });
    filterRows(sortedArray);
}

function sortTableRowsByDepartment(order:string,employee_array:EmployeeEntry[]) {
    const sortedArray = employee_array.slice();
    sortedArray.sort(function (a, b) {
        const deptA = a.department.toLowerCase();
        const deptB = b.department.toLowerCase();
        if (order === 'asc') {
            return deptA.localeCompare(deptB);
        } else {
            return deptB.localeCompare(deptA);
        }
    });
    filterRows(sortedArray);
}

function sortTableRowsByRole(order:string,employee_array:EmployeeEntry[]) {
    const sortedArray = employee_array.slice();
    sortedArray.sort(function (a, b) {
        const roleA = a.role.toLowerCase();
        const roleB = b.role.toLowerCase();
        if (order === 'asc') {
            return roleA.localeCompare(roleB);
        } else {
            return roleB.localeCompare(roleA);
        }
    });
    filterRows(sortedArray);
}

function sortTableRowsByEmpNo(order:string,employee_array:EmployeeEntry[]) {
    const sortedArray = employee_array.slice();
    sortedArray.sort(function (a, b) {
        const empNoA = a.empNo.toLowerCase();
        const empNoB = b.empNo.toLowerCase();
        if (order === 'asc') {
            return empNoA.localeCompare(empNoB);
        } else {
            return empNoB.localeCompare(empNoA);
        }
    });
    filterRows(sortedArray);
}

function sortTableRowsByJoiningDate(order:string,employee_array:EmployeeEntry[]) {
    const sortedArray = employee_array.slice();
    sortedArray.sort(function (a, b) {
        const dateA = new Date(a.joiningDate);
        const dateB = new Date(b.joiningDate);
        if (order === 'asc') {
            return dateA.getTime()-dateB.getTime();
        } else {
            return dateB.getTime()-dateA.getTime();
        }
    });
    filterRows(sortedArray);
}

