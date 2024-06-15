"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const initializeSelectPicker = () => {
        $('select').selectpicker();
    };
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = "module";
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };
    const employeeSection = document.getElementById('employee');
    const roleSection = document.getElementById('role');
    if (employeeSection && roleSection) {
        employeeSection.addEventListener('click', () => {
            fetch('Employees.html')
                .then(response => response.text())
                .then(html => {
                const fetchedData = document.querySelector('.fetchedData');
                if (fetchedData) {
                    fetchedData.innerHTML = html;
                    return loadScript('Employees.js');
                }
            })
                .then(() => {
                initializeSelectPicker();
            })
                .catch(error => {
                console.error('Error loading Employees:', error);
            });
        });
        roleSection.addEventListener('click', () => {
            fetch('role.html')
                .then(response => response.text())
                .then(html => {
                const fetchedData = document.querySelector('.fetchedData');
                if (fetchedData) {
                    fetchedData.innerHTML = html;
                    return loadScript('role.js');
                }
            })
                .then(() => {
                initializeSelectPicker();
            })
                .catch(error => {
                console.error('Error loading role:', error);
            });
        });
    }
});
