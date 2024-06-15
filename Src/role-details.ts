import {EmployeeEntry} from './EmployeeentryModule/employeeEntry.js';
document.addEventListener('DOMContentLoaded',function(){
    let employee_arrayAsString = localStorage.getItem('employee_array');
    let employee_array: EmployeeEntry[] = [];
    if(employee_arrayAsString){
        employee_array = JSON.parse(employee_arrayAsString);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const roleName = urlParams.get('roleName');
    const location = urlParams.get('location');
    const department = urlParams.get('department');
    const filteredEmployees = employee_array.filter(employee => {
        return employee.department == department && employee.location == location && employee.role == roleName
    })
    buildEmployees(filteredEmployees);
})
function buildEmployees(employee_array: EmployeeEntry[]) {
    const parent_container = document.querySelector('.allRoles') as HTMLDivElement;
    parent_container.innerHTML = "";
    parent_container.classList.add("allRoles");
    if(employee_array.length == 0){
        parent_container.innerHTML = '<p>No Employee Found</p>';
        return;
    }
    employee_array.forEach(employee => {
        const roleBox = document.createElement('div');
        roleBox.classList.add("roleBox");
        const roleEmployeeNamesSection = document.createElement('section');
        roleEmployeeNamesSection.classList.add('role-employee-names', 'sample');
        const profilePicDiv = document.createElement('div');
        const profilePic = document.createElement('img');
        profilePic.alt = 'admin';
        profilePic.src = employee.profilePic;
        profilePic.style.width = '80%';
        profilePic.style.height = '80%';
        profilePicDiv.appendChild(profilePic);
        const namePositionDiv = document.createElement('div');
        const name = document.createElement('div');
        name.classList.add('name');
        name.textContent = employee.name;
        const position = document.createElement('div');
        position.classList.add('position');
        position.textContent = employee.role;
        namePositionDiv.appendChild(name);
        namePositionDiv.appendChild(position);
        roleEmployeeNamesSection.appendChild(profilePicDiv);
        roleEmployeeNamesSection.appendChild(namePositionDiv);
        roleBox.appendChild(roleEmployeeNamesSection);
        const sectionsData = [
            { class: 'employeeDepartment', alt: 'vector', src: '/Employee-images/Vector (1).svg', text: employee.empNo },
            { class: 'employeeLocation', alt: 'email', src: '/Employee-images/email-1_svgrepo.com.svg', text: employee.email },
            { class: 'total-emp', alt: 'team', src: '/Employee-images/team_svgrepo.com.svg', text: employee.department },
            { class: 'total-emp', alt: 'location', src: '/Employee-images/location-pin-alt-1_svgrepo.com.svg', text: employee.location }
        ];

        sectionsData.forEach(sectionData => {
            const section = document.createElement('section');
            section.classList.add(sectionData.class, 'sample');
            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            img.alt = sectionData.alt;
            img.src = sectionData.src;
            img.style.width = '70%';
            img.style.height = '70%';
            imgDiv.appendChild(img);
            const textDiv = document.createElement('div');
            textDiv.classList.add(sectionData.class === 'employeeDepartment' ? 'number' : sectionData.class === 'employeeLocation' ? 'email' : 'branch');
            textDiv.textContent = sectionData.text;
            section.appendChild(imgDiv);
            section.appendChild(textDiv);
            roleBox.appendChild(section);
        });

        const viewAllEmpSection = document.createElement('section');
        viewAllEmpSection.classList.add('view-all-emp');
        const viewEmployeeSpan = document.createElement('span');
        viewEmployeeSpan.classList.add('view-employee');
        viewEmployeeSpan.textContent = 'View';
        const viewEmpImg = document.createElement('img');
        viewEmpImg.alt = 'vector';
        viewEmpImg.src = '/Employee-images/Vector.svg';
        viewEmpImg.style.width = '6%';
        viewEmpImg.style.height = '6%';
        viewAllEmpSection.appendChild(viewEmployeeSpan);
        viewAllEmpSection.appendChild(viewEmpImg);
        roleBox.appendChild(viewAllEmpSection);
        parent_container.appendChild(roleBox);

        viewAllEmpSection.addEventListener('click', function (event) {
            event.preventDefault();
            const detailsText = `
                <html>
                <head>
                    <title>Employee Details</title>
                </head>
                <body>
                    <h1>Employee Details</h1>
                    <p>Employee Number: ${employee.empNo}</p>
                    <p>Name: ${employee.name}</p>
                    <p>Date of Birth: ${employee.DOB}</p>
                    <p>Email: ${employee.email}</p>
                    <p>Location: ${employee.location}</p>
                    <p>Department: ${employee.department}</p>
                    <p>Role: ${employee.role}</p>
                    <p>Joining Date: ${employee.joiningDate}</p>
                    <p> Status: ${employee.status}</p>
                    <p>Mobile: ${employee.mobile}</p>
                    <p>Manager: ${employee.manager}</p>
                    <p>Project: ${employee.project}</P>
                </body>
                </html>
            `;
            const newWindow = window.open();
            newWindow?.document.write(detailsText);
        });
    });
}