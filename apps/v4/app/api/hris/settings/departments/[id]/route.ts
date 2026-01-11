import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const client = await pool.connect();

    try {
      const query = `
        SELECT 
          d.*,
          u.first_name as manager_first_name,
          u.last_name as manager_last_name,
          parent.name as parent_department_name,
          COUNT(DISTINCT e.id) as employee_count,
          COUNT(DISTINCT p.id) as position_count
        FROM departments d
        LEFT JOIN users u ON d.manager_id = u.id
        LEFT JOIN departments parent ON d.parent_department_id = parent.id
        LEFT JOIN employees e ON e.department_id = d.id
        LEFT JOIN positions p ON p.department_id = d.id
        WHERE d.id = $1
        GROUP BY d.id, u.first_name, u.last_name, parent.name
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        );
      }

      const row = result.rows[0];
      const department = {
        id: row.id,
        name: row.name,
        code: row.code,
        description: row.description,
        parent_department_id: row.parent_department_id,
        parent_department_name: row.parent_department_name,
        manager_id: row.manager_id,
        manager: row.manager_id
          ? {
              first_name: row.manager_first_name,
              last_name: row.manager_last_name,
            }
          : null,
        budget: parseFloat(row.budget || 0),
        employee_count: parseInt(row.employee_count || 0),
        position_count: parseInt(row.position_count || 0),
        created_at: row.created_at,
        updated_at: row.updated_at,
      };

      return NextResponse.json(department);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { name, code, description, parent_department_id, manager_id, budget } = body;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE departments 
         SET name = COALESCE($1, name),
             code = COALESCE($2, code),
             description = COALESCE($3, description),
             parent_department_id = COALESCE($4, parent_department_id),
             manager_id = COALESCE($5, manager_id),
             budget = COALESCE($6, budget),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [name, code, description, parent_department_id, manager_id, budget, id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        message: "Department updated successfully",
        department: result.rows[0],
      });
    } catch (error: any) {
      await client.query("ROLLBACK");
      
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Department code already exists" },
          { status: 400 }
        );
      }
      
      if (error.code === "23503") {
        return NextResponse.json(
          { error: "Invalid parent department or manager" },
          { status: 400 }
        );
      }
      
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Check if department has employees
      const employeeCheck = await client.query(
        "SELECT COUNT(*) as count FROM employees WHERE department_id = $1",
        [id]
      );

      if (parseInt(employeeCheck.rows[0].count) > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Cannot delete department with employees" },
          { status: 400 }
        );
      }

      // Check if department has sub-departments
      const subDeptCheck = await client.query(
        "SELECT COUNT(*) as count FROM departments WHERE parent_department_id = $1",
        [id]
      );

      if (parseInt(subDeptCheck.rows[0].count) > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Cannot delete department with sub-departments" },
          { status: 400 }
        );
      }

      // Check if department has positions
      const positionCheck = await client.query(
        "SELECT COUNT(*) as count FROM positions WHERE department_id = $1",
        [id]
      );

      if (parseInt(positionCheck.rows[0].count) > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Cannot delete department with positions" },
          { status: 400 }
        );
      }

      const result = await client.query(
        "DELETE FROM departments WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        message: "Department deleted successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
