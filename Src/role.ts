import {RoleEntry} from './EmployeeentryModule/employeeEntry.js';
import {EmployeeEntry} from './EmployeeentryModule/employeeEntry.js';
let filtersActive = false;
let roles_array: RoleEntry[] = [];
let employee_array:EmployeeEntry[] = [];
declare const $:any;
document.addEventListener('DOMContentLoaded', function () {
    const rolesAsString = (localStorage.getItem('roles_array'));
    if(rolesAsString){
        roles_array = JSON.parse(rolesAsString) as RoleEntry[];
    }
    let employeeArrayAsString = localStorage.getItem('employee_array');
    if(employeeArrayAsString){
        employee_array = JSON.parse(employeeArrayAsString);
    }
    buildRole(roles_array);
    const selectDropDowns: NodeListOf<HTMLSelectElement> = document.querySelectorAll("#status , #location , #department");
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
    const apply_btn = document.getElementById("apply-btn") as HTMLButtonElement;
    apply_btn.addEventListener('click',function(){
        filterRows(roles_array);
    });
    const reset_btn = document.getElementById("reset") as HTMLButtonElement;
    reset_btn.addEventListener('click',function(){
        resetFilters(roles_array);
    });
    const viewAllEmp: NodeListOf<HTMLDivElement> = document.querySelectorAll('.view-all-emp');
    viewAllEmp.forEach(function(btn){
        btn.addEventListener('click',function(){
            let selectedRoleId = btn.getAttribute('selectedRoleId')!;
            const selectedRole = roles_array.find(role => role.id === selectedRoleId)!;
            const roleName =selectedRole.roleName;
            const location = selectedRole.location;
            const department = selectedRole.department;
            const urlParams = new URLSearchParams({
                roleName: roleName,
                location: location,
                department: department
            });
            window.location.href = "role-details.html?" + urlParams.toString();
        });
    })
});
function resetFilters(roles_array :RoleEntry[]){
    const multiSelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.selectpicker'); 
    multiSelects.forEach(select => {
        //select.selectedIndex = -1;
        $(select).val([]);
        $(select).selectpicker('refresh');
        //select.dispatchEvent(new Event('change'));
    });
    filterRows(roles_array);
}
function filterRows(employee_array:RoleEntry[]){
    const filteredEmployees = applyFilters(employee_array);
    if (filteredEmployees.length === 0) {
        document.querySelector('.allRoles')!.innerHTML = 'No employee found';
    }
    else{
        buildRole(filteredEmployees);
    }
}
function applyFilters(role_array:RoleEntry[]){
    const selectedStatusOptions = (document.getElementById("status") as HTMLSelectElement).selectedOptions;
    const selectedStatus = Array.from(selectedStatusOptions).map(option => option.value);

    const selectedLocationOptions = (document.getElementById('location') as HTMLSelectElement).selectedOptions;
    const selectedLocation = Array.from(selectedLocationOptions).map(option => option.value);

    const selectedDepartmentOptions = (document.getElementById('department') as HTMLSelectElement).selectedOptions;
    const selectedDepartment = Array.from(selectedDepartmentOptions).map(option => option.value);
    const filteredEmployees = role_array.filter(employee => {
        const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(employee.status);
        const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(employee.location);
        const matchesDepartment = selectedDepartment.length === 0 || selectedDepartment.includes(employee.department);
        return matchesStatus && matchesLocation && matchesDepartment;
    });
    filtersActive = selectedStatusOptions.length>0 || selectedLocation.length > 0 || 
                    selectedDepartment.length > 0; 

    return filteredEmployees;
}
function buildRole(roles_array: RoleEntry[]){
    const parent_container=document.querySelector('.allRoles') as HTMLDivElement;
    parent_container.innerHTML = "";
    parent_container.classList.add("allRoles");
    roles_array.forEach(function(role){
        const roleBoxDiv=document.createElement('div');
        roleBoxDiv.classList.add('roleBox');
        const roleNameEditImgSection=document.createElement('section');
        roleNameEditImgSection.classList.add('roleNameEditImg');
        const roleNameHeadDiv=document.createElement('div');
        roleNameHeadDiv.classList.add('roleNameHead');
        roleNameHeadDiv.textContent=role.roleName;
        roleNameEditImgSection.appendChild(roleNameHeadDiv);
        const editImagediv=document.createElement("div");
        editImagediv.classList.add('edit-img');
        const editImage=document.createElement('img');
        editImage.src='/Employee-images/Vertical Navbar/edit.svg';
        editImage.style.width="100%";
        editImage.style.height="100%";
        editImage.onclick = function (event) {
            editRole(event, role.id,roles_array);
        };
        editImagediv.appendChild(editImage);
        roleNameEditImgSection.appendChild(editImagediv);
        roleBoxDiv.appendChild(roleNameEditImgSection);

        const departmentSection = document.createElement('section');
        departmentSection.classList.add('roleDepartment');
        const departmentImgDiv = document.createElement('div');
        departmentImgDiv.style.width = '10%';
        const departmentImg = document.createElement('img');
        departmentImg.src = '/Employee-images/team_svgrepo.com.svg';
        departmentImg.style.width = '70%';
        departmentImg.style.height = '70%';
        departmentImgDiv.appendChild(departmentImg);
        const departmentTextDiv = document.createElement('div');
        departmentTextDiv.classList.add('department-text');
        departmentTextDiv.textContent = 'Department';
        const departmentNameDiv = document.createElement('div');
        departmentNameDiv.classList.add('departmentNameText');
        departmentNameDiv.textContent = role.department;
        departmentSection.appendChild(departmentImgDiv);
        departmentSection.appendChild(departmentTextDiv);
        departmentSection.appendChild(departmentNameDiv);
        roleBoxDiv.appendChild(departmentSection);

        const locationSection=document.createElement('section');
        locationSection.classList.add("roleLocation");
        const locationImgDiv=document.createElement('div');
        locationImgDiv.style.width="10%";
        const locationImg=document.createElement('img');
        locationImg.src='/Employee-images/location-pin-alt-1_svgrepo.com.svg';
        locationImg.style.width='70%';
        locationImg.style.height='70%';
        locationImgDiv.appendChild(locationImg);
        const locationTextDiv=document.createElement('div');
        locationTextDiv.classList.add('location-text');
        locationTextDiv.textContent='location';
        const locationNameDiv=document.createElement('div');
        locationNameDiv.classList.add('locationNameText');
        locationNameDiv.textContent=role.location;
        locationSection.appendChild(locationImgDiv);
        locationSection.appendChild(locationTextDiv);
        locationSection.appendChild(locationNameDiv);
        roleBoxDiv.appendChild(locationSection);

        const totalEmpSection=document.createElement('section');
        totalEmpSection.classList.add('total-emp');
        const totalEmpMat=document.createElement('div');
        totalEmpMat.classList.add('total-emp-mat');
        totalEmpMat.textContent='Total Employees';
        const totalEmpImgDiv=document.createElement('div');
        totalEmpImgDiv.classList.add('total-emp-img');
        const imageContainerDiv=document.createElement('div');
        imageContainerDiv.classList.add("image-container");
        console.log(role.assignedEmployees);
        const employees = role.assignedEmployees.map(empNo => {
            return employee_array.find(employee => employee.empNo === empNo);
        }).filter(Boolean); 
        employees.slice(0, 4).forEach(employee => { 
            const img = document.createElement('img');
            img.src = employee?.profilePic!;
            img.alt = 'Employee Image';
            imageContainerDiv.appendChild(img);
        });
        if (employees.length > 4) {
            const plusEmp = document.createElement('div');
            plusEmp.textContent = `+${employees.length - 4}`;
            plusEmp.classList.add('plus-text');
            imageContainerDiv.appendChild(plusEmp);
        }
        totalEmpImgDiv.appendChild(imageContainerDiv);
        totalEmpSection.appendChild(totalEmpMat);
        totalEmpSection.appendChild(totalEmpImgDiv);
        roleBoxDiv.appendChild(totalEmpSection);
        const viewAllEmpSection=document.createElement('section');
        viewAllEmpSection.classList.add('view-all-emp');
        const viewAllEmpMat=document.createElement('span');
        viewAllEmpMat.classList.add('view-all-emp-mat');
        viewAllEmpMat.textContent='view all employees';
        const viewAllEmpImg=document.createElement('img');
        viewAllEmpImg.src='/Employee-images/Vector.svg';
        viewAllEmpImg.style.width="6%";
        viewAllEmpImg.style.height="6%";
        viewAllEmpSection.appendChild(viewAllEmpMat);
        viewAllEmpSection.appendChild(viewAllEmpImg);
        viewAllEmpSection.setAttribute('selectedRoleId', role.id);
        roleBoxDiv.appendChild(viewAllEmpSection);
        parent_container.appendChild(roleBoxDiv);
    });
}
function editRole(event : Event,roleId: string,roles_array: RoleEntry[]){
    const roleToBeEdited = roles_array.find(entry => entry.id === roleId)!;
    const selectedRow=[
        roleToBeEdited.id,
        roleToBeEdited.roleName,
        roleToBeEdited.department,
        roleToBeEdited.location,
        roleToBeEdited.description,
        roleToBeEdited.assignedEmployees
    ];
    localStorage.setItem('selectedRole',JSON.stringify(selectedRow));
    window.location.href="newRole.html";
    event.preventDefault();
}
