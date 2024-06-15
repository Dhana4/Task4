export interface EmployeeEntry{
    profilePic:string,
    empNo: string,
    name: string,
    DOB:Date,
    email: string,
    location: string,
    department: string,
    role: string,
    status: string,
    mobile:number,
    joiningDate: Date,
    manager:string,
    project:string
}
export interface RoleEntry{
    id:string,
    roleName:string,
    department:string,
    location:string,
    status:string 
    description:string;
    assignedEmployees:string[]
}

