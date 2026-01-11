"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { ArrowLeft, Users, Building2, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Employee {
  id: number;
  employee_number: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  department?: {
    id: number;
    name: string;
  };
  position?: {
    id: number;
    title: string;
  };
  manager_id?: number;
  manager?: {
    first_name: string;
    last_name: string;
  };
  employment_status: string;
  subordinates?: Employee[];
}

export default function OrgChartPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgTree, setOrgTree] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hris/employees");
      const data = await response.json();
      const employeeList = data.employees || data || [];
      
      // Build organization tree
      const tree = buildOrgTree(employeeList);
      setEmployees(employeeList);
      setOrgTree(tree);
    } catch (error) {
      toast.error("Failed to load employees");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buildOrgTree = (employees: Employee[]): Employee[] => {
    // Create a map for quick lookup
    const employeeMap = new Map<number, Employee>();
    employees.forEach((emp) => {
      employeeMap.set(emp.id, { ...emp, subordinates: [] });
    });

    // Build tree structure
    const roots: Employee[] = [];
    employeeMap.forEach((emp) => {
      if (emp.manager_id) {
        const manager = employeeMap.get(emp.manager_id);
        if (manager) {
          manager.subordinates = manager.subordinates || [];
          manager.subordinates.push(emp);
        } else {
          // Manager not found, treat as root
          roots.push(emp);
        }
      } else {
        // No manager, this is a root employee
        roots.push(emp);
      }
    });

    return roots;
  };

  const renderEmployee = (employee: Employee, level: number = 0) => {
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    const indentClass = level > 0 ? `ml-${Math.min(level * 8, 24)}` : "";
    const firstName = employee.user?.first_name || "Unknown";
    const lastName = employee.user?.last_name || "";
    const email = employee.user?.email || "No email";
    const positionTitle = employee.position?.title || "No Position";
    const departmentName = employee.department?.name || "No Department";
    const status = employee.employment_status || "Unknown";

    return (
      <div key={employee.id} className="mb-4">
        <Card className={`${indentClass} transition-all hover:shadow-md`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">
                    {firstName} {lastName}
                  </h3>
                  <Badge
                    className={
                      status === "Active"
                        ? "bg-green-500"
                        : status === "On Leave"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }
                  >
                    {status}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{positionTitle}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{departmentName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {employee.employee_number} • {email}
                    </span>
                  </div>
                  
                  {employee.manager && (
                    <div className="text-xs mt-2">
                      Reports to: <span className="font-medium">{employee.manager.first_name} {employee.manager.last_name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {hasSubordinates && (
                <div className="ml-4">
                  <Badge variant="outline" className="bg-blue-50">
                    {employee.subordinates!.length} {employee.subordinates!.length === 1 ? "Report" : "Reports"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Render subordinates */}
        {hasSubordinates && (
          <div className="mt-2 pl-8 border-l-2 border-muted">
            {employee.subordinates!.map((subordinate) =>
              renderEmployee(subordinate, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Calculate statistics
  const activeEmployees = employees.filter((e) => e.employment_status === "Active").length;
  const totalDepartments = new Set(employees.map((e) => e.department?.name).filter(Boolean)).size;
  const totalPositions = new Set(employees.map((e) => e.position?.title).filter(Boolean)).size;
  const managersCount = employees.filter((e) => 
    employees.some((emp) => emp.manager_id === e.id)
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/erp/hris/employees")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Organization Chart</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Visual hierarchy of all employees and reporting structure
          </p>
        </div>
        <Button onClick={() => router.push("/erp/hris/employees")}>
          Back to Employees
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managersCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Organizational Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading organization chart...</div>
          ) : orgTree.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No employees found
            </div>
          ) : (
            <div className="space-y-4">
              {orgTree.map((employee) => renderEmployee(employee, 0))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
