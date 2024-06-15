import {EmployeeEntry} from './EmployeeentryModule/employeeEntry';
import { buildTable } from './EmployeeentryModule/functions.js';
let IsSideBarOpen = true;
let statusTopbar=false;
let employee_array: EmployeeEntry[] = [];
document.addEventListener('DOMContentLoaded',function(){
    const searchImgs = document.querySelectorAll('.search-imgs');
    searchImgs.forEach((image) => {
        return image.addEventListener('click',handleClick);
    })
    const handle_icon = document.getElementById("tezo-side");
    handle_icon?.addEventListener('click',SideBar);
    const collapse_up_button = document.getElementById("collapse-up-button");
    collapse_up_button?.addEventListener('click' , collapseDropdownTopbar);

    const employeeArrayAsString = localStorage.getItem('employee_array');
    if(employeeArrayAsString){
        employee_array = JSON.parse(employeeArrayAsString);
    }
    let searchText = document.getElementById('search') as HTMLInputElement;
    searchText.addEventListener('input', function (event) {
        let searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
        let suggestionsContainer = document.getElementById('suggestions') as HTMLDivElement;
        if(searchQuery.length==0){
            suggestionsContainer.style.display = 'none';
            buildTable(employee_array);
        }else{
            suggestionsContainer.style.display = 'block';
        }
        
        suggestionsContainer.innerHTML = '';
        const filteredEmployees = employee_array.filter(employee => {
            return employee.name.toLowerCase().includes(searchQuery) || employee.email.toLowerCase().includes(searchQuery);
        });
        filteredEmployees.forEach(employee => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = `${employee.name} - ${employee.email}`;
            suggestionItem.addEventListener('click', function () {
                searchText.value = `${employee.name} - ${employee.email}`;
                suggestionsContainer.style.display = 'none';
                buildTable(filteredEmployees);
            });
            suggestionsContainer.appendChild(suggestionItem);
            
        });
        
    });
})
const SideBar = () =>{
    if(IsSideBarOpen==true){
        closeSidebar();
    }
    else{
        openSidebar();
    }
    IsSideBarOpen = !IsSideBarOpen;
}
function rotateImage(){
    const handle_icon = document.getElementById("tezo-side")!;
    if(IsSideBarOpen)
        handle_icon.style.rotate = '180deg';
    else
        handle_icon.style.rotate = '0deg';
}
function closeSidebar(){
    const logo = document.getElementById("tezo-logo") as HTMLImageElement;
    const handle_icon = document.getElementById("tezo-side") as HTMLImageElement;
     handle_icon.style.margin = "70% 0 0 10%";
     const left_long_part= document.getElementById("left-long-part")!;
     const left_hidden_part=document.getElementById("left-hidden-part")!;
     logo.src = '/Employee-images/tezo_icon.jpg';
     logo.style.width="4rem";
     logo.style.height="4rem";
     logo.style.marginLeft="0";
     left_long_part.style.display="none";
     left_hidden_part.style.display="block";
    const left_content=document.getElementById("left-content")!;
    const right_content=document.getElementById("right-content")!;
    left_content.style.width="5%";
    right_content.style.width="91%";
    rotateImage();
}
function openSidebar(){
    const handle_icon = document.getElementById("tezo-side") as HTMLImageElement;
     handle_icon.style.margin = "100% 0 0 55%";
    const logo = document.getElementById("tezo-logo") as HTMLImageElement;
    logo.style.width="60%";
    logo.style.height="90%";
    logo.style.padding="11% 0 0 11%";
    logo.src = '/Employee-images/TezoLogo.png';
    const left_long_part= document.getElementById("left-long-part")!;
    const left_hidden_part=document.getElementById("left-hidden-part")!;
   
     left_long_part.style.display="block";
     left_hidden_part.style.display="none";
    const left_content=document.getElementById("left-content")!;
    const right_content=document.getElementById("right-content")!;
    left_content.style.width="20%";
    right_content.style.width="76%";
    rotateImage();     

}
function collapseDropdownTopbar() {
    const topbar_icon = document.getElementById("collapse-up-button")!;
    const topbar_menu = document.getElementById("topbar")!;
    if(statusTopbar==false){
        topbar_menu.style.display="block";
        topbar_icon.style.transform = "rotate(90deg)";
        statusTopbar=true;
    }
    else{
        topbar_menu.style.display = "none";
        topbar_icon.style.transform = "rotate(90deg)";
        statusTopbar=false;
    }
}
function handleClick(event:Event) {
    const image = event.target as HTMLImageElement;
    image.classList.add('clicked');
    setTimeout(function() {
        image.classList.remove('clicked');
    },200);
}