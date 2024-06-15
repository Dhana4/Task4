document.addEventListener('DOMContentLoaded', () => {
    const initializeSelectPicker = () => {
        $('select').selectpicker();
    };
    const loadScript = (src:string) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = "module";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };
    const employeeSection = document.getElementById('employee') as HTMLDivElement;
    const roleSection = document.getElementById('role') as HTMLDivElement;
    if (employeeSection && roleSection) {
        employeeSection.addEventListener('click', () => {
            fetch('Employees.html')
            .then(response => response.text())
            .then(html => {
                const fetchedData = document.querySelector('.fetchedData') as HTMLDivElement;
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
                const fetchedData = document.querySelector('.fetchedData') as HTMLDivElement;
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